# Crowdfunding 

Crowdfunding is the use of small amounts of capital from a large number of individuals to finance a new business venture. Crowdfunding makes use of the easy accessibility of vast networks of people through social media and crowdfunding websites to bring investors and entrepreneurs together, with the potential to increase entrepreneurship by expanding the pool of investors beyond the traditional circle of owners, relatives, and venture capitalists.

## Types of crowdfunding

- **Donation:** Donation-based crowdfunding is when people give a project, company or person money for nothing in return. Let’s say you create a crowdfunding project to purchase new equipment for your company. The individuals who give you money do it out of support for the growth of your business and nothing else.

- **Debt:** Debt-based donations are peer-to-peer (P2P) lending, which is a form of crowdfunding. In debt-based donations, the money pledged by backers is a loan and must be repaid with interest by a certain deadline.

- **Rewards:** This is when donors receive something in return for their donations. The rewards vary by the size of the donation, which incentivizes higher contributions. Based on how much money participants give to a project, they may receive a T-shirt, the product or service – often at a discounted rate.

- **Equity:** While some crowdfunding projects don’t allow backers to own a portion of the company they’re supporting, equity-based crowdfunding allows small businesses and startups to give away a portion of their business in exchange for funding. These donations are a type of investment, where participants receive shares in the business based on how much money they contribute.

## Why blockchain based crowd funding

- **Decentralization:** The blockchain is the perfect solution for anyone looking to crowdfund a project. It is completely decentralized, so it does not rely on any one platform or group of platforms to raise funds. This means that any project has a chance of getting visibility and getting funded. The blockchain also eliminates the problem of fees. While it does cost a bit of money to keep the blockchain running, you will save a lot of money on transaction fees. This makes crowdfunding less expensive for creators and investors.
- **Universal availability:** Blockchain-based crowdfunding has the potential to fund any project. Any person with an internet connection can contribute to those projects. There may be some demand for discovery and visibility platforms, but there is no fundamental limitation on blockchain-based crowdfunding projects.
- **Accountability:** 

## Our project

We have developed a donation-based crowdfunding platform. Any user can connect their wallet and create a new crowdfunding project.

### Fee

To register for a new crowdfunding project, the owner pays a small fee of 0.001 ether, to the platform.

### Milestones

These are provable goals set by the project owner over a specific period of time. They enable the release/withdraw of funds. A project has a maximum of three milestones.

When each milestone is reached and accepted by a ratio of two thirds (2/3) of the donors through voting , then a portion of the funds is released to project owner to facilitate project progress. 

A second second milestone cannot be set if the specified period for the first milestone is not over. The case is the same if the project owner tries to set a third milestone while the second milestone is still in progress. 

### Voting

The platform uses governance voting system to release funds to the project owner. Only donors to the project are allowed to vote on a milestone within the specified period. In instances where a donor, votes more than once, only the first vote is considered. 

Donors can only vote `yes` or `no` on a milestone. If a donor, does not vote, their vote is considered as a `yes`.

### Withdraw

The project owner can withdraw some of the funds after the specified period of a milestone is over and `2/3` of the donors have voted `yes`. The other condition to withdraw funds is when the specified period for the project is over and `2/3` of the donors have voted `yes`.

## Our Tech stack

Our project use the following technologies:

