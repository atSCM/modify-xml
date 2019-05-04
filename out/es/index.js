import { Parser } from 'saxen';

function refineParsingIssue(issue, getContext) {
  // FIXME: Add code frame?
  return Object.assign(issue, getContext());
}

function parse(xml, {
  onWarn
} = {}) {
  const parser = new Parser();
  const document = {
    type: 'document',
    childNodes: [],
    // new DocumentChildNodes(xml), // FIXME: if preserveFormatting
    leadingSpaces: xml.match(/^\s*/)[0],
    trailingSpaces: xml.match(/\s*$/)[0]
  };
  let currentNode = document; // Handle non-element nodes

  parser.on('text', (value, _decode, getContext) => {
    currentNode.childNodes.push({
      type: 'text',
      value,
      // if perserveFormat
      getContext
    });
  });
  parser.on('cdata', (value, getContext) => {
    currentNode.childNodes.push({
      type: 'cdata',
      value,
      // if perserveFormat
      getContext,
      rawValue: `${getContext().data}]>`
    });
  });
  parser.on('comment', (value, _decode, getContext) => {
    currentNode.childNodes.push({
      type: 'comment',
      value,
      // if preserveFormat
      getContext,
      rawValue: `${getContext().data}->`
    });
  });

  const handleDirective = (value, getContext) => {
    currentNode.childNodes.push({
      type: 'directive',
      value,
      // if preserveFormat
      getContext
    });
  }; // e.g. <!doctype ...>


  parser.on('attention', (str, decode, getContext) => handleDirective(str, getContext)); // e.g. <?xml ...>

  parser.on('question', handleDirective); // Handle elements

  parser.on('openTag', (name, getAttributes, _decode, selfClosing, getContext) => {
    const element = {
      type: 'element',
      name,
      childNodes: [],
      attributes: getAttributes(),
      // if preserveFormatting
      getContext,
      selfClosing,
      openTag: getContext().data
    };
    currentNode.childNodes.push(element);
    currentNode = Object.assign(element, {
      parent: currentNode
    });
  });
  parser.on('closeTag', (name, _decode, _selfClosing, getContext) => {
    const previous = currentNode;
    currentNode = previous.parent;
    delete previous.parent; // if preserveFormatting

    previous.closeTag = getContext().data;
  }); // Error handling

  parser.on('warn', (warning, getContext) => {
    if (onWarn) {
      onWarn(refineParsingIssue(warning, getContext));
    }
  });
  parser.on('error', (error, getContext) => {
    throw refineParsingIssue(error, getContext);
  }); // FIXME: Check all events are handled

  parser.parse(xml);
  return document;
}

function renderTextNode(node, {
  indent,
  level
}) {
  if (indent === 'keep' || !node.value.match(/^\s+$/)) {
    return node.value;
  }

  return node.value.replace(/^[ \t]+/gm, indent.repeat(level));
}
function renderOpenTag(element) {
  return `<${element.name}${Object.entries(element.attributes).reduce((result, [name, value]) => `${result} ${name}="${value}"`, '')}${element.selfClosing ? '/' : ''}>`;
}
function renderNode(node, {
  indent,
  level
}) {
  switch (node.type) {
    case 'text':
      return renderTextNode(node, {
        indent,
        level
      });

    case 'cdata':
      return node.rawValue || `<![CDATA[${node.value}]]>`;

    case 'comment':
      return node.rawValue || `<!-- ${node.value} -->`;

    case 'directive':
      return node.value;

    case 'element':
      {
        if (!node.openTag) {
          // Dynamically added, check if self closing first...
          node.selfClosing = node.childNodes.length === 0; // eslint-disable-line no-param-reassign
        }

        if (!node.childNodes.length && node.selfClosing) {
          return node.openTag || renderOpenTag(node);
        } // Remove self closing of tag in case children were added


        const keepOpenTag = !node.selfClosing || !node.childNodes.length;
        return `${keepOpenTag && node.openTag || renderOpenTag(node)}${node.childNodes.map((n, i) => renderNode(n, {
          indent,
          level: i === node.childNodes.length - 1 ? level : level + 1
        })).join('')}${node.closeTag || `</${node.name}>`}`;
      }

    default:
      throw new Error(`Cannot render node: ${node}`);
  }
}
function render(document, {
  indent = 'keep'
} = {}) {
  return `${document.leadingSpaces || ''}${document.childNodes.map(n => renderNode(n, {
    indent,
    level: 0
  })).join('\n')}${document.trailingSpaces || ''}`;
}

export { parse, render };
