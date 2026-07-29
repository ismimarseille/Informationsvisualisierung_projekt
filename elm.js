(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.2/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\u000A    ',
		A2($elm$core$String$split, '\u000A', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\u000A\u000A(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\u0027' + (f + '\u0027]'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\u000A\u000A',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\u000A\u000A';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\u000A\u000A    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\u000A\u000A' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Main$NeedConnect = {$: 'NeedConnect'};
var $author$project$Energy$SolarShare = {$: 'SolarShare'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$init = function (nowMillis) {
	return _Utils_Tuple2(
		{
			ceilings: $elm$core$Dict$empty,
			country: 'all',
			elapsed: 0,
			focusedDay: $elm$core$Maybe$Nothing,
			hovered: $elm$core$Maybe$Nothing,
			lastScroll: 0,
			latest: $elm$core$Maybe$Nothing,
			loadedDays: $elm$core$Dict$empty,
			metric: $author$project$Energy$SolarShare,
			mouse: _Utils_Tuple2(0, 0),
			navHidden: false,
			navPinned: false,
			nowSeconds: $elm$core$Basics$round(nowMillis / 1000),
			pinned: _List_Nil,
			previewCountry: $elm$core$Maybe$Nothing,
			previewMetric: $elm$core$Maybe$Nothing,
			rowsByCountry: $elm$core$Dict$empty,
			status: $author$project$Main$NeedConnect,
			token: $elm$core$Maybe$Nothing,
			tokenInput: '',
			treemapFocus: $elm$core$Maybe$Nothing,
			windowDays: 7
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$Scrolled = function (a) {
	return {$: 'Scrolled', a: a};
};
var $author$project$Main$Tick = {$: 'Tick'};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Main$isBusy = function (status) {
	switch (status.$) {
		case 'Connecting':
			return true;
		case 'LoadingBounds':
			return true;
		case 'LoadingRows':
			return true;
		default:
			return false;
	}
};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$onScroll = _Platform_incomingPort('onScroll', $elm$json$Json$Decode$float);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$onScroll($author$project$Main$Scrolled),
				$author$project$Main$isBusy(model.status) ? A2(
				$elm$time$Time$every,
				100,
				function (_v0) {
					return $author$project$Main$Tick;
				}) : $elm$core$Platform$Sub$none
			]));
};
var $author$project$Main$Connecting = {$: 'Connecting'};
var $author$project$Main$Failed = function (a) {
	return {$: 'Failed', a: a};
};
var $author$project$Main$GotCountryRows = F4(
	function (a, b, c, d) {
		return {$: 'GotCountryRows', a: a, b: b, c: c, d: d};
	});
var $author$project$Main$GotRecent = function (a) {
	return {$: 'GotRecent', a: a};
};
var $author$project$Main$GotToken = function (a) {
	return {$: 'GotToken', a: a};
};
var $author$project$Main$LoadingBounds = {$: 'LoadingBounds'};
var $author$project$Main$Ready = {$: 'Ready'};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $author$project$Main$activeCountry = function (model) {
	var _v0 = model.previewCountry;
	if (_v0.$ === 'Just') {
		var p = _v0.a;
		return A2($elm$core$Dict$member, p, model.rowsByCountry) ? p : model.country;
	} else {
		return model.country;
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$boundsFor = F2(
	function (ceilings, code) {
		var _v0 = A2($elm$core$Dict$get, code, ceilings);
		if (_v0.$ === 'Just') {
			var hi = _v0.a;
			var lo = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$List$maximum(
					A2(
						$elm$core$List$filter,
						function (v) {
							return _Utils_cmp(v, hi) < 0;
						},
						$elm$core$Dict$values(ceilings))));
			return _Utils_Tuple2(lo, hi);
		} else {
			return _Utils_Tuple2(
				0,
				A2(
					$elm$core$Maybe$withDefault,
					2000000000,
					$elm$core$List$maximum(
						$elm$core$Dict$values(ceilings))));
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Main$hasEnough = F2(
	function (code, model) {
		return _Utils_cmp(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Dict$get, code, model.loadedDays)),
			model.windowDays) > -1;
	});
var $author$project$Main$LoadingRows = {$: 'LoadingRows'};
var $author$project$Api$limit = 5000;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Api$orderBy = F2(
	function (col, dir) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'col',
					$elm$json$Json$Encode$string(col)),
					_Utils_Tuple2(
					'dir',
					$elm$json$Json$Encode$string(dir))
				]));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Api$tableName = 'energycharts_publicpower';
var $author$project$Api$queryBody = F4(
	function (whereList, orderList, limit_, offset_) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'p_table_name',
					$elm$json$Json$Encode$string($author$project$Api$tableName)),
					_Utils_Tuple2(
					'where_',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, whereList)),
					_Utils_Tuple2(
					'order_by',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, orderList)),
					_Utils_Tuple2(
					'limit_val',
					$elm$json$Json$Encode$int(limit_)),
					_Utils_Tuple2(
					'offset_val',
					$elm$json$Json$Encode$int(offset_))
				]));
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 'Header', a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$proxyBase = 'http://localhost:3001';
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $author$project$Api$request = F4(
	function (token, body, decoder, toMsg) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$jsonBody(body),
				expect: A2($elm$http$Http$expectJson, toMsg, decoder),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: $author$project$Api$proxyBase + '/proxy'
			});
	});
var $author$project$Energy$Row = function (unixSeconds) {
	return function (countryId) {
		return function (load) {
			return function (solar) {
				return function (windOnshore) {
					return function (windOffshore) {
						return function (hydroRor) {
							return function (hydroReservoir) {
								return function (hydroPumped) {
									return function (biomass) {
										return function (geothermal) {
											return function (nuclear) {
												return function (brownCoal) {
													return function (hardCoal) {
														return function (oil) {
															return function (gas) {
																return function (coalDerivedGas) {
																	return function (waste) {
																		return function (others) {
																			return {biomass: biomass, brownCoal: brownCoal, coalDerivedGas: coalDerivedGas, countryId: countryId, gas: gas, geothermal: geothermal, hardCoal: hardCoal, hydroPumped: hydroPumped, hydroReservoir: hydroReservoir, hydroRor: hydroRor, load: load, nuclear: nuclear, oil: oil, others: others, solar: solar, unixSeconds: unixSeconds, waste: waste, windOffshore: windOffshore, windOnshore: windOnshore};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Api$num = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			$elm$json$Json$Decode$float,
			$elm$json$Json$Decode$null(0)
		]));
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (_v0.$ === 'Ok') {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_v1.$ === 'Ok') {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Api$rowDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'others_in_gw',
	$author$project$Api$num,
	0,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'waste_in_gw',
		$author$project$Api$num,
		0,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'fossil_coal_derived_gas_in_gw',
			$author$project$Api$num,
			0,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'fossil_gas_in_gw',
				$author$project$Api$num,
				0,
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'fossil_oil_in_gw',
					$author$project$Api$num,
					0,
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'fossil_hard_coal_in_gw',
						$author$project$Api$num,
						0,
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'fossil_brown_coal_lignite_in_gw',
							$author$project$Api$num,
							0,
							A4(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
								'nuclear_energy_in_gw',
								$author$project$Api$num,
								0,
								A4(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
									'geothermal_in_gw',
									$author$project$Api$num,
									0,
									A4(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
										'biomass_in_gw',
										$author$project$Api$num,
										0,
										A4(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
											'hydro_pumped_storage_in_gw',
											$author$project$Api$num,
											0,
											A4(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
												'hydro_water_reservoir_in_gw',
												$author$project$Api$num,
												0,
												A4(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
													'hydro_run_of_river_in_gw',
													$author$project$Api$num,
													0,
													A4(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
														'wind_offshore_in_gw',
														$author$project$Api$num,
														0,
														A4(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
															'wind_onshore_in_gw',
															$author$project$Api$num,
															0,
															A4(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																'solar_in_gw',
																$author$project$Api$num,
																0,
																A4(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																	'load_in_gw',
																	$author$project$Api$num,
																	0,
																	A4(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																		'country_id',
																		$elm$json$Json$Decode$string,
																		'',
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'unix_seconds',
																			$elm$json$Json$Decode$int,
																			$elm$json$Json$Decode$succeed($author$project$Energy$Row))))))))))))))))))));
var $author$project$Api$whereInt = F3(
	function (col, op, val) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'col',
					$elm$json$Json$Encode$string(col)),
					_Utils_Tuple2(
					'op',
					$elm$json$Json$Encode$string(op)),
					_Utils_Tuple2(
					'val',
					$elm$json$Json$Encode$int(val)),
					_Utils_Tuple2(
					'logic',
					$elm$json$Json$Encode$string('and'))
				]));
	});
var $author$project$Api$loadCountryWindow = F5(
	function (token, _v0, tmin, offset, toMsg) {
		var lo = _v0.a;
		var hi = _v0.b;
		return A4(
			$author$project$Api$request,
			token,
			A4(
				$author$project$Api$queryBody,
				_List_fromArray(
					[
						A3($author$project$Api$whereInt, 'id', '>', lo),
						A3($author$project$Api$whereInt, 'id', '<=', hi),
						A3($author$project$Api$whereInt, 'unix_seconds', '>=', tmin)
					]),
				_List_fromArray(
					[
						A2($author$project$Api$orderBy, 'unix_seconds', 'asc')
					]),
				$author$project$Api$limit,
				offset),
			$elm$json$Json$Decode$list($author$project$Api$rowDecoder),
			toMsg);
	});
var $author$project$Main$loadCountry = F4(
	function (isPrimary, days, code, model) {
		var _v0 = _Utils_Tuple2(model.token, model.latest);
		if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
			var token = _v0.a.a;
			var tmax = _v0.b.a;
			return _Utils_Tuple2(
				isPrimary ? _Utils_update(
					model,
					{elapsed: 0, focusedDay: $elm$core$Maybe$Nothing, status: $author$project$Main$LoadingRows}) : model,
				A5(
					$author$project$Api$loadCountryWindow,
					token,
					A2($author$project$Main$boundsFor, model.ceilings, code),
					tmax - (days * 86400),
					0,
					A3($author$project$Main$GotCountryRows, code, days, 0)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$ensureCountry = F2(
	function (code, model) {
		return A2($author$project$Main$hasEnough, code, model) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A4($author$project$Main$loadCountry, false, model.windowDays, code, model);
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Api$recentDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (c, i, u) {
			return _Utils_Tuple3(c, i, u);
		}),
	A2($elm$json$Json$Decode$field, 'country_id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'unix_seconds', $elm$json$Json$Decode$int));
var $author$project$Api$getRecent = F3(
	function (token, lbUnix, toMsg) {
		return A4(
			$author$project$Api$request,
			token,
			A4(
				$author$project$Api$queryBody,
				_List_fromArray(
					[
						A3($author$project$Api$whereInt, 'unix_seconds', '>', lbUnix)
					]),
				_List_fromArray(
					[
						A2($author$project$Api$orderBy, 'unix_seconds', 'desc')
					]),
				$author$project$Api$limit,
				0),
			$elm$json$Json$Decode$list($author$project$Api$recentDecoder),
			toMsg);
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Api$getToken = function (toMsg) {
	return $elm$http$Http$post(
		{
			body: $elm$http$Http$emptyBody,
			expect: A2(
				$elm$http$Http$expectJson,
				toMsg,
				A2($elm$json$Json$Decode$field, 'token', $elm$json$Json$Decode$string)),
			url: $author$project$Api$proxyBase + '/token'
		});
};
var $author$project$Main$httpErr = function (err) {
	switch (err.$) {
		case 'BadUrl':
			var u = err.a;
			return 'BadUrl ' + u;
		case 'Timeout':
			return 'Timeout';
		case 'NetworkError':
			return 'Netzwerkfehler (läuft der Proxy auf Port 3001?)';
		case 'BadStatus':
			var s = err.a;
			return 'Status ' + $elm$core$String$fromInt(s);
		default:
			var b = err.a;
			return 'Antwort nicht lesbar: ' + A2($elm$core$String$left, 120, b);
	}
};
var $author$project$Main$lbOf = function (model) {
	return model.nowSeconds - (90 * 86400);
};
var $author$project$Main$countries = _List_fromArray(
	[
		_Utils_Tuple2('all', 'Europa (gesamt)'),
		_Utils_Tuple2('fr', 'Frankreich'),
		_Utils_Tuple2('it', 'Italien'),
		_Utils_Tuple2('pl', 'Polen'),
		_Utils_Tuple2('cz', 'Tschechien'),
		_Utils_Tuple2('ch', 'Schweiz'),
		_Utils_Tuple2('be', 'Belgien'),
		_Utils_Tuple2('se', 'Schweden'),
		_Utils_Tuple2('no', 'Norwegen'),
		_Utils_Tuple2('dk', 'Dänemark'),
		_Utils_Tuple2('de', 'Deutschland')
	]);
var $author$project$Main$prefetchDays = 30;
var $author$project$Main$loadAllCountries = function (model) {
	var _v0 = _Utils_Tuple2(model.token, model.latest);
	if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
		var token = _v0.a.a;
		var tmax = _v0.b.a;
		var days = A2($elm$core$Basics$max, $author$project$Main$prefetchDays, model.windowDays);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{elapsed: 0, focusedDay: $elm$core$Maybe$Nothing, status: $author$project$Main$LoadingRows}),
			$elm$core$Platform$Cmd$batch(
				A2(
					$elm$core$List$map,
					function (_v1) {
						var code = _v1.a;
						return A5(
							$author$project$Api$loadCountryWindow,
							token,
							A2($author$project$Main$boundsFor, model.ceilings, code),
							tmax - (days * 86400),
							0,
							A3($author$project$Main$GotCountryRows, code, days, 0));
					},
					$author$project$Main$countries)));
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Basics$not = _Basics_not;
var $author$project$Api$pageLimit = $author$project$Api$limit;
var $elm$core$String$trim = _String_trim;
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'TokenInput':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tokenInput: s}),
					$elm$core$Platform$Cmd$none);
			case 'Connect':
				var manual = $elm$core$String$trim(model.tokenInput);
				return (manual !== '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							elapsed: 0,
							status: $author$project$Main$LoadingBounds,
							token: $elm$core$Maybe$Just(manual)
						}),
					A3(
						$author$project$Api$getRecent,
						manual,
						$author$project$Main$lbOf(model),
						$author$project$Main$GotRecent)) : _Utils_Tuple2(
					_Utils_update(
						model,
						{elapsed: 0, status: $author$project$Main$Connecting}),
					$author$project$Api$getToken($author$project$Main$GotToken));
			case 'GotToken':
				if (msg.a.$ === 'Ok') {
					var t = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Main$LoadingBounds,
								token: $elm$core$Maybe$Just(t)
							}),
						A3(
							$author$project$Api$getRecent,
							t,
							$author$project$Main$lbOf(model),
							$author$project$Main$GotRecent));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Main$Failed(
									'Token konnte nicht geholt werden – läuft der Proxy? (' + ($author$project$Main$httpErr(e) + ')'))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'GotRecent':
				if (msg.a.$ === 'Ok') {
					var triples = msg.a.a;
					var tmax = $elm$core$List$maximum(
						A2(
							$elm$core$List$map,
							function (_v3) {
								var u = _v3.c;
								return u;
							},
							triples));
					var ceilings = A3(
						$elm$core$List$foldl,
						F2(
							function (_v2, d) {
								var c = _v2.a;
								var i = _v2.b;
								return A3(
									$elm$core$Dict$update,
									c,
									function (m) {
										return $elm$core$Maybe$Just(
											A2(
												$elm$core$Basics$max,
												i,
												A2($elm$core$Maybe$withDefault, 0, m)));
									},
									d);
							}),
						$elm$core$Dict$empty,
						triples);
					if (tmax.$ === 'Just') {
						var t = tmax.a;
						return $author$project$Main$loadAllCountries(
							_Utils_update(
								model,
								{
									ceilings: ceilings,
									latest: $elm$core$Maybe$Just(t)
								}));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Main$Failed('Keine aktuellen Daten gefunden (Zeitfenster zu eng?).')
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Main$Failed(
									$author$project$Main$httpErr(e))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'GotCountryRows':
				if (msg.d.$ === 'Ok') {
					var code = msg.a;
					var days = msg.b;
					var offset = msg.c;
					var rows = msg.d.a;
					var nextOffset = offset + $author$project$Api$pageLimit;
					var morePages = _Utils_cmp(
						$elm$core$List$length(rows),
						$author$project$Api$pageLimit) > -1;
					var fresh = A2(
						$elm$core$List$filter,
						function (r) {
							return _Utils_eq(r.countryId, code);
						},
						rows);
					var merged = (!offset) ? fresh : _Utils_ap(
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2($elm$core$Dict$get, code, model.rowsByCountry)),
						fresh);
					var m2 = _Utils_update(
						model,
						{
							loadedDays: morePages ? model.loadedDays : A3($elm$core$Dict$insert, code, days, model.loadedDays),
							rowsByCountry: A3($elm$core$Dict$insert, code, merged, model.rowsByCountry),
							status: (_Utils_eq(code, model.country) && (!morePages)) ? $author$project$Main$Ready : model.status
						});
					var _v4 = _Utils_Tuple3(morePages, model.token, model.latest);
					if ((_v4.a && (_v4.b.$ === 'Just')) && (_v4.c.$ === 'Just')) {
						var token = _v4.b.a;
						var tmax = _v4.c.a;
						return _Utils_Tuple2(
							m2,
							A5(
								$author$project$Api$loadCountryWindow,
								token,
								A2($author$project$Main$boundsFor, model.ceilings, code),
								tmax - (days * 86400),
								nextOffset,
								A3($author$project$Main$GotCountryRows, code, days, nextOffset)));
					} else {
						return _Utils_Tuple2(m2, $elm$core$Platform$Cmd$none);
					}
				} else {
					var code = msg.a;
					var e = msg.d.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: _Utils_eq(code, model.country) ? $author$project$Main$Failed(
									$author$project$Main$httpErr(e)) : model.status
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'SelectCountry':
				var c = msg.a;
				var m2 = _Utils_update(
					model,
					{country: c, previewCountry: $elm$core$Maybe$Nothing});
				return A2($author$project$Main$hasEnough, c, m2) ? _Utils_Tuple2(
					_Utils_update(
						m2,
						{status: $author$project$Main$Ready}),
					$elm$core$Platform$Cmd$none) : A4($author$project$Main$loadCountry, true, m2.windowDays, c, m2);
			case 'HoverCountry':
				var mc = msg.a;
				if (mc.$ === 'Just') {
					var code = mc.a;
					return A2(
						$author$project$Main$ensureCountry,
						code,
						_Utils_update(
							model,
							{
								previewCountry: $elm$core$Maybe$Just(code)
							}));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{previewCountry: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				}
			case 'SelectWindow':
				var d = msg.a;
				var m2 = _Utils_update(
					model,
					{windowDays: d});
				var code = $author$project$Main$activeCountry(m2);
				return A2($author$project$Main$hasEnough, code, m2) ? _Utils_Tuple2(m2, $elm$core$Platform$Cmd$none) : A4($author$project$Main$loadCountry, true, d, code, m2);
			case 'SelectMetric':
				var m = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{metric: m, previewMetric: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 'HoverMetric':
				var mm = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{previewMetric: mm}),
					$elm$core$Platform$Cmd$none);
			case 'DrillBand':
				var mb = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{treemapFocus: mb}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{elapsed: model.elapsed + 0.1}),
					$elm$core$Platform$Cmd$none);
			case 'HoverSource':
				var ms = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hovered: ms}),
					$elm$core$Platform$Cmd$none);
			case 'PinSource':
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pinned: A2($elm$core$List$member, name, model.pinned) ? A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(name),
								model.pinned) : A2($elm$core$List$cons, name, model.pinned)
						}),
					$elm$core$Platform$Cmd$none);
			case 'MouseMove':
				var x = msg.a;
				var y = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							mouse: _Utils_Tuple2(x, y)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Scrolled':
				var y = msg.a;
				var delta = y - model.lastScroll;
				var hidden = (y < 90) ? false : ((delta > 6) ? true : ((_Utils_cmp(delta, -6) < 0) ? false : model.navHidden));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{lastScroll: y, navHidden: hidden}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleNavPin':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{navPinned: !model.navPinned}),
					$elm$core$Platform$Cmd$none);
			case 'ClickDay':
				var d = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							focusedDay: _Utils_eq(
								model.focusedDay,
								$elm$core$Maybe$Just(d)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(d)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return $author$project$Main$loadAllCountries(model);
		}
	});
var $author$project$Main$MouseMove = F2(
	function (a, b) {
		return {$: 'MouseMove', a: a, b: b};
	});
var $author$project$Main$activeRows = function (model) {
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2(
			$elm$core$Dict$get,
			$author$project$Main$activeCountry(model),
			model.rowsByCountry));
};
var $author$project$Main$ClickDay = function (a) {
	return {$: 'ClickDay', a: a};
};
var $author$project$Main$DrillBand = function (a) {
	return {$: 'DrillBand', a: a};
};
var $author$project$Main$HoverSource = function (a) {
	return {$: 'HoverSource', a: a};
};
var $author$project$Main$PinSource = function (a) {
	return {$: 'PinSource', a: a};
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$activeOf = F2(
	function (pinned, hovered) {
		if (!$elm$core$List$isEmpty(pinned)) {
			return pinned;
		} else {
			if (hovered.$ === 'Just') {
				var h = hovered.a;
				return _List_fromArray(
					[h]);
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Energy$SubSource = F3(
	function (name, color, value) {
		return {color: color, name: name, value: value};
	});
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $author$project$Energy$rgb = $avh4$elm_color$Color$rgb255;
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $author$project$Energy$tint = F2(
	function (t, c) {
		var f = function (x) {
			return (t >= 0) ? (x + ((1 - x) * t)) : (x * (1 + t));
		};
		var _v0 = $avh4$elm_color$Color$toRgba(c);
		var blue = _v0.blue;
		var green = _v0.green;
		var red = _v0.red;
		return A3(
			$avh4$elm_color$Color$rgb,
			f(red),
			f(green),
			f(blue));
	});
var $author$project$Energy$bandSubs = function (name) {
	switch (name) {
		case 'Wind':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Onshore',
					A2(
						$author$project$Energy$tint,
						0.12,
						A3($author$project$Energy$rgb, 79, 163, 209)),
					function ($) {
						return $.windOnshore;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Offshore',
					A2(
						$author$project$Energy$tint,
						-0.28,
						A3($author$project$Energy$rgb, 79, 163, 209)),
					function ($) {
						return $.windOffshore;
					})
				]);
		case 'Wasserkraft':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Laufwasser',
					A2(
						$author$project$Energy$tint,
						0.22,
						A3($author$project$Energy$rgb, 46, 111, 149)),
					function ($) {
						return $.hydroRor;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Speicher',
					A3($author$project$Energy$rgb, 46, 111, 149),
					function ($) {
						return $.hydroReservoir;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Pumpspeicher',
					A2(
						$author$project$Energy$tint,
						-0.3,
						A3($author$project$Energy$rgb, 46, 111, 149)),
					function ($) {
						return $.hydroPumped;
					})
				]);
		case 'Biomasse':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Biomasse',
					A3($author$project$Energy$rgb, 91, 168, 91),
					function ($) {
						return $.biomass;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Geothermie',
					A2(
						$author$project$Energy$tint,
						-0.32,
						A3($author$project$Energy$rgb, 91, 168, 91)),
					function ($) {
						return $.geothermal;
					})
				]);
		case 'Kohle':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Braunkohle',
					A2(
						$author$project$Energy$tint,
						-0.18,
						A3($author$project$Energy$rgb, 74, 74, 74)),
					function ($) {
						return $.brownCoal;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Steinkohle',
					A2(
						$author$project$Energy$tint,
						0.28,
						A3($author$project$Energy$rgb, 74, 74, 74)),
					function ($) {
						return $.hardCoal;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Kokereigas',
					A2(
						$author$project$Energy$tint,
						0.55,
						A3($author$project$Energy$rgb, 74, 74, 74)),
					function ($) {
						return $.coalDerivedGas;
					})
				]);
		case 'Gas/Öl':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Gas',
					A2(
						$author$project$Energy$tint,
						0.18,
						A3($author$project$Energy$rgb, 156, 122, 91)),
					function ($) {
						return $.gas;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Öl',
					A2(
						$author$project$Energy$tint,
						-0.32,
						A3($author$project$Energy$rgb, 156, 122, 91)),
					function ($) {
						return $.oil;
					})
				]);
		case 'Sonstige':
			return _List_fromArray(
				[
					A3(
					$author$project$Energy$SubSource,
					'Abfall',
					A2(
						$author$project$Energy$tint,
						0.16,
						A3($author$project$Energy$rgb, 176, 176, 176)),
					function ($) {
						return $.waste;
					}),
					A3(
					$author$project$Energy$SubSource,
					'Sonstige',
					A2(
						$author$project$Energy$tint,
						-0.22,
						A3($author$project$Energy$rgb, 176, 176, 176)),
					function ($) {
						return $.others;
					})
				]);
		default:
			return _List_Nil;
	}
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$chartCard = F5(
	function (index, title, sub, focusNote, chart) {
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-index')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(index)
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								]))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-sub')
						]),
					_Utils_ap(
						sub,
						function () {
							if (focusNote.$ === 'Just') {
								var n = focusNote.a;
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('focus-note')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(n)
											]))
									]);
							} else {
								return _List_Nil;
							}
						}())),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-body')
						]),
					_List_fromArray(
						[chart]))
				]));
	});
var $author$project$Energy$monthNum = function (m) {
	switch (m.$) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var $elm$time$Time$Apr = {$: 'Apr'};
var $elm$time$Time$Aug = {$: 'Aug'};
var $elm$time$Time$Dec = {$: 'Dec'};
var $elm$time$Time$Feb = {$: 'Feb'};
var $elm$time$Time$Jan = {$: 'Jan'};
var $elm$time$Time$Jul = {$: 'Jul'};
var $elm$time$Time$Jun = {$: 'Jun'};
var $elm$time$Time$Mar = {$: 'Mar'};
var $elm$time$Time$May = {$: 'May'};
var $elm$time$Time$Nov = {$: 'Nov'};
var $elm$time$Time$Oct = {$: 'Oct'};
var $elm$time$Time$Sep = {$: 'Sep'};
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_v0) {
			case 1:
				return $elm$time$Time$Jan;
			case 2:
				return $elm$time$Time$Feb;
			case 3:
				return $elm$time$Time$Mar;
			case 4:
				return $elm$time$Time$Apr;
			case 5:
				return $elm$time$Time$May;
			case 6:
				return $elm$time$Time$Jun;
			case 7:
				return $elm$time$Time$Jul;
			case 8:
				return $elm$time$Time$Aug;
			case 9:
				return $elm$time$Time$Sep;
			case 10:
				return $elm$time$Time$Oct;
			case 11:
				return $elm$time$Time$Nov;
			default:
				return $elm$time$Time$Dec;
		}
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Energy$dayLabel = function (dayIndex) {
	var posix = $elm$time$Time$millisToPosix((dayIndex * 86400) * 1000);
	var pad = function (n) {
		return (n < 10) ? ('0' + $elm$core$String$fromInt(n)) : $elm$core$String$fromInt(n);
	};
	var mon = $author$project$Energy$monthNum(
		A2($elm$time$Time$toMonth, $elm$time$Time$utc, posix));
	var d = A2($elm$time$Time$toDay, $elm$time$Time$utc, posix);
	return pad(d) + ('.' + (pad(mon) + '.'));
};
var $author$project$Energy$dayOf = function (unix) {
	return (unix / 86400) | 0;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Energy$decimateTo = F2(
	function (maxPoints, rows) {
		var n = $elm$core$List$length(rows);
		var stride = (maxPoints <= 0) ? 1 : A2(
			$elm$core$Basics$max,
			1,
			$elm$core$Basics$ceiling(n / maxPoints));
		return (stride === 1) ? rows : A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var i = _v0.a;
					return !A2($elm$core$Basics$modBy, stride, i);
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, rows)));
	});
var $author$project$Energy$Renewable = {$: 'Renewable'};
var $author$project$Energy$Band = F4(
	function (name, group, color, value) {
		return {color: color, group: group, name: name, value: value};
	});
var $author$project$Energy$biomassBand = A4(
	$author$project$Energy$Band,
	'Biomasse',
	$author$project$Energy$Renewable,
	A3($author$project$Energy$rgb, 91, 168, 91),
	function (r) {
		return r.biomass + r.geothermal;
	});
var $author$project$Energy$Conventional = {$: 'Conventional'};
var $author$project$Energy$coalBand = A4(
	$author$project$Energy$Band,
	'Kohle',
	$author$project$Energy$Conventional,
	A3($author$project$Energy$rgb, 74, 74, 74),
	function (r) {
		return (r.brownCoal + r.hardCoal) + r.coalDerivedGas;
	});
var $author$project$Energy$gasBand = A4(
	$author$project$Energy$Band,
	'Gas/Öl',
	$author$project$Energy$Conventional,
	A3($author$project$Energy$rgb, 156, 122, 91),
	function (r) {
		return r.gas + r.oil;
	});
var $author$project$Energy$hydroBand = A4(
	$author$project$Energy$Band,
	'Wasserkraft',
	$author$project$Energy$Renewable,
	A3($author$project$Energy$rgb, 46, 111, 149),
	function (r) {
		return (r.hydroRor + r.hydroReservoir) + r.hydroPumped;
	});
var $author$project$Energy$nuclearBand = A4(
	$author$project$Energy$Band,
	'Kernkraft',
	$author$project$Energy$Conventional,
	A3($author$project$Energy$rgb, 184, 111, 184),
	function ($) {
		return $.nuclear;
	});
var $author$project$Energy$otherBand = A4(
	$author$project$Energy$Band,
	'Sonstige',
	$author$project$Energy$Conventional,
	A3($author$project$Energy$rgb, 176, 176, 176),
	function (r) {
		return r.waste + r.others;
	});
var $author$project$Energy$solarBand = A4(
	$author$project$Energy$Band,
	'Solar',
	$author$project$Energy$Renewable,
	A3($author$project$Energy$rgb, 255, 209, 59),
	function ($) {
		return $.solar;
	});
var $author$project$Energy$windBand = A4(
	$author$project$Energy$Band,
	'Wind',
	$author$project$Energy$Renewable,
	A3($author$project$Energy$rgb, 79, 163, 209),
	function (r) {
		return r.windOnshore + r.windOffshore;
	});
var $author$project$Energy$bands = _List_fromArray(
	[$author$project$Energy$solarBand, $author$project$Energy$windBand, $author$project$Energy$hydroBand, $author$project$Energy$biomassBand, $author$project$Energy$nuclearBand, $author$project$Energy$coalBand, $author$project$Energy$gasBand, $author$project$Energy$otherBand]);
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Energy$totalGeneration = function (r) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (b) {
				return b.value(r);
			},
			$author$project$Energy$bands));
};
var $author$project$Energy$metricValue = F2(
	function (m, r) {
		var total = $author$project$Energy$totalGeneration(r);
		switch (m.$) {
			case 'SolarShare':
				return (total <= 0) ? 0 : ((100 * r.solar) / total);
			case 'RenewableShare':
				return (total <= 0) ? 0 : ((100 * $elm$core$List$sum(
					A2(
						$elm$core$List$map,
						function (b) {
							return b.value(r);
						},
						A2(
							$elm$core$List$filter,
							function (b) {
								return _Utils_eq(b.group, $author$project$Energy$Renewable);
							},
							$author$project$Energy$bands)))) / total);
			default:
				return r.load;
		}
	});
var $author$project$Energy$slotOf = F2(
	function (slots, unix) {
		return ((A2($elm$core$Basics$modBy, 86400, unix) * slots) / 86400) | 0;
	});
