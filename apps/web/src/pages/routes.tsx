import { FourOhFourPage } from './404.page';
import { IndexPage } from './Index.page';
import { LoginSuccessPage } from './FinishSignup.page';
import { LogoutPage } from './Logout.page';
import { ServicePage } from './Service.page';
import { TempSignupPage } from './TempSignup.page';
import { PrivaryPage } from './Privacy.page';
import { TermsPage } from './terms.page';
import { TerminatePage } from './Terminate.page';
import { RankingPage } from './Ranking.page';
import { FinishLoginPage } from './FinishLogin.page';

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
export const PrivacyPolicyPageURL = '/privacy';
export const TermsPageURL = '/terms';
export const TerminatePageURL = '/terminate';
export const RankingPgaeURL = '/ranking';

function getTitle(subTitle?: string) {
  return `미니다이스 인생게임 | Mini Dice ${subTitle ? '-' : ''} ${
    subTitle ?? ''
  }`;
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
    title: getTitle(),
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
    title: getTitle(),
    exact: true,
    protection: 'signupCompleted',
  },
  {
    path: TempSignupPageURL,
    component: TempSignupPage,
    title: getTitle('Sign Up (anonymous)'),
    exact: true,
    protection: 'notAuthed',
  },
  {
    path: PrivacyPolicyPageURL,
    component: PrivaryPage,
    title: getTitle('Privacy Policy'),
    exact: true,
    protection: 'public',
  },
  {
    path: TermsPageURL,
    component: TermsPage,
    title: getTitle('Terms'),
    exact: true,
    protection: 'public',
  },
  {
    path: TerminatePageURL,
    component: TerminatePage,
    title: getTitle('Terminate'),
    exact: true,
    protection: 'signupCompleted',
  },
  {
    path: RankingPgaeURL,
    component: RankingPage,
    title: getTitle('Ranking'),
    exact: true,
    protection: 'signupCompleted',
  },
  {
    path: '/finish-login',
    component: FinishLoginPage,
    title: getTitle('Finishing Login'),
    exact: true,
    protection: 'public',
  },
];

export const protectedRoutes = protectedRoutesUnreversed.reverse();
