var RuleSet = require('./ruleset');
require('./extensions/passwordmeter');

function PasswordStrength() {
    this.rules = new RuleSet();
}

PasswordStrength.prototype.useRuleSet = function useRuleSet(name) {
    this.rules = RuleSet.get(name);
    return this;
};

PasswordStrength.prototype.checkPassword = function(input) {
    return this.rules.apply(input);
};

/**
 * Assigns a numerical value to a password using the default passwordmeter configuration.
 * Add backwards compatibility with version 1.0.x
 *
 * @param  {String}
 * @return {Number}
 */
PasswordStrength.checkPassword = function checkPassword(input) {
    return new PasswordStrength()
        .useRuleSet('passwordmeter')
        .checkPassword(input)
        .score;
};

module.exports = PasswordStrength;
