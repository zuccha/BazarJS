import { Center, Flex, HStack, useToast, VStack } from '@chakra-ui/react';
import { ReactElement, useCallback, useRef } from 'react';
import Button from '../../../ui-atoms/input/Button';
import NewProjectSettings, {
  NewProjectSettingsRef,
} from './groups/NewProjectSettings';

export default function Settings(): ReactElement {
  const toast = useToast();

  const newProjectSettingsRef = useRef<NewProjectSettingsRef>(null);

  const handleReset = useCallback(() => {
    newProjectSettingsRef.current?.reset();
  }, [newProjectSettingsRef.current?.reset]);

  const handleSave = useCallback(() => {
    newProjectSettingsRef.current?.save();
    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved',
      status: 'success',
      isClosable: true,
    });
  }, [newProjectSettingsRef.current?.save]);

  return (
    <Center flex={1} p={10} h='100%'>
      <Flex direction='column' h='100%' w='100%' maxW='600px'>
        <Flex direction='column' flex={1} w='100%' overflowY='auto'>
          <VStack alignItems='flex-start' spacing={8} w='100%' margin='auto'>
            <NewProjectSettings ref={newProjectSettingsRef} />
          </VStack>
        </Flex>
        <HStack w='100%' justifyContent='flex-end' pt={6}>
          <Button label='Reset' onClick={handleReset} variant='outline' />
          <Button label='Save' onClick={handleSave} />
        </HStack>
      </Flex>
    </Center>
  );
}
