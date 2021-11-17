import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/react';
import { ReactElement, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { openProject } from '../../../../store/slices/core/slices/project';
import {
  AppHomeRouteName,
  AppRouteName,
  setAppHomeRoute,
  setAppRoute,
} from '../../../../store/slices/navigation';
import {
  getRecentProjects,
  prioritizeRecentProject,
  removeRecentProject,
} from '../../../../store/slices/settings';
import Button from '../../../../ui-atoms/input/Button';
import FormError from '../../../../ui-atoms/input/FormError';
import { ErrorReport } from '../../../../utils/ErrorReport';

const { $Dialog, $FileSystem } = window.api;

export default function Overview(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const [openError, setOpenError] = useState<ErrorReport | undefined>();

  const recentProjectDirPaths = useSelector(getRecentProjects());

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
      dispatch(prioritizeRecentProject(path));
    }
  }, [dispatch]);

  const handleOpenRecentProject = useCallback(
    (path: string) => {
      const error = dispatch(openProject({ directory: path }));
      if (error) {
        setOpenError(error);
        dispatch(removeRecentProject(path));
      } else {
        setOpenError(undefined);
        dispatch(setAppRoute({ name: AppRouteName.Project }));
        dispatch(prioritizeRecentProject(path));
      }
    },
    [dispatch],
  );

  const handleRemoveRecentProject = useCallback(
    (path: string) => {
      dispatch(removeRecentProject(path));
    },
    [dispatch],
  );

  return (
    <Center flex={1} height='100%'>
      <VStack alignItems='flex-start' spacing={8} maxW={400}>
        <VStack alignItems='center' w='100%'>
          <Heading size='md' color='app.fg1'>
            SMW's Bazar
          </Heading>
          <Heading size='xs' color='app.fg1'>
            A tool for hacking Super Mario World
          </Heading>
        </VStack>

        <VStack spacing={2} w='100%' maxW='200' alignSelf='center'>
          <Button
            label='New project'
            onClick={handleCreateProjectFromSource}
            isFullWidth
          />
          <Button
            label='Open project'
            onClick={handleOpenProject}
            isFullWidth
          />
        </VStack>

        {openError && (
          <Box alignSelf='center'>
            <FormError errorReport={openError} />
          </Box>
        )}

        <VStack spacing={1} alignItems='flex-start' w='100%'>
          <Heading size='sm' color='app.fg1'>
            Recent projects
          </Heading>
          {recentProjectDirPaths.items.map((projectDirPath) => {
            const projectName = $FileSystem.basename(projectDirPath);
            const truncatedPath =
              projectDirPath.length > 40
                ? `${projectDirPath.substr(0, 37)}...`
                : projectDirPath;
            return (
              <Flex flex={1} key={projectDirPath} alignItems='center'>
                <Button
                  label='⨉'
                  onClick={() => handleRemoveRecentProject(projectDirPath)}
                  variant='link'
                />
                <Button
                  label={`${projectName}`}
                  onClick={() => handleOpenRecentProject(projectDirPath)}
                  variant='link'
                />
                <Text fontSize={14}>&emsp;{truncatedPath}</Text>
              </Flex>
            );
          })}
          {recentProjectDirPaths.items.length === 0 && (
            <Text color='app.fg1' fontStyle='italic'>
              No recent projects
            </Text>
          )}
        </VStack>
      </VStack>
    </Center>
  );
}
