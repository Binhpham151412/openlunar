/* ============================================================
   NGUỒN THAM KHẢO — minh bạch hoá logic tính toán cho người dùng.
   Mỗi mục có `confidence`:
   - "verified": có nguồn cụ thể, kiểm chứng được (link, sách rõ ràng).
   - "traditional": bắt nguồn từ một hệ thống cổ điển có tên sách rõ,
     nhưng bản thân hệ thống đó có nhiều dị bản giữa các phái/nguồn.
   - "unverified": phổ biến trong lịch vạn niên hiện đại Việt Nam,
     nhưng KHÔNG tìm được sách gốc/nguồn chính xác — chỉ nên tham khảo.
   ============================================================ */

export const SOURCE_GROUPS = [
  {
    title: "Chuyển đổi dương lịch ↔ âm lịch",
    items: [
      {
        id: "amlich",
        name: "Thuật toán tính âm lịch Việt Nam",
        confidence: "verified",
        source: "Hồ Ngọc Đức (Đại học Leipzig, Đức)",
        link: "https://www.informatik.uni-leipzig.de/~duc/amlich/",
        note:
          "Thuật toán thiên văn tính điểm Sóc (New Moon) và tháng nhuận dựa trên kinh tuyến 105°Đ (giờ Việt Nam). Đây là thuật toán được dùng rộng rãi nhất trong các phần mềm lịch Việt Nam, sai số điểm Sóc dưới 2 phút. Tác giả khuyến cáo nên đối chiếu lại với lịch chính thức của nhà nước hàng năm vì các phương pháp tính gần đúng có thể lệch 1 ngày ở một số thời điểm biên.",
      },
      {
        id: "tietkhi",
        name: "24 Tiết khí",
        confidence: "verified",
        source: "Thiên văn học cổ điển Á Đông (chia đều theo kinh độ mặt trời, mỗi tiết 15°)",
        note:
          "Dùng lại đúng phép tính kinh độ mặt trời trong thuật toán Hồ Ngọc Đức ở trên, chỉ chia mịn hơn (24 phần thay vì 12). Đây là hệ thống thiên văn khách quan, không có dị bản.",
      },
      {
        id: "canchi",
        name: "Hệ Can Chi (Lục Thập Hoa Giáp)",
        confidence: "verified",
        source: "Hệ đếm ngày/năm cổ điển Á Đông, có từ hàng nghìn năm",
        note:
          "10 Can + 12 Chi ghép chu kỳ 60, dùng để gọi tên ngày/năm. Tính trực tiếp từ số ngày Julian nên không có dị bản.",
      },
    ],
  },
  {
    title: "Trực, Sao Hoàng Đạo/Hắc Đạo, Giờ Hoàng Đạo",
    items: [
      {
        id: "truc",
        name: "12 Trực (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế)",
        confidence: "traditional",
        source: "Hiệp Kỷ Biện Phương Thư (協紀辨方書) — sách trạch cát kinh điển đời Thanh, soạn dưới thời vua Càn Long",
        note:
          "Bản tiếng Việt phổ biến: 'Hiệp Kỷ Biện Phương Thư' do Mai Cốc Thành biên dịch. Đây là sách nền tảng cho hầu hết các hệ thống lịch trạch cát (chọn ngày giờ) tại Việt Nam và Trung Quốc từ thời Càn Long đến nay, nhưng bản thân ngành trạch cát có nhiều trường phái nên cách diễn giải chi tiết có thể khác nhau giữa các nguồn.",
      },
      {
        id: "saohoangdao",
        name: "12 Sao Hoàng Đạo/Hắc Đạo (Thanh Long, Minh Đường... / Thiên Hình, Chu Tước...)",
        confidence: "traditional",
        source: "Cùng hệ Hiệp Kỷ Biện Phương Thư",
        note: "6 sao Hoàng Đạo (cát) và 6 sao Hắc Đạo (hung) luân phiên theo tháng và ngày.",
      },
      {
        id: "giohoangdao",
        name: "Giờ Hoàng Đạo trong ngày (6 nhóm ngày Chi đối xung)",
        confidence: "traditional",
        source: "Cùng hệ trạch cát cổ điển; đối chiếu qua nhiều trang lịch vạn niên hiện đại",
        note:
          "Trước khi đưa vào code, đã đối chiếu bảng giờ tốt của 2 nguồn độc lập và giải mã đúng câu thơ lục bát dân gian cho nhóm ngày Dần-Thân để xác nhận khớp (xem DECISIONS.md trong mã nguồn).",
      },
      {
        id: "sao28",
        name: "Nhị Thập Bát Tú (28 sao)",
        confidence: "unverified",
        source: "Hệ 28 sao (nhị thập bát tú) trong thiên văn cổ Á Đông — có trước Hiệp Kỷ Biện Phương Thư hàng thế kỷ",
        note:
          "⚠️ Bảng phân loại tốt/xấu cho từng sao có khá nhiều dị bản giữa các nguồn hiện đại, chưa tìm được một bản gốc thống nhất. Nên xem đây là yếu tố tham khảo thêm, độ tin cậy thấp hơn Trực/Sao Hoàng Đạo.",
      },
    ],
  },
  {
    title: "Ngày kiêng kỵ cố định theo âm lịch",
    items: [
      {
        id: "tamnuong",
        name: "Tam Nương (mùng 3, 7, 13, 18, 22, 27 âm lịch)",
        confidence: "unverified",
        source: "Truyền thuyết dân gian Á Đông",
        note:
          "Gắn với truyền thuyết 3 người phụ nữ bị coi là điềm gở (dị bản Việt Nam: 3 tiên nữ nhà trời; dị bản Trung Quốc: Muội Hỉ, Đát Kỷ, Bao Tự). Không tìm được một văn bản gốc cụ thể — đây là quy tắc truyền miệng phổ biến khắp lịch vạn niên hiện đại.",
      },
      {
        id: "nguyetky",
        name: "Nguyệt Kỵ (mùng 5, 14, 23 âm lịch)",
        confidence: "unverified",
        source: "Truyền thuyết/quan niệm dân gian (các chữ số cộng lại bằng 5)",
        note: "Tương tự Tam Nương — phổ biến trong dân gian nhưng chưa xác định được nguồn gốc văn bản cụ thể.",
      },
      {
        id: "duongcongky",
        name: "Dương Công Kỵ Nhật (13 ngày cố định trong năm)",
        confidence: "unverified",
        source: "Thường được dẫn theo 'Ngọc Hạp Thông Thư' trong các lịch vạn niên hiện đại",
        note: "⚠️ Chưa kiểm chứng độc lập được đúng nguyên bản 'Ngọc Hạp Thông Thư' — đây là ghi nhận phổ biến, chưa xác minh 100%.",
      },
      {
        id: "satchu",
        name: "Sát Chủ (Âm/Dương, theo Chi của ngày và tháng âm)",
        confidence: "unverified",
        source: "Phổ biến trong lịch vạn niên hiện đại, thường gắn với hệ 'Thông Thư'",
        note: "⚠️ Chưa xác minh được nguồn gốc chính xác — tương tự Dương Công Kỵ Nhật.",
      },
      {
        id: "khongphong",
        name: "Không Phòng (theo mùa, chỉ kỵ cưới hỏi)",
        confidence: "unverified",
        source: "Bài thơ dân gian truyền miệng ('Xuân Long-Xà-Thử, Hạ Khuyển-Trư-Dương...')",
        note: "Chưa tìm được văn bản gốc — phổ biến trong dân gian miền Bắc/Trung Việt Nam.",
      },
    ],
  },
  {
    title: "Theo tuổi gia chủ",
    items: [
      {
        id: "kimlau",
        name: "Kim Lâu (tuổi mụ chia dư cho 9: dư 1, 3, 6, 8)",
        confidence: "traditional",
        source: "'Thông Thư' (cổ thư Trung Hoa) — theo nhiều tài liệu dân gian dẫn lại",
        note: "Công thức dân gian phổ biến nhất: 'một, ba, sáu, tám thị Kim Lâu'.",
      },
      {
        id: "tamtai",
        name: "Tam Tai (3 năm liên tiếp theo nhóm Tam Hợp của Chi năm sinh)",
        confidence: "traditional",
        source: "Hệ Tam Hợp (Thân-Tý-Thìn, Dần-Ngọ-Tuất, Tỵ-Dậu-Sửu, Hợi-Mão-Mùi) trong tử vi/phong thủy cổ điển",
        note: "Bản thân khái niệm Tam Hợp Chi là kiến thức tử vi cổ điển được ghi nhận rộng rãi, ít dị bản hơn các mục 'unverified' ở trên.",
      },
      {
        id: "hoangoc",
        name: "Hoang Ốc (6 cung lặp lại mỗi 10 tuổi)",
        confidence: "unverified",
        source: "Tài liệu trạch cát dân gian, không rõ văn bản gốc",
        note:
          "⚠️ Công thức trong code đã tự đối chiếu khớp 3 ví dụ tra cứu thực tế (tuổi 35, 45, 47) khi xây dựng, nhưng có thể vẫn còn dị bản ở gia đình/vùng miền khác — nên đối chiếu thêm nếu có bảng tra khác.",
      },
      {
        id: "saohan",
        name: "Sao hạn hàng năm (9 sao Cửu Diệu, thứ tự khác nhau giữa Nam/Nữ)",
        confidence: "traditional",
        source: "Hệ Cửu Diệu tinh quân (9 sao: La Hầu, Thổ Tú, Thủy Diệu, Thái Bạch, Thái Dương, Vân Hớn, Kế Đô, Thái Âm, Mộc Đức) — phổ biến trong tục 'cúng sao giải hạn' đầu năm",
        note:
          "Bảng thứ tự sao theo tuổi (khác nhau hoàn toàn giữa Nam/Nữ) đã đối chiếu khớp qua 2 nguồn độc lập và 3 ví dụ tính tay trước khi đưa vào code. Riêng phần 'năm tuổi nặng đặc biệt' (thường gắn thêm sao Thái Tuế) các nguồn không thống nhất chính xác những năm nào nên chưa đưa vào — chỉ tính sao theo chu kỳ 9 năm cơ bản.",
      },
    ],
  },
  {
    title: "Công cụ Phong Thủy (Mệnh, tuổi hợp, hướng nhà)",
    items: [
      {
        id: "napam",
        name: "Ngũ Hành Nạp Âm (60 Hoa Giáp)",
        confidence: "verified",
        source: "Hệ 60 Hoa Giáp cổ điển Á Đông — bảng nạp âm cố định, không dị bản",
        note:
          "30 tên nạp âm (Hải Trung Kim, Lộ Bàng Thổ...), mỗi tên phủ đúng 2 năm Can-Chi liên tiếp (1 Âm 1 Dương). Bảng đã đối chiếu qua nhiều nguồn độc lập và tự kiểm chứng bằng công thức trong code trước khi dùng.",
      },
      {
        id: "tuoihop",
        name: "Xem tuổi hợp (Thiên Can Ngũ Hợp, Địa Chi Tam Hợp/Lục Hợp/Tứ Hành Xung/Lục Hại)",
        confidence: "traditional",
        source: "Kiến thức Can Chi/Ngũ Hành cổ điển, phổ biến rộng rãi trong tử vi Á Đông",
        note:
          "Các bảng Tam Hợp, Lục Hợp, Tứ Hành Xung, Lục Hại, Ngũ Hợp Thiên Can là kiến thức nền tảng ít dị bản. Tuy nhiên cách GỘP nhiều lớp xét thành 1 kết luận duy nhất không có công thức chuẩn thống nhất — app chỉ đưa ra gợi ý tổng quan dựa trên đếm số yếu tố tốt/xấu, không phải một điểm số khoa học.",
      },
      {
        id: "battrach",
        name: "Hướng nhà/bếp — Cung Phi & Bát Trạch Du Niên",
        confidence: "traditional",
        source: "Phong thủy Bát Trạch cổ điển (bát quái Hậu Thiên + phép biến hào Du Niên)",
        note:
          "Công thức tính Cung Phi từ năm sinh có vài dị bản nhỏ giữa các nguồn (đã chọn phiên bản khớp với nhiều ví dụ đối chiếu thực tế). Thuật toán 8 hướng tốt/xấu (Sinh Khí, Diên Niên, Thiên Y, Phục Vị / Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại) dùng đúng phép 'Du Niên Biến Quái' cổ điển, đã tự đối chiếu khớp từng bước với ví dụ mẫu (quẻ Khôn → Cấn → Tốn → Càn) trước khi đưa vào code.",
      },
    ],
  },
  {
    title: "Công cụ riêng & thông tin hiển thị",
    items: [
      {
        id: "trungtang",
        name: "Trùng Tang (dùng ngày giờ mất)",
        confidence: "unverified",
        source: "Có nhiều trường phái tính khác nhau giữa các thầy phong thủy",
        note: "⚠️ Độ tin cậy thấp nhất trong toàn bộ app — chỉ mang tính tham khảo, không nên dùng để quyết định một mình cho việc tang lễ.",
      },
      {
        id: "holidays",
        name: "Ngày lễ/Tết, mùng 1, Rằm",
        confidence: "verified",
        source: "Ngày lễ chính thức Việt Nam (dương lịch) + ngày lễ truyền thống/Phật giáo phổ biến (âm lịch: Tết Nguyên Đán, Trung Thu, Vu Lan...)",
        note: "Chỉ mang tính hiển thị thông tin, không được gộp vào logic chấm điểm tốt/xấu.",
      },
    ],
  },
];
