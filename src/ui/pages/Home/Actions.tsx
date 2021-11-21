import { Box, VStack } from '@chakra-ui/layout';
import { ReactElement, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { openProject } from '../../../store/slices/core/slices/project';
import { AppRouteName, setAppRoute } from '../../../store/slices/navigation';
import { prioritizeRecentProject } from '../../../store/slices/settings';
import Button from '../../../ui-atoms/input/Button';
import FormError from '../../../ui-atoms/input/FormError';
import { ErrorReport } from '../../../utils/ErrorReport';
import ProjectCreationFromSource from './drawers/ProjectCreationFromSource';

const { $Dialog } = window.api;

export default function Actions(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const [isProjectCreationFromSourceOpen, setIsProjectCreationFromSourceOpen] =
    useState(false);
  const [openError, setOpenError] = useState<ErrorReport | undefined>();

  const handleCreateProjectFromSource = useCallback(() => {
    setIsProjectCreationFromSourceOpen(true);
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
      dispatch(prioritizeRecentProject(path));
    }
  }, [dispatch]);

  return (
    <>
      <VStack spacing={2} w='100%'>
        <Button
          label='New project'
          onClick={handleCreateProjectFromSource}
          isFullWidth
          maxW='200px'
        />
        <Button
          label='Open project'
          onClick={handleOpenProject}
          isFullWidth
          maxW='200px'
        />
        {openError && (
          <Box alignSelf='center'>
            <FormError errorReport={openError} />
          </Box>
        )}
      </VStack>
      {isProjectCreationFromSourceOpen && (
        <ProjectCreationFromSource
          onClose={() => setIsProjectCreationFromSourceOpen(false)}
        />
      )}
    </>
  );
}
