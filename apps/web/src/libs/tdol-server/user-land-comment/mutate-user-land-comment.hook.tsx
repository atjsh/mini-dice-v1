import { useMutation } from '@tanstack/react-query';
import { submitUserLandComment } from './submit-user-land-comment';

export const mutateUserLandComment = () => {
  return useMutation({ mutationFn: submitUserLandComment });
};
