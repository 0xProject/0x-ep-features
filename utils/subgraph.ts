import { gql, request } from "graphql-request";
import * as _ from "radash";
import { Chain, FUNCTION_SELECTOR_TO_NAME } from "./constants";

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
    "https://api.thegraph.com/subgraphs/name/0xeng/zeroex-features-goerli",
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

export interface FeatureFunction {
  featureName: string;
  functionName: string;
  selector: string;
  currentImpl: string;
  version: string;
}

export async function fetchFeatureFunctions(
  chain: Chain
): Promise<FeatureFunction[]> {
  const { proxyFunctions } = await request<{ proxyFunctions: ProxyFunction[] }>(
    CHAIN_TO_SUBGRAPH_URL[chain],
    PROXY_FUNCTIONS_QUERY
  );

  const featureFunctions = proxyFunctions.map((fn) => ({
    featureName: fn.name,
    functionName: FUNCTION_SELECTOR_TO_NAME.get(fn.id) || "?",
    selector: fn.id,
    currentImpl: fn.currentImpl,
    version: fn.version,
  }));

  FUNCTION_SELECTOR_TO_NAME;

  return _.alphabetical(featureFunctions, (fn) => fn.featureName);
}
