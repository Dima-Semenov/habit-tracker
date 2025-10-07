export const dynamic = 'force-dynamic';

import { Header, Loader } from '@/components';
import { Box, ClientOnly, ScrollArea } from '@chakra-ui/react';
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
        <Box p='4' pr='0' h='calc(100vh - 53px)' as='section'>
          <ScrollArea.Root height='full' variant='hover' size='xs'>
            <ScrollArea.Viewport>
              <ScrollArea.Content spaceY='4' pr='4'>
                {children}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
          </ScrollArea.Root>
        </Box>
      </ClientOnly>
    </UserProvider>
  );
}
