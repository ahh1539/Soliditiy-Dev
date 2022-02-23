![GitHub contributors](https://img.shields.io/github/contributors/ahh1539/Soliditiy-Dev)
![Forks](https://img.shields.io/github/forks/ahh1539/Soliditiy-Dev)
![Stars](https://img.shields.io/github/stars/ahh1539/Soliditiy-Dev)
![Last Commit](https://img.shields.io/github/last-commit/ahh1539/Soliditiy-Dev)
![Repo Size](https://img.shields.io/github/repo-size/ahh1539/Soliditiy-Dev)
![Latest Release](https://img.shields.io/github/v/release/ahh1539/Soliditiy-Dev?include_prereleases)
![Website Status](https://img.shields.io/website?down_color=red&down_message=Offline&up_color=green&up_message=Online&url=https%3A%2F%2Fbarbs-coin.web.app%2F)

# Soliditiy-Dev

Deploy using Remix or Hardhat

## Resources

Remix: https://remix.ethereum.org/

ERC20 Docs: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

Rinkeby (ETH testnet) Explorer: https://rinkeby.etherscan.io/

Mumbai (Polygon testnet) Explorer: https://mumbai.polygonscan.com/

## Build and deploy

Build: `yarn build`

Deploy: `firebase deploy`

## Hardhat commands

run hardhat network locally: `npx hardhat node`

run hardhat tests: `npx hardhat test`

compiling the contracts: `npx hardhat compile`

## Deploying contracts

```
// BARBS Coin

deploying on local hardhat network: `npx hardhat run scripts/deployBarbsCoin.js --network localhost`

deploying on rinkeby network: `npx hardhat run scripts/deployBarbsCoin.js --network rinkeby`
```

```
// KAWS Coin

deploying on local hardhat network: `npx hardhat run scripts/deployKawsICO.js --network localhost`

deploying on rinkeby network: `npx hardhat run scripts/deployKawsICO.js --network rinkeby`
```
