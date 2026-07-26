/* ============================================================
   SAO HẠN HÀNG NĂM (Cửu Diệu) — 9 sao luân phiên theo chu kỳ 9 năm,
   thứ tự sao khác nhau hoàn toàn giữa Nam và Nữ ở cùng độ tuổi.
   Đã đối chiếu qua 2 nguồn độc lập, khớp cả 3 ví dụ tính tay
   (Nam 39 tuổi/Thủy Diệu, 48 tuổi/Thủy Diệu-Nữ Mộc Đức, Nam 31
   tuổi/Thái Bạch-Nữ Thái Âm) trước khi đưa vào code.
   ============================================================ */

const SAO_NAM = ["La Hầu", "Thổ Tú", "Thủy Diệu", "Thái Bạch", "Thái Dương", "Vân Hớn", "Kế Đô", "Thái Âm", "Mộc Đức"];
const SAO_NU = ["Kế Đô", "Vân Hớn", "Mộc Đức", "Thái Âm", "Thổ Tú", "La Hầu", "Thái Dương", "Thái Bạch", "Thủy Diệu"];

const SAO_INFO = {
  "La Hầu": {
    level: "xau",
    desc: "Hung tinh — dễ gặp tai tiếng, thị phi, bệnh tật. Nặng nhất trong 3 sao xấu đối với nam giới.",
  },
  "Kế Đô": {
    level: "xau",
    desc: "Hung tinh — dễ gặp tai tiếng, thị phi, hao tài. Nặng nhất trong 3 sao xấu đối với nữ giới.",
  },
  "Thái Bạch": { level: "xau", desc: "Hung tinh — dễ hao tài, mất của, kiện tụng, thị phi." },
  "Vân Hớn": { level: "trung", desc: "Sao trung bình — dễ nóng nảy, xung đột nhỏ, nên chú ý sức khoẻ." },
  "Thổ Tú": { level: "trung", desc: "Sao trung bình — công việc dễ trì trệ, chậm chạp." },
  "Thủy Diệu": { level: "trung", desc: "Sao trung bình — có thể gặp chuyện không may nhỏ, nhìn chung ổn." },
  "Thái Dương": { level: "tot", desc: "Cát tinh — tốt cho công danh sự nghiệp, đặc biệt lợi cho nam giới." },
  "Thái Âm": { level: "tot", desc: "Cát tinh — tốt cho tài lộc, bình an, đặc biệt lợi cho nữ giới." },
  "Mộc Đức": { level: "tot", desc: "Cát tinh — mang lại may mắn, phúc lộc, ít tai ương." },
};

export function getSaoHan(birthYear, viewYear, gender) {
  const tuoiMu = viewYear - birthYear + 1;
  if (tuoiMu <= 0) return null;
  const idx = (((tuoiMu - 1) % 9) + 9) % 9;
  const sao = gender === "nam" ? SAO_NAM[idx] : SAO_NU[idx];
  return { tuoiMu, sao, ...SAO_INFO[sao] };
}
