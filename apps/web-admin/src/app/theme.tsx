import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';

const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#064B4F",
      light: "#e5fafb",
      dark: "#064B4F",
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
          borderRadius: '12px',
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
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
        },
        sizeMedium: {
          height: '32px',
          padding: '6px 8px',
          borderRadius: '12px',
          minWidth: '84px',
        },
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
            backgroundColor:'white',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            height: '52px !important',
            textTransform: 'none',
            position:'sticky',
            
          },
        },
      },
    },
    // MuiTableRow: {
    //   styleOverrides: {
    //     root: {
    //       '&:hover': {
    //         backgroundColor: 'rgba(33, 150, 243, 0.08)',
    //       },
    //       '&:last-child td, &:last-child th': {
    //         border: 0,
    //       },
    //       textTransform: 'none',
    //       height: "52px !important",
    //     },
    //   },
    // },
    // MuiTableCell: {
    //   styleOverrides: {
    //     root: {
    //       borderBottom: '1px solid rgba(224, 224, 224, 1)',
    //       padding:5,
    //     },
    //     head: {
    //       fontWeight: 600,
    //       backgroundColor: '#F8F8F8',
    //       color: '#000000',
    //     },
    //   },
    // },
     MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
          whiteSpace:'nowrap',
          overflow:'hidden',
          textOverflow:'ellipsis',
          maxWidth:"100px",
          padding:'8px 16px'
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
          color: '#275FA1',
          '& .Mui-selected': {
            backgroundColor: '#275FA1',
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
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#ededed',
            },
            '&:hover fieldset': {
              borderColor: '#ededed',
            },
            size:'small'
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
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
    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#275FA1',
          '& .Mui-selected': {
            backgroundColor: '#275FA1',
            color: '#FFFFFF',
          },
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          border: '1px solid rgba(224, 224, 224, 1)',
          padding: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        displayedRows: {
          color: 'black',
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          flexShrink: 0,
          marginTop: '30px',
        },
        selectLabel: {
          color: 'black',
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          flexShrink: 0,
          marginTop: '28px',
        },
      },
    },
  },
};

const theme = createTheme(baseThemeOptions, componentThemeOptions);

export default responsiveFontSizes(theme);
