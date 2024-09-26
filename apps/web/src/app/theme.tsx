import { Height } from '@mui/icons-material';
import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';

const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#064B4F",
      light: "#e5fafb",
      dark: "#05b2bd",
      contrastText: "#ffffff",
    },
    secondary: {
      main: '#C6C6C6',
      
    },
    success: {
      main: '#1A8B18',
    },
    error: {
      main: '#B12A28',
    },
    warning: {
      main: '#CE8414',
    },
    info: {
      main: '#e1eaf8',
      contrastText:"#222222"
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    body1: {
      fontSize: '14px',
    },
    h1: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '22px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
    },
    h5: {
      fontSize: '16px',
      fontWeight: 600,
    },
    h6: {
      fontSize: '14px',
      fontWeight: 600,
    },
  },
};

const componentThemeOptions: ThemeOptions = {
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: '15px !important',
          height: '40px !important',
          '&:hover': {
            backgroundColor: 'rgba(39, 95, 161, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          height: '40px !important'
        },
        sizeLarge: {
          height: '40px !important',
          padding: '6px 8px',
          borderRadius: '15px !important',
          minWidth: '84px',
        },
        outlined:{
          borderColor:'#064B4F',
          color:'black'
        }
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '22px',
          
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
            backgroundColor:'#E8E8E8',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            textTransform: 'none',
            position:'sticky',
            
          },
        },
      },
    },
     MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
          whiteSpace:'nowrap',
          overflow:'hidden',
          textOverflow:'ellipsis',
          maxWidth:"100px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          height: '12px',
          '& .Mui-selected': {
            color: '#FFFFFF',
          },
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
       
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
      },
      styleOverrides: {
        root: {
          borderWidth: '2px !important',
          '& .MuiOutlinedInput-root': {
            borderRadius: '15px',
            height: '48px !important',
            '& fieldset': {
              borderColor: '#064B4F',
            },
            '&:hover fieldset': {
              borderColor: '#064B4F',
            },
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '15px !important',
            height: '48px !important',
            '& fieldset': {
              borderColor: '#ededed',
            },
            '&:hover fieldset': {
              borderColor: '#ededed',
            },
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'normal',
          '& .MuiBreadcrumbs-separator': {
            color: '#C6C6C6',
            fontSize: '14px',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 'semibold !important',
          minHeight: '20px',
          height: '20px !important',
          borderRadius: '10px !important',
          fontSize: '12px !important',
        },
        sizeMedium: {
          width: '90px !important',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          width: '489px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          // padding: '8px 24px 16px 24px',
          // justifyContent: 'flex-end',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginRight: '8px',
        },
      },
    },
    
  },
};

const theme = createTheme(baseThemeOptions, componentThemeOptions);

export default responsiveFontSizes(theme);
