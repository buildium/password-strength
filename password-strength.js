'use strict';

const allLowerCaseTest = /^[a-z]+$/;

// FUNCTIONS
const numberOfAdditionalCharacters = function numberOfAdditionalCharacters(input, first, last) {
    const length = input.length;

    if (length < first) {
        return 0;
    }

    if (typeof(last) !== 'undefined' && last > first && length > last) {
        return last - first + 1;
    }

    return length - first + 1;
};

const nonLowercaseLettersBonus = function nonLowercaseLettersBonus(input) {
    return allLowerCaseTest.test(input) ? 0 : 6;
};

const weakPasswordCheckBonus = function weakPasswordCheckBonus(input, includeWeakPasswordCheckBonus) {
    if (!includeWeakPasswordCheckBonus) {
        return 0;
    }

    const charactersBetween9and20 = numberOfAdditionalCharacters(input, 9, 20);
    // Shift bits by 1 to do integer division by 2
    const result = 6 - (charactersBetween9and20 >> 1);
    return result > 0 ? result : 0;
};

const calculatePasswordStrength = function calculatePasswordStrength(input, includeWeakPasswordCheckBonus) {
    if (typeof(input) === 'undefined' || input.length === 0) {
        return 0;
    }

    const bitsForFirstCharacter = 4;
    const charactersBetween2And8 = numberOfAdditionalCharacters(input, 2, 8);
    const charactersBetween9and20 = numberOfAdditionalCharacters(input, 9, 20);
    const charactersOver20 = numberOfAdditionalCharacters(input, 21);

    return bitsForFirstCharacter +
        2 * charactersBetween2And8 +
        1.5 * charactersBetween9and20 +
        charactersOver20 +
        nonLowercaseLettersBonus(input) + 
        weakPasswordCheckBonus(input, includeWeakPasswordCheckBonus);
};

module.exports = {
    calculatePasswordStrength: calculatePasswordStrength
};