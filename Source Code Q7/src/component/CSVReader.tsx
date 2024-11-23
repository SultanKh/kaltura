import { Typography, Paper, CircularProgress, Alert, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, Table } from "@mui/material";
import { Upload, TableIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { CSVData } from "../types/csv";
import OfficeAnalytics from "./OfficeAnalytics";

export default function CSVReader() {
    const [csvData, setCSVData] = useState<CSVData | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
  
    const processCSV = async (content: string) => {
      try {
        const lines = content.split('\n');
        if (lines.length === 0) throw new Error('File is empty');
  
        const headers = lines[0].split(',').map(header => header.trim());
        const rows = lines.slice(1)
          .filter(line => line.trim() !== '')
          .map(line => line.split(',').map(cell => cell.trim()));
  
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 800));


        setCSVData({ headers, rows });
        setError('');
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
        setCSVData(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleFile = (file: File) => {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        return;
      }
  
      setIsLoading(true);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processCSV(content);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };
      reader.readAsText(file);
    };
  
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }, []);
  
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);
  
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);
  
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          CSV File Reader
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload your CSV file to view its contents in a table format
        </Typography>
  
        <Paper
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            p: 4,
            mb: 3,
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.300',
            bgcolor: isDragging ? 'primary.50' : 'background.paper',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {isLoading ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography>Processing CSV file...</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Upload size={48} style={{ marginBottom: '16px', color: '#1976d2' }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Drag and drop your CSV file here
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or
              </Typography>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  style={{ display: 'none' }}
                />
                <Typography
                  component="span"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Browse Files
                </Typography>
              </label>
            </Box>
          )}
        </Paper>
  
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {csvData && <OfficeAnalytics csvData={csvData}/>}
  
        {csvData && (
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableIcon size={20} />
              <Typography variant="h6">CSV Data</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {csvData.headers.map((header, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          fontWeight: 'bold',
                          bgcolor: 'grey.50',
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.rows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                    >
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  }