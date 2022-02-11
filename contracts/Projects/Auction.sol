// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Auction {
    address payable public owner;
    uint256 public startBlock;
    uint256 public endBlock;
    string public ipfsHash;
    bool public ownerTakenFunds;

    enum State {

        
        Started,
        Running,
        Ended,
        Canceled
    }
    State public auctionState;

    uint256 public highestBindingBid;
    address payable public highestBidder;

    mapping(address => uint256) public bids;

    uint256 bidIncrement;

    constructor(
        address _owner,
        uint256 _endBlock,
        string memory _ipfsHash,
        uint256 _bidIncrement
    ) {
        owner = payable(_owner);
        auctionState = State.Running;
        startBlock = block.number;
        endBlock = startBlock + _endBlock;
        ipfsHash = _ipfsHash;
        bidIncrement = _bidIncrement;
    }

    modifier notOwner() {
        require(msg.sender != owner);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier afterStart() {
        require(block.number >= startBlock);
        _;
    }

    modifier beforeEnd() {
        require(block.number <= endBlock);
        _;
    }

    function placeBid() public payable notOwner afterStart beforeEnd {
        require(auctionState == State.Running, "Auction is not active");
        require(msg.value >= bidIncrement, "Minimum bid increment not met");

        uint256 currentBid = bids[msg.sender] + msg.value;

        require(
            currentBid > highestBindingBid,
            "Bid amount is not great enough"
        );
        bids[msg.sender] = currentBid;

        if (currentBid <= bids[highestBidder]) {
            /*
            someone bid higher but it is still lower that what the highest bidder is willing to pay
            therefore the highest binding bid is increased by 100 or by the highest bidders max bid amount if
            that is lower than the current bid + 100, the current highest bidder maintains the binding bid
            */
            highestBindingBid = min(
                currentBid + bidIncrement,
                bids[highestBidder]
            );
        } else {
            // increases the binding bid by 100 and a new highest bidder is established
            highestBindingBid = min(
                currentBid,
                bids[highestBidder] + bidIncrement
            );
            highestBidder = payable(msg.sender);
        }
    }

    function cancelAuction() public onlyOwner {
        auctionState = State.Canceled;
    }

    function finalizeAuction() public {
        require(
            auctionState == State.Canceled || block.number > endBlock,
            "Auction not in finished state"
        );
        require(msg.sender == owner || bids[msg.sender] > 0);
        address payable recipient = payable(msg.sender);
        uint256 value;

        if (auctionState == State.Canceled) {
            // Auction was cancelled
            recipient = payable(msg.sender);
            value = bids[msg.sender];
        } else {
            //Auction ended successfully
            if (msg.sender == owner) {
                // Owner getting funds
                recipient = owner;
                value = highestBindingBid;
            } else if (msg.sender == highestBidder) {
                // highest bidder getting leftover funds
                recipient = highestBidder;
                value = bids[highestBidder] - highestBindingBid;
            } else {
                // non highest bidder retrieving funds
                recipient = payable(msg.sender);
                value = bids[msg.sender];
            }
        }
        if (recipient == owner && ownerTakenFunds != true) {
            recipient.transfer(value);
            ownerTakenFunds = true; // variable so owner cannot take more than once
        } else if (recipient != owner) {
            bids[recipient] = 0; // reset so bidder can't call more that once
            recipient.transfer(value);
        }
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        if (a > b) {
            return b;
        }
        return a;
    }
}

contract CreateAuction {
    Auction[] public auctions;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createNewAuction(
        uint256 endBlock,
        string memory ipfsHash,
        uint256 bidIncrement
    ) public {
        Auction newAuction = new Auction(
            msg.sender,
            endBlock,
            ipfsHash,
            bidIncrement
        );
        auctions.push(newAuction);
    }
}
