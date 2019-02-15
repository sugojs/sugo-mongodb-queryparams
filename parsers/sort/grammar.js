// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "SORT$ebnf$1", "symbols": []},
    {"name": "SORT$ebnf$1$subexpression$1", "symbols": ["_", "KEY", "SEPARATOR", "DIRECTION"]},
    {"name": "SORT$ebnf$1", "symbols": ["SORT$ebnf$1", "SORT$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SORT", "symbols": ["KEY", "SEPARATOR", "DIRECTION", "SORT$ebnf$1"], "postprocess":  function(d) { 
        	
        	function parseSort(raw) {
        		const [key, dir] = raw.filter(x=>x)
        		return { [key] : dir }
        	}
        	d = d.filter(x=>x)
        	const result = {}
        	const first = parseSort([d[0], d[1]])
        	const others = d[2].map(o => {
        		return parseSort(o)
        	})
        	return others.reduce((prev, cur) => Object.assign(prev, cur), first)
        }
        },
    {"name": "KEY$ebnf$1", "symbols": [/[0-9a-zA-Z_$\-.]/]},
    {"name": "KEY$ebnf$1", "symbols": ["KEY$ebnf$1", /[0-9a-zA-Z_$\-.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "KEY", "symbols": ["KEY$ebnf$1"], "postprocess": function(d) {return d[0].join("")}},
    {"name": "DIRECTION$string$1", "symbols": [{"literal":"A"}, {"literal":"S"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DIRECTION", "symbols": ["DIRECTION$string$1"], "postprocess": function() { return 1 }},
    {"name": "DIRECTION$string$2", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"c"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DIRECTION", "symbols": ["DIRECTION$string$2"], "postprocess": function() { return 1 }},
    {"name": "DIRECTION$string$3", "symbols": [{"literal":"D"}, {"literal":"E"}, {"literal":"S"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DIRECTION", "symbols": ["DIRECTION$string$3"], "postprocess": function() { return -1 }},
    {"name": "DIRECTION$string$4", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DIRECTION", "symbols": ["DIRECTION$string$4"], "postprocess": function() { return -1 }},
    {"name": "SEPARATOR", "symbols": [{"literal":":"}], "postprocess": function() { return null }},
    {"name": "_$ebnf$1", "symbols": [{"literal":" "}]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function() { return null }}
]
  , ParserStart: "SORT"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
