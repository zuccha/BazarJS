import { VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useHandleError from '../../../../hooks/useHandleError';
import { AppDispatch } from '../../../../store';
import {
  launchInEmulator,
  openInLunarMagic,
} from '../../../../store/slices/core/slices/project';
import { getToolchain } from '../../../../store/slices/core/slices/toolchain';
import Button from '../../../../ui-atoms/input/Button';

export default function Actions(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const toolchain = useSelector(getToolchain());
  const handleError = useHandleError();

  return (
    <VStack w='100%'>
      <Button
        isDisabled={toolchain.embedded.lunarMagic.status !== 'installed'}
        label='Open in Lunar Magic'
        onClick={() => {
          const error = dispatch(openInLunarMagic(toolchain));
          handleError(error, 'Failed to open in Lunar Magic');
        }}
        w='100%'
      />
      <Button
        isDisabled={!toolchain.custom.emulator.exePath}
        label='Run on emulator'
        onClick={() => {
          const error = dispatch(launchInEmulator(toolchain));
          handleError(error, 'Failed to open in Lunar Magic');
        }}
        w='100%'
      />
      <Button label='Backup' onClick={() => null} w='100%' isDisabled />
      <Button label='Create BPS' onClick={() => null} w='100%' isDisabled />
    </VStack>
  );
}
