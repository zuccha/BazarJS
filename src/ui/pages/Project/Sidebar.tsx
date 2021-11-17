import { Heading, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { getProjectName } from '../../../store/slices/core/slices/project';

export default function Sidebar(): ReactElement {
  const projectName = useSelector(getProjectName());
  return (
    <VStack bg='app.bg2' w='256px' height='100%' p={10} alignItems='flex-start'>
      {projectName ? (
        <Heading size='sm'>{projectName}</Heading>
      ) : (
        <Heading size='sm' fontStyle='italic'>
          No project
        </Heading>
      )}
    </VStack>
  );
}
