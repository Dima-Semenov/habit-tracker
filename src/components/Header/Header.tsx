'use client';

import {
  Flex,
  Link as ChakraLink,
  Separator,
  Text,
  Box,
  IconButton,
  Drawer,
  Portal,
  CloseButton,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { ColorModeButton } from '../ui/color-mode';
import Link from 'next/link';
import Profile from '../Profile/Profile';
import { IoMenu } from 'react-icons/io5';
import { useModal, useNavigation } from '@/hooks';

function Header() {
  const { isShow, handleShowModal, handleHideModal } = useModal();
  const { navigate } = useNavigation();

  return (
    <Box as='header'>
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Link href='/'>
          <Text fontWeight={900}>Habit Tracker</Text>
        </Link>

        <Flex gap={10} hideBelow='md'>
          <Link href='/'>
            <ChakraLink fontWeight={500} as='h4'>
              Home
            </ChakraLink>
          </Link>
          <Link href='/habits'>
            <ChakraLink fontWeight={500} as='h4'>
              My habits
            </ChakraLink>
          </Link>
          <Link href='/group'>
            <ChakraLink fontWeight={500} as='h4'>
              Groups
            </ChakraLink>
          </Link>
        </Flex>

        <Flex gap={2} alignItems='center' hideBelow='md'>
          <ColorModeButton />
          <Profile />
        </Flex>

        <IconButton
          variant='ghost'
          size='sm'
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
          aria-label='Profile'
          onClick={handleShowModal}
        >
          <IoMenu />
        </IconButton>

        <Drawer.Root open={isShow} onOpenChange={handleHideModal}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <ColorModeButton />
                </Drawer.Header>
                <Drawer.Body>
                  <Flex gap={2} flexDirection='column' alignItems='center'>
                    <ChakraLink
                      fontWeight={500}
                      as='h4'
                      p={4}
                      w='full'
                      justifyContent='center'
                      cursor='pointer'
                      onClick={() => {
                        navigate('/');
                        handleHideModal();
                      }}
                    >
                      Home
                    </ChakraLink>
                    <ChakraLink
                      fontWeight={500}
                      as='h4'
                      p={4}
                      w='full'
                      justifyContent='center'
                      cursor='pointer'
                      onClick={() => {
                        navigate('/habits');
                        handleHideModal();
                      }}
                    >
                      My habits
                    </ChakraLink>
                    <ChakraLink
                      fontWeight={500}
                      as='h4'
                      p={4}
                      w='full'
                      justifyContent='center'
                      cursor='pointer'
                      onClick={() => {
                        navigate('/group');
                        handleHideModal();
                      }}
                    >
                      Groups
                    </ChakraLink>
                    <ChakraLink
                      fontWeight={500}
                      as='h4'
                      p={4}
                      w='full'
                      justifyContent='center'
                      cursor='pointer'
                      onClick={() => {
                        navigate('/profile');
                        handleHideModal();
                      }}
                    >
                      Profile
                    </ChakraLink>
                  </Flex>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button variant='outline' color='fg.error'>
                    Log out
                  </Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size='sm' />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
      <Separator />
    </Box>
  );
}

export default Header;
