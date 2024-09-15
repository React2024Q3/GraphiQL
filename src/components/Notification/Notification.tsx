import { FC, useState } from 'react';

import { Snackbar, SnackbarCloseReason } from '@mui/material';

import { StyledAlert } from './styled';
import { NotificationProps } from './types';

export const Notification: FC<NotificationProps> = ({ isOpen, message, severity }) => {
  const [open, setOpen] = useState(isOpen);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <StyledAlert onClose={handleClose} severity={severity} variant='filled'>
        {message}
      </StyledAlert>
    </Snackbar>
  );
};
