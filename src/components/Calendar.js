import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

import Modal from "react-modal";

import TodoList from "./TodoList";

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
  closeHover,
  isCloseHovering,
  notCloseHovering,
  closeModal,
  todos,
  data,
  todoLoading,
  delTodo,
  modiTodo,
  openModi,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const nowDate = new Date();

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
            className={`col w-16 h-16 flex flex-col justify-center items-center rounded-full cell ${
              !isSameMonth(day, monthStart)
                ? "disabled text-gray"
                : isSameDay(day, nowDate)
                ? "selected bg-orange text-gray-lightest font-bold border-[1px] border-gray-darkest hover:bg-blue"
                : format(currentMonth, "M") !== format(day, "M")
                ? "not-valid"
                : isSameDay(day, selectedDate)
                ? "bg-blue text-gray-lightest"
                : "valid bg-gray-light hover:bg-blue hover:text-gray-lightest"
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
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

  const customStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "30vw",
      height: "45vh",
      transform: "translate(-50%,-50%)",
      backgroundColor: "white",
      padding: 0,
    },
  };

  const filteredTodos = todos.filter((todo) => {
    const todoTimeStart = startOfDay(new Date(todo.timeStart));
    const todoTimeEnd = endOfDay(new Date(todo.timeEnd));
    return isWithinInterval(selectedDate, {
      start: todoTimeStart,
      end: todoTimeEnd,
      inclusive: true,
    });
  });

  return (
    <div className="body w-full h-4/5 flex flex-col justify-center items-center mb-3">
      {rows}
      <Modal
        isOpen={modalIsOpen}
        className="w-3/5 flex flex-col justify-start items-center bg-gray-lightest border-3 border-gray rounded-xl"
        contentLabel="Modal for calendar"
        style={customStyles}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div className="flex w-full flex-row justify-between items-end px-5 pb-3 pt-5 bg-blue text-xl text-gray-lightest rounded-t-xl">
          <div>날짜별 일정 ({format(selectedDate, "MM/dd")})</div>
          <Icon
            color="white"
            className="w-8 h-8"
            onMouseOver={isCloseHovering}
            onMouseOut={notCloseHovering}
            onClick={closeModal}
            icon={`carbon:close-${closeHover ? "filled" : "outline"}`}
          />
        </div>
        <div className="flex w-full p-0 flex-col justify-start items-start">
          <TodoList
            todos={filteredTodos}
            className="text-xs p-0 m-0"
            data={data}
            todoLoading={todoLoading}
            delTodo={delTodo}
            modiTodo={modiTodo}
            //openModi={openModimodal}
          />
        </div>
      </Modal>
    </div>
  );
};

const Calendar = ({
  data,
  todoLoading,
  todos,
  delTodo,
  modiTodo,
  openModi,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

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
    setSelectedDate(day);
    setModalIsOpen(true);
    setCloseHover(false);
    console.log(day);
  };

  const closeModal = () => {
    console.log("start", modalIsOpen);

    const day = new Date(1995, 11, 17);

    console.log(day, modalIsOpen);
    setSelectedDate(day);
    setModalIsOpen(false);
    console.log(day, modalIsOpen);
  };

  const isCloseHovering = () => {
    setCloseHover(true);
    //console.log("closeHover in mouseover:", closeHover);
  };
  const notCloseHovering = () => {
    setCloseHover(false);
    //console.log("closeHover in mouseout:", closeHover);
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
        setSelectedDate={setSelectedDate}
        onDateClick={onDateClick}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        closeHover={closeHover}
        isCloseHovering={isCloseHovering}
        notCloseHovering={notCloseHovering}
        closeModal={closeModal}
        todos={todos}
        data={data}
        todoLoading={todoLoading}
        delTodo={delTodo}
        modiTodo={modiTodo}
        //openModi={openModimodal}
      />
    </div>
  );
};
export default Calendar;
