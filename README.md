## vapjs

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/vapjs/vapjs">
    <img src="https://david-dm.org/vapjs/vapjs.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/vapjs/vapjs#info=devDependencies">
    <img src="https://david-dm.org/vapjs/vapjs/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/vapjs/vapjs">
    <img src="https://travis-ci.org/vapjs/vapjs.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/vapjs">
    <img src="http://img.shields.io/npm/v/vapjs.svg"
    alt="NPM version" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/vapjs/vapjs">
    <img src="https://coveralls.io/repos/github/vapjs/vapjs/badge.svg" alt="Test Coverage" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A highly optimised, light-weight JS utility for [Vapory](https://www.vapory.org/) based on [`web3.js`](https://github.com/vaporyco/web3.js), but lighter, async only and using `BN.js`.

Only **106 kB** minified!

## Install

```
npm install --save vapjs
```

## CDN

```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vapjs@0.3.4/dist/vapjs.min.js"></script>
```

Note, exports to `window.Vap` global.

## Usage

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('https://ropsten.infura.io'));

vap.getBlockByNumber(45300, true, (err, block) => {
  // result null { ...block data... }
});

const vaporValue = Vap.toWei(72, 'vapor');

// result <BN: 3e733628714200000>

const tokenABI = [{
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs":[{"name": "","type": "uint256"}],
  "payable": false,
  "type": "function",
}];

const token = vap.contract(tokenABI).at('0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78');

token.totalSupply().then((totalSupply) => {
  // result <BN ...>  4500000
});

// token.transfer( ... ).then(txHash => vap.getTransactionSuccess(txHash)).then(receipt => console.log(receipt));
```

## About

A simple module for building dApps and applications that use Vapory.

Please see our complete [`user-guide`](docs/user-guide.md) for more information.

## Contributing

Please help better the ecosystem by submitting issues and pull requests to `vapjs`. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard and the unix philosophy.

## Guides

You'll find more detailed information on using `vapjs` and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to `vapjs` and writing your own code and coverage.
- [Examples](http://github.com/vapjs/examples) - Examples of `vapjs` in use.

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

- Create, enhance, and debug vapjs rules (see our guide to ["Working on rules"](./.github/CONTRIBUTING.md)).
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making `vapjs` better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools.
- Spread the word!

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) docs before helping out.

We communicate via [issues](https://github.com/vapjs/vapjs/issues) and [pull requests](https://github.com/vapjs/vapjs/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/vapjs/vapjs/master/LICENSE)

## Our Relationship with Vapory & VaporyJS

We would like to mention that we are not in any way affiliated with the Vapory Foundation. However, we love the work they do and work with them often to make Vapory great! Our aim is to support the Vapory ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

Many of our modules use code from `web3.js` and the `vaporyjs-` repositories. We thank the authors where we can in the relevant repositories.

## Special Thanks

`vapjs` was built by a strong community of Vapory developers. A special thanks to:

- [Fabian Vogelsteller](https://twitter.com/feindura?lang=en) - for his work on `Mist` and `web3.js`
- [Tim Coulter](https://github.com/tcoulter) - for his work on `TestRPC` and `Truffle`
- [Aaron Davis](https://github.com/kumavis) - for his guidence and work on `MetaMask` and `vaporyjs`
- [Richard Moore](https://github.com/ricmoo) - for his work on `ethers-io` and `vapors-wallet` from which so much of `vapjs` is build from
- [Karl Floersch](https://twitter.com/karl_dot_tech?lang=en) - for his guidence and support
- [Martin B.](https://github.com/wanderer) - for his work on `vaporyjs`
- [Alex Beregszaszi](https://github.com/axic) - for his work on `vaporyjs`
- [Vitalik Buterin](https://twitter.com/VitalikButerin) - for creating `Vapory`

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