- **[Solidity](https://docs.soliditylang.org/en/v0.8.17/):** It is used to create the back-end of the application. Instead of using a database to store records of projects, the records are stored on the blockchain using `solidity`.
- **[Polygon](https://polygon.technology/):** We are specifically using the `Polygon Mumbai Testnet` as our blockchain. We chose this because it's `almost` free. We can easily get `Polygon Matic` on the `Polygon faucets`.
- **[Alchemy](https://www.alchemy.com/):** We are using Alchemy for analytics, monitoring, logging and debugging our dApp.
- **[ReactJs](https://reactjs.org/):** We are using reactjs to create the dApp front-end.

## How it works

#### Link To Live App: [https://hackathon-ui-seven.vercel.app/](https://hackathon-ui-seven.vercel.app/)

#### Note that this app was developed and tested in [Brave](https://brave.com/download/) browser using [metamask](https://metamask.io/download/), it will not work well in other browsers and wallets.

#### Home Page

When you visit the platform, you'll land on the front page as shown below. If you don't see the table, give it a minute to load. The table loads data from the Polygon Mumbai testnet.

![HomePage](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/banner1.PNG)

The table shows the projects that have registered on our platform to raise funds for their project.



- `Get Started:`Clicking this button prompts you to connect your `metamask` wallet to the platform. You can make donations or register a project on the platform only when you connect your `metamask` wallet.
- `HASH STRING:` This is the unique `ipfs` hash containing the details of the project. This value is set by the project owner when he/she is registering the project on our platform.`Click` on any of the `HASH STRINGS` links in the table to see the project details. 
- `AMOUNT TO RAISE:` This is the amount of Eth that the project wants to raise. This value is set by the project owner when he/she is registering the project on our platform.
- `AMOUNT DONATED:` This is the current amount that has been donated to the project. When a donation is made to a project, this value automatically updates. If you make a donation, just wait for some seconds for the value to update.
- `COUNT MILESTONE`: This value points to the current [milestone](#milestones) in the project. An  `empty` field means no milestone has been set. If the value is `1`, it means the project owner has set the first milestone. This is the same for `2` and `3`. 
- `NUMBER OF DONORS:` This shows how many unique people have currently donated to the project. Although a donor can make multiple donations to a project, we only count him/her once.
- `ACTION:` This is the button users `click` to make a donation to a project. To make a donation, the user first needs to connect his/her `metamask` wallet to the site. If you click `Donate` when you haven't connected your wallet, it redirects you to connect your `metamask` wallet. Once your wallet is connected, you can make donations. 

#### Connect Wallet

To connect the your metamask wallet to the site, click on the `Get Started` button. This will pop up metamask and ask you to connect your wallet to the site.

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/connecting.PNG)

Select the account(s) you would like to use once connected to the platform. 

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/connecting2.PNG)

Click `Connect` to connect the account(s) to the platform.

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/connected.PNG)

Once you are connected, you should see your account address on the page.

#### Make a Donation

You need to be [connected](#Connect-Wallet) to make a donation. Click on the `Donate` button of the project you would like to donate to. This will pop up a `metamask` window with all the transaction details filled in. An account can only make a donation of `0.1 Matic`

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/donate.PNG)

On the metamask window,  scroll down and click `Confirm`. 

Wait a minute for the donation to be reflected on the table.

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/donated.PNG)

Yay 🥳🎊  You have successfully made a donation to a project.

#### Create a Project

You need to be [connected](#Connect-Wallet) to create a project on our platform. Click on `Add Campaign` to add your project. This will pop up a form to enter your project details.

![](C:\Users\USER\Pictures\addcampaign.PNG)

- `Hash String:` This is the ipfs `CID`. We encourage you to have a pdf file containing all your project details. Upload this file to ipfs and copy the file `CID`. Paste the CID into the `Hash String` field.
- `Amount to Raise:` This is the amount you plan to raise for your project. In other cases, the `amount of donations` can exceed the `Amount to Raise`. This field excepts the amount in `Wei`. 
- `Duration:` This is specifies the time frame for your project to receive donations. This field expects the duration in `Seconds`.

## Functionalities

#### **Tasks that have been done**

- Implement the smart contract in Solidity
- Make tests for the smart contract
- Deploy to Polygon Mumbai Testnet
- Create a User Interface for the smart contract
- Connect User Interface to smart contract
- Deploy user interface on vercel 
- User are able to see a list of projects on the app
- Users are able to connect their metamask wallet to the app
- Users are able to donate to a project of their choice
- Users are able to register their project on the app

#### **Tasks not done** 

- Project owner should be able to create a milestone on a project

- Users should be able to vote on a milestone

  

## FAQ

**Where am I sending the money to?**

Answer: When a project owner registers a project on our platform, the smart contract automatically creates another smart contract specifically for the project using the `Clone Factory Pattern`. Donations are made to these smart contracts accounts and project owners are able to withdraw the funds from these accounts when [conditions](#Withdraw)  are met. 

When you click donate on a particular project, the address of the smart contract for that project is automatically loaded into the transaction details.

