'use strict';

import 'babel-polyfill';

let PasswordStrength = require('../passwordstrength');
let passwordMeter = new PasswordStrength();
passwordMeter.useRuleSet('passwordmeter');

describe('PasswordStrength', () => {
    describe('additions', () => {
        describe('number of characters', () => {
            it('should assign a score of 0 for an undefined value', () => {
                expect(passwordMeter.checkPassword().numberOfCharacters).toEqual(0);
            });

            it('should assign as score of n*4 for length', () => {
                expect(passwordMeter.checkPassword('aa').numberOfCharacters).toEqual(8);
            });
        });

        describe('uppercase letters', () => {
            it('should assign a score of 0 if all the characters are uppercase letters', () => {
                expect(passwordMeter.checkPassword('AA').upperCaseLetters).toEqual(0);
            });

            it('should assign a score of +((len-n)*2 for uppercase characters WHEN there is mixed case', () => {
                expect(passwordMeter.checkPassword('Aa').upperCaseLetters).toBe(2);
            });
        });

        describe('lowercase letters', () => {
            it('should assign a score of 0 if all the characters are lowercase letters', () => {
                expect(passwordMeter.checkPassword('aa').lowerCaseLetters).toEqual(0);
            });

            it('should assign a score of +((len-n)*2 for lowercase characters WHEN there is mixed case', () => {
                expect(passwordMeter.checkPassword('Aa').lowerCaseLetters).toBe(2);
            });
        });

        describe('numerical characters', () => {
            it('should give 4 points per number', () => {
                expect(passwordMeter.checkPassword('B613').numbers).toEqual(12);
            });
        });

        describe('symbols', () => {
            it('should give 6 points per symbol', () => {
                expect(passwordMeter.checkPassword('Ke$ha').symbols).toEqual(6);
            });
        });

        describe('middle numbers and symbols', () => {
            it('should assign 0 points to an input with no middle symbols', () => {
                expect(passwordMeter.checkPassword('a$').middleNumbersAndSymbols).toEqual(0);
            });

            it('should give 2 points for any number or symbol in the middle of the input', () => {
                expect(passwordMeter.checkPassword('l33t').middleNumbersAndSymbols).toEqual(4);
                expect(passwordMeter.checkPassword('fr0z*n').middleNumbersAndSymbols).toEqual(4);
            });
        });

        describe('requirements', () => {
            it('should award 8 points when the length requirement and 3 other requirements are met', () => {
                expect(passwordMeter.checkPassword('hunkymonkey1@').requirements).toEqual(8);
            });

            it('should award 10 points when the length requirement and all other requirements are met', () => {
                expect(passwordMeter.checkPassword('Hunkymonkey1@').requirements).toEqual(10);
            });
        });
    });

    describe('deductions', () => {
        describe('letters only', () => {
            it('should subtract one pointer per letter if all the characters are letters', () => {
                expect(passwordMeter.checkPassword('abEfg').lettersOnly).toEqual(-5);
            });
        });

        describe('numbers only', () => {
            it('should subtract one pointer per letter if all the characters are letters', () => {
                expect(passwordMeter.checkPassword('12345').numbersOnly).toEqual(-5);
            });
        });

        describe('repeat characters', () => {
            it('should deduct for repeat characters based on proximity', () => {
                expect(passwordMeter.checkPassword('aa').repeatCharacters).toEqual(-4);
                expect(passwordMeter.checkPassword('aaa').repeatCharacters).toEqual(-14);
                expect(passwordMeter.checkPassword('abcdabcd').repeatCharacters).toEqual(-6);
                expect(passwordMeter.checkPassword('aabbaa').repeatCharacters).toEqual(-24);
                expect(passwordMeter.checkPassword('blob').repeatCharacters).toEqual(-2);
            });
        });

        describe('consecutive upper case', () => {
            it('should deduct 2 points for every consecutive upper case letter', () => {
                expect(passwordMeter.checkPassword('AAbCC').consecutiveUppercase).toBe(-4);
            });
        });

        describe('consecutive lower case', () => {
            it('should deduct 2 points for every consecutive lowercase letter', () => {
                expect(passwordMeter.checkPassword('blah').consecutiveLowercase).toBe(-6);
            });
        });

        describe('consecutive numbers', () => {
            it('should deduct 2 points for every consecutive number', () => {
                expect(passwordMeter.checkPassword('abcd12').consecutiveNumber).toBe(-2);
                expect(passwordMeter.checkPassword('12345678910').consecutiveNumber).toEqual(-20);
            });
        });

        describe('sequential letters (3+)', () => {
            it('should deduct 3 points for every sequence of letters of 3 or more characters', () => {
                expect(passwordMeter.checkPassword('abc').sequentialLetters).toEqual(-3);

                // jasmine complaining that -0 != 0. wat?
                expect(Math.abs(passwordMeter.checkPassword('ab12cd').sequentialLetters)).toEqual(0);
            });
        });

        describe('sequential numbers (3+)', () => {
            it('should deduct 3 points for every sequence of numbers of 3 or more characters', () => {
                expect(passwordMeter.checkPassword('123a45').sequentialNumbers).toEqual(-3);
            });
        });

        describe('sequential symbols (3+)', () => {
            it('should deduct 3 points for every sequence of symbols of 3 or more characters', () => {
                expect(passwordMeter.checkPassword(')!@#$').sequentialSymbols).toEqual(-9);
            });
        });
    });

    describe('the cumulative effect', () => {
        it('should check the entire password', () => {
            expect(passwordMeter.checkPassword('my)Fp43.').score).toEqual(88);
        });

        it('should cap the output at 100', () => {
            expect(passwordMeter.checkPassword('j}FnoU8bseRL&X3CbFQWVKW').score).toEqual(100);
        });

        it('should check this other password', () => {
            expect(passwordMeter.checkPassword('^CHkAV,4gy').score).toEqual(90);
        });

        it('should use additions and deductions', () => {
            expect(passwordMeter.checkPassword('12345678910').score).toEqual(9);
        });
    });
});
