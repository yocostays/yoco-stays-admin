// UploadAvatar.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { alpha, styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import Iconify from '../iconify';
import RejectionFiles from './errors/RejectionFiles';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  display: 'flex',
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '50%',
  alignItems: 'center',
  position: 'relative',
  justifyContent: 'center',
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

const StyledPlaceholder = styled('div')(({ theme }) => ({
  zIndex: 7,
  display: 'flex',
  borderRadius: '50%',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  width: `calc(100% - 16px)`,
  height: `calc(100% - 16px)`,
  color: theme.palette.text.disabled,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
}));



// --------------Avatar preview Component--------------------------------

AvatarPreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export function AvatarPreview({ file }) {
  const [preview, setPreview] = useState(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // If the file is a File object, create a preview URL using createObjectURL
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Clean up the object URL after the component unmounts or the file changes
      return () => URL.revokeObjectURL(objectUrl);
    }

    // If file is a string (URL), use it as the preview URL directly
    if (typeof file === 'string') {
      setPreview(file);
    }
  }, [file]);

  return <Avatar src={preview} alt="Avatar Preview" sx={{ width: '100%', height: '100%' }} />;
}

// ----------------------------------------------------------------------

UploadAvatar.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.node,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onDrop: PropTypes.func,
  onReject: PropTypes.func,
};

export default function UploadAvatar({ error, file, disabled, helperText, onDrop, onReject, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    onDrop,
    onDropRejected: onReject,
    disabled,
    ...other,
  });

  const hasFile = !!file;
  const isError = isDragReject || !!error;

  return (
    <>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            borderColor: 'error.light',
            ...(hasFile && {
              bgcolor: 'error.lighter',
            }),
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasFile && {
            '&:hover': {
              '& .placeholder': {
                opacity: 1,
              },
            },
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        {/* Display the Avatar preview if there is a file */}
        {hasFile && <AvatarPreview disabled={false} file={file} />}

        {/* Placeholder content for uploading */}
        <StyledPlaceholder
          className="placeholder"
          sx={{
            '&:hover': {
              opacity: 0.72,
            },
            ...(hasFile && {
              zIndex: 9,
              opacity: 0,
              color: 'common.white',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
            }),
            ...(isError && {
              color: 'error.main',
              bgcolor: 'error.lighter',
            }),
          }}
        >
          <Iconify icon="ic:round-add-a-photo" width={24} sx={{ mb: 1 }} />
          <Typography variant="caption">{file ? 'Update photo' : 'Upload photo'}</Typography>
        </StyledPlaceholder>
      </StyledDropZone>

      {/* Helper text or error message */}
      {helperText && <Box sx={{ mt: 1 }}>{helperText}</Box>}

      {/* Display rejected files if there are any */}
      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}



