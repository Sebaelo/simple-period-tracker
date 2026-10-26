//TODO: REFACTOR
// Create a buildCalendarGrid helper function for blanks + filled in days
// Can I update today and isToday?
// Replace key={index} with a better key
// Tailwind logic into variables

import { useState } from "react";

const ArrowIcon = ({ pathData }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="size-7"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={pathData} />
  </svg>
);

function calendarBlanks(count) {
  return Array.from({ length: count }, () => null);
}

// REFACTOR: Don't forget to incorporate this, or your work has been all for nothing
const buildCalendarDays = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      weekdayName: date.toLocaleDateString("default", {
        weekday: "short",
      }),
      dayNumber: date.getDate(),
    };
  });

  return {
    year,
    month,
    daysInMonth,
    dates,
  };
};
console.log(buildCalendarDays(new Date()));

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // ---------- Building the calendar grid ----------

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function getDayName(day) {
    return new Date(year, month, day).toLocaleDateString("default", {
      weekday: "short",
    });
  }

  const today = new Date();
  function isToday(day) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const leadingBlanksCount = (firstWeekday + 6) % 7;

  const totalCells = daysInMonth + leadingBlanksCount;
  const totalWeeks = Math.ceil(totalCells / 7);
  const trailingBlanksCount = totalWeeks * 7 - totalCells;

  const calendarGrid = [
    ...calendarBlanks(leadingBlanksCount),
    ...dayNumbers,
    ...calendarBlanks(trailingBlanksCount),
  ];

  return (
    <div>
      <header className="mx-auto flex w-80 justify-between gap-2">
        <button className="cursor-pointer" onClick={previousMonth}>
          {/* Left arrow <- */}
          <ArrowIcon pathData="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </button>
        <h1 className="text-3xl">
          {currentDate.toLocaleDateString("default", { month: "long" })}
          {", "}
          {year}
        </h1>
        <button className="cursor-pointer" onClick={nextMonth}>
          {/* Right arrow -> */}
          <ArrowIcon pathData="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </button>
      </header>

      <div className="p-4">
        <ol className="mx-auto grid max-w-7xl gap-0.5 rounded border-2 bg-black sm:grid-cols-7">
          {calendarGrid.map((day, index) => (
            <li
              key={index}
              className={`h-32 bg-white p-4 text-2xl sm:p-2 sm:text-xl ${day === null ? "hidden sm:block" : ""}`}
            >
              {day && (
                <div className="flex items-baseline gap-2">
                  <span
                    className={`flex size-9 items-center justify-center ${
                      isToday(day) ? "rounded-full border-2" : ""
                    }`}
                  >
                    {day}
                  </span>
                  <span>{getDayName(day)}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
