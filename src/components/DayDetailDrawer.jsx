import { useState } from "react";
import { X, ChevronRight, Star, Copy, Check } from "lucide-react";
import { getGioHoangDao } from "../lib/canChi";
import { getHolidayLabels } from "../lib/holidays";
import { formatDaySummary } from "../lib/formatDayInfo";

export default function DayDetailDrawer({
  selected,
  occasion,
  expandedRule,
  onToggleExpand,
  onToggleFavorite,
  onChangeNote,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const goodHours = getGioHoangDao(selected.info.chiDayIndex).filter((h) => h.good);
  const holidayLabels = getHolidayLabels(selected.info);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatDaySummary(selected)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-drawer relative w-full sm:w-96 h-full overflow-y-auto p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="xn-serif text-lg font-bold">
              {selected.date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </h3>
            <p className="text-sm xn-mono" style={{ color: "var(--ink-soft)" }}>
              Âm lịch: {selected.info.lunarDay}/{selected.info.lunarMonth}
              {selected.info.lunarLeap ? " (nhuận)" : ""}/{selected.info.lunarYear} — {selected.info.canChiDay}
            </p>
            {holidayLabels.length > 0 && (
              <p className="text-xs font-semibold mt-1" style={{ color: "var(--gold)" }}>
                {holidayLabels.join(" · ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              className="p-1.5 rounded-full xn-btn-ghost"
              onClick={handleCopy}
              aria-label="Sao chép thông tin ngày"
              title="Sao chép thông tin ngày"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              className="p-1.5 rounded-full xn-btn-ghost"
              onClick={onToggleFavorite}
              aria-label={selected.favorite ? "Bỏ đánh dấu yêu thích" : "Đánh dấu yêu thích"}
              title={selected.favorite ? "Bỏ đánh dấu yêu thích" : "Đánh dấu yêu thích"}
            >
              <Star size={18} fill={selected.favorite ? "var(--gold)" : "none"} color="var(--gold)" />
            </button>
            <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "var(--ink-soft)" }}>
            Ghi chú
          </label>
          <textarea
            value={selected.note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="Ghi chú riêng cho ngày này…"
            rows={2}
            className="xn-card w-full p-2 text-sm outline-none resize-none"
            style={{ borderColor: "var(--line)" }}
          />
        </div>

        <div className="xn-card p-3 mb-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span style={{ color: "var(--ink-soft)" }}>Trực</span>
            <span className="font-medium">{selected.info.truc}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--ink-soft)" }}>Sao trực nhật</span>
            <span className="font-medium">
              {selected.info.star} ({selected.info.isHoangDao ? "Hoàng Đạo" : "Hắc Đạo"})
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--ink-soft)" }}>Sao (Nhị Thập Bát Tú)</span>
            <span className="font-medium">
              {selected.info.star28} ({selected.info.star28Good ? "tốt" : "xấu"})
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--ink-soft)" }}>Năm âm lịch</span>
            <span className="font-medium">{selected.info.canChiYear}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--ink-soft)" }}>Tiết khí</span>
            <span className="font-medium">{selected.info.tietKhi}</span>
          </div>
        </div>

        <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
          Giờ hoàng đạo
        </h4>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {goodHours.map((h) => (
            <span key={h.idx} className="xn-chip px-2.5 py-1 rounded-full text-xs font-medium">
              {h.label}
            </span>
          ))}
        </div>

        <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
          Yếu tố phát hiện được ({selected.active.length})
        </h4>

        {selected.active.length === 0 && (
          <p className="text-sm xn-card p-3" style={{ color: "var(--ink-soft)" }}>
            Không phát hiện yếu tố xấu nào (trong số các yếu tố đang bật) cho ngày này.
          </p>
        )}

        <div className="xn-card overflow-hidden">
          {selected.active.map((r) => {
            const isRed = r.badFor.includes(occasion);
            const isOpen = expandedRule === r.id;
            return (
              <div key={r.id} className="xn-rule-row">
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                  onClick={() => onToggleExpand(r.id)}
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span
                      className={isRed ? "xn-badge-red" : "xn-badge-yellow"}
                      style={{ padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}
                    >
                      {isRed ? "Kỵ việc này" : "Xấu việc khác"}
                    </span>
                    {r.name}
                  </span>
                  <ChevronRight
                    size={16}
                    style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
                  />
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {r.explain(selected.info)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
