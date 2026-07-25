import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { convertSolar2Lunar } from "../lib/lunarCalendar";
import { GIO_CHI_LIST, computeTrungTang } from "../lib/trungTang";
import { storage } from "../lib/storage";

const LEVEL_META = {
  bad: { label: "Trùng Tang", cls: "xn-badge-red", note: "Cần lưu ý — theo cách tính này, nên tìm hiểu thêm cách hoá giải (ví dụ nhờ trấn trùng tang) hoặc hỏi thêm người có kinh nghiệm." },
  mid: { label: "Thiên Di", cls: "xn-badge-yellow", note: "Mức trung bình, dân gian cho là có thể hoá giải được, không quá nặng." },
  good: { label: "Nhập Mộ", cls: "xn-badge-yellow", note: "Theo quan niệm dân gian đây là dấu hiệu yên ổn, nhẹ nhàng nhất trong 3 mức." },
};

export default function TrungTangTool({ onClose }) {
  const [gender, setGender] = useState("nam");
  const [birthYear, setBirthYear] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [gioChiIdx, setGioChiIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await storage.get("trungtang_last");
        if (res && res.value && mounted) {
          const p = JSON.parse(res.value);
          if (p.gender) setGender(p.gender);
          if (p.birthYear) setBirthYear(String(p.birthYear));
          if (p.gioChiIdx !== undefined) setGioChiIdx(p.gioChiIdx);
        }
      } catch {
        /* chưa có dữ liệu trước đó */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!birthYear) return;
    storage
      .set("trungtang_last", JSON.stringify({ gender, birthYear: Number(birthYear), gioChiIdx }))
      .catch(() => {});
  }, [gender, birthYear, gioChiIdx]);

  let result = null;
  let lunarDeath = null;
  let tuoiMu = null;
  if (birthYear && deathDate) {
    const [yy, mm, dd] = deathDate.split("-").map(Number);
    if (yy && mm && dd) {
      lunarDeath = convertSolar2Lunar(dd, mm, yy);
      tuoiMu = lunarDeath.lunarYear - Number(birthYear) + 1;
      if (tuoiMu > 0) {
        result = computeTrungTang({
          gender,
          tuoiMu,
          lunarMonth: lunarDeath.lunarMonth,
          lunarDay: lunarDeath.lunarDay,
          gioChiIdx,
        });
      }
    }
  }

  const finalLevel = result ? result.cungGio.level : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="xn-card relative w-full max-w-sm p-4 overflow-y-auto" style={{ maxHeight: "88vh" }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="xn-serif text-lg font-bold">Tính Trùng Tang</h3>
          <button className="p-1.5 rounded-full xn-btn-ghost" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
          Công cụ dùng ngày giờ người mất (không phải ngày định làm việc) để tham khảo thêm khi chọn ngày an táng.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Giới tính người mất
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

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Năm sinh (dương lịch)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="vd. 1950"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Ngày mất (dương lịch)
            </label>
            <input
              type="date"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Giờ mất
            </label>
            <select
              value={gioChiIdx}
              onChange={(e) => setGioChiIdx(Number(e.target.value))}
              className="border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            >
              {GIO_CHI_LIST.map((g) => (
                <option key={g.idx} value={g.idx}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="xn-card mt-4 p-3">
            <p className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
              Âm lịch ngày mất: {lunarDeath.lunarDay}/{lunarDeath.lunarMonth}/{lunarDeath.lunarYear} — tuổi mụ {tuoiMu}
            </p>
            <div className="text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Cung tuổi</span>
                <span className="font-medium">{result.cungTuoi.chi} ({result.cungTuoi.label})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Cung tháng</span>
                <span className="font-medium">{result.cungThang.chi} ({result.cungThang.label})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Cung ngày</span>
                <span className="font-medium">{result.cungNgay.chi} ({result.cungNgay.label})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Cung giờ (kết quả)</span>
                <span className="font-medium">{result.cungGio.chi} ({result.cungGio.label})</span>
              </div>
            </div>
            <div className={`${LEVEL_META[finalLevel].cls} rounded-lg p-2 text-sm font-semibold text-center mb-1`}>
              Kết quả: {LEVEL_META[finalLevel].label}
            </div>
            <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
              {LEVEL_META[finalLevel].note}
            </p>
          </div>
        )}

        <div className="flex items-start gap-1.5 mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
          <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--seal)" }} />
          <span>
            Cách tính Trùng Tang có nhiều dị bản giữa các thầy/trường phái. Kết quả ở đây chỉ mang tính tham khảo —
            với việc hệ trọng như tang lễ, nên đối chiếu thêm với người có kinh nghiệm trước khi quyết định.
          </span>
        </div>
      </div>
    </div>
  );
}
