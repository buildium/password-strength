var knownRuleSets = {};

function RuleSet(name, rules, before) {
    this.name  = name;
    this.rules = rules;
    this.before = before;
}

/**
 * @param  {String} input The password to apply this rule set to
 * @return {Number} The strength determined by this set of rules
 */
RuleSet.prototype.apply = function(input) {
    var result = {};

    if (this.before) {
        input = this.before(input);
    }

    result.score = this.rules.reduce(function(score, rule) {
        result[rule.name] = rule.fn(input);
        return score + result[rule.name];
    }, 0);

    // set max score to 100 for all rule sets
    result.score = Math.min(result.score, 100);

    return result;
};

/**
 * @param  {String} name
 * @return {RuleSet}
 */
RuleSet.get = function get(name) {
    if (name in knownRuleSets) {
        return knownRuleSets[name];
    }

    return new RuleSet();
};

/**
 * @callback RuleBuilderFunction
 * @param {RuleSetBuilder} ruleSetBuilder
 * @returns {RuleSet}
 */

/**
 * @param {RuleSetBuilderFunction} builderFunction
 */
RuleSet.Build = function Build(builderFunction) {
    var RuleSetBuilder = require('./rulesetbuilder');
    var ruleSet = builderFunction(new RuleSetBuilder());

    if (ruleSet instanceof RuleSet) {
        knownRuleSets[ruleSet.name] = ruleSet;
    }
};

module.exports = RuleSet;