import {
  CopyIcon,
  DragHandleIcon,
  InfoIcon,
  QuestionIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { Flex, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import PageButton from './PageButton';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import SettingsPage from './pages/SettingsPage';

enum Page {
  About,
  Help,
  Home,
  Project,
  Settings,
}

const ContentByTab: Record<Page, () => ReactElement> = {
  [Page.About]: AboutPage,
  [Page.Help]: HelpPage,
  [Page.Home]: HomePage,
  [Page.Project]: ProjectPage,
  [Page.Settings]: SettingsPage,
} as const;

export default function AppNavigation(): ReactElement {
  const [page, setPage] = useState<Page>(Page.Home);
  const Content = ContentByTab[page];
  return (
    <Flex height='100%'>
      <VStack p='3' bg='app.bg2'>
        <PageButton
          icon={<DragHandleIcon />}
          label='Home'
          onClick={() => setPage(Page.Home)}
        />
        <PageButton
          icon={<CopyIcon />}
          label='Project'
          onClick={() => setPage(Page.Project)}
        />
        <PageButton
          icon={<SettingsIcon />}
          label='Settings'
          onClick={() => setPage(Page.Settings)}
        />
        <Flex flex={1} />
        <PageButton
          icon={<InfoIcon />}
          label='About'
          onClick={() => setPage(Page.About)}
        />
        <PageButton
          icon={<QuestionIcon />}
          label='Help'
          onClick={() => setPage(Page.Help)}
        />
      </VStack>
      <Flex flex={1} bg='app.bg3'>
        <Content />
      </Flex>
    </Flex>
  );
}
