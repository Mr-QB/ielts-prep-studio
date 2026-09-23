import { GrammarTopic } from '../types';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // ==========================================
  // SECTION 1: FOUNDATION (G01 - G06)
  // Essential building blocks for Bands 4.0 -> 6.0
  // ==========================================
  {
    id: 'g01-sentence-structure',
    code: 'G01',
    category: 'foundation',
    title: 'Sentence Structure & Avoiding Fragments / Run-ons',
    whyItMatters: 'Mọi tiêu chí chấm điểm IELTS (đặc biệt Writing) đều yêu cầu câu phải hoàn chỉnh. Lỗi viết câu thiếu chủ-vị (fragment) hoặc ghép câu tùy tiện bằng dấu phẩy (comma splice/run-on) khiến điểm GRA bị khống chế dưới 5.5.',
    formula: 'Clause = Subject (Chủ ngữ) + Finite Verb (Động từ chia thì) [+ Object/Complement]',
    concept: 'Một câu hoàn chỉnh bắt buộc phải có ít nhất một mệnh đề độc lập với chủ ngữ và động từ chia thì hoàn chỉnh. Không dùng dấu phẩy để nối hai mệnh đề độc lập mà không có liên từ kết hợp (FANBOYS) hoặc chấm phẩy.',
    rules: [
      'Simple sentence: S + V (The population increased.)',
      'Compound sentence: Independent Clause + comma + coordinating conjunction (for, and, nor, but, or, yet, so) + Independent Clause.',
      'Complex sentence: Independent Clause + Dependent Clause (hoặc bắt đầu bằng Subordinating Conjunction kèm dấu phẩy).',
      'Tránh Comma Splice: Không viết "S + V, S + V". Hãy dùng chấm phẩy (;), liên từ (and/but/so), hoặc biến một vế thành mệnh đề phụ thuộc (Although/Because).'
    ],
    examples: [
      {
        sentence: 'The government invested in renewable energy, so carbon emissions decreased markedly.',
        note: 'Câu ghép dùng liên từ "so" và dấu phẩy trước đó để nối 2 mệnh đề độc lập.'
      },
      {
        sentence: 'Although public transit fares were reduced, daily commuters still preferred private cars.',
        note: 'Câu phức có mệnh đề phụ thuộc chỉ sự nhượng bộ đứng trước kèm dấu phẩy ngăn cách.'
      }
    ],
    commonMistake: {
      incorrect: 'Traffic congestion is worsening in large cities, because many people drive private cars.',
      corrected: 'Traffic congestion is worsening in large cities because many people drive private cars.',
      explanation: 'Không đặt dấu phẩy trước "because" khi mệnh đề chỉ nguyên nhân đứng ở sau mệnh đề chính.'
    },
    ieltsApplication: 'Writing Task 1 & 2: Đảm bảo 100% câu mở bài (Introduction) và câu chủ đề (Topic sentence) chuẩn ngữ pháp, không ngắt câu lửng lơ.',
    exercises: [
      {
        id: 'g01-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu có cấu trúc hoàn chỉnh và chấm câu chính xác:',
        options: [
          'A. Renewable solar technologies are becoming cheaper, however many rural areas still rely on coal.',
          'B. Renewable solar technologies are becoming cheaper; however, many rural areas still rely on coal.',
          'C. Because renewable solar technologies are becoming cheaper.'
        ],
        correctAnswer: 'B',
        explanation: 'Trạng từ liên kết "however" không thể nối 2 mệnh đề chỉ bằng dấu phẩy. Cần dùng chấm phẩy trước và dấu phẩy sau: "; however,".'
      }
    ]
  },
  {
    id: 'g02-core-tenses',
    code: 'G02',
    category: 'foundation',
    title: 'Core Tenses in IELTS Context',
    whyItMatters: 'Trong IELTS, thì không học theo công thức vẹt mà gắn chặt với ngữ cảnh: Task 1 mô tả biểu đồ quá khứ (Past Simple) hay xu hướng chung (Present Simple); Task 2 bàn về thực trạng hiện tại hay hệ quả tương lai.',
    formula: 'Past Simple (V2/-ed) | Present Simple (V/V-s) | Present Perfect (have/has + V3) | Future forms (will / is projected to)',
    concept: 'Chọn thì dựa trên mốc thời gian của dữ liệu hoặc tính chất của luận điểm: Sự thật hiển nhiên/khái quát -> Present Simple; Dữ liệu biểu đồ năm cụ thể trong quá khứ -> Past Simple; Tác động kéo dài đến nay -> Present Perfect.',
    rules: [
      'Task 1 dữ liệu có năm trong quá khứ (e.g. In 2015): Sử dụng thì Quá khứ đơn (The percentage fell to 25%).',
      'Task 1 dự báo tương lai (e.g. By 2035): Sử dụng cấu trúc dự báo (is projected to / is expected to reach).',
      'Task 2 luận điểm chung: Sử dụng Hiện tại đơn (Technological advancement facilitates distance education).',
      'Diễn tả xu hướng/sự chuyển dịch bắt đầu từ quá khứ đến hiện tại: Sử dụng Hiện tại hoàn thành (Over the past decade, electric vehicles have gained popularity).'
    ],
    examples: [
      {
        sentence: 'Between 2000 and 2010, international tourist arrivals in Spain grew by 15%.',
        note: 'Khoảng thời gian quá khứ xác định -> Quá khứ đơn "grew".'
      },
      {
        sentence: 'Global temperatures have risen significantly since industrialization began.',
        note: 'Hành động bắt đầu trong quá khứ kéo dài đến hiện tại với "since" -> Hiện tại hoàn thành "have risen".'
      }
    ],
    commonMistake: {
      incorrect: 'In 2010, the figure has increased to 40%.',
      corrected: 'In 2010, the figure increased to 40%.',
      explanation: 'Có mốc thời gian quá khứ cụ thể "In 2010", bắt buộc phải dùng Quá khứ đơn, không dùng Hiện tại hoàn thành.'
    },
    ieltsApplication: 'Tránh lỗi nhảy thì lộn xộn (tense shifting) giữa các câu trong cùng một đoạn văn phân tích biểu đồ.',
    exercises: [
      {
        id: 'g02-ex-1',
        type: 'fill-gap',
        question: 'Điền dạng đúng của động từ: "Over the last twenty years, urban populations ______ (expand) dramatically across developing nations."',
        options: ['have expanded', 'expanded', 'expand', 'were expanding'],
        correctAnswer: 'have expanded',
        explanation: 'Cụm từ "Over the last twenty years" chỉ khoảng thời gian kéo dài tới hiện tại -> Dùng Present Perfect "have expanded".'
      }
    ]
  },
  {
    id: 'g03-subject-verb-agreement',
    code: 'G03',
    category: 'foundation',
    title: 'Subject–Verb Agreement (Hòa hợp Chủ–Vị)',
    whyItMatters: 'Lỗi chia số ít/số nhiều là một trong những lỗi sơ đẳng phổ biến nhất khiến thí sinh band 5.0–5.5 mất điểm đáng tiếc trong cả Writing lẫn Speaking.',
    formula: 'Singular Subject -> Singular Verb (-s/-es) | Plural Subject -> Plural Verb',
    concept: 'Động từ phải hòa hợp với danh từ cốt lõi của chủ ngữ, bỏ qua các cụm giới từ (prepositional phrases) hoặc mệnh đề quan hệ chen ngang.',
    rules: [
      'The number of + plural noun -> Động từ số ÍT (The number of students increases).',
      'A number of + plural noun -> Động từ số NHIỀU (A number of solutions exist).',
      'Danh từ không đếm được (pollution, advice, information, traffic) luôn đi với động từ số ÍT.',
      'Chủ ngữ có cụm xen giữa: "The quality [of these educational programs] is commendable" (Chủ ngữ chính là quality, không phải programs).'
    ],
    examples: [
      {
        sentence: 'The proportion of elderly individuals living alone has climbed steadily.',
        note: 'Chủ ngữ chính là "The proportion" (số ít) -> chia "has climbed".'
      },
      {
        sentence: 'A substantial number of households rely on public transport daily.',
        note: '"A number of" mang nghĩa nhiều -> danh từ đếm được số nhiều "rely".'
      }
    ],
    commonMistake: {
      incorrect: 'The amount of cars on urban roads are increasing.',
      corrected: 'The number of cars on urban roads is increasing.',
      explanation: '"Cars" là danh từ đếm được nên phải dùng "The number of" (không dùng amount), và chủ ngữ "The number" đi với động từ số ít "is".'
    },
    ieltsApplication: 'Kiểm soát chặt chẽ các câu mở đầu chứa cụm danh từ dài trong Writing Task 1.',
    exercises: [
      {
        id: 'g03-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu chính xác về hòa hợp chủ-vị:',
        options: [
          'A. The consumption of sugary beverages among adolescents have risen.',
          'B. The consumption of sugary beverages among adolescents has risen.',
          'C. The consumption of sugary beverages among adolescents are rising.'
        ],
        correctAnswer: 'B',
        explanation: 'Chủ ngữ chính là danh từ không đếm được "The consumption", nên động từ chia số ít "has risen".'
      }
    ]
  },
  {
    id: 'g04-articles',
    code: 'G04',
    category: 'foundation',
    title: 'Articles: A/An, The, and Zero Article',
    whyItMatters: 'Người học tiếng Việt rất hay quên mạo từ hoặc lạm dụng "the" trước mọi danh từ. Bài thi Academic đòi hỏi phân biệt rõ giữa khẳng định khái quát và số liệu cụ thể.',
    formula: 'a/an (đếm được, số ít, nhắc lần đầu) | the (xác định, duy nhất) | zero article (số nhiều/không đếm được nói chung)',
    concept: 'Dùng mạo từ xác định "the" khi cả người viết và người đọc đều biết đối tượng đó là gì (do ngữ cảnh hoặc do có cụm bổ nghĩa phía sau). Khi khái quát về một nhóm/loài, dùng danh từ số nhiều không mạo từ (zero article).',
    rules: [
      'Dùng Zero article cho phát biểu khái quát: "Children require physical exercise" (không nói "The children" khi nói trẻ em nói chung).',
      'Dùng "the" khi có cụm xác định: "The children in urban schools...", "The percentage of graduates...".',
      'Dùng "the" trước các danh từ duy nhất: the internet, the government, the environment, the equator.',
      'Dùng "the" trước tên quốc gia có số nhiều hoặc liên bang: the UK, the USA, the Netherlands (nhưng: Vietnam, France, Japan).'
    ],
    examples: [
      {
        sentence: 'Education plays a fundamental role in societal progress.',
        note: '"Education" và "societal progress" là danh từ trừu tượng nói chung -> Zero article.'
      },
      {
        sentence: 'The education provided in vocational academies prepares students for immediate employment.',
        note: 'Có mệnh đề bổ nghĩa "provided in vocational academies" xác định nền giáo dục nào -> Dùng "The".'
      }
    ],
    commonMistake: {
      incorrect: 'The technology affects the daily life of people.',
      corrected: 'Technology affects the daily life of people.',
      explanation: '"Technology" ở đây nói về công nghệ nói chung, không dùng mạo từ "the".'
    },
    ieltsApplication: 'Viết các câu luận điểm khái quát trong mở bài và kết bài Writing Task 2 mà không bị thừa mạo từ.',
    exercises: [
      {
        id: 'g04-ex-1',
        type: 'fill-gap',
        question: 'Điền mạo từ thích hợp: "Protecting ______ environment is a collective responsibility for all nations."',
        options: ['the', 'a', 'an', '(zero article)'],
        correctAnswer: 'the',
        explanation: '"The environment" là danh từ mang tính duy nhất (môi trường sống toàn cầu), bắt buộc có "the".'
      }
    ]
  },
  {
    id: 'g05-countable-uncountable-nouns',
    code: 'G05',
    category: 'foundation',
    title: 'Countable vs Uncountable Nouns & Quantifiers',
    whyItMatters: 'Sự nhầm lẫn giữa much/many, amount/number, fewer/less trực tiếp làm sai nghĩa câu phân tích số liệu trong Writing Task 1 và Task 2.',
    formula: 'Many / Fewer / Number + Plural Countable | Much / Less / Amount + Uncountable',
    concept: 'Danh từ đếm được có dạng số ít và số nhiều (cars, students). Danh từ không đếm được không có số nhiều và không đi cùng a/an trực tiếp (waste, energy, traffic, information).',
    rules: [
      'Dùng "number of" cho danh từ đếm được: "a large number of vehicles".',
      'Dùng "amount of" cho danh từ không đếm được: "a substantial amount of electricity".',
      'Dùng "fewer" cho đếm được: "fewer road accidents"; dùng "less" cho không đếm được: "less carbon emission".',
      'Các danh từ học thuật thường gặp không đếm được: research, equipment, infrastructure, accommodation, luggage.'
    ],
    examples: [
      {
        sentence: 'Countries generated a greater amount of renewable energy in 2020.',
        note: '"Energy" không đếm được -> dùng "amount of".'
      },
      {
        sentence: 'Fewer young adults pursued apprenticeships compared with university degrees.',
        note: '"Young adults" đếm được số nhiều -> dùng "fewer".'
      }
    ],
    commonMistake: {
      incorrect: 'The government should conduct more researches into sustainable housing.',
      corrected: 'The government should conduct more research into sustainable housing.',
      explanation: '"Research" là danh từ không đếm được trong tiếng Anh, không thêm "es" và không đi với "a research".'
    },
    ieltsApplication: 'Tránh viết sai "many informations" hoặc "the amount of people" trong Task 1.',
    exercises: [
      {
        id: 'g05-ex-1',
        type: 'fill-gap',
        question: 'Chọn từ lượng từ chuẩn: "There were ______ private cars registered in the capital this decade."',
        options: ['fewer', 'less', 'a lesser amount of', 'little'],
        correctAnswer: 'fewer',
        explanation: '"Private cars" là danh từ đếm được số nhiều, lượng từ giảm đi phải là "fewer".'
      }
    ]
  },
  {
    id: 'g06-pronouns-referencing',
    code: 'G06',
    category: 'foundation',
    title: 'Pronouns & Referencing for Cohesion',
    whyItMatters: 'Tiêu chí Coherence and Cohesion (CC) đòi hỏi sử dụng đại từ thay thế (it, they, this, these, such) khéo léo để tránh lặp từ thô thiển giữa các câu.',
    formula: 'Noun Phrase (câu trước) -> Pronoun / Determiner + Summary Noun (câu sau)',
    concept: 'Referencing tạo liên kết mạch lạc giữa các ý. Tuy nhiên, nếu dùng đại từ mơ hồ (ambiguous reference) không rõ trỏ về ai/cái gì, người đọc sẽ bối rối.',
    rules: [
      'Dùng đại từ số ít/nhiều tương ứng: "a company -> it/its", "companies -> they/their".',
      'Kỹ thuật "This + summary word": Thay vì nhắc lại cả mệnh đề, viết "This trend", "This discrepancy", "This phenomenon".',
      'Tránh lặp chủ ngữ đầu câu 3 lần liên tiếp: Biến đổi linh hoạt giữa danh từ cụ thể, đại từ thay thế, và danh từ khái quát (such measures).'
    ],
    examples: [
      {
        sentence: 'Many households adopted solar panels in 2018. This transition reduced municipal grid demand.',
        note: '"This transition" tóm tắt hành động ở câu trước, liên kết mượt mà.'
      },
      {
        sentence: 'Governments should impose higher fossil fuel taxes. Such policies incentivize green alternatives.',
        note: '"Such policies" thay thế cho "higher fossil fuel taxes".'
      }
    ],
    commonMistake: {
      incorrect: 'When an employee works overtime, they should be compensated properly.',
      corrected: 'When employees work overtime, they should be compensated properly.',
      explanation: 'Để dùng đại từ "they/their" tự nhiên và nhất quán trong văn viết học thuật, nên để danh từ chỉ nhóm ở số nhiều ngay từ đầu.'
    },
    ieltsApplication: 'Viết câu chuyển ý (transition sentence) giữa hai câu hoặc hai đoạn văn trong bài essay.',
    exercises: [
      {
        id: 'g06-ex-1',
        type: 'multiple-choice',
        question: 'Chọn cụm từ liên kết tốt nhất cho câu 2: "Urban green spaces improve air quality and lower summer temperatures. [ ... ] contributes significantly to public well-being."',
        options: [
          'A. This environmental benefit',
          'B. They',
          'C. These'
        ],
        correctAnswer: 'A',
        explanation: '"This environmental benefit" là cụm danh từ tóm tắt hoàn hảo cho hai tác động tích cực ở câu trước.'
      }
    ]
  },

  // ==========================================
  // SECTION 2: CORE IELTS (G07 - G20)
  // Target Band 6.5 - 7.0 essentials
  // ==========================================
  {
    id: 'g07-adjectives-adverbs',
    code: 'G07',
    category: 'core',
    title: 'Adjectives & Adverbs for Academic Precision',
    whyItMatters: 'Trong Writing Task 1, bạn cần kết hợp nhịp nhàng giữa cặp (Adj + Noun) và (Verb + Adv) để mô tả tốc độ và biên độ thay đổi dữ liệu.',
    formula: 'A + [significant / dramatic / steady] + [rise / decline] | [rose / declined] + [significantly / dramatically / steadily]',
    concept: 'Tính từ bổ nghĩa cho danh từ; trạng từ bổ nghĩa cho động từ, tính từ hoặc toàn câu. Dùng trạng từ giúp câu văn học thuật không bị khô cứng và thể hiện độ chính xác cao.',
    rules: [
      'Biên độ lớn: significant, dramatic, substantial, considerable -> significantly, dramatically, substantially.',
      'Biên độ vừa/nhỏ: moderate, slight, marginal -> moderately, slightly, marginally.',
      'Tốc độ: rapid, sharp, steady, gradual -> rapidly, sharply, steadily, gradually.',
      'Trạng từ chỉ mức độ chắc chắn: largely, predominantly, virtually, relatively.'
    ],
    examples: [
      {
        sentence: 'There was a substantial rise in consumer spending on telecommunications.',
        note: 'Cấu trúc There was a + Adj + Noun.'
      },
      {
        sentence: 'Consumer expenditure on telecommunications rose substantially over the decade.',
        note: 'Cấu trúc S + Verb + Adverb.'
      }
    ],
    commonMistake: {
      incorrect: 'Sales increased dramatic during the final quarter.',
      corrected: 'Sales increased dramatically during the final quarter.',
      explanation: 'Bổ nghĩa cho động từ "increased" bắt buộc dùng trạng từ "dramatically".'
    },
    ieltsApplication: 'Linh hoạt hoán đổi giữa 2 cách diễn đạt trong Task 1 để đạt điểm cao tiêu chí Lexical Resource & Grammatical Range.',
    exercises: [
      {
        id: 'g07-ex-1',
        type: 'rewrite',
        question: 'Viết lại câu sau dùng cấu trúc "There was a + adj + noun":\n"Export revenue grew steadily between May and September."',
        correctAnswer: 'There was a steady growth in export revenue between May and September.',
        explanation: 'Chuyển động từ "grew steadily" thành cụm danh từ "a steady growth".',
        acceptableAnswers: [
          'There was a steady growth in export revenue between May and September.',
          'There was a steady increase in export revenue between May and September.'
        ]
      }
    ]
  },
  {
    id: 'g08-comparison',
    code: 'G08',
    category: 'core',
    title: 'Comparison Structures (Chủ chốt cho Task 1 & Task 2)',
    whyItMatters: 'Yêu cầu tiên quyết của đề thi Writing Task 1 là: "make comparisons where relevant". Nếu bài viết chỉ liệt kê số liệu rời rạc mà không có cấu trúc so sánh, điểm Task Achievement tối đa chỉ đạt band 5.',
    formula: 'Comparative: more ... than / -er than | Superlative: the most ... / -est | Whereas / Compared with / In comparison to',
    concept: 'So sánh đa dạng: So sánh hơn/kém, so sánh gấp bội (twice as high as, threefold), so sánh tương phản (whereas, while, in contrast to).',
    rules: [
      'So sánh hơn: "Oil consumption was considerably higher than natural gas usage."',
      'Gấp bội: "The figure for country A was twice as high as that for country B."',
      'Tương phản trong câu ghép: "Car usage increased, whereas bus patronage declined."',
      'Dùng "that of / those of" để tránh lặp danh từ: "The literacy rate of women was lower than that of men."'
    ],
    examples: [
      {
        sentence: 'Manufacturing output in Germany was nearly three times higher than that of Italy.',
        note: 'Dùng "that of" để thay thế cho "manufacturing output" ở vế sau.'
      },
      {
        sentence: 'In 2019, coal accounted for 45% of total energy, compared with only 12% for solar power.',
        note: 'Dùng cụm "compared with" để liên kết so sánh số liệu ngắn gọn.'
      }
    ],
    commonMistake: {
      incorrect: 'The car sales of France were higher than Germany.',
      corrected: 'The car sales of France were higher than those of Germany.',
      explanation: 'Lỗi so sánh khập khiễng: Không thể so sánh "doanh số ô tô" với "nước Đức". Phải so sánh với "những doanh số của nước Đức" (those of Germany).'
    },
    ieltsApplication: 'Tối thiểu 3 cấu trúc so sánh khác nhau trong bài Writing Task 1 phân tích biểu đồ.',
    exercises: [
      {
        id: 'g08-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu so sánh chuẩn học thuật không bị lỗi logic:',
        options: [
          'A. The birth rate in Japan was noticeably lower than Canada.',
          'B. The birth rate in Japan was noticeably lower than that in Canada.',
          'C. The birth rate in Japan was noticeably lower compared with Canada.'
        ],
        correctAnswer: 'B',
        explanation: 'Dùng đại từ "that in Canada" để đối sánh chính xác "birth rate" với "birth rate".'
      }
    ]
  },
  {
    id: 'g09-noun-phrases',
    code: 'G09',
    category: 'core',
    title: 'Complex Noun Phrases & Academic Density',
    whyItMatters: 'Văn phong IELTS Academic có đặc điểm là nén thông tin (lexical density) bằng các cụm danh từ cô đọng, thay vì viết các câu rườm rà như văn nói.',
    formula: 'Determiner + Pre-modifier(s) + Head Noun + Post-modifier(s) (prepositional phrase / relative clause / participle)',
    concept: 'Tập trung lượng thông tin lớn vào một cụm danh từ làm chủ ngữ hoặc tân ngữ: "the rapid proliferation of artificial intelligence in tertiary education".',
    rules: [
      'Bổ ngữ đứng trước (Pre-modifiers): Compound nouns, adjectives, participles (e.g. government-funded research initiatives).',
      'Bổ ngữ đứng sau (Post-modifiers): Cụm giới từ (of, in, for), mệnh đề quan hệ rút gọn, tính từ ghép.',
      'Tránh chuỗi danh từ quá dài gây khó hiểu: thay vì "university student mental health problem survey results", viết "the survey results concerning university students’ mental health".'
    ],
    examples: [
      {
        sentence: 'The government initiated a comprehensive long-term infrastructure investment scheme.',
        note: 'Cụm danh từ hoàn chỉnh làm tân ngữ cô đọng.'
      },
      {
        sentence: 'A noticeable drop in the consumption of processed sugar was observed among teenagers.',
        note: 'Cụm danh từ chứa cụm giới từ kép làm chủ ngữ.'
      }
    ],
    commonMistake: {
      incorrect: 'The thing that students are very stressful when they take the exams.',
      corrected: 'The acute psychological stress experienced by examination candidates.',
      explanation: 'Nâng cấp từ cách nói khẩu ngữ "the thing that..." sang cụm danh từ học thuật súc tích.'
    },
    ieltsApplication: 'Tạo chủ ngữ học thuật mạnh mẽ trong các câu mở đầu đoạn thân bài Writing Task 2.',
    exercises: [
      {
        id: 'g09-ex-1',
        type: 'fill-gap',
        question: 'Hoàn thành câu học thuật: "The rapid ______ (urbanise) of coastal regions led to severe habitat fragmentation."',
        options: ['urbanisation', 'urbanize', 'urban', 'urbanising'],
        correctAnswer: 'urbanisation',
        explanation: 'Cần danh từ trung tâm "urbanisation" sau mạo từ "The" và tính từ "rapid".'
      }
    ]
  },
  {
    id: 'g10-prepositions',
    code: 'G10',
    category: 'core',
    title: 'Dependent Prepositions & Task 1 Figures',
    whyItMatters: 'Dùng sai giới từ khi báo cáo số liệu Task 1 (tăng đến mức [to] hay tăng thêm một lượng [by], ở mức [at]) làm sai lệch 100% dữ liệu biểu đồ.',
    formula: 'increase by X (tăng thêm X) | increase to Y (tăng đến mốc Y) | stand at Z (đứng ở mức Z) | a peak of W (đạt đỉnh W)',
    concept: 'Giới từ đi liền với động từ và danh từ cố định trong mô tả số liệu và lập luận học thuật.',
    rules: [
      '"Increased BY 20%": Trước là 50%, giờ là 70% (biên độ chênh lệch là 20%).',
      '"Increased TO 70%": 70% là điểm đến cuối cùng.',
      '"Remained stable AT 30%": Duy trì ổn định tại mức 30%.',
      'Dependent prepositions học thuật: contribute TO, rely ON, lead TO, result IN, focus ON, be attributed TO.'
    ],
    examples: [
      {
        sentence: 'The proportion of graduates in employment rose by 10% to reach 85% in 2021.',
        note: 'Kết hợp "by" (biên độ tăng) và "to" (mốc đạt được).'
      },
      {
        sentence: 'Excessive reliance on fossil fuels contributes significantly to atmospheric degradation.',
        note: 'Cặp giới từ cố định "reliance ON" và "contributes TO".'
      }
    ],
    commonMistake: {
      incorrect: 'The figure rose at 50% in 2018.',
      corrected: 'The figure rose to 50% in 2018.',
      explanation: 'Khi nói số liệu tăng tới một mốc mới, dùng giới từ "to", không dùng "at".'
    },
    ieltsApplication: 'Sử dụng tuyệt đối chính xác giới từ số liệu trong mọi bài thi Task 1 Line Graph và Bar Chart.',
    exercises: [
      {
        id: 'g10-ex-1',
        type: 'fill-gap',
        question: 'Điền giới từ: "Unemployment rates dropped ______ 8% to 5% over the three-year period."',
        options: ['from', 'at', 'by', 'in'],
        correctAnswer: 'from',
        explanation: 'Cấu trúc chỉ điểm bắt đầu và điểm kết thúc: "from X to Y".'
      }
    ]
  },
  {
    id: 'g11-relative-clauses',
    code: 'G11',
    category: 'core',
    title: 'Defining & Non-Defining Relative Clauses',
    whyItMatters: 'Mệnh đề quan hệ (Relative clauses) là cách tự nhiên nhất để mở rộng câu đơn thành câu phức mà không lặp lại danh từ.',
    formula: 'Defining (không dấu phẩy, dùng that/which/who) | Non-defining (có dấu phẩy, bắt buộc dùng which/who, KHÔNG dùng that)',
    concept: 'Defining: Xác định danh từ đứng trước là ai/cái gì (nếu bỏ đi câu sẽ mất nghĩa). Non-defining: Cung cấp thêm thông tin bổ sung phụ trợ (nếu bỏ đi mệnh đề chính vẫn đủ nghĩa).',
    rules: [
      'Không dùng "that" trong mệnh đề quan hệ không xác định (có dấu phẩy).',
      'Mệnh đề quan hệ bổ nghĩa cho cả câu trước dùng ", which + verb": "Public subsidies were cut, which caused fare hikes."',
      'Đại từ sở hữu quan hệ: "whose + noun" (e.g. students whose parents are overseas).'
    ],
    examples: [
      {
        sentence: 'Countries that invest heavily in renewable infrastructure achieve greater energy security.',
        note: 'Defining clause: Không có dấu phẩy, xác định rõ quốc gia nào.'
      },
      {
        sentence: 'The new high-speed rail line, which was completed in 2022, shortened commute times considerably.',
        note: 'Non-defining clause: Đặt giữa hai dấu phẩy bổ sung thông tin cho tuyến đường sắt cụ thể.'
      }
    ],
    commonMistake: {
      incorrect: 'The Humber Bridge, that was opened in 1981, is an impressive engineering feat.',
      corrected: 'The Humber Bridge, which was opened in 1981, is an impressive engineering feat.',
      explanation: 'Mệnh đề sau dấu phẩy bổ nghĩa cho danh từ riêng không bao giờ được dùng "that", phải dùng "which".'
    },
    ieltsApplication: 'Sử dụng ", which means that..." hoặc ", which leads to..." để diễn giải hệ quả trong đoạn thân bài Task 2.',
    exercises: [
      {
        id: 'g11-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu dùng mệnh đề quan hệ chuẩn xác:',
        options: [
          'A. Municipal councils should support workers, which commute by bicycle.',
          'B. Municipal councils should support workers who commute by bicycle.',
          'C. Municipal councils should support workers which commute by bicycle.'
        ],
        correctAnswer: 'B',
        explanation: '"Workers" là người và là mệnh đề xác định (công nhân nào?) nên dùng đại từ "who" không có dấu phẩy.'
      }
    ]
  },
  {
    id: 'g12-modals',
    code: 'G12',
    category: 'core',
    title: 'Modal Verbs: Possibility, Probability & Recommendation',
    whyItMatters: 'Học thuật tiếng Anh kỵ khẳng định tuyệt đối 100%. Dùng động từ khuyết thiếu (can, could, may, might, should, would) giúp bài viết thể hiện sự khách quan và đề xuất biện pháp khéo léo.',
    formula: 'Modal + Base Verb (Bare Infinitive) | Modal + have + V3/ed (Quá khứ)',
    concept: 'Phân loại mức độ: Khả năng suy đoán (may, might, could) < Xác suất cao (will, is likely to) < Khuyến nghị hành động (should, ought to, must).',
    rules: [
      'Đề xuất giải pháp Task 2: "Governments should allocate funds..." hoặc "Municipalities could consider..."',
      'Dự đoán tác động: "Implementing congestion charges would likely deter private motorists."',
      'Tránh lạm dụng "must" độc đoán trong Task 2; ưu tiên "should" hoặc "need to".'
    ],
    examples: [
      {
        sentence: 'Subsidizing public transport could encourage motorists to leave their cars at home.',
        note: '"Could" thể hiện khả năng giả định, không áp đặt tuyệt đối.'
      },
      {
        sentence: 'Without immediate intervention, urban air quality will deteriorate further.',
        note: '"Will" dự đoán hệ quả chắc chắn dựa trên điều kiện đưa ra.'
      }
    ],
    commonMistake: {
      incorrect: 'This policy can to improve the standard of living.',
      corrected: 'This policy can improve the standard of living.',
      explanation: 'Sau modal verb "can" bắt buộc là động từ nguyên mẫu không "to" (bare infinitive).'
    },
    ieltsApplication: 'Viết câu đề xuất biện pháp ở đoạn thân bài thứ hai và kết bài Task 2.',
    exercises: [
      {
        id: 'g12-ex-1',
        type: 'fill-gap',
        question: 'Chọn modal verb thích hợp nhất: "Local authorities ______ prioritize affordable public housing for young families."',
        options: ['should', 'might have', 'could to', 'ought'],
        correctAnswer: 'should',
        explanation: 'Khuyến nghị giải pháp chính sách dùng "should + V-bare".'
      }
    ]
  },
  {
    id: 'g13-passive-voice',
    code: 'G13',
    category: 'core',
    title: 'Passive Voice in IELTS Processes & Academic Tone',
    whyItMatters: 'Trong Writing Task 1 dạng bài Process (Quy trình sản xuất, Vòng đời) và Writing Task 2, câu bị động là công cụ bắt buộc để duy trì giọng văn khách quan.',
    formula: 'S + be (chia theo thì) + V3/ed [+ by Agent]',
    concept: 'Dùng bị động khi hành động quan trọng hơn người thực hiện, hoặc khi người thực hiện là hiển nhiên/vô danh/không cần thiết nêu tên.',
    rules: [
      'Task 1 Process: "The tea leaves are hand-picked, dried in ovens, and then packaged into crates."',
      'Bị động với Modal: Modal + be + V3/ed (e.g. strict sanctions must be enforced).',
      'Bị động thì Hoàn thành: have/has been + V3/ed (e.g. substantial funds have been allocated).'
    ],
    examples: [
      {
        sentence: 'At the second stage of the recycling process, plastic bottles are sorted by color.',
        note: 'Hiện tại đơn bị động mô tả bước quy trình công nghiệp.'
      },
      {
        sentence: 'Stringent workplace safety regulations have been implemented across all facilities.',
        note: 'Hiện tại hoàn thành bị động nhấn mạnh kết quả đã hoàn thành.'
      }
    ],
    commonMistake: {
      incorrect: 'The raw materials are transport to the manufacturing facility.',
      corrected: 'The raw materials are transported to the manufacturing facility.',
      explanation: 'Động từ trong thể bị động phải ở dạng Quá khứ phân từ (V3/ed).'
    },
    ieltsApplication: 'Viết bài Writing Task 1 miêu tả sơ đồ quy trình sản xuất (Man-made process).',
    exercises: [
      {
        id: 'g13-ex-1',
        type: 'rewrite',
        question: 'Chuyển câu sau sang thể bị động trong quy trình:\n"Workers wash the harvested cocoa beans with pressurized water."',
        correctAnswer: 'The harvested cocoa beans are washed with pressurized water.',
        explanation: 'Chủ ngữ "The harvested cocoa beans" (số nhiều) + are + washed.',
        acceptableAnswers: [
          'The harvested cocoa beans are washed with pressurized water.',
          'The harvested cocoa beans are washed with pressurized water by workers.'
        ]
      }
    ]
  },
  {
    id: 'g14-gerund-infinitive',
    code: 'G14',
    category: 'core',
    title: 'Gerunds, Infinitives & Verb Complementation',
    whyItMatters: 'Dùng sai V-ing / to-V làm biến dạng ngữ pháp của câu. Ngoài ra, dùng Danh động từ (Gerund V-ing) ở đầu câu làm chủ ngữ là cách tuyệt vời để đa dạng hóa cấu trúc câu.',
    formula: 'V-ing as Subject | Verb + to-V (decide, manage, tend) | Verb + V-ing (avoid, consider, delay)',
    concept: 'Gerund hoạt động như một danh từ. Đặt Gerund làm chủ ngữ tạo câu văn học thuật đĩnh đạc: "Investing in youth development yields long-term economic gains."',
    rules: [
      'Gerund làm chủ ngữ luôn đi với động từ số ÍT: "Exercising daily reduces cardiovascular risks."',
      'Sau giới từ luôn là V-ing: "By introducing stricter laws...", "In addition to reducing waste..."',
      'Động từ chỉ ý định/mục tiêu: aim to, tend to, seek to, manage to.',
      'Động từ chỉ thói quen/tránh né: avoid doing, enjoy doing, practice doing.'
    ],
    examples: [
      {
        sentence: 'Adopting sustainable agricultural practices mitigates soil degradation.',
        note: 'Danh động từ "Adopting..." làm chủ ngữ, động từ chia số ít "mitigates".'
      },
      {
        sentence: 'Municipal leaders aim to eliminate landfill reliance by 2030.',
        note: '"aim" đi với to-Infinitive.'
      }
    ],
    commonMistake: {
      incorrect: 'In addition to provide free healthcare, the state should fund fitness centers.',
      corrected: 'In addition to providing free healthcare, the state should fund fitness centers.',
      explanation: 'Sau cụm giới từ "In addition to", từ đi kèm phải là V-ing (providing).'
    },
    ieltsApplication: 'Biến đổi câu mở đầu đoạn văn thành cấu trúc Gerund Subject để đạt điểm cao GRA.',
    exercises: [
      {
        id: 'g14-ex-1',
        type: 'fill-gap',
        question: 'Chọn dạng đúng của động từ: "______ (commute) by public transport significantly lowers individual carbon footprints."',
        options: ['Commuting', 'To commute', 'Commute', 'Commuted'],
        correctAnswer: 'Commuting',
        explanation: 'Gerund "Commuting" đóng vai trò chủ ngữ của câu.'
      }
    ]
  },
  {
    id: 'g15-conditionals',
    code: 'G15',
    category: 'core',
    title: 'Conditionals in IELTS Writing & Speaking',
    whyItMatters: 'Câu điều kiện loại 1 và loại 2 là vũ khí đắc lực khi thảo luận các giải pháp chính sách và hậu quả giả định trong Writing Task 2.',
    formula: 'Type 1: If + S + V(present), S + will / can + V | Type 2: If + S + V2/ed (were), S + would / could + V',
    concept: 'Loại 1: Giả định có thật hoặc có khả năng cao ở hiện tại/tương lai. Loại 2: Giả định trái ngược với thực tế hiện tại hoặc giải pháp mang tính lý tưởng hóa.',
    rules: [
      'Loại 1: "If governments subsidize electric cars, consumer adoption will accelerate rapidly."',
      'Loại 2: "If higher taxes were levied on tobacco, smoking rates would decline substantially."',
      'Trong văn viết học thuật, mệnh đề "if" của loại 2 dùng "were" cho tất cả các ngôi (kể cả I/he/she/it).'
    ],
    examples: [
      {
        sentence: 'If municipal authorities invest in cycling highways, traffic congestion will ease.',
        note: 'Điều kiện loại 1: Khả năng thực tế rõ ràng.'
      },
      {
        sentence: 'If secondary schools were to mandate financial literacy, young adults would manage savings more effectively.',
        note: 'Điều kiện loại 2 giả định chính sách lý tưởng.'
      }
    ],
    commonMistake: {
      incorrect: 'If companies will offer remote working options, productivity increases.',
      corrected: 'If companies offer remote working options, productivity will increase.',
      explanation: 'Mệnh đề chứa "if" không bao giờ dùng "will", chỉ chia ở thì Hiện tại đơn.'
    },
    ieltsApplication: 'Dùng câu điều kiện loại 1 & 2 để phát triển luận cứ phản chứng (counter-argument) trong Task 2.',
    exercises: [
      {
        id: 'g15-ex-1',
        type: 'fill-gap',
        question: 'Điền động từ đúng: "If strict anti-pollution legislation ______ (enact), marine biodiversity will recover gradually."',
        options: ['is enacted', 'will be enacted', 'enacts', 'was enacted'],
        correctAnswer: 'is enacted',
        explanation: 'Mệnh đề If loại 1 ở thể bị động: "is enacted".'
      }
    ]
  },
  {
    id: 'g16-complex-sentences',
    code: 'G16',
    category: 'core',
    title: 'Complex Sentences with Subordinating Conjunctions',
    whyItMatters: 'Tiêu chí band 6.0 trở lên trong IELTS bắt buộc thí sinh phải "use a mix of simple and complex sentence forms". Viết câu phức bằng các liên từ phụ thuộc là chìa khóa mở band điểm này.',
    formula: 'Dependent Clause (bắt đầu bằng although, while, because, unless, since) + comma + Independent Clause',
    concept: 'Mệnh đề phụ thuộc bổ sung sắc thái nhượng bộ (although, whereas), nguyên nhân (because, since), điều kiện (unless), hoặc thời gian (when, before) cho mệnh đề độc lập.',
    rules: [
      'Nhượng bộ: although / even though / whereas + clause (e.g. Although tuition fees rose, university enrollment remained steady).',
      'Phủ định điều kiện: unless = if not (e.g. Unless drastic measures are implemented, pollution will rise).',
      'Tương phản: while / whereas (e.g. Western nations prioritize services, whereas emerging economies rely on manufacturing).',
      'Tuyệt đối không dùng cặp "Although ... but ..." hoặc "Because ... so ..." trong cùng một câu tiếng Anh.'
    ],
    examples: [
      {
        sentence: 'While automated machinery accelerates output, it inevitably displaces manual laborers.',
        note: '"While" thể hiện tính tương phản hai mặt của vấn đề trong một câu duy nhất.'
      },
      {
        sentence: 'Unless municipal authorities upgrade sewer systems, recurrent urban flooding will persist.',
        note: '"Unless" thay cho "If ... do not".'
      }
    ],
    commonMistake: {
      incorrect: 'Although online learning is convenient, but it lacks interpersonal interaction.',
      corrected: 'Although online learning is convenient, it lacks interpersonal interaction.',
      explanation: 'Lỗi dịch từ tiếng Việt "Mặc dù... nhưng...". Trong tiếng Anh chỉ dùng "Although", bỏ hẳn "but".'
    },
    ieltsApplication: 'Viết câu mở bài (Introduction) tóm tắt hai luồng ý kiến trái chiều trong dạng bài Discuss Both Views.',
    exercises: [
      {
        id: 'g16-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu phức ngữ pháp chuẩn xác:',
        options: [
          'A. Because air travel has become affordable, so tourist numbers have surged.',
          'B. Because air travel has become affordable, tourist numbers have surged.',
          'C. Air travel has become affordable, because tourist numbers surged.'
        ],
        correctAnswer: 'B',
        explanation: 'Đã có liên từ "Because" ở đầu câu thì vế sau không dùng "so".'
      }
    ]
  },
  {
    id: 'g17-linking-ideas',
    code: 'G17',
    category: 'core',
    title: 'Linking Ideas & Appropriate Discourse Markers',
    whyItMatters: 'Rất nhiều thí sinh band 5.5 bị trừ điểm Cohesion vì "mechanical linking" (lạm dụng vô tội vạ Firstly, Secondly, Furthermore, Moreover ở đầu mọi câu). IELTS chấm điểm cao khi liên từ được đặt tự nhiên đúng mạch suy nghĩ.',
    formula: 'Independent Clause. Transition Word, Independent Clause. HOẶC Clause; Transition Word, Clause.',
    concept: 'Dùng từ nối đúng chức năng: Bổ sung ý (Furthermore, In addition), Tương phản (However, Conversely), Kết luận/Hệ quả (Consequently, Therefore).',
    rules: [
      'Tránh mở đầu 4 câu liên tiếp bằng từ nối đơn điệu.',
      'Đặt trạng từ liên kết vào giữa câu để tạo nhịp điệu tự nhiên: "This approach, however, entails significant financial risks."',
      'Phân biệt "In spite of / Despite + Noun/V-ing" với "Although + Clause".'
    ],
    examples: [
      {
        sentence: 'Public spending on arts was curtailed. Consequently, regional galleries faced severe closures.',
        note: '"Consequently" chỉ kết quả trực tiếp của hành động trước đó.'
      },
      {
        sentence: 'Solar energy is environmentally benign; however, its intermittent nature necessitates battery storage.',
        note: 'Dùng chấm phẩy và phẩy bao quanh "however".'
      }
    ],
    commonMistake: {
      incorrect: 'Despite the weather was harsh, researchers completed the fieldwork.',
      corrected: 'Despite the harsh weather, researchers completed the fieldwork.',
      explanation: 'Sau "Despite" chỉ đi với cụm danh từ hoặc V-ing, không đi với mệnh đề có chủ-vị.'
    },
    ieltsApplication: 'Tạo dòng chảy lập luận tự nhiên (cohesion flow) trong các đoạn thân bài Body Paragraphs.',
    exercises: [
      {
        id: 'g17-ex-1',
        type: 'fill-gap',
        question: 'Chọn từ nối thích hợp: "Renewable energy adoption is expanding. High installation costs, ______, continue to deter low-income households."',
        options: ['however', 'therefore', 'furthermore', 'because'],
        correctAnswer: 'however',
        explanation: 'Vị trí giữa câu mang sắc thái tương phản với câu trước đòi hỏi dùng "however".'
      }
    ]
  },
  {
    id: 'g18-cause-effect-purpose',
    code: 'G18',
    category: 'core',
    title: 'Expressing Cause, Effect & Purpose',
    whyItMatters: 'Trong Writing Task 2 (đặc biệt dạng Cause & Effect / Problem & Solution), thí sinh phải liên tục giải thích tại sao vấn đề nảy sinh và giải pháp hướng tới mục đích gì.',
    formula: 'Cause: due to / owing to / as a result of + Noun | Effect: lead to / result in / trigger + Noun | Purpose: in order to / so as to + V',
    concept: 'Thay vì lặp lại từ "because" nhiều lần, làm chủ các cấu trúc chỉ nguyên nhân - kết quả - mục đích đa dạng.',
    rules: [
      '"lead to / result in + V-ing/Noun": "Overfishing leads to the depletion of marine stocks."',
      '"as a consequence of / due to + Noun Phrase": "Due to increased urbanization, wildlife habitats shrunk."',
      '"in order to / so as to + Bare Infinitive": "Governments enforce regulations in order to curb emissions."'
    ],
    examples: [
      {
        sentence: 'Deforestation results in extensive soil erosion and reduced agricultural yields.',
        note: '"results in" chỉ kết quả phát sinh.'
      },
      {
        sentence: 'Subsidies were introduced so as to encourage domestic manufacturing.',
        note: '"so as to" diễn tả mục đích rõ ràng.'
      }
    ],
    commonMistake: {
      incorrect: 'The accident was happened because of careless.',
      corrected: 'The accident occurred due to carelessness.',
      explanation: '"careless" là tính từ; sau "due to / because of" bắt buộc là danh từ "carelessness".'
    },
    ieltsApplication: 'Viết câu giải thích cơ chế nguyên nhân - hệ quả trong phần Cause and Solution của essay.',
    exercises: [
      {
        id: 'g18-ex-1',
        type: 'fill-gap',
        question: 'Điền từ thích hợp: "Excessive industrial dumping has resulted ______ severe river pollution."',
        options: ['in', 'from', 'to', 'with'],
        correctAnswer: 'in',
        explanation: 'Cụm động từ chỉ kết quả: "result in + Noun".'
      }
    ]
  },
  {
    id: 'g19-hedging',
    code: 'G19',
    category: 'core',
    title: 'Hedging & Academic Stance (Tính cẩn trọng học thuật)',
    whyItMatters: 'Tiêu chí chấm điểm IELTS Academic đánh giá cao khả năng "hedging" — tức là đưa ra nhận định chừng mực, khách quan, không vơ đũa cả nắm (over-generalization).',
    formula: 'tend to / appear to / is likely to / predominantly / it is plausible that',
    concept: 'Thay vì viết khẳng định tuyệt đối "Computers make people lazy", người viết học thuật dùng hedging: "Excessive computer usage tends to diminish physical activity levels."',
    rules: [
      'Động từ chỉ xu hướng: tend to, appear to, seem to.',
      'Trạng từ chỉ mức độ: largely, partially, arguably, relatively.',
      'Tính từ xác suất: is likely to, is probable that, is conceivable that.'
    ],
    examples: [
      {
        sentence: 'Children who spend excessive hours on screens appear to experience diminished attention spans.',
        note: '"appear to experience" cẩn trọng hơn nhiều so với "experience".'
      },
      {
        sentence: 'Higher fuel tariffs are likely to incentivize the purchase of hybrid vehicles.',
        note: '"are likely to" đưa ra dự báo hợp lý chứ không khẳng định 100%.'
      }
    ],
    commonMistake: {
      incorrect: 'Social media always ruins interpersonal relationships among youth.',
      corrected: 'Excessive social media consumption often tends to erode face-to-face interpersonal connections.',
      explanation: 'Bỏ từ tuyệt đối "always ruins", thay bằng "tends to erode" mang tính học thuật cao.'
    },
    ieltsApplication: 'Trình bày luận điểm trong đoạn phản biện và câu phát biểu quan điểm ở Task 2.',
    exercises: [
      {
        id: 'g19-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu thể hiện tính cẩn trọng học thuật (Hedging) chuẩn mực:',
        options: [
          'A. Remote working completely eliminates all workplace communication.',
          'B. Remote working tends to alter traditional modes of office interaction.',
          'C. Remote working will definitely destroy company culture.'
        ],
        correctAnswer: 'B',
        explanation: '"tends to alter" diễn đạt xu hướng khách quan, tránh khẳng định phiến diện.'
      }
    ]
  },
  {
    id: 'g20-text-organisation',
    code: 'G20',
    category: 'core',
    title: 'Text Organisation & Paragraph Cohesion',
    whyItMatters: 'Một bài viết band 7.0 phải có cấu trúc đoạn văn rõ ràng: Topic Sentence (Câu chủ đề) -> Supporting Idea 1 (Luận điểm 1) -> Example/Evidence (Ví dụ) -> Supporting Idea 2 -> Concluding/Linking sentence.',
    formula: 'Topic Sentence (General Claim) -> Explanation -> Concrete Evidence -> Synthesis',
    concept: 'Mỗi đoạn văn chỉ tập trung vào một trọng tâm chính (One central topic per paragraph). Các câu trong đoạn phải bổ trợ trực tiếp cho câu chủ đề.',
    rules: [
      'Câu đầu đoạn (Topic Sentence) phải nêu bật chủ đề và quan điểm của cả đoạn.',
      'Dùng cấu trúc "For instance / For example" để đưa ra minh chứng rõ ràng.',
      'Đảm bảo tính thống nhất (Unity): Không chèn ý lạc đề không liên quan vào giữa đoạn.'
    ],
    examples: [
      {
        sentence: 'First and foremost, investment in public transit infrastructure alleviates chronic urban congestion.',
        note: 'Topic sentence chuẩn mẫu: xác định rõ ý chính của đoạn.'
      },
      {
        sentence: 'A prime example of this is Bogota’s TransMilenio bus rapid transit network.',
        note: 'Đưa ví dụ minh họa trực tiếp cho luận cứ giao thông công cộng.'
      }
    ],
    commonMistake: {
      incorrect: 'First, traffic is bad. Also pollution is high. And schools need money.',
      corrected: 'Firstly, inadequate transportation infrastructure exacerbates urban congestion, which subsequently intensifies vehicular emissions.',
      explanation: 'Không gom 3 ý rời rạc không liên quan vào một đoạn; phát triển sâu một luận điểm có tính liên kết nhân-quả.'
    },
    ieltsApplication: 'Xây dựng khung dàn bài (essay structure) 4 đoạn hoàn chỉnh trong 40 phút.',
    exercises: [
      {
        id: 'g20-ex-1',
        type: 'multiple-choice',
        question: 'Chức năng quan trọng nhất của câu Topic Sentence ở đầu đoạn thân bài là gì?',
        options: [
          'A. Liệt kê toàn bộ số liệu thống kê chi tiết của đoạn',
          'B. Giới thiệu rõ ràng luận điểm trọng tâm mà đoạn văn sẽ triển khai',
          'C. Trích dẫn một câu danh ngôn nổi tiếng'
        ],
        correctAnswer: 'B',
        explanation: 'Topic sentence phải nêu rõ ý chính và định hướng phát triển của toàn đoạn.'
      }
    ]
  },

  // ==========================================
  // SECTION 3: ADVANCED / OPTIONAL (G21 - G26)
  // Sophisticated structures for Band 7.5+
  // ==========================================
  {
    id: 'g21-participle-clauses',
    code: 'G21',
    category: 'advanced',
    title: 'Participle Clauses (Mệnh đề phân từ rút gọn)',
    whyItMatters: 'Rút gọn mệnh đề quan hệ hoặc mệnh đề chỉ lý do/thời gian bằng phân từ (V-ing hoặc V3/ed) giúp câu văn súc tích, nhịp nhàng và đậm chất Academic.',
    formula: 'V-ing (chủ động) / V3/ed (bị động) / Having V3/ed (hoàn thành), Main Clause',
    concept: 'Chủ ngữ của mệnh đề phân từ phải trùng với chủ ngữ của mệnh đề chính, tránh lỗi phân từ treo lơ lửng (dangling participle).',
    rules: [
      'Present Participle (Chủ động): "Facing severe budget deficits, municipal leaders suspended the project."',
      'Past Participle (Bị động): "Restored by skilled engineers, the historic aqueduct continues to supply fresh water."',
      'Perfect Participle (Hành động xảy ra trước): "Having completed extensive laboratory trials, the researchers published their findings."'
    ],
    examples: [
      {
        sentence: 'Lacking appropriate protective equipment, numerous factory workers were vulnerable to toxic fumes.',
        note: 'Rút gọn mệnh đề chỉ nguyên nhân (Because they lacked -> Lacking).'
      },
      {
        sentence: 'Constructed during the Victorian era, the bridge remains structurally sound today.',
        note: 'Rút gọn mệnh đề bị động (Although it was constructed -> Constructed).'
      }
    ],
    commonMistake: {
      incorrect: 'Walking down the street, the museum came into view.',
      corrected: 'Walking down the street, we caught sight of the museum.',
      explanation: 'Lỗi Dangling Participle: Bảo tàng không thể "tự đi bộ xuống phố". Chủ ngữ mệnh đề chính phải là người thực hiện hành động đi bộ (we).'
    },
    ieltsApplication: 'Tạo câu phức nâng cao ở phần mở rộng luận điểm trong đoạn thân bài Task 2.',
    exercises: [
      {
        id: 'g21-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu dùng mệnh đề phân từ rút gọn chuẩn xác, không bị lỗi dangling modifier:',
        options: [
          'A. Having examined the survey data, several groundbreaking conclusions were reached by the scientists.',
          'B. Having examined the survey data, the scientists drew several groundbreaking conclusions.',
          'C. Having been examined the data, conclusions were drawn.'
        ],
        correctAnswer: 'B',
        explanation: 'Người phân tích dữ liệu là "the scientists", chủ ngữ này phải đứng ngay đầu mệnh đề chính.'
      }
    ]
  },
  {
    id: 'g22-nominalisation',
    code: 'G22',
    category: 'advanced',
    title: 'Nominalisation (Danh từ hóa học thuật)',
    whyItMatters: 'Danh từ hóa là đặc trưng số một phân biệt tiếng Anh học thuật (Academic English) với tiếng Anh giao tiếp hàng ngày. Thay vì dùng nhiều động từ và tính từ, biến chúng thành danh từ trừu tượng.',
    formula: 'Verb / Adjective -> Academic Noun (e.g. destroy -> destruction, migrate -> migration, scarce -> scarcity)',
    concept: 'Biến chuỗi hành động thành thực thể trừu tượng để câu văn khách quan hơn: Thay vì "People move from countryside to cities and this causes overcrowding", viết "Rural-to-urban migration contributes significantly to metropolitan overcrowding."',
    rules: [
      'Chuyển động từ chỉ thay đổi thành danh từ: stabilize -> stabilization, deplete -> depletion, fluctuate -> fluctuation.',
      'Sử dụng danh từ hóa để liên kết ý với câu trước (Anaphoric nominalization).',
      'Không lạm dụng danh từ hóa quá mức gây tối nghĩa cho câu.'
    ],
    examples: [
      {
        sentence: 'The rapid depletion of underground aquifers threatens agricultural viability.',
        note: 'Dùng danh từ hóa "The rapid depletion" thay vì "Aquifers are depleting rapidly".'
      },
      {
        sentence: 'Industrial expansion in suburban perimeters has accelerated land clearance.',
        note: '"Industrial expansion" tạo giọng văn học thuật trang trọng.'
      }
    ],
    commonMistake: {
      incorrect: 'When population grows fast, it makes water become scarce.',
      corrected: 'Rapid population growth exacerbates water scarcity.',
      explanation: 'Chuyển đổi hoàn toàn sang văn phong học thuật nhờ hai danh từ hóa: "population growth" và "water scarcity".'
    },
    ieltsApplication: 'Nâng cấp toàn bộ câu văn từ band 5.5 (nhiều liên từ đơn) lên band 7.5+ (cô đọng, học thuật).',
    exercises: [
      {
        id: 'g22-ex-1',
        type: 'rewrite',
        question: 'Danh từ hóa câu sau để đạt văn phong học thuật:\n"Because trees were destroyed extensively, local soil eroded severely."',
        correctAnswer: 'Extensive deforestation resulted in severe soil erosion.',
        explanation: 'Chuyển "trees were destroyed" thành "Extensive deforestation" và "soil eroded" thành "severe soil erosion".',
        acceptableAnswers: [
          'Extensive deforestation resulted in severe soil erosion.',
          'Extensive tree destruction led to severe soil erosion.'
        ]
      }
    ]
  },
  {
    id: 'g23-advanced-passive-reporting',
    code: 'G23',
    category: 'advanced',
    title: 'Advanced Impersonal Passive & Reporting Verbs',
    whyItMatters: 'Trong Task 2, thí sinh không nên liên tục dùng "I think" hay "People say". Cấu trúc bị động khách quan (It is widely argued that / X is believed to have been) tạo sự trung lập tối đa cho bài thi.',
    formula: 'It is + believed / claimed / asserted / acknowledged + that + Clause | Subject + is said / reported + to be / to have + V3',
    concept: 'Trình bày quan điểm của các học giả, chuyên gia hoặc dư luận xã hội mà không gán quan điểm chủ quan của cá nhân.',
    rules: [
      'It is widely acknowledged that + S + V: "It is widely acknowledged that early childhood education yields lifelong benefits."',
      'S + is considered to + V: "Physical activity is considered to alleviate stress."',
      'Nhắc đến sự kiện quá khứ: "Ancient automata are reputed to have been powered by ingenious water mechanisms."'
    ],
    examples: [
      {
        sentence: 'It is increasingly argued that telecommuting will supplant conventional office models.',
        note: 'Cấu trúc impersonal passive mở đầu luận điểm tranh luận.'
      },
      {
        sentence: 'Excessive sugar intake is thought to be the primary catalyst for metabolic disorders.',
        note: 'Cấu trúc S + is thought to be...'
      }
    ],
    commonMistake: {
      incorrect: 'People believe that early schooling shapes cognitive ability.',
      corrected: 'It is widely believed that early schooling shapes cognitive ability.',
      explanation: 'Thay "People believe" bằng bị động khách quan "It is widely believed that..." trang trọng hơn rất nhiều.'
    },
    ieltsApplication: 'Mở đầu câu luận điểm trong đoạn văn thảo luận về quan điểm đối lập (opposing view).',
    exercises: [
      {
        id: 'g23-ex-1',
        type: 'rewrite',
        question: 'Chuyển sang thể bị động khách quan với "It is widely recognized that":\n"Many researchers recognize that artificial intelligence will transform medical diagnostics."',
        correctAnswer: 'It is widely recognized that artificial intelligence will transform medical diagnostics.',
        explanation: 'Cấu trúc: It is widely recognized that + clause hoàn chỉnh.',
        acceptableAnswers: [
          'It is widely recognized that artificial intelligence will transform medical diagnostics.',
          'It is widely recognised that artificial intelligence will transform medical diagnostics.'
        ]
      }
    ]
  },
  {
    id: 'g24-inversion',
    code: 'G24',
    category: 'advanced',
    title: 'Inversion with Negative & Limiting Adverbials',
    whyItMatters: 'Đảo ngữ là một trong những cấu trúc tinh tế nhất của tiếng Anh học thuật. Sử dụng đúng vị trí 1 lần trong bài Writing Task 2 hoặc Speaking Part 3 là minh chứng rõ ràng cho trình độ ngữ pháp nâng cao (Band 7.5+).',
    formula: 'Negative/Limiting Adverbial (Not only, Seldom, Rarely, Only by, Under no circumstances) + Auxiliary + Subject + Main Verb',
    concept: 'Đưa phó từ phủ định hoặc giới hạn lên đầu câu để tạo sự nhấn mạnh đanh thép, trợ động từ phải đảo lên trước chủ ngữ như câu hỏi.',
    rules: [
      'Not only + Aux + S + V, but S + also + V (Không những... mà còn...)',
      'Only by + V-ing + Aux + S + V (Chỉ bằng cách... mới có thể...)',
      'Under no circumstances + should/must + S + V (Dù trong hoàn cảnh nào cũng không được...)',
      'Seldom / Rarely + do/does/did + S + V (Hiếm khi...)'
    ],
    examples: [
      {
        sentence: 'Not only does public transport reduce urban carbon emissions, but it also generates substantial economic savings for commuters.',
        note: 'Trợ động từ "does" đảo lên trước chủ ngữ "public transport".'
      },
      {
        sentence: 'Only by enforcing strict maritime regulations can governments protect endangered coral reefs.',
        note: 'Trợ động từ "can" đảo lên trước chủ ngữ "governments".'
      }
    ],
    commonMistake: {
      incorrect: 'Not only public transport reduces emissions, but it also saves money.',
      corrected: 'Not only does public transport reduce emissions, but it also saves money.',
      explanation: 'Khi đưa "Not only" lên đầu câu, bắt buộc phải đảo trợ động từ (does) lên trước chủ ngữ.'
    },
    ieltsApplication: 'Nhấn mạnh giải pháp mang tính quyết định ở câu cuối cùng của đoạn thân bài thứ hai.',
    exercises: [
      {
        id: 'g24-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu đảo ngữ chính xác:',
        options: [
          'A. Under no circumstances citizens should violate environmental laws.',
          'B. Under no circumstances should citizens violate environmental laws.',
          'C. Under no circumstances citizens violate should environmental laws.'
        ],
        correctAnswer: 'B',
        explanation: 'Sau "Under no circumstances", trợ động từ "should" phải đứng trước chủ ngữ "citizens".'
      }
    ]
  },
  {
    id: 'g25-cleft-sentences',
    code: 'G25',
    category: 'advanced',
    title: 'Cleft Sentences for Focus & Emphasis',
    whyItMatters: 'Câu chẻ (It-cleft và Wh-cleft / Pseudo-cleft) cho phép người viết hướng sự chú ý tuyệt đối của giám khảo vào nguyên nhân cốt lõi hoặc giải pháp mấu chốt.',
    formula: 'It + is/was + [Thành phần nhấn mạnh] + that/who ... HOẶC What + Clause + is/was + ...',
    concept: 'Chia câu đơn thành hai vế để làm nổi bật thành phần trọng tâm (chủ ngữ, tân ngữ, hoặc cụm trạng từ chỉ lý do).',
    rules: [
      'It is/was + Noun/Phrase + that: "It is investment in renewable infrastructure that drives long-term sustainability."',
      'What + Clause + is: "What policy makers must recognize is the urgency of the climate crisis."',
      'All that + Clause + is: "All that many struggling schools require is consistent fiscal support."'
    ],
    examples: [
      {
        sentence: 'It was technological innovation during the 18th century that democratized mechanical timekeeping.',
        note: 'Nhấn mạnh nguyên nhân "technological innovation during the 18th century".'
      },
      {
        sentence: 'What distinguishes successful educational systems is their emphasis on continuous teacher training.',
        note: 'Wh-cleft nhấn mạnh đặc điểm cốt lõi.'
      }
    ],
    commonMistake: {
      incorrect: 'It is the lack of funding what causes educational inequality.',
      corrected: 'It is the lack of funding that causes educational inequality.',
      explanation: 'Trong cấu trúc It-cleft, đại từ liên kết phải là "that" (hoặc "who" cho người), không dùng "what".'
    },
    ieltsApplication: 'Tạo câu kết luận đanh thép khẳng định nguyên nhân sâu xa của vấn đề.',
    exercises: [
      {
        id: 'g25-ex-1',
        type: 'rewrite',
        question: 'Viết lại câu sau dùng cấu trúc It-cleft nhấn mạnh "economic factors":\n"Economic factors primarily drive international migration."',
        correctAnswer: 'It is economic factors that primarily drive international migration.',
        explanation: 'Cấu trúc: It is [economic factors] that [primarily drive international migration].',
        acceptableAnswers: [
          'It is economic factors that primarily drive international migration.'
        ]
      }
    ]
  },
  {
    id: 'g26-inverted-conditionals',
    code: 'G26',
    category: 'advanced',
    title: 'Inverted Conditionals (Đảo ngữ câu điều kiện không dùng If)',
    whyItMatters: 'Loại bỏ liên từ "if" và đảo trợ động từ (Should, Were, Had) lên đầu câu mang lại sắc thái cực kỳ trang trọng (high formality), rất được ưa chuộng trong văn bản học thuật C1/C2.',
    formula: 'Type 1: Should + S + V | Type 2: Were + S + to V (hoặc Were + S + adj) | Type 3: Had + S + (not) + V3/ed',
    concept: 'Thay vì viết "If you need further help", viết "Should you require further assistance". Thể hiện khả năng làm chủ cấu trúc câu cao cấp.',
    rules: [
      'Loại 1 (thay cho If + S + present): "Should international borders reopen, global trade will rebound."',
      'Loại 2 (thay cho If + S + past): "Were governments to subsidize solar panels, adoption would surge."',
      'Loại 3 (thay cho If + S + had V3): "Had municipal authorities acted earlier, the flood would have been averted."',
      'Khi phủ định, đặt "not" sau chủ ngữ: "Had the engineers not intervened, the structure would have collapsed."'
    ],
    examples: [
      {
        sentence: 'Should unexpected technical complications arise, the backup generator activates automatically.',
        note: 'Đảo ngữ loại 1: Should + Subject + Bare Infinitive.'
      },
      {
        sentence: 'Were municipal councils to prioritize cycling corridors, vehicular congestion would decrease noticeably.',
        note: 'Đảo ngữ loại 2: Were + Subject + to Verb.'
      }
    ],
    commonMistake: {
      incorrect: 'Had the government did not intervene, the crisis would have deepened.',
      corrected: 'Had the government not intervened, the crisis would have deepened.',
      explanation: 'Trong đảo ngữ điều kiện loại 3 phủ định, cấu trúc chuẩn là "Had + S + not + V3/ed" (không dùng did not).'
    },
    ieltsApplication: 'Dùng câu điều kiện đảo ngữ để đưa ra cảnh báo hoặc giả thuyết chính sách nâng cao trong Task 2.',
    exercises: [
      {
        id: 'g26-ex-1',
        type: 'multiple-choice',
        question: 'Chọn câu đảo ngữ điều kiện loại 2 chuẩn xác nhất:',
        options: [
          'A. Were companies to adopt flexible working hours, employee retention would improve.',
          'B. Did companies adopt flexible working hours, employee retention would improve.',
          'C. Should companies to adopt flexible working hours, employee retention would improve.'
        ],
        correctAnswer: 'A',
        explanation: 'Đảo ngữ điều kiện loại 2 dùng cấu trúc "Were + S + to V".'
      }
    ]
  }
];
