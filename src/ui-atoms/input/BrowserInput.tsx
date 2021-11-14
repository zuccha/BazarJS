import * as Chakra from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import Button from './Button';
import TextInput from './TextInput';

const propertiesByMode = {
  file: 'openFile',
  directory: 'openDirectory',
} as const;

interface BrowserInputProps {
  filters?: { name: string; extensions: string[] }[];
  isDisabled?: boolean;
  isInvalid?: boolean;
  mode: 'file' | 'directory';
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export default function BrowserInput({
  filters,
  isDisabled,
  isInvalid,
  mode,
  onChange,
  placeholder,
  value,
}: BrowserInputProps): ReactElement {
  const handleBrowse = useCallback(() => {
    const paths = window.api.openDialog({
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
