import { SpeakingNotePart, SpeakingGeneralTips } from '../types';

export const SPEAKING_PARTS_DATA: SpeakingNotePart[] = [
  {
    part: 1,
    title: 'Part 1: Phỏng Vấn Ngắn (Interview & Everyday Topics)',
    frameworkName: 'Cấu Trúc A-R-E (Answer → Reason → Example)',
    formula: 'Answer (1 câu trực tiếp) + Reason (1–2 câu giải thích lý do) + Example / Frequency (1 câu ví dụ thực tế)',
    explanation: 'Giám khảo kiểm tra độ trôi chảy (Fluency) và sự tự nhiên. Độ dài lý tưởng cho mỗi câu trả lời là 3–4 câu (khoảng 15–25 giây). Không trả lời cộc lốc "Yes/No" và cũng không diễn thuyết quá dài như Part 3.',
    exampleDemonstration: {
      question: 'Do you enjoy cooking?',
      steps: [
        {
          label: '1. Answer (Trực tiếp)',
          text: 'To be completely honest, yes, I am quite passionate about culinary arts.'
        },
        {
          label: '2. Reason (Giải thích lý do)',
          text: 'I find it exceptionally therapeutic after a demanding workday because creating a wholesome meal from scratch helps me unwind.'
        },
        {
          label: '3. Example / Habit (Ví dụ thực tế)',
          text: 'For instance, every Sunday evening, I usually experiment with traditional Vietnamese noodle recipes or bake pasta for my flatmates.'
        }
      ]
    },
    usefulFrames: [
      'Well, generally speaking, I would say that I am a massive fan of...',
      'To be fair, it really depends on the circumstances. When I have spare time,...',
      'I have always had a penchant for [X] ever since I was a high school student.',
      'As a matter of fact, I make it a point to [verb] on a regular basis, usually...'
    ],
    commonTopics: [
      {
        topic: 'Work / Study',
        sampleQuestions: [
          'Do you work or are you a student?',
          'Why did you choose this field of study/profession?',
          'What is the most rewarding aspect of your daily routine?'
        ]
      },
      {
        topic: 'Hometown & Accommodation',
        sampleQuestions: [
          'Where is your hometown situated?',
          'What do you appreciate most about living there?',
          'Do you reside in a house or an apartment?'
        ]
      },
      {
        topic: 'Daily Routine & Habits',
        sampleQuestions: [
          'What time do you usually wake up in the morning?',
          'Do you prefer planning your day in advance or going with the flow?',
          'How do you typically spend your weekends?'
        ]
      },
      {
        topic: 'Technology & Social Media',
        sampleQuestions: [
          'How much time do you spend on digital devices each day?',
          'Do you think technology makes our lives more convenient or stressful?',
          'What mobile application do you rely on the most?'
        ]
      }
    ]
  },
  {
    part: 2,
    title: 'Part 2: Độc Thoại Cá Nhân (The Long Turn / Cue Card)',
    frameworkName: 'Khung 5 Điểm: What → When/Where → Details → Why → Feeling',
    formula: '1 Phút Chuẩn Bị (Ghi từ khóa theo khung) + 2 Phút Nói (Nói trôi chảy theo trình tự thời gian & cảm xúc)',
    explanation: 'Bạn có đúng 1 phút để chuẩn bị với giấy và bút chì, sau đó phải nói liên tục trong 1.5 – 2 phút mà không bị ngắt quãng. Bí quyết là không học thuộc lòng bài mẫu mà bám theo dòng thời gian (Past Background → Event/Actions → Climax → Reflection).',
    exampleDemonstration: {
      question: 'Describe an inspiring teacher who has greatly influenced your educational journey.',
      steps: [
        {
          label: '1. What & Who (Giới thiệu nhân vật)',
          text: 'I would like to talk about Mr. David, my high school physics teacher who completely reshaped my perspective on academia.'
        },
        {
          label: '2. When & Where (Bối cảnh thời gian/không gian)',
          text: 'I first encountered him during my eleventh grade back in 2018 when I was struggling immensely with complex physical theories.'
        },
        {
          label: '3. Details & Actions (Hành động & Kỷ niệm cụ thể)',
          text: 'What made his pedagogical approach extraordinary was his reliance on hands-on laboratory demonstrations rather than rigid rote memorization. He would stay behind after school for hours just to explain tricky concepts to struggling students like myself.'
        },
        {
          label: '4. Why & Reflection (Vì sao có sức ảnh hưởng lớn)',
          text: 'The fundamental reason he left an indelible mark on me was his unwavering enthusiasm and faith in our potential, which instilled in me genuine intellectual curiosity.'
        },
        {
          label: '5. Feeling (Cảm xúc hiện tại)',
          text: 'Looking back, I am tremendously indebted to him, and even today, his passion continues to motivate my independent self-study habits.'
        }
      ]
    },
    usefulFrames: [
      'Today I would like to reminisce about / describe...',
      'If my memory serves me right, this incident took place approximately [X] years ago...',
      'What impressed me most profoundly was the fact that...',
      'To put it in perspective, without his guidance, I would have certainly...',
      'Looking back on the whole experience with the benefit of hindsight, I feel...'
    ],
    commonTopics: [
      {
        topic: 'Describe a Person (Người có ảnh hưởng / Bạn bè / Nhà lãnh đạo)',
        sampleQuestions: [
          'Describe a creative person whom you admire.',
          'Describe an elderly person who gave you beneficial advice.',
          'Describe a friend who is an excellent communicator.'
        ]
      },
      {
        topic: 'Describe an Object / Technology (Món đồ giá trị / Thiết bị)',
        sampleQuestions: [
          'Describe a piece of technology you find indispensable.',
          'Describe a gift that took you a long time to choose.',
          'Describe a photograph that brings back fond memories.'
        ]
      },
      {
        topic: 'Describe an Event / Experience (Trải nghiệm / Thách thức / Chuyến đi)',
        sampleQuestions: [
          'Describe a time when you overcame a significant difficulty.',
          'Describe a memorable trip you took with family or friends.',
          'Describe an occasion when you helped someone in need.'
        ]
      },
      {
        topic: 'Describe a Place (Thành phố / Quán cafe / Khu bảo tồn)',
        sampleQuestions: [
          'Describe a peaceful place you visit to escape urban noise.',
          'Describe a city or country you would love to explore in the future.'
        ]
      }
    ]
  },
  {
    part: 3,
    title: 'Part 3: Thảo Luận Chuyên Sâu (Two-Way Discussion)',
    frameworkName: 'Cấu Trúc Học Thuật O-R-E-C (Opinion → Reason → Example → Contrast / Consequence)',
    formula: 'Opinion (Khẳng định góc nhìn học thuật) + Reason (Cơ chế logic sâu sắc) + Example (Ví dụ mang tính xã hội) + Contrast / Consequence (Mặt đối lập hoặc hệ quả dài hạn)',
    explanation: 'Part 3 chuyển từ trải nghiệm cá nhân sang các vấn đề xã hội, triết lý và xu hướng toàn cầu. Không dùng "I usually" hay kể chuyện gia đình; hãy dùng các đại từ mang tính khách quan như "individuals, society, governments, the younger generation".',
    exampleDemonstration: {
      question: 'Do you believe artificial intelligence will eventually replace human educators in the classroom?',
      steps: [
        {
          label: '1. Opinion (Góc nhìn khách quan)',
          text: 'In my appraisal, while AI will inevitably revolutionize teaching methodology, it is highly improbable that human instructors will be entirely superseded.'
        },
        {
          label: '2. Reason (Phân tích lý do bản chất)',
          text: 'The primary rationale is that education encompasses far more than mere algorithmic information delivery. True pedagogical success hinges upon emotional intelligence, empathy, and moral mentorship—attributes that automated software cannot replicate.'
        },
        {
          label: '3. Example (Ví dụ cấp độ xã hội)',
          text: 'For instance, when a student experiences personal trauma or psychological setbacks, an intuitive teacher provides emotional counsel that no machine can offer.'
        },
        {
          label: '4. Consequence / Contrast (Hệ quả đối chiếu)',
          text: 'Consequently, the optimal trajectory lies in synergistic cooperation: educators should harness AI for administrative grading, thereby freeing up valuable time for direct interpersonal coaching.'
        }
      ]
    },
    usefulFrames: [
      'From a macro perspective, it is widely acknowledged that...',
      'There is no denying that [X] plays a pivotal role; nevertheless, one must consider [Y]...',
      'To delve deeper into the societal implications, ...',
      'A notable case in point would be the recent legislative reforms concerning...',
      'Consequently, unless proactive measures are instituted, society might witness...'
    ],
    commonTopics: [
      {
        topic: 'Education & Future Employment',
        sampleQuestions: [
          'How has digital technology altered the dynamic between teachers and learners?',
          'Should universities focus strictly on vocational training or broader theoretical knowledge?',
          'What skills will be most coveted in the automated labor market of the future?'
        ]
      },
      {
        topic: 'Environment & Sustainable Living',
        sampleQuestions: [
          'Whose responsibility is it to combat climate change: individual citizens or multinational corporations?',
          'How can governments effectively incentivize households to adopt renewable energy?'
        ]
      },
      {
        topic: 'Culture, Tourism & Globalization',
        sampleQuestions: [
          'Does mass tourism promote cultural understanding or dilute historical identity?',
          'Why are young people in many nations increasingly drawn to Western lifestyle trends?'
        ]
      }
    ]
  }
];

