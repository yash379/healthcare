import React, { useRef } from 'react';
import { TextField, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';

interface FormFieldsProps {
  control: Control<any>;
}

const FormFields: React.FC<FormFieldsProps> = ({ control }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const toTimeRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            className="input-field"
            inputRef={nameRef}
            onKeyDown={(event) => handleKeyDown(event, descriptionRef)}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            className="input-field"
            inputRef={descriptionRef}
            onKeyDown={(event) => handleKeyDown(event, dateRef)}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            inputRef={dateRef}
            onKeyDown={(event) => handleKeyDown(event, timeRef)}
          />
        )}
      />
      <Box mt={2}>
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              margin="dense"
              label="From Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputRef={timeRef}
              onKeyDown={(event) => handleKeyDown(event, toTimeRef)}
            />
          )}
        />
        <Controller
          name="toTime"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              margin="dense"
              label="To Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputRef={toTimeRef}
            />
          )}
        />
      </Box>
    </>
  );
};

export default FormFields;