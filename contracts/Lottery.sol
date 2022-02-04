// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Lottery {
    address payable[] public players;
    address public manager;
    uint256 public baseGamble;
    uint256 public minNumberPlayers;
    bool public automatedGame; // controls whether the game automatically picks a winner

    constructor() {
        manager = msg.sender;
        baseGamble = 0.1 ether;
        minNumberPlayers = 3;
    }

    receive() external payable {
        require(msg.sender != manager, "Manager cannot play game");
        require(msg.value == baseGamble, "Base bet requirement not met");
        players.push(payable(msg.sender));
        pickWinner();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function pickWinner() public {
        if (players.length >= minNumberPlayers) {
            if (automatedGame == true) {
                uint256 winnerIndex = random() % players.length;
                payWinner(players[winnerIndex]);
                delete players;
            } else {
                require(msg.sender == manager, "You are not the manager");
                uint256 winnerIndex = random() % players.length;
                payWinner(players[winnerIndex]);
                delete players;
            }
        }
    }

    function payWinner(address payable winnerAddress) private {
        uint256 managerFee = (address(this).balance * 5) / 100;
        payable(manager).transfer(managerFee);
        winnerAddress.transfer(address(this).balance);
    }

    function setAutomatedGame(bool _automatedGame) public {
        require(msg.sender == manager);
        automatedGame = _automatedGame;
    }

    function setMinNumberPlayers(uint256 _minNumberPlayers) public {
        require(msg.sender == manager);
        minNumberPlayers = _minNumberPlayers;
    }

    function getNumberPlayers() public view returns (uint256) {
        return players.length;
    }
}
