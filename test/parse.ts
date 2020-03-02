import test from 'ava';
import parse from '../src/parse';

test('should throw on invalid xml', (t) => {
  t.throws(() => parse('<left-open>'), /end of file/);
});

test('should not throw on `>` in attribute value', (t) => {
  const doc = parse(`<doc>
  <element id="test>ing" />
</doc>`);

  t.is(((doc.childNodes[0] as Element).childNodes[1] as Element).attributes[0].value, 'test>ing');
});
