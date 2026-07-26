import { Heart, Home, Store, Compass, Flower2, KeyRound, Handshake } from "lucide-react";

/* ============================================================
   DỮ LIỆU CÁC "YẾU TỐ" NGÀY TỐT/XẤU (Nhóm A — theo ngày)
   ============================================================ */

const SATCHU_DUONG = { 1: 0, 2: 1, 3: 1, 4: 10, 5: 4, 6: 4, 7: 1, 8: 4, 9: 1, 10: 4, 11: 7, 12: 4 };
const SATCHU_AM = { 1: 5, 2: 0, 3: 7, 4: 3, 5: 8, 6: 10, 7: 11, 8: 1, 9: 6, 10: 9, 11: 2, 12: 4 };
const DUONGCONGKY = [
  [1, 13], [2, 11], [3, 9], [4, 7], [5, 5], [6, 3],
  [7, 8], [7, 29], [8, 27], [9, 25], [10, 23], [11, 21], [12, 19],
];

// Không Phòng — bài thơ dân gian: "Xuân: Long-Xà-Thử; Hạ: Khuyển-Trư-Dương;
// Thu: Thố-Mã-Hổ; Đông: Kê-Ngưu-Hầu" (đổi tên con giáp -> Chi).
// Mùa tính theo tháng âm lịch: Xuân 1-3, Hạ 4-6, Thu 7-9, Đông 10-12.
function getKhongPhongSeason(lunarMonth) {
  if (lunarMonth >= 1 && lunarMonth <= 3) return { season: "Xuân", chiIdx: [4, 5, 0], poem: "Xuân: Long – Xà – Thử kỵ Không Phòng" };
  if (lunarMonth >= 4 && lunarMonth <= 6) return { season: "Hạ", chiIdx: [10, 11, 7], poem: "Hạ: Khuyển – Trư – Dương phá bại vong" };
  if (lunarMonth >= 7 && lunarMonth <= 9) return { season: "Thu", chiIdx: [3, 6, 2], poem: "Thu: Thố – Mã – Hổ phùng đại kỵ" };
  return { season: "Đông", chiIdx: [9, 1, 8], poem: "Đông: Kê – Ngưu – Hầu thị tán không" };
}

export const OCCASIONS = [
  { id: "cuoi", label: "Cưới hỏi", icon: Heart },
  { id: "tang", label: "Tang lễ", icon: Flower2 },
  { id: "nha", label: "Làm nhà / Động thổ", icon: Home },
  { id: "nhaptrach", label: "Nhập trạch", icon: KeyRound },
  { id: "khaitruong", label: "Khai trương", icon: Store },
  { id: "giaodich", label: "Ký kết / Giao dịch", icon: Handshake },
  { id: "xuathanh", label: "Xuất hành", icon: Compass },
];
const ALL_OCCASIONS = OCCASIONS.map((o) => o.id);

