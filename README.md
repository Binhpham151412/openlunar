# Xem Ngày Tốt Xấu

Ứng dụng web xem lịch âm dương, Can Chi, Trực, Sao Hoàng Đạo và các yếu tố ngày tốt/xấu dân gian cho từng loại việc (cưới hỏi, tang lễ, làm nhà, khai trương, xuất hành).

## Tính năng

- **Lịch âm dương** — chuyển đổi dương lịch ↔ âm lịch bằng thuật toán Hồ Ngọc Đức (`src/lib/lunarCalendar.js`), có xử lý tháng nhuận.
- **Can Chi, Trực, Sao Hoàng Đạo/Hắc Đạo, Nhị Thập Bát Tú, Tiết khí** cho từng ngày (`src/lib/canChi.js`).
- **Giờ Hoàng Đạo trong ngày** — bảng 6 nhóm ngày Chi đối xung, tra cứu 6/12 giờ tốt mỗi ngày.
- **Bộ quy tắc ngày xấu** có thể bật/tắt: Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật, Sát Chủ (Âm/Dương), Trực Phá/Kiến/Mãn, Hắc Đạo, Không Phòng, Sao 28 xấu (`src/lib/rules.js`).
- **Kim Lâu / Tam Tai / Hoang Ốc** theo tuổi gia chủ (`src/lib/ageRules.js`).
- **Công cụ tính Trùng Tang** riêng, dùng ngày giờ mất (`src/lib/trungTang.js`).
- **Tìm ngày tốt sắp tới** — quét 90 ngày tới, lọc theo việc đang chọn và bộ quy tắc đang bật.
- **Ngày lễ/Tết, mùng 1, Rằm** — chỉ hiển thị thông tin, không gộp vào logic tốt/xấu.
- **Đánh dấu yêu thích, ghi chú riêng theo ngày**, sao chép nhanh thông tin ngày, xuất/nhập backup JSON.
- **Chuyển đổi giao diện sáng/tối** thủ công (nút trên header), mặc định là giao diện sáng.
- **Công cụ Phong Thủy** (mục "Phong Thủy" trên sidebar bên trái):
  - **Xem Mệnh** — Ngũ Hành Nạp Âm theo năm sinh + màu hợp/kỵ (`src/lib/napAm.js`).
  - **Xem tuổi hợp** — so Thiên Can, Địa Chi, Nạp Âm giữa 2 năm sinh cho vợ chồng/làm ăn (`src/lib/compatibility.js`).
  - **Hướng nhà/bếp (Bát Trạch)** — Cung Phi theo năm sinh + giới tính, 4 hướng tốt/4 hướng xấu (`src/lib/batTrach.js`).
  - **Sao hạn hàng năm** — 9 sao Cửu Diệu theo tuổi mụ + giới tính (`src/lib/saoHan.js`).

Layout dùng sidebar bên trái (ẩn thành menu hamburger trên mobile) để điều hướng giữa lịch chính và các công cụ trên — xem `src/components/Sidebar.jsx`.

Tất cả dữ liệu người dùng (cài đặt, ghi chú, ngày yêu thích) lưu cục bộ trong `localStorage` của trình duyệt — không có backend.

## Cấu trúc dự án

```
src/
  lib/            # thuật toán lịch, dữ liệu quy tắc, tiện ích thuần JS
  components/      # UI React
  App.jsx, main.jsx, index.css
```

## Chạy dự án

```bash
npm install
npm run dev       # chạy dev server (Vite)
npm run build     # build production vào dist/
npm run lint      # oxlint
```

## Công nghệ

React 19, Vite, Tailwind CSS v4, lucide-react.
