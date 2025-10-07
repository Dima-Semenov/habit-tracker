'use client';

import { ReactNode, useEffect } from 'react';
import { UserType } from '@/types/userType';
import { useUserStore } from '@/store/userStore';

interface Props {
  user: UserType;
  children: ReactNode;
}

export default function UserProvider({ user, children }: Props) {
  const { setUser } = useUserStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return <>{children}</>;
}
