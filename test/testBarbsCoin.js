const { expect } = require("chai");

describe("Barbs Coin contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Barbs = await ethers.getContractFactory("Barbs");

    const barbsCoin = await Barbs.deploy();

    const ownerBalance = await barbsCoin.balanceOf(owner.address);
    expect(await barbsCoin.totalSupply()).to.equal(ownerBalance);
  });
});