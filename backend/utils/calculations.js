export function periodCalculations(startDate) {
  const date = new Date(startDate);

  const nextPeriod = new Date(startDate);
  nextPeriod.setDate(date.getDate() + 28);

  const fertileStart = new Date(startDate);
  fertileStart.setDate(date.getDate() + 9);

  const fertileEnd = new Date(startDate);
  fertileEnd.setDate(date.getDate() + 15);

  return {
    nextPeriod: nextPeriod.toISOString(),
    fertileStart: fertileStart.toISOString(),
    fertileEnd: fertileEnd.toISOString(),
  };
}
