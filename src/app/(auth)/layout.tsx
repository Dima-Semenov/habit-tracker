export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/actions/userActions';
import { Box, Text } from '@chakra-ui/react';
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
    <Box
      p='4'
      as='section'
      maxW='7xl'
      mx='auto'
      w='full'
      h='100dvh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      <Text fontWeight={900} textStyle='3xl' mb={2} textAlign='center'>
        Welcome in Habit Tracker app
      </Text>
      {children}
    </Box>
  );
};

export default LoginLayout;
