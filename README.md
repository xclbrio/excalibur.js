# Excalibur_ JavaScript Library

[![](https://img.shields.io/badge/project-Excalibur__-ef5777.svg?style=popout-square)](https://github.com/xclbrio)
[![GitHub](https://img.shields.io/github/license/xclbrio/ipfsWebDist.svg?style=flat-square)](https://github.com/xclbrio/excalibur.js/blob/1.0-dev/LICENSE)
[![Travis (.com)](https://img.shields.io/travis/com/xclbrio/excalibur.js.svg?style=flat-square)](https://travis-ci.com/xclbrio/excalibur.js)
[![GitHub release](https://img.shields.io/github/release/xclbrio/excalibur.js.svg?style=flat-square)](https://github.com/xclbrio/excalibur.js/releases)
[![Gitter](https://img.shields.io/gitter/room/:user/:repo.svg?style=flat-square)](https://gitter.im/xclbrio/Lobby)

This library allows you to create smart contracts based on the Ethereum blockchain.

Node.js and NPM are required to use this library. It is available as LIBRARYNAME in the NPM.

All the necessary information on the initial setup and use can be obtained here, additional information can be obtained from the [documentation](https://github.com/xclbrio/wiki/wiki/JavaScript-API) for this library.

## Table of Contents

* [Installation](#installation)
  * [Node.js](#nodejs)
* [Usage information](#usage-information)
  * [Import class for use in your project](#import-class-for-use-in-your-project)
  * [Create a class instance](#create-a-class-instance)
  * [Get methods for working with it](#get-methods-for-working-with-it)
  * [An example of a method call](#an-example-of-a-method-call)
* [Other](#other)
  * [Testing (mocha)](#testing-mocha)
  * [Community](#community)
  * [Other implementations](#other-implementations)
* [License](#license)

## Installation

### Node.js

```bash
npm install LIBRARYNAME
```

## Usage information

### Import class for use in your project

Import library to constant:

```js
const Example = require("LIBRARYNAME");
```

### Create a class instance

Creating an instance of the Excalibur class:

```js
let example = new Example("https://kovan.infura.io", false, false);
```

### Get methods for working with it

You can get methods for working with your object:

```js
console.log(example);
```

### An example of a method call

Example of a method call on an object:

```js
example.versions();
```

## Other

### Testing (mocha)

```bash
npm test
```

### Communications
 * [Gitter](https://gitter.im/xclbrio/Lobby)
 * Email: support@xclbr.io

### Other implementations

At the moment other libraries require improvements
 * Python [LIBRARYNAME.py] [NOT AVAILABLE]
 * Java [LIBRARYNAMEj] [NOT AVAILABLE]
 * Rust [rust-LIBRARYNAME] [NOT AVAILABLE]

## License

[Apache v2.0](https://github.com/xclbrio/excalibur.js/blob/1.0-dev/LICENSE) © 2018 Contributors
