import { Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { ReactElement, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { openProject } from '../../../store/slices/core/slices/project';
import { AppRouteName, setAppRoute } from '../../../store/slices/navigation';
import {
  getSetting,
  prioritizeRecentProject,
  removeRecentProject,
} from '../../../store/slices/settings';
import Button from '../../../ui-atoms/input/Button';
import FormError from '../../../ui-atoms/input/FormError';
import { Setting } from '../../../utils-electron/Settings.types';
import { ErrorReport } from '../../../utils/ErrorReport';

const { $FileSystem } = window.api;

export default function RecentProjects(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const [openError, setOpenError] = useState<ErrorReport | undefined>();

  const recentProjectDirPaths = useSelector(getSetting(Setting.RecentProjects));

  const handleOpenRecentProject = useCallback(
    (path: string) => {
      const error = dispatch(openProject({ directoryPath: path }));
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
      {openError && (
        <Box alignSelf='center'>
          <FormError errorReport={openError} />
        </Box>
      )}
    </VStack>
  );
}
