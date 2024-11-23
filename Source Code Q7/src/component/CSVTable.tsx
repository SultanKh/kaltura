import { Paper, Typography, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Box } from "@mui/material";
import { TableIcon } from "lucide-react";
import { CSVData } from "../types/csv";

export default function CSVTable({data}: {data: CSVData}) {
    return (
        <Paper elevation={2}>
            <Box p={2} display="flex" alignItems="center" gap={1} bgcolor="#f5f5f5">
                <TableIcon size={20} />
                <Typography variant="h6">CSV Data</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {data.headers.map((header, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
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
    );
}