import { Center, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import useActionCreator from '../../../../hooks/useActionCreator';
import {
  AppHomeRouteName,
  setAppHomeRoute,
} from '../../../../store/navigation';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import Button from '../../../../ui-atoms/input/Button';
import FormControl, {
  useForm,
  useFormField,
} from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { SettingString } from '../../../../utils-electron/Settings.types';

const { $FileSystem, $Settings } = window.api;

export default function ProjectCreationFromSource(): ReactElement {
  const nameField = useFormField({
    infoMessage: 'This will be the name fo the project directory.',
    initialValue: 'MyProject',
    isRequired: true,
    label: 'Project name',
    onValidate: $FileSystem.validateIsValidName,
  });

  const locationDirPathField = useFormField({
    infoMessage: 'The project will be created in this directory.',
    initialValue: $Settings.getString(
      SettingString.NewProjectDefaultLocationDirPath,
      '',
    ),
    isRequired: true,
    label: 'Destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const romFilePathField = useFormField({
    infoMessage: 'ROM used for the project (a copy will be made).',
    initialValue: $Settings.getString(
      SettingString.NewProjectDefaultRomFilePath,
      '',
    ),
    isRequired: true,
    label: 'ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  const form = useForm({
    fields: [nameField, romFilePathField, locationDirPathField],
  });

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
          <FormControl {...nameField.control}>
            <TextInput
              onBlur={nameField.handleBlur}
              onChange={nameField.handleChange}
              placeholder={nameField.control.label}
              value={nameField.value}
            />
          </FormControl>

          <FormControl {...locationDirPathField.control}>
            <BrowserInput
              mode='directory'
              onBlur={locationDirPathField.handleBlur}
              onChange={locationDirPathField.handleChange}
              placeholder={locationDirPathField.control.label}
              value={locationDirPathField.value}
            />
          </FormControl>

          <FormControl {...romFilePathField.control}>
            <BrowserInput
              filters={[{ name: 'ROM', extensions: ['smc'] }]}
              mode='file'
              onBlur={romFilePathField.handleBlur}
              onChange={romFilePathField.handleChange}
              placeholder={romFilePathField.control.label}
              value={romFilePathField.value}
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
          <Button
            label='Create'
            onClick={() => {
              $Settings.setString(
                SettingString.NewProjectDefaultLocationDirPath,
                locationDirPathField.value,
              );
              $Settings.setString(
                SettingString.NewProjectDefaultRomFilePath,
                romFilePathField.value,
              );
            }}
            isDisabled={!form.isValid}
          />
        </HStack>
      </VStack>
    </Center>
  );
}
