const VapQuery = require('vapjs-query');
const VapFilter = require('vapjs-filter');
const VapContract = require('vapjs-contract');
const HttpProvider = require('vapjs-provider-http');
const abi = require('vapjs-abi');
// const getTxSuccess = require('vapjs-transaction-success'); // eslint-disable-line
const unit = require('vapjs-unit');
const keccak256 = require('js-sha3').keccak_256;
const toBN = require('number-to-bn');
const BN = require('bn.js');
const utils = require('vapjs-util');
const getTransactionSuccess = require('./lib/getTransactionSuccess.js');

module.exports = Vap;

/**
 * Returns the vapjs Vap instance.
 *
 * @method Vap
 * @param {Object} cprovider the web3 standard provider object
 * @param {Object} options the Vap options object
 * @returns {Object} vap Vap object instance
 * @throws if the new flag is not used in construction
 */

function Vap(cprovider, options) {
  if (!(this instanceof Vap)) { throw new Error('[vapjs] the Vap object requires you construct it with the "new" flag (i.e. `const vap = new Vap(...);`).'); }
  const self = this;
  self.options = options || {};
  const query = new VapQuery(cprovider, self.options.query);
  Object.keys(Object.getPrototypeOf(query)).forEach((methodName) => {
    self[methodName] = (...args) => query[methodName].apply(query, args);
  });
  self.filter = new VapFilter(query, self.options.query);
  self.contract = new VapContract(query, self.options.query);
  self.currentProvider = query.rpc.currentProvider;
  self.setProvider = query.setProvider;
  self.getTransactionSuccess = getTransactionSuccess(self);
}

Vap.BN = BN;
Vap.isAddress = (val) => utils.isHexString(val, 20);
Vap.keccak256 = (val) => `0x${keccak256(val)}`;
Vap.Buffer = Buffer;
Vap.isHexString = utils.isHexString;
Vap.fromWei = unit.fromWei;
Vap.toWei = unit.toWei;
Vap.toBN = toBN;
Vap.abi = abi;
Vap.fromAscii = utils.fromAscii;
Vap.toAscii = utils.toAscii;
Vap.fromUtf8 = utils.fromUtf8;
Vap.toUtf8 = utils.toUtf8;
Vap.HttpProvider = HttpProvider;
