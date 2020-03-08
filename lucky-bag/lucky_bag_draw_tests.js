let BigNumber = require("../bin/bignumber.js");
let watchEvents = require("../bin/watch_events.js");
let promisify = require("../bin/promisify.js");
const LuckyBagToken = artifacts.require("LuckyBagToken");
const LuckyBagDraw = artifacts.require("LuckyBagDraw");

async function createDefaultTxObj(defaultAccount) {

  let defaultTxObj, txHash, gasPrice, res;

  res = await promisify(cb => web3.eth.getGasPrice(cb));
  gasPrice = res;
  gasPrice = Number((new BigNumber(gasPrice)).toString(10));

  return {
           from: defaultAccount,
           gasPrice: gasPrice
         };
}

let tokenAddress = "0xf9d15431d8dc627716f9585672290b9573044663";
let drawAddress = "0x53a338b7f2d9f42d565c02b6f4479ba7ed7f1235";

describe("LuckyBagToken", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let instanceToken = LuckyBagToken.at(tokenAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(tokenAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes mint() test cases", async function() {

    let bal;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    defaultTxObj = await createDefaultTxObj(accnts[0]);

    for (let i = 0; i < 4; i++) {

      bal = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      res = await instanceToken.mint.sendTransaction(accnts[i + 1], i + 1, defaultTxObj);

      res = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      assert.equal(res, bal + i + 1, "Bag address " + i);
    }
  });

  it("passes approve() test cases", async function() {

    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);

      res = await instanceToken.approve.sendTransaction(accnts[5], 1000, defaultTxObj);

      res = await instanceToken.allowance.call(accnts[i + 1], accnts[5], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 1000, "Bag address " + i);
    }
  });

  it("passes transferFrom() test cases", async function() {

    let bal, bal5;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[5]);

      bal = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      bal5 = await instanceToken.balanceOf.call(accnts[5], defaultTxObj);
      bal5 = Number((new BigNumber(bal5)).toString(10));

      res = await instanceToken.transferFrom.sendTransaction(accnts[i + 1], accnts[5], 1, defaultTxObj)

      res = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "Bag address " + i);

      res = await instanceToken.balanceOf.call(accnts[5], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal5 + 1, "Bag address 5, from " + i);
    }
  });
});

describe("LuckyBagDraw", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let instanceToken = LuckyBagToken.at(tokenAddress);
  let instanceDraw = LuckyBagDraw.at(drawAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(drawAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes untieBag() test cases", async function() {

    let futureBlock, bal, balDraw;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    res = await promisify(cb => web3.eth.getGasPrice(cb));
    gasPrice = Number((new BigNumber(res)).toString(10));

    res = await instanceDraw.sendTransaction({
      from: accnts[0],
      gasPrice: gasPrice,
      value: web3.toWei(5, "ether")
    });

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);

      res = await instanceToken.mint.sendTransaction(accnts[i + 1], 2, defaultTxObj);

      res = await instanceToken.approve.sendTransaction(drawAddress, 1, defaultTxObj);

      bal = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));

      balDraw = await instanceToken.balanceOf.call(drawAddress, defaultTxObj);
      balDraw = Number((new BigNumber(balDraw)).toString(10));

      res = await instanceDraw.untieBag.sendTransaction(defaultTxObj);

      /*
      res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
      console.log("Gas used in untieBag() for address " + accnts[i + 1] + " : " + res["gasUsed"]);
      */

      res = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "Bal, account " + i);

      res = await instanceToken.balanceOf.call(drawAddress, defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, balDraw + 1, "Bal draw, from " + i);
    }

    res = await instanceToken.approve.sendTransaction(drawAddress, 1, defaultTxObj);
    res = await instanceDraw.untieBag.sendTransaction(defaultTxObj);

    /*
    res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
    console.log("Gas used in untieBag() for address " + accnts[4] + " : " + res["gasUsed"]);
    */

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      res = await instanceDraw.currentUntiedBagCount.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));

      if (i == 3) {
        assert.equal(res, 2, "Bag address " + i);
      } else {
        assert.equal(res, 1, "Bag address " + i);
      }

      futureBlock = await instanceDraw.untiedBagSeeds.call(accnts[i + 1], 0, defaultTxObj);

      res = await instanceDraw.seedBlockCount.call(futureBlock, defaultTxObj);
      assert.equal(res, 1, "Seed block " + res);
    }
  });

  it("passes openBag() test cases", async function() {

    let futureBlocks = [];
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);

      res = await instanceToken.approve.sendTransaction(drawAddress, 1, defaultTxObj);
      res = await instanceDraw.untieBag.sendTransaction(defaultTxObj);

      /*
      res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
      console.log("Gas used in untieBag() for address " + accnts[i + 1] + " : " + res["gasUsed"]);
      */

      res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);
      res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);
      res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);

      res = await instanceDraw.openedBagCount.call(accnts[i + 1], defaultTxObj);
      res = await instanceDraw.untiedBagSeeds.call(accnts[i + 1], res, defaultTxObj);
      futureBlocks.push(res);

      res = await instanceDraw.openedBagCount.call(accnts[i + 1], defaultTxObj);
      res = await instanceDraw.untiedBagSeeds.call(accnts[i + 1], res, defaultTxObj);
      // console.log("Untied bag address " + i + " seedBlock: " + res);

      res = await instanceDraw.openBag.sendTransaction(defaultTxObj);

      /*
      res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
      console.log("Gas used in openBag() for address " + accnts[i + 1] + " : " + res["gasUsed"]);
      */

      if (i == 2) {

        res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);

        /*
        res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
        console.log("Gas used in primeRNG() for address " + accnts[i + 1] + " : " + res["gasUsed"]);

        res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);
        res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
        console.log("Gas used in primeRNG() for address " + accnts[i + 1] + " : " + res["gasUsed"]);

        res = await instanceDraw.primeRNG.sendTransaction(defaultTxObj);
        res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
        console.log("Gas used in primeRNG() for address " + accnts[i + 1] + " : " + res["gasUsed"]);
        */

        res = await instanceDraw.openBag.sendTransaction(defaultTxObj);

        /*
        res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
        console.log("Gas used in openBag() for address " + accnts[i + 1] + " : " + res["gasUsed"]);
        */
      }

      res = await instanceDraw.currentUntiedBagCount.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));

      if (i == 3) {
        assert.equal(res, 2, "Untied bag address " + i);
      } else if (i == 2) {
        assert.equal(res, 0, "Untied bag address " + i);
      } else {
        assert.equal(res, 1, "Untied bag address " + i);
      }

      res = await instanceDraw.seedBlockCount.call(futureBlocks[i], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 1, "Seed block " + i);

      res = await instanceDraw.openedBagCount.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));

      if (i == 2) {
        assert.equal(res, 2, "Opened bag address " + i);
      } else {
        assert.equal(res, 1, "Opened bag address " + i);
      }
    }
  });

  it("passes prizeRecord() test cases", async function() {

    let prizeLen;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      prizeLen = await instanceDraw.getPrizeRecordLength.call(accnts[i + 1], defaultTxObj);

      for (let j = 0; j < prizeLen; j++) {

        res = await instanceDraw.prizeRecord.call(accnts[i + 1], j, defaultTxObj);
        console.log(res);
        assert.typeOf(res, "string", "Prize is a string");
      }
    }
  });
});
