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
import { FeatureFunction, fetchFeatureFunctions } from "../utils/subgraph";

const FeatureContainer = () => {
  const [chain, setChain] = useState<Chain>(Chain.Ethereum);
  const [featureFunctions, setFeatureFunctions] = useState<FeatureFunction[]>(
    []
  );

  useEffect(() => {
    const fetchAndUpdate = async () => {
      setFeatureFunctions([]);
      const functions = await fetchFeatureFunctions(chain);
      setFeatureFunctions(functions);
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
          {Object.keys(Chain).map((displayName) => {
            const chain: Chain = Chain[displayName as keyof typeof Chain];
            return (
              <option key={chain} value={chain}>
                {displayName}
              </option>
            );
          })}
        </Select>
      </Center>
      <Box>
        <FeatureTable featureFunctions={featureFunctions} />
        <Center mt="16">
          <Spinner
            size="xl"
            visibility={featureFunctions.length === 0 ? "visible" : "hidden"}
          />
        </Center>
      </Box>
    </Stack>
  );
};

const FeatureTable = (props: { featureFunctions: FeatureFunction[] }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Feature Name</Th>
            <Th>Function Name</Th>
            <Th>Function Signature</Th>
            <Th>Version</Th>
            <Th>Implementation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.featureFunctions.map(
            ({ featureName, functionName, selector, currentImpl, version }) => {
              return (
                <Tr key={selector}>
                  <Td>{featureName}</Td>
                  <Td fontFamily="monospace">{functionName}</Td>
                  <Td fontFamily="monospace">{selector}</Td>
                  <Td>{version}</Td>
                  <Td fontFamily="monospace">{currentImpl}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Home: NextPage = () => {
  return (
    <Container maxW="7xl">
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
