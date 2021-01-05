# User Guide

All information for developers using `vapjs` should consult this document.

## Install

```
npm install --save vapjs
```

## Usage

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('https://ropsten.infura.io'));

vap.getBlockByNumber(45300, (err, block) => {
  // result null { ...block data... }
});

const vaporValue = Vap.toWei(72, 'vapor');

// result <BN ...>

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
```

## Welcome

Thank you for trying out `vapjs`! A highly optimized light-weight JS utiltity for [Vapory](https://www.vapory.org/) based on [`web3.js`](https://github.com/vaporyco/web3.js), but lighter and using `BN.js`.

## Notice/Warning

`vapjs` is still in development and is highly experimental. Use at your own risk. While we test everything as against standards, specifications and existing test cases (layed out by both the community and the Vapory Foundation), this module is not ready for production use. More user testing is needed, so please, help out!

## Modules

`vapjs` is made from a series of smaller modules:

  - [`vapjs-query`](http://github.com/vapjs/vapjs-query) for querying the RPC layer
  - [`vapjs-format`](http://github.com/vapjs/vapjs-format) for formatting RPC payloads to and from the nodes
  - [`vapjs-contract`](http://github.com/vapjs/vapjs-contract) for handling contracts
  - [`vapjs-abi`](http://github.com/vapjs/vapjs-abi) for handling contract data encoding and decoding
  - [`vapjs-filter`](http://github.com/vapjs/vapjs-filter) for handling filters and events
  - [`vapjs-unit`](http://github.com/vapjs/vapjs-unit) for handling Vapory currency unit conversion
  - [`vapjs-util`](http://github.com/vapjs/vapjs-util) general utiltity methods
  - [`vapjs-provider-http`](http://github.com/vapjs/vapjs-provider-http) a simple XHR http provider

## Concepts

### dApps or Decentralized Apps

`vapjs` is primarily designed for building light-weight dApps or "Decentralized Applications" on Vapory. dApps are usually just some HTML/Javascript/CSS file(s) that interface with an Vapory node or client. They usually have little to no server architecture and are often just faces or light interfaces for one or many Vapory smart-contracts.

### Nodes

`vapjs` is meant to be a simple javascript interface for Vapory nodes and clients. If you are not running a node, we recommend using [TestRPC](https://github.com/vaporycojs/testrpc) (`npm install --save-dev vaporyjs-testrpc`), [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en), [Mist](https://github.com/vaporyco/mist/releases), or [Infura](https://www.infura.io/). A node or client is generally required to both access and use Vapory accounts, smart-contracts and the Vapory blockchain.

### Accounts

Vapory uses [secp256k1]() (public/private) key pairs for its account system. An Vapory account address (e.g. `0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2`) is derived from the public key in the key pair. Both `accounts` and Vapory `smart-contracts` have addresses, but only accounts use key pairs. Vaper is sent to and from contracts or accounts via addresses.

For example, this `secp256k1` **private key**:
```
0xb82f69b82496716c8d63a41b1ae88017e720595477b0a5eeb835a8e46c3a13e6
```

Derives to this `secp256k1` **public key**:
```
0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3daa12198d9284fe7c0d9cbb2cf970d5997e642edb1373a9fbe48784c8
```

Which derives to this Vapory **address**:
```
0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2
```

See: [`vapjs-account`](https://github.com/vapjs/vapjs-account), [`vap-lightwallet`](https://github.com/ConsenSys/vap-lightwallet), or the [`Vapory Whitepaper`](https://github.com/vaporyco/wiki/wiki/White-Paper#vapory) for more details.

Note, there is a [**difference**](https://www.reddit.com/r/vapory/comments/470s3q/vitalik_made_a_very_clever_backwards_compatible/) between Vapory `checksum` addresses (i.e. `0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2`), and non-checksum addresses (i.e. `0xbd151ceb123dcba8c27ad0769b8b9c11afc69cc2`).

### Vaper/Gas

Vaper is the magical internet money that powers the Vapory ecosystem. Each base unit of vapor (a wei) is worth some amount of computational processes on the Vapory world computer. Every transaction requires some amount of Vaper to send, because of this, we sometimes refer to vapor as "gas" or the "gas amount". You generally have to specify a gas amount when making any transaction with Vapory.

See: [`Vapory Whitepaper`](https://github.com/vaporyco/wiki/wiki/White-Paper#messages-and-transactions)

### Smart-Contracts

Vapory contracts or `smart-contracts` are computational code stored on the Vapory blockchain. Contracts can be written in a higher level language like [Solidity](https://solidity.readthedocs.io/en/develop/) which then compiles down into EVM (Vapory Virtual Machine) bytecode that can be stored on the chain. To use or deploy these contracts with `vapjs` you need the **ABI** and (if your deploying) the **bytecode** or (if your just using it) the **address**. Contracts can be designed to send and receive, process and store data and `vapor` from other `accounts` or `contracts`. `vapjs` provides a `vap.contract` object to help you interact with and deploy Vapory contracts (its design is very similar to its `web3.js` counterpart).

See: [`Browser-Solidity`](https://vapory.github.io/browser-solidity/) an in browser Solidity IDE for building contracts, [`Solidity Read The Docs`](https://solidity.readthedocs.io/en/develop/), [`vapjs-contract`](https://github.com/vapjs/vapjs-contract), [`Vapory Whitepaper`](https://github.com/vaporyco/wiki/wiki/White-Paper#applications). Note, this will actually provide you with the necessary contract `bytecode` and `ABI` required to deploy and use the contracts.

### Transactions/vs Calls

`vapjs` can both transact (attempt to change) and call (attempt to get information from) the blockchain. In order to send transactions, the raw transaction data must be signed by the secp256k1 private key of the account used, and some Vaper must be put up as "gas" in order for it to be processed and added to the blockchain. Calls do not require any account or vapor, and is simply just getting known information from the blockchain. Certain contract methods will require you to transact with them, while others are simply getters that you can call (usually refered to as "constant" methods).

See: [`Vapory Whitepaper`](https://github.com/vaporyco/wiki/wiki/White-Paper#messages-and-transactions), [`Vapory RPC Specification`](https://github.com/vaporyco/wiki/wiki/JSON-RPC#vap_sendtransaction).

### Testnet/Mainnet/Local

The Vapory (ETH) community runs two primary blockchains: a test network (testnet) called `ropsten` used to test contracts and transactions in a live (but not costly) setting and a main network (mainnet) called the Vapory "Mainnet" or "Livenet" used to make actual transactions and contracts. Usually, most developers like to design their contracts and apps locally, and will run a local private network. Local networks can also be run with tools like ["TestRPC"](https://github.com/vaporycojs/testrpc), ["go-vapory"](https://github.com/vaporyco/go-vapory) on a private network or ["parity"](https://github.com/ethcore/parity) on a private network.

See: [`Vaperscan Testnet Blockchain Explorer`](http://testnet.vaporscan.io/)

### Chain Services

There are many services available to help connect you or your app to the Vapory testnet or mainnet. [infura](https://www.infura.io/) is one constantly referenced by `vapjs` examples. Currently, it allows anyone to access its scalable node cluster for free over an HTTPS connection. You can connect to the infura testnet by using the [`HTTP provider`](https://github.com/vapjs/vapjs-provider-http) with the host set to either: `https://ropsten.infura.io` or mainnet by using `https://mainnet.infura.io`. Note, if you use infura, you need to do your own account handling and signing of transactions.

