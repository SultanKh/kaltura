import { useState, useCallback } from 'react';
import { UploadState, CSVData } from '../types/csv';

const useCSVProcessor = () => {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const processCSV = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setState({
        isLoading: false,
        error: 'Please upload a valid CSV file',
        data: null,
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const content = await file.text();
      const lines = content.split('\n');

      if (lines.length === 0) {
        throw new Error('The CSV file is empty');
      }

      const headers = lines[0]
        .split(',')
        .map(header => header.trim())
        .filter(Boolean);

      if (headers.length === 0) {
        throw new Error('No valid headers found in the CSV file');
      }

      const rows = lines
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const cells = line.split(',').map(cell => cell.trim());
          // Pad with empty strings if row has fewer cells than headers
          while (cells.length < headers.length) {
            cells.push('');
          }
          // Truncate if row has more cells than headers
          return cells.slice(0, headers.length);
        });

      const csvData: CSVData = {
        headers,
        rows,
      };

      setState({
        isLoading: false,
        error: null,
        data: csvData,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to process CSV file',
        data: null,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    data: state.data,
    processCSV,
    reset,
  };
};

export default useCSVProcessor;