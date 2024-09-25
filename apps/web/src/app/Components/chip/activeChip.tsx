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

interface CustomActiveChipProps {
  label: ChipLabel;
  children: React.ReactNode;
}

const ActiveChip: React.FC<CustomActiveChipProps> = ({ label, children, ...props }) => {
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
    Primary: '#D0F4FF',
    Secondary: '#fb9678',
    Error: '#FFDFDF',
    Warning: '#fec90f',
    Info: '#0bb2fb',
    Success: '#ebfaf2',
  };

  return (
    <MuiChip
      {...props}
      label={children}
      style={{
        backgroundColor: backgroundColorMap[label],
        color: theme.palette[colorMap[label]].main,
      }}
    />
  );
};

export default ActiveChip;
