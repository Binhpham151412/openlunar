# Logic tính ngày tốt/xấu — tài liệu để bàn luận & cập nhật

Tài liệu này mô tả **toàn bộ logic đang chạy trong code**, viết bằng lời để cả nhà cùng xem và góp ý.
Khi cần đổi gì, chỉ cần sửa trực tiếp vào file này (đổi số, đổi điều kiện, ghi chú ý kiến...) rồi đưa lại — code sẽ được cập nhật khớp với mô tả mới.

Mỗi mục có `id` — đây là mã định danh khớp với code (`src/lib/rules.js`, `src/lib/ageRules.js`...), giữ nguyên `id` khi góp ý để dễ đối chiếu.

---

## 1. Nhóm A — Quy tắc chấm điểm theo NGÀY (bật/tắt được, áp cho từng việc)

Đây là nhóm quyết định một ngày tô **đỏ** (xấu, nên tránh) hay **vàng** (có yếu tố xấu nhưng không phạm vào việc đang chọn) hay **không màu** (không phạm quy tắc nào) — dùng chung cho lịch chính và tính năng "Tìm ngày tốt sắp tới".

Nguồn: `src/lib/rules.js` · Hàm chấm điểm: `scoreDay()` trong `src/lib/dayScore.js`

5 loại việc đang hỗ trợ: **Cưới hỏi, Tang lễ, Làm nhà/Động thổ, Khai trương, Xuất hành**.

### 1.1 `tamnuong` — Tam Nương
- **Điều kiện:** ngày âm lịch là mùng **3, 7, 13, 18, 22, 27**.
- **Xấu cho:** Cưới, Tang, Nhà, Khai trương, Xuất hành (cả 5 việc).
- **Vì sao:** dân gian cho là ngày 3 cô gái nhà trời xuống thử lòng người.

### 1.2 `nguyetky` — Nguyệt Kỵ
- **Điều kiện:** ngày âm lịch là mùng **5, 14, 23** (các số cộng lại = 5).
- **Xấu cho:** Cưới, Khai trương, Xuất hành, Nhà (không tính Tang).
- **Vì sao:** gọi là ngày "nửa đời nửa đoạn", việc dễ dở dang.

### 1.3 `duongcongky` — Dương Công Kỵ Nhật
- **Điều kiện:** (tháng âm, ngày âm) trùng 1 trong 13 cặp cố định trong năm:
  `1/13, 2/11, 3/9, 4/7, 5/5, 6/3, 7/8, 7/29, 8/27, 9/25, 10/23, 11/21, 12/19`
- **Xấu cho:** cả 5 việc.
- **Vì sao:** 13 ngày đại kỵ cố định theo Ngọc Hạp Thông Thư.

### 1.4 `satchuduong` — Sát Chủ (Dương)
- **Điều kiện:** Chi của ngày trùng với Chi "sát chủ" quy định riêng cho từng tháng âm:
  | Tháng âm | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Chi sát chủ (Dương) | Tý | Sửu | Sửu | Hợi | Thìn | Thìn | Sửu | Thìn | Sửu | Thìn | Mùi | Thìn |
- **Xấu cho:** Cưới, Khai trương, Nhà, Xuất hành (không tính Tang).
- **Vì sao:** xấu cho việc "dương thế" (đời sống).

### 1.5 `satchuam` — Sát Chủ (Âm)
- **Điều kiện:** Chi của ngày trùng với Chi "sát chủ âm" theo tháng âm:
  | Tháng âm | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Chi sát chủ (Âm) | Tỵ | Tý | Mùi | Mão | Thân | Hợi | Tuất | Sửu | Ngọ | Dậu | Dần | Thìn |
- **Xấu cho:** chỉ Tang lễ.
- **Vì sao:** xấu riêng cho việc tâm linh (an táng, nhập quan, bốc mộ...).

### 1.6 `trucpha` — Trực Phá
- **Điều kiện:** Trực của ngày (trong 12 Trực: Kiến-Trừ-Mãn-Bình-Định-Chấp-Phá-Nguy-Thành-Thu-Khai-Bế) là **"Phá"**.
- **Xấu cho:** cả 5 việc.

### 1.7 `truckien` — Trực Kiến (chỉ kỵ động thổ)
- **Điều kiện:** Trực của ngày là **"Kiến"**.
- **Xấu cho:** chỉ Làm nhà/Động thổ.
- **Ghi chú:** Trực Kiến vốn tốt cho việc thiện, trồng cây — chỉ riêng kỵ động thổ/đào giếng.

### 1.8 `trucman` — Trực Mãn (chỉ kỵ an táng)
- **Điều kiện:** Trực của ngày là **"Mãn"**.
- **Xấu cho:** chỉ Tang lễ.

### 1.9 `hacdao` — Ngày Hắc Đạo
- **Điều kiện:** ngày rơi vào 1 trong 6 sao xấu (Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Nguyên Vũ, Câu Trận) trong hệ 12 sao Hoàng Đạo/Hắc Đạo.
- **Xấu cho:** cả 5 việc.

### 1.10 `khongphong` — Không Phòng
- **Điều kiện:** theo mùa (tính theo tháng âm: Xuân=1-3, Hạ=4-6, Thu=7-9, Đông=10-12), Chi của ngày rơi vào nhóm kỵ tương ứng:
  | Mùa | Chi kỵ |
  |---|---|
  | Xuân | Thìn, Tỵ, Tý |
  | Hạ | Tuất, Hợi, Mùi |
  | Thu | Mão, Ngọ, Dần |
  | Đông | Dậu, Sửu, Thân |
