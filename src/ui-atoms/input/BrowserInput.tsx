import * as Chakra from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import Button from './Button';
import TextInput from './TextInput';

const { $Dialog } = window.api;

const propertiesByMode = {
  file: 'openFile',
  directory: 'openDirectory',
} as const;

interface BrowserInputProps {
  filters?: { name: string; extensions: string[] }[];
  isDisabled?: boolean;
  isInvalid?: boolean;
  mode: 'file' | 'directory';
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export default function BrowserInput({
  filters,
  isDisabled,
  isInvalid,
  mode,
  onBlur,
  onChange,
  placeholder,
  value,
}: BrowserInputProps): ReactElement {
  const handleBrowse = useCallback(() => {
    const paths = $Dialog.open({
      title: mode === 'file' ? 'Select a file' : 'Select a directory',
      defaultPath: value,
      properties: [propertiesByMode[mode]],
      filters,
    });
    const filePath = paths && paths[0];
    if (filePath) {
      onChange(filePath);
    }
  }, [onChange]);

  return (
    <Chakra.HStack width='100%'>
      <Chakra.Flex flex={1}>
        <TextInput
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </Chakra.Flex>
      <Button
        label='...'
        isDisabled={isDisabled}
        onClick={handleBrowse}
        variant='outline'
      />
    </Chakra.HStack>
  );
}
