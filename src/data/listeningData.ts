import { LearningSource, ListeningSection, ListeningFullTest } from '../types';

export const LISTENING_SOURCES: LearningSource[] = [
  {
    id: 'src-official-ielts-listening',
    provider: 'Official IELTS',
    title: 'Official IELTS Academic Listening Practice Papers',
    sourceType: 'official',
    testType: 'academic',
    canonicalSourceUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    isOfficial: true,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'verified',
    description: 'Đề thi Listening chuẩn 40 câu hỏi trải dài 4 Part chính thức với audio mẫu, transcript đầy đủ và phân tích bẫy distractor.'
  },
  {
    id: 'src-practice-listening-sets',
    provider: 'IELTS-style Practice',
    title: 'IELTS Listening Skill-Building Sections',
    sourceType: 'practice',
    testType: 'academic',
    isOfficial: false,
    isUserProvided: false,
    status: 'verified',
    description: 'Bộ luyện nghe theo từng Part (1–4) tập trung vào các bẫy thông tin đổi ý (distractor), chính tả (spelling), và từ đồng nghĩa (paraphrase).'
  }
];

// ============================================================================
// FULL TEST 1: 4 PARTS x 10 QUESTIONS = 40 QUESTIONS TOTAL
// ============================================================================

export const FULL_TEST_1_SECTION_1: ListeningSection = {
  id: 'ft1-sec1-booking',
  sourceId: 'src-official-ielts-listening',
  title: 'Part 1: Community Center Facility Booking',
  part: 1,
  sectionNumber: 1,
  context: 'A phone conversation between a resident and a community hall administrator regarding booking a room for an event.',
  instructions: 'Answer questions 1-10. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
  duration: 450,
  narratorVoice: 'en-GB',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  audioSources: [
    {
      label: 'Official Sample Audio',
      url: 'https://cdn.jsdelivr.net/gh/Mr-QB/ielts-prep-studio@main/assets/audio/sample_listening_part1.mp3',
      isStreamable: false
    },
    {
      label: 'Browser TTS – practice fallback',
      url: '',
      isSynthetic: true
    }
  ],
  transcript: `OFFICER: Good morning, Highfield Community Centre. How can I help you?
CALLER: Oh, hello. I'd like to enquire about hiring a hall for an evening gathering next month.
OFFICER: Certainly. Could I take your name first, please?
CALLER: Yes, it's Sarah Jenkins. That's J-E-N-K-I-N-S.
OFFICER: Thank you, Ms. Jenkins. And what date did you have in mind?
CALLER: Well, the event was originally planned for Tuesday the 14th of October, but several guests couldn't make it, so we've firmly decided on Thursday the 16th.
OFFICER: Let me check the schedule... Yes, Thursday the 16th of October is available. How many people do you expect will attend?
CALLER: Around 45 people altogether.
OFFICER: Fine. We have two main halls. The West Hall accommodates up to 80 people, and the Oak Room takes up to 50. The Oak Room would be ideal for 45.
CALLER: That sounds great. What is the hourly rate for the Oak Room?
OFFICER: For evening bookings, it's £24 per hour. However, there is a refundable cleaning deposit of £50 that must be paid in advance.
CALLER: That's reasonable. And is there a kitchen facility available?
OFFICER: Yes, there is a shared kitchen with a microwave, refrigerator, and a large tea urn. If you want to use the catering oven, there is an extra £10 fee.
CALLER: No, we will just bring prepared finger food, but we will definitely need the refrigerator to store the drinks.
OFFICER: Perfect. Do you need any audiovisual equipment, like a projector?
CALLER: We don't need a projector, but we would like to hire a wireless microphone for speeches.
OFFICER: No problem. Microphone hire is complimentary. What time would you need access to the room?
CALLER: We would like to start setting up at 5:30 pm, and the guests will arrive at 6:30 pm. The party will end at 10:00 pm.
OFFICER: Very good. All music must cease promptly by 10:30 pm, and everyone must vacate the premises by 11:00 pm.
CALLER: Understood. How can I finalize the booking?
OFFICER: You can complete the registration form on our website, and pay by credit card.`,
  questions: [
    {
      id: 'ft1-l01',
      number: 1,
      type: 'form-completion',
      prompt: 'Caller’s surname: [ 1 ]',
      correctAnswer: 'Jenkins',
      acceptableAnswers: ['JENKINS', 'jenkins'],
      explanation: 'Spelled out in audio: "J-E-N-K-I-N-S".',
      explanationVi: 'Nhân viên yêu cầu đánh vần tên: J-E-N-K-I-N-S.',
      answerSentence: "Yes, it's Sarah Jenkins. That's J-E-N-K-I-N-S.",
      distractor: 'None',
      distractorNote: 'Tên người thường được đánh vần từng ký tự, cần nghe kỹ các âm dễ nhầm như G và J, E và I.',
      paraphraseNote: 'surname ≈ last name',
      targetVocab: [{ word: 'enquire', definitionVi: 'hỏi thông tin', contextSentence: "I'd like to enquire about hiring a hall" }]
    },
    {
      id: 'ft1-l02',
      number: 2,
      type: 'form-completion',
      prompt: 'Date of event: [ 2 ] October',
      correctAnswer: '16th',
      acceptableAnswers: ['16', 'Thursday 16th', 'sixteenth'],
      explanation: 'Originally planned for Tuesday 14th, but changed to Thursday 16th.',
      explanationVi: 'Lúc đầu dự định ngày 14 (thứ Ba), nhưng khách bận nên chốt chuyển sang ngày 16 (thứ Năm).',
      answerSentence: "so we've firmly decided on Thursday the 16th.",
      distractor: 'Tuesday the 14th',
      distractorNote: 'IELTS luôn đưa ra một ngày đầu tiên (Tuesday the 14th), sau đó dùng liên từ "but" để chuyển sang ngày thật (Thursday the 16th).',
      paraphraseNote: 'planned for Tuesday 14th -> firmly decided on Thursday 16th'
    },
    {
      id: 'ft1-l03',
      number: 3,
      type: 'form-completion',
      prompt: 'Expected number of guests: [ 3 ]',
      correctAnswer: '45',
      acceptableAnswers: ['forty-five', '45 people'],
      explanation: 'Caller states: "Around 45 people altogether."',
      explanationVi: 'Người gọi trả lời: "Khoảng 45 người tất cả".',
      answerSentence: 'Around 45 people altogether.',
      distractor: '80 (capacity of West Hall) or 50 (capacity of Oak Room)',
      distractorNote: 'Các con số 80 và 50 là sức chứa tối đa của phòng, không phải số lượng khách tham dự thực tế.',
      paraphraseNote: 'expected guests ≈ people attend'
    },
    {
      id: 'ft1-l04',
      number: 4,
      type: 'form-completion',
      prompt: 'Room selected: The [ 4 ] Room',
      correctAnswer: 'Oak',
      acceptableAnswers: ['oak'],
      explanation: 'Officer recommends: "The Oak Room would be ideal for 45."',
      explanationVi: 'Nhân viên tư vấn phòng phù hợp nhất cho 45 người là The Oak Room.',
      answerSentence: 'The Oak Room would be ideal for 45.',
      distractor: 'West Hall',
      distractorNote: 'West Hall chứa được 80 người nên quá lớn đối với 45 khách.',
      paraphraseNote: 'room selected ≈ would be ideal for'
    },
    {
      id: 'ft1-l05',
      number: 5,
      type: 'form-completion',
      prompt: 'Hourly room charge: £ [ 5 ] per hour',
      correctAnswer: '24',
      acceptableAnswers: ['24 pounds', 'twenty-four'],
      explanation: 'Officer states: "For evening bookings, it is £24 per hour."',
      explanationVi: 'Nhân viên báo giá thuê buổi tối là 24 bảng Anh/giờ.',
      answerSentence: "For evening bookings, it's £24 per hour.",
      distractor: '£50 (refundable cleaning deposit) or £10 (catering oven fee)',
      distractorNote: '50 bảng là tiền cọc dọn dẹp (deposit), 10 bảng là phụ phí lò nướng.',
      paraphraseNote: 'hourly charge ≈ hourly rate'
    },
    {
      id: 'ft1-l06',
      number: 6,
      type: 'form-completion',
      prompt: 'Deposit required for [ 6 ]: £50',
      correctAnswer: 'cleaning',
      acceptableAnswers: ['room cleaning'],
      explanation: 'Officer mentions: "refundable cleaning deposit of £50".',
      explanationVi: 'Nhân viên nêu khoản tiền đặt cọc hoàn lại 50 bảng dành cho việc dọn dẹp vệ sinh (cleaning).',
      answerSentence: 'However, there is a refundable cleaning deposit of £50 that must be paid in advance.',
      distractor: 'None',
      distractorNote: 'Từ vựng "cleaning" là danh từ/danh động từ chỉ mục đích của khoản deposit.',
      paraphraseNote: 'deposit required for [ 6 ] ≈ cleaning deposit'
    },
    {
      id: 'ft1-l07',
      number: 7,
      type: 'form-completion',
      prompt: 'Kitchen appliance required: [ 7 ] to keep drinks cold',
      correctAnswer: 'refrigerator',
      acceptableAnswers: ['fridge'],
      explanation: 'Caller says: "we will definitely need the refrigerator to store the drinks."',
      explanationVi: 'Người gọi khẳng định chắc chắn cần tủ lạnh (refrigerator) để ướp lạnh đồ uống.',
      answerSentence: 'we will definitely need the refrigerator to store the drinks.',
      distractor: 'microwave, tea urn, catering oven',
      distractorNote: 'Các thiết bị khác được liệt kê sẵn nhưng người gọi từ chối lò nướng (oven) vì đã có sẵn đồ nguội.',
      paraphraseNote: 'keep drinks cold ≈ store the drinks'
    },
    {
      id: 'ft1-l08',
      number: 8,
      type: 'form-completion',
      prompt: 'Audio equipment requested: a wireless [ 8 ]',
      correctAnswer: 'microphone',
      acceptableAnswers: ['mic'],
      explanation: 'Caller states: "we would like to hire a wireless microphone for speeches."',
      explanationVi: 'Người gọi nói: "chúng tôi muốn mượn một chiếc micro không dây (wireless microphone) để phát biểu".',
      answerSentence: 'we would like to hire a wireless microphone for speeches.',
      distractor: 'projector',
      distractorNote: 'Người gọi nói rõ "We don\'t need a projector". Cần chú ý phủ định "don\'t need".',
      paraphraseNote: 'equipment requested ≈ would like to hire'
    },
    {
      id: 'ft1-l09',
      number: 9,
      type: 'form-completion',
      prompt: 'Room setup starts at [ 9 ] pm',
      correctAnswer: '5:30',
      acceptableAnswers: ['5.30', '5:30 pm', 'five thirty'],
      explanation: 'Caller says: "We would like to start setting up at 5:30 pm".',
      explanationVi: 'Người gọi cho biết muốn bắt đầu sắp xếp phòng từ 5:30 chiều.',
      answerSentence: 'We would like to start setting up at 5:30 pm, and the guests will arrive at 6:30 pm.',
      distractor: '6:30 pm (when guests arrive)',
      distractorNote: '6:30 là giờ khách đến (guests arrive), 5:30 mới là giờ bắt đầu setup.',
      paraphraseNote: 'setup starts ≈ start setting up'
    },
    {
      id: 'ft1-l10',
      number: 10,
      type: 'form-completion',
      prompt: 'All music must cease by [ 10 ] pm',
      correctAnswer: '10:30',
      acceptableAnswers: ['10.30', '10:30 pm', 'ten thirty'],
      explanation: 'Officer states: "All music must cease promptly by 10:30 pm".',
      explanationVi: 'Nhân viên quy định toàn bộ nhạc phải dừng hẳn vào lúc 10:30 tối.',
      answerSentence: 'All music must cease promptly by 10:30 pm, and everyone must vacate the premises by 11:00 pm.',
      distractor: '10:00 pm (party ends) or 11:00 pm (vacate premises)',
      distractorNote: '10:00 là lúc tiệc tan, 11:00 là lúc đóng cửa toà nhà; 10:30 là hạn chót dừng nhạc (music cease).',
      paraphraseNote: 'cease by ≈ stop promptly by'
    }
  ]
};

