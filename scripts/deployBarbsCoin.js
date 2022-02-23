async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Barbs = await ethers.getContractFactory("Barbs");
  const barbsCoin = await Barbs.deploy("Barbs Coin", "BARBS", "300000000000000000000000");

  console.log("BARBS address:", barbsCoin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
