import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import { ProjectConfig } from '../../../../core/Project';
import Button from '../../../../ui-atoms/input/Button';
import FormControl, {
  useForm,
  useFormField,
} from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';

const { $FileSystem } = window.api;

interface ConfigEditorProps {
  config: ProjectConfig;
  onCancel: () => void;
  onConfirm: (config: ProjectConfig) => void;
}

export default function ConfigEditor({
  config,
  onCancel,
  onConfirm,
}: ConfigEditorProps): ReactElement {
  const nameField = useFormField({
    infoMessage: 'This will be the name fo the project directory.',
    initialValue: config.name,
    isRequired: true,
    label: 'Project name',
    onValidate: $FileSystem.validateIsValidName,
  });

  const authorField = useFormField({
    infoMessage: 'Author of the project.',
    initialValue: config.author,
    isRequired: false,
    label: 'Author',
  });

  const form = useForm({
    fields: [nameField],
    onSubmit: () => {
      onConfirm({
        name: nameField.value,
        author: authorField.value,
      });
      return undefined;
    },
  });

  return (
    <Drawer isOpen placement='right' onClose={onCancel}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Edit config</DrawerHeader>

        <DrawerBody>
          <VStack>
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
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth='1px'>
          <Button label='Cancel' onClick={onCancel} variant='outline' mr={3} />
          <Button
            label='Save'
            onClick={form.handleSubmit}
            isDisabled={!form.isValid}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