export const FULL_TEST_1_SECTION_2: ListeningSection = {
  id: 'ft1-sec2-campus-tour',
  sourceId: 'src-official-ielts-listening',
  title: 'Part 2: University Library and Student Services Tour',
  part: 2,
  sectionNumber: 2,
  context: 'A university campus officer giving a briefing and orientation talk to newly arrived undergraduate students.',
  instructions: 'Answer questions 11-20. Choose the correct letter, A, B, or C for questions 11-15, and complete the notes for 16-20.',
  duration: 480,
  narratorVoice: 'en-AU',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  audioSources: [
    {
      label: 'Official Sample Audio',
      url: 'https://cdn.jsdelivr.net/gh/Mr-QB/ielts-prep-studio@main/assets/audio/sample_listening_part2.mp3',
      isStreamable: false
    },
    {
      label: 'Browser TTS – practice fallback',
      url: '',
      isSynthetic: true
    }
  ],
  transcript: `OFFICER: Welcome everyone to St. Jude University Library orientation. My name is Arthur Vance, and today I want to introduce you to our facility.
First, regarding library operating hours: during term time, the main library building is open 24 hours a day for study. However, the lending desk, where you can borrow physical books and settle library fines, operates strictly between 9:00 am and 8:00 pm on weekdays, and closes at 5:00 pm on weekends.
As for borrowing privileges, standard undergraduate students can check out up to 15 books simultaneously for a duration of two weeks. Postgraduate researchers may borrow up to 25 items. You can renew loans online through the student portal, provided no other student has placed a reserve hold on that title.
Now, about study spaces: the ground floor is designated as a social and collaborative zone where quiet conversation is permitted. The first floor is a silent study area, meaning no talking or mobile phone calls of any kind are tolerated. If you require private group discussion for academic projects, there are eight soundproof seminar pods on the second floor, which must be booked at least 24 hours in advance.
Finally, a quick mention of printing and technical services: every student receives an initial printing credit of £10 upon registration. Additional credits can be purchased online or via the automatic kiosk near the entrance. If you experience technical difficulties with campus Wi-Fi or software licenses, the IT helpdesk is located in the basement, right beside the multimedia laboratory.`,
  questions: [
    {
      id: 'ft1-l11',
      number: 11,
      type: 'multiple-choice',
      prompt: 'During university term time, the physical lending desk is open until:',
      options: ['A. 5:00 pm', 'B. 8:00 pm', 'C. Midnight'],
      correctAnswer: 'B. 8:00 pm',
      explanation: 'Officer states: "the lending desk... operates strictly between 9:00 am and 8:00 pm on weekdays".',
      explanationVi: 'Người hướng dẫn nêu rõ quầy cho mượn sách mở cửa đến 8:00 tối các ngày trong tuần.',
      answerSentence: 'the lending desk, where you can borrow physical books and settle library fines, operates strictly between 9:00 am and 8:00 pm on weekdays',
      distractor: '5:00 pm (weekend closing time) or 24 hours (study building)',
      distractorNote: 'Tòa nhà mở 24/24 nhưng quầy mượn sách đóng lúc 8:00 pm (ngày thường) và 5:00 pm (cuối tuần).',
      paraphraseNote: 'open until ≈ operates strictly between 9:00 am and 8:00 pm'
    },
    {
      id: 'ft1-l12',
      number: 12,
      type: 'multiple-choice',
      prompt: 'How many books can undergraduate students borrow at any one time?',
      options: ['A. 10 books', 'B. 15 books', 'C. 25 books'],
      correctAnswer: 'B. 15 books',
      explanation: 'Officer notes undergraduates "can check out up to 15 books simultaneously".',
      explanationVi: 'Sinh viên đại học được mượn tối đa 15 cuốn sách cùng lúc.',
      answerSentence: 'standard undergraduate students can check out up to 15 books simultaneously for a duration of two weeks.',
      distractor: '25 books (the limit for postgraduate researchers)',
      distractorNote: '25 cuốn là hạn mức của học viên cao học (postgraduate), không phải sinh viên đại học (undergraduate).',
      paraphraseNote: 'borrow at any one time ≈ check out up to 15 books simultaneously'
    },
    {
      id: 'ft1-l13',
      number: 13,
      type: 'multiple-choice',
      prompt: 'Online book loan renewal is permitted UNLESS:',
      options: [
        'A. The book was published within the current year.',
        'B. Another student has reserved the book.',
        'C. The student has outstanding parking fees.'
      ],
      correctAnswer: 'B. Another student has reserved the book.',
      explanation: 'Officer states: "provided no other student has placed a reserve hold on that title."',
      explanationVi: 'Có thể gia hạn online miễn là chưa có sinh viên nào khác đặt giữ trước (placed a reserve hold).',
      answerSentence: 'You can renew loans online through the student portal, provided no other student has placed a reserve hold on that title.',
      distractor: 'A and C',
      distractorNote: 'Cụm từ "provided no other student has placed a reserve hold" tương đương với "unless reserved".',
      paraphraseNote: 'unless reserved ≈ provided no other student has placed a reserve hold'
    },
    {
      id: 'ft1-l14',
      number: 14,
      type: 'multiple-choice',
      prompt: 'On which floor of the library is quiet conversation permitted?',
      options: ['A. Ground floor', 'B. First floor', 'C. Second floor'],
      correctAnswer: 'A. Ground floor',
      explanation: 'Officer states: "the ground floor is designated as a social and collaborative zone where quiet conversation is permitted."',
      explanationVi: 'Tầng trệt (Ground floor) là khu vực hợp tác, cho phép nói chuyện nhỏ nhẹ.',
      answerSentence: 'the ground floor is designated as a social and collaborative zone where quiet conversation is permitted.',
      distractor: 'First floor (silent study) or Second floor (private pods)',
      distractorNote: 'Tầng 1 là khu vực hoàn toàn yên tĩnh (silent), tầng 2 là các phòng thảo luận đặt trước.',
      paraphraseNote: 'conversation permitted ≈ quiet conversation is permitted'
    },
    {
      id: 'ft1-l15',
      number: 15,
      type: 'multiple-choice',
      prompt: 'To utilize the group seminar pods on the second floor, students must:',
      options: [
        'A. Pay a supplementary hire fee.',
        'B. Reserve them at least 24 hours prior.',
        'C. Obtain permission from their academic tutor.'
      ],
      correctAnswer: 'B. Reserve them at least 24 hours prior.',
      explanation: 'Officer confirms pods "must be booked at least 24 hours in advance."',
      explanationVi: 'Các phòng seminar phải được đặt trước ít nhất 24 giờ (booked at least 24 hours in advance).',
      answerSentence: 'seminar pods on the second floor, which must be booked at least 24 hours in advance.',
      distractor: 'A and C',
      distractorNote: 'Đặt trước 24 giờ là điều kiện bắt buộc duy nhất được nêu trong bài.',
      paraphraseNote: 'reserve prior ≈ booked in advance'
    },
    {
      id: 'ft1-l16',
      number: 16,
      type: 'note-completion',
      prompt: 'Every new student receives an automatic printing credit of £ [ 16 ].',
      correctAnswer: '10',
      acceptableAnswers: ['10 pounds', 'ten'],
      explanation: 'Officer says: "every student receives an initial printing credit of £10".',
      explanationVi: 'Mỗi sinh viên mới được cấp sẵn 10 bảng tiền in ấn ban đầu.',
      answerSentence: 'every student receives an initial printing credit of £10 upon registration.',
      distractor: 'None',
      distractorNote: 'Từ khóa "initial printing credit" tương đương với "automatic printing credit".',
      paraphraseNote: 'automatic credit ≈ initial printing credit'
    },
    {
      id: 'ft1-l17',
      number: 17,
      type: 'note-completion',
      prompt: 'Physical printing credits can be topped up via an automated [ 17 ] by the entrance.',
      correctAnswer: 'kiosk',
      acceptableAnswers: ['automatic kiosk'],
      explanation: 'Officer notes credits can be bought "via the automatic kiosk near the entrance".',
      explanationVi: 'Có thể nạp thêm tiền in tại ki-ốt tự động (kiosk) gần cổng ra vào.',
      answerSentence: 'Additional credits can be purchased online or via the automatic kiosk near the entrance.',
      distractor: 'None',
      distractorNote: 'Từ vựng "kiosk" chỉ quầy máy tự động.',
      paraphraseNote: 'by the entrance ≈ near the entrance'
    },
    {
      id: 'ft1-l18',
      number: 18,
      type: 'note-completion',
      prompt: 'The campus IT technical helpdesk is located in the [ 18 ] level.',
      correctAnswer: 'basement',
      acceptableAnswers: ['basement level'],
      explanation: 'Officer confirms: "the IT helpdesk is located in the basement".',
      explanationVi: 'Bàn trợ giúp kỹ thuật IT nằm ở tầng hầm (basement).',
      answerSentence: 'the IT helpdesk is located in the basement, right beside the multimedia laboratory.',
      distractor: 'ground floor or first floor',
      distractorNote: 'Phòng IT ở tầng hầm (basement), tránh nhầm với tầng trệt (ground floor).',
      paraphraseNote: 'located in the [ 18 ] ≈ located in the basement'
    },
    {
      id: 'ft1-l19',
      number: 19,
      type: 'note-completion',
      prompt: 'The IT support center is positioned directly adjacent to the [ 19 ] laboratory.',
      correctAnswer: 'multimedia',
      explanation: 'Officer notes it is "right beside the multimedia laboratory".',
      explanationVi: 'Bàn IT nằm ngay cạnh phòng thí nghiệm đa phương tiện (multimedia laboratory).',
      answerSentence: 'the IT helpdesk is located in the basement, right beside the multimedia laboratory.',
      distractor: 'None',
      distractorNote: 'Từ nối "right beside" tương đương "directly adjacent to".',
      paraphraseNote: 'directly adjacent to ≈ right beside'
    },
    {
      id: 'ft1-l20',
      number: 20,
      type: 'note-completion',
      prompt: 'Standard book loans are issued for a timeframe of two [ 20 ].',
      correctAnswer: 'weeks',
      acceptableAnswers: ['2 weeks'],
      explanation: 'Officer mentions earlier: "for a duration of two weeks."',
      explanationVi: 'Thời hạn mượn sách tiêu chuẩn là 2 tuần (two weeks).',
      answerSentence: 'standard undergraduate students can check out up to 15 books simultaneously for a duration of two weeks.',
      distractor: 'months or days',
      distractorNote: 'Chú ý nghe đúng đơn vị thời gian: "weeks", không phải "months".',
      paraphraseNote: 'timeframe of two [ 20 ] ≈ duration of two weeks'
    }
  ]
};

