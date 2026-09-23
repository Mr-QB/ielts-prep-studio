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
    subtitle: 'Xác định tính xác thực của nhận định dựa trên sự thật (Fact) trong bài đọc',
    rememberIn30Sec: [
      'TRUE: Đoạn văn khẳng định cùng một sự thật (chính xác về mặt ý nghĩa, thường diễn đạt bằng từ đồng nghĩa).',
      'FALSE: Đoạn văn nói ngược lại hoặc mâu thuẫn hoàn toàn với nhận định.',
      'NOT GIVEN: Đoạn văn không có đủ dữ liệu để kết luận đúng hay sai (dù câu đó ngoài đời có thật hay không).'
    ],
    steps: [
      '1. Đọc nhận định trong câu hỏi trước, gạch chân 2–3 từ khóa cố định (tên riêng, số, thuật ngữ khó đổi) để định vị đoạn văn.',
      '2. Gạch chân từ khóa mang tính quyết định (động từ chính, tính từ so sánh, từ chỉ số lượng/tần suất: all, only, most, never).',
      '3. Tìm vị trí câu chứa thông tin tương đương trong bài đọc qua hiện tượng paraphrase.',
      '4. So sánh kỹ ý nghĩa của 2 câu. Tuyệt đối không tự suy diễn dựa vào hiểu biết bên ngoài.'
    ],
    keywordsParaphrase: [
      { question: 'started in the late 1990s', passage: 'was launched in the late 1990s', note: 'started ≈ was launched' },
      { question: 'declined considerably', passage: 'plummeted by over 80%', note: 'declined considerably ≈ plummeted' },
      { question: 'annual expenditure', passage: 'cost per year', note: 'annual expenditure ≈ cost per year' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy số lượng tuyệt đối (All / Many / Some)',
        example: 'Đề bài: "All students preferred online classes." | Bài đọc: "Many students preferred online classes."',
        fix: 'Trả lời: FALSE (bởi vì "many" không bằng "all"). Nếu bài chỉ nói chung chung không rõ tỉ lệ -> NOT GIVEN.'
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
          explanation: 'Bài viết nói: "operate reliably for up to 45 minutes in adverse weather" (thời tiết khắc nghiệt/mưa gió vẫn bay tốt), trái ngược với "strictly forbidden".'
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
      'Nếu thấy câu hỏi chứa từ mang tính tuyệt đối (always, only, impossible, all), 80% câu trả lời là FALSE hoặc NOT GIVEN.',
      'Nếu bạn phải mất hơn 2 phút tìm kiếm mà không thấy thông tin trong bài, khả năng cao là NOT GIVEN.'
    ]
  },

  // 2. Yes / No / Not Given
  {
    type: 'yes-no-notgiven',
    group: 'statements',
    title: 'Yes / No / Not Given',
    subtitle: 'Xác định quan điểm, nhận định hoặc thái độ của tác giả (Claims & Opinions)',
    rememberIn30Sec: [
      'YES: Trùng khớp với quan điểm hoặc thái độ của tác giả.',
      'NO: Trái ngược với quan điểm của tác giả.',
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
        trap: 'Nhầm lẫn giữa quan điểm của tác giả và quan điểm của người khác được trích dẫn',
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
    rememberIn30Sec: [
      'Mỗi tiêu đề tóm tắt Ý CHÍNH (Main Idea) của toàn đoạn, KHÔNG PHẢI một chi tiết nhỏ (Detail).',
      'Số lượng tiêu đề luôn nhiều hơn số lượng đoạn văn (thường có 2–3 tiêu đề bẫy).'
    ],
    steps: [
      '1. Luôn làm dạng Matching Headings ĐẦU TIÊN của bài đọc vì nó giúp bạn nắm được cấu trúc toàn bài.',
      '2. Đọc lướt (skimming) câu đầu (Topic sentence), câu thứ 2 và câu cuối của đoạn.',
      '3. Tìm từ khóa thể hiện chủ đề chung của đoạn.',
      '4. So sánh với danh sách Heading: Loại bỏ các Heading chỉ nhắc tới 1 số liệu hoặc 1 ví dụ minh họa nhỏ.'
    ],
    keywordsParaphrase: [
      { question: 'Financial incentives for clean energy', passage: 'Subsidies and tax rebates were offered to manufacturers', note: 'Financial incentives ≈ subsidies & tax rebates' },
      { question: 'Unforeseen environmental consequences', passage: 'Unexpected ecological damage occurred', note: 'Unforeseen consequences ≈ unexpected damage' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy trùng từ khóa (Matching keyword instead of meaning)',
        example: 'Đoạn văn có từ "money", trong Heading có "Financial crisis". Người học vội chọn dù đoạn văn chỉ đang kể một câu chuyện cá nhân.',
        fix: 'Hãy hỏi: "Nếu phải đặt tên cho cả đoạn này trong 1 câu, đây có phải ý bao quát không?"'
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
    rememberIn30Sec: [
      'Khác với Matching Headings, dạng này tìm CHI TIẾT CỤ THỂ (specific detail), không cần là ý chính của đoạn.',
      'Một đoạn văn có thể được dùng 2 lần nếu đề có lưu ý: NB You may use any letter more than once.'
    ],
    steps: [
      '1. Đọc kỹ yêu cầu tìm kiếm: a reference to (nhắc đến), an example of (ví dụ về), a comparison between (so sánh giữa).',
      '2. Xác định dạng thông tin: số liệu, nguyên nhân, tên địa danh, hay mốc thời gian.',
      '3. Nên làm dạng này SAU KHI đã làm các dạng câu hỏi khác để tận dụng trí nhớ về vị trí các đoạn.'
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
      'Ghi nhớ: "NB You may use any letter more than once" có nghĩa là chắc chắn có 1 đoạn chứa 2 câu trả lời.'
    ]
  },

  // 5. Summary / Sentence Completion
  {
    type: 'summary-completion',
    group: 'completion',
    title: 'Summary & Sentence Completion',
    subtitle: 'Điền từ chính xác từ bài đọc vào chỗ trống trong đoạn tóm tắt hoặc câu rời',
    rememberIn30Sec: [
      'TUÂN THỦ SỐ TỪ CHO PHÉP (e.g. NO MORE THAN TWO WORDS AND/OR A NUMBER).',
      'Lấy từ NGUYÊN BẢN trong bài đọc, KHÔNG thay đổi dạng từ (không thêm -s, không đổi thì).'
    ],
    steps: [
      '1. Đọc giới hạn số từ được phép điền.',
      '2. Đọc câu chứa chỗ trống, DỰ ĐOÁN từ loại cần điền (danh từ số ít/nhiều, tính từ, động từ, năm tháng).',
      '3. Tìm từ khóa xung quanh chỗ trống để định vị đoạn trong bài đọc.',
      '4. Nhặt đúng từ và kiểm tra lại ngữ pháp của cả câu sau khi điền.'
    ],
    keywordsParaphrase: [
      { question: 'requires adequate _____ to operate', passage: 'relies on sufficient ventilation to function', note: 'adequate ≈ sufficient, operate ≈ function -> điền: ventilation' }
    ],
    commonTraps: [
      {
        trap: 'Thừa từ vượt quá quy định',
        example: 'Đề: NO MORE THAN ONE WORD. Học viên điền "the battery" thay vì "battery".',
        fix: 'Nếu điền mạo từ "the/a/an" làm quá số từ cho phép, câu sẽ bị chấm SAI hoàn toàn!'
      }
    ],
    examples: [
      {
        question: 'Early mechanical clocks relied on falling _____ to drive the gear mechanism.',
        passage: 'The earliest timepieces derived kinetic energy from descending weights connected to iron escapements.',
        answer: 'weights',
        reason: '"falling" = "descending", "relied on... to drive" = "derived kinetic energy from...". Điền đúng: weights.'
      }
    ],
    miniPractice: {
      id: 'mini-sc-1',
      passage: 'Marine biologists observed that blue whales modulate their vocal frequencies in response to ambient ship engine noise. High-frequency acoustic pulses allow these mammals to maintain long-distance navigational contact across migratory corridors.',
      questions: [
        {
          id: 'mini-sc-q1',
          prompt: 'Blue whales adjust their vocal frequencies when exposed to sound produced by _____. (NO MORE THAN TWO WORDS)',
          correctAnswer: 'ship engine',
          explanation: '"modulate" = "adjust", "ambient ship engine noise" -> từ cần điền là: ship engine (hoặc engines).'
        }
      ]
    },
    reviewTips: [
      'Sau khi điền, hãy đọc lại to câu hoàn chỉnh trong đầu để xem ngữ pháp (chia động từ, số ít/nhiều) có chuẩn xác không.'
    ]
  },

  // 6. Multiple Choice
  {
    type: 'multiple-choice',
    group: 'questions',
    title: 'Multiple Choice',
    subtitle: 'Chọn phương án chính xác nhất giữa 4 lựa chọn (A, B, C, D)',
    rememberIn30Sec: [
      'Phương pháp loại trừ là vũ khí mạnh nhất trong Multiple Choice.',
      '3 phương án sai thường là: hoàn toàn không được nhắc đến, nói ngược ý, hoặc trích từ trong bài nhưng ghép sai ngữ cảnh.'
    ],
    steps: [
      '1. Đọc phần gốc của câu hỏi (question stem) trước, CHƯA vội đọc 4 đáp án để tránh bị nhiễu thông tin.',
      '2. Định vị đoạn văn nói về nội dung câu hỏi.',
      '3. Đọc hiểu ý của bài đọc trước, tự hình thành câu trả lời trong đầu.',
      '4. So sánh với 4 lựa chọn A, B, C, D và loại bỏ các đáp án có từ khóa nhưng sai logic.'
    ],
    keywordsParaphrase: [
      { question: 'Why did the researcher initiate the study?', passage: 'The primary motivation behind the project was...', note: 'Why initiate ≈ motivation behind' }
    ],
    commonTraps: [
      {
        trap: 'Bẫy trùng lặp từ ngữ bề mặt (Distractor with identical words)',
        example: 'Đáp án B có đúng 3 từ xuất hiện trong bài đọc nhưng quan hệ nguyên nhân - kết quả bị đảo lộn.',
        fix: 'Đừng chọn đáp án chỉ vì nó có nhiều từ giống bài đọc nhất. Đáp án đúng thường được PARAPHRASE hoàn toàn!'
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
      'Luôn gạch chéo lý do loại từng đáp án sai (ví dụ: sai ý, không có thông tin, quá cực đoan).'
    ]
  }
];
