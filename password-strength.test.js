'use strict';

import 'babel-polyfill';

import { default as PasswordStrength } from './password-strength';

describe('PasswordStrength', () => {
    describe('base cases', () => {
        it('should assign a score of 0 for undefined input', () => {
            expect(PasswordStrength.calculatePasswordStrength(undefined, false)).toEqual(0);
        });

        it('should assign a score of 4 for a single character, even without a second parameter', () => {
            expect(PasswordStrength.calculatePasswordStrength('a')).toEqual(4);
        });
    });

    describe('password length', () => {
        it('should assign a score of 4 for a single character', () => {
            expect(PasswordStrength.calculatePasswordStrength('a', false)).toEqual(4);
        });

        it('should assign a score of ' + (4 + 2 * 7) + ' for 8 characters because characters 2 through 8 are both 2 points each', () => {
            expect(PasswordStrength.calculatePasswordStrength('abcdefgh', false)).toEqual(4 + 2 * 7);
        });

        it('should assign a score of ' + (4 + 2 * 7 + 1.5) + 'for 9 characeters because the 9th character is worth 1.5 points', () => {
            expect(PasswordStrength.calculatePasswordStrength('abcdefghi', false)).toEqual(4 + 2 * 7 + 1.5);
        });

        it('should assign a score of ' + (4 + 2 * 7 + 1.5 * 12) + ' for 20 characters because characters 9 through 20 are both 1.5 points each', () => {
            expect(PasswordStrength.calculatePasswordStrength('abcdefghijklmnopqrst', false)).toEqual(4 + 2 * 7 + 1.5 * 12);
        });

        it('should assign a score of ' + (4 + 2 * 7 + 1.5 * 12 + 6) + ' for 26 characters because characters beyond the 20th are worth 1 point each', () => {
            expect(PasswordStrength.calculatePasswordStrength('abcdefghijklmnopqrstuvwxyz', false)).toEqual(4 + 2 * 7 + 1.5 * 12 + 6);
        });
    });

    describe('non-lowercase characters', () => {
        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and an upper case letter has a bonus of 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('Password', false)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and a number has a bonus of 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('passw0rd', false)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and a special character has a bonus of 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('p@ssword', false)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and a space counts as a special character for a bonus of 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('pas word', false)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and letters with diacritic marks count as special characters for a bonus of 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('pássword', false)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (18 + 6) + ' because multiple non-lowercase letters do not increase the score', () => {
            expect(PasswordStrength.calculatePasswordStrength('P@ssw0rd', false)).toEqual(18 + 6);
        });
    });

    describe('weak password checks', () => {
        it('should assign a score of ' + (18 + 6) + ' because 8 characters has a base score of 18 and the weak password check is worth 6', () => {
            expect(PasswordStrength.calculatePasswordStrength('password', true)).toEqual(18 + 6);
        });

        it('should assign a score of ' + (19.5 + 6) + ' because 9 characters has a base score of 19.5 and the weak password check does not increase with the 9th character', () => {
            expect(PasswordStrength.calculatePasswordStrength('passwords', true)).toEqual(19.5 + 6);
        });

        it('should assign a score of ' + (21 + 5) + ' because 10 characters has a base score of 21 and the weak password check decreases by one for the 10th character', () => {
            expect(PasswordStrength.calculatePasswordStrength('passwordss', true)).toEqual(21 + 5);
        });

        it('should assign a score of 36 because 20 characters has a base score of 36 and the weak password check decreases to zero when we reach 20 characters', () => {
            expect(PasswordStrength.calculatePasswordStrength('abcdefghijklmnopqrst', true)).toEqual(36);
        });
    });
});
