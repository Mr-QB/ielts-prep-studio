# IELTS Prep Studio (Academic Self-Study Platform)

Nền tảng tự học IELTS cá nhân, tập trung chuyên sâu cho **IELTS Academic** hướng tới mục tiêu **Band 6.5 → 7.0**, thiết kế theo triết lý **tối giản, yên tĩnh, nhanh, keyboard-first, local-first** và **không phụ thuộc vào API AI bên ngoài**.

---

## 1. 4 Module Trọng Tâm

1. **Listening (Luyện Nghe chuẩn 4 Parts):**
   - Lộ trình 4 Parts chuẩn: Part 1 (Hội thoại xã hội), Part 2 (Độc thoại đời sống), Part 3 (Thảo luận học thuật), Part 4 (Bài giảng học thuật).
   - Audio Player tối giản, hỗ trợ chọn tốc độ (0.75x – 1.25x), sound test kiểm tra tai nghe.
   - Chế độ Học tập (Study Mode) kèm Audioscript ẩn/hiện theo nhu cầu và chế độ Thi thử (Exam Mode).
   - Minh bạch nguồn gốc học liệu: gắn nhãn rõ `Official IELTS`, `British Council`, `User reference`. Tuyệt đối không giả mạo giọng Web Speech thành giọng Cambridge.

2. **Reading (IELTS Academic):**
   - Mặc định ưu tiên 100% các bài đọc học thuật IELTS Academic (Marie Curie, Dung Beetles, Ant Specimens) với độ dài chuẩn ~2,600 từ cho 3 Passages.
   - Giao diện chia đôi màn hình (Split-view): bên trái văn bản bài đọc, bên phải câu hỏi; hai khung cuộn độc lập.
   - Công cụ đánh dấu (Highlighter 3 màu), điều chỉnh cỡ chữ (A-, A, A+), tra cứu vị trí đoạn văn giải thích sau khi nộp bài.
   - Tài liệu General Training (Cambridge 12) được phân loại riêng vào ngăn tham khảo (Legacy Drawer) kèm cảnh báo rõ ràng.

3. **Grammar (Lộ trình 26 Chủ điểm):**
   - **Foundation (G01–G06):** Cấu trúc câu, tránh fragments/run-ons, các thì cốt lõi trong ngữ cảnh IELTS, hòa hợp chủ-vị, mạo từ a/an/the/zero, danh từ đếm được/không đếm được, đại từ liên kết.
   - **Core IELTS (G07–G20):** Tính từ & trạng từ học thuật, cấu trúc so sánh Task 1, cụm danh từ nén thông tin, giới từ số liệu biểu đồ, mệnh đề quan hệ, modal verbs, thể bị động quy trình, danh động từ, câu điều kiện loại 1 & 2, câu phức, liên từ liên kết, nguyên nhân - kết quả - mục đích, hedging (tính cẩn trọng học thuật), tổ chức đoạn văn.
   - **Advanced (G21–G26):** Mệnh đề phân từ rút gọn, danh từ hóa (nominalisation), bị động khách quan, đảo ngữ với phó từ phủ định, câu chẻ (cleft sentences), đảo ngữ câu điều kiện không dùng if.
   - Mỗi bài học gồm: Tầm quan trọng trong IELTS, Công thức, Ví dụ chuẩn mực, Lỗi sai kinh điển & Cách sửa, Bài tập tương tác nhanh, Ứng dụng thực tế.

4. **Vocabulary & Spaced Repetition (SuperMemo SM-2):**
   - Học thẻ Flashcard 2 mặt và Gõ chính tả (Typing Mode).
   - Thuật toán SM-2 chuẩn: Các nút đánh giá [1] Again, [2] Hard, [3] Good, [4] Easy hiển thị chu kỳ tiếp theo được tính toán trực tiếp theo trạng thái thẻ (không hardcode).
   - Hỗ trợ nhập file `.txt` / `.csv` cá nhân với cửa sổ xem trước (Preview 10 thẻ), phát hiện từ trùng và tùy chọn bỏ qua/ghi đè.
   - Quản lý bộ từ (Deck): Tạo mới, đổi tên, xóa, xuất file JSON (bảo toàn tiến độ học SRS) hoặc file TXT.
   - Lưu trữ bền vững Local-first qua IndexedDB (có sao lưu tự động vào localStorage).

---

## 2. Phím Tắt Điều Khiển (Keyboard Shortcuts)

### Trong chế độ Flashcard (Ôn từ vựng):
| Phím | Chức năng |
| :--- | :--- |
| `Space` | Lật thẻ xem nghĩa, phiên âm và ví dụ ngữ cảnh |
| `1` | Đánh giá **Quên (Again)** — ôn lại sau < 10 phút |
| `2` | Đánh giá **Khó (Hard)** — ôn lại sau 12 giờ hoặc chu kỳ ngắn |
| `3` | Đánh giá **Tốt (Good)** — ôn lại sau 1 – 3 ngày |
| `4` | Đánh giá **Rất Dễ (Easy)** — ôn lại sau 3 – 6 ngày |
| `R` | Nghe phát âm từ vựng (Browser TTS) |
| `→` | Chuyển sang thẻ kế tiếp |

### Trong chế độ Gõ chính tả (Typing Mode):
| Phím | Chức năng |
| :--- | :--- |
| `Enter` (lần 1) | Kiểm tra chính tả từ vừa gõ |
| `Enter` hoặc `Space` (lần 2) | Tiếp tục sang từ tiếp theo |

---

## 3. Kiểm Tra Dữ Liệu & Kiểm Thử Tự Động (Data QA & Tests)

Dự án tích hợp sẵn công cụ kiểm định toàn vẹn dữ liệu:

```bash
# Kiểm tra toàn bộ ID trùng lặp, thiếu đáp án, cấu trúc bài tập (Offline):
npm run validate:data

# Kiểm tra mở rộng (Online):
npm run validate:data:online

# Chạy toàn bộ Unit Tests (Kiểm thử thuật toán SM-2, Text Parser, Data Integrity):
npm test

# Kiểm tra TypeScript typecheck:
npm run lint

# Tạo bản build production:
npm run build
```

---

## 4. Chạy Bằng Docker (Production Deployment)

Dự án được đóng gói bằng Multi-stage Dockerfile (Node 20 build → Nginx Alpine serve), phục vụ ứng dụng tại địa chỉ `http://127.0.0.1:8085`.

```bash
# Khởi động ứng dụng bằng Docker Compose:
docker compose up -d --build

# Kiểm tra trạng thái container và healthcheck:
docker compose ps

# Xem log container:
docker compose logs -f

# Dừng container khi không sử dụng:
docker compose down
```

> **Ghi chú cổng:** Mặc định cổng map ra host là `8085` (tránh xung đột với cổng `8080` trên máy). Bạn có thể đổi cổng bằng cách truyền biến môi trường, ví dụ: `PORT=8080 docker compose up -d`.
