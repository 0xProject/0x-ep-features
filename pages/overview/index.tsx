import {
  Box,
  Center,
  Container,
  Flex,
  Image,
  Link,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ALL_CHAINS, Chain } from "../../utils/constants";
import {
  FeatureVersionInfo,
  fetchFeatureVersionInfoOfAllChain,
} from "../../utils/subgraph";
import * as _ from "radash";
import {
  FeatureName,
  FEATURE_NAME_TO_DESCRIPTIONS,
} from "../../utils/features";
import { getEtherscanAddressUrl } from "../../utils/etherscan";

const FeatureVersionTable = () => {
  const [featureVersionInfos, setFeatureVersionInfos] = useState<
    FeatureVersionInfo[]
  >([]);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      setFeatureVersionInfos(await fetchFeatureVersionInfoOfAllChain());
    };
    fetchAndUpdate();
    // NOTES: empty dependency array is intentional
    // Fetch only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toTableDisplayData = ({
    info,
    chain,
  }: {
    info: FeatureVersionInfo;
    chain: Chain;
  }) => {
    const feature = info.chainToFeature.get(chain);
    if (feature === undefined) {
      return (
        <Flex>
          <Text>❌</Text>
        </Flex>
      );
    }

    const { version, impl } = feature;
    return (
      <Flex>
        <Text>{`${version}`}</Text>
        <Link
          href={getEtherscanAddressUrl({ chain, address: impl }) + "#code"}
          target="_blank"
          marginLeft={"0.5em"}
        >
          <Image boxSize="16px" src="etherscan-logo.svg" alt="etherscan logo" />
        </Link>
      </Flex>
    );
  };

  return (
    <>
      {_.isEmpty(featureVersionInfos) ? (
        <Center mt="16">
          <Spinner size="xl" />
        </Center>
      ) : (
        <TableContainer>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Feature</Th>
                <Th>Ethereum</Th>
                <Th>Polygon</Th>
                <Th>BSC</Th>
                <Th>Fantom</Th>
                <Th>Avalanche</Th>
                <Th>Celo</Th>
                <Th>Optimism</Th>
                <Th>Arbitrum</Th>
                <Th>Mumbai</Th>
                <Th>Goerli</Th>
              </Tr>
            </Thead>
            <Tbody>
              {featureVersionInfos.map((info) => {
                return (
                  <Tr key={info.name}>
                    <Tooltip
                      label={
                        FEATURE_NAME_TO_DESCRIPTIONS[info.name as FeatureName]
                      }
                    >
                      <Td>{info.name}</Td>
                    </Tooltip>
                    {ALL_CHAINS.map((chain) => (
                      <Td key={info.name + chain}>
                        {toTableDisplayData({ info, chain })}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

const Overview: NextPage = () => {
  return (
    <Container maxW="8xl">
      <Box p="4">
        <Head>
          <title>0x Exchange Proxy Features Overview</title>
          <meta
            name="description"
            content="0x Exchange Proxy Features Overview"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Box>

      <main>
        <FeatureVersionTable />
      </main>
    </Container>
  );
};

export default Overview;
