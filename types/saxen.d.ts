/* eslint-disable @typescript-eslint/prefer-interface */

declare module 'saxen' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type EntitiesDecoder = (a: any) => any; // FIXME: Add actual types

  export type ParserContext = { line: number; column: number; data: string };
  type ContextGetter = () => (ParserContext);

  type ParserEvent = {
    //  eslint-disable-next-line max-len
    'openTag': (name: string, getAttributes: () => { [name: string]: string }, decodeEntities: EntitiesDecoder, selfClosing: boolean, getContext: ContextGetter) => void;
    //  eslint-disable-next-line max-len
    'closeTag': (name: string, decodeEntities: EntitiesDecoder, selfClosing: boolean, getContext: ContextGetter) => void;
    'error': (error: Error, getContext: ContextGetter) => void;
    'warn': (warning: Error, getContext: ContextGetter) => void;
    'text': (value: string, decodeEntities: EntitiesDecoder, getContext: ContextGetter) => void;
    'cdata': (value: string, getContext: ContextGetter) => void;
    'comment': (value: string, decodeEntities: EntitiesDecoder, getContext: ContextGetter) => void;
    'attention': (str: string, decodeEntities: EntitiesDecoder, getContext: ContextGetter) => void;
    'question': (str: string, getContext: ContextGetter) => void;
  }

  export class Parser {

    public on<E extends keyof ParserEvent>(event: E, callback: ParserEvent[E]): void;
    public parse(xml: string): void;

  }

  export const decode: EntitiesDecoder;
}
