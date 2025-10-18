'use client';

import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Box,
  Typography,
  LinearProgress,
  Alert
} from "@mui/material";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from "next/link";
import useVectorFile from "@/hooks/store/useVectorFile";
import { useState, useRef } from "react";

export default function HeaderSection(props: { storeId: string }) {
  const { uploadFile, isLoading } = useVectorFile();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickOpen = () => {
    setSelectedFile(null);
    setUploadError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      setSelectedFile(null);
      setUploadError(null);
    }
  };

  const handleFileSelect = (file: File) => {
    // Basic file validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/json'
    ];

    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Supported file types: PDF, TXT, DOC, DOCX, CSV, JSON');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (selectedFile && uploadFile) {
      try {
        setUploadError(null);
        await uploadFile(props.storeId, selectedFile);
        handleClose();
      } catch (error) {
        setUploadError('Failed to upload file. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Link href="/vector-storage" style={{ textDecoration: 'none' }}>
        <Button variant="outlined" startIcon={<KeyboardReturnIcon/>}>
          Back to List
        </Button>
      </Link>
      &nbsp;&nbsp;
      <Button 
        variant="contained" 
        startIcon={<UploadFileIcon/>}
        onClick={handleClickOpen}
      >
        Upload File
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={isLoading}
      >
        <DialogTitle>
          Upload File to Vector Store
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload a file to add it to your vector store. Supported formats: PDF, TXT, DOC, DOCX, CSV, JSON.
          </DialogContentText>

          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          {isLoading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Uploading file...
              </Typography>
            </Box>
          )}

          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: dragOver ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragOver ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx,.csv,.json"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            
            <CloudUploadIcon 
              sx={{ 
                fontSize: 48, 
                color: dragOver ? 'primary.main' : 'text.secondary',
                mb: 2 
              }} 
            />
            
            {selectedFile ? (
              <Box>
                <Typography variant="h6" color="primary">
                  {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  ✓ File selected and ready to upload
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Drag and drop your file here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse files
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Maximum file size: 10MB
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={!selectedFile || isLoading}
            startIcon={<UploadFileIcon/>}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
