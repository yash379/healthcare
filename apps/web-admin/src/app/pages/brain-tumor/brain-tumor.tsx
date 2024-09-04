import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Clear as ClearIcon } from '@mui/icons-material';

export function BrainTumor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = environment.apiUrl;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/cancer-detection/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPrediction(response.data);
    } catch (error) {
      setPrediction('Error occurred while predicting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Grid container spacing={4}>
        {/* Left Side: Upload Section */}
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center" style={{ width: '100%' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                style={{ padding: '10px 20px', marginBottom: '10px' }}
              >
                Upload Brain Image
              </Button>
            </label>
            {imagePreview && (
              <Box
                position="relative"
                style={{ width: '100%', maxWidth: '300px' }}
              >
                <img
                  src={imagePreview as string}
                  alt="Preview"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                />
                <IconButton
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                >
                  <ClearIcon color="error" />
                </IconButton>
              </Box>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpload}
              style={{ marginTop: '20px', padding: '10px 20px' }}
              disabled={!selectedFile || loading}
            >
              Predict
            </Button>
          </Box>
        </Grid>

        {/* Right Side: Prediction Section */}
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center">
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>
                  Prediction Result
                </Typography>
                <Typography variant="h6">
                  {prediction
                    ? prediction
                    : 'Upload an image to get a prediction.'}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BrainTumor;
