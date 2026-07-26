import { convertSolar2Lunar, getTietKhi } from "./lunarCalendar";
import { GIO_CHI_LIST } from "./hours";

/* ============================================================
   CAN CHI, TRỰC, SAO HOÀNG ĐẠO / HẮC ĐẠO
   ============================================================ */

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
export const TRUC_LIST = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];
// Ý nghĩa 12 Trực (Thập Nhị Kiến Trừ) — hệ cổ điển phổ biến, mô tả tốt/kỵ có thể
// hơi khác nhau giữa các nguồn, chỉ nên xem là tham khảo (xem "Nguồn tham khảo").
export const TRUC_MEANING = {
  "Kiến": "Tốt cho khai trương, nhậm chức, xuất hành; dân gian kỵ động thổ, đào giếng.",
  "Trừ": "Tốt cho trừ tà, dọn dẹp, chữa bệnh, cắt tóc; kỵ xuất hành xa, khai trương.",
  "Mãn": "Tốt cho ăn hỏi, cúng tế, nhập trạch; dân gian kỵ an táng, kiện tụng.",
  "Bình": "Tốt cho tu sửa, san lấp, giao dịch thường ngày; kỵ khởi sự việc lớn, xuất hành xa.",
  "Định": "Tốt cho cưới hỏi, nhậm chức, ký kết hợp đồng, xây dựng; kỵ kiện tụng, tranh chấp.",
  "Chấp": "Tốt cho xây dựng, tu tạo, chăn nuôi, ký kết; kỵ xuất hành xa, di chuyển.",
  "Phá": "Xấu cho hầu hết việc lớn, đặc biệt kỵ cưới hỏi và ký kết; chỉ hợp phá dỡ, chữa bệnh.",
  "Nguy": "Kỵ đi xa, lên cao, việc mạo hiểm; nên thận trọng, phòng ngừa rủi ro.",
  "Thành": "Một trong những Trực tốt nhất — hợp cưới hỏi, khai trương, nhậm chức.",
  "Thu": "Tốt cho thu hoạch, nhập kho, cưới hỏi, an táng; kỵ khai trương, xuất hành xa.",
  "Khai": "Tốt cho khai trương, cưới hỏi, xuất hành, nhậm chức; kỵ an táng.",
  "Bế": "Tốt cho việc đóng cửa, an táng, xây bể/kho; kỵ khai trương, xuất hành, cưới hỏi.",
};

export const STAR_LIST = [
  "Thanh Long", "Minh Đường", "Thiên Hình", "Chu Tước", "Kim Quỹ", "Kim Đường",
  "Bạch Hổ", "Ngọc Đường", "Thiên Lao", "Nguyên Vũ", "Tư Mệnh", "Câu Trận",
];
export const STAR_GOOD = [true, true, false, false, true, true, false, true, false, false, true, false];
// Ý nghĩa 12 Sao Hoàng Đạo/Hắc Đạo — cùng lưu ý dị bản như trên.
export const STAR_MEANING = {
  "Thanh Long": "Đại cát — tốt cho hầu hết việc lớn: xuất hành, ký kết, khai trương.",
  "Minh Đường": "Cát — tốt cho cầu tài, gặp quý nhân, đàm phán.",
  "Thiên Hình": "Hung — kỵ kiện tụng, hình phạt, va chạm pháp lý.",
  "Chu Tước": "Hung — dễ khẩu thiệt, thị phi, tranh cãi.",
  "Kim Quỹ": "Cát — đặc biệt tốt cho hôn nhân, tài lộc, giao dịch mua bán.",
  "Kim Đường": "Cát — tốt cho xây dựng, cưới hỏi.",
  "Bạch Hổ": "Hung — dễ tai họa, cần thận trọng với tang lễ, xây cất.",
  "Ngọc Đường": "Cát — tốt cho cầu tài, chữa bệnh, học hành thi cử.",
  "Thiên Lao": "Hung — dễ vướng tranh chấp, giam cầm, bó buộc.",
  "Nguyên Vũ": "Hung — dễ mất mát, trộm cắp, thất thoát.",
  "Tư Mệnh": "Cát (hợp việc buổi chiều) — tốt cho việc riêng tư, nội bộ.",
  "Câu Trận": "Hung — dễ tranh chấp đất đai, kiện tụng.",
};

