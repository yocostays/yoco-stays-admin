import React from "react";
import { Box } from "@mui/material";
import Iconify from "@components/iconify";
import PropTypes from 'prop-types';
import { useSnackbar } from "notistack";

const CopyButton = ({ textToCopy }) => {
    const { enqueueSnackbar } = useSnackbar()
    const handleCopyClick = () => {
        // Create a temporary textarea to copy the text to the clipboard
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;

        // Append the textarea to the document
        document.body.appendChild(textarea);

        // Select the text inside the textarea
        textarea.select();

        // Copy the selected text to the clipboard
        document.execCommand("copy");
        // Remove the textarea from the document
        document.body.removeChild(textarea);
        // Show the toast notification with the copied text
        enqueueSnackbar(`${textToCopy} copied successfully`, { variant: 'success' });
    };

    return (
        <Box>
            <Iconify
                icon="ph:copy"
                onClick={handleCopyClick}
                sx={{ cursor: "pointer" }}
            />
        </Box>
    );
};

export default CopyButton;

CopyButton.propTypes = {
    textToCopy: PropTypes.string
};