import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react'

const ConfirmDeleteDialog = ({ open, onClose, onClick }) => (
    <div>
      <Dialog sx={{backgroundColor:'transparent'}} open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button onClick={onClick} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

ConfirmDeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

export default ConfirmDeleteDialog
