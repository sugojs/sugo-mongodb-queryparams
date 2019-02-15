const nearley = require('nearley');
const filterGrammar = require('./filter/grammar');
const sortGrammar = require('./sort/grammar');
const selectGrammar = require('./sort/grammar');

const getFilterGrammar = () =>
  new nearley.Parser(nearley.Grammar.fromCompiled(filterGrammar));

const getSortGrammar = () =>
  new nearley.Parser(nearley.Grammar.fromCompiled(sortGrammar));

const getSelectGrammar = () =>
  new nearley.Parser(nearley.Grammar.fromCompiled(selectGrammar));

module.exports = {
  getFilterGrammar,
  getSortGrammar,
  getSelectGrammar
};
