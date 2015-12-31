function RuleBuilder() {}

/**
 * @param  {String} name
 * @return {RuleBuilder}
 */
RuleBuilder.prototype.withName = function(name) {
    this.name = name;
    return this;
};

/**
 * @callback TestFunction
 * @param {String} input the password string to test for this rule
 * @return {Number} the count for this rule (i.e. how many times the test is successful)
 */

/**
 * @param  {TestFunction} testFunction
 * @return {RuleBuilder}
 */
RuleBuilder.prototype.test = function(testFunction) {
    this.testFunction = testFunction;
    return this;
};

/**
 * @callback RateFunction
 * @param {Number} length number of characters in the input
 * @param {Number} hits number of occurrences for this rule given by the ruleFunction
 * @return {Number} the computed strength bonus
 */

/**
 * @param  {RateFunction} rateFunction
 * @return {RuleBuilder}
 */
RuleBuilder.prototype.rate = function(rateFunction) {
    this.rateFunction = rateFunction;
    return this;
};

/**
 * @return {Rule}
 */
RuleBuilder.prototype.build = function() {
    var Rule = require('./rule');
    return new Rule(this.name, this.testFunction, this.rateFunction);
};

module.exports = RuleBuilder;