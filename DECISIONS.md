# DECISIONS.md

Ghi lại các quyết định quan trọng trong quá trình xây dựng ứng dụng qua nhiều phiên làm việc với agent, để người đọc sau không phải suy luận lại từ đầu.

## Kiến trúc

- **Không có backend.** Toàn bộ dữ liệu người dùng (cài đặt, ngày yêu thích, ghi chú) lưu trong `localStorage` qua wrapper `src/lib/storage.js`. Đây là ứng dụng cá nhân chạy hoàn toàn phía trình duyệt.
- **`scoreDay()` (`src/lib/dayScore.js`) là nguồn chấm điểm duy nhất** cho một ngày (áp quy tắc đang bật, xác định màu đỏ/vàng/none theo việc đang chọn). Cả lưới lịch chính (`App.jsx`) lẫn tính năng "Tìm ngày tốt sắp tới" (`src/lib/findGoodDays.js`) đều gọi hàm này để đảm bảo không lệch logic giữa hai nơi.
- **Ngày lễ/Tết, mùng 1, Rằm chỉ mang tính hiển thị** (`src/lib/holidays.js`) — cố tình KHÔNG gộp vào bộ `RULES` chấm điểm tốt/xấu, để tránh lẫn lộn giữa "thông tin lịch" và "phong tục kiêng kỵ".
- **"Tìm ngày tốt sắp tới" không xét Kim Lâu/Tam Tai/Hoang Ốc** (quy tắc theo tuổi gia chủ theo năm) — chỉ tái dùng engine chấm điểm theo ngày hiện có, giữ đúng phạm vi đã thống nhất thay vì mở rộng thêm.
- **Layout sidebar thay cho các nút modal rời rạc trên header.** Khi số lượng "tool" tăng lên (Trùng Tang, Xem Mệnh, Xem tuổi hợp, Hướng nhà, Sao hạn, Nguồn tham khảo, Cài đặt = 7 mục), nhét hết vào modal/icon header sẽ rối — chuyển sang sidebar bên trái (ẩn thành hamburger menu + drawer trượt trên mobile). Các tool trước đây là modal (`fixed inset-0` + backdrop + nút đóng) nay chỉ còn render nội dung dạng "trang" trong khu vực `<main>`, không còn `onClose`/backdrop — trừ `DayDetailDrawer` (drawer trượt theo ngữ cảnh click ngày) và `UpcomingGoodDays` (popup kết quả tìm kiếm) vẫn giữ dạng modal vì mang tính tạm thời/ngữ cảnh, không phải "trang" cố định. Component gộp nhiều tool cũ (`PhongThuyHub.jsx`) đã bị xoá vì sidebar đã thay thế đúng vai trò đó.

## Xác minh dữ kiện dân gian

Các bảng tra cứu phong thủy có nhiều dị bản giữa các nguồn, nên trước khi hard-code, ưu tiên đối chiếu ít nhất 2 nguồn độc lập:

- **Giờ Hoàng Đạo theo ngày** (`getGioHoangDao` trong `src/lib/canChi.js`): đối chiếu qua tìm kiếm web, xác nhận khớp giữa nhiều trang lịch vạn niên và giải mã đúng câu thơ lục bát dân gian cho nhóm ngày Dần-Thân ("...Đi Đứng...Đến Đâu...Được...Đốn..." → các chữ có phụ âm đầu "Đ" tương ứng đúng 6 giờ tốt đã dùng).
- **24 Tiết khí** (`getTietKhi` trong `src/lib/lunarCalendar.js`): dùng lại đúng hàm `SunLongitude()` đã có sẵn cho việc tính tháng nhuận (thuật toán Hồ Ngọc Đức), chỉ chia độ mịn hơn (15°/tiết thay vì 30°/tháng khí). Ánh xạ độ↔tên tiết khí là dữ kiện thiên văn phổ thông, không cần xác minh thêm.
- **Sao 28 (Nhị Thập Bát Tú)**: nhãn tốt/xấu trong `STAR28_GOOD` là tổng hợp từ nhiều nguồn có dị bản — đã ghi chú trực tiếp trong code và trong `explain()` của rule `sao28xau` rằng đây là yếu tố tham khảo thêm, độ tin cậy thấp hơn các yếu tố khác.
- **Trùng Tang** (`src/lib/trungTang.js`): công thức có nhiều trường phái khác nhau; UI đã cảnh báo rõ đây chỉ mang tính tham khảo, không dùng để quyết định một mình.
- **Bát Trạch** (`src/lib/batTrach.js`): thuật toán "Du Niên Biến Quái" (đổi hào thượng/trung/hạ) đã tự đối chiếu khớp TỪNG BƯỚC với 1 ví dụ mẫu tìm được (quẻ Khôn → đổi hào thượng → Cấn = Sinh Khí, hướng Đông Bắc → đổi hào trung → Tốn = Ngũ Quỷ → đổi hào hạ → Càn = Diên Niên) trước khi tổng quát hoá thành thuật toán cho cả 8 cung. Công thức tính Cung Phi từ năm sinh cũng đối chiếu qua nhiều ví dụ cụ thể (Nam 1991→Ly, Nữ 1991→Càn, năm 2000→Ly/Càn) để chọn đúng phiên bản công thức giữa vài phiên bản hơi khác nhau giữa các nguồn.
- **Ngũ Hành Nạp Âm** (`src/lib/napAm.js`): bảng 60 Hoa Giáp được ghép lại từ nhiều lượt tìm kiếm (đối chiếu cho tới khi đủ cả 30 cặp Can-Chi/tên nạp âm), rồi tự kiểm chứng thêm bằng cách tính ngược công thức `pos%10===canIdx, pos%12===chiIdx` khớp với các ví dụ đã có trước khi đưa vào code.
- **Sao Hạn hàng năm** (`src/lib/saoHan.js`): bảng thứ tự 9 sao theo tuổi (khác nhau hoàn toàn giữa Nam/Nữ) đối chiếu qua 2 nguồn độc lập, cả 2 dùng ví dụ số khác nhau nhưng ra kết quả nhất quán (3 ví dụ tính tay đều khớp). Cố tình bỏ "năm tuổi nặng đặc biệt" (vd. 37/49 gắn thêm Thái Tuế) vì các nguồn nêu quy tắc khác nhau, không tìm được tiêu chí thống nhất.

## Phạm vi cố tình bỏ qua

- Không có xác thực/tài khoản người dùng — dữ liệu chỉ lưu trên một trình duyệt, không đồng bộ nhiều thiết bị (đã có nút xuất/nhập JSON để tự sao lưu thủ công).
- Toggle sáng/tối là thủ công (không tự theo `prefers-color-scheme` của hệ điều hành) — mặc định luôn là giao diện sáng để tránh bất ngờ cho người dùng mới, lựa chọn được lưu lại trong `localStorage`.
- **Cung Phi/Bát Trạch dùng năm sinh dương lịch trực tiếp**, không quy đổi theo tiết Lập Xuân (ranh giới năm chuẩn trong Bát Tự cổ điển) — nhất quán với cách các mục Kim Lâu/Tam Tai/Hoang Ốc đã làm từ trước, đổi lại người sinh trong khoảng Lập Xuân–Tết (đầu năm dương) có thể lệch 1 cung so với cách tính đầy đủ.
- **"Xem tuổi hợp" không có 1 điểm số tổng hợp chuẩn** — chỉ liệt kê riêng 3 lớp (Thiên Can, Địa Chi, Nạp Âm) và đưa gợi ý tổng quan dựa trên đếm số yếu tố tốt/xấu, vì bản thân dân gian cũng không thống nhất cách gộp.
