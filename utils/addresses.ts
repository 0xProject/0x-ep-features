import {
  ChainId,
  getContractAddressesForChainOrThrow,
} from "@0x/contract-addresses";
import { Chain } from "./constants";

const CHAIN_TO_CHAIN_ID: Record<Chain, ChainId> = {
  ethereum: ChainId.Mainnet,
  polygon: ChainId.Polygon,
  bsc: ChainId.BSC,
  fantom: ChainId.Fantom,
  avalanche: ChainId.Avalanche,
  celo: ChainId.Celo,
  optimism: ChainId.Optimism,
  arbitrum: ChainId.Arbitrum,
  mumbai: ChainId.PolygonMumbai,
  goerli: ChainId.Goerli,
};

export function getExchangeProxyAddress(chain: Chain): string {
  return getContractAddressesForChainOrThrow(CHAIN_TO_CHAIN_ID[chain])
    .exchangeProxy;
}
