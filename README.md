# IELTS Prep Studio

Ứng dụng web tự học với giao diện tiếng Việt và bài luyện tiếng Anh. Sản phẩm ưu tiên lộ trình Cambridge IELTS 12 General Training và có thư viện mẫu đề Aptis riêng.

## Học trong ứng dụng

- **IELTS:** lộ trình Cambridge IELTS 12 GT, Tests 5–8; lưu vị trí học, chấm Reading, xem lại lỗi, lưu bài viết và ôn từ vựng theo SM-2.
- **Listening Cambridge:** dữ liệu câu hỏi và transcript đã được nhập, nhưng phần làm bài chỉ mở khi có audio Cambridge gốc trong bản self-host.
- **Aptis:** thư viện mẫu Reading, Listening, Writing và Speaking. Reading/Listening có thể chấm theo đáp án; Writing/Speaking chỉ xem đề và bài mẫu.
- **Kế hoạch học:** xếp việc theo khung giờ, bước Cambridge đang học, từ và lỗi đến hạn. Số liệu chỉ dựa trên dữ liệu đã lưu.
- **Lưu trữ:** IndexedDB trên thiết bị là bộ nhớ chính; tài khoản đồng bộ thay đổi với Cloudflare D1.

Cambridge là học liệu riêng: không đưa PDF, audio hoặc JSON đầy đủ vào repository. Lưu bản được phép sử dụng tại `data/private/cambridge12_gt/`; thư mục này được loại khỏi Git và được mount chỉ đọc vào container.

## Chạy bằng Docker Compose

Cần Docker Compose và thông tin Cloudflare D1 để dùng đăng nhập, tài khoản và đồng bộ.

1. Tạo `.env` từ mẫu rồi điền thông tin D1:

   ```powershell
   Copy-Item .env.example .env
   ```

   Cập nhật `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID` và `CLOUDFLARE_API_TOKEN` trong `.env`.

2. Tạo schema và tài khoản quản trị từ máy đã cấu hình Node.js:

   ```powershell
   npm ci
   npm run d1:migrate
   npm run user:create -- --email=you@example.com --name="Your Name" --password="Choose-A-Password"
   ```

   Ứng dụng không mở đăng ký công khai; chỉ tạo tài khoản theo cách quản trị này.

3. Khởi động ứng dụng:

   ```powershell
   docker compose up -d --build
   docker compose ps
   ```

   Mặc định app ở `http://localhost:8085`. Container phục vụ API và frontend bằng Node.js; dữ liệu `data/private/` được mount chỉ đọc. Để truy cập qua Internet, cần cấu hình HTTPS/reverse proxy trên máy chủ tự host.

   ```powershell
   docker compose logs -f
   docker compose down
   ```

### Đồng bộ Google Calendar (tùy chọn)

Để bật đồng bộ trực tiếp, tạo OAuth Client ID loại **Web application** trong Google Cloud Console, bật Google Calendar API, rồi khai báo đúng callback `https://<ten-mien>/api/calendar/oauth/callback` trong danh sách redirect URI. Thêm bốn biến sau vào `.env`:

```text
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI
GOOGLE_TOKEN_ENCRYPTION_KEY
```

Khóa mã hóa phải là 32 byte, biểu diễn bằng 64 ký tự hex hoặc base64. Có thể tạo khóa hex bằng `openssl rand -hex 32`; hãy giữ nguyên khóa này để đọc được token đã lưu. Sau đó chạy lại `docker compose up -d --build`. Mỗi lần bấm đồng bộ, ứng dụng tạo hoặc cập nhật một sự kiện cho mỗi ngày có lịch trong Google Calendar chính; sự kiện có nhắc trước 10 phút. Nếu kế hoạch đổi, ứng dụng xóa các khối do mình tạo trong 7 ngày tới đã bị bỏ khỏi kế hoạch, còn sự kiện trong quá khứ được giữ lại. Tài khoản và token được tách theo người dùng; refresh token lưu trong D1 dưới dạng mã hóa AES-256-GCM. Ngắt kết nối thu hồi quyền Google, còn sự kiện đã đồng bộ và mã theo dõi được giữ để lần kết nối sau cập nhật đúng các sự kiện cũ. Tệp `.ics` vẫn dùng được khi chưa cấu hình OAuth.

## Kiểm tra mã nguồn và dữ liệu

```powershell
npm run lint
npm test
npm run validate:data
npm run build
```

`npm run validate:data` kiểm tra bộ dữ liệu IELTS/Aptis và manifest Cambridge riêng trên máy. Không đưa nội dung Cambridge riêng vào bản build công khai.
