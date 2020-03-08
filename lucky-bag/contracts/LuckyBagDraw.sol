pragma solidity ^0.4.24;

import "./RNGCore.sol";
import "./LuckyBagToken.sol";

contract LuckyBagDraw {

  using SafeMath for uint;

  uint256 constant private ONE_HUNDRED_PCT = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
  uint256 constant private EIGHTY_PCT = 92634089237316195423570985008687907853269984665640564039457584007913129639935;
  uint256 constant private SIXTY_PCT = 69475089237316195423570985008687907853269984665640564039457584007913129639935;
  uint256 constant private FORTY_PCT = 46317089237316195423570985008687907853269984665640564039457584007913129639935;
  uint256 constant private TWENTY_PCT = 23158089237316195423570985008687907853269984665640564039457584007913129639935;

  address private owner;
  // map of untied lucky bag owners' addresses to map of block seeds
  // make private
  mapping(address => mapping(uint256 => uint256)) public untiedBagSeeds;
  // map of generated unused seed blocks to the number of times it has been generated
  // (each seed block should only be generated and used once)
  // make private
  mapping(uint256 => uint256) public seedBlockCount;
  // map of untied lucky bag owners' addresses to count of their currently untied bags
  // make private
  mapping(address => uint256) public currentUntiedBagCount;
  // map of untied lucky bag owners' addresses to count of their cumulative untied bags
  // make private
  mapping(address => uint256) public cumulativeUntiedBagCount;
  // map of untied lucky bag owners' addresses to count of their opened bags
  // make private
  mapping(address => uint256) public openedBagCount;
  // map of opened lucky bag owners' addresses to array of claimed prizes
  // make private
  mapping(address => string[]) public prizeRecord;
  RNGCore private _rng;
  LuckyBagToken private _luckyBagToken;

  event bagUntied(uint256 seed, address sender, uint256 untiedBags, uint256 blockNum);
  event seedBlockConflict(uint256 oldSeed, uint256 newSeed, address sender, uint256 bagIteration, uint256 blockNum);
  event bagOpened(uint256 seed, uint256 ethSent, string itemSent, uint256 openedBags, address recipient, uint256 blockNum);

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor(address _luckyBagTokenAddress, address _rngAddress) public {

    owner = msg.sender;
    _rng = RNGCore(_rngAddress);
    _luckyBagToken = LuckyBagToken(_luckyBagTokenAddress);
  }

  // remove
  function primeRNG() public {
    _rng.nextSeed();
  }

  function untieBag() public {

    uint256 futureBlock;
    uint256 untiedBags;

    _luckyBagToken.transferFrom(msg.sender, address(this), 1);

    futureBlock = _rng.nextSeed();
    seedBlockCount[futureBlock] = (seedBlockCount[futureBlock]).add(1);

    untiedBags = cumulativeUntiedBagCount[msg.sender];
    untiedBagSeeds[msg.sender][untiedBags] = futureBlock;
    currentUntiedBagCount[msg.sender] = (currentUntiedBagCount[msg.sender]).add(1);
    cumulativeUntiedBagCount[msg.sender] = (cumulativeUntiedBagCount[msg.sender]).add(1);

    emit bagUntied(futureBlock, msg.sender, currentUntiedBagCount[msg.sender], block.number);
  }

  function openBag() public {

    require(currentUntiedBagCount[msg.sender] > 0);

    uint256 bagIteration = openedBagCount[msg.sender];
    uint256 seedBlock = untiedBagSeeds[msg.sender][bagIteration];
    uint256 draw;
    uint256 ethSent = 0;
    string memory itemSent = "none";

    if (seedBlockCount[seedBlock] > 1) {

      seedBlockCount[seedBlock] = (seedBlockCount[seedBlock]).sub(1);

      uint256 futureBlock = _rng.nextSeed();
      untiedBagSeeds[msg.sender][bagIteration] = futureBlock;
      seedBlockCount[futureBlock] = (seedBlockCount[futureBlock]).add(1);

      emit seedBlockConflict(seedBlock, futureBlock, msg.sender, bagIteration, block.number);
      return;
    }

    _rng.nextSeed();

    if (_rng.getUint(seedBlock) == 0) {
      return;
    } else {
      draw = _rng.getUint(seedBlock);
    }

    if (draw < TWENTY_PCT) {

      msg.sender.transfer(1 ether);
      ethSent = 1;
      itemSent = "1 ETH";

    } else if (draw < FORTY_PCT) {

      // item1.transfer(msg.sender, 1);
      itemSent = "Item 1";

    } else if (draw < EIGHTY_PCT) {

      // item2.transfer(msg.sender, 1);
      itemSent = "Item 2";

    } else if (draw < ONE_HUNDRED_PCT) {

      // item3.transfer(msg.sender, 1);
      itemSent = "Item 3";
    }

    openedBagCount[msg.sender] = (openedBagCount[msg.sender]).add(1);
    currentUntiedBagCount[msg.sender] = (currentUntiedBagCount[msg.sender]).sub(1);
    prizeRecord[msg.sender].push(itemSent);

    emit bagOpened(seedBlock, ethSent, itemSent, openedBagCount[msg.sender], msg.sender, block.number);
  }

  function getPrizeRecordLength(address _prizeOwner) public view returns (uint256) {
    return prizeRecord[_prizeOwner].length;
  }

  function() public payable {}

  // remove
  function terminate() external restricted {
    selfdestruct(msg.sender);
  }
}