export const SPEAKING_GENERAL_TIPS: SpeakingGeneralTips = {
  fillers: [
    {
      phrase: 'That is a rather intriguing question to consider...',
      context: 'Dùng khi vừa nghe xong câu hỏi khó ở Part 3 để có 2–3 giây suy nghĩ ý tưởng.'
    },
    {
      phrase: 'Well, to be completely candid with you,...',
      context: 'Dùng khi muốn chia sẻ một quan điểm thật lòng hoặc hơi ngược số đông.'
    },
    {
      phrase: 'If I were to pinpoint the single most decisive factor,...',
      context: 'Dùng để nhấn mạnh lý do quan trọng nhất một cách tự nhiên.'
    },
    {
      phrase: 'It is somewhat arduous to give a definitive answer, but I would speculate that...',
      context: 'Dùng khi câu hỏi dự đoán tương lai không có câu trả lời chắc chắn.'
    }
  ],
  elongationTechniques: [
    {
      strategy: 'Kỹ thuật So Sánh Quá Khứ vs Hiện Tại (Past vs Present)',
      prompt: 'Khi được hỏi về sở thích hoặc thói quen, đối chiếu bản thân hiện tại với 5 năm trước.',
      example: 'Whereas I used to squander hours scrolling through social media in my early adolescence, nowadays I much prefer dedicating that time to physical fitness or reading.'
    },
    {
      strategy: 'Kỹ thuật Đặt Giả Thuyết Đối Lập (Hypothetical / Conditional)',
      prompt: 'Dùng câu điều kiện loại 2 để giải thích nếu trường hợp ngược lại xảy ra.',
      example: 'If I didn’t live in such a densely populated metropolis, I would undoubtedly spend far more time hiking in the mountains.'
    },
    {
      strategy: 'Kỹ thuật Dự Đoán Tương Lai (Future Speculation)',
      prompt: 'Nói về sự thay đổi có thể xảy ra trong 5–10 năm tới.',
      example: 'In the coming decade, however, with the rapid advancement of electric autonomous vehicles, I anticipate this traffic situation will improve dramatically.'
    }
  ],
  handlingUnknownWords: [
    {
      strategy: 'Paraphrase bằng định nghĩa hoặc chức năng của đồ vật/khái niệm',
      template: 'I am momentarily struggling to recall the precise English term, but it is essentially a device/concept used for [mô tả chức năng]...'
    },
    {
      strategy: 'Dùng từ đồng nghĩa gần nghĩa nhất rồi bổ sung giải thích',
      template: 'It is quite similar to [từ quen thuộc], except that it is specifically designed for...'
    }
  ],
  selfCorrection: [
    {
      strategy: 'Tự sửa lỗi ngữ pháp một cách tự nhiên (Examiner đánh giá cao Band 7+)',
      template: 'He go... excuse me, he goes to the gym daily...'
    },
    {
      strategy: 'Sửa thì quá khứ',
      template: 'When I arrive... sorry, when I arrived at the venue yesterday,...'
    }
  ],
  chatGptPrompts: [
    {
      label: 'Mô phỏng Giám khảo IELTS Speaking Part 1 (Tương tác từng câu)',
      description: 'Luyện tập hỏi - đáp trực tiếp từng câu, nhận phản hồi Band điểm ngay lập tức.',
      prompt: `You are an official IELTS Speaking examiner. Conduct an IELTS Speaking Part 1 test with me.
Topic: [Chọn chủ đề: ví dụ "Reading habits" hoặc "Work and Studies"].
Ask me ONE question at a time. Wait for my response before asking the next question.
After I answer each question:
1. Provide a brief band-score estimation (Fluency, Lexical Resource, Grammar, Pronunciation).
2. Point out any grammatical slips or unnatural collocations.
3. Offer an upgraded, natural Band 7.5+ paraphrase of my answer using academic vocabulary and natural fillers.
4. Then ask the next Part 1 question.
Begin by asking your first question now.`
    },
    {
      label: 'Chấm & Nâng cấp bài nói Part 2 Cue Card',
      description: 'Dán bài nói Part 2 của bạn (bằng text hoặc voice transcription) để nhận bảng phân tích 4 tiêu chí.',
      prompt: `Please act as an IELTS Speaking examiner assessing my Part 2 cue card performance.
Cue card topic: [Dán đề bài Cue Card ở đây]
Here is my spoken transcript:
"[Dán nội dung bạn vừa nói ở đây]"

Please provide:
1. Estimated Band Score according to official IELTS Speaking descriptors.
2. Lexical Resource review: Highlight 3 basic phrases and provide high-level academic/collocation alternatives.
3. Grammatical Range review: Identify missing complex structures (e.g., conditional, participle clause, inversion) and show how to weave them in.
4. A rewritten Band 8.0 version that retains my original personal ideas but sounds completely natural and fluent.`
    },
    {
      label: 'Luyện phản xạ tư duy Part 3 (Phản biện xã hội)',
      description: 'Luyện trả lời các câu hỏi trừu tượng mang tính vĩ mô.',
      prompt: `You are a rigorous IELTS examiner for Speaking Part 3.
Topic: [Chọn chủ đề: ví dụ "The Influence of Artificial Intelligence on Future Employment"].
Ask me deep, probing Part 3 questions one by one.
If my answer is too brief or relies excessively on personal anecdotes rather than societal perspectives, challenge me by asking: "Why do you think society as a whole leans towards that?" or "Could you consider the contrary viewpoint?"
Give constructive feedback after each answer.`
    }
  ]
};
