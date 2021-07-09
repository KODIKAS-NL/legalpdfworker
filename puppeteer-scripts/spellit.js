(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.spellit = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	ones: ['nul', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten', 'tyve'],
	tens: ['', 'ti', 'toti', 'treti', 'firti', 'femti', 'seksti', 'syvti', 'otteti', 'niti'],
	groupNamesSingular: ['et', 'et hundrede', 'et tusind', 'en million', 'en milliard'],
	groupNamesPlural: ['', 'hundrede', 'tusind', 'millioner', 'milliarder'],
	groupSeparator: ' og ',
	space: ' '
};
},{}],2:[function(require,module,exports){
module.exports = {
	ones: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine','ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
	tens: ['', 'ten', 'twenty-', 'thirty-', 'forty-', 'fifty-', 'sixty-', 'seventy-', 'eighty-', 'ninety-'],
	groupNamesSingular: ['one', 'one hundred', 'one thousand', 'one million', 'one billion'],
	groupNamesPlural: ['', 'hundred', 'thousand', 'million', 'billion'],
	groupSeparator: ' ',
	space: ' ',
	postTransform: function(str){
		// fix hyphens
		str = str.replace(/- /g,'-');
		str = str.replace(/-$/,'');
		return str;
	}
};

},{}],3:[function(require,module,exports){
// http://en.wiktionary.org/wiki/Appendix:French_numbers

var ones = ['zéro', 'et-un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'once', 'douce', 'treize', 'quatorze', 'quinze', 'seize'];

ones[71] = "soixante-et-onze";
ones[72] = "soixante-douze";
ones[73] = "soixante-treize";
ones[74] = "soixante-quatorze";
ones[75] = "soixante-quinze";
ones[76] = "soixante-seize";

ones[80] = 'quatre-vingts';
ones[81] = 'quatre-vingt-un';

ones[91] = 'quatre-vingt-onze';
ones[92] = 'quatre-vingt-douze';
ones[93] = 'quatre-vingt-treize';
ones[94] = 'quatre-vingt-quatorze';
ones[95] = 'quatre-vingt-quinze';
ones[96] = 'quatre-vingt-seize';

module.exports = {
	ones: ones,
	tens: ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'],
	groupNamesSingular: ['un', 'cent', 'mille', 'un-million', 'un-milliard'],
	groupNamesPlural: ['', 'cent', 'mille', 'millions', 'milliards'],
	groupSeparator: '-',
	space: '-',
	postTransform: function(str){
		// when cent is at the end of the number, it takes an s, but when it's followed by another number, the s is dropped.
		str = str.replace(/-cent$/,'-cents');
		// fix 1
		str = str.replace(/^et-un$/,'un');
		return str;
	}
};
},{}],4:[function(require,module,exports){
module.exports = {
	ones: ['kosong', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan','sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'],
	tens: ['', 'sepuluh','dua puluh','tiga puluh','empat puluh','lima puluh','enam puluh','tujuh puluh','delapan puluh','sembilan puluh'],
	groupNamesSingular: ['satu', 'seratus', 'seribu', 'satu juta', 'satu milyar'],
	groupNamesPlural: ['', 'ratus', 'ribu', 'juta', 'milyar'],
	groupSeparator: ' ',
	space: ' ',
	postTransform: function(str){
		str = str.replace(/seribu\ milyar/g,'satu triliun');
		str = str.replace(/ribu\ milyar/g,'triliun');
		return str;
	}
};

},{}],5:[function(require,module,exports){
module.exports = {
	ones: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine','ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
	tens: ['', 'ten', 'twenty-', 'thirty-', 'forty-', 'fifty-', 'sixty-', 'seventy-', 'eighty-', 'ninety-'],
	groupNamesSingular: ['one', 'one hundred', 'one thousand', 'one lakh', 'one crore'],
	groupNamesPlural: ['', 'hundred', 'thousand', 'lakh', 'crore'],
	groupPowers: [0, 2, 3, 5, 7],
	groupSeparator: ' ',
	space: ' ',
	lang: 'in',
	postTransform: function(str){
		// fix hyphens
		str = str.replace(/- /g,'-');
		str = str.replace(/-$/,'');
		return str;
	}
};

},{}],6:[function(require,module,exports){
var langs = {
	en: require('./en'),
	id: require('./id'),
	da: require('./da'),
	fr: require('./fr'), 
	in: require('./in'),
	nl: require('./nl')
};


function isNumber(obj) {
	return obj != null && !isNaN(obj) && toString.call(obj) == '[object Number]';
}

function trim(input, space) {
	if (space === '') {
		return input;
	}

	var trimmer = new RegExp('^' + space + '+|' + space + '+$', 'g');
	return input.replace(trimmer, '');
}

function group(amount) {
	var str = amount.toString();
	var powers = t.groupPowers || [0, 2, 3, 6, 9];

	var groups = [];

	for (var i = 0; i < powers.length; i++) {
		var from = i < powers.length - 1 ? -1 * powers[i + 1] : 0;
		var to = -1 * powers[i] || undefined;
		groups.push(str.slice(from, to));
	}

	return groups;
}

function amountToText(amount) {
	if (t.ones[amount]) {
		return t.ones[amount];
	}
	// this part is a bit iffy
	if (amount <= 99) {
		var str = amount.toString();
		var ret = t.tens[str[0]];
		if (str[1] !== '0') {
			ret = t.reverseOnes ? t.ones[str[1]] + t.space + ret :
				ret + t.space + t.ones[str[1]];
		}
		return trim(ret, t.space);
	}

	var groups = group(amount);
	var output = '';
	for (var i = 0; i < groups.length; i++) {
		var num = parseInt(groups[i], 10);
		if (num > 0) {
			var sep = output ? t.groupSeparator : '';
			var groupName = num > 1 ?
				amountToText(num) + t.space + t.groupNamesPlural[i] :
				t.groupNamesSingular[i];
			output =  groupName + sep + output;
		}
	}
	return trim(output, t.space);
}

function wrap(amount) {
	if (!isNumber(amount)) {
		throw new Error('Input is not a number');
	}
	amount = Math.floor(amount); // discard decimals
	var res = amountToText(amount);
	if (t.postTransform) {
		res = t.postTransform(res);
	}
	return res;
}

module.exports = function(lang) {
	t = langs[lang || 'en'];
	return wrap;
};



},{"./da":1,"./en":2,"./fr":3,"./id":4,"./in":5,"./nl":7}],7:[function(require,module,exports){
// See https://onzetaal.nl/taaladvies/getallen-uitschrijven
module.exports = {
	ones: ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'],
	tens: ['', 'tien', '+twintig', '+dertig', '+veertig', '+vijftig', '+zestig', '+zeventig', '+tachtig', '+negentig'],
	groupNamesSingular: ['een', 'honderd', 'duizend ', 'één miljoen ', 'één miljard '],
	groupNamesPlural: ['', 'honderd', 'duizend ', ' miljoen ', ' miljard '],
	groupSeparator: '',
	space: '',
	reverseOnes: true,
	postTransform: function(str){
		str = str.replace(/^\+/g,'');
		str = str.replace(/e\+/g,'eën');
		str = str.replace(/\+/g,'en');
		str = str.replace(/(^|\s)een(\s|$)/g, '$1één$2');
		return str;
	}
};

},{}]},{},[6])(6)
});
