@preprocessor typescript
EXPRESSION -> EXPRESSION _ CONNECTOR _ EXPRESSION {% function(d) { return { [d[2]] : [d[0], d[4]] } } %}
	| "(" _:? EXPRESSION _:? ")" {% function(d) {return d[2]} %}
	| KEY SEPARATOR OPERATOR SEPARATOR VALUE {% function(d) {  
	if (d[2] === '$regex'){
		return { [d[0]]: { $regex: new RegExp(d[4])}}
	} else if (d[2] === '$iregex'){
		return { [d[0]]: { $regex: new RegExp(d[4], "i")}}
	}
	return { [d[0]]: { [d[2]] : d[4] }} } 
%}
	| KEY SEPARATOR VALUE {% function(d) {return {[d[0]]: d[2]}} %}
	| KEY {% function(d) {return {$text:{$search: d[0] }}} %}
	

CONNECTOR -> "OR" {% function() { return "$or" } %}
	| "AND" {% function() { return "$and" } %}

OPERATOR -> "eq" {% function() { return "$eq" } %}
	| "ne" {% function() { return "$ne" } %}
    | "gte" {% function() { return "$gte" } %}
    | "lte" {% function() { return "$lte" } %}
    | "gt" {% function() { return "$gt" } %}
    | "lt" {% function() { return "$lt" } %}
	| "regex" {% function() { return "$regex" } %}
	| "iregex" {% function() { return "$iregex" } %}
	| "exists" {% function() { return "$exists" } %}
	| "in" {% function() { return "$in" } %}
	| "nin" {% function() { return "$nin" } %}

KEY -> [0-9a-zA-Z_$.]:+ {% function(d) {return d[0].join("")} %}

VALUE -> DATETIME {% function(d) { return d[0] } %}
	| NUMERIC {% function(d) { return d[0] } %}
	| BOOLEAN {% function(d) { return d[0] } %}
	| QUOTE .:+ QUOTE {% function(d) { return d[1].join("") } %}
	| STRING {% function(d, p, reject) { 
		const value = d[0]
		if (value === "true") return reject
		if (value === "false") return reject
		if (!isNaN(value)) return reject
		if (!isNaN(new Date(value).getTime())) return reject;
		if (value.includes(":")) return reject
		return value
} %}
	| "[" VALUE ("," VALUE):+ "]" {% function(d) { 
	function flat(array, depth = 1){
		return array.reduce(function (result, toFlatten) {
			return result.concat((Array.isArray(toFlatten) && (depth-1)) ? flat(toFlatten,depth-1) : toFlatten);
		}, [])
	}
	return flat(d, Infinity).filter(v=>![",", "[", "]"].includes(v)) } 
%}

DATETIME -> DATE "T" TIME "Z" {% function(d) { return new Date(d.join("")) } %}
	| DATE "T" TIME {% function(d) { return new Date(d.join("")) } %}
	| DATE {% function(d) { return new Date(d.join("")) } %}

TIME -> HOURS ":" MINUTES ":" SECONDS {% function(d) { return d.join("") } %}

DATE -> YEAR "-" MONTH "-" DAY {% function(d) { return d.join("") } %}
	
YEAR -> [1-9] [0-9] [0-9] [0-9] {% function(d) { return d.join("") } %}

MONTH -> "1" [0-2] {% function(d) { return d.join("") } %}
	| "0" [1-9] {% function(d) { return d.join("") } %}
	| [1-9] {% function(d) { return d.join("") } %}

DAY -> "3" [0-1] {% function(d) { return d.join("") } %}
	| "0" [1-9] {% function(d) { return d.join("") } %}
	| [1-2] [0-9] {% function(d) { return d.join("") } %}
	| [1-9] {% function(d) { return d.join("") } %}

HOURS -> "2" [0-3] {% function(d) { return d.join("") } %}
	| [0-1] [0-9] {% function(d) { return d.join("") } %}
	| [0-9] {% function(d) { return d.join("") } %}

MINUTES -> [0-5] [0-9] {% function(d) { return d.join("") } %}
	| [0-9] {% function(d) { return d.join("") } %}

SECONDS -> [0-5] [0-9]  {% function(d) { return d.join("") } %}
	| [0-5] [0-9] "." MILLISECONDS  {% function(d) { return d.join("") } %}
	| [0-9] "." MILLISECONDS {% function(d) { return d.join("") } %}
	| [0-9] {% function(d) { return d.join("") } %}
	
MILLISECONDS -> [0-9] [0-9] [0-9] {% function(d) { return d.join("") } %}
	| [0-9] [0-9] {% function(d) { return d.join("") } %}
	| [0-9] {% function(d) { return d.join("") } %}


NUMERIC -> NUMBER DECIMAL_SEPARATOR NUMBER {% function(d) { return parseFloat(d.join("").replace(/,/g,".")) } %}
	| NUMBER {% function(d) { return parseInt(d, 10) } %}
	
NUMBER -> [0-9]:+ {% function(d) { return d.join('').replace(/,/g,"") } %}

DECIMAL_SEPARATOR -> "." 

STRING -> [a-zA-Z@.\-:_0-9]:+ {% function(d) { return d[0].join("") } %}

BOOLEAN -> TRUE {% function(d) { return true } %}
	| FALSE {% function(d) { return false } %}

TRUE -> "true" 

FALSE -> "false"

QUOTE -> "'"
	| "\""

_ -> " ":+

SEPARATOR -> ":"
