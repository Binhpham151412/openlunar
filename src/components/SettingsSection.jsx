import { useRef } from "react";
import { Info, Check, Download, Upload } from "lucide-react";
import { RULES } from "../lib/rules";
import { buildBackup, downloadBackup } from "../lib/backup";

export default function SettingsSection({ enabledRules, onToggleRule, onImportBackup }) {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    const data = await buildBackup();
    downloadBackup(data);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        onImportBackup(data);
      } catch {
        alert("File không hợp lệ — không đọc được dữ liệu backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="xn-card p-4 max-w-md">
      <h2 className="xn-serif text-xl font-bold mb-3">Bật / tắt yếu tố</h2>
      <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
        Tắt bớt yếu tố nếu bạn không theo trường phái đó — lịch sẽ tự cập nhật lại màu.
      </p>
      <div className="space-y-2">
        {RULES.map((r) => (
          <label key={r.id} className="flex items-center justify-between text-sm py-1 cursor-pointer">
            <span>{r.name}</span>
            <span
              onClick={() => onToggleRule(r.id)}
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{
                background: enabledRules[r.id] !== false ? "var(--ink)" : "transparent",
                border: `1px solid ${enabledRules[r.id] !== false ? "var(--ink)" : "var(--line)"}`,
              }}
            >
              {enabledRules[r.id] !== false && <Check size={13} color="var(--paper-light)" />}
            </span>
          </label>
        ))}
      </div>
      <div className="flex items-start gap-1.5 mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
        <Info size={13} className="shrink-0 mt-0.5" />
        <span>Kết quả lưu tự động trên trình duyệt này, chỉ mình bạn thấy được.</span>
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
          Sao lưu dữ liệu
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="xn-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Download size={14} /> Xuất backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="xn-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Upload size={14} /> Nhập backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </div>
    </div>
  );
}
