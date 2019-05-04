import { ContainerNode, Element } from './types';
/**
 * Returns and removes a node's child elements with the given tag name.
 * @param node The node to check in.
 * @param tagName The tag name to search for.
 * @return The matching child elements.
 */
export declare function removeChildren(node: ContainerNode, tagName: string): Element[];
export declare function moveToTop(node: ContainerNode, tagName: string): void;
