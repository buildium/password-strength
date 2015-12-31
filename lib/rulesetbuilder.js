function RuleSetBuilder() {
    this.ruleSet = [];
}

/**
 * @param  {String}
 * @return {RuleSetBuilder}
 */
RuleSetBuilder.prototype.withName = function(name) {
    this.name = name;
    return this;
};

/**
 * @param  {Function.<String>} fn A function to be called on the input before each rule
 * @return {RuleSetBuilder}
 */
RuleSetBuilder.prototype.beforeRule = function(fn) {
    var beforeFunction = this.beforeFunction;

    this.beforeFunction = function newBeforeFunction(input) {
        return beforeFunction ? fn(beforeFunction(input)) : fn(input);
    };

    return this;
};

/**
 * @callback RuleBuilderFunction
 * @param {RuleBuilder} ruleBuilder
 * @returns {Rule}
 */

/**
 * @param {RuleBuilderFunction} builderFunction
 * @return {RuleSetBuilder}
 */
RuleSetBuilder.prototype.addRule = function(builderFunction) {
    var Rule = require('./rule');
    var RuleBuilder = require('./rulebuilder');
    var rule = builderFunction(new RuleBuilder());

    if (rule instanceof Rule) {
        this.ruleSet.push(rule);
        return this;
    }

    throw new Error('Incomplete definition provided for Rule');
};

/**
 * @return {RuleSet}
 */
RuleSetBuilder.prototype.build = function() {
    var RuleSet = require('./ruleset');
    return new RuleSet(this.name, this.ruleSet, this.beforeFunction);
};

module.exports = RuleSetBuilder;