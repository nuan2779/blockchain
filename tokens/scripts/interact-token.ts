import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  // 1. Dán địa chỉ ClassToken vừa deploy
  const TOKEN_ADDRESS = "0x632b509524B42dA1372F533017a7Ee811090a93B";

  // 2. Dán địa chỉ ví người nhận (ví bạn cùng lớp hoặc ví phụ của bạn)
  const RECIPIENT_ADDRESS = "0x5fcb7578f8fAdF781a5f48bFC1AdC2949042B322";

  const token = await ethers.getContractAt("ClassToken", TOKEN_ADDRESS);
  const amount = ethers.parseEther("100"); // 100 CTK

  console.log(`Đang gửi giao dịch chuyển 100 CTK đến ví ${RECIPIENT_ADDRESS}...`);
  const tx = await token.transfer(RECIPIENT_ADDRESS, amount);
  await tx.wait();

  console.log("Chuyển thành công 100 CTK!");
  console.log("Mã giao dịch (Tx Hash):", tx.hash);

  const newBalance = await token.balanceOf(RECIPIENT_ADDRESS);
  console.log(`Số dư hiện tại của ví nhận: ${ethers.formatEther(newBalance)} CTK`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});