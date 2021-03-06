import { ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, HStack, useToast } from '@chakra-ui/react';
import { ReactElement, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PatchInfo } from '../../../../../../core/Patch';
import { AppDispatch } from '../../../../../../store';
import {
  getPatches,
  removePatch,
} from '../../../../../../store/slices/core/slices/project';
import Output from '../../../../../../ui-atoms/display/Output';
import Table from '../../../../../../ui-atoms/display/Table';
import Button from '../../../../../../ui-atoms/input/Button';
import AlertDelete from '../../../../../../ui-atoms/overlay/AlertDelete';
import PatchAddition from './PatchAddition';

const columns = [{ name: 'Name', key: 'name' }] as const;

export default function Content(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [isPatchAdditionVisible, setPatchAdditionVisible] = useState(false);
  const [patchToRemove, setPatchToRemove] = useState<PatchInfo | undefined>();

  const patches = useSelector(getPatches()) ?? [];

  const actions = useMemo(() => {
    return [
      {
        icon: <ArrowForwardIcon />,
        tooltip: 'Apply patch',
        onClick: () => {},
      },
      {
        icon: <EditIcon />,
        tooltip: 'Open patch in editor',
        onClick: () => {},
      },
      {
        icon: <DeleteIcon />,
        tooltip: 'Remove patch',
        onClick: (patch: PatchInfo) => {
          setPatchToRemove(patch);
        },
      },
    ];
  }, []);

  const items = useMemo(() => {
    return patches.map((patch) => patch.info);
  }, [patches]);

  return (
    <>
      <Flex h='100%'>
        <Flex flexDir='column' h='100%' w={512}>
          <Flex
            flexDir='column'
            flex={1}
            h='100%'
            borderColor='app.bg1'
            borderWidth={1}
          >
            <Table
              actions={actions}
              columns={columns}
              items={items}
              getItemKey={(item) => item.name}
            />
          </Flex>
          <HStack justifyContent='flex-end' mt={2}>
            <Button label='Apply all' onClick={() => {}} isDisabled />
            <Button label='Add' onClick={() => setPatchAdditionVisible(true)} />
          </HStack>
        </Flex>
        <Flex w={512} h='100%' ml={3} flexDir='column' borderColor='app.bg1'>
          <Output output='' />
        </Flex>
      </Flex>

      {isPatchAdditionVisible && (
        <PatchAddition onClose={() => setPatchAdditionVisible(false)} />
      )}

      {patchToRemove && (
        <AlertDelete
          onClose={() => setPatchToRemove(undefined)}
          onDelete={() => {
            const error = dispatch(removePatch(patchToRemove.name));
            if (error) {
              toast({
                title: 'Failed to remove patch',
                description: error.main,
                status: 'error',
              });
            }
          }}
          title={`Remove patch "${patchToRemove.name}"`}
        />
      )}
    </>
  );
}
