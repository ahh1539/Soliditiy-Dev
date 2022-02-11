require("@nomiclabs/hardhat-waffle");
keys = require("./secrets.js");

TEST_WALLET_KEY = keys.TEST_WALLET_KEY;
RINKEBY_ALCHEMY_KEY = keys.RINKEBY_ALCHEMY_KEY;

module.exports = {
  solidity: {
    version: "0.8.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${RINKEBY_ALCHEMY_KEY}`,
      accounts: [`${TEST_WALLET_KEY}`],
    },
  },
};
