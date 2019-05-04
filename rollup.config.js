import { builtinModules } from 'module';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sucrase from 'rollup-plugin-sucrase';
import { dependencies } from './package.json';

const watching = Boolean(process.env.ROLLUP_WATCH);

const extensions = ['.js', '.ts'];

export default {
  input: [
    './src/index.ts',
  ],
  external: builtinModules.concat(Object.keys(dependencies)),
  plugins: [
    resolve({ extensions }),
    ...[watching ?
      sucrase({
        exclude: 'node_modules/**',
        transforms: ['typescript'],
      }) :
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
    ],
  ],
  output: [
    {
      format: 'cjs',
      dir: './out/',
      sourceMap: true,
    },
    {
      format: 'es',
      dir: './out/es',
      sourceMap: true,
    },
  ],
};
