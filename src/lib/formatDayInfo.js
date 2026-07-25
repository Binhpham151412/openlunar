import { getGioHoangDao } from "./canChi";
import { getHolidayLabels } from "./holidays";

export function formatDaySummary(selected) {
  const { date, info, active } = selected;
  const goodHours = getGioHoangDao(info.chiDayIndex)
    .filter((h) => h.good)
    .map((h) => h.chi)
    .join(", ");
  const holidayLabels = getHolidayLabels(info);

  const lines = [
    date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }),
    `Âm lịch: ${info.lunarDay}/${info.lunarMonth}${info.lunarLeap ? " (nhuận)" : ""}/${info.lunarYear} — ${info.canChiDay}`,
    ...(holidayLabels.length > 0 ? [holidayLabels.join(" · ")] : []),
    `Trực: ${info.truc} | Sao: ${info.star} (${info.isHoangDao ? "Hoàng Đạo" : "Hắc Đạo"}) | Tiết khí: ${info.tietKhi}`,
    `Giờ hoàng đạo: ${goodHours}`,
    active.length > 0
      ? `Yếu tố: ${active.map((r) => r.name).join(", ")}`
      : "Không phát hiện yếu tố xấu nào (trong số các yếu tố đang bật).",
  ];
  return lines.join("\n");
}
