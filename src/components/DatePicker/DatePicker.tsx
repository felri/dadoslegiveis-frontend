import React, { useEffect, useMemo, useState } from "react";
// @ts-ignore
import "react-date-range/dist/styles.css"; // main style file
import "./styles.scss"; // theme css file

type Range = {
  startDate: Date;
  endDate: Date;
};

type Props = {
  handleChange: ({ startDate, endDate }: Range) => void;
};

const DatePicker = ({
  startDate,
  endDate,
  handleChange,
}: Props & Range): JSX.Element => {
  const [years, setYears] = useState<number[]>([]);

  const selectedYear = useMemo(() => {
    return getYearFromDates(startDate, endDate);
  }, [startDate, endDate]);

  function getYearFromDates(start: Date, end: Date) {
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    if(startYear !== endYear){
      throw new Error(`The start date and end date must be of the same year`)
    }
    return startYear;
  }

  function getYearDates(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    if (startDate && endDate) handleChange({ startDate, endDate });
  }
  
  useEffect(() => {
    setYears(Array.from({length: new Date().getFullYear() - 2008 + 1}, (_, i) => 2008 + i));
  }, []);

  return (
    <div className="calendar">
      {years.map(year => (
        <div 
          key={year} 
          className={`
            calendar-year
            ${year === selectedYear ? "selected" : ""}
          `}
          onClick={() => getYearDates(year)}
        >
          {year}
        </div>
      ))}
    </div>
  );
};

export default DatePicker;
