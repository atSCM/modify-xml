import { Node, ContainerNode, TextNode, CDataNode, Element } from './types';
import { isElement } from './helpers';

/**
 * Creates a new text node.
 * @param text The node's content.
 * @return A text node containing the given text.
 */
export function createTextNode(text = ''): TextNode {
  return { type: 'text', value: text || '' };
}

/**
 * Creates a new CData node.
 * @param value The node's content.
 * @return A CData node containing the given data.
 */
export function createCDataNode(value = ''): CDataNode {
  return {
    type: 'cdata',
    value,
  };
}

/**
 * Creates a new element node.
 * @param name The node's name.
 * @param childNodes The child elements to add.
 * @param attributes The attributes the new node should have.
 * @return An element node.
 */
export function createElement(
  name: string,
  childNodes: Node[] | undefined = undefined,
  attributes = {}
): Element {
  return {
    type: 'element',
    name,
    childNodes: childNodes || [],
    attributes,
  };
}

export function appendChild(node: ContainerNode, child: Node): void {
  const siblings = node.childNodes;

  if (!siblings.length) {
    node.childNodes.push(createTextNode('\n '));
  }

  node.childNodes.push(child);

  if (isElement(child)) {
    node.childNodes.push(createTextNode('\n '));
  }
}

export function prependChild(node: ContainerNode, child: Node): void {
  const siblings = node.childNodes;

  if (!siblings.length) {
    node.childNodes.unshift(createTextNode('\n '));
  }

  node.childNodes.unshift(child);

  if (isElement(child)) {
    node.childNodes.unshift(createTextNode('\n '));
  }
}
