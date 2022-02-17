// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "../../UtilityContracts/IERC20.sol";
import "../../UtilityContracts/SafeMath.sol";
import "./KawsCoin.sol";

contract KawsICO is Kaws {
    using SafeMath for uint256;

    address payable public deposit;
    uint256 public barbEthMultiplier = 1000; // 1ETH = 1000 KAWS

    uint256 public hardCap = 300 ether;
    uint256 public raisedAmount;

    uint256 public timeStart = block.timestamp; // starts in one hour
    uint256 public timeEnd = timeStart.add(604800); // ends after a week
    uint256 public unlockTokens = timeEnd.add(2419200); // tokens unlock 4 weeks after the sale end

    uint256 public maxInvestment = 5 ether;
    uint256 public minInvestment = .1 ether;

    enum State {
        beforeRunning,
        running,
        afterEnd,
        halted
    }
    State public icoState;

    event Invest(address _investor, uint256 value, uint256 tokens);

    constructor(address payable _deposit) {
        deposit = _deposit;
        icoState = State.beforeRunning;
    }

    modifier onlyAdmin() {
        require(msg.sender == founder);
        _;
    }

    function halt() public onlyAdmin {
        icoState = State.halted;
    }

    function resume() public onlyAdmin {
        icoState = State.running;
    }

    function changeDepositAddress(address payable _deposit) public onlyAdmin {
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
        require(balances[founder] >= tokens, "Not enough BARBS in reserves");

        balances[msg.sender] = balances[msg.sender].add(tokens);
        balances[founder] = balances[founder].sub(tokens);
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
        super.transfer(to, value); // Barbs.transfer(to, value)
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        require(block.timestamp > unlockTokens, "Tokens are locked");
        super.transferFrom(from, to, value); // Barbs.transferFrom(from, to, value)
        return true;
    }

    function burn() public returns (bool) {
        icoState = getCurrentState();
        require(icoState == State.afterEnd, "ICO not complete");
        balances[founder] = 0;
        return true;
    }
}
