//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

/* openzippelin Imports */
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* Contract Imports */
import "./CrowdFundingContract.sol";

/**
 * @title CrowdFundingFactory
 * @dev The CrowdFundingFactory is a contract used to deploy multiple instances of
 * the CrowdFundingContract.
 *
 * Runtime target: EVM
 */

contract CrowdSourcingFactory is Ownable {

    /*******************
     * state variables *  
     ******************/
    
    address immutable crowdFundingImplementation;
    address[] public _deployedContracts;
    uint256 public fundingFee = 0.001 ether;

    /**********
     * events *    
     **********/

    event newCrowdFundingCreated(
        address indexed owner,
        uint256 amount,
        address cloneAddress,
        string fundingCID
    );

    /***************
     * constructor *
     ***************/
    constructor(address _implementation) Ownable () {
        crowdFundingImplementation = _implementation;
    }

    /**
     * Create crowd funding contract clone
     *@param _fundingCId IPFS hash
     *@param _amount  amount to raise 
     *@param _duration crowdfunding duration
     *@return clone address
     */    
    function createCrowdFundingContract(
        string memory _fundingCId,
        uint256 _amount,
        uint256 _duration
    ) external payable returns (address) {
        require(msg.value >= fundingFee, "deposit too small");
        address clone = Clones.clone(crowdFundingImplementation);
        (bool success, ) = clone.call(
            abi.encodeWithSignature(
                "initialize(string,uint256,uint256)",
                _fundingCId,
                _amount,
                _duration
            )
        );
        require(success, "creation failed");

        _deployedContracts.push(clone);
        emit newCrowdFundingCreated(msg.sender, fundingFee, clone, _fundingCId);
        return clone;
    }

    /**
     * Withdraw factory funds
     */    
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "nothing to withdraw");
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "withdrawal failed");
    }

    /**
     * Get deployed contracts
     *@return deployed contracts addresses
     */
    function deployedContracts () public view  returns (address[] memory){
        return _deployedContracts;
    }
    /**
     * enables the contract to receive Eth
     */
    receive() external payable{}
}

