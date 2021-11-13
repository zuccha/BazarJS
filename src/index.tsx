import { ChakraProvider } from '@chakra-ui/react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import theme from './theme';
import App from './ui/App';

export function AppWithProviders(): ReactElement {
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
}

ReactDOM.render(<AppWithProviders />, document.getElementById('root'));
