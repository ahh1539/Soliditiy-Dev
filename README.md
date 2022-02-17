# Soliditiy-Dev

Deploy using Remix or Hardhat

## Resources

Remix: https://remix.ethereum.org/

ERC20 Docs: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

Rinkeby (ETH testnet) Explorer: https://rinkeby.etherscan.io/

Mumbai (Polygon testnet) Explorer: https://mumbai.polygonscan.com/

<br/>

## Build and deploy

Build: `yarn build`

Deploy: `firebase deploy`

## Hardhat commands

run hardhat network locally: `npx hardhat node`

run hardhat tests: `npx hardhat test`

compiling the contracts: `npx hardhat compile`

deploying on local hardhat network: `npx hardhat run scripts/deployBarbsCoin.js --network localhost`

deploying on rinkeby network: `npx hardhat run scripts/deployBarbsCoin.js --network rinkeby`
