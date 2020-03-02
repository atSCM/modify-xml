export interface BaseNode {
  type: string;
}

export interface TextNode extends BaseNode {
  type: 'text';
  value: string;
}

export interface CDataNode extends BaseNode {
  type: 'cdata';
  value: string;
}

export interface CommentNode extends BaseNode {
  type: 'comment';
  value: string;
}

export interface DirectiveNode extends BaseNode {
  type: 'directive';
  value: string;
}

export interface BaseContainerNode extends BaseNode {
  childNodes: Node[];
}

export interface Element extends BaseContainerNode {
  type: 'element';
  name: string;
  attributes?: AttributeDefinition[];

  // Format info
  selfClosing?: boolean;
  openTag?: string;
  closeTag?: string;
}

export interface Document extends BaseContainerNode {
  type: 'document';
}

export type Node = TextNode | CommentNode | CDataNode | DirectiveNode | Element;
export type ContainerNode = Document | Element

export type AttributeDefinition = { name: string; value: string };
export type AttributeValues = { [name: string]: string }