var $author$project$Energy$heatCells = F3(
	function (metric, slots, rows) {
		var step = F2(
			function (r, acc) {
				var v = A2($author$project$Energy$metricValue, metric, r);
				var key = _Utils_Tuple2(
					$author$project$Energy$dayOf(r.unixSeconds),
					A2($author$project$Energy$slotOf, slots, r.unixSeconds));
				return A3(
					$elm$core$Dict$update,
					key,
					function (existing) {
						if (existing.$ === 'Just') {
							var _v4 = existing.a;
							var sum = _v4.a;
							var n = _v4.b;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(sum + v, n + 1));
						} else {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(v, 1));
						}
					},
					acc);
			});
		return A2(
			$elm$core$List$map,
			function (_v0) {
				var _v1 = _v0.a;
				var day = _v1.a;
				var slot = _v1.b;
				var _v2 = _v0.b;
				var sum = _v2.a;
				var n = _v2.b;
				return {
					day: day,
					slot: slot,
					value: sum / A2($elm$core$Basics$max, 1, n)
				};
			},
			$elm$core$Dict$toList(
				A3($elm$core$List$foldl, step, $elm$core$Dict$empty, rows)));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Energy$heatExtent = function (cells) {
	var vals = A2(
		$elm$core$List$map,
		function ($) {
			return $.value;
		},
		cells);
	return _Utils_Tuple2(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(vals)),
		A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$maximum(vals)));
};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $gampleman$elm_visualization$Scale$Color$mkInterpolator = function (range) {
	var n = $elm$core$Array$length(range);
	return function (t) {
		return A2(
			$elm$core$Maybe$withDefault,
			$avh4$elm_color$Color$black,
			A2(
				$elm$core$Array$get,
				A2(
					$elm$core$Basics$max,
					0,
					A2(
						$elm$core$Basics$min,
						n - 1,
						$elm$core$Basics$floor(t * n))),
				range));
	};
};
var $gampleman$elm_visualization$Scale$Color$infernoInterpolator = $gampleman$elm_visualization$Scale$Color$mkInterpolator(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				A3($avh4$elm_color$Color$rgb255, 0, 0, 4),
				A3($avh4$elm_color$Color$rgb255, 1, 0, 5),
				A3($avh4$elm_color$Color$rgb255, 1, 1, 6),
				A3($avh4$elm_color$Color$rgb255, 1, 1, 8),
				A3($avh4$elm_color$Color$rgb255, 2, 1, 10),
				A3($avh4$elm_color$Color$rgb255, 2, 2, 12),
				A3($avh4$elm_color$Color$rgb255, 2, 2, 14),
				A3($avh4$elm_color$Color$rgb255, 3, 2, 16),
				A3($avh4$elm_color$Color$rgb255, 4, 3, 18),
				A3($avh4$elm_color$Color$rgb255, 4, 3, 20),
				A3($avh4$elm_color$Color$rgb255, 5, 4, 23),
				A3($avh4$elm_color$Color$rgb255, 6, 4, 25),
				A3($avh4$elm_color$Color$rgb255, 7, 5, 27),
				A3($avh4$elm_color$Color$rgb255, 8, 5, 29),
				A3($avh4$elm_color$Color$rgb255, 9, 6, 31),
				A3($avh4$elm_color$Color$rgb255, 10, 7, 34),
				A3($avh4$elm_color$Color$rgb255, 11, 7, 36),
				A3($avh4$elm_color$Color$rgb255, 12, 8, 38),
				A3($avh4$elm_color$Color$rgb255, 13, 8, 41),
				A3($avh4$elm_color$Color$rgb255, 14, 9, 43),
				A3($avh4$elm_color$Color$rgb255, 16, 9, 45),
				A3($avh4$elm_color$Color$rgb255, 17, 10, 48),
				A3($avh4$elm_color$Color$rgb255, 18, 10, 50),
				A3($avh4$elm_color$Color$rgb255, 20, 11, 52),
				A3($avh4$elm_color$Color$rgb255, 21, 11, 55),
				A3($avh4$elm_color$Color$rgb255, 22, 11, 57),
				A3($avh4$elm_color$Color$rgb255, 24, 12, 60),
				A3($avh4$elm_color$Color$rgb255, 25, 12, 62),
				A3($avh4$elm_color$Color$rgb255, 27, 12, 65),
				A3($avh4$elm_color$Color$rgb255, 28, 12, 67),
				A3($avh4$elm_color$Color$rgb255, 30, 12, 69),
				A3($avh4$elm_color$Color$rgb255, 31, 12, 72),
				A3($avh4$elm_color$Color$rgb255, 33, 12, 74),
				A3($avh4$elm_color$Color$rgb255, 35, 12, 76),
				A3($avh4$elm_color$Color$rgb255, 36, 12, 79),
				A3($avh4$elm_color$Color$rgb255, 38, 12, 81),
				A3($avh4$elm_color$Color$rgb255, 40, 11, 83),
				A3($avh4$elm_color$Color$rgb255, 41, 11, 85),
				A3($avh4$elm_color$Color$rgb255, 43, 11, 87),
				A3($avh4$elm_color$Color$rgb255, 45, 11, 89),
				A3($avh4$elm_color$Color$rgb255, 47, 10, 91),
				A3($avh4$elm_color$Color$rgb255, 49, 10, 92),
				A3($avh4$elm_color$Color$rgb255, 50, 10, 94),
				A3($avh4$elm_color$Color$rgb255, 52, 10, 95),
				A3($avh4$elm_color$Color$rgb255, 54, 9, 97),
				A3($avh4$elm_color$Color$rgb255, 56, 9, 98),
				A3($avh4$elm_color$Color$rgb255, 57, 9, 99),
				A3($avh4$elm_color$Color$rgb255, 59, 9, 100),
				A3($avh4$elm_color$Color$rgb255, 61, 9, 101),
				A3($avh4$elm_color$Color$rgb255, 62, 9, 102),
				A3($avh4$elm_color$Color$rgb255, 64, 10, 103),
				A3($avh4$elm_color$Color$rgb255, 66, 10, 104),
				A3($avh4$elm_color$Color$rgb255, 68, 10, 104),
				A3($avh4$elm_color$Color$rgb255, 69, 10, 105),
				A3($avh4$elm_color$Color$rgb255, 71, 11, 106),
				A3($avh4$elm_color$Color$rgb255, 73, 11, 106),
				A3($avh4$elm_color$Color$rgb255, 74, 12, 107),
				A3($avh4$elm_color$Color$rgb255, 76, 12, 107),
				A3($avh4$elm_color$Color$rgb255, 77, 13, 108),
				A3($avh4$elm_color$Color$rgb255, 79, 13, 108),
				A3($avh4$elm_color$Color$rgb255, 81, 14, 108),
				A3($avh4$elm_color$Color$rgb255, 82, 14, 109),
				A3($avh4$elm_color$Color$rgb255, 84, 15, 109),
				A3($avh4$elm_color$Color$rgb255, 85, 15, 109),
				A3($avh4$elm_color$Color$rgb255, 87, 16, 110),
				A3($avh4$elm_color$Color$rgb255, 89, 16, 110),
				A3($avh4$elm_color$Color$rgb255, 90, 17, 110),
				A3($avh4$elm_color$Color$rgb255, 92, 18, 110),
				A3($avh4$elm_color$Color$rgb255, 93, 18, 110),
				A3($avh4$elm_color$Color$rgb255, 95, 19, 110),
				A3($avh4$elm_color$Color$rgb255, 97, 19, 110),
				A3($avh4$elm_color$Color$rgb255, 98, 20, 110),
				A3($avh4$elm_color$Color$rgb255, 100, 21, 110),
				A3($avh4$elm_color$Color$rgb255, 101, 21, 110),
				A3($avh4$elm_color$Color$rgb255, 103, 22, 110),
				A3($avh4$elm_color$Color$rgb255, 105, 22, 110),
				A3($avh4$elm_color$Color$rgb255, 106, 23, 110),
				A3($avh4$elm_color$Color$rgb255, 108, 24, 110),
				A3($avh4$elm_color$Color$rgb255, 109, 24, 110),
				A3($avh4$elm_color$Color$rgb255, 111, 25, 110),
				A3($avh4$elm_color$Color$rgb255, 113, 25, 110),
				A3($avh4$elm_color$Color$rgb255, 114, 26, 110),
				A3($avh4$elm_color$Color$rgb255, 116, 26, 110),
				A3($avh4$elm_color$Color$rgb255, 117, 27, 110),
				A3($avh4$elm_color$Color$rgb255, 119, 28, 109),
				A3($avh4$elm_color$Color$rgb255, 120, 28, 109),
				A3($avh4$elm_color$Color$rgb255, 122, 29, 109),
				A3($avh4$elm_color$Color$rgb255, 124, 29, 109),
				A3($avh4$elm_color$Color$rgb255, 125, 30, 109),
				A3($avh4$elm_color$Color$rgb255, 127, 30, 108),
				A3($avh4$elm_color$Color$rgb255, 128, 31, 108),
				A3($avh4$elm_color$Color$rgb255, 130, 32, 108),
				A3($avh4$elm_color$Color$rgb255, 132, 32, 107),
				A3($avh4$elm_color$Color$rgb255, 133, 33, 107),
				A3($avh4$elm_color$Color$rgb255, 135, 33, 107),
				A3($avh4$elm_color$Color$rgb255, 136, 34, 106),
				A3($avh4$elm_color$Color$rgb255, 138, 34, 106),
				A3($avh4$elm_color$Color$rgb255, 140, 35, 105),
				A3($avh4$elm_color$Color$rgb255, 141, 35, 105),
				A3($avh4$elm_color$Color$rgb255, 143, 36, 105),
				A3($avh4$elm_color$Color$rgb255, 144, 37, 104),
				A3($avh4$elm_color$Color$rgb255, 146, 37, 104),
				A3($avh4$elm_color$Color$rgb255, 147, 38, 103),
				A3($avh4$elm_color$Color$rgb255, 149, 38, 103),
				A3($avh4$elm_color$Color$rgb255, 151, 39, 102),
				A3($avh4$elm_color$Color$rgb255, 152, 39, 102),
				A3($avh4$elm_color$Color$rgb255, 154, 40, 101),
				A3($avh4$elm_color$Color$rgb255, 155, 41, 100),
				A3($avh4$elm_color$Color$rgb255, 157, 41, 100),
				A3($avh4$elm_color$Color$rgb255, 159, 42, 99),
				A3($avh4$elm_color$Color$rgb255, 160, 42, 99),
				A3($avh4$elm_color$Color$rgb255, 162, 43, 98),
				A3($avh4$elm_color$Color$rgb255, 163, 44, 97),
				A3($avh4$elm_color$Color$rgb255, 165, 44, 96),
				A3($avh4$elm_color$Color$rgb255, 166, 45, 96),
				A3($avh4$elm_color$Color$rgb255, 168, 46, 95),
				A3($avh4$elm_color$Color$rgb255, 169, 46, 94),
				A3($avh4$elm_color$Color$rgb255, 171, 47, 94),
				A3($avh4$elm_color$Color$rgb255, 173, 48, 93),
				A3($avh4$elm_color$Color$rgb255, 174, 48, 92),
				A3($avh4$elm_color$Color$rgb255, 176, 49, 91),
				A3($avh4$elm_color$Color$rgb255, 177, 50, 90),
				A3($avh4$elm_color$Color$rgb255, 179, 50, 90),
				A3($avh4$elm_color$Color$rgb255, 180, 51, 89),
				A3($avh4$elm_color$Color$rgb255, 182, 52, 88),
				A3($avh4$elm_color$Color$rgb255, 183, 53, 87),
				A3($avh4$elm_color$Color$rgb255, 185, 53, 86),
				A3($avh4$elm_color$Color$rgb255, 186, 54, 85),
				A3($avh4$elm_color$Color$rgb255, 188, 55, 84),
				A3($avh4$elm_color$Color$rgb255, 189, 56, 83),
				A3($avh4$elm_color$Color$rgb255, 191, 57, 82),
				A3($avh4$elm_color$Color$rgb255, 192, 58, 81),
				A3($avh4$elm_color$Color$rgb255, 193, 58, 80),
				A3($avh4$elm_color$Color$rgb255, 195, 59, 79),
				A3($avh4$elm_color$Color$rgb255, 196, 60, 78),
				A3($avh4$elm_color$Color$rgb255, 198, 61, 77),
				A3($avh4$elm_color$Color$rgb255, 199, 62, 76),
				A3($avh4$elm_color$Color$rgb255, 200, 63, 75),
				A3($avh4$elm_color$Color$rgb255, 202, 64, 74),
				A3($avh4$elm_color$Color$rgb255, 203, 65, 73),
				A3($avh4$elm_color$Color$rgb255, 204, 66, 72),
				A3($avh4$elm_color$Color$rgb255, 206, 67, 71),
				A3($avh4$elm_color$Color$rgb255, 207, 68, 70),
				A3($avh4$elm_color$Color$rgb255, 208, 69, 69),
				A3($avh4$elm_color$Color$rgb255, 210, 70, 68),
				A3($avh4$elm_color$Color$rgb255, 211, 71, 67),
				A3($avh4$elm_color$Color$rgb255, 212, 72, 66),
				A3($avh4$elm_color$Color$rgb255, 213, 74, 65),
				A3($avh4$elm_color$Color$rgb255, 215, 75, 63),
				A3($avh4$elm_color$Color$rgb255, 216, 76, 62),
				A3($avh4$elm_color$Color$rgb255, 217, 77, 61),
				A3($avh4$elm_color$Color$rgb255, 218, 78, 60),
				A3($avh4$elm_color$Color$rgb255, 219, 80, 59),
				A3($avh4$elm_color$Color$rgb255, 221, 81, 58),
				A3($avh4$elm_color$Color$rgb255, 222, 82, 56),
				A3($avh4$elm_color$Color$rgb255, 223, 83, 55),
				A3($avh4$elm_color$Color$rgb255, 224, 85, 54),
				A3($avh4$elm_color$Color$rgb255, 225, 86, 53),
				A3($avh4$elm_color$Color$rgb255, 226, 87, 52),
				A3($avh4$elm_color$Color$rgb255, 227, 89, 51),
				A3($avh4$elm_color$Color$rgb255, 228, 90, 49),
				A3($avh4$elm_color$Color$rgb255, 229, 92, 48),
				A3($avh4$elm_color$Color$rgb255, 230, 93, 47),
				A3($avh4$elm_color$Color$rgb255, 231, 94, 46),
				A3($avh4$elm_color$Color$rgb255, 232, 96, 45),
				A3($avh4$elm_color$Color$rgb255, 233, 97, 43),
				A3($avh4$elm_color$Color$rgb255, 234, 99, 42),
				A3($avh4$elm_color$Color$rgb255, 235, 100, 41),
				A3($avh4$elm_color$Color$rgb255, 235, 102, 40),
				A3($avh4$elm_color$Color$rgb255, 236, 103, 38),
				A3($avh4$elm_color$Color$rgb255, 237, 105, 37),
				A3($avh4$elm_color$Color$rgb255, 238, 106, 36),
				A3($avh4$elm_color$Color$rgb255, 239, 108, 35),
				A3($avh4$elm_color$Color$rgb255, 239, 110, 33),
				A3($avh4$elm_color$Color$rgb255, 240, 111, 32),
				A3($avh4$elm_color$Color$rgb255, 241, 113, 31),
				A3($avh4$elm_color$Color$rgb255, 241, 115, 29),
				A3($avh4$elm_color$Color$rgb255, 242, 116, 28),
				A3($avh4$elm_color$Color$rgb255, 243, 118, 27),
				A3($avh4$elm_color$Color$rgb255, 243, 120, 25),
				A3($avh4$elm_color$Color$rgb255, 244, 121, 24),
				A3($avh4$elm_color$Color$rgb255, 245, 123, 23),
				A3($avh4$elm_color$Color$rgb255, 245, 125, 21),
				A3($avh4$elm_color$Color$rgb255, 246, 126, 20),
				A3($avh4$elm_color$Color$rgb255, 246, 128, 19),
				A3($avh4$elm_color$Color$rgb255, 247, 130, 18),
				A3($avh4$elm_color$Color$rgb255, 247, 132, 16),
				A3($avh4$elm_color$Color$rgb255, 248, 133, 15),
				A3($avh4$elm_color$Color$rgb255, 248, 135, 14),
				A3($avh4$elm_color$Color$rgb255, 248, 137, 12),
				A3($avh4$elm_color$Color$rgb255, 249, 139, 11),
				A3($avh4$elm_color$Color$rgb255, 249, 140, 10),
				A3($avh4$elm_color$Color$rgb255, 249, 142, 9),
				A3($avh4$elm_color$Color$rgb255, 250, 144, 8),
				A3($avh4$elm_color$Color$rgb255, 250, 146, 7),
				A3($avh4$elm_color$Color$rgb255, 250, 148, 7),
				A3($avh4$elm_color$Color$rgb255, 251, 150, 6),
				A3($avh4$elm_color$Color$rgb255, 251, 151, 6),
				A3($avh4$elm_color$Color$rgb255, 251, 153, 6),
				A3($avh4$elm_color$Color$rgb255, 251, 155, 6),
				A3($avh4$elm_color$Color$rgb255, 251, 157, 7),
				A3($avh4$elm_color$Color$rgb255, 252, 159, 7),
				A3($avh4$elm_color$Color$rgb255, 252, 161, 8),
				A3($avh4$elm_color$Color$rgb255, 252, 163, 9),
				A3($avh4$elm_color$Color$rgb255, 252, 165, 10),
				A3($avh4$elm_color$Color$rgb255, 252, 166, 12),
				A3($avh4$elm_color$Color$rgb255, 252, 168, 13),
				A3($avh4$elm_color$Color$rgb255, 252, 170, 15),
				A3($avh4$elm_color$Color$rgb255, 252, 172, 17),
				A3($avh4$elm_color$Color$rgb255, 252, 174, 18),
				A3($avh4$elm_color$Color$rgb255, 252, 176, 20),
				A3($avh4$elm_color$Color$rgb255, 252, 178, 22),
				A3($avh4$elm_color$Color$rgb255, 252, 180, 24),
				A3($avh4$elm_color$Color$rgb255, 251, 182, 26),
				A3($avh4$elm_color$Color$rgb255, 251, 184, 29),
				A3($avh4$elm_color$Color$rgb255, 251, 186, 31),
				A3($avh4$elm_color$Color$rgb255, 251, 188, 33),
				A3($avh4$elm_color$Color$rgb255, 251, 190, 35),
				A3($avh4$elm_color$Color$rgb255, 250, 192, 38),
				A3($avh4$elm_color$Color$rgb255, 250, 194, 40),
				A3($avh4$elm_color$Color$rgb255, 250, 196, 42),
				A3($avh4$elm_color$Color$rgb255, 250, 198, 45),
				A3($avh4$elm_color$Color$rgb255, 249, 199, 47),
				A3($avh4$elm_color$Color$rgb255, 249, 201, 50),
				A3($avh4$elm_color$Color$rgb255, 249, 203, 53),
				A3($avh4$elm_color$Color$rgb255, 248, 205, 55),
				A3($avh4$elm_color$Color$rgb255, 248, 207, 58),
				A3($avh4$elm_color$Color$rgb255, 247, 209, 61),
				A3($avh4$elm_color$Color$rgb255, 247, 211, 64),
				A3($avh4$elm_color$Color$rgb255, 246, 213, 67),
				A3($avh4$elm_color$Color$rgb255, 246, 215, 70),
				A3($avh4$elm_color$Color$rgb255, 245, 217, 73),
				A3($avh4$elm_color$Color$rgb255, 245, 219, 76),
				A3($avh4$elm_color$Color$rgb255, 244, 221, 79),
				A3($avh4$elm_color$Color$rgb255, 244, 223, 83),
				A3($avh4$elm_color$Color$rgb255, 244, 225, 86),
				A3($avh4$elm_color$Color$rgb255, 243, 227, 90),
				A3($avh4$elm_color$Color$rgb255, 243, 229, 93),
				A3($avh4$elm_color$Color$rgb255, 242, 230, 97),
				A3($avh4$elm_color$Color$rgb255, 242, 232, 101),
				A3($avh4$elm_color$Color$rgb255, 242, 234, 105),
				A3($avh4$elm_color$Color$rgb255, 241, 236, 109),
				A3($avh4$elm_color$Color$rgb255, 241, 237, 113),
				A3($avh4$elm_color$Color$rgb255, 241, 239, 117),
				A3($avh4$elm_color$Color$rgb255, 241, 241, 121),
				A3($avh4$elm_color$Color$rgb255, 242, 242, 125),
				A3($avh4$elm_color$Color$rgb255, 242, 244, 130),
				A3($avh4$elm_color$Color$rgb255, 243, 245, 134),
				A3($avh4$elm_color$Color$rgb255, 243, 246, 138),
				A3($avh4$elm_color$Color$rgb255, 244, 248, 142),
				A3($avh4$elm_color$Color$rgb255, 245, 249, 146),
				A3($avh4$elm_color$Color$rgb255, 246, 250, 150),
				A3($avh4$elm_color$Color$rgb255, 248, 251, 154),
				A3($avh4$elm_color$Color$rgb255, 249, 252, 157),
				A3($avh4$elm_color$Color$rgb255, 250, 253, 161),
				A3($avh4$elm_color$Color$rgb255, 252, 255, 164)
			])));
var $gampleman$elm_visualization$Scale$Color$plasmaInterpolator = $gampleman$elm_visualization$Scale$Color$mkInterpolator(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				A3($avh4$elm_color$Color$rgb255, 13, 8, 135),
				A3($avh4$elm_color$Color$rgb255, 16, 7, 136),
				A3($avh4$elm_color$Color$rgb255, 19, 7, 137),
				A3($avh4$elm_color$Color$rgb255, 22, 7, 138),
				A3($avh4$elm_color$Color$rgb255, 25, 6, 140),
				A3($avh4$elm_color$Color$rgb255, 27, 6, 141),
				A3($avh4$elm_color$Color$rgb255, 29, 6, 142),
				A3($avh4$elm_color$Color$rgb255, 32, 6, 143),
				A3($avh4$elm_color$Color$rgb255, 34, 6, 144),
				A3($avh4$elm_color$Color$rgb255, 36, 6, 145),
				A3($avh4$elm_color$Color$rgb255, 38, 5, 145),
				A3($avh4$elm_color$Color$rgb255, 40, 5, 146),
				A3($avh4$elm_color$Color$rgb255, 42, 5, 147),
				A3($avh4$elm_color$Color$rgb255, 44, 5, 148),
				A3($avh4$elm_color$Color$rgb255, 46, 5, 149),
				A3($avh4$elm_color$Color$rgb255, 47, 5, 150),
				A3($avh4$elm_color$Color$rgb255, 49, 5, 151),
				A3($avh4$elm_color$Color$rgb255, 51, 5, 151),
				A3($avh4$elm_color$Color$rgb255, 53, 4, 152),
				A3($avh4$elm_color$Color$rgb255, 55, 4, 153),
				A3($avh4$elm_color$Color$rgb255, 56, 4, 154),
				A3($avh4$elm_color$Color$rgb255, 58, 4, 154),
				A3($avh4$elm_color$Color$rgb255, 60, 4, 155),
				A3($avh4$elm_color$Color$rgb255, 62, 4, 156),
				A3($avh4$elm_color$Color$rgb255, 63, 4, 156),
				A3($avh4$elm_color$Color$rgb255, 65, 4, 157),
				A3($avh4$elm_color$Color$rgb255, 67, 3, 158),
				A3($avh4$elm_color$Color$rgb255, 68, 3, 158),
				A3($avh4$elm_color$Color$rgb255, 70, 3, 159),
				A3($avh4$elm_color$Color$rgb255, 72, 3, 159),
				A3($avh4$elm_color$Color$rgb255, 73, 3, 160),
				A3($avh4$elm_color$Color$rgb255, 75, 3, 161),
				A3($avh4$elm_color$Color$rgb255, 76, 2, 161),
				A3($avh4$elm_color$Color$rgb255, 78, 2, 162),
				A3($avh4$elm_color$Color$rgb255, 80, 2, 162),
				A3($avh4$elm_color$Color$rgb255, 81, 2, 163),
				A3($avh4$elm_color$Color$rgb255, 83, 2, 163),
				A3($avh4$elm_color$Color$rgb255, 85, 2, 164),
				A3($avh4$elm_color$Color$rgb255, 86, 1, 164),
				A3($avh4$elm_color$Color$rgb255, 88, 1, 164),
				A3($avh4$elm_color$Color$rgb255, 89, 1, 165),
				A3($avh4$elm_color$Color$rgb255, 91, 1, 165),
				A3($avh4$elm_color$Color$rgb255, 92, 1, 166),
				A3($avh4$elm_color$Color$rgb255, 94, 1, 166),
				A3($avh4$elm_color$Color$rgb255, 96, 1, 166),
				A3($avh4$elm_color$Color$rgb255, 97, 0, 167),
				A3($avh4$elm_color$Color$rgb255, 99, 0, 167),
				A3($avh4$elm_color$Color$rgb255, 100, 0, 167),
				A3($avh4$elm_color$Color$rgb255, 102, 0, 167),
				A3($avh4$elm_color$Color$rgb255, 103, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 105, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 106, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 108, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 110, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 111, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 113, 0, 168),
				A3($avh4$elm_color$Color$rgb255, 114, 1, 168),
				A3($avh4$elm_color$Color$rgb255, 116, 1, 168),
				A3($avh4$elm_color$Color$rgb255, 117, 1, 168),
				A3($avh4$elm_color$Color$rgb255, 119, 1, 168),
				A3($avh4$elm_color$Color$rgb255, 120, 1, 168),
				A3($avh4$elm_color$Color$rgb255, 122, 2, 168),
				A3($avh4$elm_color$Color$rgb255, 123, 2, 168),
				A3($avh4$elm_color$Color$rgb255, 125, 3, 168),
				A3($avh4$elm_color$Color$rgb255, 126, 3, 168),
				A3($avh4$elm_color$Color$rgb255, 128, 4, 168),
				A3($avh4$elm_color$Color$rgb255, 129, 4, 167),
				A3($avh4$elm_color$Color$rgb255, 131, 5, 167),
				A3($avh4$elm_color$Color$rgb255, 132, 5, 167),
				A3($avh4$elm_color$Color$rgb255, 134, 6, 166),
				A3($avh4$elm_color$Color$rgb255, 135, 7, 166),
				A3($avh4$elm_color$Color$rgb255, 136, 8, 166),
				A3($avh4$elm_color$Color$rgb255, 138, 9, 165),
				A3($avh4$elm_color$Color$rgb255, 139, 10, 165),
				A3($avh4$elm_color$Color$rgb255, 141, 11, 165),
				A3($avh4$elm_color$Color$rgb255, 142, 12, 164),
				A3($avh4$elm_color$Color$rgb255, 143, 13, 164),
				A3($avh4$elm_color$Color$rgb255, 145, 14, 163),
				A3($avh4$elm_color$Color$rgb255, 146, 15, 163),
				A3($avh4$elm_color$Color$rgb255, 148, 16, 162),
				A3($avh4$elm_color$Color$rgb255, 149, 17, 161),
				A3($avh4$elm_color$Color$rgb255, 150, 19, 161),
				A3($avh4$elm_color$Color$rgb255, 152, 20, 160),
				A3($avh4$elm_color$Color$rgb255, 153, 21, 159),
				A3($avh4$elm_color$Color$rgb255, 154, 22, 159),
				A3($avh4$elm_color$Color$rgb255, 156, 23, 158),
				A3($avh4$elm_color$Color$rgb255, 157, 24, 157),
				A3($avh4$elm_color$Color$rgb255, 158, 25, 157),
				A3($avh4$elm_color$Color$rgb255, 160, 26, 156),
				A3($avh4$elm_color$Color$rgb255, 161, 27, 155),
				A3($avh4$elm_color$Color$rgb255, 162, 29, 154),
				A3($avh4$elm_color$Color$rgb255, 163, 30, 154),
				A3($avh4$elm_color$Color$rgb255, 165, 31, 153),
				A3($avh4$elm_color$Color$rgb255, 166, 32, 152),
				A3($avh4$elm_color$Color$rgb255, 167, 33, 151),
				A3($avh4$elm_color$Color$rgb255, 168, 34, 150),
				A3($avh4$elm_color$Color$rgb255, 170, 35, 149),
				A3($avh4$elm_color$Color$rgb255, 171, 36, 148),
				A3($avh4$elm_color$Color$rgb255, 172, 38, 148),
				A3($avh4$elm_color$Color$rgb255, 173, 39, 147),
				A3($avh4$elm_color$Color$rgb255, 174, 40, 146),
				A3($avh4$elm_color$Color$rgb255, 176, 41, 145),
				A3($avh4$elm_color$Color$rgb255, 177, 42, 144),
				A3($avh4$elm_color$Color$rgb255, 178, 43, 143),
				A3($avh4$elm_color$Color$rgb255, 179, 44, 142),
				A3($avh4$elm_color$Color$rgb255, 180, 46, 141),
				A3($avh4$elm_color$Color$rgb255, 181, 47, 140),
				A3($avh4$elm_color$Color$rgb255, 182, 48, 139),
				A3($avh4$elm_color$Color$rgb255, 183, 49, 138),
				A3($avh4$elm_color$Color$rgb255, 184, 50, 137),
				A3($avh4$elm_color$Color$rgb255, 186, 51, 136),
				A3($avh4$elm_color$Color$rgb255, 187, 52, 136),
				A3($avh4$elm_color$Color$rgb255, 188, 53, 135),
				A3($avh4$elm_color$Color$rgb255, 189, 55, 134),
				A3($avh4$elm_color$Color$rgb255, 190, 56, 133),
				A3($avh4$elm_color$Color$rgb255, 191, 57, 132),
				A3($avh4$elm_color$Color$rgb255, 192, 58, 131),
				A3($avh4$elm_color$Color$rgb255, 193, 59, 130),
				A3($avh4$elm_color$Color$rgb255, 194, 60, 129),
				A3($avh4$elm_color$Color$rgb255, 195, 61, 128),
				A3($avh4$elm_color$Color$rgb255, 196, 62, 127),
				A3($avh4$elm_color$Color$rgb255, 197, 64, 126),
				A3($avh4$elm_color$Color$rgb255, 198, 65, 125),
				A3($avh4$elm_color$Color$rgb255, 199, 66, 124),
				A3($avh4$elm_color$Color$rgb255, 200, 67, 123),
				A3($avh4$elm_color$Color$rgb255, 201, 68, 122),
				A3($avh4$elm_color$Color$rgb255, 202, 69, 122),
				A3($avh4$elm_color$Color$rgb255, 203, 70, 121),
				A3($avh4$elm_color$Color$rgb255, 204, 71, 120),
				A3($avh4$elm_color$Color$rgb255, 204, 73, 119),
				A3($avh4$elm_color$Color$rgb255, 205, 74, 118),
				A3($avh4$elm_color$Color$rgb255, 206, 75, 117),
				A3($avh4$elm_color$Color$rgb255, 207, 76, 116),
				A3($avh4$elm_color$Color$rgb255, 208, 77, 115),
				A3($avh4$elm_color$Color$rgb255, 209, 78, 114),
				A3($avh4$elm_color$Color$rgb255, 210, 79, 113),
				A3($avh4$elm_color$Color$rgb255, 211, 81, 113),
				A3($avh4$elm_color$Color$rgb255, 212, 82, 112),
				A3($avh4$elm_color$Color$rgb255, 213, 83, 111),
				A3($avh4$elm_color$Color$rgb255, 213, 84, 110),
				A3($avh4$elm_color$Color$rgb255, 214, 85, 109),
				A3($avh4$elm_color$Color$rgb255, 215, 86, 108),
				A3($avh4$elm_color$Color$rgb255, 216, 87, 107),
				A3($avh4$elm_color$Color$rgb255, 217, 88, 106),
				A3($avh4$elm_color$Color$rgb255, 218, 90, 106),
				A3($avh4$elm_color$Color$rgb255, 218, 91, 105),
				A3($avh4$elm_color$Color$rgb255, 219, 92, 104),
				A3($avh4$elm_color$Color$rgb255, 220, 93, 103),
				A3($avh4$elm_color$Color$rgb255, 221, 94, 102),
				A3($avh4$elm_color$Color$rgb255, 222, 95, 101),
				A3($avh4$elm_color$Color$rgb255, 222, 97, 100),
				A3($avh4$elm_color$Color$rgb255, 223, 98, 99),
				A3($avh4$elm_color$Color$rgb255, 224, 99, 99),
				A3($avh4$elm_color$Color$rgb255, 225, 100, 98),
				A3($avh4$elm_color$Color$rgb255, 226, 101, 97),
				A3($avh4$elm_color$Color$rgb255, 226, 102, 96),
				A3($avh4$elm_color$Color$rgb255, 227, 104, 95),
				A3($avh4$elm_color$Color$rgb255, 228, 105, 94),
				A3($avh4$elm_color$Color$rgb255, 229, 106, 93),
				A3($avh4$elm_color$Color$rgb255, 229, 107, 93),
				A3($avh4$elm_color$Color$rgb255, 230, 108, 92),
				A3($avh4$elm_color$Color$rgb255, 231, 110, 91),
				A3($avh4$elm_color$Color$rgb255, 231, 111, 90),
				A3($avh4$elm_color$Color$rgb255, 232, 112, 89),
				A3($avh4$elm_color$Color$rgb255, 233, 113, 88),
				A3($avh4$elm_color$Color$rgb255, 233, 114, 87),
				A3($avh4$elm_color$Color$rgb255, 234, 116, 87),
				A3($avh4$elm_color$Color$rgb255, 235, 117, 86),
				A3($avh4$elm_color$Color$rgb255, 235, 118, 85),
				A3($avh4$elm_color$Color$rgb255, 236, 119, 84),
				A3($avh4$elm_color$Color$rgb255, 237, 121, 83),
				A3($avh4$elm_color$Color$rgb255, 237, 122, 82),
				A3($avh4$elm_color$Color$rgb255, 238, 123, 81),
				A3($avh4$elm_color$Color$rgb255, 239, 124, 81),
				A3($avh4$elm_color$Color$rgb255, 239, 126, 80),
				A3($avh4$elm_color$Color$rgb255, 240, 127, 79),
				A3($avh4$elm_color$Color$rgb255, 240, 128, 78),
				A3($avh4$elm_color$Color$rgb255, 241, 129, 77),
				A3($avh4$elm_color$Color$rgb255, 241, 131, 76),
				A3($avh4$elm_color$Color$rgb255, 242, 132, 75),
				A3($avh4$elm_color$Color$rgb255, 243, 133, 75),
				A3($avh4$elm_color$Color$rgb255, 243, 135, 74),
				A3($avh4$elm_color$Color$rgb255, 244, 136, 73),
				A3($avh4$elm_color$Color$rgb255, 244, 137, 72),
				A3($avh4$elm_color$Color$rgb255, 245, 139, 71),
				A3($avh4$elm_color$Color$rgb255, 245, 140, 70),
				A3($avh4$elm_color$Color$rgb255, 246, 141, 69),
				A3($avh4$elm_color$Color$rgb255, 246, 143, 68),
				A3($avh4$elm_color$Color$rgb255, 247, 144, 68),
				A3($avh4$elm_color$Color$rgb255, 247, 145, 67),
				A3($avh4$elm_color$Color$rgb255, 247, 147, 66),
				A3($avh4$elm_color$Color$rgb255, 248, 148, 65),
				A3($avh4$elm_color$Color$rgb255, 248, 149, 64),
				A3($avh4$elm_color$Color$rgb255, 249, 151, 63),
				A3($avh4$elm_color$Color$rgb255, 249, 152, 62),
				A3($avh4$elm_color$Color$rgb255, 249, 154, 62),
				A3($avh4$elm_color$Color$rgb255, 250, 155, 61),
				A3($avh4$elm_color$Color$rgb255, 250, 156, 60),
				A3($avh4$elm_color$Color$rgb255, 250, 158, 59),
				A3($avh4$elm_color$Color$rgb255, 251, 159, 58),
				A3($avh4$elm_color$Color$rgb255, 251, 161, 57),
				A3($avh4$elm_color$Color$rgb255, 251, 162, 56),
				A3($avh4$elm_color$Color$rgb255, 252, 163, 56),
				A3($avh4$elm_color$Color$rgb255, 252, 165, 55),
				A3($avh4$elm_color$Color$rgb255, 252, 166, 54),
				A3($avh4$elm_color$Color$rgb255, 252, 168, 53),
				A3($avh4$elm_color$Color$rgb255, 252, 169, 52),
				A3($avh4$elm_color$Color$rgb255, 253, 171, 51),
				A3($avh4$elm_color$Color$rgb255, 253, 172, 51),
				A3($avh4$elm_color$Color$rgb255, 253, 174, 50),
				A3($avh4$elm_color$Color$rgb255, 253, 175, 49),
				A3($avh4$elm_color$Color$rgb255, 253, 177, 48),
				A3($avh4$elm_color$Color$rgb255, 253, 178, 47),
				A3($avh4$elm_color$Color$rgb255, 253, 180, 47),
				A3($avh4$elm_color$Color$rgb255, 253, 181, 46),
				A3($avh4$elm_color$Color$rgb255, 254, 183, 45),
				A3($avh4$elm_color$Color$rgb255, 254, 184, 44),
				A3($avh4$elm_color$Color$rgb255, 254, 186, 44),
				A3($avh4$elm_color$Color$rgb255, 254, 187, 43),
				A3($avh4$elm_color$Color$rgb255, 254, 189, 42),
				A3($avh4$elm_color$Color$rgb255, 254, 190, 42),
				A3($avh4$elm_color$Color$rgb255, 254, 192, 41),
				A3($avh4$elm_color$Color$rgb255, 253, 194, 41),
				A3($avh4$elm_color$Color$rgb255, 253, 195, 40),
				A3($avh4$elm_color$Color$rgb255, 253, 197, 39),
				A3($avh4$elm_color$Color$rgb255, 253, 198, 39),
				A3($avh4$elm_color$Color$rgb255, 253, 200, 39),
				A3($avh4$elm_color$Color$rgb255, 253, 202, 38),
				A3($avh4$elm_color$Color$rgb255, 253, 203, 38),
				A3($avh4$elm_color$Color$rgb255, 252, 205, 37),
				A3($avh4$elm_color$Color$rgb255, 252, 206, 37),
				A3($avh4$elm_color$Color$rgb255, 252, 208, 37),
				A3($avh4$elm_color$Color$rgb255, 252, 210, 37),
				A3($avh4$elm_color$Color$rgb255, 251, 211, 36),
				A3($avh4$elm_color$Color$rgb255, 251, 213, 36),
				A3($avh4$elm_color$Color$rgb255, 251, 215, 36),
				A3($avh4$elm_color$Color$rgb255, 250, 216, 36),
				A3($avh4$elm_color$Color$rgb255, 250, 218, 36),
				A3($avh4$elm_color$Color$rgb255, 249, 220, 36),
				A3($avh4$elm_color$Color$rgb255, 249, 221, 37),
				A3($avh4$elm_color$Color$rgb255, 248, 223, 37),
				A3($avh4$elm_color$Color$rgb255, 248, 225, 37),
				A3($avh4$elm_color$Color$rgb255, 247, 226, 37),
				A3($avh4$elm_color$Color$rgb255, 247, 228, 37),
				A3($avh4$elm_color$Color$rgb255, 246, 230, 38),
				A3($avh4$elm_color$Color$rgb255, 246, 232, 38),
				A3($avh4$elm_color$Color$rgb255, 245, 233, 38),
				A3($avh4$elm_color$Color$rgb255, 245, 235, 39),
				A3($avh4$elm_color$Color$rgb255, 244, 237, 39),
				A3($avh4$elm_color$Color$rgb255, 243, 238, 39),
				A3($avh4$elm_color$Color$rgb255, 243, 240, 39),
				A3($avh4$elm_color$Color$rgb255, 242, 242, 39),
				A3($avh4$elm_color$Color$rgb255, 241, 244, 38),
				A3($avh4$elm_color$Color$rgb255, 241, 245, 37),
				A3($avh4$elm_color$Color$rgb255, 240, 247, 36),
				A3($avh4$elm_color$Color$rgb255, 240, 249, 33)
			])));
