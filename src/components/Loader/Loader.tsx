import { Box, Center, Spinner } from '@chakra-ui/react';
import React from 'react';

function Loader() {
  return (
    <Box pos='absolute' inset='0' bg='bg/80'>
      <Center h='full'>
        <Spinner size='xl' />
      </Center>
    </Box>
  );
}

export default Loader;
