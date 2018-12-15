# Excalibur_ Smart Contracts API

This is the Ethereum compatible JavaScript API for smart contracts for work with a decentralized exchange. It's available on npm as a node module.

You need to run a local Ethereum node to use this library.
For additional information you should use the [documentation](https://github.com/xclbrio/wiki/wiki/JavaScript-API) for this library.

## Table of Contents

* [Installation](#installation)
  * [Node.js](#nodejs)
* [Usage information](#usage-information)
  * [Import class for use in your project](#import-class-for-use-in-your-project)
  * [Create a class instance](#create-a-class-instance)
  * [Get methods for working with it](#get-methods-for-working-with-it)
  * [An example of a method call](#an-example-of-a-method-call)
* [Contribute!](#contribute)
  * [Building (BuildName)](#building-buildname)
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

## Contribute!

### Building (BuildName)

```bash
npm run-script build
```


### Testing (mocha)

```bash
npm test
```

### Community
 * [Gitter](https://gitter.im/xclbrio/excalibur.js?utm_source=share-link&utm_medium=link&utm_campaign=share-link)


### Other implementations

At the moment other libraries require improvements
 * Python [LIBRARYNAME.py] [NOT AVAILABLE]
 * Java [LIBRARYNAMEj] [NOT AVAILABLE]
 * Rust [rust-LIBRARYNAME] [NOT AVAILABLE]

## License

[Apache v2.0]() © 2018 Contributors
