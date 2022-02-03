// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Property {
    int256 private value;
    string public ownerName;
    address public owner;

    constructor() {
        value = 0;
        owner = msg.sender;
        ownerName = "Labrador.ETH";
    }

    // constructor(int _value, string memory _ownerName) {
    //     value = _value;
    //     owner = msg.sender;
    //     ownerName = _ownerName;
    // }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function changeOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function setValue(int256 _value) public {
        value = _value;
    }

    function getValue() public view returns (int256) {
        return value;
    }

    function setOwnerName(string memory _ownerName) public {
        ownerName = _ownerName;
    }
}
