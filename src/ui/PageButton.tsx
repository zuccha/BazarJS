import { ReactElement } from 'react';
import IconButton from '../ui-atoms/input/IconButton';
import Tooltip from '../ui-atoms/overlay/Tooltip';

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
    <Tooltip label={label} placement='right'>
      <IconButton label={label} icon={icon} onClick={onClick} variant='ghost' />
    </Tooltip>
  );
}