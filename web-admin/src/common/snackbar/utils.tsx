import toast from 'react-hot-toast';

import { Snackbar } from './Snackbar';
import { SnackbarType } from './types';

export const showSnackbar = (type: SnackbarType, text: string) => {
  toast.custom(
    <Snackbar
      text={text}
      type={type}
    />,
  );
};
