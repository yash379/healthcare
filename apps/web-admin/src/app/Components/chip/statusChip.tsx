import React from 'react';
import { IconButton, Chip as MuiChip } from '@mui/material';
import theme from '../../theme';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
type ChipLabel =
  | 'Primary'
  | 'Secondary'
  | 'Error'
  | 'Warning'
  | 'Info'
  | 'Success';

interface CustomstatusChipProps {
  label: ChipLabel;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; 
  width: string;
}

const StatusChip: React.FC<CustomstatusChipProps> = ({ label, children, onClick, width, ...props }) => {
  const colorMap: Record<
    ChipLabel,
    'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  > = {
    Primary: 'primary',
    Secondary: 'secondary',
    Error: 'error',
    Warning: 'warning',
    Info: 'info',
    Success: 'success',
  };

  const backgroundColorMap: Record<ChipLabel, string> = {
    Primary: '#B8E8FF',
    Secondary: '#F5F5F5',
    Error: '#FFDFDF',
    Warning: '#FFF9D4',
    Info: '#CEBEE1',
    Success: '#D7FFD0',
  };
  

  return (
    <MuiChip
      {...props}
      label={children}
      onClick={onClick}
      // deleteIcon={<ExpandMoreOutlinedIcon style={{ color: theme.palette[colorMap[label]].main }}  />}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      // onDelete={()=> {}} 
      style={{
        backgroundColor: backgroundColorMap[label],
        color: theme.palette[colorMap[label]].main,
        maxWidth: width || 'auto',
        minWidth: width || 'auto',
        width: `${width} !important`,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    />
  );
};

export default StatusChip;
