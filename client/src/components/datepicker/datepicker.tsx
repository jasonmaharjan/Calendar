import React, { useState, forwardRef } from "react";
// import moment, { Moment } from "moment";
import classNames from "classnames";
import "./datepicker.scss";

import arrowLeft from "../../images/arrow-left-light.svg";
import arrowRight from "../../images/arrow-right-light.svg";

interface DatePickerProps {
  currentMonth: number;
  currentYear: number;
  onChange: (datePickerData: { year: number; month: number }) => void;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DatePicker = forwardRef<HTMLElement, DatePickerProps>(
  ({ currentMonth, currentYear, onChange }, ref) => {
    const [year, setYear] = useState(currentYear);

    const handleMonthPick = (monthIndex) => {
      onChange({ year, month: monthIndex });
    };

    const handlePrevYear = () => {
      setYear(year - 1);
    };

    const handleNextYear = () => {
      setYear(year + 1);
    };

    return (
      <section className="date-picker" ref={ref}>
        <div className="date-picker-year">
          <img
            src={arrowLeft}
            alt="none"
            className="date-picker-year-prev"
            onClick={handlePrevYear}
          />
          {year}
          <img
            src={arrowRight}
            alt="none"
            className="date-picker-year-next"
            onClick={handleNextYear}
          />
        </div>
        <div className="date-picker-month">
          {months.map((month, index) => (
            <span
              className={classNames({
                "date-picker-month-content": true,
                active: index === currentMonth && year === currentYear,
              })}
              key={index}
              onClick={() => handleMonthPick(index)}
            >
              {month}
            </span>
          ))}
        </div>
      </section>
    );
  }
);

export default DatePicker;
