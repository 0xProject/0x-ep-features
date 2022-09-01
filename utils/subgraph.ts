import { gql, request } from "graphql-request";
import * as _ from "radash";
import { Chain } from "./constants";

const CHAIN_TO_SUBGRAPH_URL: Record<Chain, string> = {
  ethereum:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-mainnet",
  polygon:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-matic",
  bsc: "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-bsc",
  fantom:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-fantom",
  avalanche:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-avalanche",
  celo: "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-celo",
  optimism:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-optimism",
  arbitrum:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-arbitrum-one",
  ropsten:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-ropsten",
  mumbai:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-mumbai",
  goerli:
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-georli",
};

const PROXY_FUNCTIONS_QUERY = gql`
  {
    proxyFunctions {
      id
      currentImpl
      name
      version
    }
  }
`;

export interface ProxyFunction {
  id: string;
  currentImpl: string;
  name: string;
  version: string;
}

export async function fetchProxyFunctions(
  chain: Chain
): Promise<ProxyFunction[]> {
  const { proxyFunctions } = await request<{ proxyFunctions: ProxyFunction[] }>(
    CHAIN_TO_SUBGRAPH_URL[chain],
    PROXY_FUNCTIONS_QUERY
  );
  return _.alphabetical(proxyFunctions, (fn) => fn.name);
}
