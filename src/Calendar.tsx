// CalendarComponent.tsx
import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // import calendar styles

interface CalendarComponentProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    savedMoods: { [key: string]: { mood: string, notes: string } };
}

const CalendarComponent = ({ selectedDate, onDateChange, savedMoods }: CalendarComponentProps) => {
    return (
        <div className="w-full flex justify-center items-center">
            <Calendar
                onChange={onDateChange}
                value={selectedDate}
                tileClassName={({ date }) => {
                    const dateString = date.toLocaleDateString();
                    return savedMoods[dateString] ? 'bg-green-400 text-white' : '';
                }}
            />
        </div>
    );
};

export default CalendarComponent;
