const { assert } = require("chai");
// const web3 = require('web3');

const SaiToken = artifacts.require("SaiToken");
const EthSwap = artifacts.require("EthSwap");

require("chai").use(require("chai-as-promised")).should();

const tsupply = web3.utils.toWei("1000", "ether"); //ether

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;

  before(async () => {
    token = await SaiToken.new(tsupply);
    ethSwap = await EthSwap.new(token.address);
    //transfer all tokens to EthSwap
    await token.transfer(ethSwap.address, tsupply);
  });

  describe("SaiToken deployment", async () => {
    it("SaiToken has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Sai Stablecoin (SAI)");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has received all tokens", async () => {
      let contractBal = await token.balanceOf(ethSwap.address);
      assert.equal(tsupply, contractBal.toString());
    });
  });

  describe("buyTokens()", async () => {
    let result;

    before(async () => {
      //purchase token before each test
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });

    it("Allow user to instantly purchase tokns from ethSwap for a fixed price", async () => {
      //Check inverstor balance after purhcse
      let investorBal = await token.balanceOf(investor);
      assert.equal(investorBal.toString(), tokens("100"));

      //check ethswap bal after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("900"));

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "Ether"));

      // console.log(result.logs[0].args);

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("sellTokens()", async () => {
    let result;

    before(async () => {
      await token.approve(ethSwap.address, tokens("100"), { from: investor });
      result = await ethSwap.sellTokens(tokens("100"), { from: investor });
    });

    it("Allow user to instantly sell tokens to ethSwap for a fixed price", async () => {
      //Check inverstor balance after purhcse
      let investorBal = await token.balanceOf(investor);
      assert.equal(investorBal.toString(), tokens("0"));

      //check ethswap bal after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1000"));

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("0", "Ether"));

      // //check for the event
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");

      // FAILURE: ivnerstor can't selll more tokens thatn they have
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
