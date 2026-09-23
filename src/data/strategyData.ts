export interface StrategySection {
  id: string;
  skill: 'reading' | 'listening' | 'exam';
  title: string;
  summary: string;
  coreRule: string;
  steps: string[];
  tips: string[];
  examples?: { wrongApproach: string; correctApproach: string; note: string };
}

export const STRATEGY_SECTIONS: StrategySection[] = [
  // READING
  {
    id: 'strat-r-skimming',
    skill: 'reading',
    title: 'Kỹ thuật Skimming (Đọc Lướt Lấy Ý Chính)',
    summary: 'Cách đọc nhanh 2–3 phút để nắm toàn bộ cấu trúc bài đọc trước khi làm bài.',
    coreRule: 'Chỉ đọc tiêu đề, câu đầu tiên (Topic Sentence), câu thứ 2 và câu kết đoạn. Bỏ qua các từ vựng chuyên ngành phức tạp.',
    steps: [
      '1. Đọc kỹ tiêu đề bài đọc (Title) và phụ đề (Subtitle) nếu có.',
      '2. Quét nhanh đoạn 1 để hiểu bối cảnh và chủ đề.',
      '3. Với các đoạn thân bài, đọc câu đầu tiên để xem đoạn này nói về khía cạnh gì.',
      '4. Ghi chú 1–2 từ khóa bằng bút chì bên cạnh lề đoạn văn.'
    ],
    tips: [
      'Không dừng lại tra từ điển hoặc dịch từng từ trong đầu.',
      'Mục tiêu của skimming là vẽ bản đồ tư duy vị trí thông tin, không phải ghi nhớ số liệu.'
    ],
    examples: {
      wrongApproach: 'Cố gắng đọc từng chữ từ đầu đến cuối bài đọc 1000 từ rồi mới nhìn câu hỏi.',
      correctApproach: 'Skim 2 phút để biết Đoạn A nói về lịch sử, Đoạn B nói về chi phí, Đoạn C nói về tác động môi trường.',
      note: 'Tiết kiệm ít nhất 8–10 phút quý giá trong phòng thi.'
    }
  },
  {
    id: 'strat-r-scanning',
    skill: 'reading',
    title: 'Kỹ thuật Scanning (Quét Định Vị Từ Khóa)',
    summary: 'Cách tìm kiếm chính xác vị trí chứa câu trả lời trong tích tắc.',
    coreRule: 'Dùng mắt quét chữ ziczac hoặc từ phải qua trái để tìm hình ảnh của từ khóa cố định (tên riêng, số, năm).',
    steps: [
      '1. Chọn từ khóa "khó bị biến đổi" trong câu hỏi (Ví dụ: tên nhà khoa học, năm 1985, thuật ngữ viết hoa).',
      '2. Quét nhanh văn bản cho đến khi bắt gặp từ khóa đó.',
      '3. Đọc kỹ 1 câu phía trước và 1 câu phía sau từ khóa để hiểu trọn vẹn ngữ cảnh.'
    ],
    tips: [
      'Nếu từ khóa trong câu hỏi là từ thông dụng, nó chắc chắn đã bị PARAPHRASE trong bài đọc.'
    ]
  },
  {
    id: 'strat-r-time',
    skill: 'reading',
    title: 'Chiến Thuật Phân Bổ Thời Gian 60 Phút',
    summary: 'Không chia đều 20-20-20 phút cho 3 Passage.',
    coreRule: 'Quy tắc 17 – 20 – 23 phút. Passage 1 là dễ nhất, phải làm nhanh để dồn thời gian cho Passage 3.',
    steps: [
      'Passage 1: Hoàn thành trong 15–17 phút (Mục tiêu đúng 11–12/13 câu).',
      'Passage 2: Hoàn thành trong 18–20 phút (Mục tiêu đúng 9–10/13 câu).',
      'Passage 3: Dành trọn vẹn 23–25 phút (Bài dài và nhiều bẫy nhất).',
      'Luôn điền đáp án trực tiếp vào Answer Sheet, không đợi hết giờ mới chép!'
    ],
    tips: [
      'Nếu gặp 1 câu hỏi quá khó sau 1.5 phút không tìm ra, hãy chọn đáp án khả dĩ nhất, đánh dấu chấm tròn bên cạnh và ĐI TIẾP NGAY LẬP TỨC.'
    ]
  },

  // LISTENING
  {
    id: 'strat-l-prediction',
    skill: 'listening',
    title: 'Kỹ Thuật Dự Đoán Trước Khi Nghe (Prediction)',
    summary: 'Tận dụng 30–40 giây trước mỗi Section để đoán từ loại và ngữ cảnh.',
    coreRule: 'Não bộ chỉ nghe kịp khi nó đã sẵn sàng chờ đón một loại thông tin cụ thể (số, tên riêng, tính từ, hay động từ).',
    steps: [
      '1. Đọc lướt tiêu đề bảng hoặc form điền từ.',
      '2. Nhìn trước và sau chỗ trống: Có mạo từ "a/an" không? Có ký hiệu tiền tệ "$" hay "£" không? Cần số ít hay số nhiều?',
      '3. Đoán trường từ vựng: Đây là đặt phòng khách sạn, phỏng vấn xin việc, hay bài giảng sinh học?'
    ],
    tips: [
      'Gạch chân từ khóa tín hiệu đứng ngay trước chỗ trống trong đề bài.'
    ]
  },
  {
    id: 'strat-l-distractor',
    skill: 'listening',
    title: 'Nhận Diện Bẫy Đổi Ý (Distractor Detection)',
    summary: 'Cách không bị lừa bởi những con số và ngày tháng được nói trước.',
    coreRule: 'Thông tin nghe thấy đầu tiên thường là bẫy. Hãy chú ý các từ liên kết như "but", "however", "actually", "instead".',
    steps: [
      '1. Giữ đầu bút chì tại chỗ trống, chưa vội viết ngay đáp án đầu tiên.',
      '2. Chờ 2–3 giây xem người nói có nói thêm câu đính chính không.',
      '3. Nếu có từ đính chính, ghi ngay đáp án thứ hai.'
    ],
    tips: [
      'Đặc biệt phổ biến trong Part 1: số điện thoại, giá tiền, ngày hẹn, phương tiện đi lại.'
    ]
  },

  // EXAM TAKING
  {
    id: 'strat-e-routine',
    skill: 'exam',
    title: 'Tâm Lý Phòng Thi & Chiến Lược Không Bao Giờ Bỏ Trống',
    summary: 'Cách tối đa hóa điểm số thực tế trong ngày thi chính thức.',
    coreRule: 'Trong IELTS không bị trừ điểm cho câu trả lời sai. Tuyệt đối không bao giờ để trống bất kỳ ô nào!',
    steps: [
      '1. Với câu hỏi khó: Dùng phương pháp loại trừ 2 phương án chắc chắn sai.',
      '2. Với True/False/Not Given còn phân vân: Chọn theo trực giác đầu tiên sau khi đã định vị đúng đoạn văn.',
      '3. Kiểm tra lỗi chính tả và số nhiều (-s/-es): Đây là nguyên nhân khiến thí sinh mất 0.5 – 1.0 Band ngớ ngẩn nhất.'
    ],
    tips: [
      'Giữ nhịp thở đều. Nếu lỡ mất 1 câu Listening, lập tức buông bỏ và tập trung 100% cho câu tiếp theo.'
    ]
  }
];
