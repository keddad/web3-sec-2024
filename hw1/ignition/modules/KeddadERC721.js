const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { network } =  require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    const Token = await ethers.getContractFactory("KeddadERC721");
    const token = await Token.deploy(deployer.address);

    console.log("Token address:", await token.getAddress());

    return { token };
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });