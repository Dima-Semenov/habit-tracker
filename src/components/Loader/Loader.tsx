import { Box, Center, Spinner } from '@chakra-ui/react';
import React, { FC } from 'react';

interface LoaderProps {
  useAbsoluteLoader?: boolean;
}

const LoaderContent = () => (
  <Center h='full'>
    <Spinner size='xl' />
  </Center>
);

const Loader: FC<LoaderProps> = ({ useAbsoluteLoader = false }) => {
  if (useAbsoluteLoader) {
    return (
      <Box pos='absolute' inset='0' bg='bg/80'>
        <LoaderContent />
      </Box>
    );
  }

  return <LoaderContent />;
};

export default Loader;
