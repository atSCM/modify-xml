import { parse as parseXml, NodeType, Node as ParserNode } from '@atscm/parse-xml';
import {
  Document, TextNode, Element, ContainerNode, CommentNode, CDataNode, DirectiveNode,
} from './types';

type CurrentElementDuringParse = ContainerNode & { parent?: ContainerNode };

type ParsingIssue = Error
function renderParserNode(node: ParserNode) {
  return node.tokens.map(t => t.content).join('');
}

export default function parse(xml: string, { onWarn }: {
  onWarn?: (warning: ParsingIssue) => void;
} = {}) {
  const document: Document = {
    type: 'document',
    childNodes: [],
  };

  let currentNode: CurrentElementDuringParse = document;

  for (const node of parseXml(xml)) {
    if (node.type === NodeType.Text) {
      currentNode.childNodes.push({
        type: 'text',
        value: node.content,
      } as TextNode);
    } else if (node.type === NodeType.CData) {
      currentNode.childNodes.push({
        type: 'cdata',
        value: node.content,
      } as CDataNode);
    } else if (node.type === NodeType.Comment) {
      currentNode.childNodes.push({
        type: 'comment',
        value: node.content,
      } as CommentNode);
    } else if (node.type === NodeType.ProcessingInstruction) {
      currentNode.childNodes.push({
        type: 'directive',
        value: node.tokens.map(t => t.content).join(''),
      } as DirectiveNode);
    } else if (node.type === NodeType.OpenTag) {
      const element: Element = {
        type: 'element',
        name: node.name,
        childNodes: [],
        attributes: node.attributes,

        // if preserveFormatting
        selfClosing: node.selfClosing,
        openTag: renderParserNode(node),
      };
      currentNode.childNodes.push(element);

      if (!node.selfClosing) {
        currentNode = Object.assign(element, { parent: currentNode });
      }
    } else if (node.type === 'close-tag') {
      const previous = currentNode as CurrentElementDuringParse & Element;
      currentNode = previous.parent;

      delete previous.parent;

      // if preserveFormatting
      previous.closeTag = renderParserNode(node);
    } else {
      throw new Error(`Unhandled node of type ${node.type}`);
    }
  }

  if (currentNode !== document) {
    throw new Error('Unexpected end of file');
  }

  return document;
}
