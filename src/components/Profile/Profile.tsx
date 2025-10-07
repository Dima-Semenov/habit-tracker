'use client';

import { logoutUser } from '@/actions/userActions';
import { useUserStore } from '@/store/userStore';
import {
  Avatar,
  ClientOnly,
  IconButton,
  Menu,
  Portal,
  Skeleton,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CgProfile } from 'react-icons/cg';

const Profile = () => {
  const { user } = useUserStore();
  const route = useRouter();

  const handleLogOut = async () => {
    await logoutUser();
  };

  return (
    <ClientOnly fallback={<Skeleton boxSize='9' />}>
      <Menu.Root>
        <Menu.Trigger asChild>
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
          >
            {user?.avatarUrl ? (
              <Avatar.Root size='xs' as='button' cursor='pointer'>
                <Avatar.Fallback name={user?.username} />
                <Avatar.Image src={user.avatarUrl} />
              </Avatar.Root>
            ) : (
              <CgProfile />
            )}
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value='account'
                onClick={() => route.push('/account')}
                cursor='pointer'
              >
                Account
              </Menu.Item>
              <Menu.Item
                value='logout'
                onClick={handleLogOut}
                color='fg.error'
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                cursor='pointer'
              >
                Log out
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ClientOnly>
  );
};

export default Profile;