var $gampleman$elm_visualization$Scale$Color$viridisInterpolator = $gampleman$elm_visualization$Scale$Color$mkInterpolator(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				A3($avh4$elm_color$Color$rgb255, 68, 1, 84),
				A3($avh4$elm_color$Color$rgb255, 68, 2, 86),
				A3($avh4$elm_color$Color$rgb255, 69, 4, 87),
				A3($avh4$elm_color$Color$rgb255, 69, 5, 89),
				A3($avh4$elm_color$Color$rgb255, 70, 7, 90),
				A3($avh4$elm_color$Color$rgb255, 70, 8, 92),
				A3($avh4$elm_color$Color$rgb255, 70, 10, 93),
				A3($avh4$elm_color$Color$rgb255, 70, 11, 94),
				A3($avh4$elm_color$Color$rgb255, 71, 13, 96),
				A3($avh4$elm_color$Color$rgb255, 71, 14, 97),
				A3($avh4$elm_color$Color$rgb255, 71, 16, 99),
				A3($avh4$elm_color$Color$rgb255, 71, 17, 100),
				A3($avh4$elm_color$Color$rgb255, 71, 19, 101),
				A3($avh4$elm_color$Color$rgb255, 72, 20, 103),
				A3($avh4$elm_color$Color$rgb255, 72, 22, 104),
				A3($avh4$elm_color$Color$rgb255, 72, 23, 105),
				A3($avh4$elm_color$Color$rgb255, 72, 24, 106),
				A3($avh4$elm_color$Color$rgb255, 72, 26, 108),
				A3($avh4$elm_color$Color$rgb255, 72, 27, 109),
				A3($avh4$elm_color$Color$rgb255, 72, 28, 110),
				A3($avh4$elm_color$Color$rgb255, 72, 29, 111),
				A3($avh4$elm_color$Color$rgb255, 72, 31, 112),
				A3($avh4$elm_color$Color$rgb255, 72, 32, 113),
				A3($avh4$elm_color$Color$rgb255, 72, 33, 115),
				A3($avh4$elm_color$Color$rgb255, 72, 35, 116),
				A3($avh4$elm_color$Color$rgb255, 72, 36, 117),
				A3($avh4$elm_color$Color$rgb255, 72, 37, 118),
				A3($avh4$elm_color$Color$rgb255, 72, 38, 119),
				A3($avh4$elm_color$Color$rgb255, 72, 40, 120),
				A3($avh4$elm_color$Color$rgb255, 72, 41, 121),
				A3($avh4$elm_color$Color$rgb255, 71, 42, 122),
				A3($avh4$elm_color$Color$rgb255, 71, 44, 122),
				A3($avh4$elm_color$Color$rgb255, 71, 45, 123),
				A3($avh4$elm_color$Color$rgb255, 71, 46, 124),
				A3($avh4$elm_color$Color$rgb255, 71, 47, 125),
				A3($avh4$elm_color$Color$rgb255, 70, 48, 126),
				A3($avh4$elm_color$Color$rgb255, 70, 50, 126),
				A3($avh4$elm_color$Color$rgb255, 70, 51, 127),
				A3($avh4$elm_color$Color$rgb255, 70, 52, 128),
				A3($avh4$elm_color$Color$rgb255, 69, 53, 129),
				A3($avh4$elm_color$Color$rgb255, 69, 55, 129),
				A3($avh4$elm_color$Color$rgb255, 69, 56, 130),
				A3($avh4$elm_color$Color$rgb255, 68, 57, 131),
				A3($avh4$elm_color$Color$rgb255, 68, 58, 131),
				A3($avh4$elm_color$Color$rgb255, 68, 59, 132),
				A3($avh4$elm_color$Color$rgb255, 67, 61, 132),
				A3($avh4$elm_color$Color$rgb255, 67, 62, 133),
				A3($avh4$elm_color$Color$rgb255, 66, 63, 133),
				A3($avh4$elm_color$Color$rgb255, 66, 64, 134),
				A3($avh4$elm_color$Color$rgb255, 66, 65, 134),
				A3($avh4$elm_color$Color$rgb255, 65, 66, 135),
				A3($avh4$elm_color$Color$rgb255, 65, 68, 135),
				A3($avh4$elm_color$Color$rgb255, 64, 69, 136),
				A3($avh4$elm_color$Color$rgb255, 64, 70, 136),
				A3($avh4$elm_color$Color$rgb255, 63, 71, 136),
				A3($avh4$elm_color$Color$rgb255, 63, 72, 137),
				A3($avh4$elm_color$Color$rgb255, 62, 73, 137),
				A3($avh4$elm_color$Color$rgb255, 62, 74, 137),
				A3($avh4$elm_color$Color$rgb255, 62, 76, 138),
				A3($avh4$elm_color$Color$rgb255, 61, 77, 138),
				A3($avh4$elm_color$Color$rgb255, 61, 78, 138),
				A3($avh4$elm_color$Color$rgb255, 60, 79, 138),
				A3($avh4$elm_color$Color$rgb255, 60, 80, 139),
				A3($avh4$elm_color$Color$rgb255, 59, 81, 139),
				A3($avh4$elm_color$Color$rgb255, 59, 82, 139),
				A3($avh4$elm_color$Color$rgb255, 58, 83, 139),
				A3($avh4$elm_color$Color$rgb255, 58, 84, 140),
				A3($avh4$elm_color$Color$rgb255, 57, 85, 140),
				A3($avh4$elm_color$Color$rgb255, 57, 86, 140),
				A3($avh4$elm_color$Color$rgb255, 56, 88, 140),
				A3($avh4$elm_color$Color$rgb255, 56, 89, 140),
				A3($avh4$elm_color$Color$rgb255, 55, 90, 140),
				A3($avh4$elm_color$Color$rgb255, 55, 91, 141),
				A3($avh4$elm_color$Color$rgb255, 54, 92, 141),
				A3($avh4$elm_color$Color$rgb255, 54, 93, 141),
				A3($avh4$elm_color$Color$rgb255, 53, 94, 141),
				A3($avh4$elm_color$Color$rgb255, 53, 95, 141),
				A3($avh4$elm_color$Color$rgb255, 52, 96, 141),
				A3($avh4$elm_color$Color$rgb255, 52, 97, 141),
				A3($avh4$elm_color$Color$rgb255, 51, 98, 141),
				A3($avh4$elm_color$Color$rgb255, 51, 99, 141),
				A3($avh4$elm_color$Color$rgb255, 50, 100, 142),
				A3($avh4$elm_color$Color$rgb255, 50, 101, 142),
				A3($avh4$elm_color$Color$rgb255, 49, 102, 142),
				A3($avh4$elm_color$Color$rgb255, 49, 103, 142),
				A3($avh4$elm_color$Color$rgb255, 49, 104, 142),
				A3($avh4$elm_color$Color$rgb255, 48, 105, 142),
				A3($avh4$elm_color$Color$rgb255, 48, 106, 142),
				A3($avh4$elm_color$Color$rgb255, 47, 107, 142),
				A3($avh4$elm_color$Color$rgb255, 47, 108, 142),
				A3($avh4$elm_color$Color$rgb255, 46, 109, 142),
				A3($avh4$elm_color$Color$rgb255, 46, 110, 142),
				A3($avh4$elm_color$Color$rgb255, 46, 111, 142),
				A3($avh4$elm_color$Color$rgb255, 45, 112, 142),
				A3($avh4$elm_color$Color$rgb255, 45, 113, 142),
				A3($avh4$elm_color$Color$rgb255, 44, 113, 142),
				A3($avh4$elm_color$Color$rgb255, 44, 114, 142),
				A3($avh4$elm_color$Color$rgb255, 44, 115, 142),
				A3($avh4$elm_color$Color$rgb255, 43, 116, 142),
				A3($avh4$elm_color$Color$rgb255, 43, 117, 142),
				A3($avh4$elm_color$Color$rgb255, 42, 118, 142),
				A3($avh4$elm_color$Color$rgb255, 42, 119, 142),
				A3($avh4$elm_color$Color$rgb255, 42, 120, 142),
				A3($avh4$elm_color$Color$rgb255, 41, 121, 142),
				A3($avh4$elm_color$Color$rgb255, 41, 122, 142),
				A3($avh4$elm_color$Color$rgb255, 41, 123, 142),
				A3($avh4$elm_color$Color$rgb255, 40, 124, 142),
				A3($avh4$elm_color$Color$rgb255, 40, 125, 142),
				A3($avh4$elm_color$Color$rgb255, 39, 126, 142),
				A3($avh4$elm_color$Color$rgb255, 39, 127, 142),
				A3($avh4$elm_color$Color$rgb255, 39, 128, 142),
				A3($avh4$elm_color$Color$rgb255, 38, 129, 142),
				A3($avh4$elm_color$Color$rgb255, 38, 130, 142),
				A3($avh4$elm_color$Color$rgb255, 38, 130, 142),
				A3($avh4$elm_color$Color$rgb255, 37, 131, 142),
				A3($avh4$elm_color$Color$rgb255, 37, 132, 142),
				A3($avh4$elm_color$Color$rgb255, 37, 133, 142),
				A3($avh4$elm_color$Color$rgb255, 36, 134, 142),
				A3($avh4$elm_color$Color$rgb255, 36, 135, 142),
				A3($avh4$elm_color$Color$rgb255, 35, 136, 142),
				A3($avh4$elm_color$Color$rgb255, 35, 137, 142),
				A3($avh4$elm_color$Color$rgb255, 35, 138, 141),
				A3($avh4$elm_color$Color$rgb255, 34, 139, 141),
				A3($avh4$elm_color$Color$rgb255, 34, 140, 141),
				A3($avh4$elm_color$Color$rgb255, 34, 141, 141),
				A3($avh4$elm_color$Color$rgb255, 33, 142, 141),
				A3($avh4$elm_color$Color$rgb255, 33, 143, 141),
				A3($avh4$elm_color$Color$rgb255, 33, 144, 141),
				A3($avh4$elm_color$Color$rgb255, 33, 145, 140),
				A3($avh4$elm_color$Color$rgb255, 32, 146, 140),
				A3($avh4$elm_color$Color$rgb255, 32, 146, 140),
				A3($avh4$elm_color$Color$rgb255, 32, 147, 140),
				A3($avh4$elm_color$Color$rgb255, 31, 148, 140),
				A3($avh4$elm_color$Color$rgb255, 31, 149, 139),
				A3($avh4$elm_color$Color$rgb255, 31, 150, 139),
				A3($avh4$elm_color$Color$rgb255, 31, 151, 139),
				A3($avh4$elm_color$Color$rgb255, 31, 152, 139),
				A3($avh4$elm_color$Color$rgb255, 31, 153, 138),
				A3($avh4$elm_color$Color$rgb255, 31, 154, 138),
				A3($avh4$elm_color$Color$rgb255, 30, 155, 138),
				A3($avh4$elm_color$Color$rgb255, 30, 156, 137),
				A3($avh4$elm_color$Color$rgb255, 30, 157, 137),
				A3($avh4$elm_color$Color$rgb255, 31, 158, 137),
				A3($avh4$elm_color$Color$rgb255, 31, 159, 136),
				A3($avh4$elm_color$Color$rgb255, 31, 160, 136),
				A3($avh4$elm_color$Color$rgb255, 31, 161, 136),
				A3($avh4$elm_color$Color$rgb255, 31, 161, 135),
				A3($avh4$elm_color$Color$rgb255, 31, 162, 135),
				A3($avh4$elm_color$Color$rgb255, 32, 163, 134),
				A3($avh4$elm_color$Color$rgb255, 32, 164, 134),
				A3($avh4$elm_color$Color$rgb255, 33, 165, 133),
				A3($avh4$elm_color$Color$rgb255, 33, 166, 133),
				A3($avh4$elm_color$Color$rgb255, 34, 167, 133),
				A3($avh4$elm_color$Color$rgb255, 34, 168, 132),
				A3($avh4$elm_color$Color$rgb255, 35, 169, 131),
				A3($avh4$elm_color$Color$rgb255, 36, 170, 131),
				A3($avh4$elm_color$Color$rgb255, 37, 171, 130),
				A3($avh4$elm_color$Color$rgb255, 37, 172, 130),
				A3($avh4$elm_color$Color$rgb255, 38, 173, 129),
				A3($avh4$elm_color$Color$rgb255, 39, 173, 129),
				A3($avh4$elm_color$Color$rgb255, 40, 174, 128),
				A3($avh4$elm_color$Color$rgb255, 41, 175, 127),
				A3($avh4$elm_color$Color$rgb255, 42, 176, 127),
				A3($avh4$elm_color$Color$rgb255, 44, 177, 126),
				A3($avh4$elm_color$Color$rgb255, 45, 178, 125),
				A3($avh4$elm_color$Color$rgb255, 46, 179, 124),
				A3($avh4$elm_color$Color$rgb255, 47, 180, 124),
				A3($avh4$elm_color$Color$rgb255, 49, 181, 123),
				A3($avh4$elm_color$Color$rgb255, 50, 182, 122),
				A3($avh4$elm_color$Color$rgb255, 52, 182, 121),
				A3($avh4$elm_color$Color$rgb255, 53, 183, 121),
				A3($avh4$elm_color$Color$rgb255, 55, 184, 120),
				A3($avh4$elm_color$Color$rgb255, 56, 185, 119),
				A3($avh4$elm_color$Color$rgb255, 58, 186, 118),
				A3($avh4$elm_color$Color$rgb255, 59, 187, 117),
				A3($avh4$elm_color$Color$rgb255, 61, 188, 116),
				A3($avh4$elm_color$Color$rgb255, 63, 188, 115),
				A3($avh4$elm_color$Color$rgb255, 64, 189, 114),
				A3($avh4$elm_color$Color$rgb255, 66, 190, 113),
				A3($avh4$elm_color$Color$rgb255, 68, 191, 112),
				A3($avh4$elm_color$Color$rgb255, 70, 192, 111),
				A3($avh4$elm_color$Color$rgb255, 72, 193, 110),
				A3($avh4$elm_color$Color$rgb255, 74, 193, 109),
				A3($avh4$elm_color$Color$rgb255, 76, 194, 108),
				A3($avh4$elm_color$Color$rgb255, 78, 195, 107),
				A3($avh4$elm_color$Color$rgb255, 80, 196, 106),
				A3($avh4$elm_color$Color$rgb255, 82, 197, 105),
				A3($avh4$elm_color$Color$rgb255, 84, 197, 104),
				A3($avh4$elm_color$Color$rgb255, 86, 198, 103),
				A3($avh4$elm_color$Color$rgb255, 88, 199, 101),
				A3($avh4$elm_color$Color$rgb255, 90, 200, 100),
				A3($avh4$elm_color$Color$rgb255, 92, 200, 99),
				A3($avh4$elm_color$Color$rgb255, 94, 201, 98),
				A3($avh4$elm_color$Color$rgb255, 96, 202, 96),
				A3($avh4$elm_color$Color$rgb255, 99, 203, 95),
				A3($avh4$elm_color$Color$rgb255, 101, 203, 94),
				A3($avh4$elm_color$Color$rgb255, 103, 204, 92),
				A3($avh4$elm_color$Color$rgb255, 105, 205, 91),
				A3($avh4$elm_color$Color$rgb255, 108, 205, 90),
				A3($avh4$elm_color$Color$rgb255, 110, 206, 88),
				A3($avh4$elm_color$Color$rgb255, 112, 207, 87),
				A3($avh4$elm_color$Color$rgb255, 115, 208, 86),
				A3($avh4$elm_color$Color$rgb255, 117, 208, 84),
				A3($avh4$elm_color$Color$rgb255, 119, 209, 83),
				A3($avh4$elm_color$Color$rgb255, 122, 209, 81),
				A3($avh4$elm_color$Color$rgb255, 124, 210, 80),
				A3($avh4$elm_color$Color$rgb255, 127, 211, 78),
				A3($avh4$elm_color$Color$rgb255, 129, 211, 77),
				A3($avh4$elm_color$Color$rgb255, 132, 212, 75),
				A3($avh4$elm_color$Color$rgb255, 134, 213, 73),
				A3($avh4$elm_color$Color$rgb255, 137, 213, 72),
				A3($avh4$elm_color$Color$rgb255, 139, 214, 70),
				A3($avh4$elm_color$Color$rgb255, 142, 214, 69),
				A3($avh4$elm_color$Color$rgb255, 144, 215, 67),
				A3($avh4$elm_color$Color$rgb255, 147, 215, 65),
				A3($avh4$elm_color$Color$rgb255, 149, 216, 64),
				A3($avh4$elm_color$Color$rgb255, 152, 216, 62),
				A3($avh4$elm_color$Color$rgb255, 155, 217, 60),
				A3($avh4$elm_color$Color$rgb255, 157, 217, 59),
				A3($avh4$elm_color$Color$rgb255, 160, 218, 57),
				A3($avh4$elm_color$Color$rgb255, 162, 218, 55),
				A3($avh4$elm_color$Color$rgb255, 165, 219, 54),
				A3($avh4$elm_color$Color$rgb255, 168, 219, 52),
				A3($avh4$elm_color$Color$rgb255, 170, 220, 50),
				A3($avh4$elm_color$Color$rgb255, 173, 220, 48),
				A3($avh4$elm_color$Color$rgb255, 176, 221, 47),
				A3($avh4$elm_color$Color$rgb255, 178, 221, 45),
				A3($avh4$elm_color$Color$rgb255, 181, 222, 43),
				A3($avh4$elm_color$Color$rgb255, 184, 222, 41),
				A3($avh4$elm_color$Color$rgb255, 186, 222, 40),
				A3($avh4$elm_color$Color$rgb255, 189, 223, 38),
				A3($avh4$elm_color$Color$rgb255, 192, 223, 37),
				A3($avh4$elm_color$Color$rgb255, 194, 223, 35),
				A3($avh4$elm_color$Color$rgb255, 197, 224, 33),
				A3($avh4$elm_color$Color$rgb255, 200, 224, 32),
				A3($avh4$elm_color$Color$rgb255, 202, 225, 31),
				A3($avh4$elm_color$Color$rgb255, 205, 225, 29),
				A3($avh4$elm_color$Color$rgb255, 208, 225, 28),
				A3($avh4$elm_color$Color$rgb255, 210, 226, 27),
				A3($avh4$elm_color$Color$rgb255, 213, 226, 26),
				A3($avh4$elm_color$Color$rgb255, 216, 226, 25),
				A3($avh4$elm_color$Color$rgb255, 218, 227, 25),
				A3($avh4$elm_color$Color$rgb255, 221, 227, 24),
				A3($avh4$elm_color$Color$rgb255, 223, 227, 24),
				A3($avh4$elm_color$Color$rgb255, 226, 228, 24),
				A3($avh4$elm_color$Color$rgb255, 229, 228, 25),
				A3($avh4$elm_color$Color$rgb255, 231, 228, 25),
				A3($avh4$elm_color$Color$rgb255, 234, 229, 26),
				A3($avh4$elm_color$Color$rgb255, 236, 229, 27),
				A3($avh4$elm_color$Color$rgb255, 239, 229, 28),
				A3($avh4$elm_color$Color$rgb255, 241, 229, 29),
				A3($avh4$elm_color$Color$rgb255, 244, 230, 30),
				A3($avh4$elm_color$Color$rgb255, 246, 230, 32),
				A3($avh4$elm_color$Color$rgb255, 248, 230, 33),
				A3($avh4$elm_color$Color$rgb255, 251, 231, 35),
				A3($avh4$elm_color$Color$rgb255, 253, 231, 37)
			])));
var $author$project$Energy$metricInterpolator = function (m) {
	switch (m.$) {
		case 'SolarShare':
			return $gampleman$elm_visualization$Scale$Color$plasmaInterpolator;
		case 'RenewableShare':
			return $gampleman$elm_visualization$Scale$Color$viridisInterpolator;
		default:
			return $gampleman$elm_visualization$Scale$Color$infernoInterpolator;
	}
};
var $author$project$Energy$metricLabel = function (m) {
	switch (m.$) {
		case 'SolarShare':
			return 'Solar-Anteil';
		case 'RenewableShare':
			return 'Erneuerbaren-Anteil';
		default:
			return 'Last';
	}
};
var $author$project$Energy$metricUnit = function (m) {
	if (m.$ === 'LoadMetric') {
		return 'GW';
	} else {
		return '%';
	}
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Main$propSign = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('prop-sign'),
			$elm$html$Html$Attributes$title('proportional zu')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('∝')
		]));
var $author$project$Main$slotDuration = function (slots) {
	switch (slots) {
		case 96:
			return '15 Minuten';
		case 48:
			return '30 Minuten';
		default:
			return '1 Stunde';
	}
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Energy$slotsPerDay = function (rows) {
	var stamps = $elm$core$List$sort(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.unixSeconds;
			},
			rows));
	var smallestGap = $elm$core$List$minimum(
		A2(
			$elm$core$List$filter,
			function (d) {
				return d > 0;
			},
			A3(
				$elm$core$List$map2,
				$elm$core$Basics$sub,
				A2($elm$core$List$drop, 1, stamps),
				stamps)));
	if (smallestGap.$ === 'Just') {
		var gap = smallestGap.a;
		return (gap <= 900) ? 96 : ((gap <= 1800) ? 48 : 24);
	} else {
		return 24;
	}
};
var $author$project$Energy$sumByBand = function (rows) {
	return A2(
		$elm$core$List$filter,
		function (_v0) {
			var v = _v0.b;
			return v > 0;
		},
		A2(
			$elm$core$List$map,
			function (b) {
				return _Utils_Tuple2(
					b,
					$elm$core$List$sum(
						A2($elm$core$List$map, b.value, rows)));
			},
			$author$project$Energy$bands));
};
var $author$project$Energy$sumBySub = F2(
	function (rows, subs) {
		return A2(
			$elm$core$List$filter,
			function (_v0) {
				var v = _v0.b;
				return v > 0;
			},
			A2(
				$elm$core$List$map,
				function (s) {
					return _Utils_Tuple2(
						s,
						$elm$core$List$sum(
							A2($elm$core$List$map, s.value, rows)));
				},
				subs));
	});
