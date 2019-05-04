import { Element, ContainerNode, TextNode, CDataNode, BaseNode } from './types';

export function isElement(node: BaseNode): node is Element {
  return node.type === 'element';
}

export function isContainerNode(node: BaseNode): node is ContainerNode {
  return node.type === 'element' || node.type === 'document';
}

export function isTextNode(node: BaseNode): node is TextNode {
  return node.type === 'text';
}

export function isCDataNode(node: BaseNode): node is CDataNode {
  return node.type === 'cdata';
}

export function isElementWithName(node: BaseNode, tagName: string): node is Element {
  return isElement(node) && node.name === tagName;
}

/**
 * Returns a parsed node's text content. Works for 'text' and 'cdata' nodes.
 * @param node The parsed Node.
 * @return The nodes text content.
 */
export function textContent(node: BaseNode | null): string | null {
  if (!node || !isContainerNode(node)) { return null; }

  const contentNode = node.childNodes
    .find(n => isTextNode(n) || isCDataNode(n)) as { value: string } | undefined;

  return contentNode ? contentNode.value : null;
}
