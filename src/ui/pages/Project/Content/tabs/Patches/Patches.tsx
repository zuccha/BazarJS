import { Flex, HStack } from '@chakra-ui/react';
import { ReactElement, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPatches } from '../../../../../../store/slices/core/slices/project';
import Table from '../../../../../../ui-atoms/display/Table';
import Button from '../../../../../../ui-atoms/input/Button';
import PatchAddition from './PatchAddition';

const columns = [{ name: 'Name', key: 'name' }] as const;

export default function Content(): ReactElement {
  const [isPatchAdditionVisible, setPatchAdditionVisible] = useState(false);

  const patches = useSelector(getPatches()) ?? [];

  const items = useMemo(() => {
    return patches.map((patch) => patch.info);
  }, [patches]);

  const [selectedItemIndex, setSelectedItemIndex] = useState<
    number | undefined
  >();

  return (
    <>
      <Flex flexDir='column' flex={1} h='100%' w={512}>
        <Flex
          flexDir='column'
          flex={1}
          // h='100%'
          borderColor='app.bg1'
          borderWidth={1}
        >
          <Table
            columns={columns}
            items={items}
            getItemKey={(item) => item.name}
            onSelectItem={(_, index) => setSelectedItemIndex(index)}
            selectedItemIndex={selectedItemIndex}
          />
        </Flex>
        <HStack justifyContent='flex-end' mt={2}>
          <Button label='Apply all' onClick={() => {}} />
          <Button label='Add' onClick={() => setPatchAdditionVisible(true)} />
        </HStack>
      </Flex>

      {isPatchAdditionVisible && (
        <PatchAddition onClose={() => setPatchAdditionVisible(false)} />
      )}
    </>
  );
}
