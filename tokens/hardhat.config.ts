import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import "dotenv/config";

const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris", // Bắt buộc để tương thích mạng TrustKeys L1
        },
      },
      production: {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris",
        },
      },
    },
  },
  networks: {
    trustkeys: {
      type: "http",
      chainType: "l1",
      url: "https://l1testnet.trustkeys.network",
      chainId: 11968,
      accounts: [PRIVATE_KEY],
    },
  },
});