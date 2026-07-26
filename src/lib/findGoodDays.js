import { scoreDay } from "./dayScore";

/* ============================================================
   TÌM NGÀY TỐT SẮP TỚI — quét về phía trước kể từ một ngày mốc,
   dùng chung engine chấm điểm với lưới lịch chính (scoreDay).
   ============================================================ */

export function findUpcomingGoodDays({ fromDate, occasion, enabledRules, count = 8, maxScan = 90 }) {
  const results = [];
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  for (let i = 0; i < maxScan && results.length < count; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const scored = scoreDay(date, occasion, enabledRules);
    if (scored.color === "none") results.push(scored);
  }
  return results;
}

// Liệt kê TOÀN BỘ ngày tốt trong 1 tháng cụ thể do người dùng chọn (không giới hạn
// số lượng như bản quét 90 ngày, vì phạm vi đã tự giới hạn trong 1 tháng).
export function findGoodDaysInMonth({ year, month, occasion, enabledRules }) {
  const results = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const scored = scoreDay(date, occasion, enabledRules);
    if (scored.color === "none") results.push(scored);
  }
  return results;
}
