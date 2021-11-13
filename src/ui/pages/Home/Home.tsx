import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import {
  AppHomeRouteName,
  selectAppHomeRoute,
} from '../../../store/navigation';
import Overview from './pages/Overview';
import ProjectCreationFromSource from './pages/ProjectCreationFromSource';
import ProjectCreationFromTemplate from './pages/ProjectCreationFromTemplate';

const PageByAppRouteName: Record<AppHomeRouteName, () => ReactElement> = {
  [AppHomeRouteName.Overview]: Overview,
  [AppHomeRouteName.ProjectCreationFromSource]: ProjectCreationFromSource,
  [AppHomeRouteName.ProjectCreationFromTemplate]: ProjectCreationFromTemplate,
} as const;

export default function Home(): ReactElement {
  const appRoute = useSelector(selectAppHomeRoute);
  const Page = PageByAppRouteName[appRoute.name];
  return <Page />;
}
