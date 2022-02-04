// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Auction {
    mapping(address => uint256) public bids;

    function bid() public payable returns (uint256) {
        if (msg.value > bids[msg.sender]) {
            bids[msg.sender] = msg.value;
            return 1;
        }
        payable(msg.sender).transfer(msg.value);
        return 0;
    }

    /*
    msg.sender -> account address that creates and sends the transaction
    msg.value -> ETH value (represented in wei) sent to this contract
    msg.data -> data field in the transaction or call that called the function
    */
}
