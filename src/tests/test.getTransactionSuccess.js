const assert = require('chai').assert;
const TestRPC = require('vaporyjs-testrpc');
const provider = TestRPC.provider();
const Vap = require('../index.js');

describe('getTransactionSuccess.js', () => {
  it('should get tx receipt properly', (done) => {
    const vap = new Vap(provider);

    vap.accounts((accErr, accounts) => {
      assert.isNotOk(accErr);

      const defaultTxObject = {
        from: accounts[0],
        to: accounts[1],
        value: (new Vap.BN('4500')),
        data: '0x',
        gas: 300000,
      };

      vap.sendTransaction(defaultTxObject, (txErr, txHash) => {
        assert.isNotOk(txErr);

        vap.getTransactionSuccess(txHash, (succErr, successResult) => {
          assert.isNotOk(succErr);
          assert.isOk(successResult);

          done();
        });
      });
    });
  });

  it('should trigger errors', (done) => {
    const vap = new Vap(provider);

    vap.getTransactionSuccess(33, (succErr) => {
      assert.isOk(succErr);

      done();
    });
  });

  it('should timeout', (done) => {
    const vap = new Vap(provider, { timeout: 1000, interval: 100 });

    vap.getTransactionSuccess('0xec66b273967d58c9611ae8dace378d550ccbd453e9815c78f8d1ffe5bb2aff1c', (succErr) => {
      assert.isOk(succErr);

      done();
    });
  });
});
