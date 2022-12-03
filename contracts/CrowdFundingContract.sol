//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;


/* openzippelin Imports */
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title CrowdFundingContract
 * @dev The CrowdFundingContract is the codebase for the contracts deployed
 * by CrowdSourcingFactory.
 * 
 * Runtime target: EVM
 */

 contract CrowdFundingContract is Initializable {
    
    /*******************
     * State Variables *
     *******************/

    string public fundingId;
    bool public campaignEnded;
    uint256 public targetAmount;

    uint256 private _amountDonated;
    uint256 private _numberOfDonors;
    uint256 public campaignDuration;

    uint32 private _milestoneCounter;
    uint256 private _numberOfWithdrawal;
    uint256 constant _baseNumber = 10**18;
    address payable private _campaignOwner;

    /*************
     *   enum    *
     *************/

    enum MilestoneStatus {
        Approved,
        Declined, 
        Pending
    }

    /***********
     * structs *
     ***********/

    struct MilestoneVote{
        address donorAddress; 
        bool vote;
    }

    struct Milestone {
        string milestoneCID;
        bool approved; 
        uint256 votingPeriod; 
        MilestoneStatus status;
        MilestoneVote[] votes; 
    }
    
    /*************
     *  mapping  *
     ************/

    mapping(address => uint256) public donors;
    mapping(uint256 => Milestone) public milestones;


    /************
     *  events  *
     ************/    
    event milestoneRejected(uint yesvote, uint novote);
    event fundsDonated(address indexed donor, uint256 amount, uint256 date);
    event fundsWithdrawn(address indexed owner, uint256 amount, uint256 date);
    event milestoneCreated(address indexed owner, uint256 datecreated, uint256 period);

    function initialize (
        string memory _fundingId,
        uint256 _amount,
        uint256 _duration
    ) initializer public {
        _campaignOwner = payable(tx.origin);
        fundingId = _fundingId;
        targetAmount = _amount; 
        campaignDuration = _duration;
    }

    /**
     * Makes a donation to a crowdfund.
     */
    function makeDonation() public payable {
        uint256 funds = msg.value;
        require(!campaignEnded, "campaign Ended");
        require(funds > 0,"You did not donate");
        require(_numberOfWithdrawal != 3, "no longer taking donation");
        if (donors[msg.sender] == 0) {
            _numberOfDonors += 1;
        }
        //add donor to donors
        donors[msg.sender] += funds;
        
        //increament donations
        _amountDonated += funds;

        emit fundsDonated(msg.sender, funds, block.timestamp);

    }

    /**
     * Creates a new cowdfund milestone
     * @param milestoneCID IPFS hash with milestone details.
     * @param votingPeriod duration of voting days.
     */
    function createNewMilestone(string memory milestoneCID, uint256 votingPeriod) public {
        //check owner 
        require(msg.sender == _campaignOwner, "you are not the owner");

        //check milestone status 
        require(milestones[_milestoneCounter].status != MilestoneStatus.Pending,
        "You have a pending milestone");

        
        require(_numberOfWithdrawal != 3, "no more milestones to create");

        //increament milestone counter
        _milestoneCounter++;

        //create Milestone object
        Milestone storage newMilestone = milestones[_milestoneCounter];

        //add Milestone values
        newMilestone.milestoneCID = milestoneCID; 
        newMilestone.approved = false; 
        newMilestone.votingPeriod = votingPeriod; 
        newMilestone.status = MilestoneStatus.Pending;

        emit milestoneCreated(msg.sender, block.timestamp, votingPeriod);
    }

    /**
     * Vote on crowdfund milestone
     * @param  vote boolean value.
     */
    function voteOnMilestone(bool vote) public {

        //check milestone status
        require(milestones[_milestoneCounter].status == MilestoneStatus.Pending,
        "can not vote on milestone");

        //check if donor
        require(donors[msg.sender] != 0, "you are not a donor");

        uint256 counter = 0;
        uint256 milestoneVoteArrayLength = milestones[_milestoneCounter]
            .votes
            .length;
        bool voted = false;
        for (counter; counter < milestoneVoteArrayLength; ++counter) {
            MilestoneVote memory userVote = milestones[_milestoneCounter].votes[
                counter
            ];
            if (userVote.donorAddress == msg.sender) {
                //already voted
                voted = true;
                break;
            }
        }
        if (!voted) {
            //the user has not voted yet
            MilestoneVote memory userVote;
            //construct the user vote
            userVote.donorAddress = msg.sender;
            userVote.vote = vote;
            milestones[_milestoneCounter].votes.push(userVote);

        }
    }


    /**
     * Get contract balance
     *@return balance of smart contract
     */    
    function etherBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * Withdraw crowdfund milestone funds
     */
     
    function withdrawMilestone() public {
        require(payable(msg.sender) == _campaignOwner, "you not the owner");

        //check if the voting period is still on
        require(
            block.timestamp > milestones[_milestoneCounter].votingPeriod,
            "voting still on"
        );
        //check if milestone has ended
        require(
            milestones[_milestoneCounter].status == MilestoneStatus.Pending,
            "milestone ended"
        );

        //calculate the percentage
        (uint yesvote, uint256 novote) = _calculateTheVote(
            milestones[_milestoneCounter].votes
        );

        //calculate the vote percentage and make room for those that did not vote
        uint256 totalYesVote = _numberOfDonors - novote;

        //check if the yesVote is equal to 2/3 of the total votes
        uint256 twoThirdofTotal = (2 * _numberOfDonors * _baseNumber) / 3;
        uint256 yesVoteCalculation = totalYesVote * _baseNumber;

        //check if the milestone passed 2/3
        if (yesVoteCalculation >= twoThirdofTotal) {
            //the milestone succeds payout the money
            milestones[_milestoneCounter].approved = true;
            _numberOfWithdrawal++;
            milestones[_milestoneCounter].status = MilestoneStatus.Approved;
            //transfer 1/3 of the total balance of the contract
            uint256 contractBalance = address(this).balance;
            require(contractBalance > 0, "nothing to withdraw");
            uint256 amountToWithdraw;
            if (_numberOfWithdrawal == 1) {
                //divide by 3 1/3
                amountToWithdraw = contractBalance / 3;
            } else if (_numberOfWithdrawal == 2) {
                //second withdrawal 1/2
                amountToWithdraw = contractBalance / 2;
            } else {
                //final withdrawal
                amountToWithdraw = contractBalance;
                campaignEnded = true;
            }
            
            
            (bool success, ) = _campaignOwner.call{value: amountToWithdraw}("");
            require(success, "withdrawal failed");
            emit fundsWithdrawn(_campaignOwner,amountToWithdraw,block.timestamp);
        } else {
            //the milestone failed
            milestones[_milestoneCounter].status = MilestoneStatus.Declined;
            emit milestoneRejected(yesvote, novote);
        }
    }

    /**
     * Calaculate crowdfund milestone votes
     * @param votesArray Array with votes.
     * @return counts of yesvotes and novotes
     */
    function _calculateTheVote(MilestoneVote[] memory votesArray)
        private
        pure
        returns (uint256, uint256)
    {
        uint256 yesNumber = 0;
        uint256 noNumber = 0;
        uint256 arrayLength = votesArray.length;
        uint256 counter = 0;

        for (counter; counter < arrayLength; ++counter) {
            if (votesArray[counter].vote == true) {
                ++yesNumber;
            } else {
                ++noNumber;
            }
        }

        return (yesNumber, noNumber);
    }

    /**
     * Get the number of donors
     *@return total number of donors 
     */
    function numberOfDonors() public view returns(uint256){
        return _numberOfDonors;
    }

    /**
     * Get the amount donated
     *@return total amount donated
     */
    function amountOfDonation() public view returns(uint256){
        return _amountDonated;
    }

    /**
     * Get the campaign owner
     *@return address of campaign owner
     */
    function campaignOwner () public view returns(address payable){
        return _campaignOwner;
    }

    /**
     * Get the current milestone
     *@return current milestone 
     */
    function showCurrentMillestone() public view returns (Milestone memory) {
        return milestones[_milestoneCounter];
    }

    /**
     * Get the campaign cid hash string
     *@return string hash cid 
     */
    function getFundingcid() public view returns (string memory) {
        return fundingId;
    }

    /**
     * Get the campaign target amount
     *@return target amount
     */
    function getTargetAmount() public view returns (uint256) {
        return targetAmount;
    }
    
    /**
     * enables the contract to receive Eth
     */
    receive() external payable{}
 }
