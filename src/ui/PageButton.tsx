import { ReactElement } from 'react';
import IconButton from '../ui-atoms/input/IconButton';

interface PageButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
}

export default function PageButton({
  icon,
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
      variant='ghost'
    />
  );
}
