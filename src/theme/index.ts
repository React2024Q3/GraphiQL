'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
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
