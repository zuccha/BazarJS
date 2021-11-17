import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { getProjectConfig } from '../../../../store/slices/core/slices/project';
import Config from './Config';

const defaultConfig = {
  name: 'No project',
  author: '',
};

export default function Sidebar(): ReactElement {
  const config = useSelector(getProjectConfig());
  return <Config config={config ?? defaultConfig} isDisabled={!config} />;
}
