import { defineChain } from "viem";

export const trustkeys = defineChain({
  id: 11968,
  name: "TrustKeys L1 Testnet",
  nativeCurrency: {
    name: "TrustKeys Coin",
    symbol: "TKC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://l1testnet.trustkeys.network"],
    },
  },
  testnet: true,
});