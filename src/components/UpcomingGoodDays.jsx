import { useMemo, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { findUpcomingGoodDays, findGoodDaysInMonth } from "../lib/findGoodDays";
import { MONTH_NAMES } from "../lib/dateUtils";

export default function UpcomingGoodDays({
  occasion,
  occasionLabel,
  enabledRules,
  defaultYear,
  defaultMonth,
  onPickDate,
  onClose,
}) {
  const [mode, setMode] = useState("next90"); // "next90" | "month"
  const [pickYear, setPickYear] = useState(defaultYear);
  const [pickMonth, setPickMonth] = useState(defaultMonth);

  const today = new Date();
  const yearOptions = [];
  for (let y = today.getFullYear() - 5; y <= today.getFullYear() + 10; y++) yearOptions.push(y);

  const results = useMemo(() => {
    if (mode === "month") {
      return findGoodDaysInMonth({ year: pickYear, month: pickMonth, occasion, enabledRules });
    }
    return findUpcomingGoodDays({ fromDate: new Date(), occasion, enabledRules });
  }, [mode, pickYear, pickMonth, occasion, enabledRules]);

  const monthLabel = `${MONTH_NAMES[pickMonth]}/${pickYear}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-card relative w-full max-w-sm p-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="xn-serif text-lg font-bold flex items-center gap-1.5">
            <Sparkles size={18} /> Ngày tốt sắp tới
          </h3>
          <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode("next90")}
            className={`xn-chip ${mode === "next90" ? "active" : ""} px-3 py-1.5 rounded-full text-sm font-medium`}
          >
            90 ngày tới
          </button>
          <button
            onClick={() => setMode("month")}
            className={`xn-chip ${mode === "month" ? "active" : ""} px-3 py-1.5 rounded-full text-sm font-medium`}
          >
            Chọn tháng
          </button>
        </div>

        {mode === "month" && (
          <div className="flex gap-2 mb-3">
            <select
              value={pickMonth}
              onChange={(e) => setPickMonth(Number(e.target.value))}
              className="border rounded-md px-2 py-1.5 text-sm flex-1"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
              aria-label="Chọn tháng"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={pickYear}
              onChange={(e) => setPickYear(Number(e.target.value))}
              className="border rounded-md px-2 py-1.5 text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
              aria-label="Chọn năm"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
          {mode === "month"
            ? `Liệt kê các ngày trong ${monthLabel} không có yếu tố xấu cho việc "${occasionLabel}".`
            : `Quét 90 ngày tới, lọc theo các yếu tố đang bật và không có yếu tố xấu cho việc "${occasionLabel}".`}
        </p>

        {results.length === 0 && (
          <p className="text-sm xn-card p-3" style={{ color: "var(--ink-soft)" }}>
            {mode === "month"
              ? `Không có ngày nào phù hợp trong ${monthLabel} với bộ yếu tố đang bật.`
              : "Không tìm thấy ngày nào phù hợp trong 90 ngày tới với bộ yếu tố đang bật."}
          </p>
        )}

        <div className="xn-card overflow-hidden">
          {results.map((r, idx) => (
            <button
              key={idx}
              onClick={() => onPickDate(r.date)}
              className="xn-rule-row w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <span className="text-sm font-medium">
                {r.date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
              <span className="text-xs xn-mono" style={{ color: "var(--ink-soft)" }}>
                {r.info.lunarDay}/{r.info.lunarMonth} âm · {r.info.canChiDay}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
