import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();
  console.log("Triển khai ClassBadge bằng tài khoản:", deployer.address);

  const badge = await ethers.deployContract("ClassBadge");
  await badge.waitForDeployment();

  const badgeAddress = await badge.getAddress();
  console.log("ClassBadge đã deploy thành công tại địa chỉ on-chain:");
  console.log(">>> BADGE_ADDRESS =", badgeAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});