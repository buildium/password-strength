(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BdPasswordStrength = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var upperCaseTest = /[A-Z]/,
    lowerCaseTest = /[a-z]/,
    numberTest = /[0-9]/,
    symbolTest = /[^A-Za-z0-9]/,
    numberOrSymbolTest = /[^A-Za-z]/,
    letterTest = /[A-Za-z]/,

    seqLetters = 'abcdefghijklmnopqrstuvwxyz'.split(''),
    seqNumbers = '01234567890'.split(''),
    seqSymbols = ')!@#$%^&*()'.split('');

// COMPOSED FUNCTIONS
var upperCaseLetters,
    lowerCaseLetters,
    numbers,
    symbols,
    lettersOnly,
    numbersOnly,
    repeatCharacters,
    consecutiveUppercase,
    consecutiveLowercase,
    consecutiveNumber,
    sequentialLetters,
    sequentialNumbers,
    sequentialSymbols;

// FUNCTIONS
var safety = function safety(fn) {
    return function safeFn(input) {
        return typeof input === 'string' ? fn(input.split('')) : 0;
    }
}

var makeDeduction = function makeDeduction(fn) {
    return function negFn() {
        var args = Array.prototype.slice.call(arguments);
        return -(fn.apply(this, args));
    }
}

var numberOfCharacters = safety(function numChars(input) {
    return input.length * 4;
});

var characterTest = function characterTest(testRe) {
    return safety(function (input) {
        var matches = input.reduce(function (accumulator, current) {
            return testRe.test(current) ? accumulator + 1 : accumulator;
        }, 0);

        return (input.length - matches) * 2;
    });
};

var flatTest = function flatTest(testRe, value) {
    return safety(function testFlat(input) {
        return input.reduce(function (accumulator, current) {
            return testRe.test(current) ? accumulator + value : accumulator;
        }, 0);
    });
}

var middleNumbersAndSymbols = safety(function midNumsAndSymbs(input) {
    return input.slice(1, -1).reduce(function (accumulator, current) {
        return numberOrSymbolTest.test(current) ? accumulator + 2 : accumulator;
    }, 0);
});

var requirements = safety(function req(input) {
    var reqs = [upperCaseTest, lowerCaseTest, numberTest, symbolTest].reduce(function (accumulator, testRe) {
        return testRe.test(input) ? accumulator + 2 : accumulator;
    }, 0);

    return input.length >= 8 ? 2 + reqs : 0;
});

var sameType = function sameType(testRe) {
    return safety(makeDeduction(function (input) {
        return input.every(function (char) {
            return testRe.test(char);
        }) ? input.length : 0;
    }));
}

var repeated = safety(function repChars(input) {
    var nRepChar = 0;

    return input.reduce(function (accumulator, aVal, aIndex, arr) {
        var nUnqChar;

        var bTotal = arr.reduce(function (acc, bVal, bIndex) {
            return (aVal === bVal && aIndex !== bIndex) ?
            acc + Math.abs(arr.length / (bIndex - aIndex)) :
                acc;
        }, accumulator);

        if (bTotal !== accumulator) {
            nRepChar += 1;
            nUnqChar = arr.length - nRepChar;

            return (nUnqChar) > 0 ?
                Math.ceil(bTotal / nUnqChar) :
                Math.ceil(bTotal);
        }
        return accumulator;
    }, 0);
});

var consecutive = function consecutive(testRe) {
    return safety(function consecutiveTest(input) {
        return input.reduce(function (score, letter, index, letters) {
            if (index > 0 && (testRe.test(letter) && testRe.test(letters[index - 1]))) {
                return score + 2;
            } else {
                return score;
            }
        }, 0);
    });
}

var sequential = function sequential(sequence) {
    return safety(function seq(input) {
        return input.reduce(function (score, char, index, chars) {
            return (sequence.indexOf(chars[index]) === (sequence.indexOf(chars[index + 1]) - 1) &&
            sequence.indexOf(chars[index]) === (sequence.indexOf(chars[index + 2]) - 2)) ?
            score + 3 :
                score;
        }, 0);
    });
}

var checkPassword = function checkPassword(input) {
    var score = [
        numberOfCharacters,
        middleNumbersAndSymbols,
        requirements,
        upperCaseLetters,
        lowerCaseLetters,
        numbers,
        symbols,
        lettersOnly,
        numbersOnly,
        repeatCharacters,
        consecutiveUppercase,
        consecutiveLowercase,
        consecutiveNumber,
        sequentialLetters,
        sequentialNumbers,
        sequentialSymbols
    ].reduce(function (score, rule) {
        return score + rule(input);
    }, 0);

    return score > 100 ? 100 : score;
}

upperCaseLetters = characterTest(upperCaseTest);
lowerCaseLetters = characterTest(lowerCaseTest);
numbers = flatTest(numberTest, 4);
symbols = flatTest(symbolTest, 6);
lettersOnly = sameType(letterTest);
numbersOnly = sameType(numberTest);
repeatCharacters = makeDeduction(repeated);
consecutiveUppercase = makeDeduction(consecutive(upperCaseTest));
consecutiveLowercase = makeDeduction(consecutive(lowerCaseTest));
consecutiveNumber = makeDeduction(consecutive(numberTest));
sequentialLetters = makeDeduction(sequential(seqLetters));
sequentialNumbers = makeDeduction(sequential(seqNumbers));
sequentialSymbols = makeDeduction(sequential(seqSymbols));

module.exports = {
    // additions
    numberOfCharacters: numberOfCharacters,
    upperCaseLetters: upperCaseLetters,
    lowerCaseLetters: lowerCaseLetters,
    numbers: numbers,
    symbols: symbols,
    middleNumbersAndSymbols: middleNumbersAndSymbols,
    requirements: requirements,
    lettersOnly: lettersOnly,
    numbersOnly: numbersOnly,

    // deductions
    repeatCharacters: repeatCharacters,
    consecutiveUppercase: consecutiveUppercase,
    consecutiveLowercase: consecutiveLowercase,
    consecutiveNumber: consecutiveNumber,
    sequentialLetters: sequentialLetters,
    sequentialNumbers: sequentialNumbers,
    sequentialSymbols: sequentialSymbols,

    // wrapping it up
    checkPassword: checkPassword
};

},{}]},{},[1])(1)
});