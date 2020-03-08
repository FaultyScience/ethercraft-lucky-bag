pragma solidity ^0.4.24;

import "./RNGCore.sol";
import "./CornToken.sol";
import "./Chainmonsters.sol";

contract Fetch {

  using SafeMath for uint;

  address private owner;
  // map of token ID's to owners
  // make private
  mapping(uint256 => address) public tokenOwners;
  // map of token ID's to bool indicating wehther they are currently fetching
  mapping(uint256 => bool) public tokensFetching;
  // map of token ID's to fetch seeds
  // make private
  mapping(uint256 => uint256) public fetchSeeds;
  RNGCore private _rng;
  CornToken private _cornToken;
  address private _cornVault;
  Chainmonsters private _chainmonsters;
  // remove
  uint256 public mostRecentCornFetched;

  event tokenFetching(uint256 tokenID, address owner, uint256 seed, uint256 blockNum);
  event tokenRecalled(uint256 tokenID, address recipient, uint256 blockNum);
  event cornObtained(uint256 cornAmount, address recipient, uint256 blockNum);

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor(address _cornTokenAddress, address _cornVaultAddress, address _chainmonstersAddress, address _rngAddress) public {

    owner = msg.sender;
    _rng = RNGCore(_rngAddress);
    _cornToken = CornToken(_cornTokenAddress);
    _cornVault = _cornVaultAddress;
    _chainmonsters = Chainmonsters(_chainmonstersAddress);
  }

  // remove
  function primeRNG() public {
    _rng.nextSeed();
  }

  function sendTokenToFetch(uint256 _tokenID) public returns (bool) {

    if (tokensFetching[_tokenID]) { return false; }

    _chainmonsters.safeTransferFrom(msg.sender, address(this), _tokenID);
    tokensFetching[_tokenID] = true;
    tokenOwners[_tokenID] = msg.sender;
    fetchSeeds[_tokenID] = _rng.nextSeed();

    return true;

    emit tokenFetching(_tokenID, tokenOwners[_tokenID], fetchSeeds[_tokenID], block.number);
  }

  function recallToken(uint256 _tokenID) public {

    require(tokensFetching[_tokenID]);
    require(msg.sender == tokenOwners[_tokenID]);

    uint256 roll;
    uint256 cornFetched = 0;

    // _chainmonsters.approve(msg.sender, _tokenID);
    _chainmonsters.safeTransferFrom(address(this), msg.sender, _tokenID);

    emit tokenRecalled(_tokenID, msg.sender, block.number);

    tokensFetching[_tokenID] = false;
    tokenOwners[_tokenID] = 0x0;

    _rng.nextSeed();
    roll = _rng.getUint(fetchSeeds[_tokenID]).mod(20);

    if (roll < 10) {

      cornFetched = (roll.add(1)).mul(1000000000000000000);
      _cornToken.transferFrom(_cornVault, msg.sender, cornFetched);
    }

    // remove
    mostRecentCornFetched = cornFetched;

    emit cornObtained(cornFetched, msg.sender, block.number);
  }

  function onERC721Received(address,
                            address,
                            uint256,
                            bytes)
                            public pure
                            returns (bytes4) {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
  }

  // remove
  function terminate() external restricted {
    selfdestruct(msg.sender);
  }
}