var $elm_community$typed_svg$TypedSvg$Types$AnchorEnd = {$: 'AnchorEnd'};
var $elm_community$typed_svg$TypedSvg$Types$AnchorMiddle = {$: 'AnchorMiddle'};
var $elm_community$typed_svg$TypedSvg$Types$Paint = function (a) {
	return {$: 'Paint', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$PaintNone = {$: 'PaintNone'};
var $elm_community$typed_svg$TypedSvg$Types$Percent = function (a) {
	return {$: 'Percent', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$Translate = F2(
	function (a, b) {
		return {$: 'Translate', a: a, b: b};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm_community$typed_svg$TypedSvg$Core$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm_community$typed_svg$TypedSvg$Attributes$class = function (names) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'class',
		A2($elm$core$String$join, ' ', names));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString = function (paint) {
	switch (paint.$) {
		case 'Paint':
			var color = paint.a;
			return $avh4$elm_color$Color$toCssString(color);
		case 'CSSVariable':
			var string = paint.a;
			return $elm$core$String$concat(
				_List_fromArray(
					['var(' + (string + ')')]));
		case 'Reference':
			var string = paint.a;
			return $elm$core$String$concat(
				_List_fromArray(
					['url(#', string, ')']));
		case 'ContextFill':
			return 'context-fill';
		case 'ContextStroke':
			return 'context-stroke';
		default:
			return 'none';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fill = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('fill'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString);
var $elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString = function (length) {
	switch (length.$) {
		case 'Cm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'cm';
		case 'Em':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'em';
		case 'Ex':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'ex';
		case 'In':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'in';
		case 'Mm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'mm';
		case 'Num':
			var x = length.a;
			return $elm$core$String$fromFloat(x);
		case 'Pc':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pc';
		case 'Percent':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + '%';
		case 'Pt':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pt';
		case 'Px':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'px';
		default:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'rem';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fontSize = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'font-size',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Types$Px = function (a) {
	return {$: 'Px', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$px = $elm_community$typed_svg$TypedSvg$Types$Px;
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$fontSize(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm_community$typed_svg$TypedSvg$Core$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm_community$typed_svg$TypedSvg$g = $elm_community$typed_svg$TypedSvg$Core$node('g');
var $elm_community$typed_svg$TypedSvg$Attributes$height = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'height',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$height = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$height(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm_community$typed_svg$TypedSvg$Events$on = $elm$virtual_dom$VirtualDom$on;
var $elm_community$typed_svg$TypedSvg$Events$simpleOn = function (name) {
	return function (msg) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Events$on,
			name,
			$elm$virtual_dom$VirtualDom$Normal(
				$elm$json$Json$Decode$succeed(msg)));
	};
};
var $elm_community$typed_svg$TypedSvg$Events$onClick = $elm_community$typed_svg$TypedSvg$Events$simpleOn('click');
var $author$project$Chart$Heatmap$pad = {bottom: 22, left: 34, right: 10, top: 8};
var $elm_community$typed_svg$TypedSvg$rect = $elm_community$typed_svg$TypedSvg$Core$node('rect');
var $author$project$Energy$slotLabel = F2(
	function (slots, slot) {
		var pad = function (n) {
			return (n < 10) ? ('0' + $elm$core$String$fromInt(n)) : $elm$core$String$fromInt(n);
		};
		var minutesOfDay = ((slot * 1440) / slots) | 0;
		return pad((minutesOfDay / 60) | 0) + (':' + pad(
			A2($elm$core$Basics$modBy, 60, minutesOfDay)));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$strokeWidth = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'stroke-width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$strokeWidth(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$svg = $elm_community$typed_svg$TypedSvg$Core$node('svg');
var $elm_community$typed_svg$TypedSvg$Core$text = $elm$virtual_dom$VirtualDom$text;
var $elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString = function (anchorAlignment) {
	switch (anchorAlignment.$) {
		case 'AnchorInherit':
			return 'inherit';
		case 'AnchorStart':
			return 'start';
		case 'AnchorMiddle':
			return 'middle';
		default:
			return 'end';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$textAnchor = function (anchorAlignment) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'text-anchor',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString(anchorAlignment));
};
var $elm_community$typed_svg$TypedSvg$text_ = $elm_community$typed_svg$TypedSvg$Core$node('text');
var $elm_community$typed_svg$TypedSvg$title = $elm_community$typed_svg$TypedSvg$Core$node('title');
var $elm_community$typed_svg$TypedSvg$TypesToStrings$transformToString = function (xform) {
	var tr = F2(
		function (name, args) {
			return $elm$core$String$concat(
				_List_fromArray(
					[
						name,
						'(',
						A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, $elm$core$String$fromFloat, args)),
						')'
					]));
		});
	switch (xform.$) {
		case 'Matrix':
			var a = xform.a;
			var b = xform.b;
			var c = xform.c;
			var d = xform.d;
			var e = xform.e;
			var f = xform.f;
			return A2(
				tr,
				'matrix',
				_List_fromArray(
					[a, b, c, d, e, f]));
		case 'Rotate':
			var a = xform.a;
			var x = xform.b;
			var y = xform.c;
			return A2(
				tr,
				'rotate',
				_List_fromArray(
					[a, x, y]));
		case 'Scale':
			var x = xform.a;
			var y = xform.b;
			return A2(
				tr,
				'scale',
				_List_fromArray(
					[x, y]));
		case 'SkewX':
			var x = xform.a;
			return A2(
				tr,
				'skewX',
				_List_fromArray(
					[x]));
		case 'SkewY':
			var y = xform.a;
			return A2(
				tr,
				'skewY',
				_List_fromArray(
					[y]));
		default:
			var x = xform.a;
			var y = xform.b;
			return A2(
				tr,
				'translate',
				_List_fromArray(
					[x, y]));
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$transform = function (transforms) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'transform',
		A2(
			$elm$core$String$join,
			' ',
			A2($elm$core$List$map, $elm_community$typed_svg$TypedSvg$TypesToStrings$transformToString, transforms)));
};
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, _List_Nil, list, _List_Nil);
};
var $elm_community$typed_svg$TypedSvg$Attributes$viewBox = F4(
	function (minX, minY, vWidth, vHeight) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Core$attribute,
			'viewBox',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromFloat,
					_List_fromArray(
						[minX, minY, vWidth, vHeight]))));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$width = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$width = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$width(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$y = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Chart$Heatmap$view = function (cfg) {
	var presentDays = $elm$core$List$sort(
		$elm_community$list_extra$List$Extra$unique(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.day;
				},
				cfg.cells)));
	var plotW = (cfg.width - $author$project$Chart$Heatmap$pad.left) - $author$project$Chart$Heatmap$pad.right;
	var plotH = (cfg.height - $author$project$Chart$Heatmap$pad.top) - $author$project$Chart$Heatmap$pad.bottom;
	var nSlots = A2($elm$core$Basics$max, 1, cfg.slotsPerDay);
	var frame = A2(
		$elm_community$typed_svg$TypedSvg$rect,
		_List_fromArray(
			[
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(0),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(0),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(plotW),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(plotH),
				$elm_community$typed_svg$TypedSvg$Attributes$fill($elm_community$typed_svg$TypedSvg$Types$PaintNone),
				$elm_community$typed_svg$TypedSvg$Attributes$class(
				_List_fromArray(
					['hm-frame'])),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth(1)
			]),
		_List_Nil);
	var days = function () {
		var _v5 = _Utils_Tuple2(
			$elm$core$List$minimum(presentDays),
			$elm$core$List$maximum(presentDays));
		if ((_v5.a.$ === 'Just') && (_v5.b.$ === 'Just')) {
			var lo = _v5.a.a;
			var hi = _v5.b.a;
			return A2($elm$core$List$range, lo, hi);
		} else {
			return presentDays;
		}
	}();
	var nDays = $elm$core$List$length(days);
	var step = A2($elm$core$Basics$max, 1, (nDays / 10) | 0);
	var dayCol = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, d) {
					return _Utils_Tuple2(d, i);
				}),
			days));
	var cellW = (!nDays) ? plotW : (plotW / nDays);
	var dayLabels = A2(
		$elm$core$List$filterMap,
		function (_v4) {
			var i = _v4.a;
			var d = _v4.b;
			return (!A2($elm$core$Basics$modBy, step, i)) ? $elm$core$Maybe$Just(
				A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x((i * cellW) + (cellW / 2)),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(plotH + 14),
							$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['axis-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(
							$author$project$Energy$dayLabel(d))
						]))) : $elm$core$Maybe$Nothing;
		},
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, days));
	var focusOutline = function () {
		var _v3 = A2(
			$elm$core$Maybe$andThen,
			function (d) {
				return A2($elm$core$Dict$get, d, dayCol);
			},
			cfg.focusedDay);
		if (_v3.$ === 'Just') {
			var col = _v3.a;
			return _List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$rect,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(col * cellW),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(0),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(cellW),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(plotH),
							$elm_community$typed_svg$TypedSvg$Attributes$fill($elm_community$typed_svg$TypedSvg$Types$PaintNone),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['focus-outline'])),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth(1.6)
						]),
					_List_Nil)
				]);
		} else {
			return _List_Nil;
		}
	}();
	var cellH = plotH / nSlots;
	var hourLabels = A2(
		$elm$core$List$map,
		function (h) {
			return A2(
				$elm_community$typed_svg$TypedSvg$text_,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(-8),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(((((h * nSlots) / 24) | 0) * cellH) + 4),
						$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorEnd),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
						$elm_community$typed_svg$TypedSvg$Attributes$class(
						_List_fromArray(
							['axis-label']))
					]),
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Core$text(
						$elm$core$String$fromInt(h) + 'h')
					]));
		},
		_List_fromArray(
			[0, 6, 12, 18]));
	var cellDict = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (c) {
				return _Utils_Tuple2(
					_Utils_Tuple2(c.day, c.slot),
					c.value);
			},
			cfg.cells));
	var _v0 = cfg.extent;
	var vmin = _v0.a;
	var vmax = _v0.b;
	var norm = function (v) {
		return (_Utils_cmp(vmax, vmin) < 1) ? 0.5 : A2(
			$elm$core$Basics$max,
			0,
			A2($elm$core$Basics$min, 1, (v - vmin) / (vmax - vmin)));
	};
	var cellSvg = F3(
		function (col, day, slot) {
			var base = _List_fromArray(
				[
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(col * cellW),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(slot * cellH),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(cellW + 0.6),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(cellH + 0.6),
					$elm_community$typed_svg$TypedSvg$Events$onClick(
					cfg.onClickDay(day))
				]);
			var _v2 = A2(
				$elm$core$Dict$get,
				_Utils_Tuple2(day, slot),
				cellDict);
			if (_v2.$ === 'Just') {
				var v = _v2.a;
				var tip = $author$project$Energy$dayLabel(day) + ('  ' + (A2($author$project$Energy$slotLabel, nSlots, slot) + ('  ·  ' + ($elm$core$String$fromFloat(
					$elm$core$Basics$round(v * 10) / 10) + (' ' + cfg.unit)))));
				return A2(
					$elm_community$typed_svg$TypedSvg$rect,
					A2(
						$elm$core$List$cons,
						$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['cell'])),
						A2(
							$elm$core$List$cons,
							$elm_community$typed_svg$TypedSvg$Attributes$fill(
								$elm_community$typed_svg$TypedSvg$Types$Paint(
									cfg.interpolator(
										norm(v)))),
							base)),
					_List_fromArray(
						[
							A2(
							$elm_community$typed_svg$TypedSvg$title,
							_List_Nil,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(tip)
								]))
						]));
			} else {
				return A2(
					$elm_community$typed_svg$TypedSvg$rect,
					A2(
						$elm$core$List$cons,
						$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['cell', 'cell-empty'])),
						base),
					_List_Nil);
			}
		});
	var gridCells = A2(
		$elm$core$List$concatMap,
		function (_v1) {
			var col = _v1.a;
			var day = _v1.b;
			return A2(
				$elm$core$List$map,
				A2(cellSvg, col, day),
				A2($elm$core$List$range, 0, nSlots - 1));
		},
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, days));
	return A2(
		$elm_community$typed_svg$TypedSvg$svg,
		_List_fromArray(
			[
				A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width, cfg.height),
				$elm_community$typed_svg$TypedSvg$Attributes$width(
				$elm_community$typed_svg$TypedSvg$Types$Percent(100))
			]),
		_List_fromArray(
			[
				A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, $author$project$Chart$Heatmap$pad.left, $author$project$Chart$Heatmap$pad.top)
							]))
					]),
				_Utils_ap(
					gridCells,
					_Utils_ap(
						_List_fromArray(
							[frame]),
						_Utils_ap(
							focusOutline,
							_Utils_ap(hourLabels, dayLabels)))))
			]));
};
var $elm_community$typed_svg$TypedSvg$Types$Opacity = function (a) {
	return {$: 'Opacity', a: a};
};
var $folkertdev$one_true_path_experiment$SubPath$SubPath = function (a) {
	return {$: 'SubPath', a: a};
};
var $folkertdev$one_true_path_experiment$SubPath$firstPoint = function (_v0) {
	var moveto = _v0.moveto;
	var p = moveto.a;
	return p;
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$LineTo = function (a) {
	return {$: 'LineTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$lineTo = $folkertdev$one_true_path_experiment$LowLevel$Command$LineTo;
var $folkertdev$one_true_path_experiment$SubPath$Empty = {$: 'Empty'};
var $folkertdev$one_true_path_experiment$SubPath$map2 = F3(
	function (f, sub1, sub2) {
		var _v0 = _Utils_Tuple2(sub1, sub2);
		if (_v0.a.$ === 'Empty') {
			if (_v0.b.$ === 'Empty') {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				return $folkertdev$one_true_path_experiment$SubPath$Empty;
			} else {
				var _v3 = _v0.a;
				var subpath = _v0.b;
				return subpath;
			}
		} else {
			if (_v0.b.$ === 'Empty') {
				var subpath = _v0.a;
				var _v4 = _v0.b;
				return subpath;
			} else {
				var a = _v0.a.a;
				var b = _v0.b.a;
				return A2(f, a, b);
			}
		}
	});
var $folkertdev$elm_deque$Deque$Deque = function (a) {
	return {$: 'Deque', a: a};
};
var $folkertdev$elm_deque$Deque$mapAbstract = F2(
	function (f, _v0) {
		var _abstract = _v0.a;
		return $folkertdev$elm_deque$Deque$Deque(
			f(_abstract));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $folkertdev$elm_deque$Internal$rebalance = function (deque) {
	var rear = deque.rear;
	var front = deque.front;
	var sizeR = deque.sizeR;
	var sizeF = deque.sizeF;
	var size1 = ((sizeF + sizeR) / 2) | 0;
	var size2 = (sizeF + sizeR) - size1;
	var balanceConstant = 4;
	if ((sizeF + sizeR) < 2) {
		return deque;
	} else {
		if (_Utils_cmp(sizeF, (balanceConstant * sizeR) + 1) > 0) {
			var newRear = _Utils_ap(
				rear,
				$elm$core$List$reverse(
					A2($elm$core$List$drop, size1, front)));
			var newFront = A2($elm$core$List$take, size1, front);
			return {front: newFront, rear: newRear, sizeF: size1, sizeR: size2};
		} else {
			if (_Utils_cmp(sizeR, (balanceConstant * sizeF) + 1) > 0) {
				var newRear = A2($elm$core$List$take, size1, rear);
				var newFront = _Utils_ap(
					front,
					$elm$core$List$reverse(
						A2($elm$core$List$drop, size1, rear)));
				return {front: newFront, rear: newRear, sizeF: size1, sizeR: size2};
			} else {
				return deque;
			}
		}
	}
};
var $folkertdev$elm_deque$Deque$pushBack = F2(
	function (elem, _v0) {
		var deque = _v0.a;
		return A2(
			$folkertdev$elm_deque$Deque$mapAbstract,
			$folkertdev$elm_deque$Internal$rebalance,
			$folkertdev$elm_deque$Deque$Deque(
				{
					front: deque.front,
					rear: A2($elm$core$List$cons, elem, deque.rear),
					sizeF: deque.sizeF,
					sizeR: deque.sizeR + 1
				}));
	});
var $folkertdev$one_true_path_experiment$SubPath$pushBack = F2(
	function (drawto, data) {
		return _Utils_update(
			data,
			{
				drawtos: A2($folkertdev$elm_deque$Deque$pushBack, drawto, data.drawtos)
			});
	});
var $folkertdev$elm_deque$Internal$length = function (deque) {
	return deque.sizeF + deque.sizeR;
};
var $folkertdev$elm_deque$Internal$isEmpty = function (deque) {
	return !$folkertdev$elm_deque$Internal$length(deque);
};
var $folkertdev$elm_deque$Deque$unwrap = function (_v0) {
	var boundedDeque = _v0.a;
	return boundedDeque;
};
var $folkertdev$elm_deque$Deque$isEmpty = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Internal$isEmpty, $folkertdev$elm_deque$Deque$unwrap);
var $folkertdev$elm_deque$Deque$append = F2(
	function (p, q) {
		var x = p.a;
		var y = q.a;
		return $folkertdev$elm_deque$Deque$isEmpty(p) ? q : ($folkertdev$elm_deque$Deque$isEmpty(q) ? p : $folkertdev$elm_deque$Deque$Deque(
			{
				front: _Utils_ap(
					x.front,
					$elm$core$List$reverse(x.rear)),
				rear: $elm$core$List$reverse(
					_Utils_ap(
						y.front,
						$elm$core$List$reverse(y.rear))),
				sizeF: x.sizeF + x.sizeR,
				sizeR: y.sizeF + y.sizeR
			}));
	});
var $folkertdev$one_true_path_experiment$SubPath$unsafeConcatenate = F2(
	function (a, b) {
		return _Utils_update(
			a,
			{
				drawtos: A2($folkertdev$elm_deque$Deque$append, a.drawtos, b.drawtos)
			});
	});
var $folkertdev$one_true_path_experiment$SubPath$connect = function () {
	var helper = F2(
		function (right, left) {
			return $folkertdev$one_true_path_experiment$SubPath$SubPath(
				A2(
					$folkertdev$one_true_path_experiment$SubPath$unsafeConcatenate,
					A2(
						$folkertdev$one_true_path_experiment$SubPath$pushBack,
						$folkertdev$one_true_path_experiment$LowLevel$Command$lineTo(
							_List_fromArray(
								[
									$folkertdev$one_true_path_experiment$SubPath$firstPoint(right)
								])),
						left),
					right));
		});
	return $folkertdev$one_true_path_experiment$SubPath$map2(helper);
}();
var $gampleman$elm_visualization$Shape$Generators$area = F2(
	function (curve, data) {
		var makeShape = F2(
			function (topline, bottomline) {
				return A2(
					$folkertdev$one_true_path_experiment$SubPath$connect,
					curve(bottomline),
					curve(topline));
			});
		var makeCurves = F3(
			function (acc, datum, _v3) {
				var prev = _v3.a;
				var list = _v3.b;
				var _v0 = _Utils_Tuple3(prev, datum, list);
				if (_v0.b.$ === 'Nothing') {
					var _v1 = _v0.b;
					var l = _v0.c;
					return _Utils_Tuple2(false, l);
				} else {
					if (!_v0.a) {
						var point = _v0.b.a;
						var l = _v0.c;
						return _Utils_Tuple2(
							true,
							A2(
								$elm$core$List$cons,
								_List_fromArray(
									[
										acc(point)
									]),
								l));
					} else {
						if (_v0.c.b) {
							var p1 = _v0.b.a;
							var _v2 = _v0.c;
							var ps = _v2.a;
							var l = _v2.b;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									A2(
										$elm$core$List$cons,
										acc(p1),
										ps),
									l));
						} else {
							var p1 = _v0.b.a;
							var l = _v0.c;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									_List_fromArray(
										[
											acc(p1)
										]),
									l));
						}
					}
				}
			});
		var topLineData = A3(
			$elm$core$List$foldr,
			makeCurves($elm$core$Tuple$first),
			_Utils_Tuple2(false, _List_Nil),
			data).b;
		var bottomLineData = A2(
			$elm$core$List$map,
			$elm$core$List$reverse,
			A3(
				$elm$core$List$foldr,
				makeCurves($elm$core$Tuple$second),
				_Utils_Tuple2(false, _List_Nil),
				data).b);
		return A3($elm$core$List$map2, makeShape, topLineData, bottomLineData);
	});
var $gampleman$elm_visualization$Shape$area = $gampleman$elm_visualization$Shape$Generators$area;
var $author$project$Energy$bandsStacked = _List_fromArray(
	[$author$project$Energy$coalBand, $author$project$Energy$gasBand, $author$project$Energy$otherBand, $author$project$Energy$nuclearBand, $author$project$Energy$biomassBand, $author$project$Energy$hydroBand, $author$project$Energy$windBand, $author$project$Energy$solarBand]);
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $gampleman$elm_visualization$Scale$tickFormat = function (_v0) {
	var opts = _v0.a;
	return opts.tickFormat(opts.domain);
};
var $gampleman$elm_visualization$Scale$ticks = F2(
	function (_v0, count) {
		var scale = _v0.a;
		return A2(scale.ticks, scale.domain, count);
	});
var $gampleman$elm_visualization$Axis$computeOptions = F2(
	function (attrs, scale) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (attr, _v1) {
					var babyOpts = _v1.a;
					var post = _v1.b;
					switch (attr.$) {
						case 'TickCount':
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{tickCount: val}),
								post);
						case 'TickSizeInner':
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{tickSizeInner: val}),
								post);
						case 'TickSizeOuter':
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{tickSizeOuter: val}),
								post);
						case 'TickPadding':
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{tickPadding: val}),
								post);
						default:
							return _Utils_Tuple2(
								babyOpts,
								A2($elm$core$List$cons, attr, post));
					}
				}),
			_Utils_Tuple2(
				{tickCount: 10, tickPadding: 3, tickSizeInner: 6, tickSizeOuter: 6},
				_List_Nil),
			attrs);
		var opts = _v0.a;
		var postList = _v0.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (attr, options) {
					switch (attr.$) {
						case 'Ticks':
							var val = attr.a;
							return _Utils_update(
								options,
								{ticks: val});
						case 'TickFormat':
							var val = attr.a;
							return _Utils_update(
								options,
								{tickFormat: val});
						default:
							return options;
					}
				}),
			{
				tickCount: opts.tickCount,
				tickFormat: A2($gampleman$elm_visualization$Scale$tickFormat, scale, opts.tickCount),
				tickPadding: opts.tickPadding,
				tickSizeInner: opts.tickSizeInner,
				tickSizeOuter: opts.tickSizeOuter,
				ticks: A2($gampleman$elm_visualization$Scale$ticks, scale, opts.tickCount)
			},
			postList);
	});
var $gampleman$elm_visualization$Scale$convert = F2(
	function (_v0, value) {
		var scale = _v0.a;
		return A3(scale.convert, scale.domain, scale.range, value);
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$dy = _VirtualDom_attribute('dy');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $gampleman$elm_visualization$Scale$rangeExtent = function (_v0) {
	var options = _v0.a;
	return A2(options.rangeExtent, options.domain, options.range);
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $gampleman$elm_visualization$Axis$element = F4(
	function (_v0, k, displacement, textAnchorPosition) {
		var horizontal = _v0.horizontal;
		var translate = _v0.translate;
		var y2 = _v0.y2;
		var y1 = _v0.y1;
		var x2 = _v0.x2;
		var y = _v0.y;
		var x = _v0.x;
		return F2(
			function (attrs, scale) {
				var rangeExtent = $gampleman$elm_visualization$Scale$rangeExtent(scale);
				var range1 = rangeExtent.b + 0.5;
				var range0 = rangeExtent.a + 0.5;
				var position = $gampleman$elm_visualization$Scale$convert(scale);
				var opts = A2($gampleman$elm_visualization$Axis$computeOptions, attrs, scale);
				var spacing = A2($elm$core$Basics$max, opts.tickSizeInner, 0) + opts.tickPadding;
				var drawTick = function (tick) {
					return A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('tick'),
								$elm$svg$Svg$Attributes$transform(
								translate(
									position(tick)))
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$line,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$stroke('#000'),
										x2(k * opts.tickSizeInner),
										y1(0.5),
										y2(0.5)
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$text_,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$fill('#000'),
										x(k * spacing),
										y(0.5),
										$elm$svg$Svg$Attributes$dy(displacement)
									]),
								_List_fromArray(
									[
										$elm$svg$Svg$text(
										opts.tickFormat(tick))
									]))
							]));
				};
				var domainLine = horizontal ? ('M' + ($elm$core$String$fromFloat(k * opts.tickSizeOuter) + (',' + ($elm$core$String$fromFloat(range0) + ('H0.5V' + ($elm$core$String$fromFloat(range1) + ('H' + $elm$core$String$fromFloat(k * opts.tickSizeOuter)))))))) : ('M' + ($elm$core$String$fromFloat(range0) + (',' + ($elm$core$String$fromFloat(k * opts.tickSizeOuter) + ('V0.5H' + ($elm$core$String$fromFloat(range1) + ('V' + $elm$core$String$fromFloat(k * opts.tickSizeOuter))))))));
				return A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$fontSize('10'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$textAnchor(textAnchorPosition)
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('domain'),
									$elm$svg$Svg$Attributes$stroke('#000'),
									$elm$svg$Svg$Attributes$d(domainLine)
								]),
							_List_Nil),
						A2($elm$core$List$map, drawTick, opts.ticks)));
			});
	});
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $gampleman$elm_visualization$Axis$verticalAttrs = {
	horizontal: false,
	translate: function (x) {
		return 'translate(' + ($elm$core$String$fromFloat(x) + ', 0)');
	},
	x: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $elm$core$String$fromFloat),
	x1: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y1, $elm$core$String$fromFloat),
	x2: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y2, $elm$core$String$fromFloat),
	y: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $elm$core$String$fromFloat),
	y1: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x1, $elm$core$String$fromFloat),
	y2: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x2, $elm$core$String$fromFloat)
};
var $gampleman$elm_visualization$Axis$bottom = A4($gampleman$elm_visualization$Axis$element, $gampleman$elm_visualization$Axis$verticalAttrs, 1, '0.71em', 'middle');
var $folkertdev$elm_deque$Internal$empty = {front: _List_Nil, rear: _List_Nil, sizeF: 0, sizeR: 0};
var $folkertdev$elm_deque$Deque$empty = $folkertdev$elm_deque$Deque$Deque($folkertdev$elm_deque$Internal$empty);
var $folkertdev$elm_deque$Internal$fromList = function (list) {
	return $folkertdev$elm_deque$Internal$rebalance(
		{
			front: list,
			rear: _List_Nil,
			sizeF: $elm$core$List$length(list),
			sizeR: 0
		});
};
var $folkertdev$elm_deque$Deque$fromList = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Deque$Deque, $folkertdev$elm_deque$Internal$fromList);
var $folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath = {$: 'ClosePath'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$CurveTo = function (a) {
	return {$: 'CurveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc = function (a) {
	return {$: 'EllipticalArc', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$QuadraticBezierCurveTo = function (a) {
	return {$: 'QuadraticBezierCurveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$merge = F2(
	function (instruction1, instruction2) {
		var _v0 = _Utils_Tuple2(instruction1, instruction2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'LineTo':
					if (_v0.b.$ === 'LineTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$LineTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'CurveTo':
					if (_v0.b.$ === 'CurveTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$CurveTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'QuadraticBezierCurveTo':
					if (_v0.b.$ === 'QuadraticBezierCurveTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$QuadraticBezierCurveTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'EllipticalArc':
					if (_v0.b.$ === 'EllipticalArc') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 'ClosePath') {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return $elm$core$Result$Ok($folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath);
					} else {
						break _v0$5;
					}
			}
		}
		return $elm$core$Result$Err(
			_Utils_Tuple2(instruction1, instruction2));
	});
var $folkertdev$elm_deque$Internal$toList = function (deque) {
	return _Utils_ap(
		deque.front,
		$elm$core$List$reverse(deque.rear));
};
var $folkertdev$elm_deque$Deque$toList = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Internal$toList, $folkertdev$elm_deque$Deque$unwrap);
var $folkertdev$one_true_path_experiment$SubPath$compressHelper = function (drawtos) {
	var folder = F2(
		function (instruction, _v3) {
			var previous = _v3.a;
			var accum = _v3.b;
			var _v2 = A2($folkertdev$one_true_path_experiment$LowLevel$Command$merge, previous, instruction);
			if (_v2.$ === 'Ok') {
				var merged = _v2.a;
				return _Utils_Tuple2(merged, accum);
			} else {
				return _Utils_Tuple2(
					instruction,
					A2($elm$core$List$cons, previous, accum));
			}
		});
	var _v0 = $folkertdev$elm_deque$Deque$toList(drawtos);
	if (!_v0.b) {
		return $folkertdev$elm_deque$Deque$empty;
	} else {
		var first = _v0.a;
		var rest = _v0.b;
		return $folkertdev$elm_deque$Deque$fromList(
			$elm$core$List$reverse(
				function (_v1) {
					var a = _v1.a;
					var b = _v1.b;
					return A2($elm$core$List$cons, a, b);
				}(
					A3(
						$elm$core$List$foldl,
						folder,
						_Utils_Tuple2(first, _List_Nil),
						rest))));
	}
};
var $folkertdev$one_true_path_experiment$SubPath$compress = function (subpath) {
	if (subpath.$ === 'Empty') {
		return $folkertdev$one_true_path_experiment$SubPath$Empty;
	} else {
		var data = subpath.a;
		return $folkertdev$one_true_path_experiment$SubPath$SubPath(
			_Utils_update(
				data,
				{
					drawtos: $folkertdev$one_true_path_experiment$SubPath$compressHelper(data.drawtos)
				}));
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$DecimalPlaces = function (a) {
	return {$: 'DecimalPlaces', a: a};
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$decimalPlaces = $folkertdev$svg_path_lowlevel$Path$LowLevel$DecimalPlaces;
var $folkertdev$one_true_path_experiment$SubPath$defaultConfig = {decimalPlaces: $elm$core$Maybe$Nothing, mergeAdjacent: false};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $folkertdev$one_true_path_experiment$SubPath$optionFolder = F2(
	function (option, config) {
		if (option.$ === 'DecimalPlaces') {
			var n = option.a;
			return _Utils_update(
				config,
				{
					decimalPlaces: $elm$core$Maybe$Just(n)
				});
		} else {
			return _Utils_update(
				config,
				{mergeAdjacent: true});
		}
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute = {$: 'Absolute'};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$ClosePath = {$: 'ClosePath'};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$CurveTo = F2(
	function (a, b) {
		return {$: 'CurveTo', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$EllipticalArc = F2(
	function (a, b) {
		return {$: 'EllipticalArc', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$LineTo = F2(
	function (a, b) {
		return {$: 'LineTo', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$QuadraticBezierCurveTo = F2(
	function (a, b) {
		return {$: 'QuadraticBezierCurveTo', a: a, b: b};
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelDrawTo = function (drawto) {
	switch (drawto.$) {
		case 'LineTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$LineTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'CurveTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$CurveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'QuadraticBezierCurveTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$QuadraticBezierCurveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'EllipticalArc':
			var _arguments = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$EllipticalArc, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, _arguments);
		default:
			return $folkertdev$svg_path_lowlevel$Path$LowLevel$ClosePath;
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$MoveTo = F2(
	function (a, b) {
		return {$: 'MoveTo', a: a, b: b};
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelMoveTo = function (_v0) {
	var target = _v0.a;
	return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$MoveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, target);
};
var $folkertdev$one_true_path_experiment$SubPath$toLowLevel = function (subpath) {
	if (subpath.$ === 'Empty') {
		return $elm$core$Maybe$Nothing;
	} else {
		var drawtos = subpath.a.drawtos;
		var moveto = subpath.a.moveto;
		return $elm$core$Maybe$Just(
			{
				drawtos: A2(
					$elm$core$List$map,
					$folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelDrawTo,
					$folkertdev$elm_deque$Deque$toList(drawtos)),
				moveto: $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelMoveTo(moveto)
			});
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$defaultConfig = {floatFormatter: $elm$core$String$fromFloat};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$pow = _Basics_pow;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$roundTo = F2(
	function (n, value) {
		if (!n) {
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(value));
		} else {
			var sign = (value < 0.0) ? '-' : '';
			var exp = A2($elm$core$Basics$pow, 10, n);
			var raised = $elm$core$Basics$abs(
				$elm$core$Basics$round(value * exp));
			var decimals = raised % exp;
			return (!decimals) ? _Utils_ap(
				sign,
				$elm$core$String$fromInt((raised / exp) | 0)) : (sign + ($elm$core$String$fromInt((raised / exp) | 0) + ('.' + $elm$core$String$fromInt(decimals))));
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$optionFolder = F2(
	function (option, config) {
		var n = option.a;
		return _Utils_update(
			config,
			{
				floatFormatter: $folkertdev$svg_path_lowlevel$Path$LowLevel$roundTo(n)
			});
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$accumulateOptions = A2($elm$core$List$foldl, $folkertdev$svg_path_lowlevel$Path$LowLevel$optionFolder, $folkertdev$svg_path_lowlevel$Path$LowLevel$defaultConfig);
var $folkertdev$svg_path_lowlevel$Path$LowLevel$isEmpty = function (command) {
	switch (command.$) {
		case 'LineTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'Horizontal':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'Vertical':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'CurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'SmoothCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'QuadraticBezierCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'SmoothQuadraticBezierCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'EllipticalArc':
			var mode = command.a;
			var _arguments = command.b;
			return $elm$core$List$isEmpty(_arguments);
		default:
			return false;
	}
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$toLower = _Char_toLower;
var $elm$core$Char$toUpper = _Char_toUpper;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter = F2(
	function (mode, character) {
		if (mode.$ === 'Absolute') {
			return $elm$core$String$fromChar(
				$elm$core$Char$toUpper(character));
		} else {
			return $elm$core$String$fromChar(
				$elm$core$Char$toLower(character));
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate = F2(
	function (config, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return config.floatFormatter(x) + (',' + config.floatFormatter(y));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2 = F2(
	function (config, _v0) {
		var c1 = _v0.a;
		var c2 = _v0.b;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c1) + (' ' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c2));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate3 = F2(
	function (config, _v0) {
		var c1 = _v0.a;
		var c2 = _v0.b;
		var c3 = _v0.c;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c1) + (' ' + (A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c2) + (' ' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c3))));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$encodeFlags = function (_v0) {
	var arcFlag = _v0.a;
	var direction = _v0.b;
	var _v1 = _Utils_Tuple2(arcFlag, direction);
	if (_v1.a.$ === 'LargestArc') {
		if (_v1.b.$ === 'Clockwise') {
			var _v2 = _v1.a;
			var _v3 = _v1.b;
			return _Utils_Tuple2(1, 0);
		} else {
			var _v6 = _v1.a;
			var _v7 = _v1.b;
			return _Utils_Tuple2(1, 1);
		}
	} else {
		if (_v1.b.$ === 'Clockwise') {
			var _v4 = _v1.a;
			var _v5 = _v1.b;
			return _Utils_Tuple2(0, 0);
		} else {
			var _v8 = _v1.a;
			var _v9 = _v1.b;
			return _Utils_Tuple2(0, 1);
		}
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyEllipticalArcArgument = F2(
	function (config, _v0) {
		var target = _v0.target;
		var direction = _v0.direction;
		var arcFlag = _v0.arcFlag;
		var xAxisRotate = _v0.xAxisRotate;
		var radii = _v0.radii;
		var _v1 = $folkertdev$svg_path_lowlevel$Path$LowLevel$encodeFlags(
			_Utils_Tuple2(arcFlag, direction));
		var arc = _v1.a;
		var sweep = _v1.b;
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, radii),
					$elm$core$String$fromFloat(xAxisRotate),
					$elm$core$String$fromInt(arc),
					$elm$core$String$fromInt(sweep),
					A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, target)
				]));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyDrawTo = F2(
	function (config, command) {
		if ($folkertdev$svg_path_lowlevel$Path$LowLevel$isEmpty(command)) {
			return '';
		} else {
			switch (command.$) {
				case 'LineTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('L')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate(config),
								coordinates)));
				case 'Horizontal':
					var mode = command.a;
					var coordinates = command.b;
					return $elm$core$List$isEmpty(coordinates) ? '' : _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('H')),
						A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, $elm$core$String$fromFloat, coordinates)));
				case 'Vertical':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('V')),
						A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, $elm$core$String$fromFloat, coordinates)));
				case 'CurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('C')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate3(config),
								coordinates)));
				case 'SmoothCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('S')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2(config),
								coordinates)));
				case 'QuadraticBezierCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('Q')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2(config),
								coordinates)));
				case 'SmoothQuadraticBezierCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('T')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate(config),
								coordinates)));
				case 'EllipticalArc':
					var mode = command.a;
					var _arguments = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('A')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyEllipticalArcArgument(config),
								_arguments)));
				default:
					return 'Z';
			}
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyMoveTo = F2(
	function (config, _v0) {
		var mode = _v0.a;
		var coordinate = _v0.b;
		if (mode.$ === 'Absolute') {
			return 'M' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, coordinate);
		} else {
			return 'm' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, coordinate);
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$toStringSubPath = F2(
	function (config, _v0) {
		var drawtos = _v0.drawtos;
		var moveto = _v0.moveto;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyMoveTo, config, moveto) + (' ' + A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyDrawTo(config),
				drawtos)));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$toStringWith = F2(
	function (options, subpaths) {
		var config = $folkertdev$svg_path_lowlevel$Path$LowLevel$accumulateOptions(options);
		return A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$folkertdev$svg_path_lowlevel$Path$LowLevel$toStringSubPath(config),
				subpaths));
	});
var $folkertdev$one_true_path_experiment$SubPath$toStringWith = F2(
	function (options, subpath) {
		var config = A3($elm$core$List$foldl, $folkertdev$one_true_path_experiment$SubPath$optionFolder, $folkertdev$one_true_path_experiment$SubPath$defaultConfig, options);
		var lowLevelOptions = function () {
			var _v0 = config.decimalPlaces;
			if (_v0.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var n = _v0.a;
				return _List_fromArray(
					[
						$folkertdev$svg_path_lowlevel$Path$LowLevel$decimalPlaces(n)
					]);
			}
		}();
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeL,
					$folkertdev$svg_path_lowlevel$Path$LowLevel$toStringWith(lowLevelOptions),
					$elm$core$List$singleton),
				$folkertdev$one_true_path_experiment$SubPath$toLowLevel(
					(config.mergeAdjacent ? $folkertdev$one_true_path_experiment$SubPath$compress : $elm$core$Basics$identity)(subpath))));
	});
var $folkertdev$one_true_path_experiment$SubPath$toString = function (subpath) {
	return A2($folkertdev$one_true_path_experiment$SubPath$toStringWith, _List_Nil, subpath);
};
var $folkertdev$one_true_path_experiment$Path$toString = A2(
	$elm$core$Basics$composeL,
	$elm$core$String$join(' '),
	$elm$core$List$map($folkertdev$one_true_path_experiment$SubPath$toString));
var $folkertdev$one_true_path_experiment$Path$element = F2(
	function (path, attributes) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$d(
					$folkertdev$one_true_path_experiment$Path$toString(path)),
				attributes),
			_List_Nil);
	});
var $elm_community$typed_svg$TypedSvg$TypesToStrings$opacityToString = function (opacity) {
	if (opacity.$ === 'Opacity') {
		var n = opacity.a;
		return $elm$core$String$fromFloat(n);
	} else {
		return 'inherit';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fillOpacity = function (opa) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'fill-opacity',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$opacityToString(opa));
};
var $gampleman$elm_visualization$Axis$horizontalAttrs = {
	horizontal: true,
	translate: function (y) {
		return 'translate(0, ' + ($elm$core$String$fromFloat(y) + ')');
	},
	x: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $elm$core$String$fromFloat),
	x1: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x1, $elm$core$String$fromFloat),
	x2: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x2, $elm$core$String$fromFloat),
	y: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $elm$core$String$fromFloat),
	y1: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y1, $elm$core$String$fromFloat),
	y2: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y2, $elm$core$String$fromFloat)
};
var $gampleman$elm_visualization$Axis$left = A4($gampleman$elm_visualization$Axis$element, $gampleman$elm_visualization$Axis$horizontalAttrs, -1, '0.32em', 'end');
var $gampleman$elm_visualization$Shape$Generators$line = F2(
	function (curve, data) {
		var makeCurves = F2(
			function (datum, _v3) {
				var prev = _v3.a;
				var list = _v3.b;
				var _v0 = _Utils_Tuple3(prev, datum, list);
				if (_v0.b.$ === 'Nothing') {
					var _v1 = _v0.b;
					var l = _v0.c;
					return _Utils_Tuple2(false, l);
				} else {
					if (!_v0.a) {
						var point = _v0.b.a;
						var l = _v0.c;
						return _Utils_Tuple2(
							true,
							A2(
								$elm$core$List$cons,
								_List_fromArray(
									[point]),
								l));
					} else {
						if (_v0.c.b) {
							var p1 = _v0.b.a;
							var _v2 = _v0.c;
							var ps = _v2.a;
							var l = _v2.b;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									A2($elm$core$List$cons, p1, ps),
									l));
						} else {
							var p1 = _v0.b.a;
							var l = _v0.c;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									_List_fromArray(
										[p1]),
									l));
						}
					}
				}
			});
		return A2(
			$elm$core$List$map,
			curve,
			A3(
				$elm$core$List$foldr,
				makeCurves,
				_Utils_Tuple2(false, _List_Nil),
				data).b);
	});
