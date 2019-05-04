import { ContainerNode, Element, Node } from './types';
import { isElementWithName, isTextNode, isElement } from './helpers';
import { findChild } from './query';

/**
 * Returns and removes a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for.
 * @return The matching child elements.
 */
export function removeChildren(node: ContainerNode, tagName: string): Element[] {
  if (!node || !node.childNodes) { return []; }

  const removed: Element[] = [];

  // eslint-disable-next-line no-param-reassign
  node.childNodes = node.childNodes.reduce((remaining, child) => {
    if (isElementWithName(child, tagName)) {
      removed.push(child);

      // Remove indent text node if any
      const previous = remaining.pop();
      if (previous) {
        if (!isTextNode(previous) || !previous.value.match(/^\s+$/)) {
          remaining.push(previous);
        }
      }

      return remaining;
    }

    return remaining.concat(child);
  }, [] as Node[]);

  return removed;
}

export function moveToTop(node: ContainerNode, tagName: string): void {
  const targetTop = findChild(node, tagName);
  if (targetTop === null) { return; }

  let nextElement: Element | null = targetTop;

  // eslint-disable-next-line no-param-reassign
  node.childNodes = node.childNodes.reduce((result, n) => {
    let insert = n;

    if (nextElement && isElement(n)) {
      insert = nextElement;

      nextElement = n === targetTop ? null : n;
    }

    return result.concat(insert);
  }, [] as Node[]);
}
