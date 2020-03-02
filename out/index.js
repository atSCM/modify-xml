'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var parseXml = require('@atscm/parse-xml');

function renderParserNode(node) {
  return node.tokens.map(t => t.content).join('');
}

function parse(xml, {
  onWarn
} = {}) {
  const document = {
    type: 'document',
    childNodes: []
  };
  let currentNode = document;

  for (const node of parseXml.parse(xml)) {
    if (node.type === parseXml.NodeType.Text) {
      currentNode.childNodes.push({
        type: 'text',
        value: node.content
      });
    } else if (node.type === parseXml.NodeType.CData) {
      currentNode.childNodes.push({
        type: 'cdata',
        value: node.content
      });
    } else if (node.type === parseXml.NodeType.Comment) {
      currentNode.childNodes.push({
        type: 'comment',
        value: node.content
      });
    } else if (node.type === parseXml.NodeType.ProcessingInstruction) {
      currentNode.childNodes.push({
        type: 'directive',
        value: node.tokens.map(t => t.content).join('')
      });
    } else if (node.type === parseXml.NodeType.OpenTag) {
      const element = {
        type: 'element',
        name: node.name,
        childNodes: [],
        attributes: node.attributes,
        // if preserveFormatting
        selfClosing: node.selfClosing,
        openTag: renderParserNode(node)
      };
      currentNode.childNodes.push(element);

      if (!node.selfClosing) {
        currentNode = Object.assign(element, {
          parent: currentNode
        });
      }
    } else if (node.type === 'close-tag') {
      const previous = currentNode;
      currentNode = previous.parent;
      delete previous.parent; // if preserveFormatting

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

function renderTextNode(node, {
  indent,
  level
}) {
  if (indent === 'keep' || !node.value.match(/^\s+$/)) {
    return node.value;
  }

  return node.value.replace(/^[ \t]+/gm, indent.repeat(level));
}
const doubleQuoteRegExp = /"/;
const singleQuoteRegExp = /'/;
function renderOpenTag(element) {
  return `<${element.name}${element.attributes.reduce((result, {
    name,
    value
  }) => {
    let quote = '"';

    if (doubleQuoteRegExp.test(value)) {
      if (singleQuoteRegExp.test(value)) {
        // eslint-disable-next-line max-len
        throw new Error(`Found single and double quotes in value of attribute '${name}': \`${value}\`. Escape values first`);
      }

      quote = "'";
    }

    return `${result} ${name}=${quote}${value}${quote}`;
  }, '')}${element.selfClosing ? '/' : ''}>`;
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
      return `<![CDATA[${node.value}]]>`;

    case 'comment':
      return `<!--${node.value}-->`;

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
  return document.childNodes.map(n => renderNode(n, {
    indent,
    level: 0
  })).join('');
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function isElement(node) {
  return node.type === 'element';
}
function isContainerNode(node) {
  return node.type === 'element' || node.type === 'document';
}
function isTextNode(node) {
  return node.type === 'text';
}
function isCDataNode(node) {
  return node.type === 'cdata';
}
function isElementWithName(node, tagName) {
  return isElement(node) && node.name === tagName;
}
/**
 * Returns a parsed node's text content. Works for 'text' and 'cdata' nodes.
 * @param node The parsed Node.
 * @return The nodes text content.
 */

function textContent(node) {
  if (!node || !isContainerNode(node)) {
    return null;
  }

  const contentNode = node.childNodes.find(n => isTextNode(n) || isCDataNode(n));
  return contentNode ? contentNode.value : null;
}
function attributeValues(node) {
  return (node.attributes || []).reduce((all, a) => _objectSpread2({}, all, {
    [a.name]: a.value
  }), {});
}

/**
 * Returns a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */

function findChildren(node, tagName) {
  if (!node || !isContainerNode(node)) {
    return null;
  }

  return node.childNodes.filter(child => isElementWithName(child, tagName));
}
/**
 * Returns a node's first child element with the given tag name, or `null`.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */

function findChild(node, tagName) {
  const gotPath = Array.isArray(tagName);

  if (!node || !isContainerNode(node)) {
    return null;
  }

  if (gotPath) {
    if (tagName.length === 0) {
      throw new Error('No tagName provided');
    }

    const child = findChild(node, tagName[0]);
    return tagName.length > 1 ? findChild(child, tagName.slice(1)) : child;
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    if (isElementWithName(child, tagName)) {
      return child;
    }
  }

  return null;
}

/**
 * Creates a new text node.
 * @param text The node's content.
 * @return A text node containing the given text.
 */

function createTextNode(text = '') {
  return {
    type: 'text',
    value: text || ''
  };
}
/**
 * Creates a new CData node.
 * @param value The node's content.
 * @return A CData node containing the given data.
 */

function createCDataNode(value = '') {
  return {
    type: 'cdata',
    value
  };
}

function normalizeAttributes(attributes) {
  if (Array.isArray(attributes)) return attributes;
  return Object.entries(attributes).map(([name, value]) => ({
    name,
    value
  }));
}
/**
 * Creates a new element node.
 * @param name The node's name.
 * @param childNodes The child elements to add.
 * @param attributes The attributes the new node should have.
 * @return An element node.
 */


function createElement(name, childNodes = undefined, attributes = {}) {
  return {
    type: 'element',
    name,
    childNodes: childNodes || [],
    attributes: normalizeAttributes(attributes)
  };
}
function appendChild(node, child) {
  const siblings = node.childNodes;

  if (!siblings.length) {
    node.childNodes.push(createTextNode('\n '));
  }

  node.childNodes.push(child);

  if (isElement(child)) {
    node.childNodes.push(createTextNode('\n '));
  }
}
function prependChild(node, child) {
  const siblings = node.childNodes;

  if (!siblings.length) {
    node.childNodes.unshift(createTextNode('\n '));
  }

  node.childNodes.unshift(child);

  if (isElement(child)) {
    node.childNodes.unshift(createTextNode('\n '));
  }
}

/**
 * Returns and removes a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for.
 * @return The matching child elements.
 */

function removeChildren(node, tagName) {
  if (!node || !node.childNodes) {
    return [];
  }

  const removed = []; // eslint-disable-next-line no-param-reassign

  node.childNodes = node.childNodes.reduce((remaining, child) => {
    if (isElementWithName(child, tagName)) {
      removed.push(child); // Remove indent text node if any

      const previous = remaining.pop();

      if (previous) {
        if (!isTextNode(previous) || !previous.value.match(/^\s+$/)) {
          remaining.push(previous);
        }
      }

      return remaining;
    }

    return remaining.concat(child);
  }, []);
  return removed;
}
function moveToTop(node, tagName) {
  const targetTop = findChild(node, tagName);

  if (targetTop === null) {
    return;
  }

  let nextElement = targetTop; // eslint-disable-next-line no-param-reassign

  node.childNodes = node.childNodes.reduce((result, n) => {
    let insert = n;

    if (nextElement && isElement(n)) {
      insert = nextElement;
      nextElement = n === targetTop ? null : n;
    }

    return result.concat(insert);
  }, []);
}

exports.appendChild = appendChild;
exports.attributeValues = attributeValues;
exports.createCDataNode = createCDataNode;
exports.createElement = createElement;
exports.createTextNode = createTextNode;
exports.findChild = findChild;
exports.findChildren = findChildren;
exports.isCDataNode = isCDataNode;
exports.isContainerNode = isContainerNode;
exports.isElement = isElement;
exports.isElementWithName = isElementWithName;
exports.isTextNode = isTextNode;
exports.moveToTop = moveToTop;
exports.parse = parse;
exports.prependChild = prependChild;
exports.removeChildren = removeChildren;
exports.render = render;
exports.textContent = textContent;