var $gampleman$elm_visualization$Shape$line = $gampleman$elm_visualization$Shape$Generators$line;
var $gampleman$elm_visualization$Scale$Scale = function (a) {
	return {$: 'Scale', a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $gampleman$elm_visualization$Scale$Continuous$normalize = F2(
	function (a, b) {
		var c = b - a;
		return (!c) ? $elm$core$Basics$always(0.5) : ($elm$core$Basics$isNaN(c) ? $elm$core$Basics$always(0 / 0) : function (x) {
			return (x - a) / c;
		});
	});
var $gampleman$elm_visualization$Scale$Continuous$bimap = F3(
	function (_v0, _v1, interpolate) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		var r0 = _v1.a;
		var r1 = _v1.b;
		var _v2 = (_Utils_cmp(d1, d0) < 0) ? _Utils_Tuple2(
			A2($gampleman$elm_visualization$Scale$Continuous$normalize, d1, d0),
			A2(interpolate, r1, r0)) : _Utils_Tuple2(
			A2($gampleman$elm_visualization$Scale$Continuous$normalize, d0, d1),
			A2(interpolate, r0, r1));
		var de = _v2.a;
		var re = _v2.b;
		return A2($elm$core$Basics$composeL, re, de);
	});
var $gampleman$elm_visualization$Scale$Continuous$convertTransform = F4(
	function (transform, interpolate, _v0, range) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		return A2(
			$elm$core$Basics$composeR,
			transform,
			A3(
				$gampleman$elm_visualization$Scale$Continuous$bimap,
				_Utils_Tuple2(
					transform(d0),
					transform(d1)),
				range,
				interpolate));
	});
var $gampleman$elm_visualization$Interpolation$float = F2(
	function (a, to) {
		var b = to - a;
		return function (t) {
			return a + (b * t);
		};
	});
var $gampleman$elm_visualization$Scale$Continuous$invertTransform = F4(
	function (transform, untransform, _v0, range) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		return A2(
			$elm$core$Basics$composeR,
			A3(
				$gampleman$elm_visualization$Scale$Continuous$bimap,
				range,
				_Utils_Tuple2(
					transform(d0),
					transform(d1)),
				$gampleman$elm_visualization$Interpolation$float),
			untransform);
	});
var $gampleman$elm_visualization$Scale$Continuous$fixPoint = F3(
	function (maxIterations, initialInput, fn) {
		var helper = F2(
			function (iters, _v0) {
				helper:
				while (true) {
					var a = _v0.a;
					var b = _v0.b;
					if (_Utils_cmp(iters + 1, maxIterations) > -1) {
						return b;
					} else {
						var _v1 = fn(b);
						var outA = _v1.a;
						var outB = _v1.b;
						if (_Utils_eq(outA, a)) {
							return b;
						} else {
							if (!outA) {
								return b;
							} else {
								var $temp$iters = iters + 1,
									$temp$_v0 = _Utils_Tuple2(outA, outB);
								iters = $temp$iters;
								_v0 = $temp$_v0;
								continue helper;
							}
						}
					}
				}
			});
		return A2(
			helper,
			1,
			fn(initialInput));
	});
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $gampleman$elm_visualization$Scale$Continuous$e10 = $elm$core$Basics$sqrt(50);
var $gampleman$elm_visualization$Scale$Continuous$e2 = $elm$core$Basics$sqrt(2);
var $gampleman$elm_visualization$Scale$Continuous$e5 = $elm$core$Basics$sqrt(10);
var $gampleman$elm_visualization$Scale$Continuous$ln10 = A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10);
var $gampleman$elm_visualization$Scale$Continuous$tickIncrement = F3(
	function (start, stop, count) {
		var step = (stop - start) / A2($elm$core$Basics$max, 0, count);
		var powr = $elm$core$Basics$floor(
			A2($elm$core$Basics$logBase, $elm$core$Basics$e, step) / $gampleman$elm_visualization$Scale$Continuous$ln10);
		var error = step / A2($elm$core$Basics$pow, 10, powr);
		var order = (_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e10) > -1) ? 10 : ((_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e5) > -1) ? 5 : ((_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e2) > -1) ? 2 : 1));
		return (powr >= 0) ? (order * A2($elm$core$Basics$pow, 10, powr)) : ((-A2($elm$core$Basics$pow, 10, -powr)) / order);
	});
var $gampleman$elm_visualization$Scale$Continuous$withNormalizedDomain = F2(
	function (fn, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		if (_Utils_cmp(a, b) < 0) {
			return fn(
				_Utils_Tuple2(a, b));
		} else {
			var _v1 = fn(
				_Utils_Tuple2(b, a));
			var d = _v1.a;
			var c = _v1.b;
			return _Utils_Tuple2(c, d);
		}
	});
var $gampleman$elm_visualization$Scale$Continuous$nice = F2(
	function (domain, count) {
		var computation = function (_v0) {
			var start = _v0.a;
			var stop = _v0.b;
			var step = A3($gampleman$elm_visualization$Scale$Continuous$tickIncrement, start, stop, count);
			return _Utils_Tuple2(
				step,
				(step > 0) ? _Utils_Tuple2(
					$elm$core$Basics$floor(start / step) * step,
					$elm$core$Basics$ceiling(stop / step) * step) : ((step < 0) ? _Utils_Tuple2(
					$elm$core$Basics$ceiling(start * step) / step,
					$elm$core$Basics$floor(stop * step) / step) : _Utils_Tuple2(start, stop)));
		};
		return A2(
			$gampleman$elm_visualization$Scale$Continuous$withNormalizedDomain,
			function (dmn) {
				return A3($gampleman$elm_visualization$Scale$Continuous$fixPoint, 10, dmn, computation);
			},
			domain);
	});
var $gampleman$elm_visualization$Scale$Continuous$exponent = function (num) {
	var helper = F2(
		function (soFar, x) {
			helper:
			while (true) {
				if (!x) {
					return soFar;
				} else {
					if (x < 1) {
						var $temp$soFar = 1 + soFar,
							$temp$x = x * 10;
						soFar = $temp$soFar;
						x = $temp$x;
						continue helper;
					} else {
						return soFar;
					}
				}
			}
		});
	return A2(helper, 0, num);
};
var $gampleman$elm_visualization$Scale$Continuous$precisionFixed = function (step) {
	return A2(
		$elm$core$Basics$max,
		0,
		$gampleman$elm_visualization$Scale$Continuous$exponent(
			$elm$core$Basics$abs(step)));
};
var $gampleman$elm_visualization$Statistics$tickStep = F3(
	function (start, stop, count) {
		var step0 = $elm$core$Basics$abs(stop - start) / A2($elm$core$Basics$max, 0, count);
		var step1 = A2(
			$elm$core$Basics$pow,
			10,
			$elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Basics$e, step0) / A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10)));
		var error = step0 / step1;
		var step2 = (_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(50)) > -1) ? (step1 * 10) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(10)) > -1) ? (step1 * 5) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(2)) > -1) ? (step1 * 2) : step1));
		return (_Utils_cmp(stop, start) < 0) ? (-step2) : step2;
	});
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $gampleman$elm_visualization$Scale$Continuous$toFixed = F2(
	function (precision, value) {
		var power_ = A2($elm$core$Basics$pow, 10, precision);
		var pad = function (num) {
			_v0$2:
			while (true) {
				if (num.b) {
					if (num.b.b) {
						if (!num.b.b.b) {
							var x = num.a;
							var _v1 = num.b;
							var y = _v1.a;
							return _List_fromArray(
								[
									x,
									A3(
									$elm$core$String$padRight,
									precision,
									_Utils_chr('0'),
									y)
								]);
						} else {
							break _v0$2;
						}
					} else {
						var val = num.a;
						return (precision > 0) ? _List_fromArray(
							[
								val,
								A3(
								$elm$core$String$padRight,
								precision,
								_Utils_chr('0'),
								'')
							]) : _List_fromArray(
							[val]);
					}
				} else {
					break _v0$2;
				}
			}
			var val = num;
			return val;
		};
		return A2(
			$elm$core$String$join,
			'.',
			pad(
				A2(
					$elm$core$String$split,
					'.',
					$elm$core$String$fromFloat(
						$elm$core$Basics$round(value * power_) / power_))));
	});
var $gampleman$elm_visualization$Scale$Continuous$tickFormat = F2(
	function (_v0, count) {
		var start = _v0.a;
		var stop = _v0.b;
		return $gampleman$elm_visualization$Scale$Continuous$toFixed(
			$gampleman$elm_visualization$Scale$Continuous$precisionFixed(
				A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count)));
	});
var $elmcraft$core_extra$Float$Extra$range = F3(
	function (start, stop, step) {
		if (!step) {
			return _List_Nil;
		} else {
			var n = A2(
				$elm$core$Basics$max,
				0,
				$elm$core$Basics$ceiling((stop - start) / step));
			var helper = F2(
				function (i, list) {
					helper:
					while (true) {
						if (i >= 0) {
							var $temp$i = i - 1,
								$temp$list = A2($elm$core$List$cons, start + (step * i), list);
							i = $temp$i;
							list = $temp$list;
							continue helper;
						} else {
							return list;
						}
					}
				});
			return A2(helper, n - 1, _List_Nil);
		}
	});
var $gampleman$elm_visualization$Statistics$range = $elmcraft$core_extra$Float$Extra$range;
var $gampleman$elm_visualization$Statistics$ticks = F3(
	function (start, stop, count) {
		var step = A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count);
		var end = ($elm$core$Basics$floor(stop / step) * step) + (step / 2);
		var beg = $elm$core$Basics$ceiling(start / step) * step;
		return A3($gampleman$elm_visualization$Statistics$range, beg, end, step);
	});
var $gampleman$elm_visualization$Scale$Continuous$ticks = F2(
	function (_v0, count) {
		var start = _v0.a;
		var end = _v0.b;
		return A3($gampleman$elm_visualization$Statistics$ticks, start, end, count);
	});
var $gampleman$elm_visualization$Scale$Continuous$scaleWithTransform = F4(
	function (transform, untransform, range_, domain_) {
		return {
			convert: A2($gampleman$elm_visualization$Scale$Continuous$convertTransform, transform, $gampleman$elm_visualization$Interpolation$float),
			domain: domain_,
			invert: A2($gampleman$elm_visualization$Scale$Continuous$invertTransform, transform, untransform),
			nice: $gampleman$elm_visualization$Scale$Continuous$nice,
			range: range_,
			rangeExtent: F2(
				function (_v0, r) {
					return r;
				}),
			tickFormat: $gampleman$elm_visualization$Scale$Continuous$tickFormat,
			ticks: $gampleman$elm_visualization$Scale$Continuous$ticks
		};
	});
var $gampleman$elm_visualization$Scale$Continuous$linear = A2($gampleman$elm_visualization$Scale$Continuous$scaleWithTransform, $elm$core$Basics$identity, $elm$core$Basics$identity);
var $gampleman$elm_visualization$Scale$linear = F2(
	function (range_, domain_) {
		return $gampleman$elm_visualization$Scale$Scale(
			A2($gampleman$elm_visualization$Scale$Continuous$linear, range_, domain_));
	});
var $folkertdev$one_true_path_experiment$SubPath$empty = $folkertdev$one_true_path_experiment$SubPath$Empty;
var $folkertdev$one_true_path_experiment$LowLevel$Command$MoveTo = function (a) {
	return {$: 'MoveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$moveTo = $folkertdev$one_true_path_experiment$LowLevel$Command$MoveTo;
var $folkertdev$one_true_path_experiment$SubPath$with = F2(
	function (moveto, drawtos) {
		return $folkertdev$one_true_path_experiment$SubPath$SubPath(
			{
				drawtos: $folkertdev$elm_deque$Deque$fromList(drawtos),
				moveto: moveto
			});
	});
var $folkertdev$one_true_path_experiment$Curve$linear = function (points) {
	if (!points.b) {
		return $folkertdev$one_true_path_experiment$SubPath$empty;
	} else {
		var x = points.a;
		var xs = points.b;
		return A2(
			$folkertdev$one_true_path_experiment$SubPath$with,
			$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(x),
			_List_fromArray(
				[
					$folkertdev$one_true_path_experiment$LowLevel$Command$lineTo(xs)
				]));
	}
};
var $gampleman$elm_visualization$Shape$linearCurve = $folkertdev$one_true_path_experiment$Curve$linear;
var $elm_community$typed_svg$TypedSvg$Events$onMouseOut = $elm_community$typed_svg$TypedSvg$Events$simpleOn('mouseout');
var $elm_community$typed_svg$TypedSvg$Events$onMouseOver = $elm_community$typed_svg$TypedSvg$Events$simpleOn('mouseover');
var $author$project$Chart$StackedArea$pad = {bottom: 26, left: 48, right: 14, top: 12};
var $author$project$Chart$StackedArea$posix = function (unix) {
	return $elm$time$Time$millisToPosix(unix * 1000);
};
var $gampleman$elm_visualization$Shape$Stack$calculateExtremes = function (coords) {
	var folder = F2(
		function (_v2, _v3) {
			var y1 = _v2.a;
			var y2 = _v2.b;
			var accmin = _v3.a;
			var accmax = _v3.b;
			return _Utils_Tuple2(
				A2(
					$elm$core$Basics$min,
					accmin,
					A2($elm$core$Basics$min, y1, y2)),
				A2(
					$elm$core$Basics$max,
					accmax,
					A2($elm$core$Basics$max, y1, y2)));
		});
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, _v1) {
				var mi = _v0.a;
				var ma = _v0.b;
				var accmin = _v1.a;
				var accmax = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$Basics$min, mi, accmin),
					A2($elm$core$Basics$max, ma, accmax));
			}),
		_Utils_Tuple2(0, 0),
		A2(
			$elm$core$List$map,
			A2(
				$elm$core$List$foldl,
				folder,
				_Utils_Tuple2(0, 0)),
			coords));
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $gampleman$elm_visualization$Shape$Stack$computeStack = function (_v0) {
	var data = _v0.data;
	var order = _v0.order;
	var offset = _v0.offset;
	var _v1 = $elm$core$List$unzip(
		order(data));
	var labels = _v1.a;
	var values = _v1.b;
	var stacked = offset(
		A2(
			$elm$core$List$map,
			$elm$core$List$map(
				function (e) {
					return _Utils_Tuple2(0, e);
				}),
			values));
	return {
		extent: $gampleman$elm_visualization$Shape$Stack$calculateExtremes(stacked),
		labels: labels,
		values: stacked
	};
};
var $gampleman$elm_visualization$Shape$stack = $gampleman$elm_visualization$Shape$Stack$computeStack;
var $gampleman$elm_visualization$Shape$Stack$offsetNone = function (series) {
	if (!series.b) {
		return _List_Nil;
	} else {
		var x = series.a;
		var xs = series.b;
		var weirdAdd = F2(
			function (_v3, _v4) {
				var s11 = _v3.b;
				var s00 = _v4.a;
				var s01 = _v4.b;
				return $elm$core$Basics$isNaN(s01) ? _Utils_Tuple2(s00, s11 + s00) : _Utils_Tuple2(s01, s11 + s01);
			});
		var helper = F2(
			function (s1, _v2) {
				var s0 = _v2.a;
				var accum = _v2.b;
				return _Utils_Tuple2(
					A3($elm$core$List$map2, weirdAdd, s1, s0),
					A2($elm$core$List$cons, s0, accum));
			});
		return $elm$core$List$reverse(
			function (_v1) {
				var a = _v1.a;
				var b = _v1.b;
				return A2($elm$core$List$cons, a, b);
			}(
				A3(
					$elm$core$List$foldl,
					helper,
					_Utils_Tuple2(x, _List_Nil),
					xs)));
	}
};
var $gampleman$elm_visualization$Shape$stackOffsetNone = $gampleman$elm_visualization$Shape$Stack$offsetNone;
var $elm_community$typed_svg$TypedSvg$Attributes$stroke = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('stroke'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString);
var $elm_community$typed_svg$TypedSvg$Attributes$strokeDasharray = $elm_community$typed_svg$TypedSvg$Core$attribute('stroke-dasharray');
var $gampleman$elm_visualization$Axis$TickCount = function (a) {
	return {$: 'TickCount', a: a};
};
var $gampleman$elm_visualization$Axis$tickCount = $gampleman$elm_visualization$Axis$TickCount;
var $justinmimbs$time_extra$Time$Extra$Day = {$: 'Day'};
var $justinmimbs$date$Date$Days = {$: 'Days'};
var $justinmimbs$time_extra$Time$Extra$Millisecond = {$: 'Millisecond'};
var $justinmimbs$time_extra$Time$Extra$Month = {$: 'Month'};
var $justinmimbs$date$Date$Months = {$: 'Months'};
var $justinmimbs$date$Date$RD = function (a) {
	return {$: 'RD', a: a};
};
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m.$) {
			case 'Jan':
				return 0;
			case 'Feb':
				return 31;
			case 'Mar':
				return 59 + leapDays;
			case 'Apr':
				return 90 + leapDays;
			case 'May':
				return 120 + leapDays;
			case 'Jun':
				return 151 + leapDays;
			case 'Jul':
				return 181 + leapDays;
			case 'Aug':
				return 212 + leapDays;
			case 'Sep':
				return 243 + leapDays;
			case 'Oct':
				return 273 + leapDays;
			case 'Nov':
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m.$) {
			case 'Jan':
				return 31;
			case 'Feb':
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m.$) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return $elm$time$Time$Jan;
		case 2:
			return $elm$time$Time$Feb;
		case 3:
			return $elm$time$Time$Mar;
		case 4:
			return $elm$time$Time$Apr;
		case 5:
			return $elm$time$Time$May;
		case 6:
			return $elm$time$Time$Jun;
		case 7:
			return $elm$time$Time$Jul;
		case 8:
			return $elm$time$Time$Aug;
		case 9:
			return $elm$time$Time$Sep;
		case 10:
			return $elm$time$Time$Oct;
		case 11:
			return $elm$time$Time$Nov;
		default:
			return $elm$time$Time$Dec;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {day: d, month: m, year: y};
			}
		}
	});
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0.a;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0.a;
	var y = $justinmimbs$date$Date$year(
		$justinmimbs$date$Date$RD(rd));
	return {
		ordinalDay: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		year: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0.a;
	var date = $justinmimbs$date$Date$toOrdinalDate(
		$justinmimbs$date$Date$RD(rd));
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.year, $elm$time$Time$Jan, date.ordinalDay);
};
var $justinmimbs$date$Date$add = F3(
	function (unit, n, _v0) {
		var rd = _v0.a;
		switch (unit.$) {
			case 'Years':
				return A3(
					$justinmimbs$date$Date$add,
					$justinmimbs$date$Date$Months,
					12 * n,
					$justinmimbs$date$Date$RD(rd));
			case 'Months':
				var date = $justinmimbs$date$Date$toCalendarDate(
					$justinmimbs$date$Date$RD(rd));
				var wholeMonths = ((12 * (date.year - 1)) + ($justinmimbs$date$Date$monthToNumber(date.month) - 1)) + n;
				var m = $justinmimbs$date$Date$numberToMonth(
					A2($elm$core$Basics$modBy, 12, wholeMonths) + 1);
				var y = A2($justinmimbs$date$Date$floorDiv, wholeMonths, 12) + 1;
				return $justinmimbs$date$Date$RD(
					($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A2(
						$elm$core$Basics$min,
						date.day,
						A2($justinmimbs$date$Date$daysInMonth, y, m)));
			case 'Weeks':
				return $justinmimbs$date$Date$RD(rd + (7 * n));
			default:
				return $justinmimbs$date$Date$RD(rd + n);
		}
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return $justinmimbs$date$Date$RD(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
				$elm$core$Basics$clamp,
				1,
				A2($justinmimbs$date$Date$daysInMonth, y, m),
				d));
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $justinmimbs$date$Date$toRataDie = function (_v0) {
	var rd = _v0.a;
	return rd;
};
var $justinmimbs$time_extra$Time$Extra$dateToMillis = function (date) {
	var daysSinceEpoch = $justinmimbs$date$Date$toRataDie(date) - 719163;
	return daysSinceEpoch * 86400000;
};
var $justinmimbs$time_extra$Time$Extra$timeFromClock = F4(
	function (hour, minute, second, millisecond) {
		return (((hour * 3600000) + (minute * 60000)) + (second * 1000)) + millisecond;
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $justinmimbs$time_extra$Time$Extra$timeFromPosix = F2(
	function (zone, posix) {
		return A4(
			$justinmimbs$time_extra$Time$Extra$timeFromClock,
			A2($elm$time$Time$toHour, zone, posix),
			A2($elm$time$Time$toMinute, zone, posix),
			A2($elm$time$Time$toSecond, zone, posix),
			A2($elm$time$Time$toMillis, zone, posix));
	});
var $justinmimbs$time_extra$Time$Extra$toOffset = F2(
	function (zone, posix) {
		var millis = $elm$time$Time$posixToMillis(posix);
		var localMillis = $justinmimbs$time_extra$Time$Extra$dateToMillis(
			A2($justinmimbs$date$Date$fromPosix, zone, posix)) + A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix);
		return ((localMillis - millis) / 60000) | 0;
	});
var $justinmimbs$time_extra$Time$Extra$posixFromDateTime = F3(
	function (zone, date, time) {
		var millis = $justinmimbs$time_extra$Time$Extra$dateToMillis(date) + time;
		var offset0 = A2(
			$justinmimbs$time_extra$Time$Extra$toOffset,
			zone,
			$elm$time$Time$millisToPosix(millis));
		var posix1 = $elm$time$Time$millisToPosix(millis - (offset0 * 60000));
		var offset1 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix1);
		if (_Utils_eq(offset0, offset1)) {
			return posix1;
		} else {
			var posix2 = $elm$time$Time$millisToPosix(millis - (offset1 * 60000));
			var offset2 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix2);
			return _Utils_eq(offset1, offset2) ? posix2 : posix1;
		}
	});
var $justinmimbs$time_extra$Time$Extra$add = F4(
	function (interval, n, zone, posix) {
		add:
		while (true) {
			switch (interval.$) {
				case 'Millisecond':
					return $elm$time$Time$millisToPosix(
						$elm$time$Time$posixToMillis(posix) + n);
				case 'Second':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Millisecond,
						$temp$n = n * 1000,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				case 'Minute':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Millisecond,
						$temp$n = n * 60000,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				case 'Hour':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Millisecond,
						$temp$n = n * 3600000,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				case 'Day':
					return A3(
						$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
						zone,
						A3(
							$justinmimbs$date$Date$add,
							$justinmimbs$date$Date$Days,
							n,
							A2($justinmimbs$date$Date$fromPosix, zone, posix)),
						A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix));
				case 'Month':
					return A3(
						$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
						zone,
						A3(
							$justinmimbs$date$Date$add,
							$justinmimbs$date$Date$Months,
							n,
							A2($justinmimbs$date$Date$fromPosix, zone, posix)),
						A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix));
				case 'Year':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Month,
						$temp$n = n * 12,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				case 'Quarter':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Month,
						$temp$n = n * 3,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				case 'Week':
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Day,
						$temp$n = n * 7,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
				default:
					var weekday = interval;
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Day,
						$temp$n = n * 7,
						$temp$zone = zone,
						$temp$posix = posix;
					interval = $temp$interval;
					n = $temp$n;
					zone = $temp$zone;
					posix = $temp$posix;
					continue add;
			}
		}
	});
