/* ============================================================
   NHÓM B — theo tuổi gia chủ (Kim Lâu, Tam Tai, Hoang Ốc)
   ============================================================ */

// Ý nghĩa từng loại Kim Lâu — kiến thức phổ biến, ít dị bản.
const KIMLAU_MEANING = {
  "Kim Lâu Thân": "Hại đến bản thân gia chủ — dễ gặp vấn đề sức khoẻ, tai nạn.",
  "Kim Lâu Thê": "Hại đến vợ/chồng — dễ ảnh hưởng hôn nhân, tình duyên.",
  "Kim Lâu Tử": "Hại đến con cái.",
  "Kim Lâu Lục Súc": "Hại đến vật nuôi, tài sản phụ (gia súc, của cải phụ).",
};

export function getKimLau(birthYear, viewYear) {
  const tuoiMu = viewYear - birthYear + 1;
  if (tuoiMu <= 0) return null;
  const r = tuoiMu % 9;
  const map = { 1: "Kim Lâu Thân", 3: "Kim Lâu Thê", 6: "Kim Lâu Tử", 8: "Kim Lâu Lục Súc" };
  return map[r] ? { tuoiMu, type: map[r], meaning: KIMLAU_MEANING[map[r]] } : null;
}

export function getTamTai(birthYear, viewYear) {
  const birthChi = ((birthYear + 8) % 12 + 12) % 12;
  const groups = [
    { members: [8, 0, 4], tai: [2, 3, 4] },
    { members: [2, 6, 10], tai: [8, 9, 10] },
    { members: [5, 9, 1], tai: [11, 0, 1] },
    { members: [11, 3, 7], tai: [5, 6, 7] },
  ];
  const group = groups.find((g) => g.members.includes(birthChi));
  if (!group) return false;
  const viewChi = ((viewYear + 8) % 12 + 12) % 12;
  return group.tai.includes(viewChi);
}

// Hoang Ốc: 6 cung tuần hoàn — Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc.
// Tuổi 10=Nhất Cát, 20=Nhì Nghi, 30=Tam Địa Sát... rồi đếm tiếp cho tuổi lẻ trong thập kỷ.
// Công thức đã tự kiểm chứng khớp với 3 ví dụ thực tế tìm được (tuổi 35, 45, 47).
const HOANGOC_LIST = ["Nhất Cát", "Nhì Nghi", "Tam Địa Sát", "Tứ Tấn Tài", "Ngũ Thọ Tử", "Lục Hoang Ốc"];
const HOANGOC_GOOD = [true, true, false, true, false, false];
// Ý nghĩa từng cung Hoang Ốc — kiến thức phổ biến, ít dị bản.
const HOANGOC_MEANING = [
  "Tốt — may mắn, thuận lợi.",
  "Tốt — thuận lợi, ít trở ngại.",
  "Xấu — dễ va chạm về đất đai, xây dựng.",
  "Tốt — tài lộc tăng tiến.",
  "Xấu — ảnh hưởng đến sức khoẻ, tuổi thọ.",
  "Xấu — nhà cửa dễ bất ổn, hao tán.",
];

export function getHoangOc(birthYear, viewYear) {
  const tuoiMu = viewYear - birthYear + 1;
  if (tuoiMu < 10) return null;
  const floor10 = Math.floor(tuoiMu / 10) * 10;
  const decadeIdx = (((floor10 / 10 - 1) % 6) + 6) % 6;
  const offset = tuoiMu - floor10;
  const idx = (decadeIdx + offset) % 6;
  return { tuoiMu, type: HOANGOC_LIST[idx], good: HOANGOC_GOOD[idx], meaning: HOANGOC_MEANING[idx] };
}
