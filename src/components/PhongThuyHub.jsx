import { X, Palette, Users, Compass, ChevronRight } from "lucide-react";

const TOOLS = [
  { id: "menh", label: "Xem Mệnh (Ngũ Hành Nạp Âm)", icon: Palette },
  { id: "tuoihop", label: "Xem tuổi hợp (vợ chồng / làm ăn)", icon: Users },
  { id: "huongnha", label: "Hướng nhà / bếp (Bát Trạch)", icon: Compass },
];

export default function PhongThuyHub({ onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-card relative w-full max-w-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="xn-serif text-lg font-bold">Công cụ Phong Thủy</h3>
          <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="xn-card overflow-hidden">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onPick(tool.id)}
                className="xn-rule-row w-full flex items-center justify-between px-3 py-3 text-left"
              >
                <span className="text-sm font-medium flex items-center gap-2">
                  <Icon size={16} />
                  {tool.label}
                </span>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
