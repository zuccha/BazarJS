import * as Chakra from '@chakra-ui/react';
import { SpaceProps } from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface ButtonProps extends SpaceProps {
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
  ...props
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
      {...props}
    >
      {label}
    </Chakra.Button>
  );
}
