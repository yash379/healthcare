import styles from './saransh-ai.module.scss';
import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Card,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Clear as ClearIcon } from '@mui/icons-material';
/* eslint-disable-next-line */
export interface SaranshAiProps {}

export function SaranshAi(props: SaranshAiProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = environment.apiUrl;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear previous prediction when a new file is selected
      setPrediction(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/chat-request/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPrediction(response.data);
      console.log('data', response)
    } catch (error) {
      setPrediction('Error occurred while predicting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '50px', maxWidth: '96%' }}>
      <Grid container spacing={4} sx={{ flexWrap: 'nowrap' }}>
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
            marginLeft: '10px',
            paddingLeft: '0px',
          }}
        >
          {/* Predict Button at Top Left */}
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow:
                '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 1.12)',
            }}
          >
            <Box
              top="10px"
              left="10px"
              display={'flex'}
              justifyContent={'space-between'}
              width={'50%'}
              flexDirection={'row'}
              padding={'20px'}
              alignSelf={'center'}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                style={{ padding: '10px 20px' }}
                disabled={!selectedFile || loading}
              >
                Predict
              </Button>
              <input
                accept=".jpg,.jpeg,.png,.pdf" // Updated to accept PDFs
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
                  Upload File
                </Button>
              </label>
            </Box>

            {/* Centered Upload Section */}
            <Box
              textAlign="center"
              style={{ width: '100%', paddingTop: '50px', margin: '10px' }}
            >
              {filePreview && (
                <Box
                  position="relative"
                  style={{ width: '96%', marginTop: '-52px' }}
                >
                  {selectedFile && selectedFile.type.includes('pdf') ? (
                    <iframe
                      src={filePreview as string}
                      style={{ width: '100%', height: '500px', border: 'none' }}
                      title="PDF Preview"
                    />
                  ) : (
                    <img
                      src={filePreview as string}
                      alt="Preview"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  )}
                  <IconButton
                    onClick={() => {
                      setFilePreview(null);
                      setSelectedFile(null);
                      setPrediction(null);
                    }}
                    style={{ position: 'absolute', top: '8px', right: '8px' }}
                  >
                    <ClearIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Card>
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
          <Card
            sx={{
              height: '98%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow:
                '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 1.12)',
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
                      : 'Upload an image or PDF to get a prediction.'}
                  </Typography>
                </>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SaranshAi;
