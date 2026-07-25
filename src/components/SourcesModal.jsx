import { useState } from "react";
import { X, CheckCircle2, TriangleAlert, CircleHelp, ChevronRight } from "lucide-react";
import { SOURCE_GROUPS } from "../lib/sources";

const CONFIDENCE_META = {
  verified: { label: "Đã xác minh", icon: CheckCircle2, color: "var(--gold)" },
  traditional: { label: "Hệ cổ điển, có dị bản", icon: TriangleAlert, color: "var(--amber)" },
  unverified: { label: "Phổ biến, chưa xác minh nguồn", icon: CircleHelp, color: "var(--ink-soft)" },
};

export default function SourcesModal({ onClose }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-card relative w-full max-w-lg p-4 overflow-y-auto" style={{ maxHeight: "88vh" }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="xn-serif text-lg font-bold">Nguồn tham khảo</h3>
          <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
          Mỗi yếu tố tính toán trong app đều được liệt kê nguồn gốc và mức độ tin cậy dưới đây, để bạn tự đánh giá
          và góp ý nếu thấy sai. Xem thêm chi tiết kỹ thuật tại{" "}
          <a
            href="https://github.com/Binhpham151412/openlunar/blob/main/LOGIC-NGAY.md"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium"
          >
            LOGIC-NGAY.md
          </a>{" "}
          trên GitHub.
        </p>

        <div className="flex flex-wrap gap-3 mb-3 text-xs" style={{ color: "var(--ink-soft)" }}>
          {Object.entries(CONFIDENCE_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <span key={key} className="flex items-center gap-1">
                <Icon size={13} color={meta.color} /> {meta.label}
              </span>
            );
          })}
        </div>

        {SOURCE_GROUPS.map((group) => (
          <div key={group.title} className="mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
              {group.title}
            </h4>
            <div className="xn-card overflow-hidden">
              {group.items.map((item) => {
                const meta = CONFIDENCE_META[item.confidence];
                const Icon = meta.icon;
                const isOpen = expandedId === item.id;
                return (
                  <div key={item.id} className="xn-rule-row">
                    <button
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                    >
                      <span className="text-sm font-medium flex items-start gap-2">
                        <Icon size={15} color={meta.color} className="shrink-0 mt-0.5" />
                        {item.name}
                      </span>
                      <ChevronRight
                        size={16}
                        className="shrink-0"
                        style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                        <p className="font-medium mb-1" style={{ color: "var(--ink)" }}>
                          Nguồn: {item.source}
                        </p>
                        {item.link && (
                          <p className="mb-1">
                            <a href={item.link} target="_blank" rel="noreferrer" className="underline">
                              {item.link}
                            </a>
                          </p>
                        )}
                        <p>{item.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
