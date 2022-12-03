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


//First deployment 
//Compiled 7 Solidity files successfully
//deploying the implementation contract
//deployed the implementation contract at:  0x0A86f4b21c2D727e827B5276C7E4e78C283EF769
//deployed the factory contract
//deployed the factory contract t:  0xA4FE6F7DfCDbEd4cF0af65342fA8056D06373270

////CONTRACT_ADDRESS = "0x3b9bA781797b57872687Ce5d5219A1A4Bc0e85ea"

//Second deplyment
//deploying the implementation contract
//deployed the implementation contract at:  0xB6b49c449ba56C1216aF4BedAe39449240727700
//deployed the factory contract
//deployed the factory contract t:  0xB30820Cc0D97Bb44bA44d8F8C8099D297b32BF63

//Third deployent
//deploying the implementation contract
//deployed the implementation contract at:  0x86a3d466D123df0940c395204a42E7aF3163b60A
//deployed the factory contract
//deployed the factory contract t:  0xe4c704edb5bEd6AE55C836B1971cCdF9906B04Ee

//Fourth deployment
// deploying the implementation contract
// deployed the implementation contract at:  0xd8309eD5Ad83EE7C4f80831d49B3BCB647C353FD
// deployed the factory contract
// deployed the factory contract t:  0xb239230eDaB0eDb0275472a7Ec1931f7EB792034

//firth deplyment
// deploying the implementation contract
// deployed the implementation contract at:  0x2560d32C3FF30084b6916C12F636CB6a27E09BE3
// deployed the factory contract
// deployed the factory contract t:  0x58D337EEe7ec0aB11f348B692bA77e92B7c50250