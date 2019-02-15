import * as nearley from 'nearley';
import * as filterGrammar from './filter/grammar';
import * as selectGrammar from './select/grammar';
import * as sortGrammar from './sort/grammar';

export const getFilterGrammar = () => new nearley.Parser(nearley.Grammar.fromCompiled(filterGrammar));

export const getSortGrammar = () => new nearley.Parser(nearley.Grammar.fromCompiled(sortGrammar));

export const getSelectGrammar = () => new nearley.Parser(nearley.Grammar.fromCompiled(selectGrammar));
