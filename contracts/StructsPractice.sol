// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

struct Person {
    string name;
    uint age;
    address ethAddress;
}

contract Student {

    Person public mainStudent;
    enum Status {Dead, Alive}
    Status public livingStatus = Status.Dead;

    constructor (string memory _name, uint _age) {
        mainStudent.name = _name;
        mainStudent.age = _age;
        mainStudent.ethAddress = msg.sender;
    }

    function changeMainStudent(string memory _name, uint _age, address _addr) public {
        if (livingStatus == Status.Alive) {
            Person memory replacementStudent = Person ({
                name: _name,
                age: _age,
                ethAddress: _addr
            });
            mainStudent = replacementStudent;
        }
    }
}