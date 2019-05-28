import { Document, TextNode, Element, Node } from './types';

type RenderLevelOptions = RenderOptions & { level: number };

export function renderTextNode(node: TextNode, { indent, level }: RenderLevelOptions) {
  if (indent === 'keep' || !node.value.match(/^\s+$/)) {
    return node.value;
  }
  return node.value.replace(/^[ \t]+/gm, indent.repeat(level));
}

const doubleQuoteRegExp = /"/;
const singleQuoteRegExp = /'/;

export function renderOpenTag(element: Element) {
  return `<${element.name}${
    Object.entries(element.attributes)
      .reduce((result, [name, value]) => {
        let quote = '"';

        if (doubleQuoteRegExp.test(value)) {
          if (singleQuoteRegExp.test(value)) {
            // eslint-disable-next-line max-len
            throw new Error(`Found single and double quotes in value of attribute '${name}': \`${value}\`. Escape values first`);
          }

          quote = "'";
        }
        return `${result} ${name}=${quote}${value}${quote}`;
      }, '')
  }${element.selfClosing ? '/' : ''}>`;
}

export function renderNode(node: Node, { indent, level }: RenderLevelOptions): string {
  switch (node.type) {
    case 'text': return renderTextNode(node, { indent, level });
    case 'cdata': return node.rawValue || `<![CDATA[${node.value}]]>`;
    case 'comment': return node.rawValue || `<!-- ${node.value} -->`;
    case 'directive': return node.value;
    case 'element': {
      if (!node.openTag) { // Dynamically added, check if self closing first...
        node.selfClosing = node.childNodes.length === 0; // eslint-disable-line no-param-reassign
      }

      if (!node.childNodes.length && node.selfClosing) {
        return node.openTag || renderOpenTag(node);
      }

      // Remove self closing of tag in case children were added
      const keepOpenTag = !node.selfClosing || !node.childNodes.length;

      return `${(keepOpenTag && node.openTag) || renderOpenTag(node)}${
        node.childNodes.map((n, i) => renderNode(n, {
          indent,
          level: i === node.childNodes.length - 1 ?
            level :
            level + 1,
        })).join('')
      }${node.closeTag || `</${node.name}>`}`;
    }
    default:
      throw new Error(`Cannot render node: ${node}`);
  }
}

export interface RenderOptions {
  indent: string;
}

export default function render(document: Document, { indent = 'keep' } = {}): string {
  return `${
    document.leadingSpaces || ''
  }${
    document.childNodes.map(n => renderNode(n, { indent, level: 0 })).join('\n')
  }${
    document.trailingSpaces || ''
  }`;
}
