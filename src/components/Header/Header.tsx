import {
  Flex,
  Link as ChakraLink,
  Separator,
  Text,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { ColorModeButton } from '../ui/color-mode';
import Link from 'next/link';

function Header() {
  return (
    <Box as='header'>
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Link href='/'>
          <Text fontWeight={900}>Habit Tracker</Text>
        </Link>

        <Flex gap={10}>
          <Link href='/'>
            <ChakraLink fontWeight={500} as='h4'>
              Home
            </ChakraLink>
          </Link>
          <Link href='/group'>
            <ChakraLink fontWeight={500} as='h4'>
              Groups
            </ChakraLink>
          </Link>
          <Link href='/'>
            <ChakraLink fontWeight={500} as='h4'>
              My habits
            </ChakraLink>
          </Link>
        </Flex>

        <ColorModeButton />
      </Flex>
      <Separator />
    </Box>
  );
}

export default Header;
