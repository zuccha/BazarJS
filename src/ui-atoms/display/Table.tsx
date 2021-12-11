import * as Chakra from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../theme/useColorScheme';

interface TableProps<T> {
  columns: readonly {
    readonly name: string;
    readonly key: keyof T;
  }[];
  getItemKey: (item: T) => string;
  items: T[];
  onSelectItem?: (item: T, index: number) => void;
  selectedItemIndex?: number;
}

export default function Table<T>({
  columns,
  getItemKey,
  items,
  onSelectItem,
  selectedItemIndex,
}: TableProps<T>): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <Chakra.Box flex={1} overflowY='auto'>
      <Chakra.Table colorScheme={colorScheme} flex={1} overflowY='auto'>
        <Chakra.Thead>
          <Chakra.Tr>
            {columns.map((column) => (
              <Chakra.Th key={column.name} borderColor='app.bg1'>
                {column.name}
              </Chakra.Th>
            ))}
          </Chakra.Tr>
        </Chakra.Thead>
        <Chakra.Tbody>
          {items.map((item, index) => (
            <Chakra.Tr
              key={getItemKey(item)}
              onClick={() => {
                onSelectItem?.(item, index);
              }}
              backgroundColor={
                selectedItemIndex === index
                  ? `${colorScheme}.100`
                  : 'transparent'
              }
              _hover={{
                backgroundColor: 'app.bg2',
                cursor: 'pointer',
              }}
            >
              {columns.map((column) => (
                <Chakra.Td
                  key={`${getItemKey(item)}-${item[column.key]}`}
                  borderColor='app.bg1'
                >
                  {item[column.key]}
                </Chakra.Td>
              ))}
            </Chakra.Tr>
          ))}
        </Chakra.Tbody>
      </Chakra.Table>
    </Chakra.Box>
  );
}
