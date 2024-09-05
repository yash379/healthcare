import React, { useContext, useEffect, useState } from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import theme from '../../theme';
import NavbarContext from '../../contexts/navbar-context';



const Navbar: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isMounted, setIsMounted]=useState(false);

  const navbarcontext=useContext(NavbarContext);
  const location = useLocation();

  

  const handleSelectedText = (label: string) => {
    setSelectedText(label);
  };

  console.log("nav links:",navbarcontext?.links);
  console.log("location:",location.pathname);

  

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
      backgroundColor: '#e5e5e5', 
      gap: 2,
      height: '40px',
      alignItems: 'center',
    }}>
      {navbarcontext?.links.map((link) => {
        const isActive = location.pathname === link.path || (location.pathname.includes('/dms') && link.path.includes('/dms')) || (location.pathname.includes('/reports') && link.path.includes('/reports'));
   
        return(
        <MuiLink
          key={link.path}
          component={RouterLink}
          to={link.path}
          underline="none"
          sx={{
            color: isActive ? '#ffffff' : '#000000',
            backgroundColor:
            isActive
                ? theme.palette.primary.main
                : 'transparent',
            fontSize: '14px',
            fontWeight: '500',
            padding: '5px 10px',
            borderRadius: '16px',
            cursor: 'pointer',
            '&:hover': {
              color: isActive ? '#ffffff' : '#275FA1',
            },
          }}
          onClick={() => handleSelectedText(link.name)}
        >
          {link.name}
        </MuiLink>
    )})}
    </Box>
  );
};

export default Navbar;
