import { useState } from "react";
import { Star, AlertTriangle } from "lucide-react";
import { getSaoHan } from "../lib/saoHan";

const LEVEL_META = {
  tot: { label: "Cát tinh (tốt)", cls: "xn-badge-yellow" },
  trung: { label: "Trung bình", cls: "xn-chip" },
  xau: { label: "Hung tinh (xấu)", cls: "xn-badge-red" },
};

export default function SaoHanTool() {
  const [gender, setGender] = useState("nam");
  const [birthYear, setBirthYear] = useState("");
  const [viewYear, setViewYear] = useState(String(new Date().getFullYear()));

  const result = birthYear && viewYear ? getSaoHan(Number(birthYear), Number(viewYear), gender) : null;

  return (
    <div className="xn-card p-4 max-w-md">
      <h2 className="xn-serif text-xl font-bold mb-1 flex items-center gap-1.5">
        <Star size={19} /> Sao hạn hàng năm
      </h2>
      <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
        9 sao (Cửu Diệu) luân phiên theo tuổi mụ, thứ tự khác nhau giữa Nam và Nữ — dùng để biết nên "cúng sao giải
        hạn" năm nào.
      </p>

      <div className="space-y-3 mb-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
            Giới tính
          </label>
          <div className="flex gap-2">
            {["nam", "nu"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`xn-chip ${gender === g ? "active" : ""} px-3 py-1.5 rounded-full text-sm font-medium`}
              >
                {g === "nam" ? "Nam" : "Nữ"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Năm sinh (dương lịch)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="vd. 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Xem cho năm
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={viewYear}
              onChange={(e) => setViewYear(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="xn-card p-3">
          <p className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
            Tuổi mụ năm {viewYear}: {result.tuoiMu}
          </p>
          <div className={`${LEVEL_META[result.level].cls} rounded-lg p-2 text-sm font-semibold text-center mb-2`}>
            Sao {result.sao} — {LEVEL_META[result.level].label}
          </div>
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {result.desc}
          </p>
        </div>
      )}

      <div className="flex items-start gap-1.5 mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--seal)" }} />
        <span>
          Một số nguồn cho rằng vài năm tuổi cụ thể (thường gắn với sao La Hầu ở nam / Kế Đô ở nữ) nặng hơn bình
          thường do trùng thêm sao Thái Tuế, nhưng các nguồn không thống nhất chính xác những năm nào — nên chưa đưa
          vào cách tính ở đây. Cách tính dùng năm sinh dương lịch trực tiếp, nhất quán với các mục theo tuổi khác
          trong app.
        </span>
      </div>
    </div>
  );
}
