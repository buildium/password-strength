function Rule(name, test, rate) {
    this.name = name;

    this.fn = function check (string) {
        return rate(string.length, test(string));
    };
}

module.exports = Rule;