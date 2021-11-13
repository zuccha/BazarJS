import {
  CopyIcon,
  DragHandleIcon,
  InfoIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { Flex, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import IconButton from '../ui-atoms/input/IconButton';
import Tooltip from '../ui-atoms/overlay/Tooltip';

enum Tab {
  Home,
  Project,
  Settings,
  Info,
}

const ContentByTab: Record<Tab, () => ReactElement> = {
  [Tab.Home]: () => <span>home</span>,
  [Tab.Project]: () => <span>project</span>,
  [Tab.Settings]: () => <span>settings</span>,
  [Tab.Info]: () => <span>info</span>,
} as const;

interface TabButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
}

function TabButton({ icon, label, onClick }: TabButtonProps): ReactElement {
  return (
    <Tooltip label={label} placement='right'>
      <IconButton label={label} icon={icon} onClick={onClick} />
    </Tooltip>
  );
}

export default function AppNavigation(): ReactElement {
  const [tab, setTab] = useState<Tab>(Tab.Home);
  const Content = ContentByTab[tab];
  return (
    <Flex height='100%'>
      <VStack p='3' bg='app.bg2'>
        <TabButton
          icon={<DragHandleIcon />}
          label='Home'
          onClick={() => setTab(Tab.Home)}
        />
        <TabButton
          icon={<CopyIcon />}
          label='Project'
          onClick={() => setTab(Tab.Project)}
        />
        <TabButton
          icon={<SettingsIcon />}
          label='Settings'
          onClick={() => setTab(Tab.Settings)}
        />
        <Flex flex={1} />
        <TabButton
          icon={<InfoIcon />}
          label='About'
          onClick={() => setTab(Tab.Info)}
        />
      </VStack>
      <Flex flex={1} bg='app.bg3'>
        <Content />
      </Flex>
    </Flex>
  );
}
