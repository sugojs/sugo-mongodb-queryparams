SORT -> KEY SEPARATOR DIRECTION (_ KEY SEPARATOR DIRECTION):* {% function(d) { 
	
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
%}

KEY -> [0-9a-zA-Z_$.]:+ {% function(d) {return d[0].join("")} %}

DIRECTION -> "ASC"i {% function() { return 1 } %}
 | "DESC"i {% function() { return -1 } %}

SEPARATOR -> ":" {% function() { return null } %}

_ -> " ":+ {% function() { return null } %}
