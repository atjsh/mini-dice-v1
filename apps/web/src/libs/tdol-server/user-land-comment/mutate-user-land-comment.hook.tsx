import { useMutation } from 'react-query';
import { submitUserLandComment } from './submit-user-land-comment';

export const mutateUserLandComment = () => {
  return useMutation(submitUserLandComment);
};
