const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Barbs Coin contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Barbs = await ethers.getContractFactory("Barbs");

    const barbsCoin = await Barbs.deploy();

    const ownerBalance = await barbsCoin.balanceOf(owner.address);
    expect(await barbsCoin.name()).to.equal("Barbs Coin");
    expect(await barbsCoin.symbol()).to.equal("BARBS");
    expect(await barbsCoin.totalSupply()).to.equal(ownerBalance);
  });

  it("Transfer tokens from owner to another address after creation", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Barbs = await ethers.getContractFactory("Barbs");

    const barbsCoin = await Barbs.deploy();

    // owner transfer 500 BARBS -> addr1
    await barbsCoin.transfer(addr1.address, "500000000000000000000"); // 500 BARBS
    expect(await barbsCoin.balanceOf(addr1.address)).to.equal(
      "500000000000000000000"
    );
    expect(await barbsCoin.balanceOf(owner.address)).to.equal(
      "299500000000000000000000"
    ); // 299,500 BARBS

    // addr1 transfer 100 BARBS - addr2
    await barbsCoin
      .connect(addr1)
      .transfer(addr2.address, "100000000000000000000"); // 100 BARBS
    expect(await barbsCoin.balanceOf(addr2.address)).to.equal(
      "100000000000000000000"
    );
    expect(await barbsCoin.balanceOf(addr1.address)).to.equal(
      "400000000000000000000"
    ); // 400 BARBS
  });
});
