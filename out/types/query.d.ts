import { Node, Element, ContainerNode } from './types';
/**
 * Returns a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */
export declare function findChildren(node: Node | null, tagName: string): Element[] | null;
/**
 * Returns a node's first child element with the given tag name, or `null`.
 * @param node The node to check in.
 * @param tagName The tag name to search for. If an array is passed, the tree is
 * traversed.
 * @return The matching child elements.
 */
export declare function findChild(node: ContainerNode | null, tagName: string | string[]): Element | null;
