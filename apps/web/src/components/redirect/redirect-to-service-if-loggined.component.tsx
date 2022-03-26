import { Redirect } from 'react-router-dom';
import { useUser } from '../../libs';
import { ServicePageURL } from '../../pages/routes';

export const RedirectToServiceIfLoggedIn: React.FC = ({ children }) => {
  const { data } = useUser();

  if (data) {
    return <Redirect to={ServicePageURL}></Redirect>;
  }

  return <>{children}</>;
};
