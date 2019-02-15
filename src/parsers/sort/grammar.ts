export const Lexer = undefined;
export const ParserRules = [
  { name: 'SORT$ebnf$1', symbols: [] },
  { name: 'SORT$ebnf$1$subexpression$1', symbols: ['_', 'KEY', 'SEPARATOR', 'DIRECTION'] },
  {
    name: 'SORT$ebnf$1',
    symbols: ['SORT$ebnf$1', 'SORT$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d: any) {
      return d[0].concat([d[1]]);
    },
  },
  {
    name: 'SORT',
    symbols: ['KEY', 'SEPARATOR', 'DIRECTION', 'SORT$ebnf$1'],
    postprocess(d: any) {
      function parseSort(raw: any) {
        const [key, dir] = raw.filter((x: any) => x);
        return { [key]: dir };
      }
      d = d.filter((x: any) => x);
      const result = {};
      const first = parseSort([d[0], d[1]]);
      const others = d[2].map((o: any) => {
        return parseSort(o);
      });
      return others.reduce((prev: any, cur: any) => Object.assign(prev, cur), first);
    },
  },
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
    name: 'DIRECTION$subexpression$1',
    symbols: [/[aA]/, /[sS]/, /[cC]/],
    postprocess(d: any) {
      return d.join('');
    },
  },
  {
    name: 'DIRECTION',
    symbols: ['DIRECTION$subexpression$1'],
    postprocess() {
      return 1;
    },
  },
  {
    name: 'DIRECTION$subexpression$2',
    symbols: [/[dD]/, /[eE]/, /[sS]/, /[cC]/],
    postprocess(d: any) {
      return d.join('');
    },
  },
  {
    name: 'DIRECTION',
    symbols: ['DIRECTION$subexpression$2'],
    postprocess() {
      return -1;
    },
  },
  {
    name: 'SEPARATOR',
    symbols: [{ literal: ':' }],
    postprocess() {
      return null;
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
export const ParserStart = 'SORT';
