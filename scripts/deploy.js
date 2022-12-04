async function main() {

  //deploy the crowd funding contract implementation 
  const Implementation = await ethers.getContractFactory("CrowdFundingContract");
  console.log("deploying the implementation contract")
  const implementation = await Implementation.deploy();
  await implementation.deployed();
  console.log("deployed the implementation contract at: ", implementation.address);
  //create the factory contract
  const CrowdFundingFactory = await ethers.getContractFactory("CrowdSourcingFactory");
  
  const crowdFundingFactory = await CrowdFundingFactory.deploy(implementation.address);
  console.log("deployed the factory contract");
  await crowdFundingFactory.deployed();
  console.log("deployed the factory contract t: ", crowdFundingFactory.address);

}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});



// Final
// deploying the implementation contract
// deployed the implementation contract at:  0x8621aCaBf0C0f5001016c28418d339d9cAF59233
// deployed the factory contract
// deployed the factory contract 