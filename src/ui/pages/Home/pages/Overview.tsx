import { Heading, VStack } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import {
  AppHomeRouteName,
  setAppHomeRoute,
} from '../../../../store/slices/navigation';
import Button from '../../../../ui-atoms/input/Button';

export default function Overview(): ReactElement {
  const dispatch = useDispatch();

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
            onClick={() => {
              dispatch(
                setAppHomeRoute({
                  name: AppHomeRouteName.ProjectCreationFromSource,
                }),
              );
            }}
            isFullWidth
          />
          <Button label='Open' onClick={() => {}} isFullWidth />
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
