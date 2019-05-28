import { Element, ContainerNode, TextNode, CDataNode, BaseNode } from './types';
export declare function isElement(node: BaseNode): node is Element;
export declare function isContainerNode(node: BaseNode): node is ContainerNode;
export declare function isTextNode(node: BaseNode): node is TextNode;
export declare function isCDataNode(node: BaseNode): node is CDataNode;
export declare function isElementWithName(node: BaseNode, tagName: string): node is Element;
/**
 * Returns a parsed node's text content. Works for 'text' and 'cdata' nodes.
 * @param node The parsed Node.
 * @return The nodes text content.
 */
export declare function textContent(node: BaseNode | null): string | null;
