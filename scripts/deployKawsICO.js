async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Kaws = await ethers.getContractFactory("KawsICO");
  const KawsICO = await Kaws.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

  console.log("ICO address:", KawsICO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
