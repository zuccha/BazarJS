import { Center, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import useActionCreator from '../../../../hooks/useActionCreator';
import {
  AppHomeRouteName,
  setAppHomeRoute,
} from '../../../../store/navigation';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import Button from '../../../../ui-atoms/input/Button';
import FormControl from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { $ErrorReport } from '../../../../utils/ErrorReport';

export default function ProjectCreationFromSource(): ReactElement {
  const [name, setName] = useState('');
  const [romFilePath, setRomFilePath] = useState('');
  const [destinationDirPath, setDestinationDirPath] = useState('');

  const dispatchSetAppHomeRoute = useActionCreator(setAppHomeRoute);

  return (
    <Center flex={1} p={10}>
      <VStack alignItems='flex-start' spacing={10} w='100%' maxW='600px'>
        <VStack alignItems='flex-start'>
          <Heading size='lg' color='app.fg1'>
            Create a project
          </Heading>
          <Text fontSize='md'>
            Select a project name, a base ROM and a location to create a
            project. A new directory with the chosen name will be created in the
            selected location, and the base ROM will be copied in it.
          </Text>
        </VStack>

        <VStack width='100%' spacing={4}>
          <FormControl
            infoMessage='The name of the project'
            isRequired
            label='Project name'
          >
            <TextInput
              onChange={setName}
              placeholder='Project name'
              value={name}
            />
          </FormControl>

          <FormControl
            errorReport={$ErrorReport.make('Blabla', ['asd', 'dsa'])}
            infoMessage='This ROM will be used a base ROM'
            isRequired
            label='ROM file'
          >
            <BrowserInput
              filters={[{ name: 'ROM', extensions: ['smc'] }]}
              mode='file'
              onChange={setRomFilePath}
              placeholder='ROM file path'
              value={romFilePath}
            />
          </FormControl>

          <FormControl
            infoMessage='The project will be created in this directory'
            isRequired
            label='Destination directory'
          >
            <BrowserInput
              mode='directory'
              onChange={setDestinationDirPath}
              placeholder='Project directory'
              value={destinationDirPath}
            />
          </FormControl>
        </VStack>

        <HStack width='100%' justifyContent='flex-end'>
          <Button
            label='Cancel'
            onClick={() =>
              dispatchSetAppHomeRoute({ name: AppHomeRouteName.Overview })
            }
            variant='outline'
          />
          <Button label='Create' onClick={() => {}} />
        </HStack>
      </VStack>
    </Center>
  );
}
