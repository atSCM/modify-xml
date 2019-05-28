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

test('should allow quotes in attribute values', t => {
  t.is(render({ childNodes: [{
    type: 'element',
    name: 'test',
    attributes: {
      name: '{ "json": "value" }',
    },
    childNodes: [],
  }] }), `<test name='{ "json": "value" }'/>`); // eslint-disable-line quotes
});

test('should throw with unescaped attribute values', t => {
  t.throws(() => render({ childNodes: [{
    type: 'element',
    name: 'test',
    attributes: {
      name: `Mixed ' and "`, // eslint-disable-line quotes
    },
    childNodes: [],
  }] }), /single and double quotes/);
});
