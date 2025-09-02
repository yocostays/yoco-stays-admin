import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CopyButton from '@components/customCopyButton/CopyButton';

const wrapText = (textData) => {
  if (!textData) return '--';
  const maxLength = 100; // 50 characters per line * 2 lines
  if (textData.length <= maxLength) return textData;
  return `${textData.slice(0, maxLength)}...`; // Truncate after 2 lines
};

const CustomTooltip = ({ textData }) => {
  const truncatedText = wrapText(textData);

  return (
    <Tooltip title={
        <Box sx={{ display: "flex", alignItems: "center",  
            maxWidth: 300, 
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word', }}>
          {textData }
          <CopyButton textToCopy={textData} />
        </Box>
       || '--'} arrow>
      <Typography
        variant="subtitle2"
        sx={{
          width: 240, // Constrain width
          display: '-webkit-box', // Enable multiline ellipsis
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1, // Show only 2 lines
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word', // Break words if necessary
        }}
      >
        {truncatedText}
      </Typography>
    </Tooltip>



  );
};

export default CustomTooltip;

CustomTooltip.propTypes = {
    textData: PropTypes.string
};
