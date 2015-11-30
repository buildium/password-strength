Buildium password-strength
==========================

This library takes a password and assigns a numerical value between 0 and 100 indicating the password's strength
strength. The algorithm is based upon [passwordmeter.com](http://www.passwordmeter.com). This is meant to give the user
an idea of whether their password is difficult to guess, but it provides no guarantees about the security of the
password.

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

bdPasswordStrength.checkPassword('^CHkAV,4gy'); // 90
```

**Via global packages**
```
<script src="bd-password-strength/dist/password-strength.min.js"></script>

<script>
BdPasswordStrength.checkPassword('^CHkAV,4gy');
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
