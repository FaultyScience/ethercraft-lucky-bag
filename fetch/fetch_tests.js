let BigNumber = require("../bin/bignumber.js");
let watchEvents = require("../bin/watch_events.js");
let promisify = require("../bin/promisify.js");
const Chainmonsters = artifacts.require("Chainmonsters");
const CornToken = artifacts.require("CornToken");
const Fetch = artifacts.require("Fetch");

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

let monstersAddress = "0x39937fb85c934a3761079961c41b610dba635ef1";
let cornAddress = "0x094cc28fc19f78ebed2f8338de5aa689005a9fd8";
let fetchAddress = "0x8443a6ae85b8ff74c578b759fa20c75b3fc8315a";

describe("Chainmonsters", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let instanceToken = Chainmonsters.at(monstersAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(monstersAddress, cb));
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
      assert.equal(res, 1, "Bag address " + i);

      res = await instanceToken.ownerOf.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Bag address " + i);
    }
  });

  it("passes approve() test cases", async function() {

    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);

      res = await instanceToken.approve.sendTransaction(accnts[5], i + 1, defaultTxObj)

      res = await instanceToken.getApproved.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[5], "Bag address " + i);
    }
  });

  it("passes safeTransferFrom() test cases", async function() {

    let bal, bal5;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[5]);

      bal = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      bal5 = await instanceToken.balanceOf.call(accnts[5], defaultTxObj);
      bal5 = Number((new BigNumber(bal5)).toString(10));

      res = await instanceToken.safeTransferFrom.sendTransaction(accnts[i + 1], accnts[5], i + 1, defaultTxObj)

      res = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "Bag address " + i);

      res = await instanceToken.ownerOf.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[5], "Bag address " + i);

      res = await instanceToken.balanceOf.call(accnts[5], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal5 + 1, "Bag address 5, from " + i);
    }
  });
});

describe("CornToken", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let cornToken = CornToken.at(cornAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(cornAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes mint() test cases", async function() {

    let bal;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    defaultTxObj = await createDefaultTxObj(accnts[0]);

    res = await cornToken.mint.sendTransaction(accnts[0], 100000000000000000000, defaultTxObj);
    res = await cornToken.balanceOf.call(accnts[0], defaultTxObj);
    assert.equal(res, 100000000000000000000, "Account 0");
  });

  it("passes approve() test cases", async function() {

    let accnts = await promisify(cb => web3.eth.getAccounts(cb));
    defaultTxObj = await createDefaultTxObj(accnts[0]);

    for (let i = 0; i < 4; i++) {

      res = await cornToken.approve.sendTransaction(accnts[i + 1], 100000000000000000000, defaultTxObj);

      res = await cornToken.allowance.call(accnts[0], accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 100000000000000000000, "Bag address " + i);
    }

    res = await cornToken.approve.sendTransaction(fetchAddress, 100000000000000000000, defaultTxObj);
  });

  it("passes transfer() test cases", async function() {

    let bal, bal0;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[0]);

      bal = await cornToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      bal0 = await cornToken.balanceOf.call(accnts[0], defaultTxObj);
      bal0 = Number((new BigNumber(bal0)).toString(10));
      // console.log(bal0);
      res = await cornToken.allowance.call(accnts[0], accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      // console.log(res);

      res = await cornToken.transfer.sendTransaction(accnts[i + 1], 1000000000000000000, defaultTxObj);

      res = await cornToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal + 1000000000000000000, "Bag address " + i);

      res = await cornToken.balanceOf.call(accnts[0], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal0 - 1000000000000000000, "Bag address 0, to " + i);
    }
  });
});

