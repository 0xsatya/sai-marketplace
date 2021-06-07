require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const {INFURA_API_KEY, mnemonic} = require("./.secret.json");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/" + INFURA_API_KEY),
      network_id: 42,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    },
  },
  // contracts_directory: './contracts/',
  contracts_build_directory: './src/contracts_abis/',
  compilers: {
    solc: {
      version: "^0.8.0", // A version or constraint - Ex. "^0.5.0"
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
