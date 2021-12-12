import {
  Flex,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import useColorScheme from '../../../theme/useColorScheme';
import ToolCustom from './ToolCustom';
import ToolEmbedded from './ToolEmbedded';

export default function Tools(): ReactElement {
  const colorScheme = useColorScheme();
  return (
    <Flex h='100%' w='100%' alignItems='center' justifyContent='center' p={10}>
      <Tabs
        h='100%'
        w='100%'
        maxW={512}
        isFitted
        colorScheme={colorScheme}
        overflowY='auto'
      >
        <TabList>
          <Tab>Embedded</Tab>
          <Tab>Custom</Tab>
        </TabList>
        <TabPanels>
          <TabPanel paddingBottom={0} paddingX={0}>
            <VStack h='100%' divider={<StackDivider />}>
              <Text pb={2}>
                Bazar needs specific versions of the following tools to work
                properly, so you cannot customize them. These tools will be
                downloaded from SMW Central into you home directory
                ("~/Bazar/tools").
              </Text>
              <ToolEmbedded
                name='Lunar Magic'
                onDownload={() => {}}
                status='not-installed'
              />
              <ToolEmbedded
                name='Asar'
                onDownload={() => {}}
                status='not-installed'
              />
              <ToolEmbedded
                name='Flips'
                onDownload={() => {}}
                status='not-installed'
              />
              <ToolEmbedded
                name='GPS'
                onDownload={() => {}}
                status='installed'
              />
              <ToolEmbedded
                name='PIXI'
                onDownload={() => {}}
                status='not-installed'
              />
              <ToolEmbedded
                name='UberASM'
                onDownload={() => {}}
                status='downloading'
              />
            </VStack>
          </TabPanel>
          <TabPanel paddingBottom={0} paddingX={0}>
            <VStack h='100%' divider={<StackDivider />}>
              <Text pb={2}>
                These are tools of your personal choice. The editor (e.g., VS
                Code) will be used to open source code files (e.g., patches and
                blocks). The emulator will be used to run the game.
              </Text>
              <ToolCustom
                exePath='/path/to/exe'
                name='Editor'
                onChoose={() => {}}
              />
              <ToolCustom
                exePath={undefined}
                name='Emulator'
                onChoose={() => {}}
              />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
