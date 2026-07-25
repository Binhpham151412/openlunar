export const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

export function buildMonthGrid(year, month /* 0-indexed */) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const cellIndex = i - startWeekday + 1;
    let date, dim;
    if (cellIndex < 1) {
      date = new Date(year, month - 1, daysInPrevMonth + cellIndex);
      dim = true;
    } else if (cellIndex > daysInMonth) {
      date = new Date(year, month + 1, cellIndex - daysInMonth);
      dim = true;
    } else {
      date = new Date(year, month, cellIndex);
      dim = false;
    }
    cells.push({ date, dim });
  }
  return cells;
}

export function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
