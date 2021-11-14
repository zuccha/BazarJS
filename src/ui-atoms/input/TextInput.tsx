import * as Chakra from '@chakra-ui/react';
import { ChangeEvent, ReactElement, useCallback } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface TextInputProps {
  isDisabled?: boolean;
  isInvalid?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export default function TextInput({
  isDisabled,
  isInvalid,
  onChange,
  placeholder,
  value,
}: TextInputProps): ReactElement {
  const colorScheme = useColorScheme();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <Chakra.Input
      borderRadius={0}
      colorScheme={colorScheme}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      onChange={handleChange}
      placeholder={placeholder}
      size='sm'
      value={value}
      variant='outline'
    />
  );
}
