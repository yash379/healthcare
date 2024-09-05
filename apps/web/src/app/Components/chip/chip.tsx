import React from 'react';
import { Chip as MuiChip } from '@mui/material';
import theme from '../../theme';

type ChipLabel =
  | 'Primary'
  | 'Secondary'
  | 'Error'
  | 'Warning'
  | 'Info'
  | 'Success';

interface CustomChipProps {
  label: ChipLabel;
  children: React.ReactNode;
}

const Chip: React.FC<CustomChipProps> = ({ label, children, ...props }) => {
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
    Primary: '#03c9d7',
    Secondary: '#fb9678',
    Error: '#e46a76',
    Warning: '#fec90f',
    Info: '#0bb2fb',
    Success: '#00c292',
  };

  return (
    <MuiChip
      {...props}
      label={children}
      style={{
        backgroundColor: backgroundColorMap[label],
        color: 'white',
      }}
    />
  );
};

export default Chip;
