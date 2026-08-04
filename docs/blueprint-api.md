# Blueprint API Toàn Hệ Thống

---

## 1. auth-service (Port: 8081 | Gateway Prefix: /api/auth)

| Method | Endpoint | Mô Tả | Yêu Cầu Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập hệ thống, trả về JWT Token | Public |
| `POST` | `/auth/register` | Đăng ký tài khoản mới (Tùy chọn) | Public |

---

## 2. course-service (Port: 8082 | Gateway Prefix: /api/courses)

### Public / Client Endpoints

| Method | Endpoint | Mô Tả | Yêu Cầu Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/courses` | Lấy danh sách môn học (Hỗ trợ tìm kiếm & phân trang) | Public |
| `GET` | `/courses/{id}` | Lấy thông tin chi tiết một môn học theo ID | Public |
| `POST` | `/courses` | Tạo mới một môn học | Role `ADMIN` |
| `PUT` | `/courses/{id}` | Cập nhật thông tin môn học | Role `ADMIN` |
| `DELETE` | `/courses/{id}` | Xóa môn học | Role `ADMIN` |

### Internal API (Chỉ giao tiếp nội bộ giữa các Services, KHÔNG lộ qua Gateway)

| Method | Endpoint | Mô Tả |
| :--- | :--- | :--- |
| `PATCH` | `/internal/courses/{id}/reserve-seat` | Kiểm tra khả dụng & trừ 1 `soChoConLai` (Transactional) |
| `PATCH` | `/internal/courses/{id}/release-seat` | Hoàn trả 1 `soChoConLai` khi học sinh hủy đăng ký |

---

## 3. registration-service (Port: 8083 | Gateway Prefix: /api/registrations)

| Method | Endpoint | Mô Tả | Yêu Cầu Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/registrations` | Đăng ký học phần (Gọi ngầm `/internal/.../reserve-seat` sang course-service) | Role `STUDENT` |
| `GET` | `/registrations/my` | Xem danh sách các môn học đã đăng ký của cá nhân | Role `STUDENT` |
| `DELETE` | `/registrations/{id}` | Hủy đăng ký học phần (Gọi ngầm `/internal/.../release-seat` sang course-service) | Role `STUDENT` / `ADMIN` |