- **Xấu cho:** chỉ Cưới hỏi (thành thân, kê giường cưới — không kỵ ăn hỏi).
- **Vì sao:** theo bài thơ dân gian "Xuân Long-Xà-Thử, Hạ Khuyển-Trư-Dương, Thu Thố-Mã-Hổ, Đông Kê-Ngưu-Hầu".

### 1.11 `sao28xau` — Sao xấu (Nhị Thập Bát Tú — 28 sao)
- **Điều kiện:** sao trực ngày (trong chu kỳ 28 sao lặp lại mỗi 28 ngày, không phụ thuộc tháng/năm) thuộc nhóm được xếp là xấu/hung.
- **Xấu cho:** cả 5 việc.
- **Độ tin cậy:** ⚠️ thấp hơn các mục khác — hệ 28 sao có nhiều dị bản giữa các nguồn, chỉ nên tham khảo thêm.

---

## 2. Nhóm B — Theo TUỔI gia chủ (Kim Lâu / Tam Tai / Hoang Ốc)

⚠️ **Khác nhóm A:** nhóm này tính theo năm sinh gia chủ + năm đang xem, **không** được gộp vào chấm điểm đỏ/vàng của lịch, và **không** được tính trong "Tìm ngày tốt sắp tới" (quyết định có chủ đích, xem `DECISIONS.md`).

Nguồn: `src/lib/ageRules.js`

### 2.1 `kimlau` — Kim Lâu
- **Cách tính:** tuổi mụ = năm xem − năm sinh + 1. Lấy tuổi mụ chia dư cho 9:
  | Số dư | Loại |
  |---|---|
  | 1 | Kim Lâu Thân |
  | 3 | Kim Lâu Thê |
  | 6 | Kim Lâu Tử |
  | 8 | Kim Lâu Lục Súc |
  | khác (0,2,4,5,7) | không phạm |

### 2.2 `tamtai` — Tam Tai
- **Cách tính:** Chi năm sinh thuộc 1 trong 4 nhóm tam hợp cố định, mỗi nhóm có đúng 3 năm Tam Tai lặp lại theo chu kỳ 12 năm:
  | Nhóm tuổi (Chi năm sinh) | 3 năm Tam Tai (Chi năm xem) |
  |---|---|
  | Thân, Tý, Thìn | Dần, Mão, Thìn |
  | Dần, Ngọ, Tuất | Thân, Dậu, Tuất |
  | Tỵ, Dậu, Sửu | Hợi, Tý, Sửu |
  | Hợi, Mão, Mùi | Tỵ, Ngọ, Mùi |

### 2.3 `hoangoc` — Hoang Ốc
- **Cách tính:** chu kỳ 6 cung lặp lại mỗi 10 tuổi: Nhất Cát (tốt) → Nhì Nghi (tốt) → Tam Địa Sát (xấu) → Tứ Tấn Tài (tốt) → Ngũ Thọ Tử (xấu) → Lục Hoang Ốc (xấu) → quay lại Nhất Cát...
- **Ghi chú:** công thức đã tự kiểm chứng khớp 3 ví dụ thực tế (tuổi 35, 45, 47), có thể còn dị bản — nếu gia đình có bảng tra khác, nên đối chiếu thêm.

---

## 3. Trùng Tang — công cụ riêng (dùng ngày giờ MẤT)

⚠️ Đây là công cụ **tách biệt hoàn toàn** khỏi lịch chọn ngày — nhập ngày giờ **người mất**, không phải ngày định làm việc.

Nguồn: `src/lib/trungTang.js`

- **Cách tính:** đếm cung theo thứ tự Tuổi → Tháng → Ngày → Giờ, xuất phát từ cung Dần (nếu nam) hoặc Thân (nếu nữ), đếm xuôi (nam) hoặc ngược (nữ) theo Chi.
- **Kết quả** rơi vào 1 trong 3 nhóm Chi:
  | Nhóm Chi | Kết luận |
  |---|---|
  | Dần, Thân, Tỵ, Hợi | Trùng Tang (xấu) |
  | Tý, Ngọ, Mão, Dậu | Thiên Di (trung bình) |
  | Thìn, Tuất, Sửu, Mùi | Nhập Mộ (tốt, hóa giải) |
- **Độ tin cậy:** ⚠️ công thức Trùng Tang có nhiều trường phái khác nhau — app đã cảnh báo chỉ mang tính tham khảo, không dùng để quyết định một mình.

---

## 4. Ngày lễ/Tết, mùng 1, Rằm — chỉ hiển thị, KHÔNG tính tốt/xấu

Nguồn: `src/lib/holidays.js`

- Tra theo bảng ngày dương cố định (Tết Dương lịch, Quốc khánh...) và ngày âm cố định (Tết Nguyên Đán, Trung Thu, Vu Lan, Ông Công Ông Táo...).
- Nếu không rơi vào ngày lễ cụ thể: ngày âm lịch = 1 → nhãn "Mùng 1 âm lịch"; = 15 → nhãn "Rằm".
- **Cố tình không** đưa vào Nhóm A (chấm điểm) — để tránh lẫn giữa "thông tin lịch" và "phong tục kiêng kỵ".

---

## 5. Cách góp ý / yêu cầu sửa

Khi thảo luận xong, chỉ cần ghi rõ theo mẫu sau (giữ nguyên `id`), tôi sẽ áp vào code:

```
id: nguyetky
Đổi: thêm ngày 32 vào danh sách kỵ   ← ví dụ
Lý do: ...
```

Hoặc đơn giản hơn: sửa trực tiếp bảng/số liệu trong file này rồi gửi lại toàn bộ, tôi sẽ đối chiếu diff và cập nhật code tương ứng.
