import { ParserContext } from 'saxen';
import { Document } from './types';
declare type ParsingIssue = Error & ParserContext;
export default function parse(xml: string, { onWarn }?: {
    onWarn?: (warning: ParsingIssue) => void;
}): Document;
export {};
