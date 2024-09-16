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
    Primary: 'hsla(180, 80%, 17%, 0.1)',
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
      style={{
        backgroundColor: backgroundColorMap[label],
        color: '#064B4F',
      }}
    />
  );
};

export default Chip;
