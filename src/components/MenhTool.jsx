import { useState } from "react";
import { X, Palette } from "lucide-react";
import { CAN, CHI } from "../lib/canChi";
import { getNapAm, MENH_COLORS } from "../lib/napAm";

export default function MenhTool({ onClose }) {
  const [birthYear, setBirthYear] = useState("");

  let result = null;
  if (birthYear) {
    const year = Number(birthYear);
    const canIdx = (((year + 6) % 10) + 10) % 10;
    const chiIdx = (((year + 8) % 12) + 12) % 12;
    const napAm = getNapAm(canIdx, chiIdx);
    result = {
      canChi: `${CAN[canIdx]} ${CHI[chiIdx]}`,
      napAm,
      colors: MENH_COLORS[napAm.element],
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-card relative w-full max-w-sm p-4 overflow-y-auto" style={{ maxHeight: "88vh" }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="xn-serif text-lg font-bold flex items-center gap-1.5">
            <Palette size={18} /> Xem Mệnh (Ngũ Hành Nạp Âm)
          </h3>
          <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
          Nhập năm sinh dương lịch để xem Can Chi năm sinh, Mệnh Ngũ Hành Nạp Âm và màu hợp/kỵ tương ứng.
        </p>

        <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
          Năm sinh (dương lịch)
        </label>
        <input
          type="number"
          inputMode="numeric"
          placeholder="vd. 1996"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
          className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm mb-3"
          style={{ borderColor: "var(--line)", background: "var(--paper)" }}
        />

        {result && (
          <div className="xn-card p-3">
            <div className="text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Can Chi năm sinh</span>
                <span className="font-medium">{result.canChi}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Mệnh Nạp Âm</span>
                <span className="font-medium">{result.napAm.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Ngũ Hành</span>
                <span className="font-medium">{result.napAm.element}</span>
              </div>
            </div>
            <div className="text-sm mb-1">
              <span className="font-medium">Màu hợp: </span>
              <span style={{ color: "var(--ink-soft)" }}>{result.colors.hop.join(", ")}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Màu nên tránh: </span>
              <span style={{ color: "var(--ink-soft)" }}>{result.colors.ky.join(", ")}</span>
            </div>
          </div>
        )}

        <p className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
          Cách tính dùng trực tiếp năm sinh dương lịch (không quy đổi âm lịch/tiết Lập Xuân) để nhất quán với các mục
          tính theo tuổi khác trong app — xem thêm ở tab "Nguồn tham khảo".
        </p>
      </div>
    </div>
  );
}