See: [`Infura.io`](https://www.infura.io/)

### Account Handling/Signing

Account handling and signing must be done carfully and with extreme caution. Note, if someone gains access to your private key, they can and most likely will steal all of your Vaper. Handling private keys is very dangerous and should be treated with extreme caution. Many nodes, clients and services (such as: [MetaMask], [uPort], [Gvap], [Partiy], [Lightwallet] and others) help manage your keys and transaction signing for you.

See: [`Vapory Whitepaper`](https://github.com/vaporyco/wiki/wiki/White-Paper#vapory-accounts).

### RPC

`vapjs` communicates with the Vapory nodes and clients via RPC (Remote Procedure Call) data payloads send to and from your dApp and the node. `vapjs` has complete Vapory RPC specification coverage, and tries to abstract very little past the specification. `vapjs` helps you format and build the data payloads that will be send and format payloads that are recieved by Vapory nodes. Usually, a provider is specified and then payloads can be transmitted between your dApp and the Vapory nodes.

See: [`Vapory RPC Specification`](https://github.com/vaporyco/wiki/wiki/JSON-RPC) for more details.

### Events/Filters

`vapjs` provides facility to manage events and filters. Filters are simple mechanisms to listen for changes on the blockchain. Contracts can also dispatch custom events.

See: [`vapjs-filter`](https://github.com/vapjs/vapjs-filter), [`Vapory RPC Specification`](https://github.com/vaporyco/wiki/wiki/JSON-RPC#vap_newfilter)

## Asynchronous Only

`vapjs` is completely async when handling data from any Vapory provider, node or client. All data methods require the use of either a callback or standard promise.

## Big Numbers/Number Handling

Vapory uses very large numbers for handling currency amounts and number storage on the blockchain. The JVM (Javascript Virtual Machine) can only handle up to integer `9007199254740991` safely without loosing precision. Because of this, we have to use a module called `bn.js` to handle the very large numbers and amounts often used in Vapory. Note, [`bn.js`](https://github.com/indutny/bn.js) "BN" is not the same as [`bignumber.js`](https://github.com/MikeMcl/bignumber.js) "BigNumber" used by web3. They are two different libraries. We use [`bn.js`](https://github.com/indutny/bn.js) because it does not support any decimal numbers, and can manage absolute precision of large integers (this lib is also used by `vaporyjs`).

There are **no decimal numbers on the blockchain**. All numbers must be converted to integers and then to hex format for chain storage and use. You must be very careful when handling large numbers. When working with Vapory number values, try to avoid or never use actual Number type values (i.e. `value: 45038000000,`) or decimal numbers (`value: 1000.003`). This may lead to incorrect values conversion, number precision loss or worse, all your or your users vapor!

Try to **always use `BN` Big Numbers** or if you have to strings. `vapjs` will attempt to convert your type `String` number into a BN properly, however, the best way is to always provide a type Object `BN` instance (e.g. `value: new Vap.BN('4000001'),` instead of `value: 4000001,`).

If you have to handle decimal amounts of value like `vapor` (e.g. `4500.302 vapor`), simply convert the value down to `wei` using the toWei method (e.g. `Vap.toWei('4500.302', 'vapor')`) and then do your handling with BN.

The BN object comes equip with numerous mathamatical operators and methods.

### BN.js API

![alt-text](https://raw.githubusercontent.com/MikeMcl/bignumber.js/gh-pages/API.png "BN.js API")

## API Design

* [Vap.BN](#vapbn)
* [Vap.isAddress](#vapisaddress)
* [Vap.keccak256](#vapkeccak256)
* [Vap.isHexString](#vapishexstring)
* [Vap.fromWei](#vapfromwei)
* [Vap.toWei](#vaptowei)
* [Vap.toBN](#vaptobn)
* [Vap.fromAscii](#vapfromascii)
* [Vap.toAscii](#vaptoascii)
* [Vap.fromUtf8](#vapfromutf8)
* [Vap.toUtf8](#vaptoutf8)
* [Vap.HttpProvider](#vaphttpprovider)
* [vap.contract](#vapcontract)
* [vap.filter](#vapfilter)
* [vap.web3_clientVersion](#vapweb3_clientversion)
* [vap.web3_sha3](#vapweb3_sha3)
* [vap.net_version](#vapnet_version)
* [vap.net_peerCount](#vapnet_peercount)
* [vap.net_listening](#vapnet_listening)
* [vap.protocolVersion](#vapprotocolversion)
* [vap.syncing](#vapsyncing)
* [vap.coinbase](#vapcoinbase)
* [vap.mining](#vapmining)
* [vap.hashrate](#vaphashrate)
* [vap.gasPrice](#vapgasprice)
* [vap.accounts](#vapaccounts)
* [vap.blockNumber](#vapblocknumber)
* [vap.getBalance](#vapgetbalance)
* [vap.getStorageAt](#vapgetstorageat)
* [vap.getTransactionCount](#vapgettransactioncount)
* [vap.getBlockTransactionCountByHash](#vapgetblocktransactioncountbyhash)
* [vap.getBlockTransactionCountByNumber](#vapgetblocktransactioncountbynumber)
* [vap.getUncleCountByBlockHash](#vapgetunclecountbyblockhash)
* [vap.getUncleCountByBlockNumber](#vapgetunclecountbyblocknumber)
* [vap.getCode](#vapgetcode)
* [vap.sign](#vapsign)
* [vap.sendTransaction](#vapsendtransaction)
* [vap.sendRawTransaction](#vapsendrawtransaction)
* [vap.call](#vapcall)
* [vap.estimateGas](#vapestimategas)
* [vap.getBlockByHash](#vapgetblockbyhash)
* [vap.getBlockByNumber](#vapgetblockbynumber)
* [vap.getTransactionByHash](#vapgettransactionbyhash)
* [vap.getTransactionByBlockHashAndIndex](#vapgettransactionbyblockhashandindex)
* [vap.getTransactionByBlockNumberAndIndex](#vapgettransactionbyblocknumberandindex)
* [vap.getTransactionReceipt](#vapgettransactionreceipt)
* [vap.getUncleByBlockHashAndIndex](#vapgetunclebyblockhashandindex)
* [vap.getUncleByBlockNumberAndIndex](#vapgetunclebyblocknumberandindex)
* [vap.getCompilers](#vapgetcompilers)
* [vap.compileLLL](#vapcompilelll)
* [vap.compileSolidity](#vapcompilesolidity)
* [vap.compileSerpent](#vapcompileserpent)
* [vap.newFilter](#vapnewfilter)
* [vap.newBlockFilter](#vapnewblockfilter)
* [vap.newPendingTransactionFilter](#vapnewpendingtransactionfilter)
* [vap.uninstallFilter](#vapuninstallfilter)
* [vap.getFilterChanges](#vapgetfilterchanges)
* [vap.getFilterLogs](#vapgetfilterlogs)
* [vap.getLogs](#vapgetlogs)
* [vap.getWork](#vapgetwork)
* [vap.submitWork](#vapsubmitwork)
* [vap.submitHashrate](#vapsubmithashrate)
* [vap.db_putString](#vapdb_putstring)
* [vap.db_getString](#vapdb_getstring)
* [vap.db_putHex](#vapdb_puthex)
* [vap.db_getHex](#vapdb_gvapex)
* [vap.shh_post](#vapshh_post)
* [vap.shh_version](#vapshh_version)
* [vap.shh_newIdentity](#vapshh_newidentity)
* [vap.shh_hasIdentity](#vapshh_hasidentity)
* [vap.shh_newGroup](#vapshh_newgroup)
* [vap.shh_addToGroup](#vapshh_addtogroup)
* [vap.shh_newFilter](#vapshh_newfilter)
* [vap.shh_uninstallFilter](#vapshh_uninstallfilter)
* [vap.shh_getFilterChanges](#vapshh_getfilterchanges)
* [vap.shh_getMessages](#vapshh_getmessages)

### vap.contract

[index.js:vapjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

Intakes the contract Vapory standard ABI schema, optionally the contract bytecode and default transaction object. Outputs a `ContractFactory` instance for the contract.

**Parameters**

-   `abi` **Array** a single Vapory standard contract ABI array
-   `bytecode` **String** [optional] the contract bytecode as a single alphanumeric hex string
-   `defaultTxObject` **Object** [optional] a single default transaction object

Result `ContractFactory` **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

vap.accounts().then((accounts) => {
  const SimpleStore = vap.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // create a new contract
  const simpleStore = SimpleStore.new((error, result) => {
    // result null '0x928sdfk...' (i.e. the transaction hash)
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');
});
```

### ContractFactory.new

[index.js:vapjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract factory has two methods, 'at' and 'new' which can be used to create the contract instance. The `at` method is used to create a `Contract` instance for a contract that has already been deployed to the Vapory blockchain (testnet, livenet, local or otherwise). The `new` method is used to deploy the contract to the current chain.

**Parameters**

-   [`params`] **Various** the contract constructor input paramaters, if any have been specified, these can be of various types, lengths and requirements depending on the contract constructor.
-   `txObject` **Object** [optional] a web3 standard transaciton JSON object
-   `callback` **Function** [optional] a standard async callback which is fired when the contract has either been created or the transaction has failed.

Result a single Promise **Object** instance.


```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

vap.accounts().then((accounts) => {
  const SimpleStore = vap.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // create a new contract
  SimpleStore.new((error, result) => {
    // result null '0x928sdfk...' (i.e. the transaction hash)
  });
});
```

### ContractFactory.at

[index.js:vapjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract factory has two methods, 'at' and 'new' which can be used to create the `Contract` instance.

**Parameters**

-   `address` **String** a single 20 byte alphanumeric hex string contract address

Result a single `Contract` **Object** instance.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

vap.accounts().then((accounts) => {
  const SimpleStore = vap.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');

  // use a method that comes with the contract
  simpleStore.set(45).then((txHash) => {
    console.log(txHash);
  });
});
```

### Contract (Instance)

[index.js:vapjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract instance is meant to simulate a deployed Vapory contract interface as a javascript object. All specified call methods are attached to this object (as specified by the contract ABI schema array).

In the example below, the SimpleStore contract has methods `set`, `get`, `constructor` and `SetComplete`.

The `get` method is flagged as `constant`, which means it will not make changes to the blockchain. It is purely for getting information from the chain.

However, the `set` method is not constant, which means it can be transacted with and change the blockchain.

The `constructor` method is only used when deploying the contract, i.e. when `.new` is used.

In this contract, the `SetComplete` event is fired when the `set` method has set a new value successfully.

You will notice the `simpleStore` instance makes all these methods available to it.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

vap.accounts().then((accounts) => {
  const SimpleStore = vap.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');

  simpleStore.set(45000, (error, result) => {
    // result null '0x2dfj24...'
  });

  simpleStore.get().catch((error) => {
    // error null
  }).then(result) => {
    // result <BigNumber ...>
  });

  const filter = simpleStore.SetComplete().new((error, result) => {
    // result null <BigNumber ...> filterId
  });
  filter.watch().then((result) => {
    // result null FilterResult {...} (will only fire once)
  });
  filter.uninstall((error, result) => {
    // result null Boolean filterUninstalled
  });
});
```

### Vap.toWei

[index.js:vapjs-unit](../../../blob/master/src/index.js "Source code on GitHub")

Convert a single Vapory denominated value at a specified unit, and convert it to its `wei` value. Intakes a `value` and `unit` specifier, outputs a single wei value `BN` object.

**Parameters**

-   `value` **Object|Number|String** a single number `wei` value as a integer, BN.js object instance, string hex integer, BN.js object instance (no decimals)
-   `unit` **String** the unit to covert to (i.e. `finney`, `vapor` etc..)

Result output single BN **Object**.

```js
const Vap = require('vapjs');

var val1 = Vap.toWei(249824778, 'vapor');

// result <BN ...> [.toString(10) : 249824778000000000000000000]
```

### Vap.fromWei

[index.js:vapjs-unit](../../../blob/master/src/index.js "Source code on GitHub")

Convert a wei denominated value into another Vapory denomination. Intakes a single wei `value` and outputs a BN object.

**Parameters**

-   `value` **Object|Number|String** a single number Vapory denominated value
-   `unit` **String** the unit to covert to (i.e. `finney`, `vapor` etc..)

Result output single **String** number.

```js
const Vap = require('vapjs');

var val1 = Vap.fromWei(249824778000000000000000000, 'vapor');

// result '249824778'
```

### Vap.HttpProvider

[index.js:vapjs-provider-http](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a `provider` URL specified as a string, and optionally the `timeout` specified as a Number, outputs a web3 standard `HttpProvider` object.

**Parameters**

-   `provider` **String** the URL path to your local Http RPC enabled Vapory node (e.g. `http://localhost:8545`) or a service node system like [Infura.io](http://infura.io) (e.g. `http://ropsten.infura.io`).
-   `timeout` **Number** [optional] the time in seconds that an XHR2 request will wait until it times out.

Result `HttpProvider` **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.accounts((err, result) => {
  // result null ['0xd89b8a74c153f0626497bc4a531f702...', ...]
});
```

### Vap.keccak256

[index.js:keccak256](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a single string and outputs a 32 byte (66 utf-8 byte) sha3 Keccak hex string or optionally a Buffer object.

**Parameters**

-   `input` **String** a single input string

Result output hex **String**.

```js
const Vap = require('vapjs');

console.log(Vap.keccak256('skfjksdfjksdjksd'));

// result 0x2b30820856594159b8ed9a26609193526e944a1a748eb7d493beac83911dd848
```

### vap.filter

[index.js:filter](../../../blob/master/src/index.js "Source code on GitHub")

Used to manage Vapory event listening and filtering.

```js
const Vap = require('vapjs');
const vap = new Vap(new HttpProvider('http://localhost:8545'));

const filter = new vap.filters.Filter({ delay: 300 })
.new({ toBlock: 500 })
.then((result) => {
  // result <BigNumber ...> filterId
})
.catch((error) => {
  // result null
});
filter.watch((result) => {
  // result [{...}, ...] (fires multiple times)
});
filter.uninstall(cb);


const filter = new vap.filters.BlockFilter()
.at(7)
filter.watch((result) => {
  // result [{...}, ...] (fires multiple times)
});
filter.uninstall(cb);


const filter = new vap.filters.PendingTransactionFilter()
.new()
.then((result) => {
  // result <BigNumber ...> filterId
})
.catch((error) => {
  // result null
});

const watcher = filter.watch((error, result) => {
  // result null ['0xfd234829...', '0xsf2030d1...']
});
watcher.stopWatching(cb);

filter.uninstall()
.then((result) => {
  // result true
})
.catch((error) => {
  // result null
});
```

### vap.web3_clientVersion

[index.js:web3_clientVersion](../../../blob/master/src/index.js Source code on GitHub")

The web3 client version.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.web3_clientVersion()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### vap.web3_sha3

[index.js:web3_sha3](../../../blob/master/src/index.js Source code on GitHub")

The keccak 256 sha3 hash of the data.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.web3_sha3("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.net_version

[index.js:net_version](../../../blob/master/src/index.js Source code on GitHub")

The net version from the node.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.net_version()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### vap.net_peerCount

[index.js:net_peerCount](../../../blob/master/src/index.js Source code on GitHub")

The total network peer count of the node.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.net_peerCount()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.net_listening

[index.js:net_listening](../../../blob/master/src/index.js Source code on GitHub")

Is the node listening to the network.

**Parameters**

none.

Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.net_listening()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.protocolVersion

[index.js:vap_protocolVersion](../../../blob/master/src/index.js Source code on GitHub")

Returns the current vapory protocol version.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.protocolVersion()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### vap.syncing

[index.js:vap_syncing](../../../blob/master/src/index.js Source code on GitHub")

Returns an object with data about the sync status or 'false'.

**Parameters**

none.

Result **"Boolean|VapSyncing"**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.syncing()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.coinbase

[index.js:vap_coinbase](../../../blob/master/src/index.js Source code on GitHub")

Returns the client coinbase address.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.coinbase()
.then((result) => {
  /*
  // result

  "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78"
  */
})
.catch((error) => {
  // null
});
```


### vap.mining

[index.js:vap_mining](../../../blob/master/src/index.js Source code on GitHub")

Returns 'true' if client is actively mining new blocks.

**Parameters**

none.

Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.mining()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.hashrate

[index.js:vap_hashrate](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of hashes per second that the node is mining with.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.hashrate()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.gasPrice

[index.js:vap_gasPrice](../../../blob/master/src/index.js Source code on GitHub")

Returns the current price per gas in wei.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.gasPrice()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.accounts

[index.js:vap_accounts](../../../blob/master/src/index.js Source code on GitHub")

Returns a list of addresses owned by client.

**Parameters**

none.

Result an **Array** of strings.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.accounts()
.then((result) => {
  /*
  // result

  ["0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78"]
  */
})
.catch((error) => {
  // null
});
```


### vap.blockNumber

[index.js:vap_blockNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of most recent block.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.blockNumber()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getBalance

[index.js:vap_getBalance](../../../blob/master/src/index.js Source code on GitHub")

Returns the balance of the account of given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getBalance("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getStorageAt

[index.js:vap_getStorageAt](../../../blob/master/src/index.js Source code on GitHub")

Returns the value from a storage position at a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.
-   `number_2` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getStorageAt("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.getTransactionCount

[index.js:vap_getTransactionCount](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions *sent* from an address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getTransactionCount("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getBlockTransactionCountByHash

[index.js:vap_getBlockTransactionCountByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions in a block from a block matching the given block hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getBlockTransactionCountByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getBlockTransactionCountByNumber

[index.js:vap_getBlockTransactionCountByNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions in a block from a block matching the given block number.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getBlockTransactionCountByNumber(<BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getUncleCountByBlockHash

[index.js:vap_getUncleCountByBlockHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of uncles in a block from a block matching the given block hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getUncleCountByBlockHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getUncleCountByBlockNumber

[index.js:vap_getUncleCountByBlockNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of uncles in a block from a block matching the given block number.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getUncleCountByBlockNumber(<BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getCode

[index.js:vap_getCode](../../../blob/master/src/index.js Source code on GitHub")

Returns code at a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getCode("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.sign

[index.js:vap_sign](../../../blob/master/src/index.js Source code on GitHub")

Signs data with a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `hash_1` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.sign("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.sendTransaction

[index.js:vap_sendTransaction](../../../blob/master/src/index.js Source code on GitHub")

Creates new message call transaction or a contract creation, if the data field contains code.

**Parameters**

-   `object_0` **Object** -- A raw transaction object.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.sendTransaction({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  to: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '45000000',
  gas: '3000000',
  data: '0x',
})
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.sendRawTransaction

[index.js:vap_sendRawTransaction](../../../blob/master/src/index.js Source code on GitHub")

Creates new message call transaction or a contract creation for signed transactions.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.sendRawTransaction("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45"
  */
})
.catch((error) => {
  // null
});
```


### vap.call

[index.js:vap_call](../../../blob/master/src/index.js Source code on GitHub")

Executes a new message call immediately without creating a transaction on the block chain.

**Parameters**

-   `object_0` **Object** -- A call transaction object.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.call({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  to: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '45000000',
  gas: '3000000',
  data: '0x',
}, <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.estimateGas

[index.js:vap_estimateGas](../../../blob/master/src/index.js Source code on GitHub")

Makes a call or transaction, which won't be added to the blockchain and returns the used gas, which can be used for estimating the used gas.

**Parameters**

-   `object_0` **Object** -- An estimate transaction object.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.estimateGas({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '0',
  gas: '30000',
  data: '0x',
}, <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.getBlockByHash

[index.js:vap_getBlockByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a block by hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `bool_1` **Boolean** -- A boolean value "true" or "false".


Result Block **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getBlockByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", true)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getBlockByNumber

[index.js:vap_getBlockByNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a block by block number.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `bool_1` **Boolean** -- A boolean value "true" or "false".


Result Block **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getBlockByNumber(<BN ...>, true)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getTransactionByHash

[index.js:vap_getTransactionByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the information about a transaction requested by transaction hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result Transaction **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getTransactionByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getTransactionByBlockHashAndIndex

[index.js:vap_getTransactionByBlockHashAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a transaction by block hash and transaction index position.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.


Result Transaction **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getTransactionByBlockHashAndIndex("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", <BN ...>)
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getTransactionByBlockNumberAndIndex

[index.js:vap_getTransactionByBlockNumberAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a transaction by block number and transaction index position.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `number_1` **BN** -- A number quantity.


Result Transaction **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getTransactionByBlockNumberAndIndex(<BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getTransactionReceipt

[index.js:vap_getTransactionReceipt](../../../blob/master/src/index.js Source code on GitHub")

Returns the receipt of a transaction by transaction hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result receipt **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getTransactionReceipt("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  {
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "transactionIndex": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "cumulativeGasUsed": <BN ...>,
    "gasUsed": <BN ...>,
    "contractAddress": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "logs": {
    logIndex: <BN ...1>,
      blockNumber: <BN ...43533>,
      blockHash: "0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d",
      transactionHash:  "0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf",
      transactionIndex: <BN ...0>,
      address: "0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d",
      data:"0x0000000000000000000000000000000000000000000000000000000000000000",
      topics: ["0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5"]
    }
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getUncleByBlockHashAndIndex

[index.js:vap_getUncleByBlockHashAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a uncle of a block by hash and uncle index position.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.


Result Block **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getUncleByBlockHashAndIndex("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", <BN ...>)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getUncleByBlockNumberAndIndex

[index.js:vap_getUncleByBlockNumberAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a uncle of a block by number and uncle index position.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `number_1` **BN** -- A number quantity.


Result Block **Object**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getUncleByBlockNumberAndIndex(<BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### vap.getCompilers

[index.js:vap_getCompilers](../../../blob/master/src/index.js Source code on GitHub")

Returns a list of available compilers in the client.

**Parameters**

none.

Result an **Array** of strings.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getCompilers()
.then((result) => {
  /*
  // result

  ["0.1.6"]
  */
})
.catch((error) => {
  // null
});
```


### vap.compileLLL

[index.js:vap_compileLLL](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled LLL code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.compileLLL("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.compileSolidity

[index.js:vap_compileSolidity](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled solidity code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.compileSolidity("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.compileSerpent

[index.js:vap_compileSerpent](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled serpent code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.compileSerpent("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.newFilter

[index.js:vap_newFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter object, based on filter options, to notify when the state changes (logs).

**Parameters**

-   `object_0` **Object** -- An event filter object.


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.newFilter({
  fromBlock: '1',
  toBlock: new Vap.BN('45'),
  address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
  topics: ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', null],
})
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.newBlockFilter

[index.js:vap_newBlockFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter in the node, to notify when a new block arrives.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.newBlockFilter()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.newPendingTransactionFilter

[index.js:vap_newPendingTransactionFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter in the node, to notify when new pending transactions arrive.

**Parameters**

none.

Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.newPendingTransactionFilter()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.uninstallFilter

[index.js:vap_uninstallFilter](../../../blob/master/src/index.js Source code on GitHub")

Uninstalls a filter with given id. Should always be called when watch is no longer needed.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.uninstallFilter(<BN ...>)
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.getFilterChanges

[index.js:vap_getFilterChanges](../../../blob/master/src/index.js Source code on GitHub")

Polling method for a filter, which returns an array of logs which occurred since last poll.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result an **Array** of filter change objects..

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getFilterChanges(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### vap.getFilterLogs

[index.js:vap_getFilterLogs](../../../blob/master/src/index.js Source code on GitHub")

Returns an array of all logs matching filter with given id.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result an **Array** of filter change objects..

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getFilterLogs(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### vap.getLogs

[index.js:vap_getLogs](../../../blob/master/src/index.js Source code on GitHub")

Returns an array of all logs matching a given filter object.

**Parameters**

-   `object_0` **Object** -- An event filter object.


Result **Array**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getLogs({
  fromBlock: '1',
  toBlock: new Vap.BN('45'),
  address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
  topics: ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', null],
})
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### vap.getWork

[index.js:vap_getWork](../../../blob/master/src/index.js Source code on GitHub")

Returns the hash of the current block, the seedHash, and the boundary condition to be met ("target").

**Parameters**

none.

Result an **Array** of strings.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.getWork()
.then((result) => {
  /*
  // result

  ["0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"]
  */
})
.catch((error) => {
  // null
});
```


### vap.submitWork

[index.js:vap_submitWork](../../../blob/master/src/index.js Source code on GitHub")

Used for submitting a proof-of-work solution.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.
-   `hash_1` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `hash_2` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.submitWork("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.submitHashrate

[index.js:vap_submitHashrate](../../../blob/master/src/index.js Source code on GitHub")

Used for submitting mining hashrate.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.
-   `data_1` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.submitHashrate("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.db_putString

[index.js:db_putString](../../../blob/master/src/index.js Source code on GitHub")

Stores a string in the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.
-   `data_2` **String** -- String data.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.db_putString("0.1.6", "0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.db_getString

[index.js:db_getString](../../../blob/master/src/index.js Source code on GitHub")

Returns string from the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.db_getString("0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### vap.db_putHex

[index.js:db_putHex](../../../blob/master/src/index.js Source code on GitHub")

Stores binary data in the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.
-   `data_2` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.db_putHex("0.1.6", "0.1.6", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.db_getHex

[index.js:db_getHex](../../../blob/master/src/index.js Source code on GitHub")

Returns binary data from the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.


Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.db_getHex("0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_post

[index.js:shh_post](../../../blob/master/src/index.js Source code on GitHub")

Sends a whisper message.

**Parameters**

-   `object_0` **Object** -- An SHH post object.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_post({
  from: '0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1',
  to: '0x3e245533f97284d442460f2998cd41858798ddf04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a0d4d661997d3940272b717b1',
  topics: ['0x776869737065722d636861742d636c69656e74', '0x4d5a695276454c39425154466b61693532'],
  payload: '0x7b2274797065223a226d6',
  priority: '65',
  ttl: '80',
})
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_version

[index.js:shh_version](../../../blob/master/src/index.js Source code on GitHub")

Returns the current whisper protocol version.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_version()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_newIdentity

[index.js:shh_newIdentity](../../../blob/master/src/index.js Source code on GitHub")

Creates new whisper identity in the client.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_newIdentity()
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_hasIdentity

[index.js:shh_hasIdentity](../../../blob/master/src/index.js Source code on GitHub")

Checks if the client hold the private keys for a given identity.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_hasIdentity("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_newGroup

[index.js:shh_newGroup](../../../blob/master/src/index.js Source code on GitHub")

Creates a new SHH group.

**Parameters**

none.

Result **String**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_newGroup()
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_addToGroup

[index.js:shh_addToGroup](../../../blob/master/src/index.js Source code on GitHub")

Adds an identity to an SHH group.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_addToGroup("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_newFilter

[index.js:shh_newFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates filter to notify, when client receives whisper message matching the filter options.

**Parameters**

-   `object_0` **Object** -- An SHH filter object.


Result **BN**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_newFilter({
   topics: ['0x12341234bf4b564f'],
   to: '0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1'
})
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_uninstallFilter

[index.js:shh_uninstallFilter](../../../blob/master/src/index.js Source code on GitHub")

Uninstalls a filter with given id. Should always be called when watch is no longer needed.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **Boolean**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_uninstallFilter(<BN ...>)
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_getFilterChanges

[index.js:shh_getFilterChanges](../../../blob/master/src/index.js Source code on GitHub")

Polling method for whisper filters. Returns new messages since the last call of this method.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["SHHFilterChange"]**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_getFilterChanges(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "from": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "to": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "expiry": <BN ...>,
    "ttl": <BN ...>,
    "sent": <BN ...>,
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "payload": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "workProved": <BN ...>
  }]
  */
})
.catch((error) => {
  // null
});
```


### vap.shh_getMessages

[index.js:shh_getMessages](../../../blob/master/src/index.js Source code on GitHub")

Get all messages matching a filter. Unlike 'shh_getFilterChanges' this returns all messages.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["SHHFilterChange"]**.

```js
const Vap = require('vapjs');
const vap = new Vap(new Vap.HttpProvider('http://localhost:8545'));

vap.shh_getMessages(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "from": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "to": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "expiry": <BN ...>,
    "ttl": <BN ...>,
    "sent": <BN ...>,
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "payload": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "workProved": <BN ...>
  }]
  */
})
.catch((error) => {
  // null
});
```


## Browser Builds

`vapjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/vapjs.js` or `dist/vapjs.min.js` directly into an HTML file to start using this module. Note, an `Vap` object is made available globally.

```html
<script type="text/javascript" src="vapjs.min.js"></script>
<script type="text/javascript">
Vap(...);
</script>
```

## Webpack Figures

Minified: **103 kB**.

```
Hash: b267c64f72c936248871
Version: webpack 2.1.0-beta.15
Time: 928ms
       Asset    Size  Chunks             Chunk Names
    vapjs.js  235 kB       0  [emitted]  main
vapjs.js.map  291 kB       0  [emitted]  main
  [24] multi main 28 bytes {0} [built]
    + 24 hidden modules

Hash: b7b0fe38a80ebbca42e2
Version: webpack 2.1.0-beta.15
Time: 3373ms
       Asset    Size  Chunks             Chunk Names
vapjs.min.js  103 kB       0  [emitted]  main
  [24] multi main 28 bytes {0} [built]
    + 24 hidden modules
```

Note, even though `vapjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

## Other Awesome Modules, Tools and Frameworks

### **Vapory Foundation**
  - [web3.js](https://github.com/vaporyco/web3.js) -- the original Vapory JS swiss army knife
  - [vaporyjs](https://github.com/vaporycojs) -- critical vapory javascript infrastructure/community
  - [browser-solidity](https://vapory.github.io/browser-solidity) -- an in browser Solidity IDE
  - [mists](https://github.com/vaporyco/mist/releases) -- the official Vapory wallet and browser

### Nodes
  - [gvap](https://github.com/vaporyco/go-vapory) Go-Vapory (Vapory Foundation)
  - [parity](https://github.com/ethcore/parity) Rust-Vapory build in Rust (Vapcore)
  - [testrpc](https://github.com/vaporycojs/testrpc) JS-Testing Node (Vaporyjs)

### Testing
  - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
  - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
  - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
  - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
  - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts
  - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework

### Wallets
  - [mist](https://github.com/vaporyco/mist/releases) -- turns your browser into an Vapory enabled browser =D
  - [gvap](https://github.com/vaporyco/go-vapory) -- standard Vapory wallet
  - [parity](https://github.com/ethcore/parity) -- standard Vapory wallet
  - [vapors-wallet](https://github.com/vapors-io/vapors-wallet) -- an amazingly small Vapory wallet
  - [metamask](https://metamask.io/) -- turns your browser into an Vapory enabled browser =D, a one click install **Chrome Extention**
  - [vap-lightwallet](https://github.com/ConsenSys/vap-lightwallet) -- an HD wallet built in Javascript

## Our Relationship with Vapory & VaporyJS

 We would like to mention that we are not in any way affiliated with the Vapory Foundation or `vaporyjs`. However, we love the work they do and work with them often to make Vapory great! Our aim is to support the Vapory ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `vaporyjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.

## Special Thanks

`vapjs` was built by a strong community of Vapory developers. A special thanks to:

  - [Fabian Vogelsteller](https://twitter.com/feindura?lang=en) - for his work on `Mist` and `web3.js`
  - [Tim Coulter](https://github.com/tcoulter) - for his work on `TestRPC` and `Truffle`
  - [Aaron Davis](https://github.com/kumavis) - for his guidence and work on `MetaMask` and `vaporyjs`
  - [Richard Moore](https://github.com/ricmoo) - for his work on `vapors-io` and `vapors-wallet` from which so much of `vapjs` is build from
  - [Karl Floersch](https://twitter.com/karl_dot_tech?lang=en) - for his guidence and support
  - [Martin Betsy](https://github.com/wanderer) - for his work on `vaporyjs`
  - [Alex Beregszaszi](https://github.com/axic) - for his work on `vaporyjs`
  - [Vitalik Buterin](https://twitter.com/VitalikButerin) - for creating `Vapory`
