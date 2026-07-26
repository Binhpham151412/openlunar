import { useState } from "react";
import { Compass, Info } from "lucide-react";
import { getCungPhiNumber, getCungInfo, getBatTrachDirections } from "../lib/batTrach";

export default function HuongNhaTool() {
  const [gender, setGender] = useState("nam");
  const [birthYear, setBirthYear] = useState("");

  let cungInfo = null;
  let directions = null;
  if (birthYear) {
    const cungNumber = getCungPhiNumber(Number(birthYear), gender);
    cungInfo = getCungInfo(cungNumber);
    directions = getBatTrachDirections(cungNumber);
  }

  const goodDirs = directions?.filter((d) => d.good) ?? [];
  const badDirs = directions?.filter((d) => !d.good) ?? [];

  return (
    <div className="xn-card p-4 max-w-lg">
      <h2 className="xn-serif text-xl font-bold mb-1 flex items-center gap-1.5">
        <Compass size={19} /> Hướng nhà / bếp (Bát Trạch)
      </h2>
      <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
        Nhập năm sinh (dương lịch) + giới tính của gia chủ (thường là người trụ cột) để xem Cung Mệnh và các hướng
        hợp/kỵ.
      </p>

        <div className="space-y-3 mb-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--ink-soft)" }}>
              Giới tính gia chủ
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
              placeholder="vd. 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
              className="xn-mono border rounded-md px-2 py-1.5 w-full text-sm"
              style={{ borderColor: "var(--line)", background: "var(--paper)" }}
            />
          </div>
        </div>

        {cungInfo && (
          <>
            <div className="xn-card p-3 mb-3 text-sm">
              <div className="flex justify-between mb-1">
                <span style={{ color: "var(--ink-soft)" }}>Cung Mệnh</span>
                <span className="font-medium">{cungInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Nhóm</span>
                <span className="font-medium">{cungInfo.group}</span>
              </div>
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
              4 hướng tốt
            </h4>
            <div className="xn-card overflow-hidden mb-3">
              {goodDirs.map((d) => (
                <div key={d.star} className="xn-rule-row px-3 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {d.cung.direction} <span style={{ color: "var(--ink-soft)" }}>({d.star})</span>
                    </span>
                    <span className="xn-badge-yellow text-xs font-semibold px-2 py-0.5 rounded-full">Tốt</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    {d.meaning}
                  </p>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
              4 hướng xấu
            </h4>
            <div className="xn-card overflow-hidden mb-3">
              {badDirs.map((d) => (
                <div key={d.star} className="xn-rule-row px-3 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {d.cung.direction} <span style={{ color: "var(--ink-soft)" }}>({d.star})</span>
                    </span>
                    <span className="xn-badge-red text-xs font-semibold px-2 py-0.5 rounded-full">Xấu</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    {d.meaning}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-1.5 mb-3 text-xs" style={{ color: "var(--ink-soft)" }}>
              <Info size={13} className="shrink-0 mt-0.5" />
              <span>
                Riêng hướng bếp áp dụng nguyên tắc "toạ hung hướng cát": đặt bếp (vị trí) ở cung xấu, nhưng miệng bếp
                (nơi thao tác, hướng ra) quay về 1 trong 4 hướng tốt ở trên — không đơn giản như hướng nhà/cửa chính.
              </span>
            </div>
          </>
        )}

      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
        Cách tính dùng năm sinh dương lịch trực tiếp (không quy đổi theo tiết Lập Xuân) để nhất quán với các mục
        khác trong app — xem chi tiết công thức ở tab "Nguồn tham khảo".
      </p>
    </div>
  );
}
