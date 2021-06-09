const EthSwap = artifacts.require("EthSwap");
const SaiToken = artifacts.require("SaiToken");

module.exports = async function(deployer) {
    let tsupply = '1000000000000000000000';
    await deployer.deploy(SaiToken, tsupply);
    const token = await SaiToken.deployed();

    //Deploy EthSwap
    await deployer.deploy(EthSwap);
    const ethSwap = await EthSwap.deployed();

    //Transfer all tokens to EthSwap
    await token.transfer(ethSwap.address, tsupply);

};


