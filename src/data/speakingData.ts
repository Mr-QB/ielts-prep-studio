import { SpeakingNotePart, SpeakingGeneralTips, SpeakingStoryItem } from '../types';

export const SPEAKING_PARTS_DATA: SpeakingNotePart[] = [
  {
    part: 1,
    title: 'Part 1: Phỏng Vấn Ngắn (Everyday Topics)',
    frameworkName: 'Cấu Trúc Tự Nhiên A-R-E (Answer → Reason → Example)',
    formula: 'Answer (1 câu trực tiếp) + Reason (1–2 câu giải thích lý do) + Example / Habit (1 câu ví dụ thực tế)',
    explanation: 'Giám khảo kiểm tra độ trôi chảy (Fluency) và tính tự nhiên. Hãy trả lời thoải mái trong khoảng 3–4 câu (15–20 giây). Tuyệt đối không cần dùng từ ngữ bác học xa lạ như "exceptionally therapeutic" hay "passionate about culinary arts". Trả lời rõ ràng, đúng trọng tâm là chìa khóa đạt Band 6.5+.',
    exampleDemonstration: {
      question: 'Do you enjoy cooking?',
      steps: [
        {
          label: '1. Answer (Trực tiếp & giản dị)',
          text: 'Yes, I do. I actually enjoy preparing meals whenever I have free time.'
        },
        {
          label: '2. Reason (Lý do cụ thể)',
          text: 'I usually cook at home because it helps me relax after a busy day at school or work.'
        },
        {
          label: '3. Example / Habit (Ví dụ thực tế)',
          text: 'For example, I often cook dinner for my family or make simple pasta dishes with my friends at weekends.'
        }
      ]
    },
    usefulFrames: [
      'Yes, definitely. I usually [action] because it helps me...',
      'To be honest, it really depends on the day. When I have spare time,...',
      'I have always enjoyed [action] since I was younger.',
      'As a matter of fact, I try to [action] on a regular basis, usually...'
    ],
    commonTopics: [
      {
        topic: 'Work / Study',
        sampleQuestions: [
          'Do you work or are you a student?',
          'Why did you choose this field of study?',
          'What do you enjoy most about your daily study or work routine?'
        ]
      },
      {
        topic: 'Hometown & Living',
        sampleQuestions: [
          'Where is your hometown located?',
          'What do you like most about living there?',
          'Do you prefer living in a house or an apartment?'
        ]
      },
      {
        topic: 'Daily Routine',
        sampleQuestions: [
          'What time do you usually wake up in the morning?',
          'What do you like to do to unwind in the evening?',
          'How do you typically spend your weekends?'
        ]
      }
    ]
  },
  {
    part: 2,
    title: 'Part 2: Bài Độc Thoại 2 Phút (The Long Turn)',
    frameworkName: 'Cấu Trúc Kể Chuyện P-P-F (Past → Present → Future Feelings)',
    formula: 'Bắt đầu trực tiếp (10s) → Bối cảnh quá khứ (30s) → Diễn biến chính (50s) → Cảm xúc & tác động (30s)',
    explanation: 'Bạn có 1 phút chuẩn bị và 2 phút nói. Đừng trả lời từng câu gạch đầu dòng rời rạc; hãy liên kết thành một câu chuyện hoàn chỉnh. Xem phần My Story Bank bên dưới để tái sử dụng một câu chuyện cho nhiều đề khác nhau.',
    exampleDemonstration: {
      question: 'Describe an achievement you are proud of.',
      steps: [
        {
          label: 'Mở đầu trực tiếp',
          text: 'I would like to talk about a university robotics project that our team completed last year.'
        },
        {
          label: 'Bối cảnh & Thử thách',
          text: 'At first, we faced a major obstacle because our sensor code had repeated errors and we only had two weeks left.'
        },
        {
          label: 'Cách giải quyết',
          text: 'We worked together late every evening, divided the workload clearly, and finally tested the machine successfully.'
        },
        {
          label: 'Cảm xúc & Bài học',
          text: 'I felt extremely proud and relieved because it taught me the true value of persistence and effective teamwork.'
        }
      ]
    },
    usefulFrames: [
      'Today I would like to share a story about...',
      'It happened roughly two years ago when I was...',
      'What made this experience particularly memorable was...',
      'Looking back, I learned a valuable lesson about...'
    ],
    commonTopics: [
      {
        topic: 'Person & Role Model',
        sampleQuestions: [
          'Describe a person who has inspired you to achieve a goal.',
          'Describe a teacher or mentor who influenced your academic path.',
          'Describe an elderly person you respect.'
        ]
      },
      {
        topic: 'Experience & Milestone',
        sampleQuestions: [
          'Describe a difficult task or project you completed successfully.',
          'Describe a memorable trip you took with close friends.',
          'Describe a time you learned an essential life skill.'
        ]
      },
      {
        topic: 'Place & Environment',
        sampleQuestions: [
          'Describe a quiet place where you like to relax.',
          'Describe a historic building or scenic town you visited.'
        ]
      }
    ]
  },
  {
    part: 3,
    title: 'Part 3: Thảo Luận Hai Chiều (Two-Way Discussion)',
    frameworkName: 'Cấu Trúc Mở Rộng Ý (Direct Opinion → Reasons → Example → Future/Counter)',
    formula: 'Direct answer → One main reason → Example → On the other hand / Future outlook',
    explanation: 'Giám khảo không hỏi về cá nhân bạn nữa mà hỏi về xã hội và xu hướng chung. Luôn nói ở góc độ cộng đồng ("people", "governments", "society").',
    exampleDemonstration: {
      question: 'Why do many people prefer shopping online rather than in physical stores?',
      steps: [
        {
          label: '1. Nêu luận điểm chính',
          text: 'I think there are two main reasons for this growing trend.'
        },
        {
          label: '2. Lý do 1 + Giải thích',
          text: 'The primary factor is convenience. People can compare prices and place orders from home without wasting time in traffic.'
        },
        {
          label: '3. Ví dụ',
          text: 'For example, during holiday sales, online platforms offer instant home delivery.'
        },
        {
          label: '4. Mặt trái hoặc tương lai',
          text: 'However, physical stores still matter because customers cannot examine the actual quality of clothes or food online.'
        }
      ]
    },
    usefulFrames: [
      'I think there are two main reasons for this.',
      'One major factor is that...',
      'For instance, in many developing countries,...',
      'However, this might be quite different for older generations.',
      'In the future, I believe we will see more...'
    ],
    commonTopics: [
      {
        topic: 'Technology & Social Connection',
        sampleQuestions: [
          'How has digital communication altered interpersonal relationships?',
          'Will artificial intelligence replace human teachers in the future?',
          'What are the negative effects of excessive screen exposure on youth?'
        ]
      },
      {
        topic: 'Education & Employment',
        sampleQuestions: [
          'Should university education be accessible free of charge to everyone?',
          'What qualities make an effective employee in the modern workforce?',
          'Is practical vocational training more useful than theoretical knowledge?'
        ]
      },
      {
        topic: 'Environment & Urban Living',
        sampleQuestions: [
          'Why do young professionals tend to gravitate toward large metropolitan areas?',
          'Whose responsibility is it to combat plastic pollution: individuals or governments?'
        ]
      }
    ]
  }
];

