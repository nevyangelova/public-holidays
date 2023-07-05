import React from 'react';
import {Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';

export interface Holiday {
    date: {
        iso: string;
    };
    name: string;
}

interface CalendarProps {
    holidays: Holiday[];
}

const Calendar: React.FC<CalendarProps> = ({holidays}) => {
    return (
        <Table className='calendar-table'>
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reason</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {holidays.map((holiday, index) => (
                    <TableRow key={index}>
                        <TableCell>{holiday.date.iso}</TableCell>
                        <TableCell>{holiday.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Calendar;
