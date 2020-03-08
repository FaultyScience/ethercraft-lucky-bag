let BigNumber = require("../bin/bignumber.js");
let watchEvents = require("../bin/watch_events.js");
let promisify = require("../bin/promisify.js");
const ItemManager = artifacts.require("ItemManager");
const Item = artifacts.require("Item");
const CharManager = artifacts.require("CharacterManager");
const Character = artifacts.require("Character");

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

let itemManAddress = "0x09a75a1c63fa3abe7958b3933cf6089fe4e56638";
let charManAddress = "0xd859f5479212ab4d04ce1d40120caa7947e1be89";

describe("ItemManager", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res;
  let itemManager = ItemManager.at(itemManAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(itemManAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes mint() test cases", async function() {

    let bal;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    defaultTxObj = await createDefaultTxObj(accnts[0]);

    for (let i = 0; i < 4; i++) {

      bal = await itemManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      res = await itemManager.mint.sendTransaction(accnts[i + 1], i + 1, defaultTxObj);

      res = await itemManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      assert.equal(res, bal + 1, "Account " + i);

      res = await itemManager.ownerOf.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);
    }
  });

  it("passes approve() test cases", async function() {

    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);

      res = await itemManager.approve.sendTransaction(accnts[5], i + 1, defaultTxObj)

      res = await itemManager.getApproved.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[5], "Account " + i);
    }
  });

  it("passes safeTransferFrom() test cases", async function() {

    let bal, bal5;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[5]);

      bal = await itemManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      bal5 = await itemManager.balanceOf.call(accnts[5], defaultTxObj);
      bal5 = Number((new BigNumber(bal5)).toString(10));

      res = await itemManager.safeTransferFrom.sendTransaction(accnts[i + 1], accnts[5], i + 1, defaultTxObj)

      res = await itemManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "Account " + i);

      res = await itemManager.ownerOf.call(i + 1, defaultTxObj);
      assert.equal(res, accnts[5], "Account " + i);

      res = await itemManager.balanceOf.call(accnts[5], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal5 + 1, "Account 5, from " + i);
    }
  });
});

