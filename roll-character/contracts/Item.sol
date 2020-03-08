pragma solidity ^0.4.24;

contract Item {

  address public owner;
  address public approved;

  modifier approvedOnly() {
    if (msg.sender == approved) _;
  }

  constructor(
    address _owner,
    address _approved) public {

    owner = _owner;
    approved = _approved;
  }

  function setOwner(address _owner) public approvedOnly {
    owner = _owner;
  }
}
