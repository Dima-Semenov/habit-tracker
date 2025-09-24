'use client';

import { Box, Button } from '@chakra-ui/react';
import { useModal } from '@/hooks';
import { HabitModal } from '@/components';

export default function Home() {
  const { isShow, handleShowModal, handleHideModal } = useModal();

  return (
    <Box>
      <Button onClick={handleShowModal}>Create habit</Button>

      <HabitModal isShow={isShow} handleHideModal={handleHideModal} />
    </Box>
  );
}
