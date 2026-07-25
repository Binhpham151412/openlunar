import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { WEEKDAYS, MONTH_NAMES } from "../lib/dateUtils";
import { sameDate } from "../lib/dateUtils";
import { getHolidayLabels } from "../lib/holidays";

export default function Calendar({
  year,
  month,
  cellData,
  today,
  onPrevMonth,
  onNextMonth,
  onSelectCell,
  onChangeMonth,
  onChangeYear,
  onJumpToday,
  occasionLabel,
}) {
  const yearOptions = [];
  for (let y = today.getFullYear() - 5; y <= today.getFullYear() + 10; y++) yearOptions.push(y);

  return (
    <div className="xn-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <button className="p-2 rounded-full xn-btn-ghost shrink-0" onClick={onPrevMonth} aria-label="Tháng trước">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <select
            value={month}
            onChange={(e) => onChangeMonth(Number(e.target.value))}
            className="xn-serif text-base font-semibold bg-transparent border-none outline-none"
            aria-label="Chọn tháng"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="xn-serif text-base font-semibold bg-transparent border-none outline-none"
            aria-label="Chọn năm"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="xn-chip px-2.5 py-1.5 rounded-full text-xs font-semibold"
            onClick={onJumpToday}
          >
            Hôm nay
          </button>
          <button className="p-2 rounded-full xn-btn-ghost" onClick={onNextMonth} aria-label="Tháng sau">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs font-semibold py-1" style={{ color: "var(--ink-soft)" }}>
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cellData.map((c, idx) => {
          const isToday = sameDate(c.date, today);
          const lunarLabel =
            c.info.lunarDay === 1
              ? `${c.info.lunarDay}/${c.info.lunarMonth}${c.info.lunarLeap ? "N" : ""}`
              : `${c.info.lunarDay}`;
          const holidayLabels = getHolidayLabels(c.info);
          return (
            <button
              key={idx}
              onClick={() => !c.dim && onSelectCell(c.date)}
              disabled={c.dim}
              title={holidayLabels.join(", ") || undefined}
              className={`xn-cell ${c.dim ? "dim" : ""} ${c.color} ${isToday ? "today" : ""} rounded-lg p-1.5 h-16 sm:h-20 flex flex-col items-start justify-between text-left`}
            >
              <span className="flex items-center gap-1 w-full">
                <span className="xn-daynum text-sm font-semibold px-1">{c.date.getDate()}</span>
                {holidayLabels.length > 0 && <span className="xn-dot-holiday" />}
                {c.favorite && <Star size={10} fill="var(--gold)" color="var(--gold)" />}
              </span>
              <div className="flex items-center justify-between w-full">
                <span className="xn-mono" style={{ color: "var(--ink-soft)", fontSize: "10px" }}>
                  {lunarLabel}
                </span>
                {c.color === "red" && <span className="xn-seal" />}
                {c.color === "yellow" && <span className="xn-dot-yellow" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
        <span className="flex items-center gap-1.5">
          <span className="xn-seal" /> Có yếu tố xấu cho "{occasionLabel}"
        </span>
        <span className="flex items-center gap-1.5">
          <span className="xn-dot-yellow" /> Ngày xấu, nhưng không thuộc việc đang chọn
        </span>
      </div>
    </div>
  );
}
