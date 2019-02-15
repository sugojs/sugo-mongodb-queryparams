import { ParserRule } from 'nearley';

// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
export const Lexer = undefined;
export const ParserRules: ParserRule[] = [
  { name: 'RESULT$ebnf$1', symbols: [] },
  {
    name: 'RESULT$ebnf$1',
    symbols: ['RESULT$ebnf$1', 'MINUS'],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  { name: 'RESULT$ebnf$2', symbols: [] },
  { name: 'RESULT$ebnf$2$subexpression$1$ebnf$1', symbols: [] },
  {
    name: 'RESULT$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['RESULT$ebnf$2$subexpression$1$ebnf$1', 'MINUS'],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  { name: 'RESULT$ebnf$2$subexpression$1', symbols: ['_', 'RESULT$ebnf$2$subexpression$1$ebnf$1', 'KEY'] },
  {
    name: 'RESULT$ebnf$2',
    symbols: ['RESULT$ebnf$2', 'RESULT$ebnf$2$subexpression$1'],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  {
    name: 'RESULT',
    symbols: ['RESULT$ebnf$1', 'KEY', 'RESULT$ebnf$2'],
    postprocess: (d: any) => {
      function flat(input: any[], depth = 1) {
        return input.reduce((flatArray, toFlatten) => {
          return flatArray.concat(Array.isArray(toFlatten) && depth - 1 ? flat(toFlatten, depth - 1) : toFlatten);
        }, []);
      }
      const array = flat(d, 100).filter(x => x);
      const result: any = {};
      let i = 0;
      while (i < array.length) {
        const field = array[i] === true ? array[i + 1] : array[i];
        const value = array[i] === true ? 0 : 1;
        result[field] = value;
        i += array[i] === true ? 2 : 1;
      }
      return result;
    },
  },
  { name: 'SELECT', symbols: ['MINUS', 'KEY'], postprocess: ([exclude, key]) => ({ [key]: 0 }) },
  { name: 'SELECT', symbols: ['KEY'], postprocess: ([key]) => ({ [key]: 1 }) },
  { name: 'KEY$ebnf$1', symbols: [/[0-9a-zA-Z_$.]/] },
  {
    name: 'KEY$ebnf$1',
    symbols: ['KEY$ebnf$1', /[0-9a-zA-Z_$.]/],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  {
    name: 'KEY',
    symbols: ['KEY$ebnf$1'],
    postprocess(d: any) {
      return d[0].join('');
    },
  },
  {
    name: 'MINUS',
    symbols: [{ literal: '-' }],
    postprocess() {
      return true;
    },
  },
  { name: '_$ebnf$1', symbols: [{ literal: ' ' }] },
  {
    name: '_$ebnf$1',
    symbols: ['_$ebnf$1', { literal: ' ' }],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  {
    name: '_',
    symbols: ['_$ebnf$1'],
    postprocess() {
      return null;
    },
  },
];
export const ParserStart = 'RESULT';
