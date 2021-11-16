import * as Chakra from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface IconButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}

export default function IconButton({
  icon,
  label,
  onClick,
  size,
  variant = 'solid',
}: IconButtonProps): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <Chakra.IconButton
      aria-label={label}
      colorScheme={colorScheme}
      icon={icon}
      onClick={onClick}
      size={size}
      variant={variant}
    />
  );
}