describe("Fetch", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let instanceToken = Chainmonsters.at(monstersAddress);
  let instanceCorn = CornToken.at(cornAddress);
  let instanceFetch = Fetch.at(fetchAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(fetchAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes sendTokenToFetch() test cases", async function() {

    let tokenID, futureBlock, bal, newOwner;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenID = 77 * (i + 1);

      res = await instanceToken.mint.sendTransaction(accnts[i + 1], tokenID, defaultTxObj);
      res = await instanceToken.approve.sendTransaction(fetchAddress, tokenID, defaultTxObj);

      bal = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));

      res = await instanceFetch.sendTokenToFetch.sendTransaction(tokenID, defaultTxObj);

      res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
      console.log("Gas used in sendTokenToFetch() for token " + tokenID + " : " + res["gasUsed"]);

      res = await instanceToken.ownerOf.call(tokenID, defaultTxObj);
      assert.equal(res, fetchAddress, "Owner " + i);

      res = await instanceToken.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "New balance, account " + i);
    }

    res = await instanceToken.mint.sendTransaction(accnts[4], 1022, defaultTxObj);
    res = await instanceToken.approve.sendTransaction(fetchAddress, 1022, defaultTxObj);

    res = await instanceToken.mint.sendTransaction(accnts[4], 1035, defaultTxObj);
    res = await instanceToken.approve.sendTransaction(fetchAddress, 1035, defaultTxObj);

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenID = 77 * (i + 1);

      res = await instanceFetch.tokensFetching.call(tokenID, defaultTxObj);
      assert.equal(res, true, "Token " + tokenID + " fetching");

      futureBlock = await instanceFetch.fetchSeeds.call(tokenID, defaultTxObj);
      // console.log("Seed for token " + tokenID + ": " + futureBlock);
    }

    tokenID = 1022;
    res = await instanceFetch.tokensFetching.call(tokenID, defaultTxObj);
    assert.equal(res, false, "Token " + tokenID + " fetching");

    tokenID = 1035;
    res = await instanceFetch.sendTokenToFetch.sendTransaction(tokenID, defaultTxObj);
    res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
    console.log("Gas used in sendTokenToFetch() for token " + tokenID + " : " + res["gasUsed"]);

    res = await instanceFetch.tokensFetching.call(tokenID, defaultTxObj);
    assert.equal(res, true, "Token " + tokenID + " fetching");
  });

  it("passes recallToken() test cases", async function() {

    let futureBlocks = [];
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));
    let corn, bal, fBal;

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenID = 77 * (i + 1);

      bal0 = await instanceCorn.balanceOf.call(accnts[0], defaultTxObj);
      bal0 = Number((new BigNumber(bal0)).toString(10));
      bal = await instanceCorn.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));

      res = await instanceFetch.recallToken.sendTransaction(tokenID, defaultTxObj);
      res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
      console.log("Gas used in recallToken() for token " + tokenID + " : " + res["gasUsed"]);

      res = await instanceToken.ownerOf.call(tokenID, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Token " + tokenID + " owner");
      res = await instanceFetch.tokensFetching.call(tokenID, defaultTxObj);
      assert.equal(res, false, "Token " + tokenID + " fetching");
      res = await instanceFetch.tokenOwners.call(tokenID, defaultTxObj);
      assert.equal(res, 0x0, "Token " + tokenID + " owner record");

      corn = await instanceFetch.mostRecentCornFetched.call(defaultTxObj);
      corn = Number((new BigNumber(corn)).toString(10));
      res = await instanceCorn.balanceOf.call(accnts[0], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal0 - corn, "Address " + (i + 1) + " fetch balance");

      res = await instanceCorn.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal + corn, "Address " + (i + 1) + " account balance");
    }

    res = await instanceFetch.primeRNG.sendTransaction(defaultTxObj);
    res = await instanceFetch.primeRNG.sendTransaction(defaultTxObj);
    res = await instanceFetch.primeRNG.sendTransaction(defaultTxObj);

    bal0 = await instanceCorn.balanceOf.call(accnts[0], defaultTxObj);
    bal0 = Number((new BigNumber(bal0)).toString(10));
    bal = await instanceCorn.balanceOf.call(accnts[4], defaultTxObj);
    bal = Number((new BigNumber(bal)).toString(10));

    res = await instanceFetch.recallToken.sendTransaction(1035, defaultTxObj);
    res = await promisify(cb => web3.eth.getTransactionReceipt(res, cb));
    console.log("Gas used in recallToken() for token " + tokenID + " : " + res["gasUsed"]);

    res = await instanceToken.ownerOf.call(1035, defaultTxObj);
    assert.equal(res, accnts[4], "Token " + 1035 + " owner");
    res = await instanceFetch.tokensFetching.call(1035, defaultTxObj);
    assert.equal(res, false, "Token " + 1035 + " fetching");
    res = await instanceFetch.tokenOwners.call(1035, defaultTxObj);
    assert.equal(res, 0x0, "Token " + 1035 + " owner record");

    corn = await instanceFetch.mostRecentCornFetched.call(defaultTxObj);
    corn = Number((new BigNumber(corn)).toString(10));
    res = await instanceCorn.balanceOf.call(accnts[0], defaultTxObj);
    res = Number((new BigNumber(res)).toString(10));
    assert.equal(res, bal0 - corn, "Address " + 4 + " fetch balance");

    res = await instanceCorn.balanceOf.call(accnts[4], defaultTxObj);
    res = Number((new BigNumber(res)).toString(10));
    assert.equal(res, bal + corn, "Address " + 4 + " account balance");
  });
});
