// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "./KawsCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KawsICO is Kaws, Ownable {
    using SafeMath for uint256;

    address public founder;
    address payable public deposit;
    uint256 public barbEthMultiplier = 1000; // 1ETH = 1000 KAWS

    uint256 public hardCap = 300 ether;
    uint256 public raisedAmount;

    uint256 public timeStart = block.timestamp; // starts in one hour
    uint256 public timeEnd = timeStart.add(604800); // ends after a week
    uint256 public unlockTokens = timeEnd.add(604800); // tokens unlock 1 week after the sale end

    uint256 public maxInvestment = 10 ether;
    uint256 public minInvestment = .1 ether;

    enum State {
        beforeRunning,
        running,
        afterEnd,
        halted
    }
    State public icoState;

    event Invest(address _investor, uint256 value, uint256 tokens);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address payable _deposit
    ) Kaws(name, symbol, initialSupply) {
        deposit = _deposit;
        icoState = State.beforeRunning;
        founder = msg.sender;
    }

    function halt() public onlyOwner {
        icoState = State.halted;
    }

    function resume() public onlyOwner {
        icoState = State.running;
    }

    function changeDepositAddress(address payable _deposit) public onlyOwner {
        deposit = _deposit;
    }

    function getCurrentState() public view returns (State) {
        if (icoState == State.halted) {
            return State.halted;
        } else if (block.timestamp < timeStart) {
            return State.beforeRunning;
        } else if (block.timestamp <= timeEnd && block.timestamp >= timeStart) {
            return State.running;
        } else {
            return State.afterEnd;
        }
    }

    function invest() public payable returns (bool) {
        icoState = getCurrentState();
        require(icoState == State.running, "ICO has not started");
        require(msg.value >= minInvestment && msg.value <= maxInvestment, "Investment parameters not met");
        require(raisedAmount.add(msg.value) <= hardCap, "Hardcap has been reached");

        uint256 tokens = msg.value.mul(barbEthMultiplier);
        require(balanceOf(founder) >= tokens, "Not enough tokens in reserves");

        _transfer(founder, msg.sender, tokens);
        deposit.transfer(msg.value);
        raisedAmount = raisedAmount.add(msg.value);

        emit Invest(msg.sender, msg.value, tokens);

        return true;
    }

    receive() external payable {
        invest();
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        require(block.timestamp > unlockTokens, "Tokens are locked");
        super.transfer(to, value); // Kaws.transfer(to, value)
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        require(block.timestamp > unlockTokens, "Tokens are locked");
        super.transferFrom(from, to, value); // Kaws.transferFrom(from, to, value)
        return true;
    }

    function burn() public returns (bool) {
        icoState = getCurrentState();
        require(icoState == State.afterEnd, "ICO not complete");
        _burn(founder, balanceOf(founder));
        return true;
    }
}
