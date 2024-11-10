'use client'
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { Dayjs } from "dayjs"

export default function DateReserve({onDateChange}:{onDateChange:Function}) {
    // State to store the selected date
    const [reserveDate, setReserveDate] = useState<Dayjs|null>(null);

    return (
        <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-fit px-10 py-5 flex flex-row justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Select Date"
                    value={reserveDate}
                    onChange={(value) => {setReserveDate(value); onDateChange(value)}}
                    renderInput={(params) => <TextField {...params} className="bg-white" />}
                />
            </LocalizationProvider>
        </div>
    );
}