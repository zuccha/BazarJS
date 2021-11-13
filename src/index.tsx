import { ChakraProvider } from '@chakra-ui/react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import theme from './theme';
import App from './ui/App';

export function AppWithProviders(): ReactElement {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ChakraProvider>
  );
}

ReactDOM.render(<AppWithProviders />, document.getElementById('root'));
