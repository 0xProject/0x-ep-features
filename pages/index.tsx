import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Box,
  Heading,
  Center,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ARBITRUM_TEST_DATA, MAINNET_TEST_DATA } from "../utils/testdata";

interface ProxyFunction {
  id: string;
  currentImpl: string;
  name: string;
  version: string;
}

const FeatureContainer = () => {
  const [chain, setChain] = useState("ethereum");
  const [proxyFunctions, setProxyFunctions] = useState<ProxyFunction[]>([]);

  useEffect(() => {
    if (chain === "ethereum") {
      setProxyFunctions(MAINNET_TEST_DATA.data.proxyFunctions);
    }
    if (chain === "arbitrum") {
      setProxyFunctions(ARBITRUM_TEST_DATA.data.proxyFunctions);
    }
  }, [chain]);

  return (
    <Box>
      <Center mb="8">
        <Select
          defaultValue={"ethereum"}
          maxWidth={200}
          onChange={(e) => setChain(e.target.value)}
        >
          <option value="ethereum">Ethereum</option>
          <option value="arbitrum">Arbitrum</option>
        </Select>
      </Center>
      <FeatureTable proxyFunctions={proxyFunctions} />
    </Box>
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
                <Td>{id}</Td>
                <Td>{version}</Td>
                <Td>{currentImpl}</Td>
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
    <div className={styles.container}>
      <Head>
        <title>0x Exchange Proxy Features</title>
        <meta name="description" content="0x Exchange Proxy Features" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading mb={8}>0x Exchange Proxy Features</Heading>
        <FeatureContainer />
      </main>
    </div>
  );
};

export default Home;
