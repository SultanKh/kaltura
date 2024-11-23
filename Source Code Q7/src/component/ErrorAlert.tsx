import { Alert, AlertTitle } from "@mui/material";


export default function ErrorAlert({ message }: { message: string }) {
    <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {message}
    </Alert>

}