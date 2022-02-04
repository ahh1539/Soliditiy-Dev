// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Auction {
    mapping(address => uint256) public bids;
    address public owner;
    uint256 public creationTime;

    constructor() {
        owner = msg.sender;
        creationTime = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // declaring the receive() function that is executed when sending ETH to the contract address
    receive() external payable {}

    // declaring a fallback payable function that is called when msg.data is not empty or
    // when no other function matches
    fallback() external payable {}

    function bid() public payable returns (uint256) {
        if (msg.value > bids[msg.sender]) {
            bids[msg.sender] = msg.value;
            return 1;
        }
        payable(msg.sender).transfer(msg.value);
        return 0;
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function howMuchGasUsed() public view returns (uint256) {
        uint256 startGas = gasleft();
        uint256 i = 1;
        for (uint256 j = 1; j < 15; j++) {
            i++;
        }
        uint256 endGas = gasleft();
        return startGas - endGas;
    }

    /*
    msg.sender -> account address that creates and sends the transaction
    msg.value -> ETH value (represented in wei) sent to this contract
    msg.data -> data field in the transaction or call that called the function
    */
}