var $justinmimbs$date$Date$Day = {$: 'Day'};
var $justinmimbs$date$Date$Friday = {$: 'Friday'};
var $justinmimbs$date$Date$Monday = {$: 'Monday'};
var $justinmimbs$date$Date$Month = {$: 'Month'};
var $justinmimbs$date$Date$Quarter = {$: 'Quarter'};
var $justinmimbs$date$Date$Saturday = {$: 'Saturday'};
var $justinmimbs$date$Date$Sunday = {$: 'Sunday'};
var $justinmimbs$date$Date$Thursday = {$: 'Thursday'};
var $justinmimbs$date$Date$Tuesday = {$: 'Tuesday'};
var $justinmimbs$date$Date$Wednesday = {$: 'Wednesday'};
var $justinmimbs$date$Date$Week = {$: 'Week'};
var $justinmimbs$date$Date$Year = {$: 'Year'};
var $elm$time$Time$Fri = {$: 'Fri'};
var $elm$time$Time$Mon = {$: 'Mon'};
var $elm$time$Time$Sat = {$: 'Sat'};
var $elm$time$Time$Sun = {$: 'Sun'};
var $elm$time$Time$Thu = {$: 'Thu'};
var $elm$time$Time$Tue = {$: 'Tue'};
var $elm$time$Time$Wed = {$: 'Wed'};
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0.a;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$weekdayToNumber = function (wd) {
	switch (wd.$) {
		case 'Mon':
			return 1;
		case 'Tue':
			return 2;
		case 'Wed':
			return 3;
		case 'Thu':
			return 4;
		case 'Fri':
			return 5;
		case 'Sat':
			return 6;
		default:
			return 7;
	}
};
var $justinmimbs$date$Date$daysSincePreviousWeekday = F2(
	function (wd, date) {
		return A2(
			$elm$core$Basics$modBy,
			7,
			($justinmimbs$date$Date$weekdayNumber(date) + 7) - $justinmimbs$date$Date$weekdayToNumber(wd));
	});
var $justinmimbs$date$Date$firstOfMonth = F2(
	function (y, m) {
		return $justinmimbs$date$Date$RD(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + 1);
	});
var $justinmimbs$date$Date$firstOfYear = function (y) {
	return $justinmimbs$date$Date$RD(
		$justinmimbs$date$Date$daysBeforeYear(y) + 1);
};
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.month;
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $justinmimbs$date$Date$quarterToMonth = function (q) {
	return $justinmimbs$date$Date$numberToMonth((q * 3) - 2);
};
var $justinmimbs$date$Date$floor = F2(
	function (interval, date) {
		var rd = date.a;
		switch (interval.$) {
			case 'Year':
				return $justinmimbs$date$Date$firstOfYear(
					$justinmimbs$date$Date$year(date));
			case 'Quarter':
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$quarterToMonth(
						$justinmimbs$date$Date$quarter(date)));
			case 'Month':
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$month(date));
			case 'Week':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
			case 'Monday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
			case 'Tuesday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Tue, date));
			case 'Wednesday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Wed, date));
			case 'Thursday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Thu, date));
			case 'Friday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Fri, date));
			case 'Saturday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sat, date));
			case 'Sunday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sun, date));
			default:
				return date;
		}
	});
var $justinmimbs$time_extra$Time$Extra$floorDate = F3(
	function (dateInterval, zone, posix) {
		return A3(
			$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
			zone,
			A2(
				$justinmimbs$date$Date$floor,
				dateInterval,
				A2($justinmimbs$date$Date$fromPosix, zone, posix)),
			0);
	});
var $justinmimbs$time_extra$Time$Extra$floor = F3(
	function (interval, zone, posix) {
		switch (interval.$) {
			case 'Millisecond':
				return posix;
			case 'Second':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						A2($elm$time$Time$toMinute, zone, posix),
						A2($elm$time$Time$toSecond, zone, posix),
						0));
			case 'Minute':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						A2($elm$time$Time$toMinute, zone, posix),
						0,
						0));
			case 'Hour':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						0,
						0,
						0));
			case 'Day':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Day, zone, posix);
			case 'Month':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Month, zone, posix);
			case 'Year':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Year, zone, posix);
			case 'Quarter':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Quarter, zone, posix);
			case 'Week':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Week, zone, posix);
			case 'Monday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Monday, zone, posix);
			case 'Tuesday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Tuesday, zone, posix);
			case 'Wednesday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Wednesday, zone, posix);
			case 'Thursday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Thursday, zone, posix);
			case 'Friday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Friday, zone, posix);
			case 'Saturday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Saturday, zone, posix);
			default:
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Sunday, zone, posix);
		}
	});
var $justinmimbs$time_extra$Time$Extra$ceiling = F3(
	function (interval, zone, posix) {
		var floored = A3($justinmimbs$time_extra$Time$Extra$floor, interval, zone, posix);
		return _Utils_eq(floored, posix) ? posix : A4($justinmimbs$time_extra$Time$Extra$add, interval, 1, zone, floored);
	});
var $justinmimbs$time_extra$Time$Extra$Year = {$: 'Year'};
var $gampleman$elm_visualization$Scale$Time$timeLength = function (interval) {
	switch (interval.$) {
		case 'Millisecond':
			return 1;
		case 'Second':
			return 1000;
		case 'Minute':
			return 60 * 1000;
		case 'Hour':
			return (60 * 60) * 1000;
		case 'Day':
			return ((24 * 60) * 60) * 1000;
		case 'Month':
			return (((30 * 24) * 60) * 60) * 1000;
		case 'Year':
			return ((((365 * 30) * 24) * 60) * 60) * 1000;
		case 'Quarter':
			return ((((4 * 30) * 24) * 60) * 60) * 1000;
		case 'Week':
			return (((7 * 24) * 60) * 60) * 1000;
		default:
			return 0;
	}
};
var $gampleman$elm_visualization$Scale$Time$findInterval = F2(
	function (target, intervals) {
		findInterval:
		while (true) {
			if (!intervals.b) {
				return _Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Year, 1);
			} else {
				if (intervals.b.b) {
					var _v1 = intervals.a;
					var interval = _v1.a;
					var step = _v1.b;
					var _v2 = intervals.b;
					var _v3 = _v2.a;
					var interval_ = _v3.a;
					var step_ = _v3.b;
					var xs = _v2.b;
					var ratio_ = (step_ * $gampleman$elm_visualization$Scale$Time$timeLength(interval_)) / target;
					var ratio = target / (step * $gampleman$elm_visualization$Scale$Time$timeLength(interval));
					if (_Utils_cmp(ratio, ratio_) < 0) {
						return _Utils_Tuple2(interval, step);
					} else {
						var $temp$target = target,
							$temp$intervals = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(interval_, step_),
							xs);
						target = $temp$target;
						intervals = $temp$intervals;
						continue findInterval;
					}
				} else {
					var x = intervals.a;
					return x;
				}
			}
		}
	});
var $justinmimbs$time_extra$Time$Extra$Hour = {$: 'Hour'};
var $justinmimbs$time_extra$Time$Extra$Minute = {$: 'Minute'};
var $justinmimbs$time_extra$Time$Extra$Second = {$: 'Second'};
var $justinmimbs$time_extra$Time$Extra$Week = {$: 'Week'};
var $gampleman$elm_visualization$Scale$Time$tickIntervals = _List_fromArray(
	[
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Second, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Second, 5),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Second, 15),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Second, 30),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Minute, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Minute, 5),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Minute, 15),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Minute, 30),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Hour, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Hour, 3),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Hour, 6),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Hour, 12),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Day, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Day, 2),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Week, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Month, 1),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Month, 3),
		_Utils_Tuple2($justinmimbs$time_extra$Time$Extra$Year, 1)
	]);
var $gampleman$elm_visualization$Scale$Time$toTime = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	return _Utils_Tuple2(
		$elm$time$Time$posixToMillis(a),
		$elm$time$Time$posixToMillis(b));
};
var $gampleman$elm_visualization$Scale$Time$nice = F3(
	function (zone, domain, count) {
		var _v0 = $gampleman$elm_visualization$Scale$Time$toTime(domain);
		var start = _v0.a;
		var end = _v0.b;
		var target = $elm$core$Basics$abs(start - end) / count;
		var _v1 = A2($gampleman$elm_visualization$Scale$Time$findInterval, target, $gampleman$elm_visualization$Scale$Time$tickIntervals);
		var interval = _v1.a;
		return _Utils_Tuple2(
			A3($justinmimbs$time_extra$Time$Extra$floor, interval, zone, domain.a),
			A3($justinmimbs$time_extra$Time$Extra$ceiling, interval, zone, domain.b));
	});
var $ryan_haskell$date_format$DateFormat$AmPmLowercase = {$: 'AmPmLowercase'};
var $ryan_haskell$date_format$DateFormat$amPmLowercase = $ryan_haskell$date_format$DateFormat$AmPmLowercase;
var $ryan_haskell$date_format$DateFormat$DayOfMonthFixed = {$: 'DayOfMonthFixed'};
var $ryan_haskell$date_format$DateFormat$dayOfMonthFixed = $ryan_haskell$date_format$DateFormat$DayOfMonthFixed;
var $ryan_haskell$date_format$DateFormat$Language$Language = F6(
	function (toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
		return {toAmPm: toAmPm, toMonthAbbreviation: toMonthAbbreviation, toMonthName: toMonthName, toOrdinalSuffix: toOrdinalSuffix, toWeekdayAbbreviation: toWeekdayAbbreviation, toWeekdayName: toWeekdayName};
	});
var $ryan_haskell$date_format$DateFormat$Language$toEnglishAmPm = function (hour) {
	return (hour > 11) ? 'pm' : 'am';
};
var $ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName = function (month) {
	switch (month.$) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var $ryan_haskell$date_format$DateFormat$Language$toEnglishSuffix = function (num) {
	var _v0 = A2($elm$core$Basics$modBy, 100, num);
	switch (_v0) {
		case 11:
			return 'th';
		case 12:
			return 'th';
		case 13:
			return 'th';
		default:
			var _v1 = A2($elm$core$Basics$modBy, 10, num);
			switch (_v1) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
	}
};
var $ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName = function (weekday) {
	switch (weekday.$) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $ryan_haskell$date_format$DateFormat$Language$english = A6(
	$ryan_haskell$date_format$DateFormat$Language$Language,
	$ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName,
	A2(
		$elm$core$Basics$composeR,
		$ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName,
		$elm$core$String$left(3)),
	$ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName,
	A2(
		$elm$core$Basics$composeR,
		$ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName,
		$elm$core$String$left(3)),
	$ryan_haskell$date_format$DateFormat$Language$toEnglishAmPm,
	$ryan_haskell$date_format$DateFormat$Language$toEnglishSuffix);
var $ryan_haskell$date_format$DateFormat$amPm = F3(
	function (language, zone, posix) {
		return language.toAmPm(
			A2($elm$time$Time$toHour, zone, posix));
	});
var $ryan_haskell$date_format$DateFormat$dayOfMonth = $elm$time$Time$toDay;
var $ryan_haskell$date_format$DateFormat$days = _List_fromArray(
	[$elm$time$Time$Sun, $elm$time$Time$Mon, $elm$time$Time$Tue, $elm$time$Time$Wed, $elm$time$Time$Thu, $elm$time$Time$Fri, $elm$time$Time$Sat]);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return $elm$time$Time$Thu;
			case 1:
				return $elm$time$Time$Fri;
			case 2:
				return $elm$time$Time$Sat;
			case 3:
				return $elm$time$Time$Sun;
			case 4:
				return $elm$time$Time$Mon;
			case 5:
				return $elm$time$Time$Tue;
			default:
				return $elm$time$Time$Wed;
		}
	});
var $ryan_haskell$date_format$DateFormat$dayOfWeek = F2(
	function (zone, posix) {
		return function (_v1) {
			var i = _v1.a;
			return i;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, $elm$time$Time$Sun),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var day = _v0.b;
							return _Utils_eq(
								day,
								A2($elm$time$Time$toWeekday, zone, posix));
						},
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, day) {
									return _Utils_Tuple2(i, day);
								}),
							$ryan_haskell$date_format$DateFormat$days)))));
	});
var $ryan_haskell$date_format$DateFormat$isLeapYear = function (year_) {
	return (!(!A2($elm$core$Basics$modBy, 4, year_))) ? false : ((!(!A2($elm$core$Basics$modBy, 100, year_))) ? true : ((!(!A2($elm$core$Basics$modBy, 400, year_))) ? false : true));
};
var $ryan_haskell$date_format$DateFormat$daysInMonth = F2(
	function (year_, month) {
		switch (month.$) {
			case 'Jan':
				return 31;
			case 'Feb':
				return $ryan_haskell$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var $ryan_haskell$date_format$DateFormat$months = _List_fromArray(
	[$elm$time$Time$Jan, $elm$time$Time$Feb, $elm$time$Time$Mar, $elm$time$Time$Apr, $elm$time$Time$May, $elm$time$Time$Jun, $elm$time$Time$Jul, $elm$time$Time$Aug, $elm$time$Time$Sep, $elm$time$Time$Oct, $elm$time$Time$Nov, $elm$time$Time$Dec]);
var $ryan_haskell$date_format$DateFormat$monthPair = F2(
	function (zone, posix) {
		return A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, $elm$time$Time$Jan),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var i = _v0.a;
						var m = _v0.b;
						return _Utils_eq(
							m,
							A2($elm$time$Time$toMonth, zone, posix));
					},
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (a, b) {
								return _Utils_Tuple2(a, b);
							}),
						$ryan_haskell$date_format$DateFormat$months))));
	});
var $ryan_haskell$date_format$DateFormat$monthNumber_ = F2(
	function (zone, posix) {
		return 1 + function (_v0) {
			var i = _v0.a;
			var m = _v0.b;
			return i;
		}(
			A2($ryan_haskell$date_format$DateFormat$monthPair, zone, posix));
	});
var $ryan_haskell$date_format$DateFormat$dayOfYear = F2(
	function (zone, posix) {
		var monthsBeforeThisOne = A2(
			$elm$core$List$take,
			A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix) - 1,
			$ryan_haskell$date_format$DateFormat$months);
		var daysBeforeThisMonth = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$ryan_haskell$date_format$DateFormat$daysInMonth(
					A2($elm$time$Time$toYear, zone, posix)),
				monthsBeforeThisOne));
		return daysBeforeThisMonth + A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix);
	});
var $ryan_haskell$date_format$DateFormat$quarter = F2(
	function (zone, posix) {
		return (A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix) / 4) | 0;
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $ryan_haskell$date_format$DateFormat$toFixedLength = F2(
	function (totalChars, num) {
		var numStr = $elm$core$String$fromInt(num);
		var numZerosNeeded = totalChars - $elm$core$String$length(numStr);
		var zeros = A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				function (_v0) {
					return '0';
				},
				A2($elm$core$List$range, 1, numZerosNeeded)));
		return _Utils_ap(zeros, numStr);
	});
var $elm$core$String$toLower = _String_toLower;
var $ryan_haskell$date_format$DateFormat$toNonMilitary = function (num) {
	return (!num) ? 12 : ((num <= 12) ? num : (num - 12));
};
var $elm$core$String$toUpper = _String_toUpper;
var $ryan_haskell$date_format$DateFormat$millisecondsPerYear = $elm$core$Basics$round((((1000 * 60) * 60) * 24) * 365.25);
var $ryan_haskell$date_format$DateFormat$firstDayOfYear = F2(
	function (zone, time) {
		return $elm$time$Time$millisToPosix(
			$ryan_haskell$date_format$DateFormat$millisecondsPerYear * A2($elm$time$Time$toYear, zone, time));
	});
var $ryan_haskell$date_format$DateFormat$weekOfYear = F2(
	function (zone, posix) {
		var firstDay = A2($ryan_haskell$date_format$DateFormat$firstDayOfYear, zone, posix);
		var firstDayOffset = A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, firstDay);
		var daysSoFar = A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix);
		return (((daysSoFar + firstDayOffset) / 7) | 0) + 1;
	});
var $ryan_haskell$date_format$DateFormat$year = F2(
	function (zone, time) {
		return $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, time));
	});
var $ryan_haskell$date_format$DateFormat$piece = F4(
	function (language, zone, posix, token) {
		switch (token.$) {
			case 'MonthNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthNameAbbreviated':
				return language.toMonthAbbreviation(
					A2($elm$time$Time$toMonth, zone, posix));
			case 'MonthNameFull':
				return language.toMonthName(
					A2($elm$time$Time$toMonth, zone, posix));
			case 'QuarterNumber':
				return $elm$core$String$fromInt(
					1 + A2($ryan_haskell$date_format$DateFormat$quarter, zone, posix));
			case 'QuarterSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					1 + A2($ryan_haskell$date_format$DateFormat$quarter, zone, posix));
			case 'DayOfMonthNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfYearNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					3,
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfWeekNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekNameAbbreviated':
				return language.toWeekdayAbbreviation(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 'DayOfWeekNameFull':
				return language.toWeekdayName(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 'WeekOfYearNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'YearNumberLastTwo':
				return A2(
					$elm$core$String$right,
					2,
					A2($ryan_haskell$date_format$DateFormat$year, zone, posix));
			case 'YearNumber':
				return A2($ryan_haskell$date_format$DateFormat$year, zone, posix);
			case 'AmPmUppercase':
				return $elm$core$String$toUpper(
					A3($ryan_haskell$date_format$DateFormat$amPm, language, zone, posix));
			case 'AmPmLowercase':
				return $elm$core$String$toLower(
					A3($ryan_haskell$date_format$DateFormat$amPm, language, zone, posix));
			case 'HourMilitaryNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toHour, zone, posix));
			case 'HourNumber':
				return $elm$core$String$fromInt(
					$ryan_haskell$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 'HourFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					$ryan_haskell$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 'HourMilitaryFromOneNumber':
				return $elm$core$String$fromInt(
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFromOneFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 'MinuteNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMinute, zone, posix));
			case 'MinuteFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toMinute, zone, posix));
			case 'SecondNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toSecond, zone, posix));
			case 'SecondFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toSecond, zone, posix));
			case 'MillisecondNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMillis, zone, posix));
			case 'MillisecondFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					3,
					A2($elm$time$Time$toMillis, zone, posix));
			default:
				var string = token.a;
				return string;
		}
	});
var $ryan_haskell$date_format$DateFormat$formatWithLanguage = F4(
	function (language, tokens, zone, time) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A3($ryan_haskell$date_format$DateFormat$piece, language, zone, time),
				tokens));
	});
var $ryan_haskell$date_format$DateFormat$format = $ryan_haskell$date_format$DateFormat$formatWithLanguage($ryan_haskell$date_format$DateFormat$Language$english);
var $ryan_haskell$date_format$DateFormat$HourFixed = {$: 'HourFixed'};
var $ryan_haskell$date_format$DateFormat$hourFixed = $ryan_haskell$date_format$DateFormat$HourFixed;
var $ryan_haskell$date_format$DateFormat$MillisecondFixed = {$: 'MillisecondFixed'};
var $ryan_haskell$date_format$DateFormat$millisecondFixed = $ryan_haskell$date_format$DateFormat$MillisecondFixed;
var $ryan_haskell$date_format$DateFormat$MinuteFixed = {$: 'MinuteFixed'};
var $ryan_haskell$date_format$DateFormat$minuteFixed = $ryan_haskell$date_format$DateFormat$MinuteFixed;
var $ryan_haskell$date_format$DateFormat$MonthNameAbbreviated = {$: 'MonthNameAbbreviated'};
var $ryan_haskell$date_format$DateFormat$monthNameAbbreviated = $ryan_haskell$date_format$DateFormat$MonthNameAbbreviated;
var $ryan_haskell$date_format$DateFormat$MonthNameFull = {$: 'MonthNameFull'};
var $ryan_haskell$date_format$DateFormat$monthNameFull = $ryan_haskell$date_format$DateFormat$MonthNameFull;
var $ryan_haskell$date_format$DateFormat$SecondFixed = {$: 'SecondFixed'};
var $ryan_haskell$date_format$DateFormat$secondFixed = $ryan_haskell$date_format$DateFormat$SecondFixed;
var $ryan_haskell$date_format$DateFormat$Text = function (a) {
	return {$: 'Text', a: a};
};
var $ryan_haskell$date_format$DateFormat$text = $ryan_haskell$date_format$DateFormat$Text;
var $ryan_haskell$date_format$DateFormat$YearNumber = {$: 'YearNumber'};
var $ryan_haskell$date_format$DateFormat$yearNumber = $ryan_haskell$date_format$DateFormat$YearNumber;
var $gampleman$elm_visualization$Scale$Time$tickFormat = F4(
	function (zone, _v0, _v1, date) {
		var time = $elm$time$Time$posixToMillis(date);
		var significant = function (interval) {
			return _Utils_cmp(
				$elm$time$Time$posixToMillis(
					A3($justinmimbs$time_extra$Time$Extra$floor, interval, zone, date)),
				time) < 0;
		};
		var format = significant($justinmimbs$time_extra$Time$Extra$Second) ? _List_fromArray(
			[
				$ryan_haskell$date_format$DateFormat$text('.'),
				$ryan_haskell$date_format$DateFormat$millisecondFixed
			]) : (significant($justinmimbs$time_extra$Time$Extra$Minute) ? _List_fromArray(
			[
				$ryan_haskell$date_format$DateFormat$text(':'),
				$ryan_haskell$date_format$DateFormat$secondFixed
			]) : (significant($justinmimbs$time_extra$Time$Extra$Hour) ? _List_fromArray(
			[
				$ryan_haskell$date_format$DateFormat$hourFixed,
				$ryan_haskell$date_format$DateFormat$text(':'),
				$ryan_haskell$date_format$DateFormat$minuteFixed
			]) : (significant($justinmimbs$time_extra$Time$Extra$Day) ? _List_fromArray(
			[
				$ryan_haskell$date_format$DateFormat$hourFixed,
				$ryan_haskell$date_format$DateFormat$text(' '),
				$ryan_haskell$date_format$DateFormat$amPmLowercase
			]) : (significant($justinmimbs$time_extra$Time$Extra$Month) ? _List_fromArray(
			[
				$ryan_haskell$date_format$DateFormat$dayOfMonthFixed,
				$ryan_haskell$date_format$DateFormat$text(' '),
				$ryan_haskell$date_format$DateFormat$monthNameAbbreviated
			]) : (significant($justinmimbs$time_extra$Time$Extra$Year) ? _List_fromArray(
			[$ryan_haskell$date_format$DateFormat$monthNameFull]) : _List_fromArray(
			[$ryan_haskell$date_format$DateFormat$yearNumber]))))));
		return A3($ryan_haskell$date_format$DateFormat$format, format, zone, date);
	});
var $justinmimbs$time_extra$Time$Extra$rangeHelp = F6(
	function (interval, step, zone, until, revList, current) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(
				$elm$time$Time$posixToMillis(current),
				$elm$time$Time$posixToMillis(until)) < 0) {
				var $temp$interval = interval,
					$temp$step = step,
					$temp$zone = zone,
					$temp$until = until,
					$temp$revList = A2($elm$core$List$cons, current, revList),
					$temp$current = A4($justinmimbs$time_extra$Time$Extra$add, interval, step, zone, current);
				interval = $temp$interval;
				step = $temp$step;
				zone = $temp$zone;
				until = $temp$until;
				revList = $temp$revList;
				current = $temp$current;
				continue rangeHelp;
			} else {
				return $elm$core$List$reverse(revList);
			}
		}
	});
var $justinmimbs$time_extra$Time$Extra$range = F5(
	function (interval, step, zone, start, until) {
		return A6(
			$justinmimbs$time_extra$Time$Extra$rangeHelp,
			interval,
			A2($elm$core$Basics$max, 1, step),
			zone,
			until,
			_List_Nil,
			A3($justinmimbs$time_extra$Time$Extra$ceiling, interval, zone, start));
	});
var $gampleman$elm_visualization$Scale$Time$ticks = F3(
	function (zone, domain, count) {
		var _v0 = $gampleman$elm_visualization$Scale$Time$toTime(domain);
		var start = _v0.a;
		var end = _v0.b;
		var target = $elm$core$Basics$abs(start - end) / count;
		var _v1 = A2($gampleman$elm_visualization$Scale$Time$findInterval, target, $gampleman$elm_visualization$Scale$Time$tickIntervals);
		var interval = _v1.a;
		var step = _v1.b;
		return A5(
			$justinmimbs$time_extra$Time$Extra$range,
			interval,
			$elm$core$Basics$round(step),
			zone,
			domain.a,
			domain.b);
	});
var $gampleman$elm_visualization$Scale$Time$scale = F3(
	function (zone, range_, domain_) {
		return {
			convert: A2(
				$gampleman$elm_visualization$Scale$Continuous$convertTransform,
				A2($elm$core$Basics$composeR, $elm$time$Time$posixToMillis, $elm$core$Basics$toFloat),
				$gampleman$elm_visualization$Interpolation$float),
			domain: domain_,
			invert: A2(
				$gampleman$elm_visualization$Scale$Continuous$invertTransform,
				A2($elm$core$Basics$composeR, $elm$time$Time$posixToMillis, $elm$core$Basics$toFloat),
				A2($elm$core$Basics$composeR, $elm$core$Basics$round, $elm$time$Time$millisToPosix)),
			nice: $gampleman$elm_visualization$Scale$Time$nice(zone),
			range: range_,
			rangeExtent: F2(
				function (_v0, r) {
					return r;
				}),
			tickFormat: $gampleman$elm_visualization$Scale$Time$tickFormat(zone),
			ticks: $gampleman$elm_visualization$Scale$Time$ticks(zone)
		};
	});
var $gampleman$elm_visualization$Scale$time = F3(
	function (zone, range_, domain_) {
		return $gampleman$elm_visualization$Scale$Scale(
			A3($gampleman$elm_visualization$Scale$Time$scale, zone, range_, domain_));
	});
var $author$project$Chart$StackedArea$view = function (cfg) {
	var unixList = A2(
		$elm$core$List$map,
		function ($) {
			return $.unixSeconds;
		},
		cfg.rows);
	var tMin = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$minimum(unixList));
	var tMax = A2(
		$elm$core$Maybe$withDefault,
		1,
		$elm$core$List$maximum(unixList));
	var seriesData = A2(
		$elm$core$List$map,
		function (b) {
			return _Utils_Tuple2(
				b.name,
				A2($elm$core$List$map, b.value, cfg.rows));
		},
		$author$project$Energy$bandsStacked);
	var stacked = $gampleman$elm_visualization$Shape$stack(
		{data: seriesData, offset: $gampleman$elm_visualization$Shape$stackOffsetNone, order: $elm$core$Basics$identity});
	var plotW = (cfg.width - $author$project$Chart$StackedArea$pad.left) - $author$project$Chart$StackedArea$pad.right;
	var xScale = A3(
		$gampleman$elm_visualization$Scale$time,
		$elm$time$Time$utc,
		_Utils_Tuple2(0, plotW),
		_Utils_Tuple2(
			$author$project$Chart$StackedArea$posix(tMin),
			$author$project$Chart$StackedArea$posix(tMax)));
	var xOf = function (r) {
		return A2(
			$gampleman$elm_visualization$Scale$convert,
			xScale,
			$author$project$Chart$StackedArea$posix(r.unixSeconds));
	};
	var plotH = (cfg.height - $author$project$Chart$StackedArea$pad.top) - $author$project$Chart$StackedArea$pad.bottom;
	var maxStack = stacked.extent.b;
	var maxLoad = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$maximum(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.load;
				},
				cfg.rows)));
	var yMax = A2(
		$elm$core$Basics$max,
		1,
		A2($elm$core$Basics$max, maxStack, maxLoad) * 1.05);
	var yScale = A2(
		$gampleman$elm_visualization$Scale$linear,
		_Utils_Tuple2(plotH, 0),
		_Utils_Tuple2(0, yMax));
	var loadLine = A2(
		$folkertdev$one_true_path_experiment$Path$element,
		A2(
			$gampleman$elm_visualization$Shape$line,
			$gampleman$elm_visualization$Shape$linearCurve,
			A2(
				$elm$core$List$map,
				function (r) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							xOf(r),
							A2($gampleman$elm_visualization$Scale$convert, yScale, r.load)));
				},
				cfg.rows)),
		_List_fromArray(
			[
				$elm_community$typed_svg$TypedSvg$Attributes$class(
				_List_fromArray(
					['load-line'])),
				$elm_community$typed_svg$TypedSvg$Attributes$fill($elm_community$typed_svg$TypedSvg$Types$PaintNone),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth(1.8),
				$elm_community$typed_svg$TypedSvg$Attributes$strokeDasharray('5 3')
			]));
	var focusRect = function () {
		var _v2 = cfg.focusedDay;
		if (_v2.$ === 'Nothing') {
			return _List_Nil;
		} else {
			var d = _v2.a;
			var clampX = function (v) {
				return A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, plotW, v));
			};
			var x0 = clampX(
				A2(
					$gampleman$elm_visualization$Scale$convert,
					xScale,
					$author$project$Chart$StackedArea$posix(d * 86400)));
			var x1 = clampX(
				A2(
					$gampleman$elm_visualization$Scale$convert,
					xScale,
					$author$project$Chart$StackedArea$posix((d + 1) * 86400)));
			return _List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$rect,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(x0),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(0),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(
							A2($elm$core$Basics$max, 0, x1 - x0)),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(plotH),
							$elm_community$typed_svg$TypedSvg$Attributes$fill(
							$elm_community$typed_svg$TypedSvg$Types$Paint($avh4$elm_color$Color$black)),
							$elm_community$typed_svg$TypedSvg$Attributes$fillOpacity(
							$elm_community$typed_svg$TypedSvg$Types$Opacity(0.06)),
							$elm_community$typed_svg$TypedSvg$Attributes$stroke(
							$elm_community$typed_svg$TypedSvg$Types$Paint(
								A3($avh4$elm_color$Color$rgb255, 90, 90, 90))),
							$elm_community$typed_svg$TypedSvg$Attributes$strokeDasharray('3 2')
						]),
					_List_Nil)
				]);
		}
	}();
	var diffArea = function (toImport) {
		var pts = A2(
			$elm$core$List$map,
			function (r) {
				var load = r.load;
				var gen = $author$project$Energy$totalGeneration(r);
				var _v1 = toImport ? _Utils_Tuple2(
					A2($elm$core$Basics$min, load, gen),
					load) : _Utils_Tuple2(
					load,
					A2($elm$core$Basics$max, load, gen));
				var lo = _v1.a;
				var hi = _v1.b;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(
						_Utils_Tuple2(
							xOf(r),
							A2($gampleman$elm_visualization$Scale$convert, yScale, lo)),
						_Utils_Tuple2(
							xOf(r),
							A2($gampleman$elm_visualization$Scale$convert, yScale, hi))));
			},
			cfg.rows);
		return A2(
			$folkertdev$one_true_path_experiment$Path$element,
			A2($gampleman$elm_visualization$Shape$area, $gampleman$elm_visualization$Shape$linearCurve, pts),
			_List_fromArray(
				[
					$elm_community$typed_svg$TypedSvg$Attributes$class(
					_List_fromArray(
						[
							toImport ? 'deficit' : 'surplus'
						])),
					$elm_community$typed_svg$TypedSvg$Attributes$stroke($elm_community$typed_svg$TypedSvg$Types$PaintNone)
				]));
	};
	var areaFor = F2(
		function (band, pairs) {
			var dimmed = (!$elm$core$List$isEmpty(cfg.active)) && (!A2($elm$core$List$member, band.name, cfg.active));
			var areaPts = A3(
				$elm$core$List$map2,
				F2(
					function (r, _v0) {
						var lo = _v0.a;
						var hi = _v0.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								_Utils_Tuple2(
									xOf(r),
									A2($gampleman$elm_visualization$Scale$convert, yScale, lo)),
								_Utils_Tuple2(
									xOf(r),
									A2($gampleman$elm_visualization$Scale$convert, yScale, hi))));
					}),
				cfg.rows,
				pairs);
			return A2(
				$folkertdev$one_true_path_experiment$Path$element,
				A2($gampleman$elm_visualization$Shape$area, $gampleman$elm_visualization$Shape$linearCurve, areaPts),
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$fill(
						$elm_community$typed_svg$TypedSvg$Types$Paint(band.color)),
						$elm_community$typed_svg$TypedSvg$Attributes$class(
						dimmed ? _List_fromArray(
							['series', 'is-dim']) : _List_fromArray(
							['series'])),
						$elm_community$typed_svg$TypedSvg$Attributes$stroke($elm_community$typed_svg$TypedSvg$Types$PaintNone),
						$elm_community$typed_svg$TypedSvg$Events$onMouseOver(
						cfg.onHover(
							$elm$core$Maybe$Just(band.name))),
						$elm_community$typed_svg$TypedSvg$Events$onMouseOut(
						cfg.onHover($elm$core$Maybe$Nothing)),
						$elm_community$typed_svg$TypedSvg$Events$onClick(
						cfg.onPin(band.name))
					]));
		});
	var areas = A3($elm$core$List$map2, areaFor, $author$project$Energy$bandsStacked, stacked.values);
	return A2(
		$elm_community$typed_svg$TypedSvg$svg,
		_List_fromArray(
			[
				A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width, cfg.height),
				$elm_community$typed_svg$TypedSvg$Attributes$width(
				$elm_community$typed_svg$TypedSvg$Types$Percent(100))
			]),
		_List_fromArray(
			[
				A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, $author$project$Chart$StackedArea$pad.left, $author$project$Chart$StackedArea$pad.top)
							]))
					]),
				_Utils_ap(
					areas,
					_Utils_ap(
						_List_fromArray(
							[
								diffArea(false),
								diffArea(true)
							]),
						_Utils_ap(
							focusRect,
							_List_fromArray(
								[loadLine]))))),
				A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, $author$project$Chart$StackedArea$pad.left, $author$project$Chart$StackedArea$pad.top + plotH)
							])),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
						$elm_community$typed_svg$TypedSvg$Attributes$class(
						_List_fromArray(
							['axis']))
					]),
				_List_fromArray(
					[
						A2(
						$gampleman$elm_visualization$Axis$bottom,
						_List_fromArray(
							[
								$gampleman$elm_visualization$Axis$tickCount(6)
							]),
						xScale)
					])),
				A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, $author$project$Chart$StackedArea$pad.left, $author$project$Chart$StackedArea$pad.top)
							])),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
						$elm_community$typed_svg$TypedSvg$Attributes$class(
						_List_fromArray(
							['axis']))
					]),
				_List_fromArray(
					[
						A2(
						$gampleman$elm_visualization$Axis$left,
						_List_fromArray(
							[
								$gampleman$elm_visualization$Axis$tickCount(5)
							]),
						yScale)
					]))
			]));
};
var $elm_community$typed_svg$TypedSvg$Types$Rotate = F3(
	function (a, b, c) {
		return {$: 'Rotate', a: a, b: b, c: c};
	});
