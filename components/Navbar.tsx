import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Heading,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <>
      <Center p="8">
        <Heading textAlign="center">0x Exchange Proxy Features</Heading>
      </Center>
      <Center>
        <ButtonGroup variant="link" spacing="8">
          <Button variant="link">
            <Link href="/">By Chain 🔍</Link>
          </Button>
          <Button variant="link">
            <Link href="/overview">Overview 🌐</Link>
          </Button>
        </ButtonGroup>
        <HStack></HStack>
      </Center>
    </>
  );
};

export default Navbar;
