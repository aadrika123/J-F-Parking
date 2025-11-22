import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';

const DocumentModal = ({ open, onClose, imageUrl, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="flex justify-center items-center p-4">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="max-w-full max-h-96 object-contain"
            />
          ) : (
            <div className="text-gray-500 p-8">No document available</div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentModal;