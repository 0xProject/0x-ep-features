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
import styles from "../styles/Home.module.css";
import { MAINNET_TEST_DATA } from "../utils/testdata";

const FeatureContainer = () => {
  return (
    <Box>
      <Center mb="8">
        <Select defaultValue={"ethereum"} maxWidth={200}>
          <option value="ethereum">Ethereum</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="option3">Option 3</option>
        </Select>
      </Center>
      <FeatureTable />
    </Box>
  );
};

const FeatureTable = () => {
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
          {MAINNET_TEST_DATA.data.proxyFunctions.map(
            ({ id, currentImpl, name, version }) => {
              return (
                <Tr key={id}>
                  <Td>{name}</Td>
                  <Td>{id}</Td>
                  <Td>{version}</Td>
                  <Td>{currentImpl}</Td>
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
