// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract CrowdFunding {
    address public owner;
    uint256 public goal;
    uint256 public endTime;
    uint256 public numDonors;
    uint256 public minDonation;
    uint256 public amountRaised;

    mapping(address => uint256) public donors;

    struct Request {
        string description;
        uint256 amount;
        address payable recipient;
        mapping(address => bool) voters;
        uint256 numVoters;
        bool completed;
    }

    mapping(uint256 => Request) public requests;
    uint256 public numRequests;

    constructor(uint256 _goal, uint256 _endTime) {
        owner = msg.sender;
        goal = _goal;
        endTime = block.timestamp + _endTime;
        minDonation = 100 wei;
    }

    receive() external payable {
        donate();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can access this!");
        _;
    }

    function donate() public payable {
        require(block.timestamp < endTime, "Campaign is over");
        require(msg.value >= minDonation, "Minimum donation not met");

        if (donors[msg.sender] == 0) {
            numDonors++;
        }
        donors[msg.sender] += msg.value;
        amountRaised += msg.value;
    }

    function refund() public {
        require(donors[msg.sender] > 0, "You have not donated.");
        require(block.timestamp > endTime && amountRaised < goal);
        payable(msg.sender).transfer(donors[msg.sender]);
        donors[msg.sender] = 0;
    }

    function makeRequest(
        string memory _description,
        uint256 _amount,
        address _recipient
    ) public onlyOwner {
        // require(_amount <= amountRaised, "Cannot request more than available");
        Request storage newRequest = requests[numRequests];
        numRequests++;

        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.recipient = payable(_recipient);
        newRequest.numVoters = 0;
        newRequest.completed = false;
    }

    function voteForRequest(uint256 _requestNumber) public {
        require(donors[msg.sender] > 0, "You have not donated.");
        require(msg.sender != owner, "Owner cannot vote");

        Request storage tempRequest = requests[_requestNumber];
        require(
            tempRequest.voters[msg.sender] == false,
            "You have already voted"
        );
        tempRequest.voters[msg.sender] = true;
        tempRequest.numVoters++;
    }

    function makePayment(uint256 _requestNumber) public onlyOwner {
        require(amountRaised >= goal, "Campaign goal not met");
        Request storage tempRequest = requests[_requestNumber];
        require(
            tempRequest.completed == false,
            "The request has already been completed"
        );
        require(
            tempRequest.numVoters >= (numDonors / 2),
            "50% threshold was not met"
        );
        if (tempRequest.amount > address(this).balance) {
            // defaults to send remaining amount in contract if > than available amount
            uint256 amount = address(this).balance;
            tempRequest.recipient.transfer(amount);
        } else {
            tempRequest.recipient.transfer(tempRequest.amount);
        }
        tempRequest.completed = true;
    }
}
