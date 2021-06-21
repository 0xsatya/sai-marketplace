const EthSwap = artifacts.require("EthSwap");
const SaiToken = artifacts.require("SaiToken");

module.exports = async function(deployer) {
    let tsupply = '1000000000000000000000';
    await deployer.deploy(SaiToken, tsupply);
    const token = await SaiToken.deployed();

    //Deploy EthSwap
    await deployer.deploy(EthSwap, token.address);
    const ethSwap = await EthSwap.deployed();

    //Transfer all tokens to EthSwap
    await token.transfer(ethSwap.address, tsupply);

};


//FOR BSC NETWORK use below code 

// const EthSwap = artifacts.require("EthSwap");
// const SaiBEP20token = artifacts.require("SaiBEP20token");

// module.exports = async function(deployer) {
//     let tsupply = '1000000000000000000000000';
//     await deployer.deploy(SaiBEP20token);
//     const token = await SaiBEP20token.deployed();

//     //Deploy EthSwap
//     await deployer.deploy(EthSwap, token.address);
//     const ethSwap = await EthSwap.deployed();

//     //Transfer all tokens to EthSwap
//     await token.transfer(ethSwap.address, tsupply);

// };

