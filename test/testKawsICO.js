const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Kaws ICO contract", function () {
  let Token;
  let kawsICO;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Kaws = await ethers.getContractFactory("KawsICO");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Kaws.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    kawsICO = await Kaws.deploy(
      "Kaws Coin",
      "KAWS",
      "300000000000000000000000",
      "0xa2F0bFDCE970af39F7c1B3Ab7639EF239728F213"
    );
  });

  describe("Deployment", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await kawsICO.balanceOf(owner.address);
      expect(await kawsICO.name()).to.equal("Kaws Coin");
      expect(await kawsICO.symbol()).to.equal("KAWS");
      expect(await kawsICO.decimals()).to.equal(18);
      expect(await kawsICO.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transfers during lockup", function () {
    it("transfer fails if lockup is still active", async function () {
      // owner transfer 500 BARBS -> addr1
      await expect(kawsICO.transfer(addr1.address, "500000000000000000000")).to.be.revertedWith("Tokens are locked"); // 500 KAWS
    });

    it("transferFrom works if lockup is passed", async function () {
      const unlockTime = 3024000; // unlock time from contract
      await ethers.provider.send("evm_increaseTime", [unlockTime]);
      await ethers.provider.send("evm_mine");

      // owner account approves add1 to spend 500 KAWS
      await kawsICO.approve(addr1.address, "500000000000000000000"); // 500 KAWS
      // addr sends 100 KAWS from owner to addr2
      await kawsICO.connect(addr1).transferFrom(owner.address, addr2.address, "100000000000000000000"); //100 KAWS
      expect(await kawsICO.balanceOf(addr2.address)).to.equal("100000000000000000000"); // 100 KAWS
      expect(await kawsICO.balanceOf(addr1.address)).to.equal("0");
      expect(await kawsICO.allowance(owner.address, addr1.address)).to.equal("400000000000000000000"); // 400 KAWS
      expect(await kawsICO.balanceOf(owner.address)).to.equal("299900000000000000000000"); // 295,000 KAWS
    });

    it("transferFrom fails if lockup is still active", async function () {
      // owner apporves addr1 to spend 500 BARBS from their account
      kawsICO.approve(addr1.address, "500000000000000000000"); // 500 KAWS
      await expect(
        kawsICO.connect(addr1).transferFrom(owner.address, addr1.address, "1000000000000000000") //100 KAWS
      ).to.be.revertedWith("Tokens are locked");
    });
  });

  describe("ICO invest", function () {
    it("invest 1 ETH = 1000 KAWS", async function () {
      let overrides = {
        // The amount to send with the transaction (i.e. msg.value)
        value: "1000000000000000000", // 1 ETH
      };
      kawsICO.connect(addr1).invest(overrides); // buy 1000 KAWS
      expect(await kawsICO.balanceOf(addr1.address)).to.equal("1000000000000000000000");
    });

    it("invest fails when above max amount", async function () {
      let amount = ((await kawsICO.maxInvestment()) + 10).toString();
      let overrides = {
        // The amount to send with the transaction (i.e. msg.value)
        value: amount, // max investment + 1 wei
      };
      // attempt to buy over max investment ETH of Kaws
      await expect(kawsICO.connect(addr1).invest(overrides)).to.be.revertedWith("Investment parameters not met");
    });

    it("invest fails when below min amount", async function () {
      let amount = ((await kawsICO.minInvestment()) - 10).toString();
      let overrides = {
        // The amount to send with the transaction (i.e. msg.value)
        value: amount, // min investment - 10 wei
      };
      // attempt to buy under min investment amount of KAWS
      await expect(kawsICO.connect(addr1).invest(overrides)).to.be.revertedWith("Investment parameters not met");
    });

    it("test halting ICO", async function () {
      let amount = (await kawsICO.maxInvestment()).toString();
      let overrides = {
        // The amount to send with the transaction (i.e. msg.value)
        value: amount,
      };

      // running state
      expect(await kawsICO.getCurrentState()).to.equal(1);

      // halt ICO
      await kawsICO.halt();
      expect(await kawsICO.getCurrentState()).to.equal(3);

      // attempt to invest while halted
      await expect(kawsICO.connect(addr1).invest(overrides)).to.be.revertedWith("ICO has not started");

      // resume ICO
      await kawsICO.resume();
      expect(await kawsICO.getCurrentState()).to.equal(1);

      // investment goes through successfully
      await kawsICO.connect(addr1).invest(overrides);
      expect(await kawsICO.balanceOf(addr1.address)).to.equal("10000000000000000000000"); // 10,000 KAWS
    });

    it("Purchase all KAWS", async function () {
      let amount = (await kawsICO.maxInvestment()).toString();

      for (let i = 0; i < 30; i++) {
        await kawsICO.connect(addr1).invest({ value: amount }); // buy 10 eth of KAWS
      }
      await expect(kawsICO.connect(addr1).invest({ value: "100000000000000000" })).to.be.revertedWith(
        "Hardcap has been reached"
      ); // buy .1 eth of kaws
    });
  });

  describe("Token burn", function () {
    it("Burns all owners tokens at ICO completion", async function () {
      await kawsICO.connect(addr1).invest({ value: "5000000000000000000" }); // buy 5000 KAWS
      const unlockTime = 604800; // unlock time from contract
      await ethers.provider.send("evm_increaseTime", [unlockTime]);
      await ethers.provider.send("evm_mine");

      expect(await kawsICO.balanceOf(owner.address)).to.equal("295000000000000000000000"); // 299,500 KAWS
      await kawsICO.burn();
      expect(await kawsICO.balanceOf(owner.address)).to.equal("0"); // 299,500 KAWS
      expect(await kawsICO.totalSupply()).to.equal("5000000000000000000000");
    });
  });
});
