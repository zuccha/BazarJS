import { Center, Heading } from '@chakra-ui/react';
import { ReactElement } from 'react';

export default function About(): ReactElement {
  return (
    <Center flex={1} height='100%'>
      <Heading>About</Heading>
    </Center>
  );
}
