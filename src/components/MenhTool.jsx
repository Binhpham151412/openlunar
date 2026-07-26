import { useState } from "react";
import { Palette } from "lucide-react";
import { CAN, CHI } from "../lib/canChi";
import { getNapAm, MENH_COLORS } from "../lib/napAm";

export default function MenhTool() {
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
    <div className="xn-card p-4 max-w-md">
      <h2 className="xn-serif text-xl font-bold mb-1 flex items-center gap-1.5">
        <Palette size={19} /> Xem Mệnh (Ngũ Hành Nạp Âm)
      </h2>
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
  );
}
