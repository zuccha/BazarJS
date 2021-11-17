import { HStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import Sidebar from './Sidebar';

export default function Project(): ReactElement {
  return (
    <HStack
      flex={1}
      height='100%'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Sidebar />
    </HStack>
  );
}
