import { extendTheme } from '@chakra-ui/react';
import colors from './colors';
import Input from './components/Input';

const theme = extendTheme({
  colors,
  components: {
    Input,
  },
});

export default theme;
