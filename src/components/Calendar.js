import React, { useState, useEffect } from "react";

const Calendar = ({ todos, printTodos }) => {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const generateCalendarDays = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const calendarDays = [];

    // Generate days for the previous month
    const previousMonthLastDate = new Date(
      currentYear,
      currentMonth,
      0
    ).getDate();
    for (let i = firstDayOfMonth.getDay() - 1; i >= 0; i--) {
      const date = new Date(
        currentYear,
        currentMonth - 1,
        previousMonthLastDate - i
      );
      calendarDays.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        isCurrentMonth: false,
      });
    }

    // Generate days for the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      calendarDays.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        isCurrentMonth: true,
      });
    }

    // Generate days for the next month
    const remainingDays = 42 - calendarDays.length; // 42 is the total number of days in a 6-week calendar
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      calendarDays.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        isCurrentMonth: false,
      });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

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
      <div className="calendar-grid">
        {calendarDays.map((day) => (
          <div
            key={day.date}
            onClick={() => setSelectedDay(day.date)}
            className={`calendar-day ${
              day.isCurrentMonth ? "current-month" : "other-month"
            } ${day.date === selectedDay ? "selected" : ""}`}
          >
            <span>{day.day}</span>
            {/* ...other day information or styling... */}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="popup-page">
          <h2>{selectedDay}</h2>
          {todos
            .filter((todo) => {
              const todoDate = todo.timeStart.toISOString().split("T")[0];
              return todoDate === selectedDay;
            })
            .map((todo) => (
              <div key={todo.id} className="todo-item">
                <p>{todo.content}</p>
                {/* ...other todo information or styling... */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default Calendar;
