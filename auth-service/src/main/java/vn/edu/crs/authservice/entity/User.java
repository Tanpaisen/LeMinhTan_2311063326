package vn.edu.crs.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_user") // Đặt tên là app_user để tránh đụng từ khóa user của MySQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false)
    private String password; // Luôn lưu dạng đã mã hóa BCrypt, KHÔNG BAO GIỜ lưu plain text

    @Column(nullable = false, length = 20)
    private String role; // "ADMIN" hoặc "STUDENT"
}