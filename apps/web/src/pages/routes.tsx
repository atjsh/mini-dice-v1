import { FourOhFourPage } from './404.page';
import { IndexPage } from './Index.page';
import { LoginSuccessPage } from './FinishSignup.page';
import { LogoutPage } from './Logout.page';
import { ServicePage } from './Service.page';
import { TempSignupPage } from './TempSignup.page';

export type Route = {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  exact: boolean;
  authRequired: boolean;
};

export type Protection =
  | 'public'
  | 'notAuthed'
  | 'authed'
  | 'signupCompleted'
  | 'signupNotCompleted';

export interface ProtectedRoute {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  exact: boolean;
  protection: Protection;
}

export const IndexPageURL = '/';
export const LogoutPageURL = '/logout';
export const TempSignupPageURL = '/anon';
export const ServicePageURL = '/service';
export const FinishSignupPageURL = '/finish-signup';

function getTitle(subTitle: string) {
  return `Mini Dice - ${subTitle}`;
}

const protectedRoutesUnreversed: ProtectedRoute[] = [
  {
    path: '/',
    component: FourOhFourPage,
    title: getTitle('404'),
    exact: false,
    protection: 'public',
  },
  {
    path: IndexPageURL,
    component: IndexPage,
    title: getTitle('Home'),
    exact: true,
    protection: 'notAuthed',
  },
  {
    path: LogoutPageURL,
    component: LogoutPage,
    title: getTitle('Logout'),
    exact: true,
    protection: 'public',
  },
  {
    path: FinishSignupPageURL,
    component: LoginSuccessPage,
    title: getTitle('Sign up'),
    exact: true,
    protection: 'signupNotCompleted',
  },
  {
    path: ServicePageURL,
    component: ServicePage,
    title: getTitle('Service'),
    exact: true,
    protection: 'signupCompleted',
  },
  {
    path: TempSignupPageURL,
    component: TempSignupPage,
    title: getTitle('바로 플레이'),
    exact: true,
    protection: 'notAuthed',
  },
];

export const protectedRoutes = protectedRoutesUnreversed.reverse();

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
  // {
  //   path: LogoutPageURL,
  //   component: LogoutPage,
  //   title: getTitle('Logout'),
  //   exact: true,
  //   authRequired: false,
  // },
  // {
  //   path: '/login-success',
  //   component: LoginSuccessPage,
  //   title: getTitle('Sign up'),
  //   exact: true,
  //   authRequired: true,
  // },
  // {
  //   path: ServicePageURL,
  //   component: ServicePage,
  //   title: getTitle('Service'),
  //   exact: true,
  //   authRequired: true,
  // },
  // {
  //   path: TempSignupPageURL,
  //   component: TempSignupPage,
  //   title: getTitle('바로 플레이'),
  //   exact: true,
  //   authRequired: false,
  // },
].reverse();
