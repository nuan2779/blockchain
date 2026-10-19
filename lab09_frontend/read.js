import { createPublicClient, http, formatEther } from "viem";
import { trustkeys } from "./trustkeys.js";
import { classTokenAbi, classBadgeAbi } from "./abis.js";

const publicClient = createPublicClient({
  chain: trustkeys,
  transport: http(),
});

async function main() {
  console.log("=== THÔNG TIN MẠNG TRUSTKEYS L1 ===");
  const blockNumber = await publicClient.getBlockNumber();
  const block = await publicClient.getBlock();

  console.log("Block Number hiện tại:", blockNumber);
  console.log("Block ExtraData:", block.extraData);
  console.log("Độ dài extraData (bytes):", (block.extraData.length - 2) / 2);

  // Đọc thông tin ClassToken nếu có biến môi trường TOKEN
  const tokenAddress = process.env.TOKEN;
  if (tokenAddress) {
    console.log("\n=== THÔNG TIN TOKEN ===");
    const [name, symbol, decimals] = await Promise.all([
      publicClient.readContract({ address: tokenAddress, abi: classTokenAbi, functionName: "name" }),
      publicClient.readContract({ address: tokenAddress, abi: classTokenAbi, functionName: "symbol" }),
      publicClient.readContract({ address: tokenAddress, abi: classTokenAbi, functionName: "decimals" }),
    ]);

    console.log(`Token: ${name} (${symbol}), Decimals: ${decimals}`);
  }

  // Đọc và giải mã ClassBadge nếu có biến BADGE
  const badgeAddress = process.env.BADGE;
  if (badgeAddress) {
    console.log("\n=== GIẢI MÃ CLASSBADGE ===");
    const uri = await publicClient.readContract({
      address: badgeAddress,
      abi: classBadgeAbi,
      functionName: "tokenURI",
      args: [0n],
    });
    const jsonStr = Buffer.from(uri.split(",")[1], "base64").toString("utf-8");
    console.log("Decoded Metadata:", JSON.parse(jsonStr));
  }
}

main().catch(console.error);