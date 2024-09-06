'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  components: {
    MuiButton: {
      styleOverrides: {
        // text: {
        //   '&:hover': {
        //     color: '#64b5f6',
        //     // backgroundColor: '#64b5f620',
        //   },
        // },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px transparent inset',
            WebkitTextFillColor: '#000',
            caretColor: '#000',
          },
        },
      },
    },
  },
});

const responsiveFontSizesTheme = responsiveFontSizes(theme);

export { responsiveFontSizesTheme };
