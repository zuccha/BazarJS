import * as Chakra from '@chakra-ui/react';
import { ReactElement } from 'react';

interface IconButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
}

export default function IconButton({
  icon,
  label,
  onClick,
}: IconButtonProps): ReactElement {
  return (
    <Chakra.IconButton
      aria-label={label}
      icon={icon}
      onClick={onClick}
      size='lg'
    />
  );
}