export const SPEAKING_GENERAL_TIPS: SpeakingGeneralTips = {
  fillers: [
    { phrase: 'Well, to be perfectly honest,...', context: 'Dùng khi cần 1-2s mở đầu suy nghĩ cho câu hỏi Part 1 & Part 3' },
    { phrase: 'That is a rather intriguing question, let me think...', context: 'Dùng khi gặp câu hỏi khó hoặc lạ cần tổ chức ý tưởng' },
    { phrase: 'As far as I can recall,...', context: 'Dùng khi gợi nhớ lại trải nghiệm trong quá khứ (Part 2)' },
    { phrase: 'From my personal standpoint,...', context: 'Dùng để mở đầu quan điểm cá nhân trong Part 3' }
  ],
  elongationTechniques: [
    {
      strategy: 'Kỹ thuật AREA (Answer - Reason - Example - Alternative)',
      prompt: 'Trả lời trực tiếp -> Đưa ra lý do -> Cho 1 ví dụ cụ thể -> Nêu tình huống ngược lại.',
      example: 'I enjoy cycling. Primarily because it helps me unwind after intense study hours. For instance, every Sunday morning I ride around the local lake with friends. If I stayed indoors all day, I would feel lethargic.'
    },
    {
      strategy: 'Kỹ thuật So sánh quá khứ vs Hiện tại',
      prompt: 'Nói về sự thay đổi sở thích hoặc thói quen theo thời gian.',
      example: 'Back in high school, I was obsessed with video games. However, nowadays I lean towards outdoor activities like badminton.'
    },
    {
      strategy: 'Kỹ thuật Phân tầng đối tượng (Part 3)',
      prompt: 'Không vơ đũa cả nắm: chia theo giới trẻ vs người lớn tuổi, hoặc thành thị vs nông thôn.',
      example: 'Well, it depends largely on demographics. Younger generations tend to embrace cashless payments, whereas elderly citizens still favor paper currency for tangible security.'
    }
  ],
  handlingUnknownWords: [
    {
      strategy: 'Mô tả công dụng hoặc hình dáng (Paraphrasing the unknown word)',
      template: 'It is a kind of object that people use when they need to... / I cannot recall the exact technical term, but it basically functions like a...'
    },
    {
      strategy: 'Thành thật và chuyển ngữ cảnh khéo léo',
      template: 'The precise term escapes me at the moment, but what I mean is...'
    }
  ],
  selfCorrection: [
    {
      strategy: 'Tự sửa thì hoặc mạo từ nhanh gọn mà không ngập ngừng lâu',
      template: 'She go—I mean, she went there yesterday.'
    },
    {
      strategy: 'Nâng cấp từ ngữ vừa nói',
      template: 'It had a huge impact, or more precisely, a profound influence on my outlook.'
    }
  ],
  chatGptPrompts: [
    {
      label: 'Mô phỏng Giám khảo thi Part 1',
      description: 'Luyện phản xạ Part 1 từng câu một với phản hồi tự nhiên.',
      prompt: `Please act as an IELTS Speaking examiner assessing my Part 1 answers.
Ask me one Part 1 question at a time. After I answer, provide brief feedback on fluency and lexical naturalness, then ask the next question.`
    },
    {
      label: 'Chấm & Nâng cấp bài nói Part 2 Cue Card',
      description: 'Dán bài nói Part 2 để nhận gợi ý nâng cấp collocation và ngữ pháp.',
      prompt: `Please act as an IELTS Speaking examiner assessing my Part 2 cue card performance.
Provide: 1. Lexical upgrades (Band 6.5 -> 7.5+), 2. Grammatical range feedback, 3. A natural polished version keeping my original story.`
    },
    {
      label: 'Luyện phản xạ tư duy Part 3 (Phản biện xã hội)',
      description: 'Luyện trả lời các câu hỏi trừu tượng mang tính vĩ mô.',
      prompt: `You are an IELTS examiner for Speaking Part 3.
Ask me deep, probing Part 3 questions one by one. If my answer is too brief or only personal, challenge me to explain societal perspectives.`
    }
  ],
  fluencyTips: [
    'Nói với tốc độ tự nhiên, không cố bắn từ quá nhanh để rồi vấp ngắt quãng.',
    'Dùng filler tự nhiên khi suy nghĩ: "Well, that is an interesting question...", "To be fair...", "Let me think for a second..."'
  ],
  lexicalTips: [
    'Ưu tiên dùng collocation chính xác thay vì nhồi nhét từ hiếm sai ngữ cảnh.',
    'Tự nhiên hóa câu trả lời bằng phrasal verbs phổ biến: get along with, look forward to, run into.'
  ],
  grammarTips: [
    'Kiểm soát thì quá khứ (Past Simple) khi kể chuyện trong Part 2.',
    'Dùng mệnh đề phức đơn giản với because, although, when để tạo cấu trúc câu phong phú.'
  ],
  pronunciationTips: [
    'Nói rõ âm đuôi (ending sounds: -s, -ed, -t, -k).',
    'Nhấn mạnh vào từ mang thông tin chính (content words).'
  ]
};

