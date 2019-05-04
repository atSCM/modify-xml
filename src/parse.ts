import { Parser, ContextGetter, ParserContext } from 'saxen';
import {
  Document, TextNode, Element, ContainerNode, CommentNode, CDataNode, DirectiveNode,
} from './types';

type CurrentElementDuringParse = ContainerNode & { parent?: ContainerNode };

type ParsingIssue = Error & ParserContext

function refineParsingIssue(issue: Error, getContext: ContextGetter): ParsingIssue {
  // FIXME: Add code frame?

  return Object.assign(issue, getContext());
}

export default function parse(xml: string, { onWarn }: {
  onWarn?: (warning: ParsingIssue) => void;
} = {}) {
  const parser = new Parser();

  const document: Document = {
    type: 'document',
    childNodes: [],

    // if preserveFormatting
    leadingSpaces: xml.match(/^\s*/)[0],
    trailingSpaces: xml.match(/\s*$/)[0],
  };

  let currentNode: CurrentElementDuringParse = document;

  // Handle non-element nodes

  parser.on('text', (value: string) => {
    currentNode.childNodes.push({
      type: 'text',
      value,
    } as TextNode);
  });

  parser.on('cdata', (value: string, getContext: ContextGetter) => {
    currentNode.childNodes.push({
      type: 'cdata',
      value,

      // if perserveFormat
      rawValue: `${getContext().data}]>`,
    } as CDataNode);
  });

  parser.on('comment', (value: string, _decode, getContext: ContextGetter) => {
    currentNode.childNodes.push({
      type: 'comment',
      value,

      // if preserveFormat
      rawValue: `${getContext().data}->`,
    } as CommentNode);
  });

  const handleDirective = (value: string) => {
    currentNode.childNodes.push({
      type: 'directive',
      value,

      // if preserveFormat
    } as DirectiveNode);
  };

  // e.g. <!doctype ...>
  parser.on('attention', handleDirective);

  // e.g. <?xml ...>
  parser.on('question', handleDirective);

  // Handle elements

  parser.on('openTag', (name, getAttributes, _decode, selfClosing, getContext) => {
    const element: Element = {
      type: 'element',
      name,
      childNodes: [],
      attributes: getAttributes(),

      // if preserveFormatting
      selfClosing,
      openTag: getContext().data,
    };

    currentNode.childNodes.push(element);
    currentNode = Object.assign(element, { parent: currentNode });
  });

  parser.on('closeTag', (name: string, _decode, _selfClosing, getContext: ContextGetter) => {
    const previous = currentNode as CurrentElementDuringParse & Element;
    currentNode = previous.parent;

    delete previous.parent;

    // if preserveFormatting
    previous.closeTag = getContext().data;
  });

  // Error handling
  parser.on('warn', (warning: Error, getContext: ContextGetter) => {
    if (onWarn) {
      onWarn(refineParsingIssue(warning, getContext));
    }
  });

  parser.on('error', (error: Error, getContext: ContextGetter) => {
    throw refineParsingIssue(error, getContext);
  });

  // FIXME: Check all events are handled

  parser.parse(xml);

  return document;
}
