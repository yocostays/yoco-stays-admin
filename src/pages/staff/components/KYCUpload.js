/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Stack,
  CardHeader,
  CircularProgress,
} from '@mui/material';

// image imports
import uidai from '@assets/blankImages/addhar_card.png'; // Default images
import driving from '@assets/blankImages/driving_licence.png';
import panCard from '@assets/blankImages/pen_card.png';
import passPort from '@assets/blankImages/passport.png';
import voter from '@assets/blankImages/voter_id.png';

const KYCUpload = ({ onDocumentsChange, currentData, isView = false }) => {
  const defaultKYC = currentData?.kycDocuments;

  const defaultImages = {
    aadhaarCard: defaultKYC?.aadhaarCard || uidai,
    drivingLicense: defaultKYC?.drivingLicense || driving,
    panCard: defaultKYC?.panCard || panCard,
    passport: defaultKYC?.passport || passPort,
    voterCard: defaultKYC?.voterCard || voter,
  };

  const token = localStorage.getItem('token');
  const [documents, setDocuments] = React.useState({
    aadhaarCard: defaultKYC?.aadhaarCard || null,
    drivingLicense: defaultKYC?.drivingLicense || null,
    panCard: defaultKYC?.panCard || null,
    passport: defaultKYC?.passport || null,
    voterCard: defaultKYC?.voterCard || null,
  });

  const [imageURLs, setImageURLs] = React.useState({
    aadhaarCard: defaultKYC?.aadhaarCard || uidai,
    drivingLicense: defaultKYC?.drivingLicense || driving,
    panCard: defaultKYC?.panCard || panCard,
    passport: defaultKYC?.passport || passPort,
    voterCard: defaultKYC?.voterCard || voter,
  });

  const [loading, setLoading] = React.useState({
    aadhaarCard: false,
    drivingLicense: false,
    panCard: false,
    passport: false,
    voterCard: false,
  });

  React.useEffect(() => {
    onDocumentsChange(documents);
  }, [documents, onDocumentsChange]);

  const handleImageChange = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      setLoading((prev) => ({
        ...prev,
        [docType]: true,
      }));

      const formData = new FormData();
      formData.append('type', 'staff');
      formData.append('file', file);

      // API URL
      const apiUrl = process.env.REACT_APP_HOST_API_KEY;

      fetch(`${apiUrl}api/auth/upload-media`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `${token}`,
        },
      })
        .then(async (response) => {
          const responseData = await response.json();
          if (response.ok) {
            const { data } = responseData;
            setDocuments((prev) => ({
              ...prev,
              [docType]: data,
            }));

            const newURL = URL.createObjectURL(file);
            setImageURLs((prev) => ({
              ...prev,
              [docType]: newURL,
            }));

            onDocumentsChange({
              ...documents,
              [docType]: data,
            });
          } else {
            console.error('Upload failed:', responseData.message);
          }
        })
        .catch((error) => {
          console.error('Upload failed:', error);
        })
        .finally(() => {
          setLoading((prev) => ({
            ...prev,
            [docType]: false,
          }));
        });
    }
  };

  const handleRemove = (docType) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: null,
    }));
    setImageURLs((prev) => ({
      ...prev,
      [docType]: null,
    }));
    onDocumentsChange({
      ...documents,
      [docType]: null,
    });
  };

  // Helper function to capitalize the first letter of each word
  const capitalizeWords = (str) =>
    str
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

  return (
    <Stack spacing={2} my={2}>
      <Card sx={{ boxShadow: 3, border: '1px solid #B4B4B4', p: 2 }}>
        <CardHeader
          title={
            <Typography variant="h6" gutterBottom>
              KYC Documents
            </Typography>
          }
        />
        <Grid container spacing={2}>
          {Object.keys(documents).map((docType) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={docType}>
              <Card sx={{ border: '1px solid #B4B4B4', p: 2 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={imageURLs[docType] || defaultImages[docType]}
                        alt={docType}
                        sx={{
                          maxWidth: { xs: 150, sm: 180, md: 320 },
                          height: { xs: 150, sm: 180, md: 200 },
                          borderRadius: '8px',
                          boxShadow: 3,
                          objectFit: 'contain',
                        }}
                      />
                      <Typography>Upload {capitalizeWords(docType)}</Typography>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, docType)}
                        style={{ display: 'none' }}
                        id={`file-upload-${docType}`}
                      />
                      {!isView && (
                        <>
                          {documents[docType] ? (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleRemove(docType)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <label htmlFor={`file-upload-${docType}`}>
                              <Button variant="contained" color="primary" component="span">
                                {loading[docType] ? (
                                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                                ) : (
                                  'Upload'
                                )}
                              </Button>
                            </label>
                          )}
                        </>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Stack>
  );
};

export default KYCUpload;
