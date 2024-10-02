const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MaxUint256 } = require("@ethersproject/constants");

describe("KeddadERC20", function () {
    async function deployKeddadERC20() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("KeddadERC20");
        const ERC20_deployed = await ERC20.deploy(owner);

        return { ERC20_deployed, owner, otherAccount };
    }

    async function getPermitSignature(signer, token, spender, value, deadline) {
        const [nonce, name, version, chainId] = await Promise.all([
            token.nonces(signer.address),
            token.name(),
            "1",
            (await signer.provider.getNetwork()).chainId,
        ])

        const domain = {
            "name": name,
            "version": version,
            "chainId": chainId,
            "verifyingContract": token.address
        };

        const types = {
            Permit: [{
                name: "owner",
                type: "address"
                },
                {
                name: "spender",
                type: "address"
                },
                {
                name: "value",
                type: "uint256"
                },
                {
                name: "nonce",
                type: "uint256"
                },
                {
                name: "deadline",
                type: "uint256"
                },
            ],
        };
        
        const values = {
            "owner": signer.address,
            "spender": spender.address,
            "value": 42n,
            "nonce": 0n,
            "deadline": ethers.MaxUint256,
        };

        // this thows
        // TypeError: invalid BigNumberish value (argument="value", value={ "hex": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "type": "BigNumber" }, code=INVALID_ARGUMENT, version=6.13.2)
        // I've spent several hours debugging this, and I can confidently say that ethers.js and it's docs are a pile of shit
        signature = await signer.signTypedData(domain, types, values);

        return ethers.Signature.from(signature);
    }

    describe("Deployment", function () {
        it("StartupAmountMatches", async function () {
            const { ERC20_deployed } = await loadFixture(deployKeddadERC20);

            expect(await ERC20_deployed.totalSupply()).to.equal(1337_000_000n * 10n ** 18n);
        });
    });

    describe("Transfer", function () {
        it("TestTransfer", async function () {
            const { ERC20_deployed, owner, otherAccount } = await loadFixture(deployKeddadERC20);

            initialOwnerAmount = await ERC20_deployed.balanceOf(owner);

            await ERC20_deployed.transfer(otherAccount, 100);

            newOwnerAmount = await ERC20_deployed.balanceOf(owner);
            newOtherAmount = await ERC20_deployed.balanceOf(otherAccount);

            expect(newOwnerAmount).to.equal(initialOwnerAmount - 100n - 10n);
            expect(newOtherAmount).to.equal(100n);
        })

        it("TestTransferFrom", async function () {
            const { ERC20_deployed, owner, otherAccount } = await loadFixture(deployKeddadERC20);
            initialOwnerAmount = await ERC20_deployed.balanceOf(owner);

            await ERC20_deployed.approve(otherAccount, 100);
            await ERC20_deployed.connect(otherAccount).transferFrom(owner, otherAccount, 100);

            newOwnerAmount = await ERC20_deployed.balanceOf(owner);
            newOtherAmount = await ERC20_deployed.balanceOf(otherAccount);

            expect(newOwnerAmount).to.equal(initialOwnerAmount - 100n - 10n);
            expect(newOtherAmount).to.equal(100n);
        })

        /*
        // This should work, but...
        it("DemoPermit", async function () {
            const { ERC20_deployed, owner, otherAccount } = await loadFixture(deployKeddadERC20);
            initialOwnerAmount = await ERC20_deployed.balanceOf(owner);

            const { v, r, s } = await getPermitSignature(
                owner,
                ERC20_deployed,
                otherAccount,
                100n,
                MaxUint256
            );

            await ERC20_deployed.permit(owner, otherAccount, 100, MaxUint256, v, r, s);
            await ERC20_deployed.connect(otherAccount).transferFrom(owner, otherAccount, 100);

            newOtherAmount = await ERC20_deployed.balanceOf(otherAccount);
            expect(newOtherAmount).to.equal(100n);
        })

        */
    });
}); 