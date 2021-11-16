import { Heading, VStack } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/react';
import { ReactElement, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { openProject } from '../../../../store/slices/core/slices/project';
import {
  AppHomeRouteName,
  AppRouteName,
  setAppHomeRoute,
  setAppRoute,
} from '../../../../store/slices/navigation';
import Button from '../../../../ui-atoms/input/Button';
import FormError from '../../../../ui-atoms/input/FormError';
import { ErrorReport } from '../../../../utils/ErrorReport';

const { $Dialog } = window.api;

export default function Overview(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const [openError, setOpenError] = useState<ErrorReport | undefined>();

  const handleCreateProjectFromSource = useCallback(() => {
    dispatch(
      setAppHomeRoute({
        name: AppHomeRouteName.ProjectCreationFromSource,
      }),
    );
  }, [dispatch]);

  const handleOpenProject = useCallback(() => {
    const paths = $Dialog.open({
      title: 'Select a directory',
      properties: ['openDirectory'],
    });
    const path = paths && paths[0];
    if (!path) {
      return;
    }
    const error = dispatch(openProject({ directory: path }));
    if (error) {
      setOpenError(error);
    } else {
      setOpenError(undefined);
      dispatch(setAppRoute({ name: AppRouteName.Project }));
    }
  }, [dispatch]);

  return (
    <Center flex={1}>
      <VStack minW={200} alignItems='flex-start' spacing={8}>
        <VStack alignItems='flex-start'>
          <Heading size='md' color='app.fg1'>
            SMW's Bazar
          </Heading>
          <Heading size='xs' color='app.fg1'>
            A tool for hacking Super Mario World
          </Heading>
        </VStack>
        <VStack spacing={2} minW={200} alignItems='flex-start'>
          <Button
            label='New'
            onClick={handleCreateProjectFromSource}
            isFullWidth
          />
          <Button label='Open' onClick={handleOpenProject} isFullWidth />
          {openError && <FormError errorReport={openError} />}
        </VStack>

        <VStack spacing={1} alignItems='flex-start'>
          <Heading size='sm' color='app.fg1'>
            Recent projects
          </Heading>
          <Button
            label='Ultra Kaizo World 4'
            onClick={() => {}}
            variant='link'
          />
          <Button
            label='Another Revenge Hack'
            onClick={() => {}}
            variant='link'
          />
        </VStack>
      </VStack>
    </Center>
  );
}
