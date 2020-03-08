pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Item.sol";

contract Character {

  using SafeMath for uint16;

  address public owner;
  address public approved;

  Item[] public items;

  string public stance;
  string public combatType;
  string public doors;
  string public lowHp;
  string public lowFood;

  string[3] private stanceMap = ["One", "Two", "Three"];
  string[3] private combatTypeMap = ["One", "Two", "Three"];
  string[3] private doorsMap = ["One", "Two", "Three"];
  string[3] private lowHpMap = ["One", "Two", "Three"];
  string[3] private lowFoodMap = ["One", "Two", "Three"];

  uint16 public maxHp;
  uint16 public hp;
  uint16 public attack;
  uint16 public defense;
  uint16 public intelligence;
  uint16 public speed;
  uint16 public vision;
  uint16 public goldFind;
  uint16 public luck;

  modifier approvedOnly() {
    if (msg.sender == approved) _;
  }

  constructor(
    address _owner,
    address _approved,
    address[] _items,
    // stance, combatType, doors, lowHp, and _lowFood
    uint8[] _playstyle,
    // maxHp, attack, defense, intelligence, speed, vision, goldFind, lucky
    uint16[8] _stats) public {

    owner = _owner;
    approved = _approved;
    stance = stanceMap[_playstyle[0]];
    combatType = combatTypeMap[_playstyle[1]];
    doors = doorsMap[_playstyle[2]];
    lowHp = lowHpMap[_playstyle[3]];
    lowFood = lowFoodMap[_playstyle[4]];
    maxHp = _stats[0];
    hp = maxHp;
    attack = _stats[1];
    defense = _stats[2];
    intelligence = _stats[3];
    speed = _stats[4];
    vision = _stats[5];
    goldFind = _stats[6];
    luck = _stats[7];

    for (uint256 i = 0; i < _items.length; i++) {
      items.push(Item(_items[i]));
    }
  }

  function setOwner(address _owner) public approvedOnly {
    owner = _owner;
  }

  function setStats(uint16[8] _stats) public approvedOnly {

    maxHp = _stats[0];
    hp = maxHp;
    attack = _stats[1];
    defense = _stats[2];
    intelligence = _stats[3];
    speed = _stats[4];
    vision = _stats[5];
    goldFind = _stats[6];
    luck = _stats[7];
  }

  function decreaseHp(uint16 _delta) public approvedOnly {
    hp = uint16((hp.sub(_delta) > maxHp) ? maxHp : hp.sub(_delta));
  }
}
