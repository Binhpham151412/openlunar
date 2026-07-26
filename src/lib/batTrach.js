/* ============================================================
   BÁT TRẠCH — Cung Phi theo năm sinh + giới tính, và 8 hướng
   Sinh Khí/Diên Niên/Thiên Y/Phục Vị (tốt) — Tuyệt Mệnh/Ngũ Quỷ/
   Lục Sát/Họa Hại (xấu) theo phép "Du Niên Biến Quái" (đổi hào
   thượng/trung/hạ của quẻ 3 hào). Thuật toán đã đối chiếu khớp
   từng bước với ví dụ mẫu (quẻ Khôn → Cấn → Tốn → Càn) — xem
   "Nguồn tham khảo" trong app.
   ============================================================ */

// [hào thượng, hào trung, hào hạ] — 1 = Dương (liền), 0 = Âm (đứt)
const TRIGRAM_BITS = {
  1: [0, 1, 0], // Khảm
  2: [0, 0, 0], // Khôn
  3: [0, 0, 1], // Chấn
  4: [1, 1, 0], // Tốn
  6: [1, 1, 1], // Càn
  7: [0, 1, 1], // Đoài
  8: [1, 0, 0], // Cấn
  9: [1, 0, 1], // Ly
};
const TRIGRAM_NAMES = { 1: "Khảm", 2: "Khôn", 3: "Chấn", 4: "Tốn", 6: "Càn", 7: "Đoài", 8: "Cấn", 9: "Ly" };
const TRIGRAM_DIRECTIONS = {
  1: "Bắc",
  2: "Tây Nam",
  3: "Đông",
  4: "Đông Nam",
  6: "Tây Bắc",
  7: "Tây",
  8: "Đông Bắc",
  9: "Nam",
};
const DONG_TU_MENH = [1, 3, 4, 9];

const DU_NIEN_STEPS = [
  { pos: 0, star: "Sinh Khí", good: true, meaning: "Phúc lộc vẹn toàn — tốt nhất cho sức khoẻ và tài lộc." },
  { pos: 1, star: "Ngũ Quỷ", good: false, meaning: "Dễ gặp tai hoạ, hao tài, bất hoà." },
  { pos: 2, star: "Diên Niên", good: true, meaning: "Ổn định, hoà thuận — tốt cho hôn nhân, tình cảm gia đình." },
  { pos: 1, star: "Lục Sát", good: false, meaning: "Dễ có sát khí, xung đột, kiện tụng." },
  { pos: 0, star: "Họa Hại", good: false, meaning: "Hao tài tốn của, hung khí nhẹ." },
  { pos: 1, star: "Thiên Y", good: true, meaning: "Được che chở — tốt cho sức khoẻ, chữa bệnh." },
  { pos: 2, star: "Tuyệt Mệnh", good: false, meaning: "Xấu nhất trong 4 hung tinh — dễ mất mát lớn." },
  { pos: 1, star: "Phục Vị", good: true, meaning: "Bình hoà, được giúp đỡ — tốt nhẹ, ổn định." },
];

function digitalRoot(n) {
  let x = n;
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

function bitsToCungNumber(bits) {
  const key = Object.keys(TRIGRAM_BITS).find((k) => TRIGRAM_BITS[k].join(",") === bits.join(","));
  return Number(key);
}

// Công thức phổ biến trong Bát Trạch: rút gọn 2 chữ số cuối năm sinh về 1 chữ số,
// áp công thức khác nhau cho Nam/Nữ và trước/sau năm 2000, số 5 quy ước riêng.
export function getCungPhiNumber(year, gender) {
  const a = digitalRoot(year % 100);
  const isAfter2000 = year >= 2000;
  let n = gender === "nam" ? (isAfter2000 ? 9 - a : 10 - a) : isAfter2000 ? a + 6 : 5 + a;
  n = digitalRoot(n);
  if (n === 0) n = 9; // b=0 quy về cung Ly
  if (n === 5) n = gender === "nam" ? 2 : 8; // không có cung số 5 → Nam quy Khôn, Nữ quy Cấn
  return n;
}

export function getCungInfo(cungNumber) {
  return {
    number: cungNumber,
    name: TRIGRAM_NAMES[cungNumber],
    direction: TRIGRAM_DIRECTIONS[cungNumber],
    group: DONG_TU_MENH.includes(cungNumber) ? "Đông Tứ Mệnh" : "Tây Tứ Mệnh",
  };
}

export function getBatTrachDirections(cungNumber) {
  let bits = TRIGRAM_BITS[cungNumber];
  return DU_NIEN_STEPS.map((step) => {
    bits = [...bits];
    bits[step.pos] = bits[step.pos] === 1 ? 0 : 1;
    const targetCung = bitsToCungNumber(bits);
    return {
      star: step.star,
      good: step.good,
      meaning: step.meaning,
      cung: getCungInfo(targetCung),
    };
  });
}
