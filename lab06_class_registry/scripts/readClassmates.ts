import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  // Dán địa chỉ contract vừa deploy in ra ở Bước 3 vào đây
  const CONTRACT_ADDRESS = "0x1dF02D85e5E7AfB1c8985c475895E385C992001E";

  const registry = await ethers.getContractAt("ClassRegistry", CONTRACT_ADDRESS);

  console.log("Đang quét các event StudentRegistered từ block 0 đến latest...");
  const filter = registry.filters.StudentRegistered();
  const events = await registry.queryFilter(filter, 0, "latest");

  console.log(`\n=== DANH SÁCH BẠN HỌC ĐÃ ĐĂNG KÝ (${events.length} bạn) ===`);
  for (let i = 0; i < events.length; i++) {
    const event = events[i] as any;
    const { studentAddress, name } = event.args;
    console.log(`${i + 1}. Tên: ${name} | Địa chỉ ví: ${studentAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});