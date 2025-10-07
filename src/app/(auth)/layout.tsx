export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/actions/userActions';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import React from 'react';

const LoginLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return (
    <Box as='section' h='100vh' overflow='hidden' p={10}>
      <Flex
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        h='full'
        pb={20}
        gap={10}
      >
        <Stack alignItems='center' textAlign='center' gap={5}>
          <Text textStyle='3xl'>Welcome in Habit Tracker app</Text>
          <Text textStyle='2xl'>Create or login in your account</Text>
        </Stack>

        {children}
      </Flex>
    </Box>
  );
};

export default LoginLayout;
