// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "../UtilityContracts/IERC20.sol";
import "../UtilityContracts/SafeMath.sol";
import "hardhat/console.sol";

contract Barbs is IERC20 {
    using SafeMath for uint256;

    string public constant name = "Barbs Coin";
    string public constant symbol = "BARBS";
    uint256 public constant decimals = 18;
    uint256 public override totalSupply;

    address public founder;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    constructor() {
        totalSupply = 300000000000000000000000; // 300,000
        founder = msg.sender;
        balances[founder] = totalSupply;
    }

    function balanceOf(address who) public view override returns (uint256) {
        return balances[who];
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        console.log("Sender balance is %s tokens", balances[msg.sender]);
        console.log("Trying to send %s tokens to %s", value, to);

        require(balances[msg.sender] >= value, "Insufficient Balance");

        balances[to] = balances[to].add(value);
        balances[msg.sender] = balances[msg.sender].sub(value);
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return allowed[owner][spender];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient funds");

        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        require(allowed[from][msg.sender] <= value, "Requesting account asking for more than allowed");
        require(balances[from] >= value, "Sending account has insufficient balance");

        balances[from] = balances[from].sub(value);
        balances[to] = balances[to].add(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        emit Transfer(from, to, value);

        return true;
    }
}
