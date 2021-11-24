import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import ComingSoon from '../../../../ui-atoms/other/ComingSoon';

export default function Content(): ReactElement {
  return (
    <Flex h='100%' w='100%'>
      <Tabs borderWidth={1} flex={1} display='flex' flexDir='column'>
        <TabList>
          <Tab>Blocks</Tab>
          <Tab>Music</Tab>
          <Tab>Patches</Tab>
          <Tab>Sprites</Tab>
          <Tab>UberASM</Tab>
          <Tab>Backups</Tab>
          <Tab>Releases</Tab>
        </TabList>
        <TabPanels flex={1} display='flex' flexDir='column'>
          <TabPanel flex={1}>
            <ComingSoon title='Blocks' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='Music' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='Patches' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='Sprites' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='UberASM' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='Backups' />
          </TabPanel>
          <TabPanel flex={1}>
            <ComingSoon title='Releases' />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