export const RULES = [
  {
    id: "tamnuong",
    name: "Tam Nương",
    badFor: ALL_OCCASIONS,
    check: (d) => [3, 7, 13, 18, 22, 27].includes(d.lunarDay),
    explain: (d) =>
      `Ngày ${d.lunarDay} âm lịch nằm trong 6 ngày Tam Nương của tháng (mùng 3, 7, 13, 18, 22, 27 âm lịch). Dân gian cho rằng đây là ngày của 3 cô gái nhà trời xuống thử lòng người, nên tránh khởi sự việc lớn.`,
  },
  {
    id: "nguyetky",
    name: "Nguyệt Kỵ",
    badFor: ["cuoi", "khaitruong", "xuathanh", "nha", "nhaptrach", "giaodich"],
    check: (d) => [5, 14, 23].includes(d.lunarDay),
    explain: (d) =>
      `Ngày ${d.lunarDay} âm lịch thuộc nhóm Nguyệt Kỵ (mùng 5, 14, 23 — các chữ số cộng lại đều bằng 5). Dân gian gọi là ngày "nửa đời nửa đoạn", việc gì cũng dễ dở dang, đặc biệt kỵ xuất hành.`,
  },
  {
    id: "duongcongky",
    name: "Dương Công Kỵ Nhật",
    badFor: ALL_OCCASIONS,
    check: (d) => DUONGCONGKY.some(([m, day]) => m === d.lunarMonth && day === d.lunarDay),
    explain: () =>
      `Đây là 1 trong 13 ngày Dương Công Kỵ Nhật cố định trong năm âm lịch (theo Ngọc Hạp Thông Thư) — nhóm ngày đại kỵ mọi việc lớn: cưới hỏi, động thổ, khai trương, ký kết.`,
  },
  {
    id: "satchuduong",
    name: "Sát Chủ (Dương)",
    badFor: ["cuoi", "khaitruong", "nha", "xuathanh", "nhaptrach", "giaodich"],
    check: (d) => SATCHU_DUONG[d.lunarMonth] === d.chiDayIndex,
    explain: (d) =>
      `Ngày Chi "${d.chiDayName}" trùng ngày Sát Chủ Dương quy định cho tháng ${d.lunarMonth} âm lịch — xấu cho việc "dương thế": cưới hỏi, khai trương, mua xe, làm nhà, thôi nôi.`,
  },
  {
    id: "satchuam",
    name: "Sát Chủ (Âm)",
    badFor: ["tang"],
    check: (d) => SATCHU_AM[d.lunarMonth] === d.chiDayIndex,
    explain: (d) =>
      `Ngày Chi "${d.chiDayName}" trùng ngày Sát Chủ Âm của tháng ${d.lunarMonth} âm lịch — chỉ xấu cho việc tâm linh: an táng, nhập quan, cải táng, bốc mộ, đặt bàn thờ.`,
  },
  {
    id: "trucpha",
    name: "Trực Phá",
    badFor: ALL_OCCASIONS,
    check: (d) => d.truc === "Phá",
    explain: () =>
      `Ngày mang Trực Phá (sao Nguyệt Phá chiếu) trong hệ Thập Nhị Kiến Trừ — xấu gần như mọi việc lớn, đặc biệt kỵ cưới hỏi và ký kết.`,
  },
  {
    id: "truckien",
    name: "Trực Kiến (kỵ động thổ)",
    badFor: ["nha"],
    check: (d) => d.truc === "Kiến",
    explain: () =>
      `Ngày mang Trực Kiến — tốt cho làm việc thiện, trồng cây nhưng theo dân gian kỵ động thổ, đào giếng, khởi công xây cất.`,
  },
  {
    id: "trucman",
    name: "Trực Mãn (kỵ an táng)",
    badFor: ["tang"],
    check: (d) => d.truc === "Mãn",
    explain: () =>
      `Ngày mang Trực Mãn — tốt cho cúng lễ, sửa kho nhưng theo dân gian xấu cho chôn cất và kiện tụng.`,
  },
  {
    id: "hacdao",
    name: "Ngày Hắc Đạo",
    badFor: ALL_OCCASIONS,
    check: (d) => !d.isHoangDao,
    explain: (d) =>
      `Sao "${d.star}" trực ngày hôm nay thuộc nhóm Hắc Đạo (6 hung tinh: Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Nguyên Vũ, Câu Trận). Theo quan niệm dân gian, việc lớn làm ngày Hắc Đạo dễ trắc trở hơn ngày Hoàng Đạo.`,
  },
  {
    id: "khongphong",
    name: "Không Phòng",
    badFor: ["cuoi"],
    check: (d) => {
      const s = getKhongPhongSeason(d.lunarMonth);
      return s.chiIdx.includes(d.chiDayIndex);
    },
    explain: (d) => {
      const s = getKhongPhongSeason(d.lunarMonth);
      return `Đang ở mùa ${s.season} (tháng ${d.lunarMonth} âm lịch), ngày Chi "${d.chiDayName}" rơi đúng nhóm kỵ Không Phòng theo bài thơ dân gian: "${s.poem}". Chỉ kỵ việc cưới hỏi, thành thân, kê giường cưới — không kỵ ăn hỏi hay việc khác.`;
    },
  },
  {
    id: "sao28xau",
    name: "Sao xấu (Nhị Thập Bát Tú)",
    badFor: ALL_OCCASIONS,
    check: (d) => !d.star28Good,
    explain: (d) =>
      `Ngày do sao "${d.star28}" trực nhật trong hệ 28 sao (Nhị Thập Bát Tú), thuộc nhóm sao được xếp vào loại xấu/hung trong bảng tổng hợp. Lưu ý: hệ thống này có khá nhiều dị bản giữa các nguồn, nên xem là tham khảo thêm, không chắc chắn bằng các yếu tố khác.`,
  },
  {
    id: "tulytutuyet",
    name: "Tứ Ly / Tứ Tuyệt",
    badFor: ALL_OCCASIONS,
    check: (d) => !!d.tuLyTuTuyet,
    explain: (d) =>
      d.tuLyTuTuyet.type === "Tứ Ly"
        ? `Hôm nay đúng ngày "${d.tuLyTuTuyet.khi}" — 1 trong 4 mốc chia mùa (Xuân/Thu phân, Hạ/Đông chí), gọi là ngày Tứ Ly. Dân gian coi đây là ngày "ly tán", khí tiết giao thoa bất định, kỵ khởi sự việc lớn.`
        : `Ngày mai bước sang tiết "${d.tuLyTuTuyet.khi}" (1 trong 4 tiết lập mùa) — hôm nay là ngày liền trước, gọi là ngày Tứ Tuyệt. Dân gian coi đây là ngày khí cũ sắp dứt, khí mới chưa tới, kỵ khởi sự việc lớn.`,
  },
];
