import { ReadingPracticeSet } from '../types';

export const READING_PRACTICE_SETS: ReadingPracticeSet[] = [
  // 1. True / False / Not Given
  {
    id: 'practice-tfng-01',
    title: 'True / False / Not Given: The Renewable Energy Transition',
    questionType: 'true-false-notgiven',
    passageTitle: 'Global Shift Towards Solar and Wind Power',
    topic: 'Renewable Technology & Energy Economics',
    difficulty: 'medium',
    estimatedBand: 'Band 5.0 - 6.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Over the past decade, the levelized cost of solar photovoltaic energy has plummeted by over 80%, rendering it the most economical electricity source in most regions. The initiative was launched in the late 1990s as governmental subsidies kickstarted technological research.'
      },
      {
        label: 'Paragraph 2',
        text: 'Wind energy has similarly accelerated, particularly offshore installations that capture steadier oceanic gusts. However, integrating intermittent renewable sources requires massive investment in grid-scale battery storage and transmission infrastructure.'
      }
    ],
    questions: [
      {
        id: 'tfng-q1',
        number: 1,
        type: 'true-false-notgiven',
        prompt: 'The renewable energy project started in the late 1990s.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph 1 confirms: "The initiative was launched in the late 1990s".',
        explanationVi: 'Đoạn 1 nêu rõ sáng kiến được khởi xướng vào cuối những năm 1990.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'The initiative was launched in the late 1990s as governmental subsidies kickstarted technological research.',
        questionKeywords: 'started in the late 1990s',
        passageParaphrase: 'started ≈ was launched',
        targetVocab: [
          { word: 'launch', definitionVi: 'khởi xướng, phát động', contextSentence: 'The initiative was launched in the late 1990s' }
        ]
      },
      {
        id: 'tfng-q2',
        number: 2,
        type: 'true-false-notgiven',
        prompt: 'Solar energy is currently more costly to generate than electricity derived from coal.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph 1 states solar costs dropped by 80%, making it "the most economical electricity source".',
        explanationVi: 'Đoạn 1 khẳng định chi phí năng lượng mặt trời giảm 80%, trở thành nguồn điện tiết kiệm nhất (most economical), trái ngược với nhận định đắt hơn than đá.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'plummeted by over 80%, rendering it the most economical electricity source in most regions.',
        questionKeywords: 'more costly to generate than coal',
        passageParaphrase: 'more costly ≠ the most economical electricity source'
      },
      {
        id: 'tfng-q3',
        number: 3,
        type: 'true-false-notgiven',
        prompt: 'Offshore wind farms generate higher maintenance expenses than onshore wind turbines.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'Paragraph 2 notes offshore installations capture steadier winds, but does not mention or compare maintenance expenses.',
        explanationVi: 'Đoạn 2 nhắc tới việc điện gió ngoài khơi đón được luồng gió ổn định hơn, nhưng không hề so sánh chi phí bảo trì (maintenance expenses) với đất liền.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'Wind energy has similarly accelerated, particularly offshore installations that capture steadier oceanic gusts.',
        questionKeywords: 'offshore wind farms generate higher maintenance expenses',
        passageParaphrase: 'Không có thông tin về chi phí bảo trì (maintenance expenses).'
      }
    ]
  },

  // 2. Yes / No / Not Given (Writer's claims / opinions)
  {
    id: 'practice-ynng-01',
    title: 'Yes / No / Not Given: Urban Architecture and Mental Health',
    questionType: 'yes-no-notgiven',
    passageTitle: 'Biophilic Design in Modern Metropolises',
    topic: 'Architecture & Psychology',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Traditional skyscraper architecture often isolates inhabitants from the natural world. Empirical research demonstrates that prolonged confinement within austere concrete environments elevates cortisol levels and impairs cognitive restoration.'
      },
      {
        label: 'Paragraph 2',
        text: 'Biophilic architecture—the deliberate incorporation of vegetation, natural daylight, and organic textures into built structures—exerts a profound tranquilizing influence. Hospital patients with window views of leafy parklands recover faster and require fewer analgesics.'
      }
    ],
    questions: [
      {
        id: 'ynng-q1',
        number: 1,
        type: 'yes-no-notgiven',
        prompt: 'Inhabitants of conventional high-rise buildings experience physiological stress.',
        correctAnswer: 'YES',
        explanation: 'Paragraph 1 notes confinement in austere concrete spaces "elevates cortisol levels" (cortisol is the primary human stress hormone).',
        explanationVi: 'Đoạn 1 xác nhận việc sinh sống trong các tòa nhà bê tông truyền thống làm tăng nồng độ cortisol (chỉ số căng thẳng sinh lý).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'prolonged confinement within austere concrete environments elevates cortisol levels',
        questionKeywords: 'experience physiological stress',
        passageParaphrase: 'physiological stress ≈ elevates cortisol levels'
      },
      {
        id: 'ynng-q2',
        number: 2,
        type: 'yes-no-notgiven',
        prompt: 'Patients with parkland views consume greater dosages of pain medication.',
        correctAnswer: 'NO',
        explanation: 'Paragraph 2 states patients "recover faster and require fewer analgesics" (analgesics = pain medication).',
        explanationVi: 'Đoạn 2 nêu rõ bệnh nhân có tầm nhìn ra công viên hồi phục nhanh hơn và cần ít thuốc giảm đau hơn (fewer analgesics), ngược với nhận định "consume greater dosages".',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'Hospital patients with window views of leafy parklands recover faster and require fewer analgesics.',
        questionKeywords: 'consume greater dosages of pain medication',
        passageParaphrase: 'greater dosages of pain medication ≠ require fewer analgesics'
      },
      {
        id: 'ynng-q3',
        number: 3,
        type: 'yes-no-notgiven',
        prompt: 'Governments should legislate mandatory green space quotas for commercial property developers.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'The passage discusses health benefits of green spaces, but does not state the writer’s opinion on whether governments should pass mandatory laws.',
        explanationVi: 'Bài đọc phân tích lợi ích sức khỏe của không gian xanh, nhưng tác giả không hề đưa ra ý kiến về việc chính phủ có nên bắt buộc ban hành luật hạn mức hay không.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'Biophilic architecture—the deliberate incorporation of vegetation... exerts a profound tranquilizing influence.',
        questionKeywords: 'governments should legislate mandatory quotas',
        passageParaphrase: 'Không có quan điểm về quy định pháp luật bắt buộc của chính phủ.'
      }
    ]
  },

  // 3. Matching Headings
  {
    id: 'practice-headings-01',
    title: 'Matching Headings: The History of Tea Cultivation',
    questionType: 'matching-headings',
    passageTitle: 'The Global Journey of Camellia Sinensis',
    topic: 'Agricultural History & Global Trade',
    difficulty: 'hard',
    estimatedBand: 'Band 6.5 - 7.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Section A',
        text: 'According to legendary accounts, tea drinking originated in ancient China in 2737 BCE when Emperor Shennong accidentally boiled Camellia leaves. For centuries, it functioned predominantly as a medicinal elixir and monastic aid to contemplation before emerging as a recreational beverage.'
      },
      {
        label: 'Section B',
        text: 'During the 17th century, Dutch and British merchants introduced the dried leaves to European royal courts. Initially an exorbitant luxury affordable solely by aristocracy, taxation policies gradually made tea accessible to the burgeoning industrial working class.'
      },
      {
        label: 'Section C',
        text: 'The insatiable British appetite for Chinese tea precipitated acute trade imbalances. In response, British botanist Robert Fortune disguised himself to covertly smuggle tea plants and manufacturing secrets from inland China into the British colony of Assam, India, breaking the Chinese monopoly.'
      }
    ],
    questions: [
      {
        id: 'head-q1',
        number: 1,
        type: 'matching-headings',
        prompt: 'Choose the most suitable heading for Section A:',
        options: [
          'i. Commercial rivalry and botanical espionage',
          'ii. Early medicinal origins and spiritual use',
          'iii. Aristocratic adoption in Western markets',
          'iv. Industrial mechanization of harvesting'
        ],
        correctAnswer: 'ii. Early medicinal origins and spiritual use',
        explanation: 'Section A outlines tea’s mythological genesis and initial role as a medicinal tonic and monastic contemplation aid.',
        explanationVi: 'Phần A nêu rõ nguồn gốc truyền thuyết của trà và vai trò ban đầu là thảo dược chữa bệnh cũng như hỗ trợ tu tập thiền định.',
        paragraphReference: 'Section A',
        evidenceSnippet: 'predominantly as a medicinal elixir and monastic aid to contemplation',
        questionKeywords: 'medicinal origins and spiritual use',
        passageParaphrase: 'medicinal elixir and monastic contemplation ≈ medicinal origins and spiritual use'
      },
      {
        id: 'head-q2',
        number: 2,
        type: 'matching-headings',
        prompt: 'Choose the most suitable heading for Section B:',
        options: [
          'i. Commercial rivalry and botanical espionage',
          'ii. Early medicinal origins and spiritual use',
          'iii. European introduction from luxury to mass consumption',
          'iv. Environmental impacts of intensive plantations'
        ],
        correctAnswer: 'iii. European introduction from luxury to mass consumption',
        explanation: 'Section B details how tea migrated from an exclusive royal delicacy to a staple drink for the working masses.',
        explanationVi: 'Phần B mô tả hành trình trà du nhập vào châu Âu, từ thức uống đắt đỏ của quý tộc dần trở thành món uống phổ thông của tầng lớp lao động.',
        paragraphReference: 'Section B',
        evidenceSnippet: 'Initially an exorbitant luxury affordable solely by aristocracy... accessible to the burgeoning industrial working class.',
        questionKeywords: 'luxury to mass consumption',
        passageParaphrase: 'exorbitant luxury solely by aristocracy to accessible to working class'
      },
      {
        id: 'head-q3',
        number: 3,
        type: 'matching-headings',
        prompt: 'Choose the most suitable heading for Section C:',
        options: [
          'i. Commercial rivalry and botanical espionage',
          'ii. Modern synthetic alternatives',
          'iii. Preservation techniques in maritime voyages',
          'iv. Nutritional composition of fermented leaves'
        ],
        correctAnswer: 'i. Commercial rivalry and botanical espionage',
        explanation: 'Section C describes trade deficits and the covert theft of tea plants by Robert Fortune (espionage).',
        explanationVi: 'Phần C kể về việc nhà thực vật học Robert Fortune cải trang bí mật đánh cắp giống trà và bí quyết chế biến khỏi Trung Quốc (hoạt động gián điệp thực vật).',
        paragraphReference: 'Section C',
        evidenceSnippet: 'covertly smuggle tea plants and manufacturing secrets from inland China... breaking the Chinese monopoly.',
        questionKeywords: 'botanical espionage and commercial rivalry',
        passageParaphrase: 'covertly smuggle secrets ≈ botanical espionage'
      }
    ]
  },

  // 4. Summary Completion
  {
    id: 'practice-summary-01',
    title: 'Summary Completion: The Deep Ocean Trench Ecosystems',
    questionType: 'summary-completion',
    passageTitle: 'Life in the Hadal Zone',
    topic: 'Marine Biology & Extreme Environments',
    difficulty: 'medium',
    estimatedBand: 'Band 5.5 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'The hadal zone, encompassing ocean trenches deeper than 6,000 meters, represents the most extreme aquatic biome on Earth. Deprived of solar illumination, organisms survive under crushing hydrostatic pressures exceeding 1,000 atmospheres and near-freezing temperatures.'
      },
      {
        label: 'Paragraph 2',
        text: 'Rather than photosynthesis, the base of deep hydrothermal food webs relies on chemosynthesis. Chemolithoautotrophic bacteria oxidize toxic hydrogen sulfide surging from thermal vents to synthesize organic carbon, sustaining vibrant clusters of giant tube worms and ghost crabs.'
      }
    ],
    questions: [
      {
        id: 'sum-q1',
        number: 1,
        type: 'summary-completion',
        prompt: 'Deep trench biomes exist in total darkness because they are entirely deprived of [ 1 ].',
        correctAnswer: 'solar illumination',
        acceptableAnswers: ['sunlight', 'illumination'],
        explanation: 'Paragraph 1: "Deprived of solar illumination, organisms survive under crushing hydrostatic pressures..."',
        explanationVi: 'Đoạn 1 khẳng định sinh vật dưới đáy vực thẳm hoàn toàn không có ánh sáng mặt trời chiếu tới (solar illumination).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'Deprived of solar illumination, organisms survive under crushing hydrostatic pressures',
        questionKeywords: 'deprived of [ 1 ]',
        passageParaphrase: 'total darkness ≈ deprived of solar illumination'
      },
      {
        id: 'sum-q2',
        number: 2,
        type: 'summary-completion',
        prompt: 'In place of photosynthesis, primary food production in hydrothermal vents depends on [ 2 ].',
        correctAnswer: 'chemosynthesis',
        explanation: 'Paragraph 2 states: "Rather than photosynthesis, the base of deep hydrothermal food webs relies on chemosynthesis."',
        explanationVi: 'Đoạn 2 nêu rõ thay vì quang hợp, chuỗi thức ăn dưới đáy đại dương dựa vào quá trình hóa tổng hợp (chemosynthesis).',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'Rather than photosynthesis, the base of deep hydrothermal food webs relies on chemosynthesis.',
        questionKeywords: 'primary production depends on [ 2 ]',
        passageParaphrase: 'in place of photosynthesis ≈ rather than photosynthesis'
      },
      {
        id: 'sum-q3',
        number: 3,
        type: 'summary-completion',
        prompt: 'Chemosynthetic bacteria process toxic [ 3 ] emitting from thermal fissures to produce organic matter.',
        correctAnswer: 'hydrogen sulfide',
        explanation: 'Paragraph 2 clarifies bacteria "oxidize toxic hydrogen sulfide surging from thermal vents".',
        explanationVi: 'Đoạn 2 chỉ rõ vi khuẩn oxy hóa khí hydro sunfua độc hại (hydrogen sulfide) để tạo chất hữu cơ.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'bacteria oxidize toxic hydrogen sulfide surging from thermal vents to synthesize organic carbon',
        questionKeywords: 'process toxic [ 3 ] emitting from thermal fissures',
        passageParaphrase: 'process toxic [ 3 ] ≈ oxidize toxic hydrogen sulfide'
      }
    ]
  },

  // 5. Multiple Choice
  {
    id: 'practice-mc-01',
    title: 'Multiple Choice: The Psychology of Flow State',
    questionType: 'multiple-choice',
    passageTitle: 'Optimal Human Experience and Engagement',
    topic: 'Cognitive Science & Performance',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Psychologist Mihaly Csikszentmihalyi conceptualized ‘flow’ as an optimal psychological state wherein an individual becomes completely absorbed in an activity. During flow, self-reflective consciousness diminishes, time perception warps, and subjective performance peaks.'
      },
      {
        label: 'Paragraph 2',
        text: 'Crucially, flow occurs exclusively within a narrow corridor where the challenge of the task precisely equilibrates with the individual’s perceived skill level. If challenges exceed ability, acute anxiety ensues; conversely, if skills overwhelm the challenge, apathy and boredom result.'
      }
    ],
    questions: [
      {
        id: 'mc-q1',
        number: 1,
        type: 'multiple-choice',
        prompt: 'According to Csikszentmihalyi, what happens to an individual’s subjective experience during flow?',
        options: [
          'They become hypersensitive to external distractions.',
          'Self-awareness declines and their perception of passing time changes.',
          'Physical heart rate and energy expenditure double.',
          'Memory retention decreases significantly after the task ends.'
        ],
        correctAnswer: 'Self-awareness declines and their perception of passing time changes.',
        explanation: 'Paragraph 1: "self-reflective consciousness diminishes, time perception warps, and subjective performance peaks."',
        explanationVi: 'Đoạn 1 nêu rõ ý thức tự phản chiếu giảm đi (self-awareness declines) và cảm giác về thời gian bị biến đổi (time perception warps).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'self-reflective consciousness diminishes, time perception warps',
        questionKeywords: 'subjective experience during flow',
        passageParaphrase: 'self-awareness declines ≈ self-reflective consciousness diminishes'
      },
      {
        id: 'mc-q2',
        number: 2,
        type: 'multiple-choice',
        prompt: 'What emotional consequence emerges when task difficulty significantly outstrips an individual’s capabilities?',
        options: [
          'Acute anxiety and stress',
          'Apathy and intense boredom',
          'Rapid skill acquisition',
          'Heightened creative inspiration'
        ],
        correctAnswer: 'Acute anxiety and stress',
        explanation: 'Paragraph 2 explicitly states: "If challenges exceed ability, acute anxiety ensues".',
        explanationVi: 'Đoạn 2 nêu rõ nếu thử thách vượt quá khả năng bản thân thì sẽ dẫn tới sự lo âu tột độ (acute anxiety).',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'If challenges exceed ability, acute anxiety ensues',
        questionKeywords: 'difficulty outstrips capabilities',
        passageParaphrase: 'outstrips capabilities ≈ challenges exceed ability'
      }
    ]
  },

  // 6. Sentence Completion
  {
    id: 'practice-sentcomp-01',
    title: 'Sentence Completion: Early Printing Press Innovations',
    questionType: 'sentence-completion',
    passageTitle: 'Gutenberg and the Information Revolution',
    topic: 'Historical Technology & Typography',
    difficulty: 'medium',
    estimatedBand: 'Band 5.5 - 6.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Johannes Gutenberg’s monumental breakthrough in mid-15th century Mainz lay not in any single discovery, but in the ingenious synthesis of disparate existing technologies. He adapted the mechanical screw mechanism of the agricultural wine press to deliver uniform downward pressure on paper.'
      },
      {
        label: 'Paragraph 2',
        text: 'Furthermore, Gutenberg formulated an oil-based ink that adhered effectively to metal alloy type rather than running off like traditional water-based scribal inks. His standardized lead-tin-antimony alloy expanded slightly upon cooling, ensuring crisp typographic definition.'
      }
    ],
    questions: [
      {
        id: 'sc-q1',
        number: 1,
        type: 'sentence-completion',
        prompt: 'Gutenberg adapted the mechanical mechanism of an agricultural [ 1 ] to exert even pressure on paper sheets.',
        correctAnswer: 'wine press',
        explanation: 'Paragraph 1 confirms he modified the screw mechanism of "the agricultural wine press".',
        explanationVi: 'Đoạn 1 nêu ông ứng dụng cơ chế đinh ốc của máy ép rượu nho (wine press) nông nghiệp.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'adapted the mechanical screw mechanism of the agricultural wine press to deliver uniform downward pressure',
        questionKeywords: 'mechanism of an agricultural [ 1 ]',
        passageParaphrase: 'even pressure ≈ uniform downward pressure'
      },
      {
        id: 'sc-q2',
        number: 2,
        type: 'sentence-completion',
        prompt: 'Unlike conventional water-based inks, Gutenberg’s newly created ink was [ 2 ].',
        correctAnswer: 'oil-based',
        acceptableAnswers: ['oil-based ink', 'oil based'],
        explanation: 'Paragraph 2 specifies: "Gutenberg formulated an oil-based ink that adhered effectively to metal alloy type".',
        explanationVi: 'Đoạn 2 khẳng định ông điều chế loại mực gốc dầu (oil-based ink) bám chắc vào khuôn kim loại.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'Gutenberg formulated an oil-based ink that adhered effectively to metal alloy type',
        questionKeywords: 'newly created ink was [ 2 ]',
        passageParaphrase: 'newly created ≈ formulated'
      }
    ]
  },

  // 7. Matching Features
  {
    id: 'practice-features-01',
    title: 'Matching Features: Linguistic Theories of Child Language Acquisition',
    questionType: 'matching-features',
    passageTitle: 'How Infants Master Complex Grammar',
    topic: 'Linguistics & Cognitive Development',
    difficulty: 'hard',
    estimatedBand: 'Band 6.5 - 7.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph A',
        text: 'B.F. Skinner advocated the behaviorist perspective, positing that infants acquire vocabulary and grammatical habits strictly through environmental conditioning, imitation of parental speech, and reinforcement via praise.'
      },
      {
        label: 'Paragraph B',
        text: 'Noam Chomsky fiercely contested Skinner’s paradigm, introducing the innateness hypothesis. Chomsky argued that children are born with an innate Universal Grammar and an internal Language Acquisition Device (LAD), allowing them to construct infinite novel utterances despite impoverished auditory inputs.'
      },
      {
        label: 'Paragraph C',
        text: 'Lev Vygotsky proposed a social interactionist model, emphasizing that linguistic mastery arises through guided collaboration inside the child’s Zone of Proximal Development (ZPD) within cultural dialogues.'
      }
    ],
    questions: [
      {
        id: 'feat-q1',
        number: 1,
        type: 'matching-features',
        prompt: 'Who argued that language learning relies primarily on external environmental imitation and behavioral reinforcement?',
        options: ['B.F. Skinner', 'Noam Chomsky', 'Lev Vygotsky'],
        correctAnswer: 'B.F. Skinner',
        explanation: 'Paragraph A describes Skinner’s belief in conditioning, imitation, and reinforcement.',
        explanationVi: 'Đoạn A nêu quan điểm của Skinner về việc học qua bắt chước và củng cố hành vi (imitation and reinforcement).',
        paragraphReference: 'Paragraph A',
        evidenceSnippet: 'strictly through environmental conditioning, imitation of parental speech, and reinforcement via praise.',
        questionKeywords: 'environmental imitation and behavioral reinforcement',
        passageParaphrase: 'imitation and reinforcement ≈ imitation and reinforcement via praise'
      },
      {
        id: 'feat-q2',
        number: 2,
        type: 'matching-features',
        prompt: 'Who proposed that humans possess an innate biological capacity and Universal Grammar from birth?',
        options: ['B.F. Skinner', 'Noam Chomsky', 'Lev Vygotsky'],
        correctAnswer: 'Noam Chomsky',
        explanation: 'Paragraph B explains Chomsky’s innateness hypothesis and Universal Grammar.',
        explanationVi: 'Đoạn B nêu lý thuyết bẩm sinh (innate Universal Grammar) của Noam Chomsky.',
        paragraphReference: 'Paragraph B',
        evidenceSnippet: 'Chomsky argued that children are born with an innate Universal Grammar',
        questionKeywords: 'innate biological capacity and Universal Grammar from birth',
        passageParaphrase: 'innate capacity from birth ≈ born with an innate Universal Grammar'
      },
      {
        id: 'feat-q3',
        number: 3,
        type: 'matching-features',
        prompt: 'Who highlighted the indispensable role of cultural dialogue within the Zone of Proximal Development?',
        options: ['B.F. Skinner', 'Noam Chomsky', 'Lev Vygotsky'],
        correctAnswer: 'Lev Vygotsky',
        explanation: 'Paragraph C links Vygotsky directly to the Zone of Proximal Development (ZPD).',
        explanationVi: 'Đoạn C đề cập thuyết của Lev Vygotsky và vùng phát triển gần (Zone of Proximal Development).',
        paragraphReference: 'Paragraph C',
        evidenceSnippet: 'Lev Vygotsky proposed a social interactionist model, emphasizing that linguistic mastery arises through guided collaboration inside the child’s Zone of Proximal Development',
        questionKeywords: 'cultural dialogue within Zone of Proximal Development',
        passageParaphrase: 'guided collaboration inside Zone of Proximal Development'
      }
    ]
  },

  // 8. Note Completion
  {
    id: 'practice-notes-01',
    title: 'Note Completion: The Chemistry of Photosynthesis',
    questionType: 'note-completion',
    passageTitle: 'Chloroplast Dynamics and Carbon Fixation',
    topic: 'Biochemistry & Plant Physiology',
    difficulty: 'medium',
    estimatedBand: 'Band 5.5 - 6.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Photosynthesis operates through two coordinated stages inside plant chloroplasts. In the thylakoid membranes, light-dependent reactions absorb photons using chlorophyll pigments to split water molecules, generating adenosine triphosphate (ATP) and releasing molecular oxygen as a byproduct.'
      },
      {
        label: 'Paragraph 2',
        text: 'In the stroma fluid, the light-independent Calvin cycle fixes atmospheric carbon dioxide into high-energy sugars. The enzyme RuBisCO facilitates this catalytic transformation, making it the most abundant catalytic protein on the planet.'
      }
    ],
    questions: [
      {
        id: 'note-q1',
        number: 1,
        type: 'note-completion',
        prompt: 'During light reactions in the thylakoids, water is split to release [ 1 ] into the atmosphere.',
        correctAnswer: 'molecular oxygen',
        acceptableAnswers: ['oxygen'],
        explanation: 'Paragraph 1 states light reactions split water "releasing molecular oxygen as a byproduct".',
        explanationVi: 'Đoạn 1 nêu phản ứng sáng phân tách phân tử nước và giải phóng oxy (molecular oxygen).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'split water molecules, generating adenosine triphosphate (ATP) and releasing molecular oxygen as a byproduct.',
        questionKeywords: 'split to release [ 1 ]',
        passageParaphrase: 'release [ 1 ] into atmosphere ≈ releasing molecular oxygen as a byproduct'
      },
      {
        id: 'note-q2',
        number: 2,
        type: 'note-completion',
        prompt: 'The catalytic enzyme responsible for carbon fixation in the stroma is [ 2 ].',
        correctAnswer: 'RuBisCO',
        acceptableAnswers: ['rubisco'],
        explanation: 'Paragraph 2 names "RuBisCO" as the enzyme facilitating carbon fixation.',
        explanationVi: 'Đoạn 2 xác nhận enzyme RuBisCO phụ trách xúc tác quá trình cố định carbon.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'The enzyme RuBisCO facilitates this catalytic transformation',
        questionKeywords: 'catalytic enzyme responsible for carbon fixation',
        passageParaphrase: 'catalytic enzyme ≈ enzyme RuBisCO facilitates this catalytic transformation'
      }
    ]
  },

  // 9. Table Completion
  {
    id: 'practice-table-01',
    title: 'Table Completion: Comparative Characteristics of Ancient Writing Materials',
    questionType: 'table-completion',
    passageTitle: 'Papyrus, Parchment, and Paper',
    topic: 'Archaeology & Cultural Technology',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Papyrus, pioneered in dynastic Egypt, was fabricated from the fibrous reeds of the Nile marshlands. While lightweight, it degraded rapidly when exposed to moisture and humidity.'
      },
      {
        label: 'Paragraph 2',
        text: 'Parchment, perfected in Hellenistic Pergamon, was manufactured from processed animal skins of sheep, calves, or goats. It was immensely resilient and could withstand centuries of library handling, although fabrication costs were exorbitant.'
      }
    ],
    questions: [
      {
        id: 'tbl-q1',
        number: 1,
        type: 'table-completion',
        prompt: 'Papyrus raw material source: [ 1 ] from marshlands.',
        correctAnswer: 'fibrous reeds',
        acceptableAnswers: ['reeds'],
        explanation: 'Paragraph 1 states papyrus was made from "fibrous reeds of the Nile marshlands".',
        explanationVi: 'Đoạn 1 nêu cói xơ (fibrous reeds) từ đầm lầy sông Nile là nguyên liệu làm giấy cói.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'fabricated from the fibrous reeds of the Nile marshlands.',
        questionKeywords: 'raw material source: [ 1 ] from marshlands',
        passageParaphrase: 'raw material source ≈ fabricated from fibrous reeds'
      },
      {
        id: 'tbl-q2',
        number: 2,
        type: 'table-completion',
        prompt: 'Parchment main advantage: exceptionally [ 2 ] and durable over centuries.',
        correctAnswer: 'resilient',
        acceptableAnswers: ['immensely resilient'],
        explanation: 'Paragraph 2: "It was immensely resilient and could withstand centuries of library handling..."',
        explanationVi: 'Đoạn 2 nêu ưu điểm lớn của giấy da là cực kỳ dẻo dai bền bỉ (immensely resilient).',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'It was immensely resilient and could withstand centuries of library handling',
        questionKeywords: 'main advantage: exceptionally [ 2 ]',
        passageParaphrase: 'exceptionally [ 2 ] ≈ immensely resilient'
      }
    ]
  },

  // 10. Flow-chart Completion
  {
    id: 'practice-flowchart-01',
    title: 'Flow-chart Completion: The Water Desalination Sequence',
    questionType: 'flowchart-completion',
    passageTitle: 'Reverse Osmosis Desalination Technology',
    topic: 'Hydrology & Civil Engineering',
    difficulty: 'medium',
    estimatedBand: 'Band 5.5 - 6.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'The reverse osmosis process begins with initial coarse filtration, in which seawater is drawn through intake screens to eliminate suspended sediment and aquatic organisms. Next, the pretreated water is forced by high-pressure industrial pumps through specialized semipermeable membranes.'
      },
      {
        label: 'Paragraph 2',
        text: 'These polymer membranes block dissolved salt ions while permitting pure water molecules to cross into a freshwater stream. Finally, the effluent undergoes remineralization with calcium and magnesium to meet potable municipal standards.'
      }
    ],
    questions: [
      {
        id: 'flow-q1',
        number: 1,
        type: 'flowchart-completion',
        prompt: 'Initial step: Seawater passes through intake screens to eliminate [ 1 ] and marine life.',
        correctAnswer: 'suspended sediment',
        acceptableAnswers: ['sediment'],
        explanation: 'Paragraph 1 specifies screens remove "suspended sediment and aquatic organisms".',
        explanationVi: 'Đoạn 1 nêu lưới lọc giữ lại cặn lơ lửng (suspended sediment) và sinh vật thủy sinh.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'drawn through intake screens to eliminate suspended sediment and aquatic organisms.',
        questionKeywords: 'eliminate [ 1 ] and marine life',
        passageParaphrase: 'marine life ≈ aquatic organisms'
      },
      {
        id: 'flow-q2',
        number: 2,
        type: 'flowchart-completion',
        prompt: 'Final step: Freshwater undergoes [ 2 ] to restore minerals prior to public distribution.',
        correctAnswer: 'remineralization',
        explanation: 'Paragraph 2 notes the water undergoes "remineralization with calcium and magnesium".',
        explanationVi: 'Đoạn 2 nêu công đoạn tái khoáng hóa (remineralization) bổ sung canxi và magie trước khi cấp vào mạng lưới sinh hoạt.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'the effluent undergoes remineralization with calcium and magnesium to meet potable municipal standards.',
        questionKeywords: 'undergoes [ 2 ] to restore minerals',
        passageParaphrase: 'restore minerals ≈ remineralization with calcium and magnesium'
      }
    ]
  },

  // 11. Diagram Label Completion
  {
    id: 'practice-diagram-01',
    title: 'Diagram Label Completion: Cross-section of a Geothermal Power Plant',
    questionType: 'diagram-label-completion',
    passageTitle: 'Harnessing Subterranean Thermodynamic Energy',
    topic: 'Renewable Power & Thermodynamics',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'In a binary cycle geothermal power facility, subterranean hot brine is extracted via a production well. The geothermal liquid is routed into an aboveground heat exchanger, where it transfers thermal energy to a secondary working fluid with a low boiling threshold, such as isobutane.'
      },
      {
        label: 'Paragraph 2',
        text: 'The vaporized isobutane expands rapidly to rotate a turbine coupled to an electrical generator. The spent vapor is subsequently channeled into a condenser to return to a liquid state, while the cooled brine is forced back into the geological reservoir through an injection well.'
      }
    ],
    questions: [
      {
        id: 'diag-q1',
        number: 1,
        type: 'diagram-label-completion',
        prompt: 'Component A: The subterranean brine transfers its thermal energy to a secondary fluid inside the [ 1 ].',
        correctAnswer: 'heat exchanger',
        explanation: 'Paragraph 1 notes geothermal fluid is routed into an "aboveground heat exchanger".',
        explanationVi: 'Đoạn 1 chỉ rõ nước nóng ngầm truyền nhiệt qua chất lỏng thứ cấp bên trong bộ trao đổi nhiệt (heat exchanger).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'routed into an aboveground heat exchanger, where it transfers thermal energy',
        questionKeywords: 'transfers thermal energy inside the [ 1 ]',
        passageParaphrase: 'transfers energy inside ≈ routed into a heat exchanger where it transfers thermal energy'
      },
      {
        id: 'diag-q2',
        number: 2,
        type: 'diagram-label-completion',
        prompt: 'Component B: Cooled brine is returned subterraneanly into the rock formation via an [ 2 ].',
        correctAnswer: 'injection well',
        explanation: 'Paragraph 2 states the brine is pumped back through an "injection well".',
        explanationVi: 'Đoạn 2 nêu nước nguội được bơm ngược trở lại lòng đất qua giếng bơm hoàn trả (injection well).',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'cooled brine is forced back into the geological reservoir through an injection well.',
        questionKeywords: 'returned subterraneanly via an [ 2 ]',
        passageParaphrase: 'returned subterraneanly ≈ forced back into reservoir through an injection well'
      }
    ]
  },

  // 12. Short Answer Questions
  {
    id: 'practice-shortans-01',
    title: 'Short Answer Questions: The Biology of Hibernation',
    questionType: 'short-answer',
    passageTitle: 'Physiological Adaptations to Winter Cold',
    topic: 'Zoology & Cryobiology',
    difficulty: 'medium',
    estimatedBand: 'Band 5.5 - 6.5',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'Mammalian hibernation is not merely prolonged sleep, but an active state of regulated metabolic depression known as torpor. In Arctic ground squirrels, core body temperatures drop to an astounding minus 2.9 degrees Celsius without freezing, a phenomenon termed supercooling.'
      },
      {
        label: 'Paragraph 2',
        text: 'During these multi-week bouts of torpor, the animal’s heart rate slows dramatically from over 300 beats per minute to fewer than three beats per minute, conserving vital fat reserves.'
      }
    ],
    questions: [
      {
        id: 'sa-q1',
        number: 1,
        type: 'short-answer',
        prompt: 'What scientific term describes the state of controlled metabolic suppression during hibernation?',
        correctAnswer: 'torpor',
        explanation: 'Paragraph 1 defines regulated metabolic depression as "torpor".',
        explanationVi: 'Đoạn 1 nêu thuật ngữ khoa học cho trạng thái giảm trao đổi chất này là "torpor" (trạng thái đình trệ).',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'regulated metabolic depression known as torpor.',
        questionKeywords: 'scientific term describes controlled metabolic suppression',
        passageParaphrase: 'controlled metabolic suppression ≈ regulated metabolic depression known as torpor'
      },
      {
        id: 'sa-q2',
        number: 2,
        type: 'short-answer',
        prompt: 'To what minimum number of beats per minute can an Arctic ground squirrel’s heart rate decline during deep torpor?',
        correctAnswer: 'three',
        acceptableAnswers: ['3', 'three beats', 'fewer than three'],
        explanation: 'Paragraph 2 notes heart rate drops to "fewer than three beats per minute".',
        explanationVi: 'Đoạn 2 nêu nhịp tim có thể giảm xuống dưới ba nhịp một phút (fewer than three).',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'slows dramatically from over 300 beats per minute to fewer than three beats per minute',
        questionKeywords: 'minimum number of beats per minute heart rate can decline',
        passageParaphrase: 'decline to ≈ slows dramatically to fewer than three'
      }
    ]
  },

  // 13. Matching Information
  {
    id: 'practice-matchinfo-01',
    title: 'Matching Information: Urban Heat Island Mitigation Strategies',
    questionType: 'matching-information',
    passageTitle: 'Cooling High-Density Urban Environments',
    topic: 'Civil Engineering & Urban Climatology',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph A',
        text: 'Dense urban centers experience ambient temperatures up to 5°C higher than peripheral rural zones due to dark asphalt and concrete thermal mass absorbing solar radiation.'
      },
      {
        label: 'Paragraph B',
        text: 'High-albedo pavements coated with reflective titanium dioxide reflect up to 70% of incident sunlight, preventing road surfaces from retaining heat.'
      },
      {
        label: 'Paragraph C',
        text: 'Urban tree canopies deliver cooling primarily via evapotranspiration, converting liquid water from foliage into vapor and absorbing sensible heat from surrounding air.'
      }
    ],
    questions: [
      {
        id: 'minfo-q1',
        number: 1,
        type: 'matching-information',
        prompt: 'Which paragraph explains how solar radiation is reflected by specialized road coatings?',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C'],
        correctAnswer: 'Paragraph B',
        explanation: 'Paragraph B describes titanium dioxide coatings reflecting up to 70% of sunlight.',
        explanationVi: 'Đoạn B mô tả lớp phủ titanium dioxide giúp phản chiếu 70% ánh sáng mặt trời.',
        paragraphReference: 'Paragraph B',
        evidenceSnippet: 'High-albedo pavements coated with reflective titanium dioxide reflect up to 70% of incident sunlight',
        questionKeywords: 'reflected by specialized road coatings',
        passageParaphrase: 'specialized road coatings ≈ high-albedo pavements coated with titanium dioxide'
      },
      {
        id: 'minfo-q2',
        number: 2,
        type: 'matching-information',
        prompt: 'Which paragraph details the biological mechanism through which vegetation cools surrounding air?',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C'],
        correctAnswer: 'Paragraph C',
        explanation: 'Paragraph C outlines evapotranspiration in urban tree canopies.',
        explanationVi: 'Đoạn C giải thích cơ chế thoát hơi nước của tán cây giúp làm mát không khí xung quanh.',
        paragraphReference: 'Paragraph C',
        evidenceSnippet: 'Urban tree canopies deliver cooling primarily via evapotranspiration',
        questionKeywords: 'biological mechanism through which vegetation cools',
        passageParaphrase: 'biological mechanism ≈ evapotranspiration converting water into vapor'
      }
    ]
  },

  // 14. Matching Sentence Endings
  {
    id: 'practice-sentend-01',
    title: 'Matching Sentence Endings: Autonomous Vehicle Navigation',
    questionType: 'matching-sentence-endings',
    passageTitle: 'LiDAR and Computer Vision in Self-Driving Cars',
    topic: 'Artificial Intelligence & Robotics',
    difficulty: 'medium',
    estimatedBand: 'Band 6.0 - 7.0',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    content: [
      {
        label: 'Paragraph 1',
        text: 'LiDAR sensors emit millions of laser pulses per second to generate high-resolution three-dimensional point clouds of the surrounding environment, allowing vehicles to detect static obstacles in complete darkness.'
      },
      {
        label: 'Paragraph 2',
        text: 'Optical camera arrays, by contrast, excel at deciphering color-coded road signs and traffic lights that lack geometric depth, compensating for LiDAR’s inability to read chromatic data.'
      }
    ],
    questions: [
      {
        id: 'send-q1',
        number: 1,
        type: 'matching-sentence-endings',
        prompt: 'LiDAR sensors utilize pulsing laser beams to...',
        options: [
          'A. construct comprehensive 3D models of surroundings even without ambient light.',
          'B. interpret the color nuances of regulatory traffic signals.',
          'C. reduce the total computational power needed by onboard neural networks.'
        ],
        correctAnswer: 'A. construct comprehensive 3D models of surroundings even without ambient light.',
        explanation: 'Paragraph 1: LiDAR pulses "generate high-resolution three-dimensional point clouds... in complete darkness."',
        explanationVi: 'Đoạn 1 nêu LiDAR phát tia laser để tạo mô hình đám mây điểm 3D kể cả trong bóng tối hoàn toàn.',
        paragraphReference: 'Paragraph 1',
        evidenceSnippet: 'generate high-resolution three-dimensional point clouds of the surrounding environment, allowing vehicles to detect static obstacles in complete darkness.',
        questionKeywords: 'LiDAR sensors utilize laser beams to',
        passageParaphrase: 'construct comprehensive 3D models in darkness ≈ generate 3D point clouds in complete darkness'
      },
      {
        id: 'send-q2',
        number: 2,
        type: 'matching-sentence-endings',
        prompt: 'Optical camera systems are essential because they...',
        options: [
          'A. construct comprehensive 3D models of surroundings even without ambient light.',
          'B. interpret chromatic cues such as color-coded traffic signs and signals.',
          'C. eliminate the vehicle’s reliance on satellite GPS positioning.'
        ],
        correctAnswer: 'B. interpret chromatic cues such as color-coded traffic signs and signals.',
        explanation: 'Paragraph 2 notes cameras "excel at deciphering color-coded road signs and traffic lights".',
        explanationVi: 'Đoạn 2 khẳng định camera quang học phát huy tối đa tác dụng trong việc đọc các biển báo và đèn giao thông có màu sắc.',
        paragraphReference: 'Paragraph 2',
        evidenceSnippet: 'excel at deciphering color-coded road signs and traffic lights that lack geometric depth',
        questionKeywords: 'camera systems essential because they',
        passageParaphrase: 'interpret chromatic cues ≈ deciphering color-coded road signs'
      }
    ]
  }
];
