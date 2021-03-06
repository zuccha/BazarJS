import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../store';
import {
  addPatchFromDirectory,
  addPatchFromFile,
} from '../../../../../../store/slices/core/slices/project';
import useColorScheme from '../../../../../../theme/useColorScheme';
import Alert from '../../../../../../ui-atoms/display/Alert';
import BrowserInput from '../../../../../../ui-atoms/input/BrowserInput';
import Button from '../../../../../../ui-atoms/input/Button';
import FormControl, {
  useForm,
  useFormField,
} from '../../../../../../ui-atoms/input/FormControl';
import FormError from '../../../../../../ui-atoms/input/FormError';
import TextInput from '../../../../../../ui-atoms/input/TextInput';
import Drawer from '../../../../../../ui-atoms/overlay/Drawer';

const { $FileSystem } = window.api;

interface PatchAdditionProps {
  onClose: () => void;
}

export default function PatchAddition({
  onClose,
}: PatchAdditionProps): ReactElement {
  const colorScheme = useColorScheme();
  const [isSingleFile, setIsSingleFile] = useState(true);

  const nameField = useFormField({
    infoMessage: 'Name of the patch',
    initialValue: '',
    isRequired: true,
    label: 'Patch name',
    onValidate: $FileSystem.validateIsValidName,
  });

  const sourceDirPathField = useFormField({
    infoMessage: 'Directory containing the patch file(s)',
    initialValue: '',
    isRequired: true,
    label: 'Location',
    onValidate: $FileSystem.validateExistsDir,
  });

  const mainFilePathField = useFormField({
    infoMessage: 'Entry point of the patch',
    initialValue: '',
    isRequired: true,
    label: 'Main file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateContainsFile(sourceDirPathField.value, value) ||
      $FileSystem.validateHasExtension(value, '.asm'),
  });

  const singleFilePathField = useFormField({
    infoMessage: 'Patch file',
    initialValue: '',
    isRequired: true,
    label: 'File',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.asm'),
  });

  const dispatch = useDispatch<AppDispatch>();

  const form = useForm(
    isSingleFile
      ? {
          fields: [nameField, singleFilePathField],
          onSubmit: () => {
            return dispatch(
              addPatchFromFile({
                name: nameField.value.trim(),
                filePath: singleFilePathField.value.trim(),
              }),
            );
          },
        }
      : {
          fields: [nameField, mainFilePathField, sourceDirPathField],
          onSubmit: () => {
            return dispatch(
              addPatchFromDirectory({
                name: nameField.value.trim(),
                sourceDirPath: sourceDirPathField.value.trim(),
                mainFilePath: mainFilePathField.value.trim(),
              }),
            );
          },
        },
  );

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

          <Tabs
            isFitted
            w='100%'
            index={isSingleFile ? 0 : 1}
            onChange={(index) => setIsSingleFile(index === 0)}
            colorScheme={colorScheme}
          >
            <TabList>
              <Tab>File</Tab>
              <Tab>Directory</Tab>
            </TabList>
            <TabPanels>
              <TabPanel paddingBottom={0} paddingX={0}>
                <FormControl {...singleFilePathField.control}>
                  <BrowserInput
                    filters={[{ name: 'File', extensions: ['asm'] }]}
                    mode='file'
                    onBlur={singleFilePathField.handleBlur}
                    onChange={singleFilePathField.handleChange}
                    placeholder={singleFilePathField.control.label}
                    value={singleFilePathField.value}
                  />
                </FormControl>
              </TabPanel>
              <TabPanel paddingBottom={0} paddingX={0}>
                <VStack width='100%' spacing={4} flex={1}>
                  <FormControl {...sourceDirPathField.control}>
                    <BrowserInput
                      mode='directory'
                      onBlur={sourceDirPathField.handleBlur}
                      onChange={sourceDirPathField.handleChange}
                      placeholder={sourceDirPathField.control.label}
                      value={sourceDirPathField.value}
                    />
                  </FormControl>

                  <FormControl {...mainFilePathField.control}>
                    <BrowserInput
                      filters={[{ name: 'Main file', extensions: ['asm'] }]}
                      mode='file'
                      onBlur={mainFilePathField.handleBlur}
                      onChange={mainFilePathField.handleChange}
                      placeholder={mainFilePathField.control.label}
                      value={mainFilePathField.value}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Alert status='info'>
            The patch will be added to the project, copying the original files.
          </Alert>
        </VStack>

        {form.error && <FormError errorReport={form.error} />}
      </Flex>
    </Drawer>
  );
}
