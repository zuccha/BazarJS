import { Center, Heading, Text, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import TextInput from '../../../../ui-atoms/input/TextInput';

export default function ProjectCreationFromSource(): ReactElement {
  const [name, setName] = useState('');
  const [romFilePath, setRomFilePath] = useState('');
  const [destinationDirPath, setDestinationDirPath] = useState('');

  return (
    <Center flex={1}>
      <VStack alignItems='flex-start'>
        <Heading size='lg' color='app.fg1'>
          Create a project
        </Heading>
        <Text fontSize='md'>
          Select a base ROM and a location to create a project.
        </Text>
        <TextInput onChange={setName} placeholder='Project name' value={name} />
        <BrowserInput
          filters={[{ name: 'ROM', extensions: ['smc'] }]}
          mode='file'
          onChange={setRomFilePath}
          placeholder='ROM file path'
          value={romFilePath}
        />
        <BrowserInput
          mode='directory'
          onChange={setDestinationDirPath}
          placeholder='Project directory'
          value={destinationDirPath}
        />
      </VStack>
    </Center>
  );
}
