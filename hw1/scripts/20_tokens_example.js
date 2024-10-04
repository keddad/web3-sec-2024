const hre = require("hardhat");

async function main() {
  try {
    const token = await hre.ethers.getContractFactory("KeddadERC20");
    const [ owner, otherSigner ] = await ethers.getSigners();

    // may change, but hardhat has zero sane options to pass args to a script, because once again, it sucks
    const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    const contract = await token.attach(contractAddress);

    await contract.mint(owner.address, 100500);
    await contract.transfer(otherSigner.address, 500);

    await contract.approve(otherSigner.address, 500);
    await contract.connect(otherSigner).transferFrom(owner.address, otherSigner.address, 500);

    await contract.buy(otherSigner.address, {value: 500});

    newOwnerBalance = await contract.balanceOf(owner.address);
    newOtherBalance = await contract.balanceOf(otherSigner.address);

    console.log(newOwnerBalance);
    console.log(newOtherBalance);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();