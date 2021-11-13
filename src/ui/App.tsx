import {
  CopyIcon,
  DragHandleIcon,
  InfoIcon,
  QuestionIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { Flex, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import useActionCreator from '../hooks/useActionCreator';
import { AppRouteName, selectAppRoute, setAppRoute } from '../store/navigation';
import PageButton from './PageButton';
import About from './pages/About';
import Help from './pages/Help';
import Home from './pages/Home';
import Project from './pages/Project';
import Settings from './pages/Settings';

const PageByAppRouteName: Record<AppRouteName, () => ReactElement> = {
  [AppRouteName.About]: About,
  [AppRouteName.Help]: Help,
  [AppRouteName.Home]: Home,
  [AppRouteName.Project]: Project,
  [AppRouteName.Settings]: Settings,
} as const;

export default function AppNavigation(): ReactElement {
  const appRoute = useSelector(selectAppRoute);
  const dispatchSetAppRoute = useActionCreator(setAppRoute);
  const Page = PageByAppRouteName[appRoute.name];

  return (
    <Flex height='100%'>
      <VStack p='3' bg='app.bg2'>
        <PageButton
          icon={<DragHandleIcon />}
          label='Home'
          onClick={() => dispatchSetAppRoute({ name: AppRouteName.Home })}
        />
        <PageButton
          icon={<CopyIcon />}
          label='Project'
          onClick={() => dispatchSetAppRoute({ name: AppRouteName.Project })}
        />
        <PageButton
          icon={<SettingsIcon />}
          label='Settings'
          onClick={() => dispatchSetAppRoute({ name: AppRouteName.Settings })}
        />
        <Flex flex={1} />
        <PageButton
          icon={<InfoIcon />}
          label='About'
          onClick={() => dispatchSetAppRoute({ name: AppRouteName.About })}
        />
        <PageButton
          icon={<QuestionIcon />}
          label='Help'
          onClick={() => dispatchSetAppRoute({ name: AppRouteName.Help })}
        />
      </VStack>
      <Flex flex={1} bg='app.bg3'>
        <Page />
      </Flex>
    </Flex>
  );
}
