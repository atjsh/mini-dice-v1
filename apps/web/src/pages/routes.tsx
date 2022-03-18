import { FourOhFourPage } from "./404.page";
import { IndexPage } from "./Index.page";
import { LoginPage } from "./Login.page";
import { LoginSuccessPage } from "./LoginSuccess.page";
import { LogoutPage } from "./Logout.page";
import { ProfilePage } from "./Profile.page";
import { ServicePage } from "./Service.page";
import { InteractionTestPage } from "./TEST/Interactions.page";

export type Route = {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  exact: boolean;
  authRequired: boolean;
};

export const IndexPageURL = "/";
export const LoginPageURL = "/login";
export const LogoutPageURL = "/logout";
export const ProfilePageURL = "/profile";

function getTitle(subTitle: string) {
  return `Mini Dice - ${subTitle}`;
}

export const routes: Route[] = [
  {
    path: IndexPageURL,
    component: FourOhFourPage,
    title: getTitle("404"),
    exact: false,
    authRequired: false
  },
  {
    path: "/",
    component: IndexPage,
    title: getTitle("Home"),
    exact: true,
    authRequired: false
  },
  {
    path: LoginPageURL,
    component: LoginPage,
    title: getTitle("Login"),
    exact: true,
    authRequired: false
  },
  {
    path: LogoutPageURL,
    component: LogoutPage,
    title: getTitle("Logout"),
    exact: true,
    authRequired: false
  },
  {
    path: "/login-success",
    component: LoginSuccessPage,
    title: getTitle("Sign up"),
    exact: true,
    authRequired: true
  },
  {
    path: ProfilePageURL,
    component: ProfilePage,
    title: getTitle("Profile"),
    exact: true,
    authRequired: true
  },
  {
    path: "/service",
    component: ServicePage,
    title: getTitle("Service"),
    exact: true,
    authRequired: true
  },
  {
    path: "/test/interactions",
    component: InteractionTestPage,
    title: getTitle("interactions"),
    exact: true,
    authRequired: true
  }
].reverse();
