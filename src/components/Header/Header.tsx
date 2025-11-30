'use client';

import {
  Flex,
  Link as ChakraLink,
  Separator,
  Text,
  Box,
  For,
} from '@chakra-ui/react';
import React from 'react';
import { ColorModeButton } from '../ui/color-mode';
import Link from 'next/link';
import Profile from '../Profile/Profile';
import ModileDrawer from './ModileDrawer';
import { NAVIGATION_PAGES } from '@/constants/navigations';

const Header = () => {
  return (
    <Box as='header'>
      <Flex
        justify='space-between'
        align='center'
        px='4'
        py='2'
        maxW='7xl'
        mx='auto'
        w='full'
      >
        <Link href='/'>
          <Text fontWeight={900}>Habit Tracker</Text>
        </Link>

        <Flex gap={10} hideBelow='md'>
          <For each={NAVIGATION_PAGES}>
            {(page) => (
              <Link href={page.href} key={page.id}>
                <ChakraLink fontWeight={500} as='h4'>
                  {page.title}
                </ChakraLink>
              </Link>
            )}
          </For>
        </Flex>

        <Flex gap={2} alignItems='center' hideBelow='md'>
          <ColorModeButton />
          <Profile />
        </Flex>

        <ModileDrawer />
      </Flex>
      <Separator />
    </Box>
  );
};

export default Header;
