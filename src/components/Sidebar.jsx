import { CalendarDays, Skull, Palette, Users, Compass, Star, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { id: "lich", label: "Xem ngày tốt xấu", icon: CalendarDays },
  { id: "trungtang", label: "Trùng Tang", icon: Skull },
  { section: "Phong Thủy" },
  { id: "menh", label: "Xem Mệnh", icon: Palette },
  { id: "tuoihop", label: "Xem tuổi hợp", icon: Users },
  { id: "huongnha", label: "Hướng nhà / bếp", icon: Compass },
  { id: "saohan", label: "Sao hạn hàng năm", icon: Star },
  { section: "" },
  { id: "nguontk", label: "Nguồn tham khảo", icon: BookOpen },
  { id: "caidat", label: "Cài đặt", icon: Settings },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item, idx) =>
        item.section !== undefined ? (
          item.section ? (
            <div
              key={`section-${idx}`}
              className="text-xs font-semibold uppercase tracking-wide px-3 pt-3 pb-1"
              style={{ color: "var(--ink-soft)" }}
            >
              {item.section}
            </div>
          ) : (
            <div key={`divider-${idx}`} className="my-2" style={{ borderTop: "1px solid var(--line)" }} />
          )
        ) : (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left"
            style={{
              background: active === item.id ? "var(--ink)" : "transparent",
              color: active === item.id ? "var(--paper-light)" : "var(--ink)",
            }}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        )
      )}
    </nav>
  );
}
