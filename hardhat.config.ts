import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-packager";
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

// Get deployer key 
// get blockscout url

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.5.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  gasReporter: {
    currency: "USD",
  },

  namedAccounts: {
    deployer: process.env.DEPLOYER_KEY ?? 0,
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    evmostestnet: {
      url: "https://evmos-archive-testnet.api.bdnodes.net:8545",
      deploy: ["deploy/evmos"]
    },
    evmos: {
      url: "<RPC>",
      deploy: ["deploy/evmos"]
    }
  },

  typechain: {
    outDir: "./src",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  },

  // config for hardhat-packager
  // https://www.npmjs.com/package/hardhat-packager
  packager: {
    contracts: [
      "WEVMOS9"
    ],
    includeFactories: true,
  }
};
