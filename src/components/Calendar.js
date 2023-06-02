import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";

import Modal from "react-modal";

const RenderHeader = ({
  currentMonth,
  prevMonth,
  nextMonth,
  prevHover,
  nextHover,
  isPrevHovering,
  notPrevHovering,
  isNextHovering,
  notNextHovering,
}) => {
  return (
    <div className="w-full flex flex-row justify-between items-baseline p-4">
      <div className="col w-4/5 h-full flex flex-col justify-center items-start mr-1 col-start">
        <span className="text-l">
          <span className="text-4xl month mx-4 font-semibold">
            {format(currentMonth, "M")}
          </span>
          {format(currentMonth, "yyyy")}
        </span>
      </div>
      <div className="col w-1/5 h-full flex flex-row justify-end items-baseline ml-5 col-end">
        <Icon
          icon={`${
            prevHover ? "bi:arrow-left-circle-fill" : "bi:arrow-left-circle"
          }`}
          color="gray"
          className="w-3/12 h-full ml-3"
          onMouseOver={isPrevHovering}
          onMouseOut={notPrevHovering}
          onClick={prevMonth}
        />
        <Icon
          icon={`${
            nextHover ? "bi:arrow-right-circle-fill" : "bi:arrow-right-circle"
          }`}
          color="gray"
          className="w-3/12 h-full ml-3"
          onMouseOver={isNextHovering}
          onMouseOut={notNextHovering}
          onClick={nextMonth}
        />
      </div>
    </div>
  );
};
const RenderDays = () => {
  const days = [];
  const date = ["Sun", "Mon", "Thu", "Wed", "Thrs", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div
        className="col w-1/6 h-full flex flex-col justify-end items-start px-1 bg-gray-dark text-gray-lightest border-gray-lightest border"
        key={i}
      >
        {date[i]}
      </div>
    );
  }

  return (
    <div className="days w-full h-fit p-1 row flex flex-row justify-between items-center">
      {days}
    </div>
  );
};
const RenderCells = ({
  currentMonth,
  selectedDate,
  onDateClick,
  modalIsOpen,
  setModalIsOpen,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      days.push(
        <div className="w-1/6 h-max flex flex-col justify-start items-center px-1 my-2">
          <div
            className={`col w-16 h-16 flex flex-col justify-center items-center px-1 rounded-full cell ${
              /*isSameMonth(day, monthStart)
                ? "bg-gray-light hover:bg-blue hover:text-gray-lightest"
                : isSameDay(day, selectedDate)
                ? "selected bg-orange text-gray-lightest hover:bg-blue"
                : ""*/
              !isSameMonth(day, monthStart)
                ? "disabled "
                : isSameDay(day, selectedDate)
                ? "selected bg-orange text-gray-lightest hover:bg-blue"
                : format(currentMonth, "M") !== format(day, "M")
                ? "not-valid"
                : "valid bg-gray-light hover:bg-blue hover:text-gray-lightest"
            }`}
            key={day}
            onClick={() => onDateClick(day)}
          >
            <span
              className={
                format(currentMonth, "M") !== format(day, "M")
                  ? "text not-valid"
                  : ""
              }
            >
              {formattedDate}
            </span>
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div
        className="row w-full h-full flex flex-row justify-between items-center"
        key={day}
      >
        {days}
      </div>
    );
    days = [];
  }
  return (
    <div className="body w-full h-4/5 flex flex-col justify-center items-center mb-3">
      {rows}
      <Modal isOpen={modalIsOpen}>
        This is Modal content
        <button onClick={() => setModalIsOpen(false)}>Modal Open</button>
      </Modal>
    </div>
  );
};

const Calendar = ({ todos, printTodos }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const isPrevHovering = () => {
    setPrevHover(true);
  };
  const notPrevHovering = () => {
    setPrevHover(false);
  };
  const isNextHovering = () => {
    setNextHover(true);
  };
  const notNextHovering = () => {
    setNextHover(false);
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = (day) => {
    //setSelectedDate(day);
    setModalIsOpen(true);
  };
  return (
    <div className="calendar w-full h-full">
      <RenderHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        prevHover={prevHover}
        nextHover={nextHover}
        isPrevHovering={isPrevHovering}
        notPrevHovering={notPrevHovering}
        isNextHovering={isNextHovering}
        notNextHovering={notNextHovering}
      />
      <RenderDays />
      <RenderCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
    </div>
  );
};
export default Calendar;
