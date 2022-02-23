const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Barbs Coin contract", function () {
  let Token;
  let barbsCoin;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Barbs = await ethers.getContractFactory("Barbs");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Barbs.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    barbsCoin = await Barbs.deploy("Barbs Coin", "BARBS", "300000000000000000000000");
  });

  describe("Deployment", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await barbsCoin.balanceOf(owner.address);
      expect(await barbsCoin.name()).to.equal("Barbs Coin");
      expect(await barbsCoin.symbol()).to.equal("BARBS");
      expect(await barbsCoin.decimals()).to.equal(18);
      expect(await barbsCoin.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transfers", function () {
    it("Transfer tokens from owner to another address after creation", async function () {
      // owner transfer 500 BARBS -> addr1
      await barbsCoin.transfer(addr1.address, "500000000000000000000"); // 500 BARBS
      expect(await barbsCoin.balanceOf(addr1.address)).to.equal("500000000000000000000");
      expect(await barbsCoin.balanceOf(owner.address)).to.equal("299500000000000000000000"); // 299,500 BARBS

      // addr1 transfer 100 BARBS - addr2
      await barbsCoin.connect(addr1).transfer(addr2.address, "100000000000000000000"); // 100 BARBS
      expect(await barbsCoin.balanceOf(addr2.address)).to.equal("100000000000000000000");
      expect(await barbsCoin.balanceOf(addr1.address)).to.equal("400000000000000000000"); // 400 BARBS
    });

    it("Transfer fails if sender has no tokens", async function () {
      // addr3 trys to send 1 BARBS but has no balance
      await expect(barbsCoin.connect(addr3).transfer(owner.address, "100000000000000000")).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance"
      );

      const ownerBalance = await barbsCoin.balanceOf(owner.address);

      expect(ownerBalance).to.equal(await barbsCoin.totalSupply());
    });

    it("transferFrom working properly", async function () {
      // addr1 tries to send 100 tokens from owner to addr2 without approval
      await expect(
        barbsCoin.connect(addr1).transferFrom(owner.address, addr2.address, "100000000000000000000")
      ).to.be.revertedWith("ERC20: insufficient allowance");

      // owner account approves add1 to spend 500 Tokens
      await barbsCoin.approve(addr1.address, "500000000000000000000"); // 500 Tokens

      // addr sends 100 Tokens from owner to addr2
      await barbsCoin.connect(addr1).transferFrom(owner.address, addr2.address, "100000000000000000000"); //100 Tokens
      expect(await barbsCoin.balanceOf(addr2.address)).to.equal("100000000000000000000"); // 100 Tokens
      expect(await barbsCoin.balanceOf(addr1.address)).to.equal("0");
      expect(await barbsCoin.allowance(owner.address, addr1.address)).to.equal("400000000000000000000"); // 400 Tokens
      expect(await barbsCoin.balanceOf(owner.address)).to.equal("299900000000000000000000"); // 299,500 Tokens
    });
  });
});
