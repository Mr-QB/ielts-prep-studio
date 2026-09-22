import { GrammarTopic } from '../types';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'g-inversion',
    title: '1. Inversion (Đảo ngữ nâng cao)',
    subtitle: 'Tăng điểm Grammatical Range & Accuracy lên Band 7.5 - 8.5 trong Writing & Speaking',
    level: 'Band 7.5+',
    formula: 'Negative Adverbial + Auxiliary Verb (Trợ động từ) + Subject + Main Verb',
    concept: 'Đảo ngữ đưa phó từ mang nghĩa phủ định hoặc giới hạn (Not only, Seldom, Hardly, Under no circumstances, Only when) lên đầu câu để tạo sự nhấn mạnh học thuật, giúp câu văn trang trọng và thuyết phục hơn.',
    rules: [
      'Not only + Aux + S + V, but S + also + V (Không những... mà còn...)',
      'Hardly / Scarcely + had + S + V3/ed + when + S + V2/ed (Vừa mới... thì...)',
      'Only by + V-ing / Only when + clause + Aux + S + V (Chỉ bằng cách / Chỉ khi...)',
      'Under no circumstances / At no time + should / must + S + V (Dù trong bất kỳ hoàn cảnh nào cũng không...)'
    ],
    bandComparison: [
      {
        band6: 'Public transport helps the environment and it also saves money for citizens.',
        band8: 'Not only does public transport curb urban greenhouse emissions, but it also generates significant financial savings for daily commuters.',
        analysis: 'Band 8 sử dụng đảo ngữ "Not only does...", kết hợp từ vựng học thuật (curb emissions, daily commuters).'
      },
      {
        band6: 'Governments can only solve traffic congestion if they invest heavily in subway networks.',
        band8: 'Only by allocating substantial subsidies to metropolitan subway networks can municipal authorities effectively alleviate traffic congestion.',
        analysis: 'Đảo ngữ "Only by allocating... can municipal authorities..." thể hiện cấu trúc phức tạp chuẩn C1/C2.'
      }
    ],
    exercises: [
      {
        id: 'g-inv-1',
        type: 'rewrite',
        question: 'Viết lại câu sau dùng đảo ngữ với "Not only":\n"The new Humber suspension bridge reduced travel time and it stimulated local commerce."',
        correctAnswer: 'Not only did the new Humber suspension bridge reduce travel time, but it also stimulated local commerce.',
        explanation: 'Thì quá khứ đơn -> trợ động từ "did", động từ chính chuyển về nguyên mẫu "reduce", vế sau giữ "but it also stimulated".',
        band6Example: 'The bridge reduced travel time and also boosted trade.',
        band8Example: 'Not only did the new bridge reduce transit duration, but it also revitalized regional commerce.'
      },
      {
        id: 'g-inv-2',
        type: 'multiple-choice',
        question: 'Chọn câu đảo ngữ chính xác nhất cho ngữ cảnh cảnh báo an toàn tại cơ sở leo núi (Cambridge 12 Big Rock):',
        options: [
          'A. Under no circumstances climbers should detach their safety harness on high walls.',
          'B. Under no circumstances should climbers detach their safety harness on high walls.',
          'C. Under no circumstances climbers detach should their safety harness.'
        ],
        correctAnswer: 'B',
        explanation: 'Sau cụm phủ định "Under no circumstances", trợ động từ "should" phải đứng trước chủ ngữ "climbers".'
      },
      {
        id: 'g-inv-3',
        type: 'fill-gap',
        question: 'Hoàn thành câu: "Hardly ______ the estuary bridge been opened when thousands of daily commuters began using it."',
        options: ['had', 'did', 'was', 'has'],
        correctAnswer: 'had',
        explanation: 'Cấu trúc: Hardly had + S + V3/ed (hoặc been V3/ed bị động) + when...'
      }
    ]
  },
  {
    id: 'g-conditionals',
    title: '2. Inverted Conditionals (Đảo ngữ câu điều kiện)',
    subtitle: 'Thay thế "If" bằng Should, Were, Had để nâng cao tính học thuật (Formality)',
    level: 'Band 7.0 - 8.5',
    formula: 'Loại 1: Should + S + V | Loại 2: Were + S + to V (hoặc Were + S + adj/noun) | Loại 3: Had + S + V3/ed',
    concept: 'Trong văn bản trang trọng, loại bỏ liên từ "if" và đảo trợ động từ lên đầu câu. Điều này đặc biệt hữu dụng trong Writing Task 2 khi thảo luận giải pháp giả định hoặc tác động giả tưởng.',
    rules: [
      'Loại 1: Should the management decide to introduce flexitime, employee morale will improve.',
      'Loại 2: Were municipal councils to subsidize green energy, carbon emissions would plummet.',
      'Loại 3: Had the engineers not switched to concrete towers, the project would have collapsed under budget constraints.',
      'Điều kiện hỗn hợp: Had they protected the wetlands years ago, marine species would not be endangered today.'
    ],
    bandComparison: [
      {
        band6: 'If schools do not teach practical skills, students will struggle in their careers.',
        band8: 'Should educational institutions neglect practical apprenticeship training, graduates will inevitably struggle to adapt to workforce demands.',
        analysis: 'Đảo ngữ "Should educational institutions neglect..." trang trọng hơn rất nhiều so với "If schools do not...".'
      },
      {
        band6: 'If local authorities had acted earlier, the lake would have remained clean.',
        band8: 'Had local authorities implemented strict environmental oversight earlier, the estuary would not have suffered catastrophic contamination.',
        analysis: 'Đảo ngữ điều kiện loại 3 giúp câu văn đanh thép và súc tích.'
      }
    ],
    exercises: [
      {
        id: 'g-cond-1',
        type: 'multiple-choice',
        question: 'Chọn câu đảo ngữ loại 2 chính xác cho câu: "If companies prioritized employee well-being, turnover rates would drop."',
        options: [
          'A. Were companies to prioritize employee well-being, turnover rates would drop.',
          'B. Did companies prioritize employee well-being, turnover rates would drop.',
          'C. Should companies to prioritize employee well-being, turnover rates would drop.'
        ],
        correctAnswer: 'A',
        explanation: 'Đảo ngữ loại 2 dùng "Were + S + to V".'
      },
      {
        id: 'g-cond-2',
        type: 'fill-gap',
        question: 'Điền từ thích hợp: "______ you require any further assistance regarding your cycle hire booking, please contact our customer desk."',
        options: ['Should', 'Were', 'Had', 'Would'],
        correctAnswer: 'Should',
        explanation: 'Đảo ngữ điều kiện loại 1 thay cho "If you require...".'
      }
    ]
  },
  {
    id: 'g-cleft',
    title: '3. Cleft Sentences (Câu chẻ nhấn mạnh Band 8+)',
    subtitle: 'Thu hút sự chú ý vào thông điệp mấu chốt: It-cleft & Wh-cleft (Pseudo-cleft)',
    level: 'Band 8.0+',
    formula: 'It + is/was + [Thành phần nhấn mạnh] + that/who... HOẶC What + S + V + is/was + ...',
    concept: 'Câu chẻ (cleft sentence) chia câu đơn thành hai mệnh đề để làm nổi bật chủ ngữ, tân ngữ hoặc trạng từ chỉ thời gian/nơi chốn/nguyên nhân.',
    rules: [
      'It is + [noun/phrase] + that/who: "It was mass production in the 19th century that democratized mechanical toys."',
      'What + clause + is/was: "What many urban planners overlook is the psychological impact of noise pollution."',
      'All that + clause + is: "All that mobile transport regulations require is a reasonable break between shifts."'
    ],
    bandComparison: [
      {
        band6: 'Overfishing caused the decline of marine biodiversity in the Wadden Sea.',
        band8: 'It was not solely overfishing, but rather the compounding effect of coastal pollution that decimated marine biodiversity.',
        analysis: 'Cấu trúc "It was not solely X, but rather Y that..." tạo độ tương phản mạnh và thuyết phục.'
      }
    ],
    exercises: [
      {
        id: 'g-cleft-1',
        type: 'rewrite',
        question: 'Viết lại câu sau dùng cấu trúc It-cleft nhấn mạnh "technological innovation":\n"Technological innovation enabled 18th-century watchmakers to build intricate automata."',
        correctAnswer: 'It was technological innovation that enabled 18th-century watchmakers to build intricate automata.',
        explanation: 'Cấu trúc It was [technological innovation] that [enabled...].'
      }
    ]
  },
  {
    id: 'g-participle',
    title: '4. Participle Clauses (Mệnh đề phân từ rút gọn)',
    subtitle: 'Nén câu súc tích, liên kết nguyên nhân - kết quả và thời gian nhịp nhàng',
    level: 'Band 7.0 - 8.5',
    formula: 'V-ing (chủ động) / V3/ed (bị động) / Having V3/ed (hoàn thành), S + V...',
    concept: 'Mệnh đề phân từ thay thế các mệnh đề quan hệ hoặc mệnh đề chỉ lý do/thời gian, giúp bài viết học thuật không bị lặp lại các liên từ "because", "when", "after".',
    rules: [
      'Present Participle (Chủ động): Facing severe budget deficits, the municipal council suspended the estuary tunnel project.',
      'Past Participle (Bị động): Restored by skilled artisans, the historic mechanical swan continues to operate smoothly.',
      'Perfect Participle (Hành động xảy ra trước): Having completed a rigorous risk assessment, the climbing instructors permitted the students to scale the 11m wall.'
    ],
    bandComparison: [
      {
        band6: 'Because they lacked proper safety equipment, many workers suffered injuries.',
        band8: 'Lacking appropriate protective equipment, numerous laborers were vulnerable to severe workplace accidents.',
        analysis: 'Rút gọn mệnh đề chỉ nguyên nhân bằng V-ing "Lacking appropriate..." mang giọng điệu học thuật cao.'
      }
    ],
    exercises: [
      {
        id: 'g-part-1',
        type: 'multiple-choice',
        question: 'Chọn câu dùng phân từ rút gọn chính xác nhất:',
        options: [
          'A. Having examined the survey data, the researchers drew several groundbreaking conclusions.',
          'B. Examining the survey data, several groundbreaking conclusions were drawn by the researchers.',
          'C. Having been examined the survey data, researchers drew conclusions.'
        ],
        correctAnswer: 'A',
        explanation: 'Hành động phân tích dữ liệu xảy ra trước hành động rút ra kết luận, chủ ngữ của mệnh đề chính là "the researchers" (tránh lỗi dangling participle ở câu B).'
      }
    ]
  },
  {
    id: 'g-academic-passive',
    title: '5. Academic Impersonal Passive (Bị động khách quan)',
    subtitle: 'Duy trì văn phong khách quan, trung lập đặc trưng của bài thi IELTS Writing Task 2',
    level: 'Band 7.0+',
    formula: 'It + is + believed / argued / suggested / asserted + that + S + V... HOẶC S + is + said / considered + to V',
    concept: 'Học thuật tiếng Anh tránh dùng "I think", "People think". Thay vào đó, dùng câu bị động khách quan để trình bày quan điểm mang tính trung lập, khoa học.',
    rules: [
      'It is widely acknowledged that urban noise triggers chronic health complications.',
      'Children are believed to acquire language patterns primarily through early parental engagement.',
      'Ancient automata are reputed to have been powered by ingenious water and steam mechanisms.'
    ],
    bandComparison: [
      {
        band6: 'I think that remote work will replace traditional offices soon.',
        band8: 'It is increasingly argued that telecommuting will inevitably supplant conventional office-based paradigms.',
        analysis: 'Chuyển từ ý kiến cá nhân "I think" sang cấu trúc khách quan "It is increasingly argued that...".'
      }
    ],
    exercises: [
      {
        id: 'g-pass-1',
        type: 'rewrite',
        question: 'Chuyển câu: "People believe that early childhood education shapes lifelong cognitive abilities." sang thể bị động khách quan với "It is believed":',
        correctAnswer: 'It is believed that early childhood education shapes lifelong cognitive abilities.',
        explanation: 'Cấu trúc It is believed that + mệnh đề hoàn chỉnh.'
      }
    ]
  },
  {
    id: 'g-complex-relatives',
    title: '6. Preposition + Relative Pronouns (Giới từ + Which/Whom)',
    subtitle: 'Nâng cấp câu ghép lên câu phức đa tầng, làm chủ mệnh đề quan hệ nâng cao',
    level: 'Band 7.5+',
    formula: '...preposition (in, on, with, through, by, to) + which/whom...',
    concept: 'Thay vì đặt giới từ ở cuối câu theo khẩu ngữ, đặt giới từ trực tiếp trước đại từ quan hệ (in which, to whom, through which, during which, the extent to which).',
    rules: [
      'The process by which mercury enters the aquatic food chain involves bioaccumulation.',
      'They attended a two-week training seminar, during which safety protocols were rehearsed.',
      'A substantial cohort of applicants, many of whom possessed graduate degrees, applied for the post.'
    ],
    bandComparison: [
      {
        band6: 'This is the method that scientists measure water contamination with.',
        band8: 'This represents the precise analytical method by which researchers quantify chemical toxicity.',
        analysis: 'Dùng "method by which" thay cho việc đặt "with" ở đuôi câu.'
      }
    ],
    exercises: [
      {
        id: 'g-rel-1',
        type: 'fill-gap',
        question: 'Điền giới từ thích hợp: "The company instituted a flexitime system, ______ which employees could adjust their working hours."',
        options: ['under', 'for', 'at', 'with'],
        correctAnswer: 'under',
        explanation: '"Under a system" -> under which employees could adjust...'
      }
    ]
  },
  {
    id: 'g-cohesive-devices',
    title: '7. Band 8+ Cohesive Markers & Discourse (Liên từ học thuật)',
    subtitle: 'Đạt điểm tối đa tiêu chí Coherence & Cohesion trong IELTS Writing',
    level: 'Band 7.5 - 9.0',
    formula: 'Discourse Marker (Đầu câu / Giữa câu) + Clause',
    concept: 'Thay thế các liên từ quen thuộc (However, Therefore, Because, Besides) bằng các từ nối học thuật tinh tế, tạo dòng chảy lập luận chặt chẽ.',
    rules: [
      'Tương phản mạnh: In stark contrast to / Notwithstanding / Whereas',
      'Nhượng bộ: Granted that / Albeit / Be that as it may',
      'Hệ quả tất yếu: Consequently / Thereby + V-ing / As an inevitable corollary',
      'Bổ sung & Nhấn mạnh: By the same token / Furthermore / More saliently'
    ],
    bandComparison: [
      {
        band6: 'Technology is good, but it has some bad effects on health.',
        band8: 'Notwithstanding its indisputable economic benefits, rapid technological proliferation entails noticeable psychological ramifications.',
        analysis: '"Notwithstanding" tạo liên kết tương phản tinh tế mà không bị thô như "but".'
      }
    ],
    exercises: [
      {
        id: 'g-coh-1',
        type: 'multiple-choice',
        question: 'Chọn liên từ học thuật tương đương với "Although / Despite":',
        options: ['A. Notwithstanding', 'B. By the same token', 'C. Consequently', 'D. Inadvertently'],
        correctAnswer: 'A',
        explanation: '"Notwithstanding" mang nghĩa dù cho, mặc dù (= despite).'
      }
    ]
  }
];
