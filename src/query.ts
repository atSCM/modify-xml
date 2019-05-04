import { Node, Element, ContainerNode } from './types';
import { isContainerNode, isElementWithName } from './helpers';

/**
 * Returns a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */
export function findChildren(node: Node | null, tagName: string): Element[] | null {
  if (!node || !isContainerNode(node)) { return null; }

  return node.childNodes.filter(child => isElementWithName(child, tagName)) as Element[];
}

/**
 * Returns a node's first child element with the given tag name, or `null`.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */
export function findChild(node: ContainerNode | null, tagName: string | string[]): Element | null {
  const gotPath = Array.isArray(tagName);

  if (!node || !isContainerNode(node)) { return null; }

  if (gotPath) {
    if (tagName.length === 0) {
      throw new Error('No tagName provided');
    }

    const child = findChild(node, tagName[0]);

    return tagName.length > 1 ? findChild(child, tagName.slice(1)) : child;
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (isElementWithName(child, tagName as string)) {
      return child;
    }
  }

  return null;
}
