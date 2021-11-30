import { ReactElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  getProjectInfo,
  setProjectInfo,
} from '../../../../store/slices/core/slices/project';
import Info from './Info';

const defaultInfo = {
  name: 'No project',
  author: '',
};

export default function Sidebar(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const info = useSelector(getProjectInfo());
  const editInfo = useCallback(
    (newConfig) => {
      dispatch(setProjectInfo(newConfig));
    },
    [dispatch],
  );

  return (
    <Info info={info ?? defaultInfo} isDisabled={!info} onEdit={editInfo} />
  );
}
