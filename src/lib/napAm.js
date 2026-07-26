/* ============================================================
   NGŨ HÀNH NẠP ÂM — 60 Hoa Giáp. Mỗi cặp Can-Chi âm/dương liền
   nhau (vd. Giáp Tý & Ất Sửu) dùng chung 1 tên nạp âm, xoay vòng
   60 năm. Bảng đã đối chiếu qua nhiều nguồn (xem "Nguồn tham khảo").
   ============================================================ */

const NAP_AM_LIST = [
  { name: "Hải Trung Kim", element: "Kim" },
  { name: "Lô Trung Hỏa", element: "Hỏa" },
  { name: "Đại Lâm Mộc", element: "Mộc" },
  { name: "Lộ Bàng Thổ", element: "Thổ" },
  { name: "Kiếm Phong Kim", element: "Kim" },
  { name: "Sơn Đầu Hỏa", element: "Hỏa" },
  { name: "Giản Hạ Thủy", element: "Thủy" },
  { name: "Thành Đầu Thổ", element: "Thổ" },
  { name: "Bạch Lạp Kim", element: "Kim" },
  { name: "Dương Liễu Mộc", element: "Mộc" },
  { name: "Tuyền Trung Thủy", element: "Thủy" },
  { name: "Ốc Thượng Thổ", element: "Thổ" },
  { name: "Tích Lịch Hỏa", element: "Hỏa" },
  { name: "Tùng Bách Mộc", element: "Mộc" },
  { name: "Trường Lưu Thủy", element: "Thủy" },
  { name: "Sa Trung Kim", element: "Kim" },
  { name: "Sơn Hạ Hỏa", element: "Hỏa" },
  { name: "Bình Địa Mộc", element: "Mộc" },
  { name: "Bích Thượng Thổ", element: "Thổ" },
  { name: "Kim Bạc Kim", element: "Kim" },
  { name: "Phúc Đăng Hỏa", element: "Hỏa" },
  { name: "Thiên Hà Thủy", element: "Thủy" },
  { name: "Đại Dịch Thổ", element: "Thổ" },
  { name: "Thoa Xuyến Kim", element: "Kim" },
  { name: "Tang Đố Mộc", element: "Mộc" },
  { name: "Đại Khê Thủy", element: "Thủy" },
  { name: "Sa Trung Thổ", element: "Thổ" },
  { name: "Thiên Thượng Hỏa", element: "Hỏa" },
  { name: "Thạch Lựu Mộc", element: "Mộc" },
  { name: "Đại Hải Thủy", element: "Thủy" },
];

// Vị trí trong chu kỳ 60 năm là nghiệm duy nhất của (pos%10===canIdx, pos%12===chiIdx).
// Mỗi nạp âm phủ đúng 2 năm liên tiếp trong chu kỳ đó → index nạp âm = floor(pos/2).
export function getNapAm(canIdx, chiIdx) {
  for (let pos = 0; pos < 60; pos++) {
    if (pos % 10 === canIdx && pos % 12 === chiIdx) {
      return NAP_AM_LIST[Math.floor(pos / 2)];
    }
  }
  return null;
}

// Màu hợp/kỵ theo Ngũ Hành tương sinh/tương khắc — kiến thức Ngũ Hành phổ thông, không dị bản.
export const MENH_COLORS = {
  Kim: { hop: ["Trắng", "Ghi/Xám", "Vàng đất"], ky: ["Đỏ", "Cam", "Hồng"] },
  Mộc: { hop: ["Xanh lá", "Đen", "Xanh dương"], ky: ["Trắng", "Ghi/Xám"] },
  Thủy: { hop: ["Đen", "Xanh dương", "Trắng", "Ghi/Xám"], ky: ["Vàng đất", "Nâu"] },
  Hỏa: { hop: ["Đỏ", "Cam", "Hồng", "Xanh lá"], ky: ["Đen", "Xanh dương"] },
  Thổ: { hop: ["Vàng đất", "Nâu", "Đỏ", "Cam"], ky: ["Xanh lá"] },
};
