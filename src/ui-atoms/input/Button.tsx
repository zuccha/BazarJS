import * as Chakra from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface ButtonProps {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}

export default function Button({
  isDisabled,
  isFullWidth = false,
  label,
  onClick,
  variant = 'solid',
}: ButtonProps): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <Chakra.Button
      aria-label={label}
      borderRadius='0'
      colorScheme={colorScheme}
      disabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      py={1}
      size='sm'
      variant={variant}
    >
      {label}
    </Chakra.Button>
  );
}
