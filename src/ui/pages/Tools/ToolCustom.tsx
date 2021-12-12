import { Flex, Heading, Text } from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import Button from '../../../ui-atoms/input/Button';

const { $Dialog } = window.api;

interface ToolCustomProps {
  exePath?: string;
  name: string;
  onChoose: (exePath: string) => void;
}

export default function ToolCustom({
  exePath,
  name,
  onChoose,
}: ToolCustomProps): ReactElement {
  const handleBrowse = useCallback(() => {
    const paths = $Dialog.open({
      title: 'Select the executable',
      properties: ['openFile'],
      filters: [{ name: 'Executable', extensions: ['exe'] }],
    });
    const filePath = paths && paths[0];
    if (filePath) {
      onChoose(filePath);
    }
  }, [onChoose]);

  return (
    <Flex w='100%' h='60px' alignItems='center'>
      <Flex flexDir='column' flex={1}>
        <Heading size='sm'>{name}</Heading>
        <Text size='sm' fontStyle='italic'>
          {exePath ?? '<Not specified>'}
        </Text>
      </Flex>
      <Button label='Browse...' onClick={handleBrowse} variant='outline' />
    </Flex>
  );
}
