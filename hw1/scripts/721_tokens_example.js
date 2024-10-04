const hre = require("hardhat");

async function main() {
  try {
    const token = await hre.ethers.getContractFactory("KeddadERC721");
    const [ owner, otherSigner ] = await ethers.getSigners();

    // may change, but hardhat has zero sane options to pass args to a script, because once again, it sucks
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const contract = await token.attach(contractAddress);

    mintRes = await contract.safeMint(owner.address, 418);
    newOwner = await contract.ownerOf(418);

    console.log(mintRes);
    console.log(newOwner);

    await contract.safeMint(owner.address, 404);
    await contract.approve(otherSigner.address, 404);
    await contract.connect(otherSigner).safeTransferFrom(owner.address, otherSigner.address, 404);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();