var $author$project$Chart$Treemap$TNode = F3(
	function (name, color, value) {
		return {color: color, name: name, value: value};
	});
var $gampleman$elm_rosetree$Tree$children = function (_v0) {
	var c = _v0.b;
	return c;
};
var $author$project$Chart$Treemap$drillTip = F2(
	function (name, tip) {
		return $elm$core$List$isEmpty(
			$author$project$Energy$bandSubs(name)) ? tip : (tip + '  ·  klicken zum Aufschlüsseln');
	});
var $gampleman$elm_rosetree$Tree$label = function (_v0) {
	var v = _v0.a;
	return v;
};
var $gampleman$elm_rosetree$Tree$Continue = function (a) {
	return {$: 'Continue', a: a};
};
var $gampleman$elm_rosetree$Tree$breadthFirstFoldHelp = F5(
	function (f, acc, parents, trees, nextSets) {
		breadthFirstFoldHelp:
		while (true) {
			if (!trees.b) {
				if (nextSets.b) {
					var _v2 = nextSets.a;
					var p = _v2.a;
					var set = _v2.b;
					var sets = nextSets.b;
					var $temp$f = f,
						$temp$acc = acc,
						$temp$parents = p,
						$temp$trees = set,
						$temp$nextSets = sets;
					f = $temp$f;
					acc = $temp$acc;
					parents = $temp$parents;
					trees = $temp$trees;
					nextSets = $temp$nextSets;
					continue breadthFirstFoldHelp;
				} else {
					return acc;
				}
			} else {
				var _v3 = trees.a;
				var d = _v3.a;
				var ch = _v3.b;
				var rest = trees.b;
				var _v4 = A4(f, acc, parents, d, ch);
				if (_v4.$ === 'Continue') {
					var a = _v4.a;
					if (!ch.b) {
						var $temp$f = f,
							$temp$acc = a,
							$temp$parents = parents,
							$temp$trees = rest,
							$temp$nextSets = nextSets;
						f = $temp$f;
						acc = $temp$acc;
						parents = $temp$parents;
						trees = $temp$trees;
						nextSets = $temp$nextSets;
						continue breadthFirstFoldHelp;
					} else {
						var xs = ch;
						var $temp$f = f,
							$temp$acc = a,
							$temp$parents = parents,
							$temp$trees = rest,
							$temp$nextSets = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								A2($elm$core$List$cons, d, parents),
								xs),
							nextSets);
						f = $temp$f;
						acc = $temp$acc;
						parents = $temp$parents;
						trees = $temp$trees;
						nextSets = $temp$nextSets;
						continue breadthFirstFoldHelp;
					}
				} else {
					var a = _v4.a;
					return a;
				}
			}
		}
	});
var $gampleman$elm_rosetree$Tree$breadthFirstFold = F3(
	function (f, acc, t) {
		return A5(
			$gampleman$elm_rosetree$Tree$breadthFirstFoldHelp,
			f,
			acc,
			_List_Nil,
			_List_fromArray(
				[t]),
			_List_Nil);
	});
var $gampleman$elm_rosetree$Tree$leaves = function (t) {
	return $elm$core$List$reverse(
		A3(
			$gampleman$elm_rosetree$Tree$breadthFirstFold,
			F4(
				function (s, _v0, l, c) {
					if (!c.b) {
						return $gampleman$elm_rosetree$Tree$Continue(
							A2($elm$core$List$cons, l, s));
					} else {
						return $gampleman$elm_rosetree$Tree$Continue(s);
					}
				}),
			_List_Nil,
			t));
};
var $gampleman$elm_visualization$Hierarchy$PaddingInner = function (a) {
	return {$: 'PaddingInner', a: a};
};
var $gampleman$elm_visualization$Hierarchy$paddingInner = $gampleman$elm_visualization$Hierarchy$PaddingInner;
var $gampleman$elm_visualization$Hierarchy$Batch = function (a) {
	return {$: 'Batch', a: a};
};
var $gampleman$elm_visualization$Hierarchy$PaddingBottom = function (a) {
	return {$: 'PaddingBottom', a: a};
};
var $gampleman$elm_visualization$Hierarchy$PaddingLeft = function (a) {
	return {$: 'PaddingLeft', a: a};
};
var $gampleman$elm_visualization$Hierarchy$PaddingRight = function (a) {
	return {$: 'PaddingRight', a: a};
};
var $gampleman$elm_visualization$Hierarchy$PaddingTop = function (a) {
	return {$: 'PaddingTop', a: a};
};
var $gampleman$elm_visualization$Hierarchy$paddingOuter = function (f) {
	return $gampleman$elm_visualization$Hierarchy$Batch(
		_List_fromArray(
			[
				$gampleman$elm_visualization$Hierarchy$PaddingLeft(f),
				$gampleman$elm_visualization$Hierarchy$PaddingRight(f),
				$gampleman$elm_visualization$Hierarchy$PaddingBottom(f),
				$gampleman$elm_visualization$Hierarchy$PaddingTop(f)
			]));
};
var $gampleman$elm_visualization$Hierarchy$paddingTop = $gampleman$elm_visualization$Hierarchy$PaddingTop;
var $gampleman$elm_rosetree$Tree$Tree = F2(
	function (a, b) {
		return {$: 'Tree', a: a, b: b};
	});
var $gampleman$elm_rosetree$Tree$singleton = function (v) {
	return A2($gampleman$elm_rosetree$Tree$Tree, v, _List_Nil);
};
var $gampleman$elm_visualization$Hierarchy$Size = F2(
	function (a, b) {
		return {$: 'Size', a: a, b: b};
	});
var $gampleman$elm_visualization$Hierarchy$size = $gampleman$elm_visualization$Hierarchy$Size;
var $gampleman$elm_rosetree$Tree$defaultTopDown = F4(
	function (s, _v0, l, c) {
		return _Utils_Tuple3(s, l, c);
	});
var $gampleman$elm_rosetree$Tree$depthFirstTraversalHelp = F5(
	function (fLabel, fTree, state, acc, stack) {
		depthFirstTraversalHelp:
		while (true) {
			var _v0 = acc.todo;
			if (!_v0.b) {
				var _v1 = A4(
					fTree,
					state,
					A2(
						$elm$core$List$map,
						function ($) {
							return $.label;
						},
						stack),
					acc.label,
					$elm$core$List$reverse(acc.done));
				var state_ = _v1.a;
				var node = _v1.b;
				if (!stack.b) {
					return _Utils_Tuple2(state_, node);
				} else {
					var top = stack.a;
					var rest = stack.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state_,
						$temp$acc = _Utils_update(
						top,
						{
							done: A2($elm$core$List$cons, node, top.done)
						}),
						$temp$stack = rest;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				}
			} else {
				var _v3 = _v0.a;
				var l = _v3.a;
				var chs = _v3.b;
				var rest = _v0.b;
				var ancestors = A2(
					$elm$core$List$cons,
					acc.label,
					A2(
						$elm$core$List$map,
						function ($) {
							return $.label;
						},
						stack));
				var _v4 = A4(fLabel, state, ancestors, l, chs);
				var state0 = _v4.a;
				var label_ = _v4.b;
				var children_ = _v4.c;
				if (!children_.b) {
					var _v6 = A4(fTree, state0, ancestors, label_, _List_Nil);
					var state_ = _v6.a;
					var newTree = _v6.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state_,
						$temp$acc = _Utils_update(
						acc,
						{
							done: A2($elm$core$List$cons, newTree, acc.done),
							todo: rest
						}),
						$temp$stack = stack;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				} else {
					var cs = children_;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state0,
						$temp$acc = {done: _List_Nil, label: label_, todo: cs},
						$temp$stack = A2(
						$elm$core$List$cons,
						_Utils_update(
							acc,
							{todo: rest}),
						stack);
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				}
			}
		}
	});
var $gampleman$elm_rosetree$Tree$depthFirstTraversal = F4(
	function (convertLabel, convertTree, s, _v0) {
		var l = _v0.a;
		var c = _v0.b;
		var _v1 = A4(convertLabel, s, _List_Nil, l, c);
		var state_ = _v1.a;
		var label_ = _v1.b;
		var children_ = _v1.c;
		return A5(
			$gampleman$elm_rosetree$Tree$depthFirstTraversalHelp,
			convertLabel,
			convertTree,
			state_,
			{done: _List_Nil, label: label_, todo: children_},
			_List_Nil);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $gampleman$elm_rosetree$Tree$tree = $gampleman$elm_rosetree$Tree$Tree;
var $gampleman$elm_rosetree$Tree$sortWith = F2(
	function (compareFn, t) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			$gampleman$elm_rosetree$Tree$defaultTopDown,
			F4(
				function (s, a, l, c) {
					return _Utils_Tuple2(
						s,
						A2(
							$gampleman$elm_rosetree$Tree$tree,
							l,
							A2(
								$elm$core$List$sortWith,
								compareFn(a),
								c)));
				}),
			_Utils_Tuple0,
			t).b;
	});
var $gampleman$elm_visualization$Hierarchy$Treemap$phi = (1 + $elm$core$Basics$sqrt(5)) / 2;
var $gampleman$elm_visualization$Hierarchy$Treemap$dice = F4(
	function (_v0, _v1, value, children) {
		var y1 = _v1.y1;
		var y0 = _v1.y0;
		var x1 = _v1.x1;
		var x0 = _v1.x0;
		var k = (!value) ? 0 : ((x1 - x0) / value);
		return $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				F2(
					function (node, _v2) {
						var prevX = _v2.a;
						var lst = _v2.b;
						var nextX = prevX + (node * k);
						return _Utils_Tuple2(
							nextX,
							A2(
								$elm$core$List$cons,
								{x0: prevX, x1: nextX, y0: y0, y1: y1},
								lst));
					}),
				_Utils_Tuple2(x0, _List_Nil),
				children).b);
	});
var $gampleman$elm_visualization$Hierarchy$Treemap$slice = F4(
	function (_v0, _v1, value, children) {
		var y1 = _v1.y1;
		var y0 = _v1.y0;
		var x1 = _v1.x1;
		var x0 = _v1.x0;
		var k = (!value) ? 0 : ((y1 - y0) / value);
		return $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				F2(
					function (node, _v2) {
						var prevY = _v2.a;
						var lst = _v2.b;
						var nextY = prevY + (node * k);
						return _Utils_Tuple2(
							nextY,
							A2(
								$elm$core$List$cons,
								{x0: x0, x1: x1, y0: prevY, y1: nextY},
								lst));
					}),
				_Utils_Tuple2(y0, _List_Nil),
				children).b);
	});
var $elmcraft$core_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elmcraft$core_extra$List$Extra$findIndex = $elmcraft$core_extra$List$Extra$findIndexHelp(0);
var $elmcraft$core_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, n, xs),
			A2($elm$core$List$drop, n, xs));
	});
var $elmcraft$core_extra$List$Extra$splitWhen = F2(
	function (predicate, list) {
		return A2(
			$elm$core$Maybe$map,
			function (i) {
				return A2($elmcraft$core_extra$List$Extra$splitAt, i, list);
			},
			A2($elmcraft$core_extra$List$Extra$findIndex, predicate, list));
	});
var $gampleman$elm_visualization$Hierarchy$Treemap$squarifyRatio = function (x) {
	var ratio = (x > 1) ? x : 1;
	return F4(
		function (depth, _v0, value_, children) {
			var y1 = _v0.y1;
			var y0 = _v0.y0;
			var x1 = _v0.x1;
			var x0 = _v0.x0;
			var keepAddingWhileRatioImproves = F7(
				function (sumValue_, minValue_, maxValue_, minRatio, alpha, soFar, nodes) {
					keepAddingWhileRatioImproves:
					while (true) {
						if (!nodes.b) {
							return _Utils_Tuple3(
								sumValue_,
								$elm$core$List$reverse(soFar),
								_List_Nil);
						} else {
							var nodeValue = nodes.a;
							var rest = nodes.b;
							var sumValue = sumValue_ + nodeValue;
							var minValue = (_Utils_cmp(nodeValue, minValue_) < 0) ? nodeValue : minValue_;
							var maxValue = (_Utils_cmp(nodeValue, maxValue_) > 0) ? nodeValue : maxValue_;
							var beta = (sumValue * sumValue) * alpha;
							var newRatio = A2($elm$core$Basics$max, maxValue / beta, beta / minValue);
							if (_Utils_cmp(newRatio, minRatio) > 0) {
								return _Utils_Tuple3(
									sumValue - nodeValue,
									$elm$core$List$reverse(soFar),
									nodes);
							} else {
								var $temp$sumValue_ = sumValue,
									$temp$minValue_ = minValue,
									$temp$maxValue_ = maxValue,
									$temp$minRatio = newRatio,
									$temp$alpha = alpha,
									$temp$soFar = A2($elm$core$List$cons, nodeValue, soFar),
									$temp$nodes = rest;
								sumValue_ = $temp$sumValue_;
								minValue_ = $temp$minValue_;
								maxValue_ = $temp$maxValue_;
								minRatio = $temp$minRatio;
								alpha = $temp$alpha;
								soFar = $temp$soFar;
								nodes = $temp$nodes;
								continue keepAddingWhileRatioImproves;
							}
						}
					}
				});
			var go = F5(
				function (value, x0_, y0_, nodes, soFar) {
					go:
					while (true) {
						var _v2 = A2(
							$elmcraft$core_extra$List$Extra$splitWhen,
							function (n) {
								return n > 0;
							},
							nodes);
						if ((_v2.$ === 'Just') && _v2.a.b.b) {
							var _v3 = _v2.a;
							var row = _v3.a;
							var _v4 = _v3.b;
							var nodeValue = _v4.a;
							var tail = _v4.b;
							var minValue = nodeValue;
							var maxValue = nodeValue;
							var dy = y1 - y0_;
							var dx = x1 - x0_;
							var alpha = A2($elm$core$Basics$max, dy / dx, dx / dy) / (value * ratio);
							var beta = A2($elm$core$Basics$pow, nodeValue, 2) * alpha;
							var minRatio = A2($elm$core$Basics$max, maxValue / beta, beta / minValue);
							var _v5 = A7(
								keepAddingWhileRatioImproves,
								nodeValue,
								minValue,
								maxValue,
								minRatio,
								alpha,
								_List_fromArray(
									[nodeValue]),
								tail);
							var sumValue = _v5.a;
							var toAdd = _v5.b;
							var rest = _v5.c;
							if (_Utils_cmp(dx, dy) < 0) {
								if (value > 0) {
									var $temp$value = value - sumValue,
										$temp$x0_ = x0_,
										$temp$y0_ = y0_ + ((dy * sumValue) / value),
										$temp$nodes = rest,
										$temp$soFar = A2(
										$elm$core$List$cons,
										A4(
											$gampleman$elm_visualization$Hierarchy$Treemap$dice,
											depth,
											{x0: x0_, x1: x1, y0: y0_, y1: y0_ + ((dy * sumValue) / value)},
											sumValue,
											_Utils_ap(row, toAdd)),
										soFar);
									value = $temp$value;
									x0_ = $temp$x0_;
									y0_ = $temp$y0_;
									nodes = $temp$nodes;
									soFar = $temp$soFar;
									continue go;
								} else {
									var $temp$value = value - sumValue,
										$temp$x0_ = x0_,
										$temp$y0_ = y0_,
										$temp$nodes = rest,
										$temp$soFar = A2(
										$elm$core$List$cons,
										A4(
											$gampleman$elm_visualization$Hierarchy$Treemap$dice,
											depth,
											{x0: x0_, x1: x1, y0: y0_, y1: y1},
											sumValue,
											_Utils_ap(row, toAdd)),
										soFar);
									value = $temp$value;
									x0_ = $temp$x0_;
									y0_ = $temp$y0_;
									nodes = $temp$nodes;
									soFar = $temp$soFar;
									continue go;
								}
							} else {
								if (value > 0) {
									var $temp$value = value - sumValue,
										$temp$x0_ = x0_ + ((dx * sumValue) / value),
										$temp$y0_ = y0_,
										$temp$nodes = rest,
										$temp$soFar = A2(
										$elm$core$List$cons,
										A4(
											$gampleman$elm_visualization$Hierarchy$Treemap$slice,
											depth,
											{x0: x0_, x1: x0_ + ((dx * sumValue) / value), y0: y0_, y1: y1},
											sumValue,
											_Utils_ap(row, toAdd)),
										soFar);
									value = $temp$value;
									x0_ = $temp$x0_;
									y0_ = $temp$y0_;
									nodes = $temp$nodes;
									soFar = $temp$soFar;
									continue go;
								} else {
									var $temp$value = value - sumValue,
										$temp$x0_ = x0_,
										$temp$y0_ = y0_,
										$temp$nodes = rest,
										$temp$soFar = A2(
										$elm$core$List$cons,
										A4(
											$gampleman$elm_visualization$Hierarchy$Treemap$slice,
											depth,
											{x0: x0_, x1: x1, y0: y0_, y1: y1},
											sumValue,
											_Utils_ap(row, toAdd)),
										soFar);
									value = $temp$value;
									x0_ = $temp$x0_;
									y0_ = $temp$y0_;
									nodes = $temp$nodes;
									soFar = $temp$soFar;
									continue go;
								}
							}
						} else {
							return $elm$core$List$concat(
								$elm$core$List$reverse(soFar));
						}
					}
				});
			return A5(go, value_, x0, y0, children, _List_Nil);
		});
};
var $gampleman$elm_visualization$Hierarchy$Treemap$squarify = $gampleman$elm_visualization$Hierarchy$Treemap$squarifyRatio($gampleman$elm_visualization$Hierarchy$Treemap$phi);
var $gampleman$elm_visualization$Hierarchy$squarify = $gampleman$elm_visualization$Hierarchy$Treemap$squarify;
var $author$project$Chart$Treemap$textOn = function (c) {
	var _v0 = $avh4$elm_color$Color$toRgba(c);
	var blue = _v0.blue;
	var green = _v0.green;
	var red = _v0.red;
	var lum = ((0.2126 * red) + (0.7152 * green)) + (0.0722 * blue);
	return (lum > 0.6) ? A3($avh4$elm_color$Color$rgb255, 30, 30, 30) : A3($avh4$elm_color$Color$rgb255, 250, 250, 250);
};
var $gampleman$elm_visualization$Hierarchy$Tile = function (a) {
	return {$: 'Tile', a: a};
};
var $gampleman$elm_visualization$Hierarchy$tile = $gampleman$elm_visualization$Hierarchy$Tile;
var $gampleman$elm_rosetree$Tree$defaultBottomUp = F4(
	function (s, _v0, l, c) {
		return _Utils_Tuple2(
			s,
			A2($gampleman$elm_rosetree$Tree$tree, l, c));
	});
var $gampleman$elm_rosetree$Tree$mapAccumulate = F3(
	function (f, state, t) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			F4(
				function (s, _v0, l, c) {
					var _v1 = A2(f, s, l);
					var s_ = _v1.a;
					var l_ = _v1.b;
					return _Utils_Tuple3(s_, l_, c);
				}),
			$gampleman$elm_rosetree$Tree$defaultBottomUp,
			state,
			t);
	});
var $gampleman$elm_rosetree$Tree$map = F2(
	function (f, t) {
		return A3(
			$gampleman$elm_rosetree$Tree$mapAccumulate,
			F2(
				function (_v0, e) {
					return _Utils_Tuple2(
						_Utils_Tuple0,
						f(e));
				}),
			_Utils_Tuple0,
			t).b;
	});
var $gampleman$elm_rosetree$Tree$updateLabel = F2(
	function (f, _v0) {
		var v = _v0.a;
		var cs = _v0.b;
		return A2(
			$gampleman$elm_rosetree$Tree$Tree,
			f(v),
			cs);
	});
var $gampleman$elm_visualization$Hierarchy$Treemap$layout = function (opts) {
	return A2(
		$elm$core$Basics$composeR,
		$gampleman$elm_rosetree$Tree$map(
			function (node) {
				return {
					bbox: {x0: 0, x1: opts.size.a, y0: 0, y1: opts.size.b},
					node: node,
					value: opts.value(node)
				};
			}),
		A2(
			$elm$core$Basics$composeR,
			A3(
				$gampleman$elm_rosetree$Tree$depthFirstTraversal,
				F4(
					function (p, a, l, c) {
						var node = l.node;
						var depth = $elm$core$List$length(a);
						var childPadding = opts.paddingInner(node) / 2;
						var bbox0 = {x0: l.bbox.x0 + p, x1: l.bbox.x1 - p, y0: l.bbox.y0 + p, y1: l.bbox.y1 - p};
						var bbox1 = (_Utils_cmp(bbox0.x1, bbox0.x0) < 0) ? _Utils_update(
							bbox0,
							{x0: (bbox0.x0 + bbox0.x1) / 2, x1: (bbox0.x0 + bbox0.x1) / 2}) : bbox0;
						var bbox2 = (_Utils_cmp(bbox0.y1, bbox0.y0) < 0) ? _Utils_update(
							bbox1,
							{y0: (bbox0.y0 + bbox0.y1) / 2, y1: (bbox0.y0 + bbox0.y1) / 2}) : bbox1;
						var childBBox0 = {
							x0: (bbox2.x0 + opts.paddingLeft(node)) - childPadding,
							x1: bbox2.x1 - (opts.paddingRight(node) - childPadding),
							y0: (bbox2.y0 + opts.paddingTop(node)) - childPadding,
							y1: bbox2.y1 - (opts.paddingBottom(node) - childPadding)
						};
						var childBBox1 = (_Utils_cmp(childBBox0.x1, childBBox0.x0) < 0) ? _Utils_update(
							childBBox0,
							{x0: (childBBox0.x0 + childBBox0.x1) / 2, x1: (childBBox0.x0 + childBBox0.x1) / 2}) : childBBox0;
						var childBBox2 = (_Utils_cmp(childBBox1.y1, childBBox1.y0) < 0) ? _Utils_update(
							childBBox1,
							{y0: (childBBox1.y0 + childBBox1.y1) / 2, y1: (childBBox1.y0 + childBBox1.y1) / 2}) : childBBox1;
						var children = A3(
							$elm$core$List$map2,
							function (bb) {
								return $gampleman$elm_rosetree$Tree$updateLabel(
									function (cn) {
										return _Utils_update(
											cn,
											{bbox: bb});
									});
							},
							A4(
								opts.tile,
								depth,
								childBBox2,
								l.value,
								A2(
									$elm$core$List$map,
									function (child) {
										return function ($) {
											return $.value;
										}(
											$gampleman$elm_rosetree$Tree$label(child));
									},
									c)),
							c);
						return _Utils_Tuple3(
							childPadding,
							{height: bbox2.y1 - bbox2.y0, node: l.node, value: l.value, width: bbox2.x1 - bbox2.x0, x: bbox2.x0, y: bbox2.y0},
							children);
					}),
				F4(
					function (s, _v0, l, c) {
						return _Utils_Tuple2(
							s,
							A2($gampleman$elm_rosetree$Tree$tree, l, c));
					}),
				0),
			$elm$core$Tuple$second));
};
var $gampleman$elm_visualization$Hierarchy$processAttributes = function (assigner) {
	return $elm$core$List$foldl(
		F2(
			function (a, d) {
				if (a.$ === 'Batch') {
					var l = a.a;
					return A3($gampleman$elm_visualization$Hierarchy$processAttributes, assigner, d, l);
				} else {
					return A2(assigner, a, d);
				}
			}));
};
var $gampleman$elm_visualization$Hierarchy$treemap = F2(
	function (attrs, value) {
		return $gampleman$elm_visualization$Hierarchy$Treemap$layout(
			A3(
				$gampleman$elm_visualization$Hierarchy$processAttributes,
				F2(
					function (attr, d) {
						switch (attr.$) {
							case 'Size':
								var w = attr.a;
								var h = attr.b;
								return _Utils_update(
									d,
									{
										size: _Utils_Tuple2(w, h)
									});
							case 'PaddingInner':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingInner: p});
							case 'PaddingLeft':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingLeft: p});
							case 'PaddingRight':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingRight: p});
							case 'PaddingTop':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingTop: p});
							case 'PaddingBottom':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingBottom: p});
							case 'Padding':
								var p = attr.a;
								return _Utils_update(
									d,
									{paddingBottom: p, paddingInner: p, paddingLeft: p, paddingRight: p, paddingTop: p});
							case 'Tile':
								var t = attr.a;
								return _Utils_update(
									d,
									{tile: t});
							default:
								return d;
						}
					}),
				{
					paddingBottom: $elm$core$Basics$always(0),
					paddingInner: $elm$core$Basics$always(0),
					paddingLeft: $elm$core$Basics$always(0),
					paddingRight: $elm$core$Basics$always(0),
					paddingTop: $elm$core$Basics$always(0),
					size: _Utils_Tuple2(1, 1),
					tile: $gampleman$elm_visualization$Hierarchy$squarify,
					value: value
				},
				attrs));
	});
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$Chart$Treemap$drillView = F3(
	function (cfg, band, subs) {
		var total = $elm$core$List$sum(
			A2($elm$core$List$map, $elm$core$Tuple$second, subs));
		var round1 = function (x) {
			return $elm$core$String$fromFloat(
				$elm$core$Basics$round(x * 10) / 10);
		};
		var subLeaf = function (item) {
			var node = item.node;
			var pct = (total <= 0) ? 0 : ((node.value / total) * 100);
			var labelFill = $elm_community$typed_svg$TypedSvg$Attributes$fill(
				$elm_community$typed_svg$TypedSvg$Types$Paint(
					$author$project$Chart$Treemap$textOn(node.color)));
			var labels = function () {
				if ((item.width > 54) && (item.height > 28)) {
					return _List_fromArray(
						[
							A2(
							$elm_community$typed_svg$TypedSvg$text_,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(17),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(12.5),
									labelFill
								]),
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(node.name)
								])),
							A2(
							$elm_community$typed_svg$TypedSvg$text_,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(32),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
									labelFill
								]),
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(
									round1(pct) + ' %')
								]))
						]);
				} else {
					if ((item.height > 40) && (item.width > 13)) {
						var cy = item.height / 2;
						var cx = item.width / 2;
						return _List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$text_,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(cx),
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(cy),
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
										$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
										labelFill,
										$elm_community$typed_svg$TypedSvg$Attributes$transform(
										_List_fromArray(
											[
												A3($elm_community$typed_svg$TypedSvg$Types$Rotate, -90, cx, cy)
											]))
									]),
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Core$text(node.name)
									]))
							]);
					} else {
						if ((item.width > 30) && (item.height > 14)) {
							return _List_fromArray(
								[
									A2(
									$elm_community$typed_svg$TypedSvg$text_,
									_List_fromArray(
										[
											$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
											$elm_community$typed_svg$TypedSvg$Attributes$InPx$y((item.height / 2) + 4),
											$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(10.5),
											labelFill
										]),
									_List_fromArray(
										[
											$elm_community$typed_svg$TypedSvg$Core$text(node.name)
										]))
								]);
						} else {
							return _List_Nil;
						}
					}
				}
			}();
			return A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$class(
						_List_fromArray(
							['leaf'])),
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, item.x, item.y)
							]))
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm_community$typed_svg$TypedSvg$rect,
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(item.width),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(item.height),
								$elm_community$typed_svg$TypedSvg$Attributes$fill(
								$elm_community$typed_svg$TypedSvg$Types$Paint(node.color)),
								$elm_community$typed_svg$TypedSvg$Attributes$class(
								_List_fromArray(
									['tile'])),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth(1.5),
								$elm_community$typed_svg$TypedSvg$Events$onClick(
								cfg.onDrill($elm$core$Maybe$Nothing))
							]),
						_List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$title,
								_List_Nil,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Core$text(
										node.name + (' — ' + (round1(pct) + ' %')))
									]))
							])),
					labels));
		};
		var leaves = A2(
			$elm$core$List$map,
			function (_v1) {
				var s = _v1.a;
				var v = _v1.b;
				return $gampleman$elm_rosetree$Tree$singleton(
					A3($author$project$Chart$Treemap$TNode, s.name, s.color, v));
			},
			subs);
		var root = A2(
			$gampleman$elm_rosetree$Tree$tree,
			A3(
				$author$project$Chart$Treemap$TNode,
				band,
				A3($avh4$elm_color$Color$rgb255, 90, 90, 90),
				total),
			leaves);
		var headerH = 30;
		var layouted = A3(
			$gampleman$elm_visualization$Hierarchy$treemap,
			_List_fromArray(
				[
					$gampleman$elm_visualization$Hierarchy$tile($gampleman$elm_visualization$Hierarchy$squarify),
					$gampleman$elm_visualization$Hierarchy$paddingInner(
					$elm$core$Basics$always(4)),
					$gampleman$elm_visualization$Hierarchy$paddingOuter(
					$elm$core$Basics$always(2)),
					$gampleman$elm_visualization$Hierarchy$paddingTop(
					function (n) {
						return _Utils_eq(n.name, band) ? headerH : 0;
					}),
					A2($gampleman$elm_visualization$Hierarchy$size, cfg.width, cfg.height)
				]),
			function ($) {
				return $.value;
			},
			A2(
				$gampleman$elm_rosetree$Tree$sortWith,
				F3(
					function (_v0, a, b) {
						return A2(
							$elm$core$Basics$compare,
							$gampleman$elm_rosetree$Tree$label(b).value,
							$gampleman$elm_rosetree$Tree$label(a).value);
					}),
				root));
		var backBar = _List_fromArray(
			[
				A2(
				$elm_community$typed_svg$TypedSvg$rect,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(0),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(0),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(cfg.width),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(headerH),
						$elm_community$typed_svg$TypedSvg$Attributes$fill(
						$elm_community$typed_svg$TypedSvg$Types$Paint(
							A3($avh4$elm_color$Color$rgb255, 51, 65, 85))),
						$elm_community$typed_svg$TypedSvg$Events$onClick(
						cfg.onDrill($elm$core$Maybe$Nothing))
					]),
				_List_Nil),
				A2(
				$elm_community$typed_svg$TypedSvg$text_,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(11),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(20),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(12.5),
						$elm_community$typed_svg$TypedSvg$Attributes$fill(
						$elm_community$typed_svg$TypedSvg$Types$Paint($avh4$elm_color$Color$white)),
						$elm_community$typed_svg$TypedSvg$Events$onClick(
						cfg.onDrill($elm$core$Maybe$Nothing))
					]),
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Core$text('← ' + (band + ' · zurück zur Übersicht'))
					]))
			]);
		return A2(
			$elm_community$typed_svg$TypedSvg$svg,
			_List_fromArray(
				[
					A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width, cfg.height),
					$elm_community$typed_svg$TypedSvg$Attributes$width(
					$elm_community$typed_svg$TypedSvg$Types$Percent(100))
				]),
			_Utils_ap(
				A2(
					$elm$core$List$map,
					subLeaf,
					$gampleman$elm_rosetree$Tree$leaves(layouted)),
				backBar));
	});
