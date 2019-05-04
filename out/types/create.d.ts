import { Node, ContainerNode, TextNode, CDataNode, Element } from './types';
/**
 * Creates a new text node.
 * @param text The node's content.
 * @return A text node containing the given text.
 */
export declare function createTextNode(text?: string): TextNode;
/**
 * Creates a new CData node.
 * @param value The node's content.
 * @return A CData node containing the given data.
 */
export declare function createCDataNode(value?: string): CDataNode;
/**
 * Creates a new element node.
 * @param name The node's name.
 * @param childNodes The child elements to add.
 * @param attributes The attributes the new node should have.
 * @return An element node.
 */
export declare function createElement(name: string, childNodes?: Node[] | undefined, attributes?: {}): Element;
export declare function appendChild(node: ContainerNode, child: Node): void;
export declare function prependChild(node: ContainerNode, child: Node): void;
