import { ReactElement } from 'react';
import IconButton from '../ui-atoms/input/IconButton';

interface PageButtonProps {
  icon: ReactElement;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export default function PageButton({
  icon,
  isActive,
  label,
  onClick,
}: PageButtonProps): ReactElement {
  return (
    <IconButton
      label={label}
      icon={icon}
      onClick={onClick}
      size='lg'
      tooltipPlacement='right'
      variant={isActive ? 'outline' : 'ghost'}
    />
  );
}
