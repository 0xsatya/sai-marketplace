const Migrations = artifacts.require("Migrations");
// const SaiToken = artifacts.require("SaiToken");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  // deployer.deploy(SaiToken, '1000000000000000000000');
  // const saiToken = await SaiToken.deploy();  
};


