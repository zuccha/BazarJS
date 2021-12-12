import { useToast, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { openInLunarMagic } from '../../../../store/slices/core/slices/project';
import { getToolchain } from '../../../../store/slices/core/slices/toolchain';
import Button from '../../../../ui-atoms/input/Button';

export default function Actions(): ReactElement {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const toolchain = useSelector(getToolchain());
  return (
    <VStack w='100%'>
      <Button
        isDisabled={toolchain.embedded.lunarMagic.status !== 'installed'}
        label='Open in Lunar Magic'
        onClick={() => {
          const error = dispatch(openInLunarMagic(toolchain));
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
