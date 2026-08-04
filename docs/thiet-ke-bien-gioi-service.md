# Thiết Kế Biên Giới Service (Service Boundary Design)

## 1. Danh Sách Service

| Service | Cổng | Database | Trách Nhiệm Chính |
| :--- | :--- | :--- | :--- |
| **api-gateway** | `8080` | *(Không có DB)* | Điểm vào duy nhất, định tuyến request, xác thực sơ bộ, xử lý CORS |
| **auth-service** | `8081` | `auth_db` | Quản lý User, Student, xử lý đăng nhập, sinh và xác thực JWT token |
| **course-service** | `8082` | `course_db` | Quản lý thông tin môn học (Course), tìm kiếm, phân trang, quản lý số chỗ |
| **registration-service** | `8083` | `registration_db` | Quản lý đăng ký học phần (Registration), tương tác với `course-service` để xử lý giữ/nhả chỗ |

---

## 2. Nguyên Tắc Sở Hữu Dữ Liệu (Data Ownership)

* **Database per Service:** Mỗi microservice sở hữu và quản lý một database riêng biệt. **KHÔNG** một service nào được phép truy cập trực tiếp vào DB của service khác.
* **Giao tiếp qua REST API:** Mọi nhu cầu lấy thông tin hoặc thay đổi trạng thái dữ liệu thuộc service khác bắt buộc phải thông qua API do service đó cung cấp.
* **Tham chiếu mềm (Loose Coupling):**
    * `registration-service` **không** chứa bảng `Course`.
    * Trong cơ sở dữ liệu `registration_db`, bảng đăng ký chỉ lưu trữ `course_id` (kiểu dữ liệu số `Long`/`BigInt`), không thiết lập bất kỳ khóa ngoại (Foreign Key) cứng nào sang `course_db`.

---

## 3. Bảng Định Tuyến Gateway (Dự Kiến)

| Route Prefix | Forward Tới | Ghi Chú |
| :--- | :--- | :--- |
| `/api/auth/**` | `http://localhost:8081` | Endpoints đăng nhập/đăng ký (Public), các endpoints còn lại yêu cầu JWT |
| `/api/courses/**` | `http://localhost:8082` | Tra cứu môn học (Public GET), Thêm/Sửa/Xóa cần quyền `ADMIN` |
| `/api/registrations/**` | `http://localhost:8083` | Đăng ký & xem môn học (Yêu cầu JWT role `STUDENT`/`ADMIN`) |
| `/api/public/courses` | `http://localhost:8082` | Cung cấp cho đối tác ngoài thông qua API Key |