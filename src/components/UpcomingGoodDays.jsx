import { useMemo } from "react";
import { X, Sparkles } from "lucide-react";
import { findUpcomingGoodDays } from "../lib/findGoodDays";

export default function UpcomingGoodDays({ occasion, occasionLabel, enabledRules, onPickDate, onClose }) {
  const results = useMemo(
    () => findUpcomingGoodDays({ fromDate: new Date(), occasion, enabledRules }),
    [occasion, enabledRules]
  );

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
        <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
          Quét 90 ngày tới, lọc theo các yếu tố đang bật và không có yếu tố xấu cho việc "{occasionLabel}".
        </p>

        {results.length === 0 && (
          <p className="text-sm xn-card p-3" style={{ color: "var(--ink-soft)" }}>
            Không tìm thấy ngày nào phù hợp trong 90 ngày tới với bộ yếu tố đang bật.
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
