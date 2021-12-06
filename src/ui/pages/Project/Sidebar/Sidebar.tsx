import { Box, VStack } from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  getProjectInfo,
  setProjectInfo,
} from '../../../../store/slices/core/slices/project';
import Actions from './Actions';
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
    <VStack
      bg='app.bg2'
      w='256px'
      h='100%'
      p={6}
      spacing={6}
      alignItems='flex-start'
    >
      <Info info={info ?? defaultInfo} isDisabled={!info} onEdit={editInfo} />
      <Box w='100%' h='1px' bg='app.fg3' />
      <Actions />
    </VStack>
  );
}