var $author$project$Energy$groupColor = function (g) {
	if (g.$ === 'Renewable') {
		return A3($avh4$elm_color$Color$rgb255, 35, 80, 45);
	} else {
		return A3($avh4$elm_color$Color$rgb255, 60, 60, 60);
	}
};
var $author$project$Energy$groupName = function (g) {
	if (g.$ === 'Renewable') {
		return 'Erneuerbar';
	} else {
		return 'Konventionell';
	}
};
var $author$project$Chart$Treemap$groupPct = F2(
	function (total, v) {
		return (total <= 0) ? 0 : ((v / total) * 100);
	});
var $author$project$Chart$Treemap$view = function (cfg) {
	var round1 = function (x) {
		return $elm$core$String$fromFloat(
			$elm$core$Basics$round(x * 10) / 10);
	};
	var leavesOf = function (grp) {
		return A2(
			$elm$core$List$map,
			function (_v4) {
				var b = _v4.a;
				var v = _v4.b;
				return $gampleman$elm_rosetree$Tree$singleton(
					A3($author$project$Chart$Treemap$TNode, b.name, b.color, v));
			},
			A2(
				$elm$core$List$filter,
				function (_v3) {
					var b = _v3.a;
					return _Utils_eq(b.group, grp);
				},
				cfg.sums));
	};
	var groupNode = function (grp) {
		var _v2 = leavesOf(grp);
		if (!_v2.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var kids = _v2;
			return $elm$core$Maybe$Just(
				A2(
					$gampleman$elm_rosetree$Tree$tree,
					A3(
						$author$project$Chart$Treemap$TNode,
						$author$project$Energy$groupName(grp),
						$author$project$Energy$groupColor(grp),
						$elm$core$List$sum(
							A2(
								$elm$core$List$map,
								function (t) {
									return $gampleman$elm_rosetree$Tree$label(t).value;
								},
								kids))),
					kids));
		}
	};
	var children = A2(
		$elm$core$List$filterMap,
		groupNode,
		_List_fromArray(
			[$author$project$Energy$Renewable, $author$project$Energy$Conventional]));
	var total = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (t) {
				return $gampleman$elm_rosetree$Tree$label(t).value;
			},
			children));
	var groupHeader = function (item) {
		var node = item.node;
		return _List_fromArray(
			[
				A2(
				$elm_community$typed_svg$TypedSvg$rect,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(item.x),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(item.y),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(item.width),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(22),
						$elm_community$typed_svg$TypedSvg$Attributes$fill(
						$elm_community$typed_svg$TypedSvg$Types$Paint(node.color))
					]),
				_List_Nil),
				A2(
				$elm_community$typed_svg$TypedSvg$text_,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(item.x + 9),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(item.y + 15),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(12),
						$elm_community$typed_svg$TypedSvg$Attributes$fill(
						$elm_community$typed_svg$TypedSvg$Types$Paint($avh4$elm_color$Color$white))
					]),
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Core$text(
						node.name + ('  ·  ' + (round1(
							A2($author$project$Chart$Treemap$groupPct, total, node.value)) + ' %')))
					]))
			]);
	};
	var leafSvg = function (item) {
		var node = item.node;
		var pct = (total <= 0) ? 0 : ((node.value / total) * 100);
		var tip = node.name + (' — ' + (round1(pct) + ' %'));
		var labelFill = $elm_community$typed_svg$TypedSvg$Attributes$fill(
			$elm_community$typed_svg$TypedSvg$Types$Paint(
				$author$project$Chart$Treemap$textOn(node.color)));
		var labelNodes = function () {
			if ((item.width > 54) && (item.height > 28)) {
				return _List_fromArray(
					[
						A2(
						$elm_community$typed_svg$TypedSvg$text_,
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(17),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(12.5),
								labelFill
							]),
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Core$text(node.name)
							])),
						A2(
						$elm_community$typed_svg$TypedSvg$text_,
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(32),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
								labelFill
							]),
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Core$text(
								round1(pct) + ' %')
							]))
					]);
			} else {
				if ((item.height > 40) && (item.width > 13)) {
					var cy = item.height / 2;
					var cx = item.width / 2;
					return _List_fromArray(
						[
							A2(
							$elm_community$typed_svg$TypedSvg$text_,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(cx),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(cy),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(11),
									$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
									labelFill,
									$elm_community$typed_svg$TypedSvg$Attributes$transform(
									_List_fromArray(
										[
											A3($elm_community$typed_svg$TypedSvg$Types$Rotate, -90, cx, cy)
										]))
								]),
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(node.name)
								]))
						]);
				} else {
					if ((item.width > 30) && (item.height > 14)) {
						return _List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$text_,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(7),
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$y((item.height / 2) + 4),
										$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(10.5),
										labelFill
									]),
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Core$text(node.name)
									]))
							]);
					} else {
						return _List_Nil;
					}
				}
			}
		}();
		var dimmed = (!$elm$core$List$isEmpty(cfg.active)) && (!A2($elm$core$List$member, node.name, cfg.active));
		return A2(
			$elm_community$typed_svg$TypedSvg$g,
			_List_fromArray(
				[
					$elm_community$typed_svg$TypedSvg$Attributes$class(
					_List_fromArray(
						['leaf'])),
					$elm_community$typed_svg$TypedSvg$Attributes$transform(
					_List_fromArray(
						[
							A2($elm_community$typed_svg$TypedSvg$Types$Translate, item.x, item.y)
						]))
				]),
			A2(
				$elm$core$List$cons,
				A2(
					$elm_community$typed_svg$TypedSvg$rect,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(item.width),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(item.height),
							$elm_community$typed_svg$TypedSvg$Attributes$fill(
							$elm_community$typed_svg$TypedSvg$Types$Paint(node.color)),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							dimmed ? _List_fromArray(
								['tile', 'is-dim']) : _List_fromArray(
								['tile'])),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$strokeWidth(1.5),
							$elm_community$typed_svg$TypedSvg$Events$onMouseOver(
							cfg.onHover(
								$elm$core$Maybe$Just(node.name))),
							$elm_community$typed_svg$TypedSvg$Events$onMouseOut(
							cfg.onHover($elm$core$Maybe$Nothing)),
							$elm_community$typed_svg$TypedSvg$Events$onClick(
							$elm$core$List$isEmpty(
								$author$project$Energy$bandSubs(node.name)) ? cfg.onPin(node.name) : cfg.onDrill(
								$elm$core$Maybe$Just(node.name)))
						]),
					_List_fromArray(
						[
							A2(
							$elm_community$typed_svg$TypedSvg$title,
							_List_Nil,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(
									A2($author$project$Chart$Treemap$drillTip, node.name, tip))
								]))
						])),
				labelNodes));
	};
	var root = A2(
		$gampleman$elm_rosetree$Tree$tree,
		A3(
			$author$project$Chart$Treemap$TNode,
			'Erzeugung',
			A3($avh4$elm_color$Color$rgb255, 120, 120, 120),
			total),
		children);
	var layouted = A3(
		$gampleman$elm_visualization$Hierarchy$treemap,
		_List_fromArray(
			[
				$gampleman$elm_visualization$Hierarchy$tile($gampleman$elm_visualization$Hierarchy$squarify),
				$gampleman$elm_visualization$Hierarchy$paddingInner(
				$elm$core$Basics$always(4)),
				$gampleman$elm_visualization$Hierarchy$paddingOuter(
				$elm$core$Basics$always(2)),
				$gampleman$elm_visualization$Hierarchy$paddingTop(
				function (n) {
					return (n.name === 'Erzeugung') ? 4 : 27;
				}),
				A2($gampleman$elm_visualization$Hierarchy$size, cfg.width, cfg.height)
			]),
		function ($) {
			return $.value;
		},
		A2(
			$gampleman$elm_rosetree$Tree$sortWith,
			F3(
				function (_v1, a, b) {
					return A2(
						$elm$core$Basics$compare,
						$gampleman$elm_rosetree$Tree$label(b).value,
						$gampleman$elm_rosetree$Tree$label(a).value);
				}),
			root));
	var groupHeaders = A2(
		$elm$core$List$concatMap,
		groupHeader,
		A2(
			$elm$core$List$map,
			$gampleman$elm_rosetree$Tree$label,
			$gampleman$elm_rosetree$Tree$children(layouted)));
	var _v0 = _Utils_Tuple2(cfg.focus, cfg.subSums);
	if ((_v0.a.$ === 'Just') && _v0.b.b) {
		var band = _v0.a.a;
		var subs = _v0.b;
		return A3($author$project$Chart$Treemap$drillView, cfg, band, subs);
	} else {
		return $elm$core$List$isEmpty(cfg.sums) ? A2(
			$elm_community$typed_svg$TypedSvg$svg,
			_List_fromArray(
				[
					A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width, cfg.height),
					$elm_community$typed_svg$TypedSvg$Attributes$width(
					$elm_community$typed_svg$TypedSvg$Types$Percent(100))
				]),
			_List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(8),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(20),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(12)
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text('keine Daten')
						]))
				])) : A2(
			$elm_community$typed_svg$TypedSvg$svg,
			_List_fromArray(
				[
					A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width, cfg.height),
					$elm_community$typed_svg$TypedSvg$Attributes$width(
					$elm_community$typed_svg$TypedSvg$Types$Percent(100))
				]),
			_Utils_ap(
				groupHeaders,
				A2(
					$elm$core$List$map,
					leafSvg,
					$gampleman$elm_rosetree$Tree$leaves(layouted))));
	}
};
var $author$project$Main$chartsView = F7(
	function (hovered, pinned, metric, focusedDay, windowDays, treemapFocus, rows) {
		var hl = A2($author$project$Main$activeOf, pinned, hovered);
		var focusNote = function () {
			if (focusedDay.$ === 'Just') {
				var d = focusedDay.a;
				return $elm$core$Maybe$Just(
					' · Fokus auf ' + ($author$project$Energy$dayLabel(d) + ' (erneut klicken zum Aufheben)'));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		var allSorted = A2(
			$elm$core$List$sortBy,
			function ($) {
				return $.unixSeconds;
			},
			A2(
				$elm$core$List$filter,
				function (r) {
					return ($author$project$Energy$totalGeneration(r) > 0) || (r.load > 0);
				},
				rows));
		var tmaxLoaded = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(
				A2(
					$elm$core$List$map,
					function ($) {
						return $.unixSeconds;
					},
					allSorted)));
		var sortedRows = A2(
			$elm$core$List$filter,
			function (r) {
				return _Utils_cmp(r.unixSeconds, tmaxLoaded - (windowDays * 86400)) > -1;
			},
			allSorted);
		var slots = $author$project$Energy$slotsPerDay(sortedRows);
		var heatCells = A3($author$project$Energy$heatCells, metric, slots, sortedRows);
		var treemapRows = function () {
			if (focusedDay.$ === 'Just') {
				var d = focusedDay.a;
				return A2(
					$elm$core$List$filter,
					function (r) {
						return _Utils_eq(
							$author$project$Energy$dayOf(r.unixSeconds),
							d);
					},
					sortedRows);
			} else {
				return sortedRows;
			}
		}();
		var treemapSubSums = function () {
			if (treemapFocus.$ === 'Just') {
				var band = treemapFocus.a;
				return A2(
					$author$project$Energy$sumBySub,
					treemapRows,
					$author$project$Energy$bandSubs(band));
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('chart-stack')
				]),
			_List_fromArray(
				[
					A5(
					$author$project$Main$chartCard,
					'1',
					'Erzeugungsmix & Saldo im Zeitverlauf',
					_List_fromArray(
						[
							$elm$html$Html$text('Gestapelte Erzeugung nach Quelle; gestrichelt = Last. Rote Fläche = Defizit (durch Import/Speicher zu decken), grüne Fläche = Überschuss (Export/Einspeicherung).')
						]),
					focusNote,
					$author$project$Chart$StackedArea$view(
						{
							active: hl,
							focusedDay: focusedDay,
							height: 450,
							onHover: $author$project$Main$HoverSource,
							onPin: $author$project$Main$PinSource,
							rows: A2($author$project$Energy$decimateTo, 1200, sortedRows),
							width: 1120
						})),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('chart-grid')
						]),
					_List_fromArray(
						[
							A5(
							$author$project$Main$chartCard,
							'2',
							$author$project$Energy$metricLabel(metric) + ' nach Uhrzeit & Tag',
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Jede Zelle ist ein einzelner Messwert in Originalauflösung (' + ($author$project$Main$slotDuration(slots) + (', x = Tag, y = Uhrzeit) – ' + ($elm$core$String$fromInt(
										$elm$core$List$length(heatCells)) + ' Pixel, ohne zeitliche Zusammenfassung. Klick auf einen Tag fokussiert die anderen beiden Sichten.'))))
								]),
							$elm$core$Maybe$Nothing,
							$author$project$Chart$Heatmap$view(
								{
									cells: heatCells,
									extent: $author$project$Energy$heatExtent(heatCells),
									focusedDay: focusedDay,
									height: 480,
									interpolator: $author$project$Energy$metricInterpolator(metric),
									onClickDay: $author$project$Main$ClickDay,
									slotsPerDay: slots,
									unit: $author$project$Energy$metricUnit(metric),
									width: 660
								})),
							A5(
							$author$project$Main$chartCard,
							'3',
							'Erzeugungsstruktur',
							_List_fromArray(
								[
									$elm$html$Html$text('Fläche '),
									$author$project$Main$propSign,
									$elm$html$Html$text(' Energieanteil; Ebenen Erneuerbar/Konventionell → Quelle. Klick auf ein Band (z. B. Wind, Kohle) schlüsselt es in seine Rohquellen auf.')
								]),
							$elm$core$Maybe$Nothing,
							$author$project$Chart$Treemap$view(
								{
									active: hl,
									focus: treemapFocus,
									height: 480,
									onDrill: $author$project$Main$DrillBand,
									onHover: $author$project$Main$HoverSource,
									onPin: $author$project$Main$PinSource,
									subSums: treemapSubSums,
									sums: $author$project$Energy$sumByBand(treemapRows),
									width: 660
								}))
						]))
				]));
	});
var $author$project$Main$countryLabel = function (code) {
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$String$toUpper(code),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var c = _v0.a;
						return _Utils_eq(c, code);
					},
					$author$project$Main$countries))));
};
var $author$project$Main$emptyHint = function (model) {
	var _v0 = model.status;
	if (_v0.$ === 'Ready') {
		return 'Keine Daten für ' + ($author$project$Main$countryLabel(model.country) + ' im gewählten Zeitfenster – in dieser Entwicklungs-DB enthält das Land evtl. nur Platzhalter. Bitte ein anderes Land wählen.');
	} else {
		return 'Noch keine Daten geladen – bitte oben rechts auf „Verbinden“ klicken.';
	}
};
var $author$project$Main$emptyView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('empty')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('empty-emoji')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('📭')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Main$emptyHint(model))
					]))
			]));
};
var $elm$virtual_dom$VirtualDom$lazy7 = _VirtualDom_lazy7;
var $elm$html$Html$Lazy$lazy7 = $elm$virtual_dom$VirtualDom$lazy7;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $author$project$Main$onMouseMove = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'mousemove',
		A3(
			$elm$json$Json$Decode$map2,
			tagger,
			A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float)));
};
var $author$project$Energy$bandColorByName = function (name) {
	return A2(
		$elm$core$Maybe$withDefault,
		A3($avh4$elm_color$Color$rgb255, 148, 163, 184),
		A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.color;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (b) {
						return _Utils_eq(b.name, name);
					},
					$author$project$Energy$bands))));
};
var $author$project$Energy$bandInfo = function (name) {
	switch (name) {
		case 'Solar':
			return 'Photovoltaik – erzeugt nur tagsüber, Maximum um die Mittagszeit.';
		case 'Wind':
			return 'Wind an Land und auf See – wetterabhängig, oft nachts und im Winter stärker.';
		case 'Wasserkraft':
			return 'Lauf-, Speicher- und Pumpspeicherkraft – gut regel- und speicherbar.';
		case 'Biomasse':
			return 'Biomasse und Geothermie – planbare, grundlastfähige Erneuerbare.';
		case 'Kernkraft':
			return 'Kernenergie – konstante Grundlast, kaum tageszeitliche Schwankung.';
		case 'Kohle':
			return 'Braun- und Steinkohle – konventionell und CO₂-intensiv.';
		case 'Gas/Öl':
			return 'Gas- und Ölkraftwerke – flexibel, decken Spitzen und Residuallast.';
		case 'Sonstige':
			return 'Abfall und weitere, nicht separat ausgewiesene Quellen.';
		default:
			return '';
	}
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$tooltipView = function (model) {
	var _v0 = model.hovered;
	if (_v0.$ === 'Just') {
		var name = _v0.a;
		var _v1 = model.mouse;
		var x = _v1.a;
		var y = _v1.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('tooltip'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(x) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromFloat(y) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tt-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tt-dot'),
									A2(
									$elm$html$Html$Attributes$style,
									'background',
									$avh4$elm_color$Color$toCssString(
										$author$project$Energy$bandColorByName(name)))
								]),
							_List_Nil),
							$elm$html$Html$text(name)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tt-body')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Energy$bandInfo(name))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tt-hint')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$List$member, name, model.pinned) ? 'Klick: Fixierung lösen' : 'Klick: fixieren')
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Main$ToggleNavPin = {$: 'ToggleNavPin'};
var $author$project$Main$HoverCountry = function (a) {
	return {$: 'HoverCountry', a: a};
};
var $author$project$Main$HoverMetric = function (a) {
	return {$: 'HoverMetric', a: a};
};
var $author$project$Energy$LoadMetric = {$: 'LoadMetric'};
var $author$project$Energy$RenewableShare = {$: 'RenewableShare'};
var $author$project$Main$SelectCountry = function (a) {
	return {$: 'SelectCountry', a: a};
};
var $author$project$Main$SelectMetric = function (a) {
	return {$: 'SelectMetric', a: a};
};
var $author$project$Main$control = F3(
	function (iconClass, labelText, child) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('control')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control-label')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ico ico-sm ' + iconClass)
								]),
							_List_Nil),
							$elm$html$Html$text(labelText)
						])),
					child
				]));
	});
var $author$project$Main$countBadge = function (model) {
	var count = $elm$core$List$length(
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Dict$get,
				$author$project$Main$activeCountry(model),
				model.rowsByCountry)));
	var _v0 = model.status;
	switch (_v0.$) {
		case 'Ready':
			return (count > 0) ? A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('count-badge'),
						$elm$html$Html$Attributes$title(
						$elm$core$String$fromInt(count) + (' Messpunkte · ' + ($elm$core$String$fromInt(model.windowDays) + ' Tage geladen')))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('count-dot')
							]),
						_List_Nil),
						$elm$html$Html$text(
						$elm$core$String$fromInt(count) + ' Pkt')
					])) : $elm$html$Html$text('');
		case 'Failed':
			var e = _v0.a;
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('count-badge is-error'),
						$elm$html$Html$Attributes$title(e)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Fehler')
					]));
		default:
			return $elm$html$Html$text('');
	}
};
var $author$project$Main$countryFlag = function (code) {
	switch (code) {
		case 'all':
			return '🇪🇺';
		case 'fr':
			return '🇫🇷';
		case 'it':
			return '🇮🇹';
		case 'pl':
			return '🇵🇱';
		case 'cz':
			return '🇨🇿';
		case 'ch':
			return '🇨🇭';
		case 'be':
			return '🇧🇪';
		case 'se':
			return '🇸🇪';
		case 'no':
			return '🇳🇴';
		case 'dk':
			return '🇩🇰';
		case 'de':
			return '🇩🇪';
		default:
			return '🏳️';
	}
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$dropdown = F3(
	function (extra, current, items) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('dropdown'),
				extra),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-trigger'),
							$elm$html$Html$Attributes$tabindex(0)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-value')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(current)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ico ico-sm ico-caret')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-menu')
						]),
					items)
				]));
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$dropdownItem = F4(
	function (active, extra, clickMsg, label) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('dropdown-item', true),
							_Utils_Tuple2('is-active', active)
						])),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Events$onClick(clickMsg),
					extra)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('di-check')
						]),
					_List_Nil),
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$SelectWindow = function (a) {
	return {$: 'SelectWindow', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Main$windowButton = F2(
	function (current, d) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('seg-btn', true),
							_Utils_Tuple2(
							'is-active',
							_Utils_eq(current, d))
						])),
					$elm$html$Html$Events$onClick(
					$author$project$Main$SelectWindow(d))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(d) + ' T')
				]));
	});
var $author$project$Main$windowOptions = _List_fromArray(
	[7, 14, 30, 90]);
var $author$project$Main$controlCluster = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('control-cluster')
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Main$control,
				'ico-globe',
				'Land',
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('land-wrap')
						]),
					_List_fromArray(
						[
							A3(
							$author$project$Main$dropdown,
							_List_fromArray(
								[
									$elm$html$Html$Events$onMouseLeave(
									$author$project$Main$HoverCountry($elm$core$Maybe$Nothing))
								]),
							$author$project$Main$countryFlag(model.country) + ('  ' + $author$project$Main$countryLabel(model.country)),
							A2(
								$elm$core$List$map,
								function (_v0) {
									var code = _v0.a;
									var name = _v0.b;
									return A4(
										$author$project$Main$dropdownItem,
										_Utils_eq(code, model.country),
										_List_fromArray(
											[
												$elm$html$Html$Events$onMouseOver(
												$author$project$Main$HoverCountry(
													$elm$core$Maybe$Just(code)))
											]),
										$author$project$Main$SelectCountry(code),
										$author$project$Main$countryFlag(code) + ('  ' + name));
								},
								$author$project$Main$countries)),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('count-slot')
								]),
							_List_fromArray(
								[
									$author$project$Main$countBadge(model)
								]))
						]))),
				A3(
				$author$project$Main$control,
				'ico-calendar',
				'Zeitfenster',
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('segmented')
						]),
					A2(
						$elm$core$List$map,
						$author$project$Main$windowButton(model.windowDays),
						$author$project$Main$windowOptions))),
				A3(
				$author$project$Main$control,
				'ico-gauge',
				'Metrik',
				A3(
					$author$project$Main$dropdown,
					_List_fromArray(
						[
							$elm$html$Html$Events$onMouseLeave(
							$author$project$Main$HoverMetric($elm$core$Maybe$Nothing))
						]),
					$author$project$Energy$metricLabel(model.metric),
					A2(
						$elm$core$List$map,
						function (m) {
							return A4(
								$author$project$Main$dropdownItem,
								_Utils_eq(m, model.metric),
								_List_fromArray(
									[
										$elm$html$Html$Events$onMouseOver(
										$author$project$Main$HoverMetric(
											$elm$core$Maybe$Just(m)))
									]),
								$author$project$Main$SelectMetric(m),
								$author$project$Energy$metricLabel(m));
						},
						_List_fromArray(
							[$author$project$Energy$SolarShare, $author$project$Energy$RenewableShare, $author$project$Energy$LoadMetric]))))
			]));
};
var $author$project$Main$iconToggle = F4(
	function (active, msg, iconClass, tip) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('icon-btn', true),
							_Utils_Tuple2('is-on', active)
						])),
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$title(tip)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ico ' + iconClass)
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$Events$onMouseOut = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseout',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$legendChip = F3(
	function (hl, pinned, band) {
		var isPinned = A2($elm$core$List$member, band.name, pinned);
		var dim = (!$elm$core$List$isEmpty(hl)) && (!A2($elm$core$List$member, band.name, hl));
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('chip', true),
							_Utils_Tuple2('is-dim', dim),
							_Utils_Tuple2('is-pinned', isPinned)
						])),
					$elm$html$Html$Events$onMouseOver(
					$author$project$Main$HoverSource(
						$elm$core$Maybe$Just(band.name))),
					$elm$html$Html$Events$onMouseOut(
					$author$project$Main$HoverSource($elm$core$Maybe$Nothing)),
					$elm$html$Html$Events$onClick(
					$author$project$Main$PinSource(band.name))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('swatch'),
							A2(
							$elm$html$Html$Attributes$style,
							'background',
							$avh4$elm_color$Color$toCssString(band.color))
						]),
					_List_Nil),
					$elm$html$Html$text(band.name)
				]));
	});
var $author$project$Main$legend = function (model) {
	var hl = A2($author$project$Main$activeOf, model.pinned, model.hovered);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('legend'),
				$elm$html$Html$Attributes$tabindex(0)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('legend-kicker')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Quellen')
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ico ico-sm ico-caret legend-caret')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('legend-chips')
					]),
				A2(
					$elm$core$List$map,
					A2($author$project$Main$legendChip, hl, model.pinned),
					$author$project$Energy$bands))
			]));
};
var $author$project$Main$navClass = function (model) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$core$Maybe$Just('topnav'),
					(model.navHidden && (!model.navPinned)) ? $elm$core$Maybe$Just('is-hidden') : $elm$core$Maybe$Nothing,
					model.navPinned ? $elm$core$Maybe$Just('is-pinned') : $elm$core$Maybe$Nothing
				])));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Main$Connect = {$: 'Connect'};
var $author$project$Main$Reload = {$: 'Reload'};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Main$oneDecimal = function (x) {
	return $elm$core$String$fromFloat(
		$elm$core$Basics$round(x * 10) / 10);
};
var $author$project$Main$primaryButton = function (model) {
	var fillPct = function () {
		var _v2 = model.status;
		switch (_v2.$) {
			case 'Connecting':
				return '30%';
			case 'LoadingBounds':
				return '62%';
			case 'LoadingRows':
				return '88%';
			default:
				return '100%';
		}
	}();
	var busy = $author$project$Main$isBusy(model.status);
	var action = _Utils_eq(model.latest, $elm$core$Maybe$Nothing) ? $author$project$Main$Connect : $author$project$Main$Reload;
	var _v0 = function () {
		var _v1 = model.status;
		switch (_v1.$) {
			case 'Connecting':
				return _Utils_Tuple2('Token', 'ico-refresh');
			case 'LoadingBounds':
				return _Utils_Tuple2('Struktur', 'ico-refresh');
			case 'LoadingRows':
				return _Utils_Tuple2('Lädt', 'ico-refresh');
			case 'Ready':
				return _Utils_Tuple2('Aktualisieren', 'ico-refresh');
			default:
				return _Utils_Tuple2('Verbinden', 'ico-link');
		}
	}();
	var label = _v0.a;
	var iconClass = _v0.b;
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-primary', true),
						_Utils_Tuple2('is-busy', busy)
					])),
				$elm$html$Html$Events$onClick(action),
				$elm$html$Html$Attributes$disabled(busy),
				A2($elm$html$Html$Attributes$style, '--fill', fillPct)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('btn-fill')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('btn-face')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								'ico ' + (iconClass + (busy ? ' spin' : '')))
							]),
						_List_Nil),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							])),
						busy ? A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn-time')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$oneDecimal(model.elapsed) + 's')
							])) : $elm$html$Html$text('')
					]))
			]));
};
var $author$project$Main$topNav = function (model) {
	return A3(
		$elm$html$Html$node,
		'nav',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$Main$navClass(model))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('topnav-inner')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('brand-col')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-name')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('EnergyCharts')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-main')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-line')
									]),
								_List_fromArray(
									[
										$author$project$Main$controlCluster(model),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nav-actions')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('action-group')
													]),
												_List_fromArray(
													[
														A4($author$project$Main$iconToggle, model.navPinned, $author$project$Main$ToggleNavPin, 'ico-pin', 'Leiste dauerhaft einblenden')
													])),
												$author$project$Main$primaryButton(model)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-sub')
									]),
								_List_fromArray(
									[
										$author$project$Main$legend(model)
									]))
							]))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	var rows = $author$project$Main$activeRows(model);
	var visibleRows = A2(
		$elm$core$List$filter,
		function (r) {
			return ($author$project$Energy$totalGeneration(r) > 0) || (r.load > 0);
		},
		rows);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('app'),
				$author$project$Main$onMouseMove($author$project$Main$MouseMove)
			]),
		_List_fromArray(
			[
				$author$project$Main$topNav(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page')
					]),
				_List_fromArray(
					[
						$elm$core$List$isEmpty(visibleRows) ? $author$project$Main$emptyView(model) : A8(
						$elm$html$Html$Lazy$lazy7,
						$author$project$Main$chartsView,
						model.hovered,
						model.pinned,
						A2($elm$core$Maybe$withDefault, model.metric, model.previewMetric),
						model.focusedDay,
						model.windowDays,
						model.treemapFocus,
						rows)
					])),
				$author$project$Main$tooltipView(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$float)(0)}});}(this));