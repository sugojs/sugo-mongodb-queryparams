RESULT -> MINUS:* KEY (_ MINUS:* KEY):* {% (d) => { 
	const array = d.flat(100).filter(x=>x) 
	const result = {}
	let i = 0
	while (i<array.length) {
		let field = array[i] === true ? array[i+1] : array[i]
		let value = array[i] === true ? -1 : 1
		result[field] = value
		i += array[i] === true ? 2: 1
	}
	return result
}  %}

SELECT -> MINUS KEY {% ([exclude,key] ) => ({[key]: -1 }) %}
	| KEY {% ([key] ) => ({[key]: 1 }) %}

KEY -> [0-9a-zA-Z_$.]:+ {% function(d) {return d[0].join("")} %}

MINUS -> "-" {% function() { return true } %}

_ -> " ":+ {% function() { return null } %}
