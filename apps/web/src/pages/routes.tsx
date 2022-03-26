import { FourOhFourPage } from './404.page';
import { IndexPage } from './Index.page';
import { LoginSuccessPage } from './LoginSuccess.page';
import { LogoutPage } from './Logout.page';
import { ServicePage } from './Service.page';
import { TempSignupPage } from './TempSignup.page';
import { InteractionTestPage } from './TEST/Interactions.page';

export type Route = {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  exact: boolean;
  authRequired: boolean;
};

export const IndexPageURL = '/';
export const LogoutPageURL = '/logout';
export const TempSignupPageURL = '/anon';
export const ServicePageURL = '/service';

function getTitle(subTitle: string) {
  return `Mini Dice - ${subTitle}`;
}

export const routes: Route[] = [
  {
    path: '/',
    component: FourOhFourPage,
    title: getTitle('404'),
    exact: false,
    authRequired: false,
  },
  {
    path: IndexPageURL,
    component: IndexPage,
    title: getTitle('Home'),
    exact: true,
    authRequired: false,
  },
  {
    path: LogoutPageURL,
    component: LogoutPage,
    title: getTitle('Logout'),
    exact: true,
    authRequired: false,
  },
  {
    path: '/login-success',
    component: LoginSuccessPage,
    title: getTitle('Sign up'),
    exact: true,
    authRequired: true,
  },
  {
    path: ServicePageURL,
    component: ServicePage,
    title: getTitle('Service'),
    exact: true,
    authRequired: true,
  },
  {
    path: TempSignupPageURL,
    component: TempSignupPage,
    title: getTitle('바로 플레이'),
    exact: true,
    authRequired: false,
  },
  {
    path: '/test/interactions',
    component: InteractionTestPage,
    title: getTitle('interactions'),
    exact: true,
    authRequired: true,
  },
].reverse();
