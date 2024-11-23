export interface CSVData {
    headers: string[];
    rows: string[][];
  }
  
  export interface UploadState {
    isLoading: boolean;
    error: string | null;
    data: CSVData | null;
  }