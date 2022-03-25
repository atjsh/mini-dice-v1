import { useQuery } from 'react-query';
import { logoutUser } from '..';

export const useLogout = () => useQuery(logoutUser.name, logoutUser);
