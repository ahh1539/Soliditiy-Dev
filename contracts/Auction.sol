// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Auction {
    mapping(address => uint) public bids;

    function bid() payable public returns(uint){
        if(msg.value > bids[msg.sender]) {
            bids[msg.sender] = msg.value;
            return 1;
        }
        payable(msg.sender).transfer(msg.value);  
        return 0;
    }
}