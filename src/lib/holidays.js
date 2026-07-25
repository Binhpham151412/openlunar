/* ============================================================
   NGÀY LỄ / TẾT, MÙNG 1, RẰM — chỉ hiển thị thông tin, KHÔNG
   gộp vào logic chấm điểm tốt/xấu để tránh lẫn lộn phong tục.
   ============================================================ */

const SOLAR_HOLIDAYS = {
  "1-1": "Tết Dương lịch",
  "3-8": "Quốc tế Phụ nữ",
  "4-30": "Giải phóng miền Nam",
  "5-1": "Quốc tế Lao động",
  "6-1": "Quốc tế Thiếu nhi",
  "9-2": "Quốc khánh",
  "10-20": "Phụ nữ Việt Nam",
  "11-20": "Nhà giáo Việt Nam",
};

const LUNAR_HOLIDAYS = {
  "1-1": "Tết Nguyên Đán",
  "1-15": "Tết Nguyên Tiêu",
  "3-10": "Giỗ Tổ Hùng Vương",
  "5-5": "Tết Đoan Ngọ",
  "7-15": "Lễ Vu Lan",
  "8-15": "Tết Trung Thu",
  "12-23": "Ông Công Ông Táo",
};

export function getHolidayLabels(info) {
  const labels = [];
  const solarKey = `${info.solarMonth}-${info.solarDay}`;
  if (SOLAR_HOLIDAYS[solarKey]) labels.push(SOLAR_HOLIDAYS[solarKey]);

  const lunarKey = `${info.lunarMonth}-${info.lunarDay}`;
  const specificLunarHoliday = !info.lunarLeap && LUNAR_HOLIDAYS[lunarKey];
  if (specificLunarHoliday) {
    labels.push(specificLunarHoliday);
  } else if (info.lunarDay === 1) {
    labels.push("Mùng 1 âm lịch");
  } else if (info.lunarDay === 15) {
    labels.push("Rằm");
  }

  return labels;
}