// Nhị Thập Bát Tú — 28 sao, thứ tự cố định, lặp lại mỗi 28 ngày (không phụ thuộc tháng/năm).
// Neo (anchor) đã đối chiếu thực tế: 25/7/2026 (jd 2461247) là Sao Đê -> index 2.
export const STAR28_LIST = [
  "Giác", "Cang", "Đê", "Phòng", "Tâm", "Vĩ", "Cơ",
  "Đẩu", "Ngưu", "Nữ", "Hư", "Nguy", "Thất", "Bích",
  "Khuê", "Lâu", "Vị", "Mão", "Tất", "Chủy", "Sâm",
  "Tỉnh", "Quỷ", "Liễu", "Tinh", "Trương", "Dực", "Chẩn",
];
// Cát (tốt) / Hung (xấu) — tổng hợp từ nhiều nguồn, đã ưu tiên nguồn có đối chiếu thực tế
// cho sao Đê (đổi thành "xấu" dù 1 vài nguồn xếp "bình/tốt" — xem ghi chú trong sổ kế hoạch).
export const STAR28_GOOD = [
  true, false, false, true, false, true, false, // Giác Cang Đê Phòng Tâm Vĩ Cơ
  true, false, false, false, false, true, true, // Đẩu Ngưu Nữ Hư Nguy Thất Bích
  true, true, true, false, true, false, true, // Khuê Lâu Vị Mão Tất Chủy Sâm
  true, false, false, false, true, false, true, // Tỉnh Quỷ Liễu Tinh Trương Dực Chẩn
];
const STAR28_ANCHOR_JD = 2461247;
const STAR28_ANCHOR_INDEX = 2;

// Giờ Hoàng Đạo theo ngày — 6 nhóm ngày Chi đối xung (Tý-Ngọ, Sửu-Mùi, Dần-Thân,
// Mão-Dậu, Thìn-Tuất, Tỵ-Hợi), mỗi nhóm có 6/12 giờ Địa Chi là Hoàng Đạo (giờ tốt).
// Bảng phổ biến trong lịch vạn niên, đối chiếu khớp giữa nhiều nguồn (kể cả giải mã
// đúng câu thơ lục bát dân gian cho nhóm Dần-Thân: "...Đi Đứng...Đến Đâu...Được...Đốn...").
const GIO_HOANG_DAO_GROUPS = [
  [0, 1, 3, 6, 8, 9], // Tý, Ngọ → giờ tốt: Tý Sửu Mão Ngọ Thân Dậu
  [2, 3, 5, 8, 10, 11], // Sửu, Mùi → giờ tốt: Dần Mão Tỵ Thân Tuất Hợi
  [0, 1, 4, 5, 7, 10], // Dần, Thân → giờ tốt: Tý Sửu Thìn Tỵ Mùi Tuất
  [0, 2, 3, 6, 7, 9], // Mão, Dậu → giờ tốt: Tý Dần Mão Ngọ Mùi Dậu
  [2, 4, 5, 8, 9, 11], // Thìn, Tuất → giờ tốt: Dần Thìn Tỵ Thân Dậu Hợi
  [1, 4, 6, 7, 10, 11], // Tỵ, Hợi → giờ tốt: Sửu Thìn Ngọ Mùi Tuất Hợi
];

export function getGioHoangDao(chiDayIndex) {
  const goodSet = new Set(GIO_HOANG_DAO_GROUPS[chiDayIndex % 6]);
  return GIO_CHI_LIST.map((g) => ({ ...g, chi: CHI[g.idx], good: goodSet.has(g.idx) }));
}

