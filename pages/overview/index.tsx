import {
  Box,
  Center,
  Container,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
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
  }): string => {
    const version = info.chainToVersion.get(chain);
    if (version === undefined) {
      return "❌";
    }

    return `✅ ${version}`;
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
                    <Td>{info.name}</Td>
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