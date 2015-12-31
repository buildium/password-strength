var RuleSet = require('../ruleset');

RuleSet.Build(function build (setBuilder) {
    var upperCaseTest = /[A-Z]/,
        lowerCaseTest = /[a-z]/,
        numberTest = /[0-9]/,
        symbolTest = /[^A-Za-z0-9]/,
        numberOrSymbolTest = /[^A-Za-z]/,
        letterTest = /[A-Za-z]/,
        seqLetters = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        seqNumbers = '01234567890'.split(''),
        seqSymbols = ')!@#$%^&*()'.split('');

    var regexTest = function test(testRe) {
        return function (input) {
            return input.reduce(function (accumulator, current) {
                return testRe.test(current) ? accumulator + 1 : accumulator;
            }, 0);
        };
    };

    var sameTypeTest = function sameType(testRe) {
        return function (input) {
            return input.every(function (char) {
                return testRe.test(char);
            }) ? input.length : 0;
        };
    };

    var consecutiveTest = function consecutive(testRe) {
        return function (input) {
            return input.reduce(function (matches, letter, index, letters) {
                return index > 0 && testRe.test(letter) && testRe.test(letters[index - 1]) ?
                    matches + 1 : matches;
            }, 0);
        };
    };

    var sequentialTest = function sequential(sequenceMembers, minLengthForSequence) {
        minLengthForSequence = minLengthForSequence || 3;

        return function (input) {
            var cursor, index, sequenceIndex, count, length, character, sequenceMember;
            cursor = count = 0;

            for (cursor = 0; cursor < input.length; cursor++) {
                index = cursor;
                character = input[index];
                sequenceIndex = sequenceMembers.indexOf(character);
                sequenceMember = sequenceMembers[sequenceIndex];
                length = 0;

                while (character && character === sequenceMember) {
                    length = length + 1;
                    character = input[++index];
                    sequenceMember = sequenceMembers[++sequenceIndex];
                }

                count = length >= minLengthForSequence ? count + 1 : count;
            }

            return count;
        };
    };

    return setBuilder
        .withName('passwordmeter')
        .beforeRule(function toCharArray(input) {
            return typeof input === 'string' ? input.split('') : [];
        })
        .addRule(function numberOfCharacters(ruleBuilder) {
            return ruleBuilder
                .withName('numberOfCharacters')
                .test(function (input) { return input.length; })
                .rate(function (length, hits) { return hits * 4; })
                .build();
        })
        .addRule(function upperCaseLetters(ruleBuilder) {
            return ruleBuilder
                .withName('upperCaseLetters')
                .test(function (input) {
                    if (consecutiveTest(upperCaseTest)(input) === input.length) {
                        return 0;
                    }
                    return regexTest(upperCaseTest)(input);
                })
                .rate(function(length, hits) { return hits ? (length - hits) * 2 : 0; })
                .build();
        })
        .addRule(function lowerCaseLetters(ruleBuilder) {
            return ruleBuilder
                .withName('lowerCaseLetters')
                .test(function (input) {
                    if (consecutiveTest(lowerCaseTest)(input) === input.length) {
                        return 0;
                    }
                    return regexTest(lowerCaseTest)(input);
                })
                .rate(function(length, hits) { return hits ? (length - hits) * 2 : 0; })
                .build();
        })
        .addRule(function numbers(ruleBuilder) {
            return ruleBuilder
                .withName('numbers')
                .test(function (input) {
                    if (sameTypeTest(numberTest)(input) === input.length) {
                        return 0;
                    }
                    return regexTest(numberTest)(input);
                })
                .rate(function (length, hits) { return hits * 4; })
                .build();
        })
        .addRule(function symbols(ruleBuilder) {
            return ruleBuilder
                .withName('symbols')
                .test(regexTest(symbolTest))
                .rate(function (length, hits) { return hits * 6; })
                .build();
        })
        .addRule(function middleNumbersAndSymbols(ruleBuilder) {
            return ruleBuilder
                .withName('middleNumbersAndSymbols')
                .test(function (input) {
                    return regexTest(numberOrSymbolTest)(input.slice(1, -1));
                })
                .rate(function (length, hits) { return hits * 2; })
                .build();
        })
        .addRule(function lettersOnly(ruleBuilder) {
            return ruleBuilder
                .withName('lettersOnly')
                .test(sameTypeTest(letterTest))
                .rate(function (length, hits) { return -hits; })
                .build();
        })
        .addRule(function numbersOnly(ruleBuilder) {
            return ruleBuilder
                .withName('numbersOnly')
                .test(sameTypeTest(numberTest))
                .rate(function (length, hits) { return -hits; })
                .build();
        })
        .addRule(function repeatCharacters(ruleBuilder) {
            return ruleBuilder
                .withName('repeatCharacters')
                .test(function (input) {
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
                })
                .rate(function(length, hits) { return -hits; })
                .build();
        })
        .addRule(function consecutiveUppercase(ruleBuilder) {
            return ruleBuilder
                .withName('consecutiveUppercase')
                .test(consecutiveTest(upperCaseTest))
                .rate(function (length, hits) { return -2 * hits; })
                .build();
        })
        .addRule(function consecutiveLowercase(ruleBuilder) {
            return ruleBuilder
                .withName('consecutiveLowercase')
                .test(consecutiveTest(lowerCaseTest))
                .rate(function (length, hits) { return -2 * hits; })
                .build();
        })
        .addRule(function consecutiveNumber(ruleBuilder) {
            return ruleBuilder
                .withName('consecutiveNumber')
                .test(consecutiveTest(numberTest))
                .rate(function (length, hits) { return -2 * hits; })
                .build();
        })
        .addRule(function sequentialLetters(ruleBuilder) {
            return ruleBuilder
                .withName('sequentialLetters')
                .test(sequentialTest(seqLetters))
                .rate(function (length, hits) { return -3 * hits; })
                .build();
        })
        .addRule(function sequentialNumbers(ruleBuilder) {
            return ruleBuilder
                .withName('sequentialNumbers')
                .test(sequentialTest(seqNumbers))
                .rate(function (length, hits) { return -3 * hits; })
                .build();
        })
        .addRule(function sequentialSymbols(ruleBuilder) {
            return ruleBuilder
                .withName('sequentialSymbols')
                .test(sequentialTest(seqSymbols))
                .rate(function (length, hits) { return -3 * hits; })
                .build();
        })
        .addRule(function requirements(ruleBuilder) {
            return ruleBuilder
                .withName('requirements')
                .test(function (input) {
                    input = input.join('');
                    var reqs = [upperCaseTest, lowerCaseTest, numberTest, symbolTest];
                    var points = reqs.reduce(function (accumulator, testRe) {
                        return testRe.test(input) ? accumulator + 1 : accumulator;
                    }, 0);

                    return input.length < 8 || points < 3 ? 0 : points + 1;
                })
                .rate(function (length, hits) { return 2 * hits; })
                .build();
        })
        .build();
});