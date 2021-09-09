import React, { useState, useEffect, useRef } from "react";
import moment, { Moment } from "moment";
import _ from "lodash";
import classNames from "classnames";

import DatePicker from "../datepicker/datepicker";
import Form from "../form/form";

import arrowLeft from "../../images/arrow-left.svg";
import arrowRight from "../../images/arrow-right.svg";

import "./calendar.scss";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const isSameDate = (momentOne: Moment, momentTwo: Moment) =>
  momentOne.year() === momentTwo.year() &&
  momentOne.month() === momentTwo.month() &&
  momentOne.date() === momentTwo.date();

interface props {
  events: Array<Object>;
  onAddEvent: (eventName: string, date: string) => void;
}

const Calendar: React.FC<props> = ({ events, onAddEvent }) => {
  // STATES
  const [viewDate, setViewDate] = useState(moment());
  const [viewDatePicker, setViewDatePicker] = useState(false);
  const [viewAddEventMenu, setViewAddEventMenu] = useState(false);
  const [eventDate, setEventDate] = useState(undefined);
  const [viewEventForm, setViewEventForm] = useState(false);
  const [eventDateObj, setEventDateObj] = useState<string | " ">(" ");

  // CURRENT MONTH CALCULATION
  const firstDateOfMonth = viewDate.clone().startOf("month");
  const lastDateOfMonth = viewDate.clone().endOf("month");

  const currMonthDates = viewDate.clone().daysInMonth();
  const currMonthDatesArr = Array(currMonthDates)
    .fill(null)
    .map((_, i) => firstDateOfMonth.clone().add(i, "day"));

  // PREVIOUS MONTH CALCULATION
  const previousMonthOffset = firstDateOfMonth.day();
  const prevMonthLastDate = viewDate
    .clone()
    .subtract(1, "month")
    .endOf("month");

  const prevMonthOffsetDate = prevMonthLastDate
    .clone()
    .subtract(previousMonthOffset - 1, "day");

  const prevMonthDatesArr = Array(previousMonthOffset)
    .fill(null)
    .map((_, i) => prevMonthOffsetDate.clone().add(i, "day"));

  // NEXT MONTH CALCULATION
  const nextMonthOffset = 6 - lastDateOfMonth.day();

  const nextMonthDatesArr = Array(nextMonthOffset)
    .fill(null)
    .map((_, i) => lastDateOfMonth.clone().add(i + 1, "day"));

  const arr = [
    ...prevMonthDatesArr,
    ...currMonthDatesArr,
    ...nextMonthDatesArr,
  ];

  const goToPrevMonth = () => {
    setViewDate(viewDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setViewDate(viewDate.clone().add(1, "month"));
  };

  const toggleDatePicker = () => {
    setViewDatePicker(!viewDatePicker);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    // cleanup function
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const datePickerRef = useRef<HTMLElement>(null);
  const monthPickerLabelRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLButtonElement>(null);
  const eventFormRef = useRef<HTMLFormElement>(null);

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      monthPickerLabelRef.current &&
      !monthPickerLabelRef.current.contains(event.target) &&
      !datePickerRef.current.contains(event.target)
    ) {
      setViewDatePicker(false);
    }

    if (eventRef.current && !eventRef.current.contains(event.target)) {
      setViewAddEventMenu(false);
    }

    if (eventFormRef.current && !eventFormRef.current.contains(event.target)) {
      setViewEventForm(false);
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();

    if (viewDatePicker) setViewDatePicker(false);
  };

  const handleAddEvent = (idx) => {
    setViewAddEventMenu(!viewAddEventMenu);
    setEventDate(idx);
  };

  return (
    <div className="calendar">
      {viewEventForm ? (
        <div className="event-form-content">
          <Form
            ref={eventFormRef}
            handleFormSubmit={(eventName) => {
              setViewEventForm(false);
              onAddEvent(eventName, eventDateObj); // send eventName and Date object to parent Component
            }}
          />
        </div>
      ) : null}

      <div className="month-container">
        <img
          className="month-container-arrow"
          src={arrowLeft}
          alt="none"
          onClick={goToPrevMonth}
        />

        <div className="month-container-content" ref={monthPickerLabelRef}>
          <span
            className="month-container-content-month"
            onClick={toggleDatePicker}
          >
            <strong>{viewDate.format("MMMM")}</strong> &nbsp;
            <strong>{viewDate.format("YYYY")}</strong>
          </span>
        </div>

        {viewDatePicker ? (
          <div className="date-picker-container">
            <DatePicker
              ref={datePickerRef}
              currentMonth={viewDate.clone().month()}
              currentYear={viewDate.clone().year()}
              onChange={({ year, month }) => {
                const newDate = moment().year(year).month(month);
                setViewDate(newDate);
              }}
            />
          </div>
        ) : null}

        <img
          src={arrowRight}
          alt="none"
          className="month-container-arrow"
          onClick={goToNextMonth}
        />
      </div>

      <ul className="days-container">
        {days.map((day, idx) => (
          <li className={`days-container-content-${idx}`} key={idx}>
            {day}
          </li>
        ))}
      </ul>

      <div className="dates-container" onContextMenu={handleRightClick}>
        {arr.map((date, idx) => {
          var dateDMY = date.format("DD/MM/YYYY");
          return (
            <div
              className={classNames({
                "dates-container-content": true,
                currMonth: viewDate.month() === date.month(),
              })}
              onContextMenu={() => handleAddEvent(idx)}
              key={date.toString()}
            >
              {viewAddEventMenu && idx === eventDate ? (
                <button
                  className="dates-container-content-addEvent-menu"
                  ref={eventRef}
                  onClick={() => {
                    setViewEventForm(true);
                    setViewAddEventMenu(false);
                    setEventDateObj(dateDMY);
                  }}
                >
                  +
                </button>
              ) : null}

              <div
                className={classNames({
                  "dates-container-content-date": true,
                  active: isSameDate(date, moment()),
                })}
              >
                <strong>{date.date()}</strong>
              </div>

              <div className="dates-container-content-event">
                {_.has(events, dateDMY.toString())
                  ? events[dateDMY].map((eventName, index) => (
                      <div
                        className="dates-container-content-event-content"
                        key={index}
                      >
                        {eventName}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
