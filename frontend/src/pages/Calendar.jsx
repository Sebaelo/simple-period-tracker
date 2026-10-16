// TODO: REFACTOR
// 1. Create variables for .getFullYear() and .getMonth()
// 2. Condense dayNumbers and getDayName into one Array.from callback function
// 3. Turn conditional tailwind classes into variables
// 4. Group everything up more logically if needed and add comments

import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  function previousMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  }

  // ---------- Building the calendar grid ----------

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function getDayName(day) {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    ).toLocaleDateString("default", { weekday: "short" });
  }

  const today = new Date();
  function isToday(day) {
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day
    );
  }

  const firstWeekday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const leadingBlanksCount = (firstWeekday + 6) % 7;
  const leadingBlanks = Array.from({ length: leadingBlanksCount }, () => null);

  const totalCells = dayNumbers.length + leadingBlanks.length;
  const trailingBlanksCount = (7 - (totalCells % 7)) % 7;
  const trailingBlanks = Array.from(
    { length: trailingBlanksCount },
    () => null,
  );

  const calendarGrid = [...leadingBlanks, ...dayNumbers, ...trailingBlanks];

  return (
    <div>
      <header className="mx-auto flex w-80 justify-between gap-2">
        <button className="cursor-pointer" onClick={previousMonth}>
          {/* Left arrow <- */}
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-3xl">
          {currentDate.toLocaleDateString("default", { month: "long" })}
          {", "}
          {currentDate.getFullYear()}
        </h1>
        <button className="cursor-pointer" onClick={nextMonth}>
          {/* Right arrow -> */}
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
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
