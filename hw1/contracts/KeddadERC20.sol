// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract KeddadERC20 is ERC20, Ownable, ERC20Permit {
    constructor(
        address initialOwner
    )
        ERC20("KeddadERC20", "KD")
        Ownable(initialOwner)
        ERC20Permit("KeddadERC20")
    {
        _mint(msg.sender, 1337_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function buy(address to) public payable {
        // 1-1 exchange ratio for wei
        _mint(to, msg.value);
    }

    function _costlyTransfer(address from, address to, uint256 value) private {
        uint256 fee = 10; // 10 tokens for any transfer

        _transfer(from, to, value);
        _burn(from, fee); // just burn fee tokens
    }

    /// @notice Transfer funds, as per ERC20 interface
    /// @notice On each transfer, additional 10 tokens from sender will be burned as fee
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        // I'm not actually sure how OZ checks for sufficient funds
        // Also, solidity is stupid, where is my "return false" branch on fail
        _costlyTransfer(msg.sender, recipient, amount);
        return true;
    }

    /// @notice Transfer previously approved funds, as per ERC20 interface
    /// @notice On each transfer, additional 10 tokens from sender will be burned as fee
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _costlyTransfer(from, to, value);
        return true;
    }
}
