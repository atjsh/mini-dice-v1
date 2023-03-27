import { FourOhFourPage } from './404.page';
import { FinishLoginPage } from './FinishLogin.page';
import { LoginSuccessPage } from './FinishSignup.page';
import { IndexPage } from './Index.page';
import { LogoutPage } from './Logout.page';
import { NotificationPage } from './NotificationCenter.page';
import { PrivaryPage } from './Privacy.page';
import { RankingPage } from './Ranking.page';
import { ServicePage } from './Service.page';
import { TempSignupPage } from './TempSignup.page';
import { TerminatePage } from './Terminate.page';
import { UpdatesPage } from './Updates.page';
import { TermsPage } from './terms.page';

export type Protection =
  | 'public'
  | 'notAuthed'
  | 'authed'
  | 'signupCompleted'
  | 'signupNotCompleted';

export interface ProtectedRoute {
  path: string;
  component: React.ComponentType;
  title: string;
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
export const UpdatesPageURL = '/updates';
export const NotificationPageURL = '/notifications';

function getTitle(subTitle?: string) {
  return `미니다이스 인생게임 | Mini Dice ${subTitle ? '-' : ''} ${
    subTitle ?? ''
  }`;
}

export const protectedRoutes: ProtectedRoute[] = [
  {
    path: '*',
    component: FourOhFourPage,
    title: getTitle('404'),
    protection: 'public',
  },
  {
    path: IndexPageURL,
    component: IndexPage,
    title: getTitle(),
    protection: 'notAuthed',
  },
  {
    path: LogoutPageURL,
    component: LogoutPage,
    title: getTitle('Logout'),
    protection: 'public',
  },
  {
    path: FinishSignupPageURL,
    component: LoginSuccessPage,
    title: getTitle('Sign up'),
    protection: 'signupNotCompleted',
  },
  {
    path: ServicePageURL,
    component: ServicePage,
    title: getTitle(),
    protection: 'signupCompleted',
  },
  {
    path: TempSignupPageURL,
    component: TempSignupPage,
    title: getTitle('Sign Up (anonymous)'),
    protection: 'notAuthed',
  },
  {
    path: PrivacyPolicyPageURL,
    component: PrivaryPage,
    title: getTitle('Privacy Policy'),
    protection: 'public',
  },
  {
    path: TermsPageURL,
    component: TermsPage,
    title: getTitle('Terms'),
    protection: 'public',
  },
  {
    path: TerminatePageURL,
    component: TerminatePage,
    title: getTitle('Terminate'),
    protection: 'signupCompleted',
  },
  {
    path: RankingPgaeURL,
    component: RankingPage,
    title: getTitle('Ranking'),
    protection: 'signupCompleted',
  },
  {
    path: UpdatesPageURL,
    component: UpdatesPage,
    title: getTitle('Updates'),
    protection: 'public',
  },
  {
    path: '/finish-login',
    component: FinishLoginPage,
    title: getTitle('Finishing Login'),
    protection: 'public',
  },
  {
    path: NotificationPageURL,
    component: NotificationPage,
    title: getTitle('Notification'),
    protection: 'signupCompleted',
  },
];
