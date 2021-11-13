import { ChakraProvider } from '@chakra-ui/react';
import { AppNavigation } from './AppNavigation';

export function App() {
  return (
    <ChakraProvider>
      <AppNavigation />
    </ChakraProvider>
  );
}
