import React, { useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Upload } from 'lucide-react';
import { styled } from '@mui/material/styles';

interface Props {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UploadZone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CSVUploader: React.FC<Props> = ({ onFileSelect, isLoading }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <UploadZone
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      elevation={0}
      sx={{ opacity: isLoading ? 0.7 : 1 }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        style={{ display: 'none' }}
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Upload size={48} color="#1976d2" />
          <Typography variant="h6" color="primary">
            Drag and drop your CSV file here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse
          </Typography>
        </Box>
      </label>
    </UploadZone>
  );
};

export default CSVUploader;