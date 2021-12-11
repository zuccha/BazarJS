import { VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import Button from '../../../../ui-atoms/input/Button';

export default function Actions(): ReactElement {
  return (
    <VStack w='100%'>
      <Button
        label='Open in Lunar Magic'
        onClick={() => null}
        w='100%'
        isDisabled
      />
      <Button
        label='Run on emulator'
        onClick={() => null}
        w='100%'
        isDisabled
      />
      <Button label='Backup' onClick={() => null} w='100%' isDisabled />
      <Button label='Create BPS' onClick={() => null} w='100%' isDisabled />
    </VStack>
  );
}
