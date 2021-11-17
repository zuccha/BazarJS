import { ReactElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  getProjectConfig,
  setProjectConfig,
} from '../../../../store/slices/core/slices/project';
import Config from './Config';

const defaultConfig = {
  name: 'No project',
  author: '',
};

export default function Sidebar(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const config = useSelector(getProjectConfig());
  const editConfig = useCallback(
    (newConfig) => {
      dispatch(setProjectConfig(newConfig));
    },
    [dispatch],
  );

  return (
    <Config
      config={config ?? defaultConfig}
      isDisabled={!config}
      onEdit={editConfig}
    />
  );
}
