# DECISIONS.md

Ghi lại các quyết định quan trọng trong quá trình xây dựng ứng dụng qua nhiều phiên làm việc với agent, để người đọc sau không phải suy luận lại từ đầu.

## Kiến trúc

- **Không có backend.** Toàn bộ dữ liệu người dùng (cài đặt, ngày yêu thích, ghi chú) lưu trong `localStorage` qua wrapper `src/lib/storage.js`. Đây là ứng dụng cá nhân chạy hoàn toàn phía trình duyệt.
- **`scoreDay()` (`src/lib/dayScore.js`) là nguồn chấm điểm duy nhất** cho một ngày (áp quy tắc đang bật, xác định màu đỏ/vàng/none theo việc đang chọn). Cả lưới lịch chính (`App.jsx`) lẫn tính năng "Tìm ngày tốt sắp tới" (`src/lib/findGoodDays.js`) đều gọi hàm này để đảm bảo không lệch logic giữa hai nơi.
- **Ngày lễ/Tết, mùng 1, Rằm chỉ mang tính hiển thị** (`src/lib/holidays.js`) — cố tình KHÔNG gộp vào bộ `RULES` chấm điểm tốt/xấu, để tránh lẫn lộn giữa "thông tin lịch" và "phong tục kiêng kỵ".
- **"Tìm ngày tốt sắp tới" không xét Kim Lâu/Tam Tai/Hoang Ốc** (quy tắc theo tuổi gia chủ theo năm) — chỉ tái dùng engine chấm điểm theo ngày hiện có, giữ đúng phạm vi đã thống nhất thay vì mở rộng thêm.

## Xác minh dữ kiện dân gian

Các bảng tra cứu phong thủy có nhiều dị bản giữa các nguồn, nên trước khi hard-code, ưu tiên đối chiếu ít nhất 2 nguồn độc lập:

- **Giờ Hoàng Đạo theo ngày** (`getGioHoangDao` trong `src/lib/canChi.js`): đối chiếu qua tìm kiếm web, xác nhận khớp giữa nhiều trang lịch vạn niên và giải mã đúng câu thơ lục bát dân gian cho nhóm ngày Dần-Thân ("...Đi Đứng...Đến Đâu...Được...Đốn..." → các chữ có phụ âm đầu "Đ" tương ứng đúng 6 giờ tốt đã dùng).
- **24 Tiết khí** (`getTietKhi` trong `src/lib/lunarCalendar.js`): dùng lại đúng hàm `SunLongitude()` đã có sẵn cho việc tính tháng nhuận (thuật toán Hồ Ngọc Đức), chỉ chia độ mịn hơn (15°/tiết thay vì 30°/tháng khí). Ánh xạ độ↔tên tiết khí là dữ kiện thiên văn phổ thông, không cần xác minh thêm.
- **Sao 28 (Nhị Thập Bát Tú)**: nhãn tốt/xấu trong `STAR28_GOOD` là tổng hợp từ nhiều nguồn có dị bản — đã ghi chú trực tiếp trong code và trong `explain()` của rule `sao28xau` rằng đây là yếu tố tham khảo thêm, độ tin cậy thấp hơn các yếu tố khác.
- **Trùng Tang** (`src/lib/trungTang.js`): công thức có nhiều trường phái khác nhau; UI đã cảnh báo rõ đây chỉ mang tính tham khảo, không dùng để quyết định một mình.

## Phạm vi cố tình bỏ qua

- Không có xác thực/tài khoản người dùng — dữ liệu chỉ lưu trên một trình duyệt, không đồng bộ nhiều thiết bị (đã có nút xuất/nhập JSON để tự sao lưu thủ công).
- Toggle sáng/tối là thủ công (không tự theo `prefers-color-scheme` của hệ điều hành) — mặc định luôn là giao diện sáng để tránh bất ngờ cho người dùng mới, lựa chọn được lưu lại trong `localStorage`.
