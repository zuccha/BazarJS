import { Alert, AlertIcon, Flex, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { AppRouteName, setAppRoute } from '../../../../store/slices/navigation';
import { createProjectFromSource } from '../../../../store/slices/core/slices/project';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import Button from '../../../../ui-atoms/input/Button';
import FormControl, {
  useForm,
  useFormField,
} from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { Setting } from '../../../../utils-electron/Settings.types';
import {
  getSetting,
  prioritizeRecentProject,
} from '../../../../store/slices/settings';
import Drawer from '../../../../ui-atoms/overlay/Drawer';
import FormError from '../../../../ui-atoms/input/FormError';

const { $FileSystem } = window.api;

interface ProjectCreationFromSourceProps {
  onClose: () => void;
}

export default function ProjectCreationFromSource({
  onClose,
}: ProjectCreationFromSourceProps): ReactElement {
  const nameField = useFormField({
    infoMessage: 'This will be the name fo the project directory.',
    initialValue: 'MyProject',
    isRequired: true,
    label: 'Project name',
    onValidate: $FileSystem.validateIsValidName,
  });

  const defaultAuthor = useSelector(
    getSetting(Setting.NewProjectDefaultAuthor),
  );
  const authorField = useFormField({
    infoMessage: 'Author of the project.',
    initialValue: defaultAuthor,
    isRequired: false,
    label: 'Author',
  });

  const defaultLocationDirPath = useSelector(
    getSetting(Setting.NewProjectDefaultLocationDirPath),
  );
  const locationDirPathField = useFormField({
    infoMessage: 'The project will be created in this directory.',
    initialValue: defaultLocationDirPath,
    isRequired: true,
    label: 'Destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const defaultRomFilePath = useSelector(
    getSetting(Setting.NewProjectDefaultRomFilePath),
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
          name: nameField.value.trim(),
          author: authorField.value.trim(),
          romFilePath: romFilePathField.value.trim(),
          locationDirPath: locationDirPathField.value.trim(),
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
    <Drawer
      buttons={
        <>
          <Button label='Cancel' onClick={onClose} variant='outline' mr={3} />
          <Button
            label='Create'
            onClick={() => {
              const maybeError = form.handleSubmit();
              if (!maybeError) {
                dispatch(setAppRoute({ name: AppRouteName.Project }));
                onClose();
              }
            }}
            isDisabled={!form.isValid}
          />
        </>
      }
      onClose={onClose}
      title='New project'
    >
      <Flex direction='column' h='100%'>
        <VStack width='100%' spacing={4} flex={1}>
          <FormControl {...nameField.control}>
            <TextInput
              onBlur={nameField.handleBlur}
              onChange={nameField.handleChange}
              placeholder={nameField.control.label}
              value={nameField.value}
            />
          </FormControl>

          <FormControl {...authorField.control}>
            <TextInput
              onBlur={authorField.handleBlur}
              onChange={authorField.handleChange}
              placeholder={authorField.control.label}
              value={authorField.value}
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

          <Alert status='info'>
            <AlertIcon />A new directory named after the chosen project name
            will be created in the selected location, containing a copy of the
            base ROM and generated files.
          </Alert>
        </VStack>

        {form.error && <FormError errorReport={form.error} />}
      </Flex>
    </Drawer>
  );
}
