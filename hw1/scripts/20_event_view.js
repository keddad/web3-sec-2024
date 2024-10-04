const hre = require("hardhat");

async function main() {
  try {
    const token = await hre.ethers.getContractFactory("KeddadERC20");
    const [ owner, otherSigner ] = await ethers.getSigners();

    // may change, but hardhat has zero sane options to pass args to a script, because once again, it sucks
    const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    const contract = await token.attach(contractAddress);

    console.log(await contract.queryFilter("Transfer"));
    // console.log(await contract.queryFilter("TransferSingle"));
    // console.log(await contract.queryFilter("TransferBatch"));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();