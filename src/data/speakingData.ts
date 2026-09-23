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
// MY STORY BANK: 12 REUSABLE STORIES FOR PART 2 & 3
// ==========================================
export const MY_STORY_BANK: SpeakingStoryItem[] = [
  // 1. Difficult Project
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

  // 2. Inspiring Teacher / Person
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
  },

  // 3. Memorable Trip
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

  // 4. Useful Object
  {
    id: 'story-useful-object',
    title: 'Tai Nghe Chống Ồn Hữu Ích (Noise-Cancelling Headphones)',
    category: 'object',
    tagline: 'Câu chuyện vạn năng: Một món đồ bạn mua thấy rất đáng tiền, một đồ dùng bạn không thể thiếu, một thiết bị hỗ trợ học tập, một món quà ý nghĩa.',
    applicableCueCards: [
      'Describe something you bought that was very useful',
      'Describe an electronic device you use every day',
      'Describe an object you could not live without',
      'Describe a gift you received that you really liked'
    ],
    shortVersion: 'Tôi đã mua một chiếc tai nghe chống ồn trước kỳ thi quan trọng. Thiết bị này giúp tôi tập trung học bài trong ký túc xá ồn ào và các quán cà phê đông đúc, cải thiện đáng kể hiệu suất học tập.',
    extendedVersion: 'I would like to talk about a pair of wireless noise-cancelling headphones that I bought roughly six months ago. At that time, I was preparing for an important university exam, but my dormitory room was constantly noisy because of nearby street traffic. After saving up for two months, I purchased these headphones. The active noise reduction feature blocks out background chatter completely, creating an instant quiet zone wherever I sit down. It has become an essential companion for listening to English lectures and staying focused for long study sessions.',
    usefulVocab: [
      { phrase: 'blocks out background chatter', meaningVi: 'chặn hoàn toàn tiếng ồn xung quanh' },
      { phrase: 'an essential companion', meaningVi: 'người bạn đồng hành không thể thiếu' },
      { phrase: 'boost my concentration', meaningVi: 'tăng cường độ tập trung' },
      { phrase: 'worth every penny', meaningVi: 'hoàn toàn xứng đáng từng đồng tiền' }
    ],
    feelingsVocab: ['delighted', 'productive', 'calm and focused']
  },

  // 5. Technology / Device
  {
    id: 'story-technology-device',
    title: 'Máy Tính Bảng Đọc Sách & Ghi Chú (Digital Study Tablet)',
    category: 'object',
    tagline: 'Câu chuyện vạn năng: Công nghệ hiện đại bạn dùng cho học tập, một thói quen mới tốt, thiết bị thay đổi cách bạn làm việc.',
    applicableCueCards: [
      'Describe a piece of technology you find useful',
      'Describe something you use for your study or work',
      'Describe a positive change in your daily routine',
      'Describe an item you saved money to purchase'
    ],
    shortVersion: 'Chiếc máy tính bảng kèm bút cảm ứng đã thay đổi hoàn toàn cách tôi đọc tài liệu IELTS và ghi chú bài giảng, giúp tôi từ bỏ thói quen in hàng trăm trang giấy tốn kém.',
    extendedVersion: 'An invaluable device in my daily life is a lightweight digital tablet equipped with a stylus pen. Prior to getting it, my desk was permanently cluttered with piles of printed test papers and heavy textbooks. With this tablet, I can download research articles, highlight key vocabulary directly on PDF documents, and organize my notes into tidy digital notebooks. It is extremely portable, so I can review vocabulary and read articles on the bus or during lunch breaks without carrying a heavy backpack.',
    usefulVocab: [
      { phrase: 'cluttered with paper', meaningVi: 'bừa bộn ngập tràn giấy tờ' },
      { phrase: 'highly portable', meaningVi: 'rất dễ dàng mang theo bên mình' },
      { phrase: 'organize notes systematically', meaningVi: 'sắp xếp ghi chú một cách có hệ thống' },
      { phrase: 'paperless lifestyle', meaningVi: 'lối sống không dùng giấy' }
    ],
    feelingsVocab: ['organized', 'efficient', 'environmentally friendly']
  },

  // 6. Challenge / Mistake
  {
    id: 'story-challenge-mistake',
    title: 'Sự Cố Lỡ Chuyến Tàu & Bài Học Bình Tĩnh (A Missed Train Adventure)',
    category: 'challenge',
    tagline: 'Câu chuyện vạn năng: Một sai lầm bạn mắc phải, một lần bạn phải đổi kế hoạch phút chót, một tình huống căng thẳng bạn giải quyết bình tĩnh.',
    applicableCueCards: [
      'Describe a mistake you made in the past',
      'Describe a time you had to change your plan quickly',
      'Describe a stressful situation and how you handled it',
      'Describe an unexpected event that happened to you'
    ],
    shortVersion: 'Tôi đã nhìn nhầm giờ khởi hành trên vé tàu về quê và đến ga muộn 15 phút. Thay vì hoảng loạn, tôi đã đến quầy chăm sóc khách hàng xin đổi vé sang chuyến kế tiếp và dùng thời gian chờ để đọc xong một cuốn sách hay.',
    extendedVersion: 'A memorable challenge occurred last year when I was traveling home for the Lunar New Year holiday. I mistakenly misread the departure time on my railway app and assumed the train left at 3:30 PM instead of 3:00 PM. When I arrived at the platform, the train had already pulled away. Initially, I felt panicked because tickets were scarce during the holiday rush. However, I took a deep breath, went straight to the customer service counter, and politely explained my honest oversight. Fortunately, a clerk found a cancellation on a train two hours later. That mishap taught me to double-check details and remain composed in unforeseen emergencies.',
    usefulVocab: [
      { phrase: 'misread the departure time', meaningVi: 'nhìn nhầm giờ tàu chạy' },
      { phrase: 'remain composed', meaningVi: 'giữ được sự bình tĩnh điềm đạm' },
      { phrase: 'an honest oversight', meaningVi: 'sơ suất vô ý thật lòng' },
      { phrase: 'handle unexpected delays', meaningVi: 'xử lý sự chậm trễ bất ngờ' }
    ],
    feelingsVocab: ['flustered at first', 'relieved', 'learned a valuable lesson']
  },

  // 7. Achievement
  {
    id: 'story-achievement',
    title: 'Hoàn Thành Cuộc Chạy Bộ 10 Kilomet (Finishing a 10km Charity Run)',
    category: 'achievement',
    tagline: 'Câu chuyện vạn năng: Một thành tích cá nhân, một thử thách thể chất, một lần bạn kiên trì đến cùng, một sự kiện thể thao.',
    applicableCueCards: [
      'Describe an achievement you are proud of',
      'Describe a sporting event you participated in',
      'Describe a time you pushed your personal limits',
      'Describe a healthy habit you developed'
    ],
    shortVersion: 'Tôi chưa bao giờ là người giỏi thể thao, nhưng đã đăng ký giải chạy 10km vì cộng đồng. Nhờ tập luyện đều đặn mỗi sáng suốt 3 tháng, tôi đã vượt qua vạch đích và học được bài học về tính kiên định.',
    extendedVersion: 'I would like to describe the day I crossed the finish line of a 10-kilometer charity run in my hometown. In secondary school, I was never physically athletic and would get winded after just a few minutes of jogging. However, early last year, I made a resolution to build stamina and signed up for this community run. I woke up at 5:30 AM four days a week to follow a structured running program. On the day of the event, my legs started cramping around the eighth kilometer, but cheering spectators encouraged me to keep moving forward. Crossing the finish line in under 65 minutes gave me a tremendous sense of pride and proved that consistency conquers self-doubt.',
    usefulVocab: [
      { phrase: 'push personal limits', meaningVi: 'vượt qua giới hạn bản thân' },
      { phrase: 'build stamina and endurance', meaningVi: 'xây dựng thể lực và sức bền' },
      { phrase: 'a tremendous sense of pride', meaningVi: 'cảm giác tự hào to lớn' },
      { phrase: 'consistency conquers doubt', meaningVi: 'sự kiên trì chiến thắng sự nghi ngờ' }
    ],
    feelingsVocab: ['physically exhausted', 'proud', 'empowered and energized']
  },

  // 8. Helping Someone
  {
    id: 'story-helping-someone',
    title: 'Giúp Đỡ Người Hàng Xóm Lớn Tuổi (Helping an Elderly Neighbour)',
    category: 'good-news',
    tagline: 'Câu chuyện vạn năng: Một lần bạn giúp đỡ ai đó, một hành động tử tế, một người hàng xóm bạn quý mến, một hoạt động cộng đồng.',
    applicableCueCards: [
      'Describe a time you helped someone',
      'Describe a kind person or action you remember',
      'Describe an occasion when you gave practical assistance',
      'Describe a neighbour you have a good relationship with'
    ],
    shortVersion: 'Tôi đã giúp bác Tuấn, người hàng xóm 70 tuổi neo đơn, dọn dẹp khu vườn sau bão và hướng dẫn bác cách gọi video với con cháu ở xa trên điện thoại thông minh.',
    extendedVersion: 'An experience that brought me genuine joy was helping Mr. Tuan, an elderly gentleman who lives next door to my family. After a severe autumn storm, strong winds broke several large branches in his front courtyard and knocked over his potted plants. Being in his early seventies, he could not clear the heavy debris on his own. I spent an entire Saturday afternoon cutting branches, clearing fallen leaves, and resetting the flower pots. Afterwards, he invited me in for green tea and I also showed him how to make video calls to his grandchildren on his smartphone. Seeing the broad smile on his face reminded me how small neighbourly acts can brighten someone’s life.',
    usefulVocab: [
      { phrase: 'clear fallen debris', meaningVi: 'dọn dẹp cành cây đất đá đổ ngổn ngang' },
      { phrase: 'a neighbourly gesture', meaningVi: 'nghĩa cử xóm giềng đẹp đẽ' },
      { phrase: 'bring genuine joy', meaningVi: 'mang lại niềm vui chân thành' },
      { phrase: 'bridge the generation gap', meaningVi: 'thu hẹp khoảng cách thế hệ' }
    ],
    feelingsVocab: ['warmhearted', 'useful to others', 'deeply touched']
  },

  // 9. Interesting Event
  {
    id: 'story-interesting-event',
    title: 'Lễ Hội Đèn Lồng Truyền Thống (The Traditional Lantern Festival)',
    category: 'event',
    tagline: 'Câu chuyện vạn năng: Một lễ hội truyền thống, một sự kiện văn hóa thú vị, một dịp đông vui bạn tham gia, phong tục tập quán.',
    applicableCueCards: [
      'Describe an interesting festival or cultural event',
      'Describe a colourful celebration in your hometown',
      'Describe an event that brought people together',
      'Describe a traditional custom you enjoy'
    ],
    shortVersion: 'Tôi đã tham gia lễ hội thả đèn lồng Trung Thu tại khu phố cổ. Ánh sáng ấm áp từ hàng trăm chiếc đèn lồng thủ công và tiếng cười của trẻ em tạo nên bầu không khí văn hóa đặc biệt khó quên.',
    extendedVersion: 'I want to share my memories of the Mid-Autumn Lantern Festival that took place in our ancient town district last September. The narrow streets were illuminated with hundreds of handmade lanterns shaped like stars, carp, and lotus blossoms. Local artisans demonstrated traditional lantern crafting while families gathered along the riverbank to release paper boats carrying small candles onto the calm water. The blend of folk music, the scent of seasonal pastries, and the vibrant laughter of children created an atmosphere of pure cultural harmony that I will always remember.',
    usefulVocab: [
      { phrase: 'illuminated with lanterns', meaningVi: 'được thắp sáng rực rỡ bởi đèn lồng' },
      { phrase: 'traditional craftsmanship', meaningVi: 'nghề thủ công truyền thống' },
      { phrase: 'vibrant atmosphere', meaningVi: 'bầu không khí sôi động, rộn ràng' },
      { phrase: 'cherish cultural heritage', meaningVi: 'trân trọng di sản văn hóa' }
    ],
    feelingsVocab: ['fascinated', 'nostalgic', 'spirit of community']
  },

  // 10. New Skill
  {
    id: 'story-new-skill',
    title: 'Học Nấu Ăn Lành Mạnh Độc Lập (Learning to Cook Healthy Meals)',
    category: 'skill',
    tagline: 'Câu chuyện vạn năng: Một kỹ năng sống bạn tự học, một lần bạn tự lập, một thay đổi tích cực trong lối sống, kỹ năng ngoài trường học.',
    applicableCueCards: [
      'Describe a practical skill you learned recently',
      'Describe something you learned on your own',
      'Describe a positive change in your lifestyle',
      'Describe an activity you found challenging at first'
    ],
    shortVersion: 'Khi bắt đầu sống tự lập lúc vào đại học, tôi quyết định học nấu các món ăn cân bằng dinh dưỡng. Từ việc hay làm cháy thức ăn, giờ tôi có thể chuẩn bị bữa tối ngon miệng cho bạn bè.',
    extendedVersion: 'A practical skill I decided to master was cooking healthy home meals from scratch. When I first moved into a rented flat near university, I relied heavily on instant noodles and oily takeout food, which quickly left me feeling lethargic. Realizing that good nutrition is vital for academic focus, I started following simple cooking channels online. At first, I frequently over-seasoned dishes or burned ingredients. However, after practicing basic stir-fries and vegetable soups every evening, I can now prepare delicious, balanced meals within thirty minutes. It has saved me money and improved my overall wellbeing.',
    usefulVocab: [
      { phrase: 'cook from scratch', meaningVi: 'tự tay nấu từ nguyên liệu tươi sống' },
      { phrase: 'balanced nutrition', meaningVi: 'dinh dưỡng cân bằng hợp lý' },
      { phrase: 'become self-reliant', meaningVi: 'trở nên tự lập, không phụ thuộc' },
      { phrase: 'avoid processed food', meaningVi: 'tránh thực phẩm đóng gói chế biến sẵn' }
    ],
    feelingsVocab: ['clumsy initially', 'proud of independence', 'healthy and energetic']
  },

  // 11. Important Decision
  {
    id: 'story-important-decision',
    title: 'Quyết Định Lựa Chọn Ngành Học (Choosing My University Major)',
    category: 'decision',
    tagline: 'Câu chuyện vạn năng: Một quyết định quan trọng bạn đã đưa ra, một lời khuyên bạn nhận được, một ngã rẽ cuộc đời, một cuộc trò chuyện thay đổi suy nghĩ.',
    applicableCueCards: [
      'Describe an important decision you made',
      'Describe a time you received valuable advice',
      'Describe a major turning point in your life',
      'Describe an ambitious choice you committed to'
    ],
    shortVersion: 'Sau khi tốt nghiệp cấp 3, tôi phân vân giữa ngành tài chính theo kỳ vọng của gia đình và ngành công nghệ phần mềm theo đam mê. Tôi đã quyết định theo đuổi công nghệ và đó là lựa chọn đúng đắn nhất.',
    extendedVersion: 'The most defining decision of my early adulthood was selecting my university major. Most of my extended family encouraged me to pursue accounting because they considered it a stable and predictable career path. However, my real enthusiasm had always been computers and software engineering. I spent two weeks speaking with senior graduates, analyzing employment trends, and discussing my future aspirations candidly with my parents. I finally chose software engineering. Looking back four years later, dedicating myself to a field I truly care about was the best decision I have ever made.',
    usefulVocab: [
      { phrase: 'a defining decision', meaningVi: 'quyết định mang tính bước ngoặt cuộc đời' },
      { phrase: 'follow personal passion', meaningVi: 'đi theo đam mê cá nhân' },
      { phrase: 'consider employment prospects', meaningVi: 'cân nhắc triển vọng nghề nghiệp' },
      { phrase: 'have no regrets', meaningVi: 'không hề hối tiếc' }
    ],
    feelingsVocab: ['anxious at the crossroads', 'determined', 'completely satisfied']
  },

  // 12. Favourite Activity
  {
    id: 'story-favourite-activity',
    title: 'Đạp Xe Quanh Hồ Lúc Hoàng Hôn (Evening Lakeside Cycling)',
    category: 'activity',
    tagline: 'Câu chuyện vạn năng: Hoạt động bạn yêu thích khi rảnh, cách bạn thư giãn sau giờ học, một môn thể thao ngoài trời, một thói quen lành mạnh.',
    applicableCueCards: [
      'Describe an activity you enjoy doing in your leisure time',
      'Describe how you unwind after a stressful day',
      'Describe an outdoor pastime you do regularly',
      'Describe a healthy hobby you enjoy with friends'
    ],
    shortVersion: 'Vào các buổi chiều rảnh, tôi thường đạp xe quanh bờ hồ cùng bạn bè. Không khí trong lành và làn gió mát giúp tôi rũ bỏ toàn bộ căng thẳng sau một ngày học tập dài.',
    extendedVersion: 'Whenever I have free time on weekend evenings, my favourite leisure activity is cycling along the promenade around West Lake. After sitting at a desk for seven to eight hours studying reading passages and writing essays, my body feels stiff and mentally fatigued. Riding my bicycle along the tree-lined path while feeling the cool breeze off the water clears my head instantly. I often cycle with one or two close friends; we pause midway to sip iced green tea and talk about our weekly experiences. It is a cost-effective, wholesome hobby that keeps both my mind and body in top shape.',
    usefulVocab: [
      { phrase: 'unwind after study hours', meaningVi: 'thư giãn sau giờ học hành căng thẳng' },
      { phrase: 'mentally fatigued', meaningVi: 'mệt mỏi về mặt tinh thần' },
      { phrase: 'tree-lined promenade', meaningVi: 'con đường tản bộ rợp bóng cây' },
      { phrase: 'wholesome pastime', meaningVi: 'thú vui giải trí lành mạnh' }
    ],
    feelingsVocab: ['refreshed', 'carefree', 'peaceful and recharged']
  }
];
