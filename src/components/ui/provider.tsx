'use client';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
  globalCss: {
    'input, textarea, select': {
      fontSize: '16px !important',
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
