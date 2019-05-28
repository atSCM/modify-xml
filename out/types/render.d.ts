import { Document, TextNode, Element, Node } from './types';
declare type RenderLevelOptions = RenderOptions & {
    level: number;
};
export declare function renderTextNode(node: TextNode, { indent, level }: RenderLevelOptions): string;
export declare function renderOpenTag(element: Element): string;
export declare function renderNode(node: Node, { indent, level }: RenderLevelOptions): string;
export interface RenderOptions {
    indent: string;
}
export default function render(document: Document, { indent }?: {
    indent?: string;
}): string;
export {};
