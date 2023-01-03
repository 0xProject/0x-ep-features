import path from "path";
import { Chain } from "./constants";

const CHAIN_TO_ETHERSCAN_BASE_URL: Record<Chain, string> = {
  [Chain.Ethereum]: "https://etherscan.io",
  [Chain.Polygon]: "https://polygonscan.com",
  [Chain.BinanceSmartChain]: "https://bscscan.com",
  [Chain.Fantom]: "https://ftmscan.com",
  [Chain.Avalanche]: "https://snowtrace.io",
  [Chain.Celo]: "",
  [Chain.Optimism]: "https://optimistic.etherscan.io",
  [Chain.Arbitrum]: "https://arbiscan.io",
  [Chain.Mumbai]: "https://mumbai.polygonscan.com",
  [Chain.Goerli]: "https://goerli.etherscan.io",
};

export function getEtherscanAddressUrl(params: {
  chain: Chain;
  address: string;
}): string {
  const { chain, address } = params;
  const baseUrl = CHAIN_TO_ETHERSCAN_BASE_URL[chain];

  return path.join(baseUrl, "address", address);
}
