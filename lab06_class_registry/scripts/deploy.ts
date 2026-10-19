import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  const [deployer] = await ethers.getSigners();
  console.log("Ví triển khai:", deployer.address);

  console.log("Đang deploy contract ClassRegistry...");
  const registry = await ethers.deployContract("ClassRegistry");
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("\nClassRegistry đã deploy thành công tại on-chain address:");
  console.log(">>>", contractAddress);

  // Tự đăng ký danh tính (theo yêu cầu "+ register" của đề bài)
  console.log("\nĐang gửi giao dịch đăng ký danh tính...");
  const tx = await registry.register("Nguyen Huu Luan");
  await tx.wait();
  console.log("Đã đăng ký thành công danh tính on-chain!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});