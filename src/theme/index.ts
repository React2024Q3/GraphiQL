'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: '8rem',
          minHeight: '2.5rem',
          fontSize: '1rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px transparent inset',
            '-webkit-text-fill-color': '#000',
            'caret-color': '#000',
          },
        },
      },
    },
  },
});

const responsiveFontSizesTheme = responsiveFontSizes(theme);

export { responsiveFontSizesTheme };
