// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";

contract Kaws is ERC20 {
    address public founder;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        founder = msg.sender;
        _mint(msg.sender, initialSupply);
    }
}
