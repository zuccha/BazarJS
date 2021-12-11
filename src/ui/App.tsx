import {
  CopyIcon,
  DragHandleIcon,
  InfoIcon,
  LinkIcon,
  QuestionIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { Flex, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppRouteName,
  selectAppRoute,
  setAppRoute,
} from '../store/slices/navigation';
import PageButton from './PageButton';
import About from './pages/About';
import Help from './pages/Help';
import Home from './pages/Home';
import Project from './pages/Project';
import Settings from './pages/Settings';
import Tools from './pages/Tools';

const PageByAppRouteName: Record<AppRouteName, () => ReactElement> = {
  [AppRouteName.About]: About,
  [AppRouteName.Help]: Help,
  [AppRouteName.Home]: Home,
  [AppRouteName.Project]: Project,
  [AppRouteName.Settings]: Settings,
  [AppRouteName.Tools]: Tools,
} as const;

export default function AppNavigation(): ReactElement {
  const appRoute = useSelector(selectAppRoute);
  const dispatch = useDispatch();
  const Page = PageByAppRouteName[appRoute.name];

  return (
    <Flex h='100%'>
      <VStack p='3' bg='app.bg1' overflowY='auto' flexShrink={0}>
        <PageButton
          icon={<DragHandleIcon />}
          label='Home'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.Home }))}
        />
        <PageButton
          icon={<CopyIcon />}
          label='Project'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.Project }))}
        />
        <PageButton
          icon={<LinkIcon />}
          label='Tools'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.Tools }))}
        />
        <PageButton
          icon={<SettingsIcon />}
          label='Settings'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.Settings }))}
        />
        <Flex flex={1} />
        <PageButton
          icon={<InfoIcon />}
          label='About'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.About }))}
        />
        <PageButton
          icon={<QuestionIcon />}
          label='Help'
          onClick={() => dispatch(setAppRoute({ name: AppRouteName.Help }))}
        />
      </VStack>
      <Flex
        flex={1}
        h='100%'
        bg='app.bg3'
        alignItems='flex-start'
        justifyContent='flex-start'
      >
        <Page />
      </Flex>
    </Flex>
  );
}
