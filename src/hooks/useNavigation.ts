'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface NavigateOptions {
  replace?: boolean;
}

export const useNavigation = () => {
  const router = useRouter();

  const navigate = useCallback(
    (url: string = '/', options?: NavigateOptions) => {
      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router]
  );

  const openInNewTab = useCallback((url: string = '/') => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return { navigate, openInNewTab };
};
