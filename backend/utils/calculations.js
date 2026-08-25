import { formatDate } from "./dateFormatter.js";

export function periodCalculations(startDate) {
  const date = new Date(startDate);

  const nextPeriod = new Date(startDate);
  nextPeriod.setUTCDate(date.getUTCDate() + 28);

  const fertileStart = new Date(startDate);
  fertileStart.setUTCDate(date.getUTCDate() + 9);

  const fertileEnd = new Date(startDate);
  fertileEnd.setUTCDate(date.getUTCDate() + 15);

  const autoEndDate = new Date(startDate);
  autoEndDate.setUTCDate(date.getUTCDate() + 5);

  return {
    nextPeriod: formatDate(nextPeriod),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    autoEndDate: formatDate(autoEndDate),
  };
}