// ==========================================
// MY STORY BANK: 10 REUSABLE STORIES FOR PART 2 & 3
// ==========================================
export const MY_STORY_BANK: SpeakingStoryItem[] = [
  {
    id: 'story-robot-project',
    title: 'Dự Án Robot Khó Khăn (A Difficult Robot Project)',
    category: 'project',
    tagline: 'Câu chuyện vạn năng: Một thử thách khó khăn, một thành tích, làm việc nhóm, một lần vượt qua áp lực, tin vui, học kỹ năng mới.',
    applicableCueCards: [
      'Describe a difficult task you completed',
      'Describe an achievement you are proud of',
      'Describe a project you worked on with other people',
      'Describe a time you learned a new skill',
      'Describe a piece of good news you received'
    ],
    shortVersion: 'Năm ngoái, nhóm của tôi tại trường đại học tham gia một cuộc thi chế tạo robot dọn rác tự động. Chúng tôi gặp sự cố cảm biến chỉ 1 tuần trước hạn chót, nhưng nhờ làm việc nhóm thâu đêm và kiên trì gỡ lỗi mã nguồn, robot đã hoạt động hoàn hảo và đoạt giải Ba.',
    extendedVersion: 'Roughly a year ago, my teammates and I decided to enter a robotics design competition at our university. Our goal was to build a compact automated cleaning robot. Everything went smoothly until just a week before the deadline, when our primary distance sensors failed to respond properly. We were under immense stress, but instead of giving up, we split the tasks: two members checked the wiring while I rewrote the navigation code. After three nights of debugging, it worked flawlessly on competition day and we earned the third-place award. This experience taught me the true power of calm collaboration under pressure.',
    usefulVocab: [
      { phrase: 'under immense pressure', meaningVi: 'dưới áp lực rất lớn' },
      { phrase: 'debug the code', meaningVi: 'gỡ lỗi chương trình' },
      { phrase: 'work flawlessly', meaningVi: 'hoạt động hoàn hảo không tì vết' },
      { phrase: 'split the workload', meaningVi: 'phân chia khối lượng công việc' }
    ],
    feelingsVocab: ['stressed at first', 'determined', 'relieved and thrilled', 'profoundly grateful']
  },
  {
    id: 'story-memorable-trip',
    title: 'Chuyến Đi Leo Núi Đáng Nhớ (A Memorable Mountain Trek)',
    category: 'trip',
    tagline: 'Câu chuyện vạn năng: Một chuyến đi xa, một địa điểm yên tĩnh, một thử thách thể chất, một trải nghiệm cùng bạn bè, lần đầu làm điều gì đó.',
    applicableCueCards: [
      'Describe a trip you will never forget',
      'Describe a quiet place you visited',
      'Describe an outdoor activity you enjoyed',
      'Describe a time you were close to nature',
      'Describe a memorable journey with friends'
    ],
    shortVersion: 'Tôi và hai người bạn thân đã đi leo đỉnh núi Fansipan vào mùa xuân. Chuyến đi đầy sương mù và dốc đá đứng, nhưng khi chạm đến đỉnh trong ánh bình minh, tôi cảm thấy sự yên bình và tự hào chưa từng có.',
    extendedVersion: 'Last spring, two of my closest friends and I planned a hiking trip to the mountains. The weather was unpredictable, and after four hours of climbing steep, muddy paths through thick fog, our legs were completely exhausted. However, when we finally reached the summit just as the sun was rising above the sea of clouds, the view was breathtaking. Breathing the crisp morning air and leaving the busy city behind gave me a sense of inner peace that I still cherish today.',
    usefulVocab: [
      { phrase: 'breathtaking scenery', meaningVi: 'phong cảnh đẹp nghẹt thở' },
      { phrase: 'steep and rocky paths', meaningVi: 'những con đường đá dốc đứng' },
      { phrase: 'crisp morning air', meaningVi: 'không khí buổi sáng trong lành' },
      { phrase: 'recharge my batteries', meaningVi: 'nạp lại năng lượng tinh thần' }
    ],
    feelingsVocab: ['exhausted yet excited', 'peaceful', 'amazed by nature', 'sense of accomplishment']
  },
  {
    id: 'story-inspiring-teacher',
    title: 'Người Thầy Truyền Cảm Hứng (An Inspiring Teacher)',
    category: 'person',
    tagline: 'Câu chuyện vạn năng: Người bạn ngưỡng mộ, người dạy bạn một kỹ năng quan trọng, một cuộc trò chuyện ý nghĩa, một người lớn tuổi đáng kính.',
    applicableCueCards: [
      'Describe a person you admire',
      'Describe a teacher who influenced you',
      'Describe an older person you respect',
      'Describe an important conversation you had',
      'Describe someone who helped you make a good decision'
    ],
    shortVersion: 'Thầy Minh, giáo viên dạy tiếng Anh cấp 3 của tôi, là người đã giúp tôi vượt qua sự tự ti khi nói tiếng Anh bằng sự kiên nhẫn và phương pháp khuyến khích không phán xét.',
    extendedVersion: 'When I was in high school, I was terrified of speaking English in front of others because I was afraid of making silly grammatical mistakes. Mr. Minh, my English teacher, noticed my hesitation. Instead of criticizing errors, he encouraged me to focus on getting my message across. He spent extra time after class listening to my practice talks and recommending simple English podcasts. His supportive guidance gave me the confidence to communicate freely, which shaped my entire academic journey.',
    usefulVocab: [
      { phrase: 'patient and approachable', meaningVi: 'kiên nhẫn và dễ gần' },
      { phrase: 'boost my self-confidence', meaningVi: 'nâng cao sự tự tin' },
      { phrase: 'supportive mentor', meaningVi: 'người thầy/người dẫn dắt tận tâm' },
      { phrase: 'shape my perspective', meaningVi: 'định hình góc nhìn cuộc sống' }
    ],
    feelingsVocab: ['deeply respected', 'encouraged', 'forever grateful']
  }
];
