import { ListeningStrategyLesson } from '../types';

export const LISTENING_STRATEGY_LESSONS: ListeningStrategyLesson[] = [
  // 1. Distractors (Bẫy đổi ý)
  {
    id: 'l-strat-distractor',
    title: 'Bẫy Đổi Ý (Distractors & Correction)',
    subtitle: 'Nhận diện khi người nói đưa ra thông tin đầu tiên rồi sau đó đính chính lại',
    signalWords: ['but', 'actually', 'however', 'instead', 'changed to', 'rather than', 'I thought... but in fact', 'originally'],
    explanation: 'Trong bài thi IELTS Listening (đặc biệt Part 1 và Part 3), người nói hầu như luôn đề cập đến phương án sai trước. Sau đó họ dùng một từ phát tín hiệu (signal word) để đính chính sang đáp án đúng. Đừng bao giờ vội viết ngay con số hoặc ngày tháng đầu tiên bạn nghe được!',
    audioExample: {
      audioText: '"We originally scheduled the conference for Tuesday the 14th, but the keynote speaker was delayed, so we actually shifted it to Thursday the 16th."',
      questionPrompt: 'Conference date: _____',
      wrongAnswer: 'Tuesday 14th (hoặc Tuesday)',
      correctAnswer: 'Thursday 16th (hoặc 16th)',
      whyWrong: 'Tuesday 14th là thông tin ban đầu (first information) đã bị phủ định bởi "but".',
      signalUsed: 'but... actually shifted it to...'
    },
    practiceDrills: [
      {
        id: 'drill-dist-1',
        audioSnippet: 'CUSTOMER: I was hoping to book the compact hatchback for 35 dollars a day. AGENT: Ah, that model is currently undergoing servicing. We do have our mid-size sedan available instead for 42 dollars.',
        prompt: 'The customer will rent a vehicle for $_____ per day.',
        options: ['35', '42', '77'],
        correctAnswer: '42',
        explanation: 'Khách định chọn giá $35 ("I was hoping..."), nhưng nhân viên báo xe đang bảo dưỡng và đưa ra phương án thay thế ("instead for 42 dollars").'
      },
      {
        id: 'drill-dist-2',
        audioSnippet: 'SPEAKER: The workshop was initially arranged in Room 204. However, owing to the large turnout, we have relocated to the Main Auditorium on the third floor.',
        prompt: 'The workshop venue is now the:',
        options: ['Room 204', 'Main Auditorium', 'Ground Floor Library'],
        correctAnswer: 'Main Auditorium',
        explanation: 'Từ tín hiệu "However... relocated to" chỉ ra địa điểm thực tế cuối cùng là Main Auditorium.'
      },
      {
        id: 'drill-dist-3',
        audioSnippet: 'CALLER: Could you confirm my appointment time? I noted down 10:15 in my diary. SECRETARY: Let me check the schedule. Ah, Dr. Miller requested an extra 15 minutes, so it is actually set for 10:30.',
        prompt: 'Confirmed appointment time: _____',
        options: ['10:15', '10:30', '10:45'],
        correctAnswer: '10:30',
        explanation: 'Giờ trong sổ là 10:15, nhưng sau khi kiểm tra: "actually set for 10:30".'
      }
    ]
  },

  // 2. Spelling & Numbers
  {
    id: 'l-strat-spelling-numbers',
    title: 'Đánh Vần Tên Riêng & Số Liệu',
    subtitle: 'Nắm chắc chữ cái dễ nhầm lẫn và cách phát âm chữ số trong Part 1',
    signalWords: ['double', 'zero / oh', 'hyphen', 'postcode', 'spelt with'],
    explanation: 'IELTS Listening thường kiểm tra các cặp chữ cái dễ nhầm: A / E / I, G / J, C / S, B / P, V / W. Với chữ số: chú ý đuôi -teen (nhấn trọng âm dài, e.g. fifTEEN) vs đuôi -ty (nhấn âm đầu, e.g. FIF-ty). Số 0 thường được đọc là "oh" hoặc "zero".',
    practiceDrills: [
      {
        id: 'drill-spell-1',
        audioSnippet: 'CLERK: And your surname is MacIntyre? CALLER: Yes, that is M-A-C, capital I-N-T-Y-R-E.',
        prompt: 'Caller surname: _____',
        correctAnswer: 'MacIntyre',
        explanation: 'Đánh vần từng chữ: M-A-C-I-N-T-Y-R-E.'
      },
      {
        id: 'drill-num-2',
        audioSnippet: 'AGENT: The monthly membership fee is fifteen pounds, but if you sign up for an annual pass, it drops to thirteen pounds fifty.',
        prompt: 'Standard monthly fee: £_____',
        options: ['50', '15', '13.50'],
        correctAnswer: '15',
        explanation: '"fifteen" (£15) là phí tháng tiêu chuẩn, "thirteen fifty" là gói năm.'
      }
    ]
  },

  // 3. Map & Plan Labelling
  {
    id: 'l-strat-map',
    title: 'Định Hướng Bản Đồ (Map & Plan)',
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
        explanation: '"immediately facing you across the pond is the Glasshouse".'
      }
    ]
  },

  // 4. Multiple Choice & Rejecting Options
  {
    id: 'l-strat-mcq',
    title: 'Multiple Choice trong Part 2 & 3',
    subtitle: 'Tại sao cả 3 phương án đều được nhắc tới và cách loại trừ',
    signalWords: ['we considered', 'too expensive', 'not feasible', 'agreed upon', 'unanimously decided'],
    explanation: 'Trong Part 3 tranh luận, 2 người nói sẽ nhắc đến CẢ 3 LỰA CHỌN A, B, C. Người nói A có thể đề xuất phương án A, nhưng người nói B phản bác là quá đắt hoặc không khả thi. Đáp án đúng là điều mà CẢ HAI BÊN CÙNG ĐỒNG Ý.',
    practiceDrills: [
      {
        id: 'drill-mcq-1',
        audioSnippet: 'STUDENT A: Should we base our presentation on urban agriculture? STUDENT B: I thought about that, but there is far too much data to cover in ten minutes. STUDENT A: Fair point. How about plastic waste recycling? STUDENT B: Perfect, that is much more concise.',
        prompt: 'Which topic did the students ultimately agree to present?',
        options: ['Urban agriculture', 'Plastic waste recycling', 'Renewable energy'],
        correctAnswer: 'Plastic waste recycling',
        explanation: 'Nông nghiệp đô thị bị loại vì quá nhiều dữ liệu ("too much data"). Cả hai thống nhất chọn: Plastic waste recycling ("Perfect, that is much more concise").'
      }
    ]
  }
];
