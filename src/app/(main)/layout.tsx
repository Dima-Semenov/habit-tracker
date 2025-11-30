export const dynamic = 'force-dynamic';

import { Header, Loader } from '@/components';
import { Box, ClientOnly } from '@chakra-ui/react';
import { UserProvider } from '@/provider';
import { getCurrentUser } from '@/actions/userActions';
import { redirect } from 'next/navigation';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <UserProvider user={user}>
      <Header />
      <ClientOnly fallback={<Loader useAbsoluteLoader />}>
        <Box
          p='4'
          as='section'
          maxW='7xl'
          mx='auto'
          w='full'
          h='calc(100dvh - 53px)'
          overflow='scroll'
          display='flex'
          flexDirection='column'
        >
          {children}
        </Box>
      </ClientOnly>
    </UserProvider>
  );
}
