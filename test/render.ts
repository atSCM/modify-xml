import { promises } from 'fs';
import test, { ExecutionContext } from 'ava';
import parse from '../src/parse';
import render from '../src/render';

async function preserveFormat(t: ExecutionContext, xml: string | Promise<string>) {
  const str = await xml;
  t.is(render(parse(str)), str);
}

test('should preserve ugly closing tags', preserveFormat, '<a></a >');

test('should preserve ugly indent', preserveFormat, `<a>
   </a>`);
