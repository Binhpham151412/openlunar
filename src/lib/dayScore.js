import { computeDayInfo } from "./canChi";
import { RULES } from "./rules";

/* ============================================================
   CHẤM ĐIỂM MỘT NGÀY — dùng chung cho lưới lịch và tính năng
   "Tìm ngày tốt sắp tới" để hai nơi luôn nhất quán.
   ============================================================ */

export function scoreDay(date, occasion, enabledRules) {
  const info = computeDayInfo(date.getDate(), date.getMonth() + 1, date.getFullYear());
  const active = RULES.filter((r) => enabledRules[r.id] !== false && r.check(info));
  const redRules = active.filter((r) => r.badFor.includes(occasion));
  const color = redRules.length > 0 ? "red" : active.length > 0 ? "yellow" : "none";
  return { date, info, active, redRules, color };
}