// Tứ Ly (đúng ngày Xuân/Thu phân, Hạ/Đông chí) và Tứ Tuyệt (ngày liền trước Lập
// Xuân/Hạ/Thu/Đông) — suy trực tiếp từ tiết khí đã có, không cần dữ liệu mới.
const TU_LY_KHI = ["Xuân phân", "Hạ chí", "Thu phân", "Đông chí"];
const TU_TUYET_KHI = ["Lập xuân", "Lập hạ", "Lập thu", "Lập đông"];

function getTuLyTuTuyet(jd) {
  const today = getTietKhi(jd);
  if (TU_LY_KHI.includes(today) && getTietKhi(jd - 1) !== today) {
    return { type: "Tứ Ly", khi: today };
  }
  const tomorrow = getTietKhi(jd + 1);
  if (tomorrow !== today && TU_TUYET_KHI.includes(tomorrow)) {
    return { type: "Tứ Tuyệt", khi: tomorrow };
  }
  return null;
}

// Can tháng âm lịch — phép "Ngũ Hổ Độn": Can tháng Giêng (kiến Dần) suy từ Can năm,
// công thức chuẩn không dị bản (khác các mục "theo tuổi" khác trong app). Chi tháng
// dùng lại đúng `kienChiIndex` đã tính sẵn cho Trực (tháng 1 âm = kiến Dần).
function getCanMonthIndex(canYearIndex, lunarMonth) {
  const canThangGiengIndex = ((canYearIndex % 5) * 2 + 2) % 10;
  return (((canThangGiengIndex + (lunarMonth - 1)) % 10) + 10) % 10;
}

export function computeDayInfo(dd, mm, yy) {
  const lunar = convertSolar2Lunar(dd, mm, yy);
  const jd = lunar.jd;
  const canDayIndex = (((jd + 9) % 10) + 10) % 10;
  const chiDayIndex = (((jd + 1) % 12) + 12) % 12;
  const canYearIndex = (((lunar.lunarYear + 6) % 10) + 10) % 10;
  const chiYearIndex = (((lunar.lunarYear + 8) % 12) + 12) % 12;

  const kienChiIndex = (((lunar.lunarMonth + 1) % 12) + 12) % 12;
  const trucIndex = ((chiDayIndex - kienChiIndex) % 12 + 12) % 12;
  const truc = TRUC_LIST[trucIndex];

  const thanhLongChiIndex = (((lunar.lunarMonth - 1) % 6 + 6) % 6) * 2;
  const starIndex = ((chiDayIndex - thanhLongChiIndex) % 12 + 12) % 12;
  const star = STAR_LIST[starIndex];
  const isHoangDao = STAR_GOOD[starIndex];

  const star28Index = ((jd - STAR28_ANCHOR_JD + STAR28_ANCHOR_INDEX) % 28 + 28) % 28;
  const star28 = STAR28_LIST[star28Index];
  const star28Good = STAR28_GOOD[star28Index];

  const tietKhi = getTietKhi(jd);
  const tuLyTuTuyet = getTuLyTuTuyet(jd);

  const canMonthIndex = getCanMonthIndex(canYearIndex, lunar.lunarMonth);
  const chiMonthIndex = kienChiIndex;

  return {
    solarDay: dd,
    solarMonth: mm,
    solarYear: yy,
    lunarDay: lunar.lunarDay,
    lunarMonth: lunar.lunarMonth,
    lunarYear: lunar.lunarYear,
    lunarLeap: lunar.lunarLeap === 1,
    canDayIndex,
    chiDayIndex,
    canDayName: CAN[canDayIndex],
    chiDayName: CHI[chiDayIndex],
    canChiDay: `${CAN[canDayIndex]} ${CHI[chiDayIndex]}`,
    canChiMonth: `${CAN[canMonthIndex]} ${CHI[chiMonthIndex]}`,
    canChiYear: `${CAN[canYearIndex]} ${CHI[chiYearIndex]}`,
    truc,
    star,
    isHoangDao,
    star28,
    star28Good,
    tuLyTuTuyet,
    tietKhi,
  };
}
