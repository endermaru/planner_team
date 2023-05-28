import React, { useState, useEffect } from "react";

const Calendar = ({ todos, printTodos }) => {
  const [date, setDate] = useState(new Date());

  // Function to handle previous month button click
  const handlePrevMonth = () => {
    setDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1;
      prevDate.setMonth(prevMonth);
      return new Date(prevDate);
    });
  };

  // Function to handle next month button click
  const handleNextMonth = () => {
    setDate((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1;
      prevDate.setMonth(nextMonth);
      return new Date(prevDate);
    });
  };

  // Function to generate the calendar grid for the current month
  const generateCalendarGrid = () => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarGrid = [];

    let dayCount = 1;

    for (let row = 0; row < 6; row++) {
      const calendarRow = [];

      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < firstDayOfWeek) || dayCount > daysInMonth) {
          calendarRow.push(<td key={`${row}-${col}`}></td>);
        } else {
          calendarRow.push(<td key={`${row}-${col}`}>{dayCount}</td>);
          dayCount++;
        }
      }

      calendarGrid.push(<tr key={row}>{calendarRow}</tr>);
    }

    return calendarGrid;
  };

  return (
    <div>
      {/*샘플 코드입니다.*/}
      <div className="w-40 m-5 p-5 border border-black">
        <p>This is Calendar</p>
        <p>{`this is ${todos[0]?.content}`}</p>
        {/*내부 정보 확인.*/}
        <button className="p-3 bg-orange-300" onClick={() => printTodos(todos)}>
          calendar's print
        </button>
      </div>
    </div>
  );
};
export default Calendar;
