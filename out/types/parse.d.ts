import { Document } from './types';
declare type ParsingIssue = Error;
export default function parse(xml: string, { onWarn }?: {
    onWarn?: (warning: ParsingIssue) => void;
}): Document;
export {};
