import {
  TableContainer,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Box,
  Heading,
  Center,
  Spinner,
  Stack,
  Container,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Chain } from "../utils/constants";
import { fetchProxyFunctions, ProxyFunction } from "../utils/subgraph";

const FeatureContainer = () => {
  const [chain, setChain] = useState<Chain>(Chain.Ethereum);
  const [proxyFunctions, setProxyFunctions] = useState<ProxyFunction[]>([]);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      setProxyFunctions([]);
      const proxyFunctions = await fetchProxyFunctions(chain);
      setProxyFunctions(proxyFunctions);
    };
    fetchAndUpdate();
  }, [chain]);

  return (
    <Stack>
      <Center mb="8">
        <Text mr="2" fontSize="xl">
          ⛓
        </Text>
        <Select
          defaultValue={Chain.Ethereum}
          maxWidth={200}
          onChange={(e) => setChain(e.target.value as Chain)}
        >
          <option value={Chain.Ethereum}>Ethereum</option>
          <option value={Chain.Polygon}>Polygon</option>
          <option value={Chain.Avalanche}>Avalanche</option>
          <option value={Chain.Arbitrum}>Arbitrum</option>
        </Select>
      </Center>
      <Box>
        <FeatureTable proxyFunctions={proxyFunctions} />
        <Center mt="16">
          <Spinner
            size="xl"
            visibility={proxyFunctions.length === 0 ? "visible" : "hidden"}
          />
        </Center>
      </Box>
    </Stack>
  );
};

const FeatureTable = (props: { proxyFunctions: ProxyFunction[] }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Function Signature</Th>
            <Th>Version</Th>
            <Th>Implementation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.proxyFunctions.map(({ id, currentImpl, name, version }) => {
            return (
              <Tr key={id}>
                <Td>{name}</Td>
                <Td fontFamily="monospace">{id}</Td>
                <Td>{version}</Td>
                <Td fontFamily="monospace">{currentImpl}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Home: NextPage = () => {
  return (
    <Container maxW="5xl">
      <Box p="4">
        <Head>
          <title>0x Exchange Proxy Features</title>
          <meta name="description" content="0x Exchange Proxy Features" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Box>

      <main>
        <Heading textAlign="center" mb={8}>
          0x Exchange Proxy Features
        </Heading>
        <FeatureContainer />
      </main>
    </Container>
  );
};

export default Home;
