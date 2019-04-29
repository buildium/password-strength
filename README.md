Buildium password-strength
==========================

This library takes a password and assigns a numerical value to indicate the password strength, calculated as 
an entropy score. The calculation for entropy is based on the description in Appendix A of NIST 800-63.

The score is calculated with the following rules:

* The first character is worth 4 bits of entropy
* Characters 2 through 8 are worth 2 bits of entropy each.
* Characters 9 through 20 are worth 1.5 bits of entropy each.
* Characters beyond the 20th are worth one bit of entropy each.
* All non-lowercase letters are treated equally. If any exist, there is a bonus of 6 bits of entropy.
* If there is a check of the password against a known list of weak passwords, there is a nother bonus that 
starts at 6 bits and declines by one bit for every character beyond the 8th character.

This library does not support the logic of checking passwords against a known list of weak passwords,
but the second boolean parameter `includeWeakPasswordCheckBonus` will calculate the appropriate bonus
if the password check is present.

Installation
------------

**Via npm**

```
npm install bd-password-strength
```

**Via bower**

```
bower install bd-password-strength
```

Usage
-----

Include the code and call the summary method:

**Via CommonJS style**

```
var bdPasswordStrength = require('bd-password-strength');

bdPasswordStrength.calculatePasswordStrength('^CHkAV,4gy', false); // 27
```

**Via global packages**
```
<script src="bd-password-strength/dist/password-strength.min.js"></script>

<script>
BdPasswordStrength.calculatePasswordStrength('^CHkAV,4gy', false);
</script>
```

Testing
-------

Tests are written using [Jasmine](http://jasmine.github.io/) and run using
[Karma](http://karma-runner.github.io/0.13/index.html).

```
> npm test
```

License
-------

The MIT License (MIT)

Copyright (c) 2015 buildium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