describe("CharManager", async function(accounts) {

  this.timeout(0);

  let defaultTxObj, res, instanceItem, instanceChar;
  let instanceItemManager = ItemManager.at(itemManAddress);
  let instanceCharManager = CharManager.at(charManAddress);

  it("exists", async function() {

    res = await promisify(cb => web3.eth.getCode(charManAddress, cb));
    assert((res != "0x0") && (res != "0x"));
  });

  it("passes castCharacter() test cases", async function() {

    let tokenId, items;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));
    let playstyle = [0, 0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenId = 77 * (i + 1);
      items = [];

      res = await instanceItemManager.mint.sendTransaction(accnts[i + 1], tokenId, defaultTxObj);
      res = await instanceItemManager.getItemAddress.call(tokenId, defaultTxObj);
      items.push(res);
      res = await instanceItemManager.mint.sendTransaction(accnts[i + 1], tokenId + 1, defaultTxObj);
      res = await instanceItemManager.getItemAddress.call(tokenId + 1, defaultTxObj);
      items.push(res);

      res = await instanceCharManager.mint.sendTransaction(accnts[i + 1], tokenId, items, playstyle, defaultTxObj);
      res = await instanceCharManager.getCharacter.call(tokenId, defaultTxObj);
      instanceChar = Character.at(res);

      res = await instanceChar.owner.call(defaultTxObj);
      assert.equal(res, accnts[i + 1], tokenId + " owner (Account " + i + ")");

      res = await instanceChar.stance.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " stance");
      res = await instanceChar.combatType.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " combatType");
      res = await instanceChar.doors.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " doors");
      res = await instanceChar.lowHp.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " lowHp");
      res = await instanceChar.lowFood.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " lowFood");

      res = await instanceChar.maxHp.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " maxHp");
      res = await instanceChar.hp.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " hp");
      res = await instanceChar.attack.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " attack");
      res = await instanceChar.defense.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " defense");
      res = await instanceChar.intelligence.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " intelligence");
      res = await instanceChar.speed.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " speed");
      res = await instanceChar.vision.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " vision");
      res = await instanceChar.goldFind.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " goldFind");
      res = await instanceChar.luck.call(defaultTxObj);
      assert.equal(res, 0, "Account " + i + " luck");

      /*
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
      */
    }

    /*
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
    */
  });

  it("passes rollCharacter() test cases", async function() {

    let tokenId;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenId = 77 * (i + 1);

      res = await instanceCharManager.rollCharacter.sendTransaction(tokenId, defaultTxObj);
      res = await instanceCharManager.getCharacter.call(tokenId, defaultTxObj);
      instanceChar = Character.at(res);

      res = await instanceChar.owner.call(defaultTxObj);
      assert.equal(res, accnts[i + 1], tokenId + " owner (Account " + i + ")");

      res = await instanceChar.stance.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " stance");
      res = await instanceChar.combatType.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " combatType");
      res = await instanceChar.doors.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " doors");
      res = await instanceChar.lowHp.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " lowHp");
      res = await instanceChar.lowFood.call(defaultTxObj);
      assert.equal(res, "One", "Account " + i + " lowFood");

      res = await instanceChar.maxHp.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 200, "Account " + i + " maxHp");
      res = await instanceChar.hp.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 200, "Account " + i + " hp");
      res = await instanceChar.attack.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 3, "Account " + i + " attack");
      console.log("Account " + i + " attack is: " + res);
      res = await instanceChar.defense.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 3, "Account " + i + " defense");
      console.log("Account " + i + " defense is: " + res);
      res = await instanceChar.intelligence.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 3, "Account " + i + " intelligence");
      console.log("Account " + i + " intelligence is: " + res);
      res = await instanceChar.speed.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 1, "Account " + i + " speed");
      console.log("Account " + i + " speed is: " + res);
      res = await instanceChar.vision.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 1, "Account " + i + " vision");
      console.log("Account " + i + " vision is: " + res);
      res = await instanceChar.goldFind.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 1, "Account " + i + " goldFind");
      console.log("Account " + i + " goldFind is: " + res);
      res = await instanceChar.luck.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.isAtLeast(res, 1, "Account " + i + " luck");
      console.log("Account " + i + " luck is: " + res);
    }
  });

  it("passes decreaseHp() test cases", async function() {

    let tokenId;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[0]);
      tokenId = 77 * (i + 1);

      res = await instanceCharManager.getCharacter.call(tokenId, defaultTxObj);
      instanceChar = Character.at(res);

      res = await instanceCharManager.decreaseHp.sendTransaction(5, tokenId, defaultTxObj);
      res = await instanceChar.hp.call(defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, 195, tokenId + " owned by account " + i);

      /*
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
      */
    }

    /*
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
    */
  });

  it("passes approve() test cases", async function() {

    let tokenId;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[i + 1]);
      tokenId = 77 * (i + 1);

      res = await instanceCharManager.approve.sendTransaction(accnts[5], tokenId, defaultTxObj);

      res = await instanceCharManager.getApproved.call(tokenId, defaultTxObj);
      assert.equal(res, accnts[5], "Account " + i);
    }
  });

  it("passes safeTransferFrom() test cases", async function() {

    let bal, bal5, tokenId;
    let accnts = await promisify(cb => web3.eth.getAccounts(cb));

    for (let i = 0; i < 4; i++) {

      defaultTxObj = await createDefaultTxObj(accnts[5]);
      tokenId = 77 * (i + 1);

      bal = await instanceCharManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      bal = Number((new BigNumber(bal)).toString(10));
      bal5 = await instanceCharManager.balanceOf.call(accnts[5], defaultTxObj);
      bal5 = Number((new BigNumber(bal5)).toString(10));

      res = await instanceItemManager.ownerOf.call(tokenId, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);
      res = await instanceItemManager.ownerOf.call(tokenId + 1, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);

      res = await instanceCharManager.getCharacter.call(tokenId, defaultTxObj);
      instanceChar = Character.at(res);
      res = await instanceChar.owner.call(defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);

      res = await instanceCharManager.safeTransferFrom.sendTransaction(accnts[i + 1], accnts[5], tokenId, defaultTxObj)

      res = await instanceChar.owner.call(defaultTxObj);
      assert.equal(res, accnts[5], "Account " + i);

      res = await instanceCharManager.balanceOf.call(accnts[i + 1], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal - 1, "Account " + i);

      res = await instanceCharManager.ownerOf.call(tokenId, defaultTxObj);
      assert.equal(res, accnts[5], "Account " + i);

      res = await instanceCharManager.balanceOf.call(accnts[5], defaultTxObj);
      res = Number((new BigNumber(res)).toString(10));
      assert.equal(res, bal5 + 1, "Account 5, from " + i);

      res = await instanceItemManager.ownerOf.call(tokenId, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);
      res = await instanceItemManager.ownerOf.call(tokenId + 1, defaultTxObj);
      assert.equal(res, accnts[i + 1], "Account " + i);
    }
  });
});
