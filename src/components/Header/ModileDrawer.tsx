import { useModal, useNavigation } from '@/hooks';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  For,
  IconButton,
  Link,
  Portal,
} from '@chakra-ui/react';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import { ColorModeButton } from '../ui/color-mode';
import { NAVIGATION_PAGES, PROFILE_PAGE } from '@/constants/navigations';

const ModileDrawer = () => {
  const { isShow, handleShowModal, handleHideModal } = useModal();
  const { navigate } = useNavigation();

  return (
    <Box display={{ base: 'flex', md: 'none' }}>
      <IconButton
        variant='ghost'
        size='sm'
        css={{
          _icon: {
            width: '5',
            height: '5',
          },
        }}
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
                  <For each={[...NAVIGATION_PAGES, PROFILE_PAGE]}>
                    {(page) => (
                      <Link
                        key={page.id}
                        fontWeight={500}
                        as='h4'
                        p={4}
                        w='full'
                        justifyContent='center'
                        cursor='pointer'
                        onClick={() => {
                          navigate(page.href);
                          handleHideModal();
                        }}
                      >
                        {page.title}
                      </Link>
                    )}
                  </For>
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
    </Box>
  );
};

export default ModileDrawer;
