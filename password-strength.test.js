'use strict';

import 'babel-polyfill';

import { default as PasswordStrength } from './password-strength';

describe('PasswordStrength', () => {
    describe('additions', () => {
        describe('number of characters', () => {
            it('should assign a score of 0 for an undefined value', () => {
                expect(PasswordStrength.numberOfCharacters()).toEqual(0);
            });

            it('should assign as score of n*4 for length', () => {
                expect(PasswordStrength.numberOfCharacters('aa')).toEqual(8);
            });
        });

        describe('uppercase letters', () => {
            it('should assign a score of 0 if all the characters are uppercase letters', () => {
                expect(PasswordStrength.upperCaseLetters('AA')).toEqual(0);
            });

            it('should assign a score of +((len-n)*2 for uppercase characters WHEN there is mixed case', () => {
                expect(PasswordStrength.upperCaseLetters('Aa')).toBe(2);
            });
        });

        describe('lowercase letters', () => {
            it('should assign a score of 0 if all the characters are lowercase letters', () => {
                expect(PasswordStrength.lowerCaseLetters('aa')).toEqual(0);
            });

            it('should assign a score of +((len-n)*2 for lowercase characters WHEN there is mixed case', () => {
                expect(PasswordStrength.lowerCaseLetters('Aa')).toBe(2);
            });
        });

        describe('numerical characters', () => {
            it('should give 4 points per number', () => {
                expect(PasswordStrength.numbers('B613')).toEqual(12);
            });
        });

        describe('symbols', () => {
            it('should give 6 points per symbol', () => {
                expect(PasswordStrength.symbols('Ke$ha')).toEqual(6);
            });
        });

        describe('middle numbers and symbols', () => {
            it('should assign 0 points to an input with no middle symbols', () => {
                expect(PasswordStrength.middleNumbersAndSymbols('a$')).toEqual(0);
            });

            it('should give 2 points for any number or symbol in the middle of the input', () => {
                expect(PasswordStrength.middleNumbersAndSymbols('l33t')).toEqual(4);
                expect(PasswordStrength.middleNumbersAndSymbols('fr0z*n')).toEqual(4);
            });
        });

        describe('requirements', () => {
            it('should award 8 points when the length requirement and 3 other requirements are met', () => {
                expect(PasswordStrength.requirements('hunkymonkey1@')).toEqual(8);
            });

            it('should award 10 points when the length requirement and all other requirements are met', () => {
                expect(PasswordStrength.requirements('Hunkymonkey1@')).toEqual(10);
            });
        });
    });

    describe('deductions', () => {
        describe('letters only', () => {
            it('should subtract one pointer per letter if all the characters are letters', () => {
                expect(PasswordStrength.lettersOnly('abEfg')).toEqual(-5);
            });
        });

        describe('numbers only', () => {
            it('should subtract one pointer per letter if all the characters are letters', () => {
                expect(PasswordStrength.numbersOnly('12345')).toEqual(-5);
            });
        });

        describe('repeat characters', () => {
            it('should deduct for repeat characters based on proximity', () => {
                expect(PasswordStrength.repeatCharacters('aa')).toEqual(-4);
                expect(PasswordStrength.repeatCharacters('aaa')).toEqual(-14);
                expect(PasswordStrength.repeatCharacters('abcdabcd')).toEqual(-6);
                expect(PasswordStrength.repeatCharacters('aabbaa')).toEqual(-24);
                expect(PasswordStrength.repeatCharacters('blob')).toEqual(-2);
            });
        });

        describe('consecutive upper case', () => {
            it('should deduct 2 points for every consecutive upper case letter', () => {
                expect(PasswordStrength.consecutiveUppercase('AAbCC')).toBe(-4);
            });
        });

        describe('consecutive lower case', () => {
            it('should deduct 2 points for every consecutive lowercase letter', () => {
                expect(PasswordStrength.consecutiveLowercase('blah')).toBe(-6);
            });
        });

        describe('consecutive numbers', () => {
            it('should deduct 2 points for every consecutive number', () => {
                expect(PasswordStrength.consecutiveNumber('abcd12')).toBe(-2);
            });
        });

        describe('sequential letters (3+)', () => {
            it('should deduct 3 points for every sequence of letters of 3 or more characters', () => {
                expect(PasswordStrength.sequentialLetters('abc')).toEqual(-3);

                // jasmine complaining that -0 != 0. wat?
                expect(Math.abs(PasswordStrength.sequentialLetters('ab12cd'))).toEqual(0);
            });
        });

        describe('sequential numbers (3+)', () => {
            it('should deduct 3 points for every sequence of numbers of 3 or more characters', () => {
                expect(PasswordStrength.sequentialNumbers('123a45')).toEqual(-3);
            });
        });

        describe('sequential symbols (3+)', () => {
            it('should deduct 3 points for every sequence of symbols of 3 or more characters', () => {
                expect(PasswordStrength.sequentialSymbols(')!@#$')).toEqual(-9);
            });
        });
    });

    describe('the cumulative effect', () => {
        it('should check the entire password', () => {
            expect(PasswordStrength.checkPassword('my)Fp43.')).toEqual(88);
        });

        it('should check cap the output at 100', () => {
            expect(PasswordStrength.checkPassword('j}FnoU8bseRL&X3CbFQWVKW')).toEqual(100);
        });

        it('should check this other password', () => {
            expect(PasswordStrength.checkPassword('^CHkAV,4gy')).toEqual(90);
        });
    });
});
