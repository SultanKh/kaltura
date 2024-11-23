import { ChangeEvent, useState } from 'react';

import { Box, Button, Divider, Fade, Paper, Stack, TextField, Typography } from '@mui/material';


import { calculateRevenueAndUnreservedCapacity } from '../utils/dateUtils';
import { CSVData } from '../types/csv';
import { GiftIcon, PiIcon } from 'lucide-react';

export default function OfficeAnalytics({ csvData }: { csvData: CSVData }) {
  const [inputValue, setInputValue] = useState('');

  const [analyzeResult, setAnalyzeResult] = useState('')

  const validateDateFormat = (input: string): boolean => {
    // Check if the input matches YYYY-MM format
    const regex = /^\d{4}-(?:0[1-9]|1[0-2])$/;
    return regex.test(input);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Auto-format input as user types
    if (newValue.length === 4 && !newValue.includes('-')) {
      const formattedValue = `${newValue}-`;
      setInputValue(formattedValue);
      return;
    }


  };

  const handleBlur = () => {
    // Reset invalid input on blur
    if (!validateDateFormat(inputValue)) {
      setInputValue('');
    }
  };

  const onAnalyze = () => {

    const result = calculateRevenueAndUnreservedCapacity(csvData.rows, inputValue)
    setAnalyzeResult(result)
  }


  return (
    <Box sx={{ maxWidth: '4xl', mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
          Office Reservation Analytics
        </Typography>

      </Box>

      <Stack spacing={3}>


        {/* Month Selection */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            2. Write Month
          </Typography>
          <TextField
            fullWidth
            label='Year Month'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={(inputValue.length > 0 && !validateDateFormat(inputValue))}
            helperText={
              (inputValue.length > 0 && !validateDateFormat(inputValue)
                ? 'Please enter date in YYYY-MM format'
                : '')
            }
            placeholder="YYYY-MM"
            inputProps={{
              maxLength: 7,
              pattern: '\\d{4}-(?:0[1-9]|1[0-2])',
            }}
          />
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={onAnalyze}
          disabled={!inputValue || !validateDateFormat(inputValue)}
          startIcon={<PiIcon />}
          sx={{
            height: 56,
            px: 4,
            textTransform: 'none',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Analyze
        </Button>

        {analyzeResult && (
          <Fade in={Boolean(analyzeResult)}>
            <Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <GiftIcon fontSize="small" />
                  Analysis Results
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    color: 'text.primary'
                  }}
                >
                  {analyzeResult}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}



      </Stack>
    </Box>
  );

}