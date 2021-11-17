import { Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  AppHomeRouteName,
  AppRouteName,
  setAppHomeRoute,
  setAppRoute,
} from '../../../../store/slices/navigation';
import { createProjectFromSource } from '../../../../store/slices/core/slices/project';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import Button from '../../../../ui-atoms/input/Button';
import FormControl, {
  useForm,
  useFormField,
} from '../../../../ui-atoms/input/FormControl';
import FormError from '../../../../ui-atoms/input/FormError';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { SettingString } from '../../../../utils-electron/Settings.types';
import {
  getSettingString,
  prioritizeRecentProject,
} from '../../../../store/slices/settings';

const { $FileSystem } = window.api;

export default function ProjectCreationFromSource(): ReactElement {
  const nameField = useFormField({
    infoMessage: 'This will be the name fo the project directory.',
    initialValue: 'MyProject',
    isRequired: true,
    label: 'Project name',
    onValidate: $FileSystem.validateIsValidName,
  });

  const defaultLocationDirPath = useSelector(
    getSettingString(SettingString.NewProjectDefaultLocationDirPath),
  );
  const locationDirPathField = useFormField({
    infoMessage: 'The project will be created in this directory.',
    initialValue: defaultLocationDirPath,
    isRequired: true,
    label: 'Destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const defaultRomFilePath = useSelector(
    getSettingString(SettingString.NewProjectDefaultRomFilePath),
  );
  const romFilePathField = useFormField({
    infoMessage: 'ROM used for the project (a copy will be made).',
    initialValue: defaultRomFilePath,
    isRequired: true,
    label: 'ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    fields: [nameField, romFilePathField, locationDirPathField],
    onSubmit: () => {
      const error = dispatch(
        createProjectFromSource({
          name: nameField.value,
          romFilePath: romFilePathField.value,
          locationDirPath: locationDirPathField.value,
        }),
      );
      if (!error) {
        const projectDirPath = $FileSystem.join(
          locationDirPathField.value,
          nameField.value,
        );
        dispatch(prioritizeRecentProject(projectDirPath));
      }
      return error;
    },
  });

  return (
    <Center flex={1} p={10} height='100%'>
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
          {form.error && <FormError errorReport={form.error} />}
          <Flex flex={1} />
          <Button
            label='Cancel'
            onClick={() =>
              dispatch(setAppHomeRoute({ name: AppHomeRouteName.Overview }))
            }
            variant='outline'
          />
          <Button
            label='Create'
            onClick={() => {
              const maybeError = form.handleSubmit();
              if (!maybeError) {
                dispatch(setAppRoute({ name: AppRouteName.Project }));
                dispatch(setAppHomeRoute({ name: AppHomeRouteName.Overview }));
              }
            }}
            isDisabled={!form.isValid}
          />
        </HStack>
      </VStack>
    </Center>
  );
}
