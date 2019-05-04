import test from 'ava';
import parse from '../src/parse';

test('should throw on invalid xml', (t) => {
  t.throws(() => parse('<left-open>'), /end of file/);
});
