# Crowdfunding 

Crowdfunding is the use of small amounts of capital from a large number of individuals to finance a new business venture. Crowdfunding makes use of the easy accessibility of vast networks of people through social media and crowdfunding websites to bring investors and entrepreneurs together, with the potential to increase entrepreneurship by expanding the pool of investors beyond the traditional circle of owners, relatives, and venture capitalists.

## Types of crowdfunding

- **Donation:** Donation-based crowdfunding is when people give a campaign, company or person money for nothing in return. Let’s say you create a crowdfunding campaign to purchase new equipment for your company. The individuals who give you money do it out of support for the growth of your business and nothing else.

- **Debt:** Debt-based donations are peer-to-peer (P2P) lending, which is a form of crowdfunding. In debt-based donations, the money pledged by backers is a loan and must be repaid with interest by a certain deadline.

- **Rewards:** This is when donors receive something in return for their donations. The rewards vary by the size of the donation, which incentivizes higher contributions. Based on how much money participants give to a campaign, they may receive a T-shirt, the product or service – often at a discounted rate.

- **Equity:** While some crowdfunding campaigns don’t allow backers to own a portion of the company they’re supporting, equity-based crowdfunding allows small businesses and startups to give away a portion of their business in exchange for funding. These donations are a type of investment, where participants receive shares in the business based on how much money they contribute.

## Why blockchain based crowd funding

- **Decentralization:** The blockchain is the perfect solution for anyone looking to crowdfund a project. It is completely decentralized, so it does not rely on any one platform or group of platforms to raise funds. This means that any project has a chance of getting visibility and getting funded. The blockchain also eliminates the problem of fees. While it does cost a bit of money to keep the blockchain running, you will save a lot of money on transaction fees. This makes crowdfunding less expensive for creators and investors.
- **Universal availability:** Blockchain-based crowdfunding has the potential to fund any project. Any person with an internet connection can contribute to those projects. There may be some demand for discovery and visibility platforms, but there is no fundamental limitation on blockchain-based crowdfunding projects.
- 

## Our project

We have developed a donation-based crowdfunding platform. Any user can connect their wallet and create a new crowdfunding campaign.

### funding fee

To register for a new crowdfunding project, the owner pays a small fee of 0.001 ether, to the platform.

### milestones

These are provable goals set by the project owner over a specific period of time. They enable the release/withdraw of funds. A project has a maximum of three milestones.

When each milestone is reached and accepted by a ratio of two thirds (2/3) of the donors through voting , then a portion of the funds is released to project owner to facilitate project progress. 

A second second milestone cannot be set if the specified period for the first milestone is not over. The case is the same if the project owner tries to set a third milestone while the second milestone is still in progress. 

### governance

The platform uses governance voting system to release funds to the campaign owner. Only donors to the campaign are allowed to vote on a milestone within the specified period. In instances where a donor, votes more than once, only the first vote is considered. 

Donors can only vote `yes` or `no` on a milestone. If a donor, does not vote, their vote is considered as a `yes`.

## Our Tech stack

Our project use the following technologies:

- **[Solidity](https://docs.soliditylang.org/en/v0.8.17/):** It is used to create the back-end of the application. Instead of using a database to store records of campaigns, the records are stored on the blockchain using `solidity`.
- **[Polygon](https://polygon.technology/):** We are specifically using the `Polygon Mumbai Testnet` as our blockchain. We chose this because it's `almost` free. We can easily get `Polygon Matic` on the `Polygon faucets`.
- **[Alchemy](https://www.alchemy.com/):** We are using Alchemy for analytics, monitoring, logging and debugging our dApp.
- **[ReactJs](https://reactjs.org/):** We are using reactjs to create the dApp front-end.

## How it works

#### Link To Live App: [https://crowdfunding-ui-t5pk.vercel.app/](https://crowdfunding-ui-t5pk.vercel.app/)

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

You need to be [connected](#Connect-Wallet) to make a donation. Click on the `Donate` button of the project you would like to donate to. This will pop up a metamask window with all the transaction details filled in. An account can only make a donation of `0.1 Matic`

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/donate.PNG)

On the metamask window,  scroll down and click `Confirm`. 

Wait a minute for the donation to be reflected on the table.

![](https://raw.githubusercontent.com/deadex-ng/crowdfunding/main/images/donated.PNG)

Yay 🥳🎊  You have successfully made a donation.

#### Create a Project
