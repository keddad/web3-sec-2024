const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KeddadERC20Deploy", (m) => {
  const ERC20 = m.contract("KeddadERC20");
  return { ERC20 };
});
