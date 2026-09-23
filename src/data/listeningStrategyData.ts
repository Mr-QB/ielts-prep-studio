import { ListeningStrategyLesson } from '../types';

export const LISTENING_STRATEGY_LESSONS: ListeningStrategyLesson[] = [
  // 1. Prediction before listening
  {
    id: 'l-strat-prediction',
    title: 'Dự Đoán Trước Khi Nghe (Prediction)',
    subtitle: 'Tận dụng 30-45 giây đọc đề để đoán trước ngữ cảnh, từ loại và thông tin cần điền',
    signalWords: ['noun', 'number', 'adjective', 'verb', 'location', 'time frame'],
    explanation: '30 giây đọc trước đề là thời gian vàng quyết định điểm số IELTS Listening. Hãy luôn: 1) Đọc kỹ giới hạn từ (NO MORE THAN TWO WORDS), 2) Gạch chân từ khóa cố định xung quanh chỗ trống, 3) Dự đoán từ loại (danh từ, động từ, tính từ hay số liệu) và dạng thông tin (tên người, địa danh, nghề nghiệp hay số tiền). Khi audio chạy, não bạn đã kích hoạt sẵn chế độ "bắt từ".',
    audioExample: {
      audioText: '"The course will start in late September and students are required to bring their own laptop and a scientific calculator."',
      questionPrompt: 'Students must provide their own: 1) laptop, 2) scientific _____',
      wrongAnswer: 'September (sai loại thông tin)',
      correctAnswer: 'calculator',
      whyWrong: 'Đề bài cần một danh từ chỉ đồ dùng học tập sau tính từ "scientific".',
      signalUsed: 'bring their own... scientific calculator'
    },
    practiceDrills: [
      {
        id: 'drill-pred-1',
        audioSnippet: 'MANAGER: All volunteers should report to the reception desk at 8:30 AM wearing closed-toe shoes and a bright yellow vest.',
        prompt: 'Volunteers must wear: closed-toe shoes and a yellow _____',
        correctAnswer: 'vest',
        explanation: 'Sau tính từ "yellow" là danh từ chỉ trang phục: "vest".',
        audioType: 'tts'
      },
      {
        id: 'drill-pred-2',
        audioSnippet: 'GUIDE: The historic castle was constructed in 1485 during the reign of King Henry VII.',
        prompt: 'Castle built in: _____ (Year)',
        correctAnswer: '1485',
        explanation: 'Chỗ trống yêu cầu năm xây dựng (Year): "1485".',
        audioType: 'tts'
      },
      {
        id: 'drill-pred-3',
        audioSnippet: 'OFFICER: You will need to bring proof of address, such as an electricity bill or a bank statement.',
        prompt: 'Acceptable document: electricity bill or bank _____',
        correctAnswer: 'statement',
        explanation: 'Cụm danh từ cố định "bank statement" (sao kê ngân hàng).',
        audioType: 'tts'
      }
    ]
  },

  // 2. Distractors & Correction
  {
    id: 'l-strat-distractor',
    title: 'Bẫy Đổi Ý & Đính Chính (Distractors & Correction)',
    subtitle: 'Nhận diện khi người nói đưa ra thông tin đầu tiên rồi sau đó đính chính lại',
    signalWords: ['but', 'actually', 'however', 'instead', 'changed to', 'rather than', 'I thought... but in fact', 'originally'],
    explanation: 'Trong bài thi IELTS Listening (đặc biệt Part 1 và Part 3), người nói hầu như luôn đề cập đến phương án sai trước. Sau đó họ dùng một từ phát tín hiệu (signal word) để đính chính sang đáp án đúng. Đừng bao giờ vội viết ngay con số hoặc ngày tháng đầu tiên bạn nghe được!',
    audioExample: {
      audioText: '"We originally scheduled the conference for Tuesday the 14th, but the keynote speaker was delayed, so we actually shifted it to Thursday the 16th."',
      questionPrompt: 'Conference date: _____',
      wrongAnswer: 'Tuesday 14th (hoặc Tuesday)',
      correctAnswer: 'Thursday 16th',
      whyWrong: 'Tuesday 14th là thông tin ban đầu đã bị phủ định bởi "but... actually shifted to".',
      signalUsed: 'but... actually shifted it to...'
    },
    practiceDrills: [
      {
        id: 'drill-dist-1',
        audioSnippet: 'CUSTOMER: I was hoping to book the compact hatchback for 35 dollars a day. AGENT: Ah, that model is currently undergoing servicing. We do have our mid-size sedan available instead for 42 dollars.',
        prompt: 'The customer will rent a vehicle for $_____ per day.',
        options: ['35', '42', '77'],
        correctAnswer: '42',
        explanation: 'Khách định chọn giá $35 ("I was hoping..."), nhưng nhân viên báo xe đang bảo dưỡng và đưa ra phương án thay thế ("instead for 42 dollars").',
        audioType: 'tts'
      },
      {
        id: 'drill-dist-2',
        audioSnippet: 'SPEAKER: The workshop was initially arranged in Room 204. However, owing to the large turnout, we have relocated to the Main Auditorium on the third floor.',
        prompt: 'The workshop venue is now the:',
        options: ['Room 204', 'Main Auditorium', 'Ground Floor Library'],
        correctAnswer: 'Main Auditorium',
        explanation: 'Từ tín hiệu "However... relocated to" chỉ ra địa điểm thực tế cuối cùng là Main Auditorium.',
        audioType: 'tts'
      },
      {
        id: 'drill-dist-3',
        audioSnippet: 'CALLER: Could you confirm my appointment time? I noted down 10:15 in my diary. SECRETARY: Let me check the schedule. Ah, Dr. Miller requested an extra 15 minutes, so it is actually set for 10:30.',
        prompt: 'Confirmed appointment time: _____',
        options: ['10:15', '10:30', '10:45'],
        correctAnswer: '10:30',
        explanation: 'Giờ trong sổ là 10:15, nhưng sau khi kiểm tra: "actually set for 10:30".',
        audioType: 'tts'
      }
    ]
  },

  // 3. Form Completion
  {
    id: 'l-strat-form-completion',
    title: 'Điền Đơn Thông Tin (Form Completion)',
    subtitle: 'Nắm chắc mẫu đơn đăng ký hội viên, khách sạn hoặc đặt tour trong Part 1',
    signalWords: ['Full name', 'Contact number', 'Occupation', 'Payment method', 'Preferred date'],
    explanation: 'Dạng bài Form Completion thường xuất hiện ngay Part 1: cuộc trò chuyện qua điện thoại giữa nhân viên và khách hàng. Dữ liệu điền vào thường là thông tin cá nhân ngắn gọn. Chú ý: luôn viết hoa chữ cái đầu cho tên riêng và địa danh, kiểm tra kỹ giới từ trước và sau chỗ trống.',
    audioExample: {
      audioText: '"RECEPTIONIST: May I take your occupation, please? GUEST: I work as a landscape architect with the city council."',
      questionPrompt: 'Occupation: _____',
      wrongAnswer: 'city council',
      correctAnswer: 'landscape architect',
      whyWrong: '"city council" là cơ quan nơi làm việc, còn nghề nghiệp cụ thể là "landscape architect".',
      signalUsed: 'I work as a...'
    },
    practiceDrills: [
      {
        id: 'drill-form-1',
        audioSnippet: 'CLERK: What is your current profession? CALLER: I am currently employed as a software tester for an IT consultancy.',
        prompt: 'Profession: _____',
        correctAnswer: 'software tester',
        explanation: 'Điền đúng chức danh nghề nghiệp: "software tester".',
        audioType: 'tts'
      },
      {
        id: 'drill-form-2',
        audioSnippet: 'AGENT: And how would you prefer to settle the booking deposit? By credit card? CUSTOMER: Actually, I will pay via bank transfer.',
        prompt: 'Payment method: bank _____',
        correctAnswer: 'transfer',
        explanation: 'Khách hàng đính chính phương thức thanh toán: "bank transfer".',
        audioType: 'tts'
      },
      {
        id: 'drill-form-3',
        audioSnippet: 'STAFF: Can I take your emergency contact number? CALLER: Sure, it is 07892 415302.',
        prompt: 'Emergency contact: 07892 _____',
        correctAnswer: '415302',
        explanation: 'Nghe chính xác 6 chữ số cuối: 4-1-5-3-0-2.',
        audioType: 'tts'
      }
    ]
  },

  // 4. Note & Table Completion
  {
    id: 'l-strat-note-table',
    title: 'Ghi Chú & Bảng Biểu (Note & Table Completion)',
    subtitle: 'Theo dõi tiến trình theo hàng cột và các tiêu đề phân loại',
    signalWords: ['features', 'advantages', 'cost', 'procedure', 'location', 'requirements'],
    explanation: 'Với Table Completion, hãy đọc theo hàng ngang (từ trái sang phải) hoặc theo thứ tự số thứ tự câu hỏi để không bị lạc nhịp. Các cột tiêu đề cung cấp gợi ý quan trọng về loại thông tin sắp xuất hiện.',
    audioExample: {
      audioText: '"The economy package includes free Wi-Fi and breakfast, but airport shuttle service requires an additional fee of 15 dollars."',
      questionPrompt: 'Economy package: Free Wi-Fi and _____. Shuttle service: $15 extra.',
      wrongAnswer: 'shuttle service',
      correctAnswer: 'breakfast',
      whyWrong: 'Shuttle service phải trả thêm $15, chỉ có breakfast là miễn phí đi kèm Wi-Fi.',
      signalUsed: 'includes free Wi-Fi and...'
    },
    practiceDrills: [
      {
        id: 'drill-table-1',
        audioSnippet: 'LECTURER: The morning session focuses entirely on field sampling techniques, while the afternoon workshop is devoted to data analysis.',
        prompt: 'Morning session focus: field _____ techniques',
        correctAnswer: 'sampling',
        explanation: '"field sampling techniques" (kỹ thuật lấy mẫu thực địa).',
        audioType: 'tts'
      },
      {
        id: 'drill-table-2',
        audioSnippet: 'GUIDE: On Day 2, tourists will visit the botanical gardens in the morning and attend a cooking demonstration in the evening.',
        prompt: 'Day 2 evening activity: cooking _____',
        correctAnswer: 'demonstration',
        explanation: 'Hoạt động buổi tối là "cooking demonstration".',
        audioType: 'tts'
      },
      {
        id: 'drill-table-3',
        audioSnippet: 'LIBRARIAN: Undergraduates may borrow up to eight books at any one time, while postgraduates are permitted twelve items.',
        prompt: 'Undergraduate borrowing limit: _____ books',
        correctAnswer: '8',
        acceptableAnswers: ['eight'],
        explanation: 'Sinh viên đại học (undergraduates) được mượn 8 cuốn.',
        audioType: 'tts'
      }
    ]
  },

  // 5. Multiple Choice & Rejecting Options
  {
    id: 'l-strat-mcq',
    title: 'Multiple Choice trong Part 2 & 3',
    subtitle: 'Tại sao cả 3 phương án đều được nhắc tới và cách loại trừ bẫy',
    signalWords: ['we considered', 'too expensive', 'not feasible', 'agreed upon', 'unanimously decided'],
    explanation: 'Trong Part 3 tranh luận, 2 người nói sẽ nhắc đến CẢ 3 LỰA CHỌN A, B, C. Người nói A có thể đề xuất phương án A, nhưng người nói B phản bác là quá đắt hoặc không khả thi. Đáp án đúng là điều mà CẢ HAI BÊN CÙNG ĐỒNG Ý.',
    audioExample: {
      audioText: '"STUDENT A: Should we base our presentation on urban agriculture? STUDENT B: I thought about that, but there is far too much data to cover in ten minutes. STUDENT A: Fair point. How about plastic waste recycling? STUDENT B: Perfect, that is much more concise."',
      questionPrompt: 'Which topic did the students ultimately agree to present?',
      wrongAnswer: 'Urban agriculture',
      correctAnswer: 'Plastic waste recycling',
      whyWrong: 'Urban agriculture bị loại vì quá nhiều dữ liệu ("too much data"). Cả hai thống nhất chọn: Plastic waste recycling.',
      signalUsed: 'Perfect, that is much more concise.'
    },
    practiceDrills: [
      {
        id: 'drill-mcq-1',
        audioSnippet: 'TUTOR: Have you decided on your dissertation topic? STUDENT: My supervisor suggested solar energy tariffs, but I find electric vehicle subsidies much more engaging. TUTOR: I agree, EV subsidies will yield fresher field data.',
        prompt: 'The student will focus their dissertation on:',
        options: ['Solar energy tariffs', 'Electric vehicle subsidies', 'Wind farm investments'],
        correctAnswer: 'Electric vehicle subsidies',
        explanation: 'Đề tài được chọn là "Electric vehicle subsidies" vì cả học viên và giáo viên đều đồng tình.',
        audioType: 'tts'
      },
      {
        id: 'drill-mcq-2',
        audioSnippet: 'SPEAKER: The museum considered opening on Monday mornings, but ticket receipts showed poor visitor numbers. We also dismissed evening hours due to lighting costs. Therefore, we decided to introduce Sunday family discounts instead.',
        prompt: 'What measure did the museum management implement?',
        options: ['Monday morning openings', 'Evening exhibition hours', 'Sunday family discounts'],
        correctAnswer: 'Sunday family discounts',
        explanation: 'Hai phương án đầu bị loại bỏ do ít khách và tốn tiền chiếu sáng; giải pháp được chọn là giảm giá cho gia đình vào Chủ Nhật.',
        audioType: 'tts'
      },
      {
        id: 'drill-mcq-3',
        audioSnippet: 'RESEARCHER: We initially planned to use paper questionnaires, but that proved too slow to collect. Some colleagues favoured telephone interviews, yet that was prohibitively costly. In the end, an online survey delivered our target dataset.',
        prompt: 'Which data collection method was finalized?',
        options: ['Paper questionnaires', 'Telephone interviews', 'Online survey'],
        correctAnswer: 'Online survey',
        explanation: 'Khảo sát trực tuyến (online survey) là phương án cuối cùng được lựa chọn sau khi loại bỏ bảng hỏi giấy và phỏng vấn điện thoại.',
        audioType: 'tts'
      }
    ]
  },

  // 6. Matching Information & Opinions
  {
    id: 'l-strat-matching',
    title: 'Nối Thông Tin & Ý Kiến (Matching)',
    subtitle: 'Nối các mục với nhận xét hoặc đánh giá của người nói trong Part 3',
    signalWords: ['found it inspiring', 'rather disappointing', 'too complicated', 'well-structured', 'lacked practical examples'],
    explanation: 'Dạng bài Matching kiểm tra khả năng bắt từ đồng nghĩa diễn đạt cảm xúc/đánh giá. Danh sách lựa chọn A-G thường là các tính từ hoặc nhận xét ngắn. Khi nghe, hãy chú ý nghe ngữ điệu và sắc thái khen/chê của người nói.',
    practiceDrills: [
      {
        id: 'drill-match-1',
        audioSnippet: 'SARAH: The chapter on neural networks was thoroughly explained with clear step-by-step diagrams, which I found remarkably easy to follow.',
        prompt: 'Sarah felt the neural networks chapter was:',
        options: ['Too theoretical', 'Well-explained and clear', 'Outdated and dull'],
        correctAnswer: 'Well-explained and clear',
        explanation: '"thoroughly explained with clear diagrams... easy to follow" = Well-explained and clear.',
        audioType: 'tts'
      },
      {
        id: 'drill-match-2',
        audioSnippet: 'MARK: The historical background section dragged on for over fifty pages without any real relevance to modern practice. It was completely tedious.',
        prompt: 'Mark’s opinion of the historical section was that it was:',
        options: ['Informative', 'Boring and overly long', 'Inspiring'],
        correctAnswer: 'Boring and overly long',
        explanation: '"dragged on... completely tedious" đồng nghĩa với boring and overly long.',
        audioType: 'tts'
      },
      {
        id: 'drill-match-3',
        audioSnippet: 'ANNA: The statistical appendix provided an exceptional breakdown of raw test metrics that really enriched the conclusions.',
        prompt: 'Anna assessed the statistical appendix as:',
        options: ['Inaccurate', 'Extremely helpful and insightful', 'Superficial'],
        correctAnswer: 'Extremely helpful and insightful',
        explanation: '"exceptional breakdown... really enriched the conclusions" thể hiện đánh giá cao về tính hữu ích sâu sắc.',
        audioType: 'tts'
      }
    ]
  },

  // 7. Map & Plan Labelling
  {
    id: 'l-strat-map',
    title: 'Định Hướng Bản Đồ & Sơ Đồ (Map & Plan)',
    subtitle: 'Theo dõi chỉ đường không gian theo góc nhìn của người nói',
    signalWords: ['straight ahead', 'turn right/left', 'adjacent to', 'opposite', 'corridor', 'far corner', 'facing north'],
    explanation: 'Bí quyết số 1: Luôn xác định vị trí xuất phát ("You are here" hoặc Entrance/Foyer). Khi audio bắt đầu, hãy tưởng tượng mình đang bước đi theo từng bước chân của hướng dẫn viên.',
    practiceDrills: [
      {
        id: 'drill-map-1',
        audioSnippet: 'GUIDE: As you enter through the south gate, take the central path. Directly on your right is the Rose Garden, while immediately facing you across the pond is the Glasshouse.',
        prompt: 'The building directly opposite the path across the pond is the:',
        options: ['Rose Garden', 'Glasshouse', 'South Gate'],
        correctAnswer: 'Glasshouse',
        explanation: '"immediately facing you across the pond is the Glasshouse".',
        audioType: 'tts'
      },
      {
        id: 'drill-map-2',
        audioSnippet: 'TOUR LEADER: Standing in the central lobby, take the left hallway towards the cafeteria. The computer lab is situated in the far corner on your left-hand side, just before the emergency exit.',
        prompt: 'Location of computer lab:',
        options: ['Near the cafeteria entrance', 'In the far corner on the left', 'Next to the central lobby'],
        correctAnswer: 'In the far corner on the left',
        explanation: '"situated in the far corner on your left-hand side".',
        audioType: 'tts'
      },
      {
        id: 'drill-map-3',
        audioSnippet: 'WARDEN: From the visitor center courtyard, follow the gravel path northward. You will cross a wooden footbridge, and immediately on your left is the bird hide.',
        prompt: 'The bird hide is located:',
        options: ['Next to the courtyard', 'Immediately left after crossing the wooden footbridge', 'On the south bank'],
        correctAnswer: 'Immediately left after crossing the wooden footbridge',
        explanation: '"immediately on your left" sau khi băng qua cầu gỗ (wooden footbridge).',
        audioType: 'tts'
      }
    ]
  },

  // 8. Sentence Completion
  {
    id: 'l-strat-sentence-completion',
    title: 'Hoàn Thành Câu (Sentence Completion)',
    subtitle: 'Bắt đúng từ nguyên bản và đảm bảo ngữ pháp hoàn chỉnh cho cả câu',
    signalWords: ['paraphrase', 'exact wording', 'word limit', 'grammatical agreement'],
    explanation: 'Trong Sentence Completion, từ điền vào PHẢI lấy nguyên bản từ audio, không được biến đổi từ loại. Sau khi viết đáp án, hãy nhẩm lại cả câu để kiểm tra sự hòa hợp chủ vị (singular/plural) và ngữ pháp.',
    practiceDrills: [
      {
        id: 'drill-sent-1',
        audioSnippet: 'PROFESSOR: Due to excessive groundwater extraction, the coastal soil has experienced gradual subsidence over the past three decades.',
        prompt: 'Excessive extraction of groundwater led to gradual _____ of the soil.',
        correctAnswer: 'subsidence',
        explanation: 'Từ nguyên bản trong bài là "subsidence" (hiện tượng sụt lún).',
        audioType: 'tts'
      },
      {
        id: 'drill-sent-2',
        audioSnippet: 'SPEAKER: The ancient settlement was shielded from maritime storms by a natural barrier reef.',
        prompt: 'The settlement gained protection against storms from a natural barrier _____.',
        correctAnswer: 'reef',
        explanation: 'Cụm từ "barrier reef" (rạn san hô chắn sóng).',
        audioType: 'tts'
      },
      {
        id: 'drill-sent-3',
        audioSnippet: 'BOTANIST: Unlike temperate counterparts, tropical epiphytes draw vital moisture directly from dense atmospheric humidity.',
        prompt: 'Tropical epiphytes obtain necessary moisture directly from atmospheric _____.',
        correctAnswer: 'humidity',
        explanation: 'Từ nguyên văn: "humidity" (độ ẩm không khí).',
        audioType: 'tts'
      }
    ]
  },

  // 9. Short Answer Questions
  {
    id: 'l-strat-short-answer',
    title: 'Trả Lời Ngắn Gọn (Short Answer)',
    subtitle: 'Trả lời trực tiếp câu hỏi nghi vấn trong giới hạn 1–3 từ',
    signalWords: ['What', 'Which', 'Who', 'How much', 'How many', 'Where'],
    explanation: 'Dạng bài này đặt câu hỏi trực tiếp (e.g. "What type of equipment is provided?"). Hãy xác định từ để hỏi (Wh-question) để biết ngay câu trả lời là đồ vật, địa điểm, con người hay thời gian. Tuyệt đối không viết thành cả câu dài.',
    practiceDrills: [
      {
        id: 'drill-short-1',
        audioSnippet: 'NARRATOR: For the field trip, participants are required to carry a waterproof jacket and sturdy hiking boots.',
        prompt: 'What clothing item is needed for rainy conditions? (NO MORE THAN TWO WORDS)',
        correctAnswer: 'waterproof jacket',
        explanation: 'Trang phục chống mưa: "waterproof jacket".',
        audioType: 'tts'
      },
      {
        id: 'drill-short-2',
        audioSnippet: 'COORDINATOR: The seminar will conclude with an open panel discussion followed by an informal networking lunch.',
        prompt: 'What event takes place immediately after the panel discussion? (NO MORE THAN TWO WORDS)',
        correctAnswer: 'networking lunch',
        acceptableAnswers: ['lunch'],
        explanation: '"followed by an informal networking lunch".',
        audioType: 'tts'
      },
      {
        id: 'drill-short-3',
        audioSnippet: 'OFFICER: If applicants miss the initial deadline, they must submit a formal appeal accompanied by a medical certificate.',
        prompt: 'What document is needed if an appeal is submitted? (NO MORE THAN TWO WORDS)',
        correctAnswer: 'medical certificate',
        explanation: 'Văn bản yêu cầu: "medical certificate".',
        audioType: 'tts'
      }
    ]
  },

  // 10. Names, Dates & Addresses
  {
    id: 'l-strat-names-dates-addresses',
    title: 'Tên Riêng, Ngày Tháng & Địa Chỉ',
    subtitle: 'Nắm vững các định dạng tên phố, mã bưu điện và quy ước viết ngày tháng của Anh/Mỹ',
    signalWords: ['Avenue / Road / Street', 'Postcode', 'Ordinal numbers', 'Months of the year'],
    explanation: 'Địa chỉ ở Anh thường gồm: [Số nhà] + [Tên đường] + [Road/Street/Avenue/Drive] + [Postcode]. Postcode là sự kết hợp chữ cái và số (ví dụ: BS8 1TH, SW1A 1AA). Với ngày tháng, bạn có thể viết "14th July" hoặc "July 14" đều được tính điểm.',
    practiceDrills: [
      {
        id: 'drill-nda-1',
        audioSnippet: 'CALLER: The property is located at 47 Highfield Avenue, near the central bus terminal.',
        prompt: 'Property address: 47 Highfield _____',
        correctAnswer: 'Avenue',
        explanation: 'Từ chỉ loại đường: "Avenue".',
        audioType: 'tts'
      },
      {
        id: 'drill-nda-2',
        audioSnippet: 'AGENT: Could you provide the postal code for that parcel? CUSTOMER: Certainly, it is CB2 3QT.',
        prompt: 'Postal code: _____',
        correctAnswer: 'CB2 3QT',
        explanation: 'Đánh vần chuẩn xác mã bưu chính: CB2 3QT.',
        audioType: 'tts'
      },
      {
        id: 'drill-nda-3',
        audioSnippet: 'SECRETARY: The delivery is scheduled to arrive on the twenty-third of November.',
        prompt: 'Delivery date: 23rd _____',
        correctAnswer: 'November',
        explanation: 'Tháng giao hàng: "November".',
        audioType: 'tts'
      }
    ]
  },

  // 11. Numbers & Measurements
  {
    id: 'l-strat-numbers',
    title: 'Số Liệu & Đơn Vị Đo Lường',
    subtitle: 'Phân biệt đuôi -teen vs -ty, số thập phân, tiền tệ và số điện thoại',
    signalWords: ['thirteen / thirty', 'fifteen / fifty', 'point', 'pounds / dollars / euros', 'kilometres / metres'],
    explanation: 'Quy tắc vàng phân biệt đuôi: -TEEN luôn nhấn trọng âm vào âm tiết thứ hai và nguyên âm kéo dài (e.g., four-TEEN), trong khi đuôi -TY nhấn trọng âm vào âm đầu tiên và kết thúc dứt khoát (e.g., FOR-ty). Số 0 trong số điện thoại đọc là "oh" hoặc "zero".',
    practiceDrills: [
      {
        id: 'drill-num-1',
        audioSnippet: 'OFFICER: The return train ticket is seventeen pounds fifty, or seventy pounds if you require first-class accommodation.',
        prompt: 'Standard return fare: £_____',
        options: ['17.50', '70.00', '70.50'],
        correctAnswer: '17.50',
        explanation: '"seventeen fifty" (£17.50) là vé thường, "seventy pounds" là vé hạng nhất.',
        audioType: 'tts'
      },
      {
        id: 'drill-num-2',
        audioSnippet: 'RESEARCHER: The specimen weighed precisely fourteen point five kilograms when extracted from the riverbank.',
        prompt: 'Weight of specimen: _____ kg',
        correctAnswer: '14.5',
        explanation: '"fourteen point five" = 14.5.',
        audioType: 'tts'
      },
      {
        id: 'drill-num-3',
        audioSnippet: 'CLERK: The total room capacity is capped at forty attendees for health and safety compliance.',
        prompt: 'Maximum room capacity: _____ people',
        options: ['14', '40', '44'],
        correctAnswer: '40',
        explanation: '"forty attendees" (nhấn âm đầu FORTY) = 40 người.',
        audioType: 'tts'
      }
    ]
  },

  // 12. Alphabet Spelling
  {
    id: 'l-strat-spelling',
    title: 'Đánh Vần Tên Riêng (Alphabet Spelling)',
    subtitle: 'Nắm chắc các cặp chữ cái dễ nhầm lẫn trong bài nghe Part 1',
    signalWords: ['A / E / I', 'G / J', 'C / S', 'B / P', 'V / W', 'double'],
    explanation: 'Các cặp chữ cái gây mất điểm nhiều nhất trong IELTS: 1) A /eɪ/ vs E /iː/ vs I /aɪ/, 2) G /dʒiː/ vs J /dʒeɪ/, 3) B /biː/ vs P /piː/, 4) V /viː/ vs W /ˈdʌbəl.juː/. Khi gặp từ "double", nghĩa là có 2 chữ cái giống nhau đứng liền nhau (ví dụ: double L = LL).',
    practiceDrills: [
      {
        id: 'drill-spell-1',
        audioSnippet: 'CLERK: And how do you spell your family name? CALLER: It is Sinclair: S-I-N-C-L-A-I-R.',
        prompt: 'Family name: _____',
        correctAnswer: 'Sinclair',
        explanation: 'Đánh vần: S-I-N-C-L-A-I-R.',
        audioType: 'tts'
      },
      {
        id: 'drill-spell-2',
        audioSnippet: 'AGENT: The street name is Wycombe, spelt W-Y-C-O-M-B-E.',
        prompt: 'Street name: _____ Street',
        correctAnswer: 'Wycombe',
        explanation: 'Đánh vần: W-Y-C-O-M-B-E.',
        audioType: 'tts'
      },
      {
        id: 'drill-spell-3',
        audioSnippet: 'SECRETARY: Her first name is Jacinta: J-A-C-I-N-T-A.',
        prompt: 'First name: _____',
        correctAnswer: 'Jacinta',
        explanation: 'Đánh vần: J-A-C-I-N-T-A.',
        audioType: 'tts'
      }
    ]
  },

  // 13. Singular vs Plural
  {
    id: 'l-strat-singular-plural',
    title: 'Danh Từ Số Ít vs Số Nhiều (Singular / Plural)',
    subtitle: 'Lắng nghe âm đuôi -s/-es và kiểm tra mạo từ để không mất điểm oan',
    signalWords: ['a / an', 'these / those', 'various', 'several', 'a pair of', 'ending sound /s/ or /z/'],
    explanation: 'Trong IELTS, nếu đáp án trong audio là số nhiều (e.g., "experiments") mà bạn chỉ viết số ít ("experiment"), câu trả lời sẽ bị chấm SAI 100%. Cách nhận biết: 1) Nghe kỹ âm đuôi xì hơi /s/, /z/, /ɪz/, 2) Nhìn ngữ pháp câu hỏi: nếu không có mạo từ "a/an" trước danh từ đếm được, khả năng cao là số nhiều.',
    practiceDrills: [
      {
        id: 'drill-sing-1',
        audioSnippet: 'SCIENTIST: The team carried out multiple laboratory tests before publishing their initial findings.',
        prompt: 'Published item: initial _____',
        correctAnswer: 'findings',
        explanation: 'Audio đọc rõ âm đuôi số nhiều: "findings" (các phát hiện ban đầu).',
        audioType: 'tts'
      },
      {
        id: 'drill-sing-2',
        audioSnippet: 'INSTRUCTOR: Each student must submit two separate essays at the end of the term.',
        prompt: 'Submission requirement: two _____',
        correctAnswer: 'essays',
        explanation: 'Số từ "two" yêu cầu danh từ số nhiều: "essays".',
        audioType: 'tts'
      },
      {
        id: 'drill-sing-3',
        audioSnippet: 'RANGER: The conservation reserve provides a safe habitat for endangered birds.',
        prompt: 'The reserve provides a safe _____ for wildlife.',
        correctAnswer: 'habitat',
        explanation: 'Mạo từ "a" trước chỗ trống xác nhận danh từ số ít: "habitat".',
        audioType: 'tts'
      }
    ]
  },

  // 14. Part 3 Speaker Opinions
  {
    id: 'l-strat-part3-opinions',
    title: 'Ý Kiến & Tranh Luận trong Part 3',
    subtitle: 'Theo dõi sự thay đổi quan điểm, đồng thuận hoặc bác bỏ giữa các sinh viên',
    signalWords: ['I see your point, but...', 'I would not go that far', 'You have hit the nail on the head', 'I am in two minds about that'],
    explanation: 'Part 3 luôn là cuộc hội thoại học thuật giữa 2-3 người. Người nói thường không đồng ý ngay lập tức mà dùng các cấu trúc nhượng bộ: "Yes, up to a point, but...", "I used to think so, however now...". Hãy kiên nhẫn đợi đến khi họ chốt lại kết luận cuối cùng.',
    practiceDrills: [
      {
        id: 'drill-p3-1',
        audioSnippet: 'LIAM: We could focus our case study on renewable tidal energy. EMMA: Tidal energy is fascinating, but our local university database has very limited papers on it. Wind energy would give us far more accessible evidence. LIAM: You are completely right, let us stick with wind power.',
        prompt: 'The topic chosen by Liam and Emma for their case study is:',
        options: ['Tidal energy', 'Wind power', 'Solar panels'],
        correctAnswer: 'Wind power',
        explanation: 'Tidal energy bị từ chối do thiếu tài liệu. Cả hai chốt chọn: "wind power".',
        audioType: 'tts'
      },
      {
        id: 'drill-p3-2',
        audioSnippet: 'TUTOR: Do you feel the survey sample was representative? SOPHIE: Well, sixty respondents seemed adequate initially, but looking back, nearly all of them were under twenty-five, which definitely skewed our data.',
        prompt: 'Sophie concludes that the survey sample was:',
        options: ['Too small to calculate', 'Biased toward younger people', 'Completely balanced'],
        correctAnswer: 'Biased toward younger people',
        explanation: '"nearly all of them were under twenty-five, which definitely skewed our data" = Biased toward younger people.',
        audioType: 'tts'
      },
      {
        id: 'drill-p3-3',
        audioSnippet: 'ALEX: Should we critique the methodology section first? CHLOE: Actually, Professor Evans explicitly advised us to finalize our literature synthesis before dissecting individual experiment protocols. ALEX: Ah, I had forgotten that note. Let us start with the literature then.',
        prompt: 'What will Alex and Chloe focus on first?',
        options: ['Methodology section', 'Literature synthesis', 'Individual experiment protocols'],
        correctAnswer: 'Literature synthesis',
        explanation: 'Chloe nhắc lại lời giáo sư: hoàn thành "literature synthesis" trước khi phân tích phương pháp.',
        audioType: 'tts'
      }
    ]
  },

  // 15. Part 4 Signposting Language
  {
    id: 'l-strat-part4-signposting',
    title: 'Từ Nối Chuyển Ý Part 4 (Signposting)',
    subtitle: 'Theo dõi bài giảng học thuật liên tục không bị lạc nhịp qua các mốc liên kết',
    signalWords: ['To begin with', 'Moving on to', 'Turning now to', 'Having looked at X, let us now examine Y', 'Finally', 'In summary'],
    explanation: 'Part 4 là bài thuyết trình học thuật độc thoại dài hơn 6 phút không có quãng nghỉ. Cách duy nhất để không bị lạc đề là lắng nghe các "cột mốc chỉ đường" (Signposts) báo hiệu người nói đang chuyển sang một luận điểm mới tương ứng với đề mục tiếp theo trên tờ đề thi.',
    practiceDrills: [
      {
        id: 'drill-sign-1',
        audioSnippet: 'PROFESSOR: Having considered the architectural foundation of the pyramid, let us now turn our attention to the internal ventilation shafts.',
        prompt: 'The lecture topic is now shifting to the:',
        options: ['Construction tools', 'Internal ventilation shafts', 'Exterior limestone coating'],
        correctAnswer: 'Internal ventilation shafts',
        explanation: 'Từ nối chỉ đường: "let us now turn our attention to the internal ventilation shafts".',
        audioType: 'tts'
      },
      {
        id: 'drill-sign-2',
        audioSnippet: 'LECTURER: So much for the economic causes of the migration. Now I would like to examine the psychological factors influencing displaced families.',
        prompt: 'The next aspect the lecturer will examine is:',
        options: ['Economic incentives', 'Psychological factors', 'Government transportation subsidies'],
        correctAnswer: 'Psychological factors',
        explanation: '"Now I would like to examine the psychological factors...".',
        audioType: 'tts'
      },
      {
        id: 'drill-sign-3',
        audioSnippet: 'SPEAKER: In the previous section, we established how oceanic temperatures fluctuate. Moving forward, my next point concerns how these shifts disturb benthic ecosystems.',
        prompt: 'The speaker is now introducing:',
        options: ['Oceanic temperatures overview', 'Disturbance to benthic ecosystems', 'Satellite thermal mapping'],
        correctAnswer: 'Disturbance to benthic ecosystems',
        explanation: '"Moving forward, my next point concerns how these shifts disturb benthic ecosystems".',
        audioType: 'tts'
      }
    ]
  },

  // 16. Correction Language
  {
    id: 'l-strat-correction',
    title: 'Ngôn Ngữ Tự Đính Chính (Correction Language)',
    subtitle: 'Phát hiện khi người nói tự nhận ra mình nói nhầm và sửa lại ngay lập tức',
    signalWords: ['sorry', 'I mean', 'or rather', 'make that', 'no, wait a second', 'did I say X? I meant Y'],
    explanation: 'Trong đời sống hàng ngày, người bản xứ thường buột miệng nói nhầm một con số hay tên gọi rồi tự sửa lại trong vòng 1-2 giây. IELTS đưa chính xác hiện tượng này vào bài thi để thử thách phản xạ của bạn. Ngay khi nghe "sorry", "make that...", hãy gạch ngay con số vừa viết để ghi con số mới.',
    practiceDrills: [
      {
        id: 'drill-corr-1',
        audioSnippet: 'OFFICER: The class was originally scheduled for Room 12, but it has been moved to Room 18.',
        prompt: 'The relocated room number is: _____',
        correctAnswer: '18',
        explanation: 'Phòng ban đầu là 12, phòng sau khi chuyển là 18.',
        audioType: 'tts'
      },
      {
        id: 'drill-corr-2',
        audioSnippet: 'CUSTOMER: I would like to order three tickets for Friday... no, wait a moment, make that four tickets please, my brother is joining us.',
        prompt: 'Number of tickets ordered: _____',
        correctAnswer: '4',
        acceptableAnswers: ['four'],
        explanation: 'Khách đổi từ 3 vé thành 4 vé: "make that four tickets please".',
        audioType: 'tts'
      },
      {
        id: 'drill-corr-3',
        audioSnippet: 'SPEAKER: The flight leaves at 7:15... sorry, my mistake, boarding starts at 7:15, but departure is at 7:50.',
        prompt: 'Actual departure time: _____',
        correctAnswer: '7:50',
        explanation: '7:15 là giờ lên máy bay (boarding), giờ máy bay cất cánh thực tế là 7:50.',
        audioType: 'tts'
      }
    ]
  }
];
