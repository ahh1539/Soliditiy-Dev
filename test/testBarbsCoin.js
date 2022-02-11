const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Barbs Coin contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    console.log("hi");

    const Barbs = await ethers.getContractFactory("Barbs");

    const barbsCoin = await Barbs.deploy();

    const ownerBalance = await barbsCoin.balanceOf(owner.address);
    expect(await barbsCoin.totalSupply()).to.equal(329);
  });
});
