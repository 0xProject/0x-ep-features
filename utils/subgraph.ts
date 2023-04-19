import { gql, request } from "graphql-request";
import * as _ from "radash";
import { ALL_CHAINS, Chain } from "./constants";
import { FEATURE_NAMES_TO_HIDE, FUNCTION_SELECTOR_TO_NAME } from "./features";

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

async function fetchFeatureFunctionsInternal(
  chain: Chain
): Promise<Record<string, FeatureFunction[]>> {
  const { proxyFunctions } = await request<{ proxyFunctions: ProxyFunction[] }>(
    CHAIN_TO_SUBGRAPH_URL[chain],
    PROXY_FUNCTIONS_QUERY
  );

  const featureFunctions = proxyFunctions
    .filter((fn) => !FEATURE_NAMES_TO_HIDE.includes(fn.name))
    .map((fn) => ({
      featureName: fn.name,
      functionName: FUNCTION_SELECTOR_TO_NAME.get(fn.id) || "?",
      selector: fn.id,
      currentImpl: fn.currentImpl,
      version: fn.version,
    }));
  const sortedFeatureFunctions = _.alphabetical(
    featureFunctions,
    (fn) => fn.featureName
  );
  return _.group(sortedFeatureFunctions, (f) => f.featureName);
}

export const fetchFeatureFunctions = _.memo((chain: Chain) =>
  fetchFeatureFunctionsInternal(chain)
);

export interface Feature {
  name: string;
  chain: Chain;
  version: string;
  impl: string;
}

async function fetchFeatures(chain: Chain): Promise<Feature[]> {
  const featureNameToFunctions = await fetchFeatureFunctions(chain);
  const featureNames = Object.keys(featureNameToFunctions);
  const features = featureNames.map((name) => {
    const functions = featureNameToFunctions[name];
    const allVersions = functions.map((f) => ({
      version: f.version,
      impl: f.currentImpl,
    }));
    const latestVersionAndImpl = allVersions.sort((a, b) =>
      a.version.localeCompare(b.version)
    )[allVersions.length - 1];
    return {
      name,
      chain,
      ...latestVersionAndImpl,
    };
  });

  return features;
}

export interface FeatureVersionInfo {
  name: string;
  chainToFeature: Map<Chain, Feature>;
}

export async function fetchFeatureVersionInfoOfAllChain(): Promise<
  FeatureVersionInfo[]
> {
  const features = (await Promise.all(ALL_CHAINS.map(fetchFeatures))).flatMap(
    (features) => features
  );

  const featuresByName = _.group(features, (feature) => feature.name);

  return Object.keys(featuresByName).map((featureName) => {
    const features = featuresByName[featureName];
    const chainToFeature = new Map(
      features.map((feature) => {
        return [feature.chain, feature];
      })
    );

    return {
      name: featureName,
      chainToFeature,
    };
  });
}
