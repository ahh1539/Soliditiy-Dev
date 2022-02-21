async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account ETH balance:", (await deployer.getBalance()).toString());

  const Kaws = await ethers.getContractFactory("KawsICO");
  const KawsICO = await Kaws.deploy("0xa2F0bFDCE970af39F7c1B3Ab7639EF239728F213");

  console.log("ICO address:", KawsICO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
