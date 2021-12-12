import {
  Flex,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  downloadAsar,
  downloadFlips,
  downloadGps,
  downloadLunarMagic,
  downloadPixi,
  downloadUberAsm,
  getToolchain,
} from '../../../store/slices/core/slices/toolchain';
import useColorScheme from '../../../theme/useColorScheme';
import { ErrorReport } from '../../../utils/ErrorReport';
import ToolCustom from './ToolCustom';
import ToolEmbedded from './ToolEmbedded';

export default function Tools(): ReactElement {
  const toast = useToast();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const toolchain = useSelector(getToolchain());

  const handleError = useCallback(
    (name: string) => (error: ErrorReport | undefined) => {
      if (error) {
        toast({
          title: `Failed to download ${name}`,
          description: error.main,
          status: 'error',
        });
      }
    },
    [toast],
  );

  const handleDownloadLunarMagic = () => {
    dispatch(downloadLunarMagic()).then(handleError('Lunar Magic'));
  };

  const handleDownloadAsar = () => {
    dispatch(downloadAsar()).then(handleError('Asar'));
  };

  const handleDownloadFlips = () => {
    dispatch(downloadFlips()).then(handleError('Flips'));
  };

  const handleDownloadGps = () => {
    dispatch(downloadGps()).then(handleError('GPS'));
  };

  const handleDownloadPixi = () => {
    dispatch(downloadPixi()).then(handleError('PIXI'));
  };

  const handleDownloadUberAsm = () => {
    dispatch(downloadUberAsm()).then(handleError('UberASM'));
  };

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
                onDownload={handleDownloadLunarMagic}
                status={toolchain.embedded.lunarMagic.status}
              />
              <ToolEmbedded
                name='Asar'
                onDownload={handleDownloadAsar}
                status={toolchain.embedded.asar.status}
              />
              <ToolEmbedded
                name='Flips'
                onDownload={handleDownloadFlips}
                status={toolchain.embedded.flips.status}
              />
              <ToolEmbedded
                name='GPS'
                onDownload={handleDownloadGps}
                status={toolchain.embedded.gps.status}
              />
              <ToolEmbedded
                name='PIXI'
                onDownload={handleDownloadPixi}
                status={toolchain.embedded.pixi.status}
              />
              <ToolEmbedded
                name='UberASM'
                onDownload={handleDownloadUberAsm}
                status={toolchain.embedded.uberAsm.status}
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
