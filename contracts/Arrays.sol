// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract TestArray {
    uint256[] public numbers;
    bytes public word = "hello world";

    function addElement(uint256 value) public {
        numbers.push(value);
    }

    function removeElement() public {
        numbers.pop();
    }

    function getLength() public view returns (uint256) {
        return numbers.length;
    }

    function getElement(uint256 index) public view returns (uint256) {
        if (index < numbers.length) {
            return numbers[index];
        }

        return 0;
    }
}
