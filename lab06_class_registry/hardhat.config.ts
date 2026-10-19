import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

const TRUSTKEYS_PRIVATE_KEY = "0x_dien_private_key_metamask_cua_ban_vao_day";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
        settings: {
          evmVersion: "paris", // <-- BẮT BUỘC THÊM DÒNG NÀY ĐỂ TRÁNH LỖI PUSH0
        },
      },
      production: {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris", // <-- BẮT BUỘC THÊM DÒNG NÀY
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    trustkeys: {
      type: "http",
      chainType: "l1",
      url: "https://l1testnet.trustkeys.network",
      chainId: 11968,
      accounts: ["59e783617bdbbed6614c597e96eec1b73e1a3fe0de4342f56d6077d5955e5919"],
    },
  },
});