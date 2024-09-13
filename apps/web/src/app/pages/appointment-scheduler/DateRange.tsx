import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DateRangeProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ isOpen, onClose, onApply }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleApply = () => {
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="date-range-modal-title"
      aria-describedby="date-range-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="date-range-modal-title" variant="h6" component="h2" gutterBottom>
          Select Date Range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <DatePicker
              label="From Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="To Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
        </LocalizationProvider>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">Apply</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DateRange;
