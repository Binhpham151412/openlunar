import { useState } from "react";
import { Users, AlertTriangle } from "lucide-react";
import { compareBirthYears } from "../lib/compatibility";

const REL_BADGE = {
  hop: "xn-badge-yellow",
  sinh: "xn-badge-yellow",
  hoa: "xn-chip",
  khac: "xn-badge-red",
};

const OVERALL_META = {
  hop: { label: "Khá hợp nhau", cls: "xn-badge-yellow" },
  "binh-thuong": { label: "Bình thường", cls: "xn-chip" },
  khac: { label: "Cần lưu ý, nên tìm hiểu thêm", cls: "xn-badge-red" },
};

function RelRow({ title, rel }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span style={{ color: "var(--ink-soft)" }}>{title}</span>
      <span className={`${REL_BADGE[rel.type]} text-xs font-medium px-2 py-1 rounded-full`}>{rel.label}</span>
    </div>
  );
}

export default function CompatibilityTool() {
  const [yearA, setYearA] = useState("");
  const [yearB, setYearB] = useState("");

  const result = yearA && yearB ? compareBirthYears(Number(yearA), Number(yearB)) : null;

  return (
    <div className="xn-card p-4 max-w-md">
      <h2 className="xn-serif text-xl font-bold mb-1 flex items-center gap-1.5">
        <Users size={19} /> Xem tuổi hợp
      </h2>
      <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
        So Thiên Can, Địa Chi và Ngũ Hành Nạp Âm giữa 2 năm sinh — dùng tham khảo cho vợ chồng, hợp tác làm ăn...
      </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Năm sinh người 1
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="vd. 1994"
              value={yearA}
              onChange={(e) => setYearA(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Năm sinh người 2
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="vd. 1996"
              value={yearB}
              onChange={(e) => setYearB(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>
        </div>

        {result && (
          <div className="xn-card p-3">
            <p className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
              {result.a.canChi} ({result.a.napAm.name}) &nbsp;·&nbsp; {result.b.canChi} ({result.b.napAm.name})
            </p>
            <div className="divide-y" style={{ borderColor: "var(--line)" }}>
              <RelRow title="Thiên Can" rel={result.can} />
              <RelRow title="Địa Chi" rel={result.chi} />
              <RelRow title="Ngũ Hành Nạp Âm" rel={result.napAm} />
            </div>
            <div
              className={`${OVERALL_META[result.overall].cls} rounded-lg p-2 text-sm font-semibold text-center mt-3`}
            >
              {OVERALL_META[result.overall].label}
            </div>
          </div>
        )}

        <div className="flex items-start gap-1.5 mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
          <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--seal)" }} />
          <span>
            Đây là 3 lớp xét riêng, dân gian không có công thức duy nhất gộp thành 1 điểm số — kết quả tổng quan chỉ
            mang tính tham khảo. Hạnh phúc hôn nhân hay thành công làm ăn phụ thuộc chủ yếu vào con người, không phải
            tuổi tác.
          </span>
      </div>
    </div>
  );
}
