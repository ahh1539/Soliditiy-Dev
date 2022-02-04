// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Auction {
    mapping(address => uint256) public bids;
    address public owner;
    uint256 public creationTime;

    // variables default to internal
    // state variables defualt to private

    constructor() {
        owner = msg.sender;
        creationTime = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // declaring the receive() function that is executed when sending ETH to the contract address
    receive() external payable {}

    // declaring a fallback payable function that is called when msg.data is not empty or
    // when no other function matches
    fallback() external payable {}

    function bid() public payable returns (bool) {
        if (msg.value > bids[msg.sender]) {
            // returns the original bid amount
            uint256 oldBid = bids[msg.sender];
            refundBalance(payable(msg.sender), oldBid);

            bids[msg.sender] = msg.value;
            return true;
        }
        refundBalance(payable(msg.sender), msg.value);
        // payable(msg.sender).transfer(msg.value);
        return false;
    }

    // refunds the balance of the sender
    function refundBalance(address payable sendAddress, uint256 amount)
        private
        returns (bool)
    {
        if (amount <= address(this).balance) {
            sendAddress.transfer(amount);
            return true;
        }
        return false;
    }

    function getContractBalance() public view returns (uint256) {
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
