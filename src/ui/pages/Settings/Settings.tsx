import { Center, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import BrowserInput from '../../../ui-atoms/input/BrowserInput';
import Button from '../../../ui-atoms/input/Button';
import FormControl, { useFormField } from '../../../ui-atoms/input/FormControl';
import { SettingString } from '../../../utils-electron/Settings.types';

const { $FileSystem, $Settings } = window.api;

export default function Settings(): ReactElement {
  const newProjectDefaultLocationDirPathField = useFormField({
    infoMessage: 'Default directory for new projects',
    initialValue: $Settings.getString(
      SettingString.NewProjectDefaultLocationDirPath,
      '',
    ),
    isRequired: true,
    label: 'Default destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const newProjectDefaultRomFilePathField = useFormField({
    infoMessage: 'ROM used for the project (a copy will be made).',
    initialValue: $Settings.getString(
      SettingString.NewProjectDefaultRomFilePath,
      '',
    ),
    isRequired: true,
    label: 'Default ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  return (
    <Center flex={1} p={10}>
      <VStack alignItems='flex-start' spacing={10} w='100%' maxW='600px'>
        <VStack alignItems='flex-start'>
          <Heading size='lg' color='app.fg1'>
            Settings
          </Heading>
          <Text fontSize='md'>
            Notice that errors might appear while choosing file paths and
            directories, but you can still save the settings.
          </Text>
        </VStack>

        <VStack alignItems='flex-start' w='100%'>
          <Heading size='md' color='app.fg1'>
            New project
          </Heading>
          <Text fontSize='md'>
            These settings are used in the form for creating a new project.
          </Text>
          <FormControl {...newProjectDefaultLocationDirPathField.control}>
            <BrowserInput
              mode='directory'
              onBlur={newProjectDefaultLocationDirPathField.handleBlur}
              onChange={newProjectDefaultLocationDirPathField.handleChange}
              placeholder={newProjectDefaultLocationDirPathField.control.label}
              value={newProjectDefaultLocationDirPathField.value}
            />
          </FormControl>

          <FormControl {...newProjectDefaultRomFilePathField.control}>
            <BrowserInput
              filters={[{ name: 'ROM', extensions: ['smc'] }]}
              mode='file'
              onBlur={newProjectDefaultRomFilePathField.handleBlur}
              onChange={newProjectDefaultRomFilePathField.handleChange}
              placeholder={newProjectDefaultRomFilePathField.control.label}
              value={newProjectDefaultRomFilePathField.value}
            />
          </FormControl>
        </VStack>

        <HStack width='100%' justifyContent='flex-end'>
          <Button
            label='Reset'
            onClick={() => {
              newProjectDefaultLocationDirPathField.handleChange(
                $Settings.getString(
                  SettingString.NewProjectDefaultLocationDirPath,
                  '',
                ),
              );
              newProjectDefaultRomFilePathField.handleChange(
                $Settings.getString(
                  SettingString.NewProjectDefaultRomFilePath,
                  '',
                ),
              );
            }}
            variant='outline'
          />
          <Button
            label='Save'
            onClick={() => {
              $Settings.setString(
                SettingString.NewProjectDefaultLocationDirPath,
                newProjectDefaultLocationDirPathField.value,
              );
              $Settings.setString(
                SettingString.NewProjectDefaultRomFilePath,
                newProjectDefaultRomFilePathField.value,
              );
            }}
          />
        </HStack>
      </VStack>
    </Center>
  );
}
