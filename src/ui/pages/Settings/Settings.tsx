import { Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  getSettingString,
  setSettingString,
} from '../../../store/slices/settings';
import BrowserInput from '../../../ui-atoms/input/BrowserInput';
import Button from '../../../ui-atoms/input/Button';
import FormControl, { useFormField } from '../../../ui-atoms/input/FormControl';
import { SettingString } from '../../../utils-electron/Settings.types';
import SettingsGroup from './SettingsGroup';

const { $FileSystem } = window.api;

export default function Settings(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const defaultLocationDirPath = useSelector(
    getSettingString(SettingString.NewProjectDefaultLocationDirPath),
  );
  const newProjectDefaultLocationDirPathField = useFormField({
    infoMessage: 'Default directory for new projects',
    initialValue: defaultLocationDirPath,
    label: 'Default destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const defaultRomFilePath = useSelector(
    getSettingString(SettingString.NewProjectDefaultRomFilePath),
  );
  const newProjectDefaultRomFilePathField = useFormField({
    infoMessage: 'ROM used for the project (a copy will be made).',
    initialValue: defaultRomFilePath,
    label: 'Default ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  return (
    <Center flex={1} p={10} h='100%'>
      <Flex direction='column' h='100%' w='100%' maxW='600px'>
        <VStack
          flex={1}
          alignItems='flex-start'
          spacing={8}
          w='100%'
          overflowY='auto'
        >
          <SettingsGroup title='New project'>
            <FormControl {...newProjectDefaultLocationDirPathField.control}>
              <BrowserInput
                mode='directory'
                onBlur={newProjectDefaultLocationDirPathField.handleBlur}
                onChange={newProjectDefaultLocationDirPathField.handleChange}
                placeholder={
                  newProjectDefaultLocationDirPathField.control.label
                }
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
          </SettingsGroup>
        </VStack>
        <HStack w='100%' justifyContent='flex-end' pt={6}>
          <Button
            label='Reset'
            onClick={() => {
              newProjectDefaultLocationDirPathField.handleChange(
                defaultLocationDirPath,
              );
              newProjectDefaultRomFilePathField.handleChange(
                defaultRomFilePath,
              );
            }}
            variant='outline'
          />
          <Button
            label='Save'
            onClick={() => {
              dispatch(
                setSettingString(
                  SettingString.NewProjectDefaultLocationDirPath,
                  newProjectDefaultLocationDirPathField.value,
                ),
              );
              dispatch(
                setSettingString(
                  SettingString.NewProjectDefaultRomFilePath,
                  newProjectDefaultRomFilePathField.value,
                ),
              );
            }}
          />
        </HStack>
      </Flex>
    </Center>
  );
}
