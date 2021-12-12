import { useToast, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { openInLunarMagic } from '../../../../store/slices/core/slices/project';
import Button from '../../../../ui-atoms/input/Button';

export default function Actions(): ReactElement {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <VStack w='100%'>
      <Button
        label='Open in Lunar Magic'
        onClick={() => {
          const error = dispatch(openInLunarMagic());
          if (error) {
            toast({
              title: 'Failed to open in Lunar Magic',
              description: error.main,
              status: 'error',
            });
          }
        }}
        w='100%'
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