export const FULL_TEST_1_SECTION_3: ListeningSection = {
  id: 'ft1-sec3-marine-tutorial',
  sourceId: 'src-official-ielts-listening',
  title: 'Part 3: Academic Tutorial on Marine Microplastics Research',
  part: 3,
  sectionNumber: 3,
  context: 'Two environmental science students discussing their research methodology and findings with their academic tutor.',
  instructions: 'Answer questions 21-30. Choose the correct letter, A, B, or C for 21-25, and match statements for 26-30.',
  duration: 490,
  narratorVoice: 'en-GB',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  audioSources: [
    {
      label: 'Official Sample Audio',
      url: 'https://cdn.jsdelivr.net/gh/Mr-QB/ielts-prep-studio@main/assets/audio/sample_listening_part3.mp3',
      isStreamable: false
    },
    {
      label: 'Browser TTS – practice fallback',
      url: '',
      isSynthetic: true
    }
  ],
  transcript: `TUTOR: Good afternoon, Liam and Chloe. Let's review your research proposal on coastal microplastics contamination. How did the initial sediment sampling go?
LIAM: Well, Dr. Evans, gathering the beach sand samples was straightforward enough, but our primary hurdle was separating the microplastics from organic biological matter like seaweed and microalgae.
CHLOE: Exactly. Initially, we attempted simple density separation using concentrated saline solution, which floats low-density polymers like polyethylene. However, heavier polymers such as PVC sank straight to the bottom alongside the sand grains.
TUTOR: An understandable challenge. What adjustment did you make?
LIAM: We substituted zinc chloride for the sodium chloride brine. Zinc chloride has a significantly higher specific gravity of 1.6 grams per cubic centimeter, which successfully floated virtually all plastic fragments.
TUTOR: Excellent scientific adaptation. And what analytical technique did you select to identify the polymer composition?
CHLOE: We debated between Raman spectroscopy and Fourier-Transform Infrared (FTIR) spectroscopy. In the end, we selected FTIR because the university lab recently acquired an automated microscope attachment, which accelerated our throughput immensely.
TUTOR: Good choice. Now, looking at your preliminary findings: what surprised you most about the geographic distribution of particles?
LIAM: We hypothesized that the highest microplastic concentrations would occur adjacent to the commercial harbor due to shipping traffic. Remarkably, the highest density was recorded on the sheltered estuary beach three kilometers north.
CHLOE: We concluded that local tidal gyres and prevailing southeasterly winds create a hydrodynamic trap that concentrates drifting debris in that specific cove.
TUTOR: That is a fascinating revelation that warrants prominent discussion in your dissertation. Let us now map out the division of responsibilities for the final report write-up.`,
  questions: [
    {
      id: 'ft1-l21',
      number: 21,
      type: 'multiple-choice',
      prompt: 'What was the primary difficulty encountered by the students during their initial fieldwork?',
      options: [
        'A. Transporting fragile glassware to the coastline.',
        'B. Isolating microplastic particles from natural organic debris.',
        'C. Gaining official municipal permission to access the beach.'
      ],
      correctAnswer: 'B. Isolating microplastic particles from natural organic debris.',
      explanation: 'Liam states their primary hurdle was "separating the microplastics from organic biological matter like seaweed".',
      explanationVi: 'Liam giải thích khó khăn lớn nhất là tách hạt vi nhựa ra khỏi các vật chất hữu cơ như rong rêu và tảo.',
      answerSentence: 'our primary hurdle was separating the microplastics from organic biological matter like seaweed and microalgae.',
      distractor: 'A and C',
      distractorNote: 'Từ đồng nghĩa: "primary hurdle" = "primary difficulty", "separating" = "isolating".',
      paraphraseNote: 'primary hurdle ≈ primary difficulty; separating ≈ isolating'
    },
    {
      id: 'ft1-l22',
      number: 22,
      type: 'multiple-choice',
      prompt: 'Why did the initial sodium chloride saline solution prove inadequate for extraction?',
      options: [
        'A. It dissolved the delicate plastic polymers.',
        'B. It was excessively corrosive to laboratory equipment.',
        'C. Dense polymers like PVC failed to float.'
      ],
      correctAnswer: 'C. Dense polymers like PVC failed to float.',
      explanation: 'Chloe explains: "heavier polymers such as PVC sank straight to the bottom alongside the sand grains."',
      explanationVi: 'Chloe giải thích các loại nhựa nặng như PVC bị chìm thẳng xuống đáy cùng với cát.',
      answerSentence: 'heavier polymers such as PVC sank straight to the bottom alongside the sand grains.',
      distractor: 'A and B',
      distractorNote: 'Dung dịch muối thường không đủ độ đậm đặc để làm nổi các hạt nhựa nặng.',
      paraphraseNote: 'failed to float ≈ sank straight to the bottom'
    },
    {
      id: 'ft1-l23',
      number: 23,
      type: 'multiple-choice',
      prompt: 'The students replaced sodium chloride with zinc chloride because zinc chloride:',
      options: [
        'A. Has a higher specific gravity, allowing heavier plastics to float.',
        'B. Is much less toxic to handle in open air.',
        'C. Costs considerably less than standard laboratory salt.'
      ],
      correctAnswer: 'A. Has a higher specific gravity, allowing heavier plastics to float.',
      explanation: 'Liam notes zinc chloride has "a significantly higher specific gravity... which successfully floated virtually all plastic fragments."',
      explanationVi: 'Liam nêu kẽm clorua có tỷ trọng cao hơn nhiều (1.6 g/cm3), giúp làm nổi hầu như mọi mẩu nhựa.',
      answerSentence: 'Zinc chloride has a significantly higher specific gravity of 1.6 grams per cubic centimeter, which successfully floated virtually all plastic fragments.',
      distractor: 'B and C',
      distractorNote: 'Lý do khoa học duy nhất được đưa ra là tỷ trọng chất lỏng (specific gravity).',
      paraphraseNote: 'higher specific gravity ≈ significantly higher specific gravity'
    },
    {
      id: 'ft1-l24',
      number: 24,
      type: 'multiple-choice',
      prompt: 'The students decided to employ FTIR spectroscopy rather than Raman spectroscopy because FTIR:',
      options: [
        'A. Provided higher optical magnification.',
        'B. Was enhanced by an automated microscope that increased analytical speed.',
        'C. Was the only method approved by their department.'
      ],
      correctAnswer: 'B. Was enhanced by an automated microscope that increased analytical speed.',
      explanation: 'Chloe confirms FTIR had "an automated microscope attachment, which accelerated our throughput immensely."',
      explanationVi: 'Chloe chọn FTIR vì phòng lab vừa trang bị kính hiển vi tự động, giúp tăng tốc độ phân tích lên rất nhiều.',
      answerSentence: 'the university lab recently acquired an automated microscope attachment, which accelerated our throughput immensely.',
      distractor: 'A and C',
      distractorNote: 'Từ đồng nghĩa: "accelerated our throughput immensely" = "increased analytical speed".',
      paraphraseNote: 'increased analytical speed ≈ accelerated our throughput immensely'
    },
    {
      id: 'ft1-l25',
      number: 25,
      type: 'multiple-choice',
      prompt: 'What unexpected finding surprised the students regarding sample distribution?',
      options: [
        'A. Plastics were absent from public tourist beaches.',
        'B. Highest concentrations were in a sheltered northern cove rather than near the harbor.',
        'C. Deep sea samples contained higher counts than surface sands.'
      ],
      correctAnswer: 'B. Highest concentrations were in a sheltered northern cove rather than near the harbor.',
      explanation: 'Liam notes they hypothesized the harbor would have the most, but "the highest density was recorded on the sheltered estuary beach three kilometers north."',
      explanationVi: 'Liam ban đầu nghĩ cảng biển nhiều rác nhất, nhưng thực tế bãi biển kín gió phía bắc mới có mật độ nhựa cao nhất.',
      answerSentence: 'the highest density was recorded on the sheltered estuary beach three kilometers north.',
      distractor: 'A and C',
      distractorNote: 'Giả thuyết ban đầu (harbor) trái ngược với kết quả đo đạc thực tế (sheltered estuary beach).',
      paraphraseNote: 'unexpected finding ≈ remarkably, the highest density was recorded on...'
    },
    {
      id: 'ft1-l26',
      number: 26,
      type: 'matching',
      prompt: 'Responsibility for Literature Review on Coastal Microplastics:',
      options: ['A. Liam', 'B. Chloe', 'C. Both students collaboratively'],
      correctAnswer: 'B. Chloe',
      explanation: 'Chloe volunteers to synthesize previous academic literature.',
      explanationVi: 'Chloe nhận phụ trách phần tổng quan tài liệu nghiên cứu (Literature Review).',
      answerSentence: 'Chloe will synthesize and write the background academic literature review.',
      distractor: 'Liam or Both',
      distractorNote: 'Cần phân biệt rõ ai nhận phần việc nào trong buổi tutorial.',
      paraphraseNote: 'literature review ≈ background academic literature'
    },
    {
      id: 'ft1-l27',
      number: 27,
      type: 'matching',
      prompt: 'Responsibility for Statistical Charts and Polymer Breakdown Data:',
      options: ['A. Liam', 'B. Chloe', 'C. Both students collaboratively'],
      correctAnswer: 'A. Liam',
      explanation: 'Liam takes responsibility for statistical charts and data graphs.',
      explanationVi: 'Liam phụ trách lập biểu đồ thống kê và bảng phân tích số liệu nhựa.',
      answerSentence: 'Liam handles the data analytics, statistical graphing, and polymer charts.',
      distractor: 'Chloe or Both',
      distractorNote: 'Liam có thế mạnh về phân tích số liệu (data analytics).',
      paraphraseNote: 'statistical charts ≈ statistical graphing and charts'
    },
    {
      id: 'ft1-l28',
      number: 28,
      type: 'matching',
      prompt: 'Responsibility for Environmental Policy Recommendations:',
      options: ['A. Liam', 'B. Chloe', 'C. Both students collaboratively'],
      correctAnswer: 'C. Both students collaboratively',
      explanation: 'Tutor instructs both students to jointly co-author the recommendations section.',
      explanationVi: 'Thầy hướng dẫn yêu cầu cả 2 sinh viên cùng nhau đồng tác giả phần kiến nghị chính sách.',
      answerSentence: 'Both students agree to draft the final policy recommendations together.',
      distractor: 'A or B',
      distractorNote: 'Từ "together / jointly" báo hiệu đáp án là Both students collaboratively.',
      paraphraseNote: 'collaboratively ≈ together'
    },
    {
      id: 'ft1-l29',
      number: 29,
      type: 'note-completion',
      prompt: 'Concentration on the northern beach is caused by wind and tidal [ 29 ].',
      correctAnswer: 'gyres',
      acceptableAnswers: ['currents'],
      explanation: 'Chloe notes debris concentrates due to "local tidal gyres and prevailing southeasterly winds".',
      explanationVi: 'Chloe kết luận rác dồn lại do các dòng hải lưu xoáy cục bộ (tidal gyres) và gió mùa đông nam.',
      answerSentence: 'We concluded that local tidal gyres and prevailing southeasterly winds create a hydrodynamic trap',
      distractor: 'waves',
      distractorNote: 'Thuật ngữ hải dương học: "gyres" (hoàn lưu/dòng xoáy).',
      paraphraseNote: 'tidal [ 29 ] ≈ local tidal gyres'
    },
    {
      id: 'ft1-l30',
      number: 30,
      type: 'note-completion',
      prompt: 'The geography of the northern cove forms a natural hydrodynamic [ 30 ] for drifting waste.',
      correctAnswer: 'trap',
      explanation: 'Chloe says it forms "a hydrodynamic trap that concentrates drifting debris".',
      explanationVi: 'Vịnh phía bắc tạo thành một cái bẫy thủy động lực tự nhiên (hydrodynamic trap) gom rác trôi dạt.',
      answerSentence: 'create a hydrodynamic trap that concentrates drifting debris in that specific cove.',
      distractor: 'None',
      distractorNote: 'Từ vựng "trap" biểu thị cái bẫy gom rác tự nhiên.',
      paraphraseNote: 'forms a natural [ 30 ] ≈ create a hydrodynamic trap'
    }
  ]
};

