import { ReadingStrategyLesson, ReadingQuestionGroup } from '../types';

export const READING_QUESTION_GROUPS: { id: ReadingQuestionGroup; label: string; desc: string }[] = [
  { id: 'statements', label: 'Statements (Xác định ý kiến / Sự thật)', desc: 'True/False/Not Given & Yes/No/Not Given' },
  { id: 'matching', label: 'Matching (Nối thông tin)', desc: 'Headings, Information, Features, Sentence Endings' },
  { id: 'completion', label: 'Completion (Điền từ vào chỗ trống)', desc: 'Sentence, Summary, Note, Table, Flow-chart, Diagram' },
  { id: 'questions', label: 'Questions (Chọn đáp án & Trả lời ngắn)', desc: 'Multiple Choice & Short Answer' },
];

export const READING_STRATEGY_LESSONS: ReadingStrategyLesson[] = [
  // 1. True / False / Not Given
  {
    type: 'true-false-notgiven',
    group: 'statements',
    title: 'True / False / Not Given',
    subtitle: 'Xác định tính xác thực của nhận định dựa trên sự thật khách quan (Fact) trong bài đọc',
    officialFormat: 'Đề thi cung cấp các nhận định và yêu cầu bạn xác định dựa trên thông tin trong bài: TRUE (thông tin trùng khớp với bài đọc), FALSE (thông tin mâu thuẫn hoàn toàn với bài đọc), NOT GIVEN (không có thông tin để xác nhận đúng hay sai). Trật tự câu hỏi luôn tuân theo tiến trình xuất hiện trong bài đọc.',
    recommendedStrategy: [
      'Gạch chân từ khóa cố định (tên riêng, số liệu, thuật ngữ) để định vị đoạn văn.',
      'Gạch chân từ khóa mang tính quyết định (động từ chính, từ chỉ mức độ, tần suất: all, only, largely).',
      'Đọc câu chứa thông tin và câu liền kề để nắm trọn ngữ cảnh trước khi đưa ra phán đoán.',
      'Nếu mất quá 90 giây mà không thấy bằng chứng mâu thuẫn hoặc khẳng định, hãy cân nhắc chọn NOT GIVEN.'
    ],
    rememberIn30Sec: [
      'TRUE: Đoạn văn khẳng định cùng một sự thật (chính xác về mặt ý nghĩa, thường diễn đạt bằng từ đồng nghĩa).',
      'FALSE: Đoạn văn nói ngược lại hoặc mâu thuẫn trực tiếp với nhận định.',
      'NOT GIVEN: Đoạn văn không có đủ dữ liệu để kết luận đúng hay sai (dù câu đó ngoài đời có thật hay không).'
    ],
    steps: [
      '1. Đọc nhận định trong câu hỏi trước, gạch chân từ khóa cố định để định vị vùng thông tin trong bài đọc.',
      '2. Chú ý các từ hạn định mức độ tuyệt đối (always, only, all, impossible) hoặc xác suất (likely, tend to).',
      '3. Tìm vị trí câu chứa thông tin tương đương trong bài đọc qua hiện tượng paraphrase.',
      '4. So sánh kỹ logic của 2 câu. Tuyệt đối không tự suy diễn dựa vào hiểu biết ngoài bài đọc.'
    ],
    keywordsParaphrase: [
      { question: 'started in the late 1990s', passage: 'was launched in the late 1990s', note: 'started ≈ was launched' },
      { question: 'declined considerably', passage: 'plummeted by over 80%', note: 'declined considerably ≈ plummeted' },
      { question: 'annual expenditure', passage: 'cost per year', note: 'annual expenditure ≈ cost per year' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy số lượng & tần suất tuyệt đối (All / Many / Some)',
        example: 'Đề bài: "All students preferred online classes." | Bài đọc: "Many students preferred online classes."',
        fix: 'Trả lời: FALSE (bởi vì "many" không tương đương với "all"). Nếu bài chỉ nói chung chung không rõ tỉ lệ -> NOT GIVEN.'
      },
      {
        trap: 'Bẫy tự suy đoán có lý (Over-inference)',
        example: 'Đề bài: "Solar power will replace coal by 2040." | Bài đọc: "Solar power is expanding faster than coal."',
        fix: 'Trả lời: NOT GIVEN. Bài chỉ nói phát triển nhanh hơn, không hề khẳng định sẽ thay thế hoàn toàn vào năm 2040.'
      }
    ],
    examples: [
      {
        question: 'The renewable energy initiative was introduced at the end of the twentieth century.',
        passage: 'The initiative was launched in the late 1990s as governmental subsidies kickstarted technological research.',
        answer: 'TRUE',
        reason: '"introduced" = "launched", "at the end of the twentieth century" = "in the late 1990s".'
      },
      {
        question: 'Solar energy is currently more costly to produce than coal-fired electricity.',
        passage: 'The levelized cost of solar energy has plummeted, rendering it the most economical electricity source.',
        answer: 'FALSE',
        reason: 'Bài đọc nêu năng lượng mặt trời là "most economical" (tiết kiệm nhất), trái ngược hoàn toàn với "more costly" (đắt hơn).'
      }
    ],
    miniPractice: {
      id: 'mini-tfng-1',
      passage: 'Commercial drone deliveries have gained traction across several logistics hubs in North America. While early prototypes suffered from limited battery endurance, modern aerial delivery units can operate reliably for up to 45 minutes in adverse weather. However, aviation authorities have restricted night operations in residential districts due to noise complaints from local inhabitants.',
      questions: [
        {
          id: 'mini-tfng-q1',
          prompt: 'Early delivery drones had issues with how long their batteries lasted.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'TRUE',
          explanation: '"early prototypes suffered from limited battery endurance" khẳng định các mẫu đầu bị hạn chế thời lượng pin.'
        },
        {
          id: 'mini-tfng-q2',
          prompt: 'Drones are strictly forbidden from flying during rainy conditions.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'FALSE',
          explanation: 'Bài viết nói: "operate reliably for up to 45 minutes in adverse weather" (thời tiết khắc nghiệt vẫn bay được), trái ngược với "strictly forbidden".'
        },
        {
          id: 'mini-tfng-q3',
          prompt: 'Residents in suburban areas filed more complaints than people living in urban centers.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'NOT GIVEN',
          explanation: 'Bài chỉ nói có "noise complaints from local inhabitants", không có phép so sánh giữa người ngoại ô và nội đô.'
        }
      ]
    },
    reviewTips: [
      'Nếu thấy câu hỏi chứa từ mang tính tuyệt đối (always, only, impossible, all), hãy kiểm tra thật kỹ vì 80% câu trả lời là FALSE hoặc NOT GIVEN.',
      'Nếu bạn phải mất hơn 90 giây tìm kiếm mà không thấy manh mối, khả năng cao là NOT GIVEN.'
    ]
  },

  // 2. Yes / No / Not Given
  {
    type: 'yes-no-notgiven',
    group: 'statements',
    title: 'Yes / No / Not Given',
    subtitle: 'Xác định quan điểm, nhận định hoặc thái độ của tác giả (Claims & Opinions)',
    officialFormat: 'Đề thi yêu cầu bạn phân tích góc nhìn (claims/opinions) của tác giả: YES (trùng khớp với quan điểm của tác giả), NO (trái ngược với quan điểm của tác giả), NOT GIVEN (tác giả không thể hiện quan điểm rõ ràng về điều này). Thường xuất hiện trong các bài đọc giàu tính tranh luận học thuật (Passage 2 hoặc 3).',
    recommendedStrategy: [
      'Xác định rõ sự khác biệt: True/False kiểm tra sự thật lịch sử/khoa học, còn Yes/No kiểm tra góc nhìn chủ quan của người viết.',
      'Tìm các động từ chỉ thái độ: argue, believe, suggest, doubt, suspect, recommend.',
      'Phân biệt giữa quan điểm của tác giả và quan điểm của những người khác được tác giả trích dẫn.'
    ],
    rememberIn30Sec: [
      'YES: Trùng khớp với quan điểm hoặc thái độ của tác giả.',
      'NO: Trái ngược trực tiếp với quan điểm của tác giả.',
      'NOT GIVEN: Tác giả không nêu rõ quan điểm về vấn đề đó.'
    ],
    steps: [
      '1. Khác với True/False kiểm tra sự thật, dạng này kiểm tra góc nhìn (Writer’s view). Tìm các động từ chỉ quan điểm: believe, argue, suggest, suspect.',
      '2. Chú ý tính từ mang sắc thái khen/chê (beneficial, catastrophic, exaggerated).',
      '3. So sánh ý tác giả với câu đề bài: Tác giả có đồng tình không?'
    ],
    keywordsParaphrase: [
      { question: 'The author suspects that...', passage: 'It is doubtful whether...', note: 'suspect/doubtful' },
      { question: 'Governments should prioritize...', passage: 'National leaders ought to direct their attention to...', note: 'should = ought to' }
    ],
    commonTraps: [
      {
        trap: 'Nhầm lẫn giữa quan điểm tác giả và quan điểm người khác trích dẫn',
        example: 'Tác giả viết: "Some critics claim that AI eliminates jobs, but evidence indicates otherwise."',
        fix: 'Quan điểm của tác giả là "evidence indicates otherwise" (bác bỏ), chứ không phải AI làm mất việc!'
      }
    ],
    examples: [
      {
        question: 'Public authorities ought to regulate algorithm bias more strictly.',
        passage: 'In my view, state intervention is indispensable to curtail algorithmic discrimination.',
        answer: 'YES',
        reason: '"state intervention is indispensable" (sự can thiệp của nhà nước là không thể thiếu) đồng nghĩa với "public authorities ought to regulate".'
      }
    ],
    miniPractice: {
      id: 'mini-ynng-1',
      passage: 'Psychologists frequently emphasize that excessive smartphone engagement compromises adolescent emotional resilience. While device manufacturers argue that social networking apps foster inclusive communities, I remain skeptical. In my judgment, uninterrupted screen exposure systematically deprives teenagers of authentic face-to-face conflict resolution skills.',
      questions: [
        {
          id: 'mini-ynng-q1',
          prompt: 'The writer is unconvinced by claims that social media applications build supportive groups.',
          options: ['YES', 'NO', 'NOT GIVEN'],
          correctAnswer: 'YES',
          explanation: 'Tác giả viết: "While manufacturers argue... I remain skeptical" -> hoài nghi, chưa bị thuyết phục = unconvinced.'
        },
        {
          id: 'mini-ynng-q2',
          prompt: 'Adolescents spend more time on messaging applications than on online video platforms.',
          options: ['YES', 'NO', 'NOT GIVEN'],
          correctAnswer: 'NOT GIVEN',
          explanation: 'Tác giả không so sánh lượng thời gian giữa ứng dụng nhắn tin và nền tảng video.'
        }
      ]
    },
    reviewTips: [
      'Ghi chép từ chỉ sắc thái: skeptical, doubtful, unwarranted, indispensable.'
    ]
  },

  // 3. Matching Headings
  {
    type: 'matching-headings',
    group: 'matching',
    title: 'Matching Headings',
    subtitle: 'Nối tiêu đề tóm tắt ý chính của từng đoạn văn trong bài đọc',
    officialFormat: 'Đề thi cung cấp danh sách tiêu đề (đánh số La Mã: i, ii, iii...) và yêu cầu chọn tiêu đề phản ánh đúng ý chính của từng đoạn văn được chỉ định (Paragraph A, B, C...). Danh sách tiêu đề LUÔN nhiều hơn số lượng đoạn văn cần nối (thường có 2–3 tiêu đề thừa gây nhiễu).',
    recommendedStrategy: [
      'Một chiến lược hữu ích thường được khuyến nghị là làm Headings sớm vì giúp bạn nắm được cấu trúc toàn bài và vị trí các chủ đề. Tuy nhiên, đây không phải quy định bắt buộc của IELTS; hãy tự kiểm chứng xem cách tiếp cận này có phù hợp với bạn không.',
      'Đọc lướt câu chủ đề (thường là câu 1-2 hoặc câu cuối đoạn) kết hợp với các từ nối tương phản (However, But, In fact) để xác định trọng tâm đoạn.',
      'Loại bỏ các tiêu đề chỉ nêu một ví dụ minh họa hoặc số liệu chi tiết.'
    ],
    rememberIn30Sec: [
      'Mỗi tiêu đề tóm tắt Ý CHÍNH (Main Idea) của toàn đoạn, KHÔNG PHẢI một chi tiết nhỏ (Detail).',
      'Số lượng tiêu đề luôn nhiều hơn số lượng đoạn văn (thường có 2–3 tiêu đề bẫy).'
    ],
    steps: [
      '1. Đọc lướt danh sách tiêu đề để nắm các chủ đề tổng quan.',
      '2. Đọc đoạn văn theo thứ tự: chú ý câu mở đoạn và các câu chuyển ý.',
      '3. Tự tóm tắt đoạn văn trong 1 câu ngắn trong đầu trước khi nhìn lại danh sách tiêu đề.',
      '4. So sánh với danh sách Heading: Gạch bỏ các tiêu đề quá hẹp chỉ chứa chi tiết nhỏ.'
    ],
    keywordsParaphrase: [
      { question: 'Financial incentives for clean energy', passage: 'Subsidies and tax rebates were offered to manufacturers', note: 'Financial incentives ≈ subsidies & tax rebates' },
      { question: 'Unforeseen environmental consequences', passage: 'Unexpected ecological damage occurred', note: 'Unforeseen consequences ≈ unexpected damage' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy trùng từ khóa (Matching keyword instead of meaning)',
        example: 'Đoạn văn có từ "money", trong Heading có "Financial crisis". Người học vội chọn dù đoạn văn chỉ đang kể một câu chuyện cá nhân.',
        fix: 'Hãy tự hỏi: "Nếu phải đặt tên cho cả đoạn này trong 1 câu, đây có phải ý bao quát không?"'
      }
    ],
    examples: [
      {
        question: 'Heading: "Technological solutions to urban gridlock"',
        passage: 'Metropolitan authorities deployed synchronized traffic sensors and automated bus lanes to ease rush-hour congestion.',
        answer: 'MATCH',
        reason: '"synchronized traffic sensors" = technological solutions, "ease rush-hour congestion" = solve urban gridlock.'
      }
    ],
    miniPractice: {
      id: 'mini-mh-1',
      passage: 'Paragraph A: Rapid urbanization has exerted immense pressure on municipal waste management systems. Traditional landfill sites on city outskirts are rapidly reaching maximum capacity, emitting methane gas and leaching hazardous contaminants into local aquifers. Without alternative disposal methodologies, municipalities face acute sanitary crises.',
      questions: [
        {
          id: 'mini-mh-q1',
          prompt: 'Chọn tiêu đề phù hợp nhất cho Paragraph A:',
          options: [
            'i. The economic benefits of modern recycling',
            'ii. The escalating threat of landfill saturation',
            'iii. How municipal governments fund waste incineration'
          ],
          correctAnswer: 'ii. The escalating threat of landfill saturation',
          explanation: 'Toàn đoạn mô tả bãi rác đạt sức chứa tối đa (reaching maximum capacity) và rủi ro môi trường do nó gây ra.'
        }
      ]
    },
    reviewTips: [
      'Gạch bỏ tiêu đề đã dùng để giảm bớt phương án khi làm các đoạn tiếp theo.'
    ]
  },

  // 4. Matching Information
  {
    type: 'matching-information',
    group: 'matching',
    title: 'Matching Information',
    subtitle: 'Tìm đoạn văn nào chứa thông tin cụ thể (a mention of / a reference to / an example of)',
    officialFormat: 'Đề thi đưa ra các câu mô tả chi tiết và yêu cầu xác định đoạn văn nào (A, B, C...) chứa thông tin đó. Thông tin có thể xuất hiện ở bất kỳ câu nào trong đoạn. Nếu có ghi chú "NB You may use any letter more than once", điều đó có nghĩa là một đoạn văn CÓ THỂ được dùng nhiều hơn một lần (tối đa 2 lần). Điều này KHÔNG có nghĩa là chắc chắn sẽ có một đoạn chứa hai đáp án, mà chỉ là một khả năng được phép xảy ra.',
    recommendedStrategy: [
      'Khác với Matching Headings đi tìm ý chính bao quát, dạng này đi tìm CHI TIẾT CỤ THỂ (specific detail).',
      'Nhiều chuyên gia khuyến nghị làm dạng này SAU KHI đã làm các dạng câu hỏi khác để tận dụng trí nhớ về vị trí các đoạn.',
      'Phân tích từ chỉ loại thông tin đầu câu: an explanation (giải thích tại sao), an example (ví dụ minh họa), a reference (nhắc tới), a comparison (so sánh).'
    ],
    rememberIn30Sec: [
      'Dạng này tìm CHI TIẾT CỤ THỂ (specific detail), không cần là ý chính của đoạn.',
      '"NB You may use any letter more than once" có nghĩa là một đoạn văn CÓ THỂ được dùng 2 lần, KHÔNG PHẢI chắc chắn.'
    ],
    steps: [
      '1. Đọc kỹ yêu cầu tìm kiếm: a reference to, an example of, a comparison between, the reasons for.',
      '2. Xác định dạng thông tin: số liệu, nguyên nhân, tên địa danh, hay mốc thời gian.',
      '3. Tìm kiếm chi tiết được paraphrase trong các đoạn văn.'
    ],
    keywordsParaphrase: [
      { question: 'a reference to the origin of...', passage: 'The craft can be traced back to ancient Mesopotamia...', note: 'origin ≈ traced back to' }
    ],
    commonTraps: [
      {
        trap: 'Tìm sai loại thông tin (nhầm giữa explanation và example)',
        example: 'Đề bài yêu cầu "an explanation of why...", nhưng học viên chọn đoạn chỉ đưa ra "an example of...".',
        fix: 'Xác định từ loại đầu câu hỏi: description, explanation, reference, suggestion.'
      }
    ],
    examples: [
      {
        question: 'a mention of two factors contributing to desertification',
        passage: 'Paragraph C: Prolonged drought combined with excessive livestock grazing has accelerated soil erosion across the Sahel.',
        answer: 'Paragraph C',
        reason: 'Hai yếu tố: hạn hán kéo dài (prolonged drought) và chăn thả gia súc quá mức (excessive grazing).'
      }
    ],
    miniPractice: {
      id: 'mini-mi-1',
      passage: 'Paragraph B: Archaeologists uncovered remnants of volcanic ash layers beneath the terrace walls. Radiocarbon dating indicated that the farming community had been abruptly abandoned around 1450 BCE following a catastrophic caldera eruption on a neighbouring archipelago.',
      questions: [
        {
          id: 'mini-mi-q1',
          prompt: 'Đoạn B chứa thông tin nào sau đây?',
          options: [
            'A. A comparison of two farming implements',
            'B. The estimated timeframe when a settlement ceased to exist',
            'C. Financial estimates of volcanic reconstruction'
          ],
          correctAnswer: 'B. The estimated timeframe when a settlement ceased to exist',
          explanation: '"abandoned around 1450 BCE" chính là khoảng thời gian khu định cư ngừng tồn tại (ceased to exist).'
        }
      ]
    },
    reviewTips: [
      'Lưu ý: "NB You may use any letter more than once" nghĩa là một đoạn văn CÓ THỂ được dùng 2 lần, không bao giờ khẳng định chắc chắn 100% sẽ có đoạn lặp lại.'
    ]
  },

  // 5. Matching Features
  {
    type: 'matching-features',
    group: 'matching',
    title: 'Matching Features',
    subtitle: 'Nối các nhận định, phát kiến hoặc quan điểm với danh sách chuyên gia, nhân vật hoặc thời kỳ',
    officialFormat: 'Đề thi cung cấp danh sách tên các nhà nghiên cứu, tổ chức, hoặc thời kỳ lịch sử (A, B, C...) và yêu cầu nối với các nhận định/thành tựu tương ứng. Danh sách tên có thể ít hơn hoặc nhiều hơn số nhận định.',
    recommendedStrategy: [
      'Quét toàn bộ bài đọc và dùng bút gạch chân tất cả các vị trí xuất hiện của từng tên riêng trong danh sách trước khi đọc câu hỏi.',
      'Khi làm từng nhận định, hãy di chuyển trực tiếp đến các vị trí đã đánh dấu tên đó để đọc xung quanh.',
      'Một nhân vật có thể được nối với nhiều nhận định nếu đề bài cho phép.'
    ],
    rememberIn30Sec: [
      'Tên riêng là từ khóa cố định, không thể paraphrase (dễ quét nhất bài đọc).',
      'Đọc kỹ lời trích dẫn trực tiếp ("...") hoặc gián tiếp (stated that, claimed that) của nhân vật.'
    ],
    steps: [
      '1. Định vị và đánh dấu tất cả tên riêng của danh sách người/đối tượng trong bài đọc.',
      '2. Đọc từng câu hỏi, nắm ý nghĩa cốt lõi của phát biểu.',
      '3. Đối chiếu phát biểu với những gì nhân vật thực tế phát biểu trong bài.'
    ],
    keywordsParaphrase: [
      { question: 'argued that early human migration was motivated by climate shifts', passage: 'Professor Evans concluded that shifting precipitation patterns drove ancestral relocations', note: 'climate shifts ≈ shifting precipitation patterns, drove ancestral relocations ≈ motivated migration' }
    ],
    commonTraps: [
      {
        trap: 'Nhầm lẫn giữa giả thuyết của nhà khoa học và kết luận cuối cùng của họ',
        example: 'Bài viết nêu Dr. Chen từng nghi ngờ điều A, nhưng về sau chứng minh điều B.',
        fix: 'Đọc kỹ câu kết của nhân vật để nắm quan điểm sau cùng.'
      }
    ],
    examples: [
      {
        question: 'Suggested that marine noise interferes with communication',
        passage: 'Dr. Karen Silva observed that vessel propellers produce acoustic frequencies that mask dolphin echolocation signals.',
        answer: 'Dr. Karen Silva',
        reason: '"interferes with communication" = "mask dolphin echolocation signals".'
      }
    ],
    miniPractice: {
      id: 'mini-mf-1',
      passage: 'Anthropologist Dr. Liam Vance argued that prehistoric trade routes were dictated primarily by access to freshwater springs. Conversely, Dr. Rachel Stern established that tool-grade obsidian deposits served as the primary magnet for long-distance commercial exchange among nomadic tribes.',
      questions: [
        {
          id: 'mini-mf-q1',
          prompt: 'Who claimed that raw materials for toolmaking drove long-distance prehistoric trade?',
          options: ['Dr. Liam Vance', 'Dr. Rachel Stern', 'Both researchers'],
          correctAnswer: 'Dr. Rachel Stern',
          explanation: '"tool-grade obsidian deposits served as the primary magnet for exchange" là kết luận của Dr. Rachel Stern.'
        }
      ]
    },
    reviewTips: [
      'Gạch chân tên riêng ngay từ lần đọc lướt đầu tiên giúp tiết kiệm 3-5 phút tìm kiếm.'
    ]
  },

  // 6. Matching Sentence Endings
  {
    type: 'matching-sentence-endings',
    group: 'matching',
    title: 'Matching Sentence Endings',
    subtitle: 'Nối nửa đầu của câu với nửa sau phù hợp về cả mặt ngữ pháp và nội dung',
    officialFormat: 'Đề thi đưa ra danh sách nửa đầu câu (được đánh số 1, 2, 3...) và danh sách các vế kết thúc (A, B, C, D...). Số lượng vế kết thúc luôn nhiều hơn số lượng câu hỏi. Trật tự các câu hỏi nửa đầu LUÔN đi theo thứ tự xuất hiện trong bài đọc.',
    recommendedStrategy: [
      'Tận dụng quy tắc trật tự: Thông tin câu 2 luôn nằm sau câu 1 trong bài đọc.',
      'Kiểm tra tính tương thích ngữ pháp trước: vế trước kết thúc bằng động từ số ít thì vế sau không thể bắt đầu bằng động từ số nhiều.',
      'Sau khi ghép, dịch toàn bộ câu hoàn chỉnh xem logic có trọn vẹn không.'
    ],
    rememberIn30Sec: [
      'Các câu hỏi xuất hiện theo đúng trật tự bài đọc.',
      'Câu hoàn chỉnh PHẢI đúng cả ngữ pháp lẫn nội dung sự thật trong bài.'
    ],
    steps: [
      '1. Đọc vế đầu câu hỏi, gạch từ khóa để định vị vị trí câu trong bài đọc.',
      '2. Đọc kỹ phần nội dung trong bài để hiểu ý nghĩa trọn vẹn.',
      '3. Tìm vế kết thúc trong danh sách A-G mang ý nghĩa tương đương được paraphrase.',
      '4. Đảm bảo cấu trúc ngữ pháp giữa 2 vế ăn khớp hoàn hảo.'
    ],
    keywordsParaphrase: [
      { question: 'failed to reach commercial production', passage: 'never advanced beyond the experimental laboratory stage', note: 'failed commercial production ≈ never advanced beyond laboratory' }
    ],
    commonTraps: [
      {
        trap: 'Chọn vế sau đúng ngữ pháp nhưng sai ý bài đọc',
        example: 'Vế A ngữ pháp ghép rất mượt với vế đầu, nhưng bài đọc lại nói ngược lại hoàn toàn.',
        fix: 'Luôn đối chiếu lại với câu gốc trong bài đọc trước khi chốt.'
      }
    ],
    examples: [
      {
        question: 'Early composite airplane wings (1) ...',
        passage: 'Initial attempts to fabricate aircraft wings from carbon composites were abandoned because the resin fractured under low temperatures.',
        answer: 'suffered structural cracks in sub-zero environments',
        reason: '"fractured under low temperatures" = "suffered structural cracks in sub-zero environments".'
      }
    ],
    miniPractice: {
      id: 'mini-mse-1',
      passage: 'Traditional brick kilns in the river valley emitted dense particulate matter that triggered chronic respiratory ailments in surrounding villages. Following regulatory interventions, factory operators retrofitted exhaust scrubbers, which cut hazardous emissions by seventy percent within six months.',
      questions: [
        {
          id: 'mini-mse-q1',
          prompt: 'The installation of modern exhaust scrubbers on brick kilns...',
          options: [
            'A. caused unexpected respiratory problems for local villagers',
            'B. resulted in a substantial decline in hazardous airborne pollutants',
            'C. forced factory operators to close down their manufacturing sites'
          ],
          correctAnswer: 'B. resulted in a substantial decline in hazardous airborne pollutants',
          explanation: '"cut hazardous emissions by seventy percent" tương đương với "resulted in a substantial decline in hazardous pollutants".'
        }
      ]
    },
    reviewTips: [
      'Gạch bỏ các vế kết thúc sai ngữ pháp để giảm thiểu số lượng phương án cần đọc.'
    ]
  },

  // 7. Multiple Choice
  {
    type: 'multiple-choice',
    group: 'questions',
    title: 'Multiple Choice',
    subtitle: 'Chọn phương án chính xác nhất giữa 4 lựa chọn (A, B, C, D)',
    officialFormat: 'Đề thi đưa ra câu hỏi hoặc câu chưa hoàn chỉnh với 4 lựa chọn (hoặc câu hỏi chọn 2 trong 5 đáp án). Trật tự các câu hỏi Multiple Choice đi theo đúng thứ tự bài đọc.',
    recommendedStrategy: [
      'Đọc phần gốc của câu hỏi (stem) trước, CHƯA vội đọc 4 đáp án để tránh bị định kiến hoặc nhiễu thông tin.',
      'Định vị đoạn văn nói về nội dung câu hỏi trong bài đọc và tự hình thành câu trả lời trong đầu.',
      'So sánh với 4 lựa chọn và dùng phương pháp loại trừ.'
    ],
    rememberIn30Sec: [
      'Phương pháp loại trừ là vũ khí mạnh nhất trong Multiple Choice.',
      'Đáp án đúng thường được PARAPHRASE hoàn toàn, hiếm khi chép nguyên từ.'
    ],
    steps: [
      '1. Đọc gốc câu hỏi, xác định trọng tâm cần tìm.',
      '2. Định vị đoạn văn tương ứng trong bài đọc.',
      '3. Tự trả lời câu hỏi dựa trên nội dung bài đọc.',
      '4. Đối chiếu với A, B, C, D và gạch bỏ các phương án có từ khóa giống hệt nhưng sai logic.'
    ],
    keywordsParaphrase: [
      { question: 'Why did the researcher initiate the study?', passage: 'The primary motivation behind the project was...', note: 'Why initiate ≈ motivation behind' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy từ vựng bề mặt (Distractor with identical words)',
        example: 'Đáp án B có đúng 3 từ xuất hiện trong bài đọc nhưng quan hệ nguyên nhân - kết quả bị đảo lộn.',
        fix: 'Đừng chọn đáp án chỉ vì nó có nhiều từ giống bài đọc nhất.'
      }
    ],
    examples: [
      {
        question: 'What is the author’s primary concern regarding artificial sweeteners?',
        passage: 'While artificial sweeteners reduce caloric intake, preliminary trials indicate they may disrupt the gut microbiome balance.',
        answer: 'Their potential impact on internal digestive bacteria',
        reason: '"gut microbiome balance" được paraphrase thành "internal digestive bacteria".'
      }
    ],
    miniPractice: {
      id: 'mini-mc-1',
      passage: 'Botanists long assumed that alpine flora survived harsh winters primarily through physiological antifreeze compounds. However, recent thermal imaging reveals that micro-topographical depressions in rocky terrain provide critical snow insulation, shielding dormant buds from sub-zero winds.',
      questions: [
        {
          id: 'mini-mc-q1',
          prompt: 'Recent thermal investigations demonstrated that alpine plants survive winter mainly because:',
          options: [
            'A. They produce elevated quantities of chemical antifreeze',
            'B. Natural physical hollows offer protection under snow cover',
            'C. Wind velocities on rocky terrains remain moderate',
            'D. Dormant buds generate their own internal heat'
          ],
          correctAnswer: 'B. Natural physical hollows offer protection under snow cover',
          explanation: '"micro-topographical depressions" = natural physical hollows, "provide critical snow insulation" = offer protection under snow cover.'
        }
      ]
    },
    reviewTips: [
      'Luôn gạch chéo lý do loại từng đáp án sai (sai ý, không có thông tin, quá cực đoan).'
    ]
  },

  // 8. Sentence Completion
  {
    type: 'sentence-completion',
    group: 'completion',
    title: 'Sentence Completion',
    subtitle: 'Điền từ chính xác từ bài đọc vào các câu rời rạc',
    officialFormat: 'Đề thi cung cấp các câu có chỗ trống và giới hạn số từ cụ thể (ví dụ: NO MORE THAN TWO WORDS AND/OR A NUMBER). Các câu hỏi Sentence Completion luôn xuất hiện theo đúng trật tự của bài đọc.',
    recommendedStrategy: [
      'Đọc kỹ giới hạn từ cho phép trước tiên.',
      'Dự đoán từ loại cần điền (danh từ số ít/nhiều, tính từ, động từ hay năm tháng) dựa vào cấu trúc ngữ pháp câu.',
      'Luôn nhặt từ NGUYÊN BẢN trong bài đọc, tuyệt đối không thay đổi dạng từ (không thêm -s, không đổi thì).'
    ],
    rememberIn30Sec: [
      'Tuân thủ nghiêm ngặt giới hạn từ.',
      'Lấy từ NGUYÊN BẢN từ bài đọc, không tự ý biến đổi dạng từ.'
    ],
    steps: [
      '1. Đọc giới hạn từ cho phép.',
      '2. Phân tích chỗ trống: Cần từ loại gì? Số ít hay số nhiều?',
      '3. Tìm từ khóa xung quanh chỗ trống để định vị đoạn văn.',
      '4. Điền từ chính xác và đọc lại cả câu để kiểm tra ngữ pháp.'
    ],
    keywordsParaphrase: [
      { question: 'relies on sufficient _____ to operate', passage: 'requires adequate ventilation to function', note: 'sufficient ≈ adequate -> điền: ventilation' }
    ],
    commonTraps: [
      {
        trap: 'Thừa mạo từ làm vượt quá giới hạn từ',
        example: 'Đề: NO MORE THAN ONE WORD. Học viên điền "the filter" thay vì "filter".',
        fix: 'Chỉ điền từ chính, bỏ qua mạo từ nếu đề bài giới hạn 1 từ.'
      }
    ],
    examples: [
      {
        question: 'The extraction mechanism requires constant _____ to avoid overheating.',
        passage: 'Machinery operators noted that continuous lubrication is vital to prevent thermal damage to the gear assemblies.',
        answer: 'lubrication',
        reason: '"constant" = "continuous", "avoid overheating" = "prevent thermal damage". Từ cần điền: lubrication.'
      }
    ],
    miniPractice: {
      id: 'mini-sc-real-1',
      passage: 'Biometric sensors installed at transit terminals capture infrared scans of passenger retinas. The scanned optical patterns are matched against an encrypted database to verify passenger identity within fractions of a second.',
      questions: [
        {
          id: 'mini-sc-q1',
          prompt: 'Sensors at transit hubs record infrared scans of passenger _____. (NO MORE THAN ONE WORD)',
          correctAnswer: 'retinas',
          explanation: '"infrared scans of passenger retinas" -> điền: retinas.'
        }
      ]
    },
    reviewTips: [
      'Sau khi điền, hãy đọc to câu hoàn chỉnh trong đầu để xem ngữ pháp chia động từ và số ít/nhiều có chuẩn xác không.'
    ]
  },

  // 9. Summary Completion
  {
    type: 'summary-completion',
    group: 'completion',
    title: 'Summary Completion',
    subtitle: 'Điền từ vào đoạn văn tóm tắt một phần hoặc toàn bộ bài đọc',
    officialFormat: 'Đề thi cung cấp một đoạn văn tóm tắt với các chỗ trống. Có 2 dạng chính: Dạng 1 - Nhặt từ trực tiếp từ bài đọc (có giới hạn từ). Dạng 2 - Chọn từ thích hợp từ một khung danh sách từ cho sẵn (Box of words).',
    recommendedStrategy: [
      'Xác định xem đoạn tóm tắt tập trung vào một đoạn văn cụ thể hay trải dài toàn bài.',
      'Đọc lướt cả đoạn tóm tắt trước để nắm được mạch ý câu chuyện hoặc quy trình.',
      'Với dạng chọn từ trong hộp (Box of words), các từ trong hộp hầu như luôn là từ đồng nghĩa (synonyms) của từ trong bài đọc.'
    ],
    rememberIn30Sec: [
      'Đoạn tóm tắt thường cô đọng thông tin của 1-2 đoạn văn trong bài.',
      'Nếu đề cho danh sách từ trong hộp, hãy tìm từ đồng nghĩa thay vì từ nguyên bản.'
    ],
    steps: [
      '1. Đọc tiêu đề đoạn tóm tắt và câu đầu tiên để định vị đoạn văn trong bài đọc.',
      '2. Dự đoán từ loại và nghĩa tương đối cho từng chỗ trống.',
      '3. Tìm từ khóa tương ứng trong bài đọc.',
      '4. Điền từ (hoặc chọn chữ cái tương ứng trong hộp từ).'
    ],
    keywordsParaphrase: [
      { question: 'helped mitigate negative _____ on agriculture', passage: 'curtailed adverse impacts on crop yield', note: 'mitigate negative impacts ≈ curtailed adverse impacts' }
    ],
    commonTraps: [
      {
        trap: 'Điền từ nguyên bản khi đề yêu cầu chọn chữ cái từ hộp từ (Box of words)',
        example: 'Đề bài có bảng từ A: consequence, B: hazard. Học viên lại chép từ "impact" trong bài vào tờ đáp án.',
        fix: 'Với dạng hộp từ, chỉ viết chữ cái A, B, C... vào phiếu trả lời.'
      }
    ],
    examples: [
      {
        question: 'The new irrigation system prevented the loss of valuable _____ in sandy soils.',
        passage: 'Drip lines supplied moisture directly to roots, halting the rapid drainage of essential nutrients through sandy terrain.',
        answer: 'nutrients',
        reason: '"valuable" = "essential", "loss" = "rapid drainage". Từ cần điền: nutrients.'
      }
    ],
    miniPractice: {
      id: 'mini-sum-1',
      passage: 'Urban planners in Singapore integrated vertical gardens into high-rise architecture to counteract the heat island effect. Foliage on external facades absorbs solar radiation, lowering interior ambient temperatures and drastically reducing electricity demand for air conditioning.',
      questions: [
        {
          id: 'mini-sum-q1',
          prompt: 'Vegetation on high-rise facades absorbs solar energy, thereby reducing the need for _____ to cool buildings. (NO MORE THAN TWO WORDS)',
          correctAnswer: 'air conditioning',
          explanation: '"reducing electricity demand for air conditioning" -> điền: air conditioning.'
        }
      ]
    },
    reviewTips: [
      'Đoạn tóm tắt thường sử dụng nhiều từ nối logic: therefore, as a result, in contrast. Hãy dùng chúng làm mốc định vị.'
    ]
  },

  // 10. Note Completion
  {
    type: 'note-completion',
    group: 'completion',
    title: 'Note Completion',
    subtitle: 'Điền từ vào các gạch đầu dòng ghi chú bài giảng hoặc tài liệu tóm tắt',
    officialFormat: 'Đề thi cung cấp các gạch đầu dòng ghi chú có chỗ trống theo từng mục lớn. Có giới hạn số từ cụ thể. Thứ tự các câu hỏi thường đi theo trật tự xuất hiện trong bài đọc.',
    recommendedStrategy: [
      'Tận dụng các tiêu đề mục lớn (Sub-headings) để biết thông tin nằm ở đoạn nào trong bài đọc.',
      'Các gạch đầu dòng thường được viết theo phong cách ghi chép ngắn gọn, lược bỏ mạo từ và trợ động từ.',
      'Dự đoán loại thông tin theo cấu trúc liệt kê song hành (nếu các dòng trên là danh từ, chỗ trống nhiều khả năng cũng là danh từ).'
    ],
    rememberIn30Sec: [
      'Ghi chú thường theo trật tự thời gian hoặc cấu trúc phân loại.',
      'Tận dụng các tiêu đề in đậm để định vị vị trí trong bài.'
    ],
    steps: [
      '1. Đọc tiêu đề chính và tiêu đề phụ của bản ghi chú.',
      '2. Xác định từ loại và ngữ nghĩa cần điền cho từng gạch đầu dòng.',
      '3. Quét bài đọc theo từng cụm thông tin tương ứng.',
      '4. Điền từ nguyên bản và kiểm tra số lượng từ.'
    ],
    keywordsParaphrase: [
      { question: 'main drawback: high initial _____', passage: 'the foremost disadvantage involves substantial upfront investment', note: 'main drawback ≈ foremost disadvantage, initial ≈ upfront -> điền: investment' }
    ],
    commonTraps: [
      {
        trap: 'Bỏ sót cấu trúc song hành của ghi chú',
        example: 'Các dòng trên ghi: "- High speed", "- Low cost", dòng dưới học viên điền một câu hoàn chỉnh.',
        fix: 'Chỉ điền từ hoặc cụm từ ngắn gọn theo đúng phong cách ghi chú.'
      }
    ],
    examples: [
      {
        question: 'Key benefit: improved soil _____',
        passage: 'Adding organic compost fundamentally enhanced soil fertility over successive harvests.',
        answer: 'fertility',
        reason: '"improved soil fertility" -> điền: fertility.'
      }
    ],
    miniPractice: {
      id: 'mini-note-1',
      passage: 'Renewable geothermal installations offer steady baseload power without carbon emissions. However, plant construction entails high capital expenditure and occasional micro-seismic activity near drill sites.',
      questions: [
        {
          id: 'mini-note-q1',
          prompt: 'Geothermal energy disadvantage: occasional _____ near drilling locations. (NO MORE THAN TWO WORDS)',
          correctAnswer: 'micro-seismic activity',
          explanation: '"occasional micro-seismic activity near drill sites" -> điền: micro-seismic activity.'
        }
      ]
    },
    reviewTips: [
      'Chú ý từ đồng nghĩa của các tiêu đề: Advantages = Benefits / Strengths, Disadvantages = Limitations / Drawbacks.'
    ]
  },

  // 11. Table Completion
  {
    type: 'table-completion',
    group: 'completion',
    title: 'Table Completion',
    subtitle: 'Điền từ vào các ô còn trống trong bảng đối chiếu phân loại',
    officialFormat: 'Đề thi cung cấp bảng biểu gồm các hàng và cột (ví dụ: Tên phương pháp, Ưu điểm, Nhược điểm, Chi phí) với một số ô trống. Trật tự câu hỏi có thể đi theo hàng ngang hoặc cột dọc, theo số thứ tự của câu hỏi.',
    recommendedStrategy: [
      'Luôn bám sát số thứ tự câu hỏi để xác định bảng đang đi theo chiều ngang hay chiều dọc.',
      'Đọc tiêu đề cột và các thông tin đã điền sẵn ở cùng hàng để làm mốc định vị chính xác trong bài đọc.',
      'Các ô cùng một cột luôn chứa cùng một loại thông tin (ví dụ: cột Date luôn chứa ngày tháng, cột Cost luôn chứa số tiền).'
    ],
    rememberIn30Sec: [
      'Đọc thông tin các ô đã điền sẵn để làm neo định vị trong bài đọc.',
      'Điền đúng giới hạn từ quy định.'
    ],
    steps: [
      '1. Quan sát hàng tiêu đề cột và cột đầu tiên để hiểu logic cấu trúc bảng.',
      '2. Dùng từ ngữ trong các ô có sẵn cùng hàng để định vị đoạn văn tương ứng.',
      '3. Tìm từ phù hợp điền vào ô trống.',
      '4. Kiểm tra sự tương đồng về dạng thông tin với các hàng khác.'
    ],
    keywordsParaphrase: [
      { question: 'Column: Preservation method | Row: Salt curing', passage: 'submerging meat cuts in brine solutions prevented bacterial growth', note: 'Salt curing ≈ brine solutions' }
    ],
    commonTraps: [
      {
        trap: 'Đọc nhảy cóc nhầm hàng ngang',
        example: 'Nhặt số liệu của Phương pháp A điền vào ô trống của Phương pháp B vì 2 phương pháp nằm sát nhau trong bài đọc.',
        fix: 'Dò kỹ tên đối tượng ở cột đầu tiên trước khi lấy số liệu.'
      }
    ],
    examples: [
      {
        question: 'Solar heating | Primary material: _____ | Efficiency: 45%',
        passage: 'Flat-plate collectors utilize copper piping layered beneath tempered glass to optimize heat absorption.',
        answer: 'copper piping',
        reason: 'Chất liệu chế tạo là copper piping.'
      }
    ],
    miniPractice: {
      id: 'mini-tab-1',
      passage: 'Wind turbines deployed offshore utilize composite fiberglass blades designed to resist saltwater corrosion. Onshore models, by contrast, commonly employ aluminum alloys to minimize manufacturing expenses.',
      questions: [
        {
          id: 'mini-tab-q1',
          prompt: 'Offshore turbines: blade material = _____ (NO MORE THAN TWO WORDS)',
          correctAnswer: 'composite fiberglass',
          explanation: '"offshore utilize composite fiberglass blades" -> điền: composite fiberglass.'
        }
      ]
    },
    reviewTips: [
      'Dùng ngón tay hoặc bút chỉ theo hàng ngang để không bị hoa mắt sang hàng khác.'
    ]
  },

  // 12. Flow-chart Completion
  {
    type: 'flowchart-completion',
    group: 'completion',
    title: 'Flow-chart Completion',
    subtitle: 'Điền từ vào sơ đồ quy trình thể hiện các bước tuần tự',
    officialFormat: 'Đề thi cung cấp sơ đồ các bước nối nhau bằng mũi tên (Arrow) thể hiện một quy trình tự nhiên hoặc kỹ thuật. Các bước luôn tuân theo trình tự thời gian hoặc trình tự vận hành trong bài đọc.',
    recommendedStrategy: [
      'Xác định điểm bắt đầu của quy trình và chiều của các mũi tên.',
      'Tìm các từ nối chỉ trình tự trong bài đọc: initially, subsequently, followed by, once, eventually.',
      'Từ cần điền thường là danh từ chỉ nguyên liệu, bộ phận hoặc động từ chỉ thao tác.'
    ],
    rememberIn30Sec: [
      'Quy trình luôn đi theo một chiều tuần tự (Sequence).',
      'Chú ý từ chỉ thứ tự: first, then, after, finally.'
    ],
    steps: [
      '1. Xác định bước đầu tiên và bước cuối cùng của quy trình.',
      '2. Định vị đoạn văn mô tả quy trình đó trong bài đọc.',
      '3. Bám theo các bước trung gian qua từ nối chỉ thứ tự.',
      '4. Điền từ chính xác vào ô trống của từng bước.'
    ],
    keywordsParaphrase: [
      { question: 'Step 2: filtered through fine _____', passage: 'The slurry is then passed across fine mesh screens to separate impurities', note: 'fine mesh screens ≈ fine mesh' }
    ],
    commonTraps: [
      {
        trap: 'Đảo lộn thứ tự hai bước liền kề',
        example: 'Bài đọc viết: "Prior to heating, the mixture is centrifuged." Học viên lại điền bước đun nóng trước.',
        fix: 'Chú ý các từ "Prior to", "Before" biểu thị hành động xảy ra trước.'
      }
    ],
    examples: [
      {
        question: 'Raw beans harvested → Fermentation in shallow trays → Sun-drying on raised _____',
        passage: 'Once fermentation concludes, laborers spread the beans onto elevated wooden platforms to dry beneath direct sunlight.',
        answer: 'wooden platforms',
        reason: '"sun-drying on raised wooden platforms" tương đương với "spread onto elevated wooden platforms beneath sunlight".'
      }
    ],
    miniPractice: {
      id: 'mini-flow-1',
      passage: 'Paper recycling begins with collecting waste sheets, which are subsequently soaked in warm water to create pulp. Centrifugal cleaners then spin the slurry to extract residual adhesives before bleach is added.',
      questions: [
        {
          id: 'mini-flow-q1',
          prompt: 'Pulp creation → Spinning in centrifugal cleaners to eliminate _____ → Bleaching. (NO MORE THAN TWO WORDS)',
          correctAnswer: 'residual adhesives',
          explanation: '"extract residual adhesives" = eliminate residual adhesives.'
        }
      ]
    },
    reviewTips: [
      'Vẽ nhanh mũi tên chỉ hướng nếu đề bài có cấu trúc rẽ nhánh.'
    ]
  },

  // 13. Diagram Label Completion
  {
    type: 'diagram-label-completion',
    group: 'completion',
    title: 'Diagram Label Completion',
    subtitle: 'Gắn nhãn các bộ phận trên hình vẽ kỹ thuật hoặc cơ chế sinh học',
    officialFormat: 'Đề thi cung cấp một hình vẽ mô tả cấu tạo của một thiết bị, máy móc hoặc sinh vật kèm theo các đường chỉ dẫn (leader lines) đến ô trống cần điền nhãn từ. Có giới hạn từ nghiêm ngặt.',
    recommendedStrategy: [
      'Quan sát kỹ hình vẽ trước: xác định đỉnh, đáy, mặt trước, mặt trong và các bộ phận đã có nhãn sẵn.',
      'Tìm đoạn văn mô tả cấu trúc vật lý trong bài đọc (thường dùng các giới từ vị trí: located at the base, upper chamber, outer casing).',
      'Từ điền vào gần như luôn là danh từ chỉ bộ phận cơ thể hoặc linh kiện máy móc.'
    ],
    rememberIn30Sec: [
      'Quan sát đường chỉ dẫn (leader line) trỏ vào bộ phận nào trên hình vẽ.',
      'Từ điền vào hầu như 100% là Danh Từ (Noun).'
    ],
    steps: [
      '1. Quan sát tổng thể hình vẽ và các nhãn đã có sẵn để làm mốc.',
      '2. Xác định vị trí không gian của chỗ trống (trên/dưới/trong/ngoài).',
      '3. Tìm đoạn văn mô tả cấu tạo của thiết bị trong bài đọc.',
      '4. Nhặt đúng tên bộ phận và điền vào chỗ trống.'
    ],
    keywordsParaphrase: [
      { question: 'outer protective _____', passage: 'The mechanism is sealed inside a durable external casing', note: 'outer protective casing ≈ durable external casing' }
    ],
    commonTraps: [
      {
        trap: 'Nhìn nhầm mũi tên chỉ dòng chuyển động thành chỉ bộ phận',
        example: 'Mũi tên chỉ hướng gió thổi vào, học viên lại điền tên của tấm cánh quạt.',
        fix: 'Phân biệt giữa mũi tên chỉ dòng chảy (Flow) và đường chỉ dẫn bộ phận (Leader line).'
      }
    ],
    examples: [
      {
        question: 'Upper chamber: air intake valve | Lower section: sediment _____',
        passage: 'At the bottom of the column, a specialized sediment trap captures heavy particulate debris.',
        answer: 'trap',
        reason: '"sediment trap" ở đáy cột.'
      }
    ],
    miniPractice: {
      id: 'mini-diag-1',
      passage: 'A traditional watermill comprises a heavy timber shaft connected to a submerged waterwheel. Positioned directly above the grindstone, a conical hopper dispenses grain kernels at an adjustable rate.',
      questions: [
        {
          id: 'mini-diag-q1',
          prompt: 'Component located above the grindstone to dispense grain: conical _____ (NO MORE THAN ONE WORD)',
          correctAnswer: 'hopper',
          explanation: '"a conical hopper dispenses grain" -> điền: hopper.'
        }
      ]
    },
    reviewTips: [
      'Ghi nhớ các từ chỉ vị trí: mounted on, adjacent to, underneath, enclosed within.'
    ]
  },

  // 14. Short Answer Questions
  {
    type: 'short-answer',
    group: 'questions',
    title: 'Short Answer Questions',
    subtitle: 'Trả lời câu hỏi trực tiếp bằng các sự thật cụ thể nhặt từ bài đọc',
    officialFormat: 'Đề thi đưa ra các câu hỏi mở (bắt đầu bằng What, Which, Where, Who, How much...) và yêu cầu trả lời trong giới hạn số từ cụ thể (ví dụ: NO MORE THAN THREE WORDS AND/OR A NUMBER). Trật tự câu hỏi luôn tuân theo tiến trình xuất hiện trong bài đọc.',
    recommendedStrategy: [
      'Xác định từ để hỏi (Wh-word) để biết loại câu trả lời cần tìm: What (vật/hành động), Where (nơi chốn), When (thời gian), Who (người), How much (chi phí/số lượng).',
      'Gạch chân từ khóa trong câu hỏi để định vị câu trả lời trong bài đọc.',
      'Chỉ viết câu trả lời ngắn gọn, tuyệt đối không viết thành câu văn hoàn chỉnh.'
    ],
    rememberIn30Sec: [
      'Câu hỏi tuân theo thứ tự tiến trình bài đọc.',
      'Chỉ nhặt thông tin cốt lõi, không viết cả câu dài.'
    ],
    steps: [
      '1. Đọc từ để hỏi để xác định loại thông tin mục tiêu.',
      '2. Gạch chân từ khóa định vị trong câu hỏi.',
      '3. Quét bài đọc tìm câu chứa thông tin.',
      '4. Nhặt đúng từ/cụm từ đáp ứng câu hỏi và kiểm tra số từ.'
    ],
    keywordsParaphrase: [
      { question: 'What natural resource was depleted...?', passage: 'Excessive mining exhausted local timber reserves...', note: 'natural resource depleted ≈ timber reserves exhausted -> đáp án: timber' }
    ],
    commonTraps: [
      {
        trap: 'Viết cả câu dài chủ ngữ vị ngữ',
        example: 'Câu hỏi: What caused the delay? Học viên viết: "The storm was what caused it" (bị trừ điểm vì quá số từ).',
        fix: 'Chỉ viết phần thông tin trả lời: "the storm" hoặc "severe storm".'
      }
    ],
    examples: [
      {
        question: 'Which raw material was primarily exported from the colony?',
        passage: 'While the settlement cultivated sugar cane for domestic consumption, unrefined copper ore constituted its sole lucrative export commodity.',
        answer: 'copper ore',
        reason: 'Mặt hàng xuất khẩu duy nhất là unrefined copper ore.'
      }
    ],
    miniPractice: {
      id: 'mini-sa-1',
      passage: 'Glaciologists analyzing ancient ice cores from Antarctica retrieved samples dated to 800,000 years ago. Tiny trapped atmospheric bubbles provide an authentic archive of prehistoric carbon dioxide concentrations.',
      questions: [
        {
          id: 'mini-sa-q1',
          prompt: 'What preserved inside ice cores allows researchers to study prehistoric atmospheres? (NO MORE THAN TWO WORDS)',
          correctAnswer: 'atmospheric bubbles',
          acceptableAnswers: ['bubbles', 'trapped bubbles'],
          explanation: '"atmospheric bubbles" cung cấp tư liệu về nồng độ khí CO2 thời tiền sử.'
        }
      ]
    },
    reviewTips: [
      'Đếm kỹ từng từ trước khi chép vào phiếu trả lời.'
    ]
  }
];
