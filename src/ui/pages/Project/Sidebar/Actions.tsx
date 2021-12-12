import { VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { openInLunarMagic } from '../../../../store/slices/core/slices/project';
import Button from '../../../../ui-atoms/input/Button';

export default function Actions(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <VStack w='100%'>
      <Button
        label='Open in Lunar Magic'
        onClick={() => dispatch(openInLunarMagic())}
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