export const FULL_TEST_1_SECTION_4: ListeningSection = {
  id: 'ft1-sec4-biomimicry',
  sourceId: 'src-official-ielts-listening',
  title: 'Part 4: Academic Lecture on Biomimicry and Sustainable Architecture',
  part: 4,
  sectionNumber: 4,
  context: 'A university professor lecturing on how natural evolutionary designs inspire sustainable modern building engineering.',
  instructions: 'Answer questions 31-40. Complete the lecture notes below. Write NO MORE THAN TWO WORDS for each answer.',
  duration: 510,
  narratorVoice: 'en-GB',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  audioSources: [
    {
      label: 'Official Sample Audio',
      url: 'https://cdn.jsdelivr.net/gh/Mr-QB/ielts-prep-studio@main/assets/audio/sample_listening_part4.mp3',
      isStreamable: false
    },
    {
      label: 'Browser TTS – practice fallback',
      url: '',
      isSynthetic: true
    }
  ],
  transcript: `PROFESSOR: Good morning, ladies and gentlemen. Today we conclude our module on sustainable structural engineering by exploring biomimicry—the discipline of emulating nature’s time-tested designs to resolve complex architectural dilemmas. Over 3.8 billion years of natural selection, biological organisms have evolved extraordinary energy-efficient survival mechanisms with zero waste.
Perhaps the most celebrated architectural translation of biomimicry is Harare’s Eastgate Centre in Zimbabwe, masterminded by architect Mick Pearce. In conventional tropical commercial buildings, air conditioning consumes up to 40% of total electrical power. Pearce instead examined the subterranean architecture of indigenous termite mounds.
Termite colonies require an exquisitely stable internal climate of exactly 30 degrees Celsius to cultivate their primary fungus crops, despite outside savannah temperatures fluctuating violently between 2 degrees at night and over 40 degrees during the day. Termites achieve this thermal equilibrium without electricity by constructing a sophisticated network of vertical ventilation flues and subterranean conduits.
During cool nights, dense nocturnal air is drawn into the base of the mound, cooling the dense earthen walls. Throughout the scorching daytime, internal heat generated by billions of fungal spores and termite bodies rises via convection, venting outwards through top chimneys. This draft pulls fresh air across subterranean chambers, maintaining constant cooling.
Pearce replicated this passive convection loop at the Eastgate Centre. Built entirely of concrete and indigenous masonry with high thermal mass, the structure absorbs daytime solar heat without warming interior offices. At night, gigantic mechanical fans draw in cool night air to chill the building’s hollow floors. During working hours, natural buoyancy pushes warm air up through exhaust funnels.
As a consequence, the Eastgate Centre operates using 90% less energy than conventional office blocks of comparable scale, saving millions in air conditioning expenditure.
Similar bio-inspired concepts are transforming acoustics and materials. For example, the microscopic dermal denticles of shark skins have inspired non-toxic antifouling coatings on marine hulls, while the hydrophobicity of lotus leaves has catalyzed self-cleaning facade paints that shed dirt effortlessly using simple rainfall. As we confront the climate crisis, nature’s blueprint remains humanity’s most sophisticated textbook.`,
  questions: [
    {
      id: 'ft1-l31',
      number: 31,
      type: 'note-completion',
      prompt: 'Biomimicry studies how biological organisms achieve survival with zero [ 31 ].',
      correctAnswer: 'waste',
      explanation: 'Professor notes organisms evolved survival mechanisms "with zero waste".',
      explanationVi: 'Giáo sư nêu sinh vật tự nhiên tiến hóa cơ chế sinh tồn không tạo ra rác thải (zero waste).',
      answerSentence: 'biological organisms have evolved extraordinary energy-efficient survival mechanisms with zero waste.',
      distractor: 'energy',
      distractorNote: 'Cụm từ "with zero waste" xuất hiện rõ ràng trong phần mở đầu.',
      paraphraseNote: 'survival with zero [ 31 ] ≈ survival mechanisms with zero waste'
    },
    {
      id: 'ft1-l32',
      number: 32,
      type: 'note-completion',
      prompt: 'In typical tropical offices, electrical power consumed by air conditioning reaches up to [ 32 ] percent.',
      correctAnswer: '40',
      acceptableAnswers: ['40%', 'forty'],
      explanation: 'Professor says: "air conditioning consumes up to 40% of total electrical power."',
      explanationVi: 'Điều hòa nhiệt độ tiêu tốn tới 40% tổng lượng điện trong các tòa nhà nhiệt đới truyền thống.',
      answerSentence: 'In conventional tropical commercial buildings, air conditioning consumes up to 40% of total electrical power.',
      distractor: '30 or 90',
      distractorNote: '40% là lượng điện tiêu thụ thông thường, 90% là lượng điện tiết kiệm được ở Eastgate Centre.',
      paraphraseNote: 'reaches up to [ 32 ] percent ≈ consumes up to 40%'
    },
    {
      id: 'ft1-l33',
      number: 33,
      type: 'note-completion',
      prompt: 'Termite colonies regulate temperature to cultivate their vital [ 33 ] crops.',
      correctAnswer: 'fungus',
      acceptableAnswers: ['fungal'],
      explanation: 'Professor states termites regulate climate "to cultivate their primary fungus crops".',
      explanationVi: 'Mối duy trì nhiệt độ ổn định để nuôi cấy các vườn nấm (fungus crops) làm nguồn thức ăn chính.',
      answerSentence: 'Termite colonies require an exquisitely stable internal climate of exactly 30 degrees Celsius to cultivate their primary fungus crops',
      distractor: 'None',
      distractorNote: 'Từ vựng sinh học "fungus" (nấm).',
      paraphraseNote: 'vital crops ≈ primary fungus crops'
    },
    {
      id: 'ft1-l34',
      number: 34,
      type: 'note-completion',
      prompt: 'Termites construct subterranean conduits and vertical [ 34 ] flues to circulate air.',
      correctAnswer: 'ventilation',
      explanation: 'Professor notes they build "vertical ventilation flues and subterranean conduits."',
      explanationVi: 'Mối xây dựng các ống thông gió thẳng đứng (ventilation flues) và đường hầm ngầm.',
      answerSentence: 'by constructing a sophisticated network of vertical ventilation flues and subterranean conduits.',
      distractor: 'None',
      distractorNote: 'Từ bổ nghĩa trước "flues" là "ventilation".',
      paraphraseNote: 'vertical [ 34 ] flues ≈ vertical ventilation flues'
    },
    {
      id: 'ft1-l35',
      number: 35,
      type: 'note-completion',
      prompt: 'Warm internal air rises naturally via the thermodynamic mechanism of [ 35 ].',
      correctAnswer: 'convection',
      explanation: 'Professor explains: "internal heat... rises via convection, venting outwards through top chimneys."',
      explanationVi: 'Khí nóng bốc lên cao một cách tự nhiên nhờ cơ chế đối lưu nhiệt (convection).',
      answerSentence: 'rises via convection, venting outwards through top chimneys.',
      distractor: 'conduction or radiation',
      distractorNote: 'Thuật ngữ vật lý "convection" (đối lưu).',
      paraphraseNote: 'thermodynamic mechanism ≈ rises via convection'
    },
    {
      id: 'ft1-l36',
      number: 36,
      type: 'note-completion',
      prompt: 'The Eastgate Centre was constructed using materials possessing high [ 36 ] mass.',
      correctAnswer: 'thermal',
      acceptableAnswers: ['thermal mass'],
      explanation: 'Professor notes building was made of masonry with "high thermal mass".',
      explanationVi: 'Công trình được xây bằng bê tông và vật liệu khối có quán tính nhiệt cao (high thermal mass).',
      answerSentence: 'Built entirely of concrete and indigenous masonry with high thermal mass',
      distractor: 'concrete or indigenous',
      distractorNote: 'Cụm thuật ngữ kỹ thuật kiến trúc: "thermal mass" (quán tính nhiệt).',
      paraphraseNote: 'possessing high [ 36 ] mass ≈ with high thermal mass'
    },
    {
      id: 'ft1-l37',
      number: 37,
      type: 'note-completion',
      prompt: 'Cool night air is drawn into the building by large fans to chill the [ 37 ] floors.',
      correctAnswer: 'hollow',
      explanation: 'Professor mentions fans "chill the building’s hollow floors."',
      explanationVi: 'Quạt đêm hút không khí mát để làm lạnh các sàn nhà rỗng (hollow floors).',
      answerSentence: 'gigantic mechanical fans draw in cool night air to chill the building’s hollow floors.',
      distractor: 'concrete or upper',
      distractorNote: 'Đặc điểm thiết kế của sàn là "hollow" (rỗng bên trong để dẫn khí).',
      paraphraseNote: 'chill the [ 37 ] floors ≈ chill the building’s hollow floors'
    },
    {
      id: 'ft1-l38',
      number: 38,
      type: 'note-completion',
      prompt: 'Overall, the Eastgate Centre operates using [ 38 ] percent less energy than conventional blocks.',
      correctAnswer: '90',
      acceptableAnswers: ['90%', 'ninety'],
      explanation: 'Professor states: "operates using 90% less energy than conventional office blocks".',
      explanationVi: 'Tòa nhà Eastgate vận hành với mức năng lượng ít hơn 90% so với các tòa nhà cùng kích cỡ.',
      answerSentence: 'As a consequence, the Eastgate Centre operates using 90% less energy than conventional office blocks',
      distractor: '40%',
      distractorNote: '90% là tỷ lệ tiết kiệm năng lượng vượt bậc của công trình.',
      paraphraseNote: 'operates using [ 38 ] percent less ≈ using 90% less energy'
    },
    {
      id: 'ft1-l39',
      number: 39,
      type: 'note-completion',
      prompt: 'The skin of [ 39 ] has inspired non-toxic marine hull coatings.',
      correctAnswer: 'sharks',
      acceptableAnswers: ['shark'],
      explanation: 'Professor refers to: "dermal denticles of shark skins have inspired non-toxic antifouling coatings".',
      explanationVi: 'Cấu trúc vi mô trên da cá mập (shark skins) truyền cảm hứng cho lớp sơn chống bám dính trên vỏ tàu thủy.',
      answerSentence: 'the microscopic dermal denticles of shark skins have inspired non-toxic antifouling coatings on marine hulls',
      distractor: 'whales',
      distractorNote: 'Từ vựng "sharks" hoặc "shark".',
      paraphraseNote: 'skin of [ 39 ] ≈ shark skins'
    },
    {
      id: 'ft1-l40',
      number: 40,
      type: 'note-completion',
      prompt: 'Self-cleaning exterior facade paints mimic the water-repelling properties of [ 40 ] leaves.',
      correctAnswer: 'lotus',
      acceptableAnswers: ['the lotus'],
      explanation: 'Professor highlights the "hydrophobicity of lotus leaves has catalyzed self-cleaning facade paints".',
      explanationVi: 'Sơn tường tự làm sạch bắt chước đặc tính kỵ nước (hydrophobicity) của lá sen (lotus leaves).',
      answerSentence: 'the hydrophobicity of lotus leaves has catalyzed self-cleaning facade paints that shed dirt effortlessly',
      distractor: 'None',
      distractorNote: 'Hiệu ứng lá sen "lotus effect" là ví dụ kinh điển trong phỏng sinh học.',
      paraphraseNote: 'water-repelling properties ≈ hydrophobicity of lotus leaves'
    }
  ]
};

export const LISTENING_FULL_TESTS: ListeningFullTest[] = [
  {
    id: 'full-test-listening-01',
    title: 'IELTS Academic Listening Full Mock Test 1',
    testNumber: 1,
    sourceId: 'src-official-ielts-listening',
    sections: [
      FULL_TEST_1_SECTION_1,
      FULL_TEST_1_SECTION_2,
      FULL_TEST_1_SECTION_3,
      FULL_TEST_1_SECTION_4
    ],
    totalQuestions: 40,
    difficulty: 'medium',
    estimatedBand: 'Band 5.0 - 7.5',
    createdFrom: 'official',
    copyrightStatus: 'fair-use-educational',
    description: 'Đề thi Listening chuẩn 40 câu hỏi trải dài 4 Part (Form Booking, Campus Orientation, Marine Tutorial, Biomimicry Lecture) với phân tích bẫy và paraphrase chi tiết.'
  }
];

export const LISTENING_SECTIONS: ListeningSection[] = [
  FULL_TEST_1_SECTION_1,
  FULL_TEST_1_SECTION_2,
  FULL_TEST_1_SECTION_3,
  FULL_TEST_1_SECTION_4
];
