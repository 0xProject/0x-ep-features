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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Chain } from "../utils/constants";
import { FeatureFunction, fetchFeatureFunctions } from "../utils/subgraph";
import * as _ from "radash";
import { getExchangeProxyAddress } from "../utils/addresses";
import { getEtherscanAddressUrl } from "../utils/etherscan";
import { FeatureName, FEATURE_NAME_TO_DESCRIPTIONS } from "../utils/features";

const FeatureContainer = () => {
  const [proxyAddress, setProxyAddress] = useState<string>(
    "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  );
  const [chain, setChain] = useState<Chain>(Chain.Ethereum);
  const [exchangeProxyEtherscanUrl, setExchangeProxyEtherscanUrl] =
    useState<string>(getEtherscanAddressUrl({ chain, address: proxyAddress }));
  const [featureNameToFunctions, setFeatureNameToFunctions] = useState<
    Record<string, FeatureFunction[]>
  >({});

  useEffect(() => {
    const fetchAndUpdate = async () => {
      setFeatureNameToFunctions({});
      const featureNameToFunctions = await fetchFeatureFunctions(chain);
      setFeatureNameToFunctions(featureNameToFunctions);
    };
    fetchAndUpdate();
  }, [chain]);

  useEffect(() => {
    setProxyAddress(getExchangeProxyAddress(chain));
  }, [chain]);

  useEffect(() => {
    setExchangeProxyEtherscanUrl(
      getEtherscanAddressUrl({ chain, address: proxyAddress })
    );
  }, [chain, proxyAddress]);

  return (
    <Stack>
      <Center>
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
      <Center>
        <Text m="2" fontFamily="mono">
          Proxy Address: {proxyAddress}
        </Text>
        <Link href={exchangeProxyEtherscanUrl} target="_blank">
          <Image boxSize="18px" src="etherscan-logo.svg" alt="etherscan logo" />
        </Link>
      </Center>
      <Center
        mt="2"
        display={_.isEmpty(featureNameToFunctions) ? "flex" : "none"}
      >
        <Spinner size="xl" />
      </Center>
      <Accordion defaultIndex={[]} allowMultiple>
        {Object.keys(featureNameToFunctions).map((featureName) => {
          const functions = featureNameToFunctions[featureName];
          return (
            <AccordionItem key={featureName}>
              <AccordionButton>
                <Tooltip
                  label={
                    FEATURE_NAME_TO_DESCRIPTIONS[featureName as FeatureName]
                  }
                >
                  <Heading fontFamily="mono" size="md">
                    {featureName}
                  </Heading>
                </Tooltip>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <FeatureTable featureFunctions={functions} />
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Stack>
  );
};

const FeatureTable = (props: { featureFunctions: FeatureFunction[] }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w="40%">Function Name</Th>
            <Th w="15%">Function Selector</Th>
            <Th w="10%">Version</Th>
            <Th w="35%">Implementation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.featureFunctions.map(
            ({ functionName, selector, currentImpl, version }) => {
              return (
                <Tr key={selector} fontFamily="monospace">
                  <Td>{functionName}</Td>
                  <Td>{selector}</Td>
                  <Td>{version}</Td>
                  <Td fontSize="x-small">{currentImpl}</Td>
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
    <Container maxW="5xl">
      <Box p="4">
        <Head>
          <title>0x Exchange Proxy Features by Chain</title>
          <meta
            name="description"
            content="0x Exchange Proxy Features by Chain"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Box>

      <main>
        <FeatureContainer />
      </main>
    </Container>
  );
};

export default Home;
