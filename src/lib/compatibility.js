/* ============================================================
   XEM TUỔI HỢP — so Thiên Can (Ngũ Hợp), Địa Chi (Tam Hợp/Lục Hợp/
   Tứ Hành Xung/Lục Hại) và Ngũ Hành Nạp Âm giữa 2 năm sinh.
   Đây là 3 lớp xét riêng — dân gian không có 1 công thức duy nhất
   gộp tất cả thành 1 điểm số, nên chỉ liệt kê từng lớp + gợi ý
   tổng quan, không suy ra một kết luận "khoa học" duy nhất.
   ============================================================ */

import { CAN, CHI } from "./canChi";
import { getNapAm } from "./napAm";

const CAN_ELEMENT = ["Mộc", "Mộc", "Hỏa", "Hỏa", "Thổ", "Thổ", "Kim", "Kim", "Thủy", "Thủy"];
const SINH_NEXT = { Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc" };

const TAM_HOP_GROUPS = [
  [8, 0, 4], // Thân Tý Thìn
  [2, 6, 10], // Dần Ngọ Tuất
  [5, 9, 1], // Tỵ Dậu Sửu
  [11, 3, 7], // Hợi Mão Mùi
];
const TU_HANH_XUNG_GROUPS = [
  [0, 6, 3, 9], // Tý Ngọ Mão Dậu
  [2, 8, 5, 11], // Dần Thân Tỵ Hợi
  [4, 10, 1, 7], // Thìn Tuất Sửu Mùi
];

function yearToCanChi(year) {
  const canIdx = (((year + 6) % 10) + 10) % 10;
  const chiIdx = (((year + 8) % 12) + 12) % 12;
  return { canIdx, chiIdx };
}

function elementRelation(elA, elB) {
  if (elA === elB) return "hoa";
  if (SINH_NEXT[elA] === elB || SINH_NEXT[elB] === elA) return "sinh";
  return "khac"; // giữa 5 hành, 2 hành khác nhau mà không sinh nhau thì luôn khắc nhau
}

function canRelation(canA, canB) {
  if (canA === canB) return { type: "hoa", label: "Cùng Thiên Can" };
  if (((canB - canA + 10) % 10) === 5) return { type: "hop", label: "Ngũ Hợp (rất tốt)" };
  const rel = elementRelation(CAN_ELEMENT[canA], CAN_ELEMENT[canB]);
  if (rel === "sinh") return { type: "sinh", label: "Ngũ hành Can tương sinh (tốt)" };
  if (rel === "hoa") return { type: "hoa", label: "Cùng hành Can (bình thường)" };
  return { type: "khac", label: "Ngũ hành Can tương khắc (cần lưu ý)" };
}

function chiRelation(chiA, chiB) {
  if (chiA === chiB) return { type: "hoa", label: "Cùng tuổi (bằng Chi)" };
  if (TAM_HOP_GROUPS.some((g) => g.includes(chiA) && g.includes(chiB))) {
    return { type: "hop", label: "Tam Hợp (rất tốt)" };
  }
  if ((chiA + chiB) % 12 === 1) return { type: "hop", label: "Lục Hợp (tốt)" };
  if (TU_HANH_XUNG_GROUPS.some((g) => g.includes(chiA) && g.includes(chiB))) {
    return { type: "khac", label: "Tứ Hành Xung (xấu)" };
  }
  if ((chiA + chiB) % 12 === 7) return { type: "khac", label: "Lục Hại (cần lưu ý)" };
  return { type: "hoa", label: "Bình thường" };
}

function compareCanChi(canA, chiA, canB, chiB) {
  const napAmA = getNapAm(canA, chiA);
  const napAmB = getNapAm(canB, chiB);

  const can = canRelation(canA, canB);
  const chi = chiRelation(chiA, chiB);
  const napAmRel = elementRelation(napAmA.element, napAmB.element);
  const napAm = {
    type: napAmRel === "khac" ? "khac" : napAmRel === "sinh" ? "sinh" : "hoa",
    label:
      napAmRel === "sinh"
        ? "Nạp Âm tương sinh (tốt)"
        : napAmRel === "hoa"
          ? "Cùng hành Nạp Âm (bình thường)"
          : "Nạp Âm tương khắc (cần lưu ý)",
  };

  const relations = [can, chi, napAm];
  const goodCount = relations.filter((r) => r.type === "hop" || r.type === "sinh").length;
  const badCount = relations.filter((r) => r.type === "khac").length;
  const overall = badCount === 0 && goodCount >= 2 ? "hop" : badCount >= 2 ? "khac" : "binh-thuong";

  return { napAmA, napAmB, can, chi, napAm, overall };
}

export function compareBirthYears(yearA, yearB) {
  const a = yearToCanChi(yearA);
  const b = yearToCanChi(yearB);
  const r = compareCanChi(a.canIdx, a.chiIdx, b.canIdx, b.chiIdx);
  return {
    a: { canChi: `${CAN[a.canIdx]} ${CHI[a.chiIdx]}`, napAm: r.napAmA },
    b: { canChi: `${CAN[b.canIdx]} ${CHI[b.chiIdx]}`, napAm: r.napAmB },
    can: r.can,
    chi: r.chi,
    napAm: r.napAm,
    overall: r.overall,
  };
}

// So sánh ngày đang xem với năm sinh gia chủ — tái dùng đúng logic Thiên Can/Địa
// Chi/Nạp Âm ở trên, chỉ thay 1 "năm sinh" bằng Can Chi của chính ngày hôm đó.
export function compareDayToBirthYear(dayInfo, birthYear) {
  const nguoi = yearToCanChi(birthYear);
  const r = compareCanChi(dayInfo.canDayIndex, dayInfo.chiDayIndex, nguoi.canIdx, nguoi.chiIdx);
  return {
    ngay: { canChi: dayInfo.canChiDay, napAm: r.napAmA },
    nguoi: { canChi: `${CAN[nguoi.canIdx]} ${CHI[nguoi.chiIdx]}`, napAm: r.napAmB },
    can: r.can,
    chi: r.chi,
    napAm: r.napAm,
    overall: r.overall,
  };
}
