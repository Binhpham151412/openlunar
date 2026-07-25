import { CHI } from "./canChi";
export { GIO_CHI_LIST } from "./hours";

/* ============================================================
   CÔNG CỤ RIÊNG — TRÙNG TANG (dùng ngày giờ MẤT, không phải
   ngày định làm việc, nên tách khỏi luồng chọn ngày ở lịch chính)
   ============================================================ */

const TRUNGTANG_NAM_START = 2; // Dần
const TRUNGTANG_NU_START = 8; // Thân

function stepChi(startIdx, steps, forward) {
  const dir = forward ? 1 : -1;
  return (((startIdx + dir * steps) % 12) + 12) % 12;
}

function classifyTrungTangCung(chiIdx) {
  if ([2, 8, 5, 11].includes(chiIdx)) return { label: "Trùng Tang", level: "bad" }; // Dần Thân Tỵ Hợi
  if ([0, 6, 3, 9].includes(chiIdx)) return { label: "Thiên Di", level: "mid" }; // Tý Ngọ Mão Dậu
  return { label: "Nhập Mộ", level: "good" }; // Thìn Tuất Sửu Mùi
}

export function computeTrungTang({ gender, tuoiMu, lunarMonth, lunarDay, gioChiIdx }) {
  const forward = gender === "nam";
  const start = forward ? TRUNGTANG_NAM_START : TRUNGTANG_NU_START;
  const cungTuoiIdx = stepChi(start, tuoiMu - 1, forward);
  const cungThangIdx = stepChi(cungTuoiIdx, lunarMonth, forward);
  const cungNgayIdx = stepChi(cungThangIdx, lunarDay, forward);
  const cungGioIdx = stepChi(cungNgayIdx, gioChiIdx + 1, forward);
  return {
    cungTuoi: { chi: CHI[cungTuoiIdx], ...classifyTrungTangCung(cungTuoiIdx) },
    cungThang: { chi: CHI[cungThangIdx], ...classifyTrungTangCung(cungThangIdx) },
    cungNgay: { chi: CHI[cungNgayIdx], ...classifyTrungTangCung(cungNgayIdx) },
    cungGio: { chi: CHI[cungGioIdx], ...classifyTrungTangCung(cungGioIdx) },
  };
}
