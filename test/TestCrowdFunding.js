const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers")
const { hexStripZeros } = require("ethers/lib/utils");
const { time,  loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { duration } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");


describe("CrowdFunding", function(){
  
  async function setupFixture(){

    //current time + 24 hours in seconds
    const duraton = (await time.latest()) + 24 * 60 * 60

    const amountToRaise = ethers.utils.parseEther("0.5")
    const fundingFee = ethers.utils.parseEther("0.005")
    const amountToDeposit = ethers.utils.parseEther("0.5");

    let fundingCID = 'QmXRmmgWjtJqmLLTWYZBBtYrcULEjdPXtNAFaZXMbzYQyf'
    let milestoneCID = 'QmWMJqk8fFU3NwKt5pWaMg4ozT7UnLeDcDRD7KF9BySc1n'
    
    //get accounts
    const[owner, account1, account2,account3, account4, account5, account6] = await ethers.getSigners();

    //deploy CrowdFundingContract.sol
    const CrowdFundingContract = await ethers.getContractFactory("CrowdFundingContract"); 
    const implementation = await CrowdFundingContract.deploy()
    await implementation.deployed()

    //deploy CrowdSourcingFactory.sol
    const CrowdFundingFactory = await ethers.getContractFactory("CrowdSourcingFactory");
    const crowdFundingFactory = await CrowdFundingFactory.deploy(implementation.address)
    await crowdFundingFactory.deployed()

    //create a crowd funding campaign
    let txnOne = await crowdFundingFactory.connect(account1).
    createCrowdFundingContract(fundingCID,amountToRaise,duraton, {value: fundingFee})

    let wait = await txnOne.wait(); 
    const cloneAddress = wait.events[1].args.cloneAddress; 
    
    //get the deployed crowd funding contract so we can intract with it 
    let instanceOne = await ethers.getContractAt(
      "CrowdFundingContract",
      cloneAddress,
      account1
    )

    //create another crowdfunding campaign
    let txnTwo = await crowdFundingFactory.connect(account2).
    createCrowdFundingContract(fundingCID,amountToRaise,duraton, {value: fundingFee})

    let waitTwo = await txnTwo.wait(); 
    const cloneAddressTwo = waitTwo.events[1].args.cloneAddress; 

    //get the deployed crowd funding contract so we can intract with it 
    let instanceTwo = await ethers.getContractAt(
      "CrowdFundingContract",
      cloneAddressTwo,
      account2
    )

    return {
      owner, 
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      crowdFundingFactory,
      fundingCID,
      milestoneCID,
      amountToRaise,
      amountToDeposit,
      fundingFee,
      instanceOne,
      instanceTwo
    }
  }

  describe("Test  Crowdsourcing Factory", function (){

    it("clone and create new crowd funding campaign", async function () {

      const {crowdFundingFactory,fundingCID,fundingFee,duraton, amountToRaise,account3} = await loadFixture(setupFixture);

      //create a new crowd funding campaign 
      const txn = await crowdFundingFactory.connect(account3).createCrowdFundingContract(fundingCID,1,2,{value: ethers.utils.parseEther("0.001")})

      let wait = await txn.wait(); 

      //check if address exist
      expect(wait.events[1].args.cloneAddress).to.exist
  
    });
    it("get number of deployed crowd funding campaigns", async function () {

      const {crowdFundingFactory} = await loadFixture(setupFixture);

      //get number of deployed crowd funding contracts
      const deployedContracts = await crowdFundingFactory.deployedContracts()
      const count = deployedContracts.length 
    
      //check if equal to 2 
      expect(count).to.equal(2)
  
    });
    it("check funding fee provided to factory", async function () {

      const {crowdFundingFactory,fundingFee} = await loadFixture(setupFixture);

      //check the balance of Factory contract
      const total = await ethers.provider.getBalance(crowdFundingFactory.address)

      //only two contracts deployed, therefore the balance is double the funding fee.
      expect(total.toString()).to.be.equal((fundingFee*2).toString())
    });
    it("Only owner can withdraw funds", async function () {

      const {crowdFundingFactory,owner} = await loadFixture(setupFixture);

      //check balance before 
      const balanceBefore = await ethers.provider.getBalance(crowdFundingFactory.address);

      //factory contract depolyer withdraws the money from the factory contract
      await crowdFundingFactory.connect(owner).withdrawFunds();

      //check balance after
      const balanceAfter = await ethers.provider.getBalance(crowdFundingFactory.address);

      //check if balanceAfter is less than balanceBefore
      expect(+balanceAfter.toString()).to.be.lessThan(+balanceBefore.toString())

    });
  })

  describe("Test CrowdFunding Contract", function(){
    it("make a donation to a campaign", async function () {

      const {instanceOne, account4} = await loadFixture(setupFixture);
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make a donation to a crowd funding campaign
      await instanceOne
        .connect(account4)
        .makeDonation({ value: amountToDonate });
      
      //get the total donations
      const donation = await instanceOne.amountOfDonation()

      //donation should be equal to total amount donated
      expect(donation.toString()).to.be.equal(amountToDonate.toString())
    });
    it("get campain owner", async function () {

      const {instanceOne,account1} = await loadFixture(setupFixture);

      //get crowd funding campaign owner
      const campaignOwner = await instanceOne.campaignOwner()

      //check if owner is owner
      expect(campaignOwner).to.be.equal(account1.address)
    }); 
    it("get number of unique donors to a campaign", async function () {

      const {instanceOne, account2,account3,account4,account5} = await loadFixture(setupFixture);
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });
      
        await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account4)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account5)
        .makeDonation({ value: amountToDonate });
      
      //get number of donors
      const donors = await instanceOne.numberOfDonors()

      //number of donors should be 4 
      expect(donors.toString()).to.be.equal("4")
    });
    it("create new milestone", async function () {

      const {instanceOne,account1, milestoneCID} = await loadFixture(setupFixture);
      
      //current time + 48 hours in seconds
      const votingPeriod = (await time.latest()) + 48 * 60 * 60

      //create a new milestone for crowd funding campaign 
      await instanceOne.createNewMilestone(milestoneCID,votingPeriod);
      
      //getthe current milestone
      const milestone = await instanceOne.showCurrentMillestone()
      expect(milestone.milestoneCID).to.be.equal(milestoneCID)
    });

    it("Should not be to create a milestone", async function () {
      const {instanceOne,milestoneCID,account5} = await loadFixture(setupFixture);

      //current time + 24 hours in seconds
      const votingPeriod = (await time.latest()) + 24 * 60 * 60

      //cannot create milestone
      await expect(instanceOne.connect(account5)
        .createNewMilestone(milestoneCID,votingPeriod))
        .to.be.revertedWith("you are not the owner")
    });
    it("Should be able to vote on a milestone", async function () {

      const {instanceOne, 
        milestoneCID,
        account1,account2, 
        account3,account4} = await loadFixture(setupFixture);

      const votingPeriod = 1
      const amountToDonate = ethers.utils.parseEther("0.5")
      
      //make donations
      await instanceOne
        .connect(account1).makeDonation({value: amountToDonate})

      await instanceOne
        .connect(account2).makeDonation({value: amountToDonate})
        
      await instanceOne
        .connect(account3).makeDonation({value: amountToDonate})

      await instanceOne
        .connect(account4).makeDonation({value: amountToDonate})

      //create a new milestone
      await instanceOne
        .createNewMilestone(milestoneCID,votingPeriod)

      //donors vote on milestone
      await instanceOne.connect(account1).voteOnMilestone(true)
      await instanceOne.connect(account2).voteOnMilestone(true)
      await instanceOne.connect(account3).voteOnMilestone(true)
      await instanceOne.connect(account4).voteOnMilestone(false)

      const milestone = await instanceOne.showCurrentMillestone()
      
      //there should be 4 votes
      expect(+milestone.votes.length).to.be.equal(4);
    });
    it("Should not be able to vote on a milestone", async function () {

      const {instanceOne, 
        milestoneCID,
        account1} = await loadFixture(setupFixture);

      //current time + 24 hours in seconds
      const votingPeriod = (await time.latest()) + 24 * 60 * 60

      //creata a new milestone 
      await instanceOne
        .createNewMilestone(milestoneCID,votingPeriod)

      //should not vote 
      await expect(instanceOne
        .connect(account1)
        .voteOnMilestone(true))
        .to.be.revertedWith("you are not a donor")
    });
    it("Should not be able to vote twice on a milestone", async function () {

      const {instanceOne, 
        milestoneCID,
        account1} = await loadFixture(setupFixture);

      //current time + 24 hours in seconds
      const votingPeriod = (await time.latest()) + 24 * 60 * 60
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account1).makeDonation({value: amountToDonate})


      //create new milestone 
      await instanceOne
        .createNewMilestone(milestoneCID,votingPeriod)

      //vote by account 1 
      await instanceOne.connect(account1).voteOnMilestone(true);

      //another vote by account 1
      await instanceOne.connect(account1).voteOnMilestone(false);

      //get the current milestone
      const milestone = await instanceOne.showCurrentMillestone();
 
      //should only be 1 vote
      expect(+milestone.votes.length).to.be.equal(1);
    });
    it("Should not be able to withdraw milestone funds as voting is in progress", async function () {

      const {instanceOne, 
        milestoneCID,
        account1,account2,
        account3,account4,
        account5} = await loadFixture(setupFixture);

      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")
        
      //make donations
      await instanceOne
        .connect(account2).makeDonation({value: amountToDonate})

      await instanceOne
        .connect(account3).makeDonation({value: amountToDonate})
      
      await instanceOne
        .connect(account4).makeDonation({value: amountToDonate})
        
      await instanceOne
        .connect(account5).makeDonation({value: amountToDonate})
  
      //create new mileston 
      await instanceOne
        .createNewMilestone(milestoneCID,votingPeriod)
      
      //vote on milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account4).voteOnMilestone(true);
      await instanceOne.connect(account5).voteOnMilestone(false);

  
      //campaign owner cannot withdraw
      await expect(instanceOne.connect(account1).withdrawMilestone()).to.be.revertedWith("voting still on")

    });
    it("Should be able to withdraw milestone fund stage one", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account6,
        milestoneCID
        } = await loadFixture(setupFixture);
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")


      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account6)
        .makeDonation({ value: amountToDonate });

      //create a new milestone 
      await instanceOne.createNewMilestone(milestoneCID,votingPeriod);

      //vote milestone
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account6).voteOnMilestone(false);

      
      
      const latestTime = await time.latest();

      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //get balance before 
      const balanceBefore = await instanceOne.etherBalance();

      //owner withdraws mileston funds 
      await instanceOne.connect(account1).withdrawMilestone();

      //get balance after 
      const balanceAfter = await instanceOne.etherBalance();

      //balalnceAfter should be less than balanceBefore
      expect(+balanceAfter.toString()).to.be.lessThan(+balanceBefore.toString())
    });
    it("Should be able to withdraw milestone fund stage two", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account6,
        milestoneCID
        } = await loadFixture(setupFixture);
      
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account6)
        .makeDonation({ value: amountToDonate });

            
      //creat new milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod);

      //vote on milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account6).voteOnMilestone(false);

      
      const latestTime = await time.latest();
      
      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //first milestone withdraw
      await instanceOne.connect(account1).withdrawMilestone();
      
      //create second milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //balance before
      const balanceBefore = await instanceOne.etherBalance();

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //balance after
      const balanceAfter = await instanceOne.etherBalance();

      //balance after should be less than
      expect(+balanceAfter.toString()).to.be.lessThan(+balanceBefore.toString())
    });
    it("Should be able to withdraw milestone fund stage three", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account6,
        milestoneCID
        } = await loadFixture(setupFixture);
      
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account6)
        .makeDonation({ value: amountToDonate });

      //create first milestone 
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod);

      //vote on milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(false);
      await instanceOne.connect(account6).voteOnMilestone(false);

      

      const latestTime = await time.latest();
      
      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //first milestonw withdraw
      await instanceOne.connect(account1).withdrawMilestone();
      
      //create second milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //create third milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //get balance before 
      const balanceBefore = await instanceOne.etherBalance();

      //withdraw funds for third milestone
      await instanceOne.connect(account1).withdrawMilestone();

      //get balance after
      const balanceAfter = await instanceOne.etherBalance();

      //balance after should be less tha balance before 
      expect(+balanceAfter.toString()).to.be.lessThan(+balanceBefore.toString())
    });

    it("Should no longer be able to create milestone after 3 withdrawals", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account4,
        account5,
        account6,
        milestoneCID
      } = await loadFixture(setupFixture);

      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDeposit = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account4)
        .makeDonation({ value: amountToDeposit });

      //creata first milestone 
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000)

      //vote on milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account4).voteOnMilestone(false);

      const latestTime = await time.latest();

      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //first milestone withdraw
      await instanceOne.connect(account1).withdrawMilestone();


      //create second milestone 
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //third milestone creation
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //third milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //cannot create new milestone
      await expect(instanceOne
          .connect(account1)
          .createNewMilestone(milestoneCID,votingPeriod + 1000000)).to.be.revertedWith("no more milestones to create")
    });
    it("Should no longer be able to donate after 3 withdrawals", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account4,
        account5,
        account6,
        milestoneCID
      } = await loadFixture(setupFixture);

      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDeposit = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account4)
        .makeDonation({ value: amountToDeposit });

      //create first milestone 
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000)

      //vote on milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account4).voteOnMilestone(false);

      const latestTime = await time.latest();

      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //first milestone withdraw
      await instanceOne.connect(account1).withdrawMilestone();

      //create second milestone
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //third milestone creation
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //third milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();


      //cannot make a donation
      await expect(instanceOne
          .connect(account5)
          .makeDonation({ value: amountToDeposit })).to.be.revertedWith("campaign Ended")
    });
    it("should not be able to withdraw milestone funds stage one", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account4,
        account5,
        account6,
        milestoneCID
      } = await loadFixture(setupFixture);
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDeposit = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDeposit });

      await instanceOne
        .connect(account4)
        .makeDonation({ value: amountToDeposit });

      //create first milestone 
      await instanceOne
        .connect(account1)
        .createNewMilestone(milestoneCID,votingPeriod + 1000000)

      //vote on milestone
      //tip: majority vote `no`
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(false);
      await instanceOne.connect(account4).voteOnMilestone(false);

      const latestTime = await time.latest();
      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      const balanceBefore = await instanceOne.etherBalance()
      
      //withdraw first milestone funds 
      await instanceOne.connect(account1).withdrawMilestone();

      //balance after
      const balanceAfter = await instanceOne.etherBalance()

      //should fail to withdraw 
      expect(+balanceAfter.toString()).to.be.equal(+balanceBefore.toString())
    });
    it("should not be able to withdraw milestone funds stage two", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account6,
        milestoneCID
        } = await loadFixture(setupFixture);
      
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account6)
        .makeDonation({ value: amountToDonate });

      //create first milestone 
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod);

      //vote on first milestone
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account6).voteOnMilestone(false);

      

      const latestTime = await time.latest();
      //speed up time 
      await time.increaseTo(latestTime + 90000000000);

      //first milestonw withdraw
      await instanceOne.connect(account1).withdrawMilestone();
      
      //crate second milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //vote on second milestone
      //tip: majority vote `no`
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(false);
      await instanceOne.connect(account6).voteOnMilestone(false);

      //get balance before 
      const balanceBefore = await instanceOne.etherBalance();

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //get balance after
      const balanceAfter = await instanceOne.etherBalance();

      //should not be able to withdraw
      expect(+balanceAfter.toString()).to.be.equal(+balanceBefore.toString())
    });

    it("should not be able to withdraw milestone funds stage three", async function () {
      const {
        instanceOne,
        account1,
        account2,
        account3,
        account6,
        milestoneCID
        } = await loadFixture(setupFixture);
     
      //current time + 2 days in seconds 
      const votingPeriod = (await time.latest()) + 2 * 24 * 60 * 60;
      const amountToDonate = ethers.utils.parseEther("0.5")

      //make donations 
      await instanceOne
        .connect(account2)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account3)
        .makeDonation({ value: amountToDonate });

      await instanceOne
        .connect(account6)
        .makeDonation({ value: amountToDonate });

      //create first milestone 
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod);

      //vote on first milestone 
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account6).voteOnMilestone(false);

      

      const latestTime = await time.latest();

      //speed up time 
      await time.increaseTo(latestTime + 90000000000);


      //first milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();


      //create second milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);
      
      //vote on second milestone
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(true);
      await instanceOne.connect(account6).voteOnMilestone(false);

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //create third milestone
      await instanceOne.connect(account1).createNewMilestone(milestoneCID,votingPeriod + 1000000);

      //vote on third milestone
      //tip: majority vote `no`
      await instanceOne.connect(account2).voteOnMilestone(true);
      await instanceOne.connect(account3).voteOnMilestone(false);
      await instanceOne.connect(account6).voteOnMilestone(false);

      //get balance before 
      const balanceBefore = await instanceOne.etherBalance();

      //second milestone withdrawal
      await instanceOne.connect(account1).withdrawMilestone();

      //get balance after 
      const balanceAfter = await instanceOne.etherBalance();

      //should not be able to withdraw third milestone funds 
      expect(+balanceAfter.toString()).to.be.equal(+balanceBefore.toString())
    });
  })
})
