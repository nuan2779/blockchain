import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  // Dán địa chỉ ClassBadge vừa deploy ở Bước 1
  const BADGE_ADDRESS = "0xa11fDc103e814928eE020FDCD81B5fC2e5763707";
  const TOKEN_ID = 0;

  const [deployer] = await ethers.getSigners();
  const badge = await ethers.getContractAt("ClassBadge", BADGE_ADDRESS);

  // Mint badge số 0 nếu chưa được mint
  try {
    console.log("Đang gọi mint ClassBadge cho ví:", deployer.address);
    const mintTx = await badge.mint(deployer.address, "Nguyen Huu Luan");
    await mintTx.wait();
    console.log("Đã mint thành công Token ID 0!");
  } catch (err) {
    console.log("Token ID 0 đã được mint từ trước, bắt đầu giải mã tokenURI...");
  }

  // Đọc chuỗi data:application/json;base64,... từ on-chain
  console.log(`\nĐang đọc tokenURI(${TOKEN_ID}) từ hợp đồng on-chain...`);
  const uri = await badge.tokenURI(TOKEN_ID);

  // 1. Giải mã JSON Metadata
  const jsonBase64 = uri.split(",")[1];
  const decodedJson = Buffer.from(jsonBase64, "base64").toString("utf8");
  const meta = JSON.parse(decodedJson);

  console.log("\n================ KẾT QUẢ GIẢI MÃ METADATA JSON ================");
  console.log(JSON.stringify(meta, null, 2));

  // 2. Giải mã SVG bên trong trường 'image'
  const svgBase64 = meta.image.split(",")[1];
  const decodedSvg = Buffer.from(svgBase64, "base64").toString("utf8");

  console.log("\n================ KẾT QUẢ GIẢI MÃ ON-CHAIN SVG ================");
  console.log(decodedSvg);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});