import { Center, Heading, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { getProjectName, setProjectName } from '../../../store/project';
import Button from '../../../ui-atoms/input/Button';

export default function Project(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const projectName = useSelector(getProjectName()) ?? '-';

  return (
    <Center flex={1}>
      <VStack>
        <Heading>Project</Heading>
        <Text>{`Name: ${projectName}`}</Text>
        <Button
          label='Update'
          onClick={() => dispatch(setProjectName(projectName + '_'))}
        />
      </VStack>
    </Center>
  );
}
