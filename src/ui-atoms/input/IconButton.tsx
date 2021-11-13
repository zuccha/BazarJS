import * as Chakra from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface IconButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}

export default function IconButton({
  icon,
  label,
  onClick,
  variant = 'solid',
}: IconButtonProps): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <Chakra.IconButton
      aria-label={label}
      colorScheme={colorScheme}
      icon={icon}
      onClick={onClick}
      size='lg'
      variant={variant}
    />
  );
}
