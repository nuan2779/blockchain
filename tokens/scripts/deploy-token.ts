import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();
  console.log("Triển khai ClassToken bằng tài khoản:", deployer.address);

  // Mint toàn bộ 1,000,000 CTK cho deployer lúc khởi tạo
  const token = await ethers.deployContract("ClassToken", [deployer.address]);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("ClassToken đã deploy thành công tại địa chỉ on-chain:");
  console.log(">>> TOKEN_ADDRESS =", tokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});