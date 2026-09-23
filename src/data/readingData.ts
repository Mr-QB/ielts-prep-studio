import { LearningSource, ReadingPassage, ReadingFullTest, ReadingPracticeSet, ReadingFoundationSet } from '../types';

export const READING_SOURCES: LearningSource[] = [
  {
    id: 'src-official-academic-reading',
    provider: 'Official IELTS',
    title: 'Official IELTS Academic Reading Practice Tests',
    sourceType: 'official',
    testType: 'academic',
    canonicalSourceUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    isOfficial: true,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'verified',
    description: 'Tuyển tập đề thi mẫu học thuật chuẩn 40 câu hỏi từ IELTS.org và Cambridge Academic. Phân tích chi tiết dẫn chứng, từ khóa và paraphrase.'
  },
  {
    id: 'src-academic-practice-sets',
    provider: 'IELTS-style Practice',
    title: 'IELTS Academic Question Type Mastery Sets',
    sourceType: 'practice',
    testType: 'academic',
    isOfficial: false,
    isUserProvided: false,
    status: 'verified',
    description: 'Bộ luyện tập phân loại theo 14 dạng câu hỏi cốt lõi của IELTS Academic Reading với giải thích tiếng Việt và cặp từ đồng nghĩa paraphrase.'
  },
  {
    id: 'src-cam12-gt-legacy',
    provider: 'Cambridge Local Reference',
    title: 'Cambridge IELTS 12 General Training (Legacy Reference)',
    sourceType: 'user-reference',
    testType: 'general-training',
    isOfficial: false,
    isUserProvided: true,
    status: 'needs-review',
    description: 'Tài liệu General Training từ sách Cambridge 12 của người học. Đã chuyển vào mục tham khảo, không thuộc lộ trình IELTS Academic mặc định.'
  }
];

// ============================================================================
// FULL TEST 1: ACADEMIC READING TEST 1 (PASSAGES 1, 2, 3 -> 40 QUESTIONS)
// ============================================================================

export const FULL_TEST_1_PASSAGE_1: ReadingPassage = {
  id: 'ft1-p1-marie-curie',
  sourceId: 'src-official-academic-reading',
  passageNumber: 1,
  title: 'The Life and Work of Marie Curie',
  subtitle: 'From impoverished student to pioneering two-time Nobel laureate in Physics and Chemistry',
  topic: 'History of Science & Biographical Studies',
  wordCount: 850,
  difficulty: 'easy',
  estimatedBand: 'Band 4.5 - 6.0',
  testType: 'academic',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  canonicalUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
  content: [
    {
      label: 'A',
      text: 'Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Warsaw, Poland, on 7 November 1867, she was the youngest of five children of poor schoolteachers. From childhood she was remarkable for her prodigious memory, and at the age of sixteen won a gold medal on completion of her secondary education. Because her father lost his savings through bad investments, she then had to take work as a teacher. From her earnings she was able to finance her sister Bronia’s medical studies in Paris, on the understanding that Bronia would, in turn, later help her to get an education.'
    },
    {
      label: 'B',
      text: 'In 1891, this promise was fulfilled and Marie went to Paris and began to study at the Sorbonne. She often worked far into the night and lived on little more than bread, butter and tea. In 1893, she took first place in the licence of physical sciences and in 1894, having received the licence of mathematical sciences, she secured second place. It was in 1894 that she met Pierre Curie, Professor of the School of Physics, and in the following year they were married. Here began a scientific partnership that was soon to achieve world-wide results.'
    },
    {
      label: 'C',
      text: 'Following the discovery of radioactivity by Henri Becquerel in 1896, Marie decided to look into the rays emitted by uranium as a possible field of research for a doctoral thesis. She discovered that the mineral pitchblende had a far superior radioactivity to pure uranium and deduced that it must contain other, hitherto unknown, radioactive substances. Turning to chemical analysis, Pierre joined her in the search, and in 1898 they discovered two new radioactive elements: polonium, named after Marie’s native Poland, and radium.'
    },
    {
      label: 'D',
      text: 'The birth of Marie’s two daughters, Irene and Eve, in 1897 and 1904, did not interrupt her scientific research. In 1903, Marie and Pierre Curie were awarded the Davy Medal of the Royal Society and, combined with Henri Becquerel, were awarded the Nobel Prize for Physics. The bitter sorrow of Pierre Curie’s sudden death in a street accident in 1906 was a tragic turning point in her life. She succeeded him as Head of the Physics Laboratory at the Sorbonne and became the first woman to hold a professorship there.'
    },
    {
      label: 'E',
      text: 'In 1911, Marie received the Nobel Prize for Chemistry for the isolation of pure radium, making her the sole winner of two Nobel Prizes in different scientific fields. During the First World War, with the help of her daughter Irene, she devoted herself to the development of mobile X-ray units, known colloquially as ‘petites Curies’, which diagnosed battle injuries for wounded soldiers on the front lines.'
    },
    {
      label: 'F',
      text: 'Although she contributed immensely to medical science, her continuous exposure to ionizing radiation throughout decades of experimentation took a fatal toll. On 4 July 1934, Marie Curie passed away from aplastic anemia in Haute-Savoie, France. Her legacy endures as a supreme testament to scientific dedication and perseverance.'
    }
  ],
  questionTypes: ['true-false-notgiven', 'summary-completion', 'sentence-completion'],
  questions: [
    {
      id: 'ft1-q01',
      number: 1,
      type: 'true-false-notgiven',
      prompt: 'Marie Curie’s husband was a joint winner of both of Marie’s Nobel Prizes.',
      correctAnswer: 'FALSE',
      explanation: 'Paragraph D notes Pierre shared the 1903 Nobel Prize, but Paragraph E explicitly clarifies Marie was the sole winner of the 1911 prize in Chemistry.',
      explanationVi: 'Đoạn D nêu Pierre cùng nhận giải năm 1903, nhưng Đoạn E khẳng định năm 1911 Marie là người duy nhất (sole winner) nhận giải Nobel Hóa học.',
      paragraphReference: 'Paragraph D & E',
      evidenceSnippet: 'Marie received the Nobel Prize for Chemistry for the isolation of pure radium, making her the sole winner of two Nobel Prizes in different scientific fields.',
      questionKeywords: 'husband was a joint winner of both Nobel Prizes',
      passageParaphrase: 'sole winner of two Nobel Prizes (người duy nhất đạt 2 giải)',
      targetVocab: [
        { word: 'sole', definitionVi: 'duy nhất, đơn độc', contextSentence: 'making her the sole winner of two Nobel Prizes' }
      ]
    },
    {
      id: 'ft1-q02',
      number: 2,
      type: 'true-false-notgiven',
      prompt: 'Marie became interested in science when she was a child.',
      correctAnswer: 'NOT GIVEN',
      explanation: 'Paragraph A mentions her prodigious memory and gold medal at sixteen, but does not state when her interest in science began.',
      explanationVi: 'Đoạn A nhắc đến trí nhớ phi thường và huy chương vàng lúc 16 tuổi, nhưng không hề đề cập niềm yêu thích khoa học bắt đầu từ độ tuổi nào.',
      paragraphReference: 'Paragraph A',
      evidenceSnippet: 'From childhood she was remarkable for her prodigious memory, and at the age of sixteen won a gold medal on completion of her secondary education.',
      questionKeywords: 'interested in science when she was a child',
      passageParaphrase: 'Không có thông tin về thời điểm bắt đầu quan tâm đến khoa học.',
      targetVocab: [
        { word: 'prodigious', definitionVi: 'phi thường, to lớn kỳ diệu', contextSentence: 'remarkable for her prodigious memory' }
      ]
    },
    {
      id: 'ft1-q03',
      number: 3,
      type: 'true-false-notgiven',
      prompt: 'Marie was able to attend the Sorbonne because of her sister’s financial contribution.',
      correctAnswer: 'NOT GIVEN',
      explanation: 'Paragraph A mentions an agreement that Bronia would later help her, but Paragraph B does not confirm that Bronia’s money paid for Sorbonne fees.',
      explanationVi: 'Đoạn A nêu thỏa thuận Bronia sẽ giúp lại Marie sau này, nhưng Đoạn B không xác nhận rõ số tiền học tại Sorbonne có phải do Bronia chu cấp hay không.',
      paragraphReference: 'Paragraph A & B',
      evidenceSnippet: 'on the understanding that Bronia would, in turn, later help her to get an education.',
      questionKeywords: 'attend Sorbonne because of sister financial contribution',
      passageParaphrase: 'Chỉ nêu thỏa thuận chung, không xác nhận nguồn tiền thực tế khi nhập học.'
    },
    {
      id: 'ft1-q04',
      number: 4,
      type: 'true-false-notgiven',
      prompt: 'Marie Curie stopped her experimental work temporarily after giving birth to her children.',
      correctAnswer: 'FALSE',
      explanation: 'Paragraph D explicitly states: "The birth of Marie’s two daughters, Irene and Eve, in 1897 and 1904, did not interrupt her work."',
      explanationVi: 'Đoạn D khẳng định việc sinh 2 con gái không hề làm gián đoạn (did not interrupt) công việc nghiên cứu của bà.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'The birth of Marie’s two daughters, Irene and Eve, in 1897 and 1904, did not interrupt her scientific research.',
      questionKeywords: 'stopped her experimental work temporarily',
      passageParaphrase: 'stopped temporarily ≠ did not interrupt her scientific research'
    },
    {
      id: 'ft1-q05',
      number: 5,
      type: 'true-false-notgiven',
      prompt: 'Marie Curie took over Pierre Curie’s teaching role at the Sorbonne after his death.',
      correctAnswer: 'TRUE',
      explanation: 'Paragraph D explains she succeeded him as Head of Physics Laboratory and became the first woman to hold a professorship there.',
      explanationVi: 'Đoạn D xác nhận bà kế nhiệm vị trí của chồng (succeeded him) và trở thành nữ giáo sư đầu tiên tại Sorbonne.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'She succeeded him as Head of the Physics Laboratory at the Sorbonne and became the first woman to hold a professorship there.',
      questionKeywords: 'took over Pierre’s teaching role after his death',
      passageParaphrase: 'took over ≈ succeeded him as Head of Laboratory and held a professorship'
    },
    {
      id: 'ft1-q06',
      number: 6,
      type: 'true-false-notgiven',
      prompt: 'Marie Curie’s mobile X-ray units were widely used by front-line military doctors during the First World War.',
      correctAnswer: 'TRUE',
      explanation: 'Paragraph E states she devoted herself to developing mobile X-ray units which diagnosed battle injuries on the front lines.',
      explanationVi: 'Đoạn E nêu rõ các xe chụp X-quang lưu động được dùng để chẩn đoán thương tích cho thương binh ngoài tiền tuyến.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'she devoted herself to the development of mobile X-ray units, known colloquially as ‘petites Curies’, which diagnosed battle injuries for wounded soldiers on the front lines.',
      questionKeywords: 'mobile X-ray units widely used during First World War',
      passageParaphrase: 'widely used on front lines ≈ diagnosed battle injuries for wounded soldiers on the front lines'
    },
    {
      id: 'ft1-q07',
      number: 7,
      type: 'summary-completion',
      prompt: 'Marie discovered that the mineral [ 7 ] possessed radioactivity far superior to pure uranium.',
      correctAnswer: 'pitchblende',
      acceptableAnswers: ['pitchblende mineral'],
      explanation: 'Paragraph C: "She discovered that the mineral pitchblende had a far superior radioactivity to pure uranium..."',
      explanationVi: 'Đoạn C: "Bà phát hiện ra khoáng vật pitchblende có tính phóng xạ vượt trội hơn uranium nguyên chất..."',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'She discovered that the mineral pitchblende had a far superior radioactivity to pure uranium',
      questionKeywords: 'mineral possessed radioactivity far superior to uranium',
      passageParaphrase: 'possessed radioactivity far superior ≈ had a far superior radioactivity',
      targetVocab: [
        { word: 'superior', definitionVi: 'vượt trội hơn, ưu việt hơn', contextSentence: 'had a far superior radioactivity to pure uranium' }
      ]
    },
    {
      id: 'ft1-q08',
      number: 8,
      type: 'summary-completion',
      prompt: 'The element [ 8 ] was given its scientific name in honor of Marie Curie’s native country.',
      correctAnswer: 'polonium',
      explanation: 'Paragraph C states polonium was "named after Marie’s native Poland".',
      explanationVi: 'Đoạn C nêu nguyên tố polonium được đặt tên theo quê hương Ba Lan của bà (Poland).',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'polonium, named after Marie’s native Poland, and radium.',
      questionKeywords: 'scientific name in honor of native country',
      passageParaphrase: 'in honor of native country ≈ named after Marie’s native Poland'
    },
    {
      id: 'ft1-q09',
      number: 9,
      type: 'summary-completion',
      prompt: 'Pierre Curie tragically died in a [ 9 ] in 1906.',
      correctAnswer: 'street accident',
      acceptableAnswers: ['traffic accident', 'accident'],
      explanation: 'Paragraph D notes Pierre Curie’s sudden death "in a street accident in 1906".',
      explanationVi: 'Đoạn D nêu Pierre qua đời đột ngột trong một vụ tai nạn đường phố năm 1906.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'The bitter sorrow of Pierre Curie’s sudden death in a street accident in 1906 was a tragic turning point in her life.',
      questionKeywords: 'Pierre Curie tragically died in a [ 9 ]',
      passageParaphrase: 'tragically died ≈ sudden death in a street accident'
    },
    {
      id: 'ft1-q10',
      number: 10,
      type: 'summary-completion',
      prompt: 'Marie was awarded the 1911 Nobel Prize in Chemistry for the [ 10 ] of pure radium.',
      correctAnswer: 'isolation',
      acceptableAnswers: ['successful isolation'],
      explanation: 'Paragraph E specifies the prize was "for the isolation of pure radium".',
      explanationVi: 'Đoạn E nêu giải Nobel Hóa học 1911 được trao cho thành tựu cô lập chất phóng xạ radium nguyên chất (isolation of pure radium).',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'In 1911, Marie received the Nobel Prize for Chemistry for the isolation of pure radium',
      questionKeywords: 'Nobel Prize in Chemistry for the [ 10 ] of pure radium',
      passageParaphrase: 'awarded for the [ 10 ] ≈ received Nobel Prize for the isolation'
    },
    {
      id: 'ft1-q11',
      number: 11,
      type: 'sentence-completion',
      prompt: 'Marie Curie’s mobile radiological vehicles were affectionately nicknamed [ 11 ].',
      correctAnswer: 'petites Curies',
      acceptableAnswers: ['petites curies', "'petites Curies'"],
      explanation: 'Paragraph E notes they were "known colloquially as ‘petites Curies’".',
      explanationVi: 'Đoạn E giải thích các xe X-quang được gọi thân mật là ‘petites Curies’.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'known colloquially as ‘petites Curies’',
      questionKeywords: 'affectionately nicknamed',
      passageParaphrase: 'affectionately nicknamed ≈ known colloquially as'
    },
    {
      id: 'ft1-q12',
      number: 12,
      type: 'sentence-completion',
      prompt: 'The medical condition that ultimately claimed Marie Curie’s life was [ 12 ].',
      correctAnswer: 'aplastic anemia',
      acceptableAnswers: ['aplastic anaemia'],
      explanation: 'Paragraph F states she passed away from "aplastic anemia" due to radiation exposure.',
      explanationVi: 'Đoạn F khẳng định bà qua đời do căn bệnh thiếu máu bất sản (aplastic anemia).',
      paragraphReference: 'Paragraph F',
      evidenceSnippet: 'passed away from aplastic anemia in Haute-Savoie, France.',
      questionKeywords: 'medical condition that claimed her life',
      passageParaphrase: 'claimed her life ≈ passed away from aplastic anemia'
    },
    {
      id: 'ft1-q13',
      number: 13,
      type: 'sentence-completion',
      prompt: 'Curie’s lethal illness was triggered by her decades of prolonged exposure to [ 13 ].',
      correctAnswer: 'ionizing radiation',
      acceptableAnswers: ['radiation'],
      explanation: 'Paragraph F confirms her continuous exposure to "ionizing radiation" throughout experimentation caused her death.',
      explanationVi: 'Đoạn F chỉ rõ việc tiếp xúc liên tục với bức xạ ion hóa (ionizing radiation) trong nhiều thập kỷ là nguyên nhân gây bệnh.',
      paragraphReference: 'Paragraph F',
      evidenceSnippet: 'her continuous exposure to ionizing radiation throughout decades of experimentation took a fatal toll.',
      questionKeywords: 'prolonged exposure to [ 13 ]',
      passageParaphrase: 'prolonged exposure ≈ continuous exposure to ionizing radiation'
    }
  ]
};

export const FULL_TEST_1_PASSAGE_2: ReadingPassage = {
  id: 'ft1-p2-dung-beetles',
  sourceId: 'src-official-academic-reading',
  passageNumber: 2,
  title: 'Dung Beetles in Australia',
  subtitle: 'The ecological dilemma and biological solution to pastoral waste management',
  topic: 'Environmental Biology & Ecology',
  wordCount: 880,
  difficulty: 'medium',
  estimatedBand: 'Band 5.5 - 7.0',
  testType: 'academic',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  content: [
    {
      label: 'A',
      text: 'Introducing cattle to Australia created an unprecedented ecological catastrophe. Australia’s indigenous dung beetles had evolved over millions of years to feed exclusively on the dry, compact, fibrous dung pellets of native marsupials such as kangaroos. When millions of European cattle and sheep were introduced in the 18th and 19th centuries, the native beetles were biologically incapable of processing the enormous, wet, sloppy cow pats.'
    },
    {
      label: 'B',
      text: 'The environmental fallout was disastrous. Tens of millions of tons of unburied cow dung accumulated across pastoral landscapes every year. The dung smothered rich pasture grasses, removing approximately 2.5 million hectares of productive grazing land annually. Even worse, the untreated dung pats served as ideal breeding incubators for astronomical swarms of bush flies and biting buffalo flies, which pestered livestock and human populations alike.'
    },
    {
      label: 'C',
      text: 'To resolve this burgeoning crisis, entomologist Dr. George Bornemissza of the CSIRO proposed a revolutionary biological control initiative in the early 1960s: the Australian Dung Beetle Project. His team embarked on extensive worldwide expeditions to locate exotic dung beetle species that had naturally co-evolved with large ungulates in southern Europe, Africa, and Asia.'
    },
    {
      label: 'D',
      text: 'Between 1968 and 1982, the project imported 55 species of dung beetles into quarantine facilities in Canberra. Strict biological protocols were observed: beetle eggs were sterilized with formalin solution to ensure no pathogenic livestock parasites or viruses accompanied them into the ecosystem. Ultimately, 43 species were successfully bred and released across varied Australian climatic zones.'
    },
    {
      label: 'E',
      text: 'The introduced beetles transformed the landscape. Dung beetles bury cow dung deep subterraneanly to feed their larvae. This excavating action rapidly clears pasture grass, aerates compacted soils, improves water infiltration during torrential rains, and recycles vital nitrogen and phosphorus back to root systems. Most importantly, by burying dung within 24 to 48 hours, the beetles annihilated up to 80% of the fly breeding reservoirs.'
    },
    {
      label: 'F',
      text: 'Despite the project’s historic success, seasonal gaps remain in specific southern regions where Mediterranean beetles enter winter dormancy. Scientists continue monitoring beetle dispersal patterns, ensuring that ecological balance between livestock agriculture and soil vitality is permanently maintained.'
    }
  ],
  questionTypes: ['matching-headings', 'true-false-notgiven', 'multiple-choice'],
  questions: [
    {
      id: 'ft1-q14',
      number: 14,
      type: 'matching-headings',
      prompt: 'Which paragraph describes the initial environmental crisis caused by introduced livestock?',
      options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
      correctAnswer: 'Paragraph B',
      explanation: 'Paragraph B details the accumulation of dung, pasture smothering, and the explosion of the fly population.',
      explanationVi: 'Đoạn B mô tả trực tiếp các hậu quả môi trường thảm khốc: đất chăn thả bị vùi lấp và sự sinh sôi ồ ạt của ruồi trâu.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'The environmental fallout was disastrous. Tens of millions of tons of unburied cow dung accumulated across pastoral landscapes every year.',
      questionKeywords: 'environmental crisis caused by livestock',
      passageParaphrase: 'environmental fallout was disastrous ≈ environmental crisis'
    },
    {
      id: 'ft1-q15',
      number: 15,
      type: 'matching-headings',
      prompt: 'Which paragraph outlines the scientific proposal and search for overseas beetle species?',
      options: ['Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
      correctAnswer: 'Paragraph C',
      explanation: 'Paragraph C introduces Dr. George Bornemissza’s plan to find beetles in Europe, Africa, and Asia.',
      explanationVi: 'Đoạn C đề cập đề xuất khoa học của TS. George Bornemissza và các chuyến khảo sát tìm bọ cánh cứng ở châu Âu, châu Phi.',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'Dr. George Bornemissza of the CSIRO proposed a revolutionary biological control initiative in the early 1960s',
      questionKeywords: 'scientific proposal and search for overseas species',
      passageParaphrase: 'proposed a biological control initiative and embarked on worldwide expeditions'
    },
    {
      id: 'ft1-q16',
      number: 16,
      type: 'matching-headings',
      prompt: 'Which paragraph explains the quarantine procedures and sterilization of imported eggs?',
      options: ['Paragraph C', 'Paragraph D', 'Paragraph E', 'Paragraph F'],
      correctAnswer: 'Paragraph D',
      explanation: 'Paragraph D details how eggs were sterilized with formalin solution inside quarantine facilities.',
      explanationVi: 'Đoạn D mô tả chi tiết quy trình kiểm dịch (quarantine) và khử trùng trứng bọ bằng dung dịch formalin.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'beetle eggs were sterilized with formalin solution to ensure no pathogenic livestock parasites or viruses accompanied them',
      questionKeywords: 'quarantine procedures and sterilization of eggs',
      passageParaphrase: 'quarantine facilities and eggs sterilized with formalin'
    },
    {
      id: 'ft1-q17',
      number: 17,
      type: 'matching-headings',
      prompt: 'Which paragraph highlights the multifaceted agricultural and soil benefits of dung burial?',
      options: ['Paragraph C', 'Paragraph D', 'Paragraph E', 'Paragraph F'],
      correctAnswer: 'Paragraph E',
      explanation: 'Paragraph E outlines soil aeration, water infiltration, nutrient recycling, and fly reduction.',
      explanationVi: 'Đoạn E làm rõ các lợi ích nông nghiệp to lớn: cải tạo đất, tái tạo chất dinh dưỡng và tiêu diệt 80% ấu trùng ruồi.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'aerates compacted soils, improves water infiltration during torrential rains, and recycles vital nitrogen and phosphorus',
      questionKeywords: 'multifaceted agricultural and soil benefits',
      passageParaphrase: 'aerates soils, improves infiltration, recycles nutrients'
    },
    {
      id: 'ft1-q18',
      number: 18,
      type: 'matching-headings',
      prompt: 'Which paragraph notes the ongoing seasonal challenges in certain southern districts?',
      options: ['Paragraph C', 'Paragraph D', 'Paragraph E', 'Paragraph F'],
      correctAnswer: 'Paragraph F',
      explanation: 'Paragraph F discusses seasonal gaps when beetles enter winter dormancy in southern regions.',
      explanationVi: 'Đoạn F nhắc đến thách thức hiện nay khi bọ ngủ đông vào mùa lạnh ở các vùng miền nam.',
      paragraphReference: 'Paragraph F',
      evidenceSnippet: 'seasonal gaps remain in specific southern regions where Mediterranean beetles enter winter dormancy.',
      questionKeywords: 'ongoing seasonal challenges in southern districts',
      passageParaphrase: 'seasonal gaps remain in specific southern regions'
    },
    {
      id: 'ft1-q19',
      number: 19,
      type: 'true-false-notgiven',
      prompt: 'Australia’s native dung beetles were able to consume cow dung after an initial adaptation period.',
      correctAnswer: 'FALSE',
      explanation: 'Paragraph A confirms native beetles evolved exclusively for marsupial pellets and were biologically incapable of processing wet cow dung.',
      explanationVi: 'Đoạn A khẳng định bọ bản địa về mặt sinh học không thể xử lý phân bò ướt (biologically incapable).',
      paragraphReference: 'Paragraph A',
      evidenceSnippet: 'the native beetles were biologically incapable of processing the enormous, wet, sloppy cow pats.',
      questionKeywords: 'native beetles able to consume cow dung after adaptation',
      passageParaphrase: 'able to consume after adaptation ≠ biologically incapable of processing'
    },
    {
      id: 'ft1-q20',
      number: 20,
      type: 'true-false-notgiven',
      prompt: 'Bush flies and buffalo flies bred prolifically within unburied cow pats.',
      correctAnswer: 'TRUE',
      explanation: 'Paragraph B states the dung pats served as ideal breeding incubators for astronomical swarms of flies.',
      explanationVi: 'Đoạn B xác nhận các bãi phân bò chưa được chôn lấp là nơi ấp trứng lý tưởng cho đàn ruồi khổng lồ sinh sôi.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'the untreated dung pats served as ideal breeding incubators for astronomical swarms of bush flies and biting buffalo flies',
      questionKeywords: 'flies bred prolifically within unburied pats',
      passageParaphrase: 'bred prolifically ≈ ideal breeding incubators for astronomical swarms'
    },
    {
      id: 'ft1-q21',
      number: 21,
      type: 'true-false-notgiven',
      prompt: 'Dr. George Bornemissza personally funded the expeditions across Europe and Africa.',
      correctAnswer: 'NOT GIVEN',
      explanation: 'Paragraph C mentions Dr. Bornemissza of the CSIRO proposed the initiative, but does not state who paid for the expeditions.',
      explanationVi: 'Đoạn C nhắc tới sáng kiến của TS. Bornemissza tại CSIRO nhưng không hề đề cập nguồn kinh phí cá nhân hay nhà nước tài trợ.',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'His team embarked on extensive worldwide expeditions to locate exotic dung beetle species',
      questionKeywords: 'personally funded the expeditions',
      passageParaphrase: 'Không có thông tin về nguồn tài chính cá nhân.'
    },
    {
      id: 'ft1-q22',
      number: 22,
      type: 'true-false-notgiven',
      prompt: 'Chemical insecticides were the primary tool used alongside beetles to exterminate bush flies.',
      correctAnswer: 'NOT GIVEN',
      explanation: 'The passage discusses biological control using beetles, but makes no mention of whether chemical insecticides were used.',
      explanationVi: 'Bài đọc chỉ tập trung vào giải pháp kiểm soát sinh học bằng bọ cánh cứng, không nói gì về việc dùng thuốc trừ sâu hóa học.',
      paragraphReference: 'Paragraph D & E',
      evidenceSnippet: 'the beetles annihilated up to 80% of the fly breeding reservoirs.',
      questionKeywords: 'chemical insecticides primary tool alongside beetles',
      passageParaphrase: 'Không có thông tin về thuốc trừ sâu hóa học.'
    },
    {
      id: 'ft1-q23',
      number: 23,
      type: 'true-false-notgiven',
      prompt: 'Formalin solution was utilized during quarantine to decontaminate beetle eggs before release.',
      correctAnswer: 'TRUE',
      explanation: 'Paragraph D verifies beetle eggs were sterilized with formalin solution to prevent parasite transmission.',
      explanationVi: 'Đoạn D xác nhận trứng bọ được khử trùng bằng formalin để ngăn chặn mầm bệnh ký sinh trùng lây lan.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'beetle eggs were sterilized with formalin solution to ensure no pathogenic livestock parasites or viruses accompanied them',
      questionKeywords: 'formalin solution utilized to decontaminate eggs',
      passageParaphrase: 'decontaminate eggs ≈ sterilized with formalin solution'
    },
    {
      id: 'ft1-q24',
      number: 24,
      type: 'multiple-choice',
      prompt: 'How much productive grazing land was rendered unusable each year prior to the beetle project?',
      options: ['55 million hectares', '2.5 million hectares', '43 thousand hectares', '80% of pastoral land'],
      correctAnswer: '2.5 million hectares',
      explanation: 'Paragraph B explicitly states the dung smothered pasture, removing approximately 2.5 million hectares annually.',
      explanationVi: 'Đoạn B nêu rõ lượng phân chưa chôn lấp làm mất khoảng 2.5 triệu hecta đất đồng cỏ mỗi năm.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'removing approximately 2.5 million hectares of productive grazing land annually.',
      questionKeywords: 'grazing land rendered unusable each year',
      passageParaphrase: 'rendered unusable ≈ removing productive grazing land'
    },
    {
      id: 'ft1-q25',
      number: 25,
      type: 'multiple-choice',
      prompt: 'What proportion of fly breeding sites was eliminated by the burrowing activity of introduced beetles?',
      options: ['Nearly 25%', 'Exactly 50%', 'Up to 80%', 'Over 95%'],
      correctAnswer: 'Up to 80%',
      explanation: 'Paragraph E states beetles "annihilated up to 80% of the fly breeding reservoirs."',
      explanationVi: 'Đoạn E khẳng định bọ cánh cứng chôn lấp phân đã triệt tiêu tới 80% nơi sinh sản của ruồi.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'the beetles annihilated up to 80% of the fly breeding reservoirs.',
      questionKeywords: 'proportion of fly breeding sites eliminated',
      passageParaphrase: 'eliminated ≈ annihilated up to 80%'
    },
    {
      id: 'ft1-q26',
      number: 26,
      type: 'multiple-choice',
      prompt: 'What primary reason explains why some southern areas in Australia still experience seasonal dung issues?',
      options: [
        'Native predators consume all beetle larvae.',
        'Imported Mediterranean beetle species enter winter dormancy.',
        'Frequent bushfires destroy subterranean nests.',
        'Formalin sterilization weakened the beetles’ genetic strength.'
      ],
      correctAnswer: 'Imported Mediterranean beetle species enter winter dormancy.',
      explanation: 'Paragraph F states seasonal gaps remain because Mediterranean beetles enter winter dormancy in colder southern months.',
      explanationVi: 'Đoạn F giải thích các loài bọ Địa Trung Hải bước vào trạng thái ngủ đông khi trời lạnh nên hiệu quả giảm theo mùa.',
      paragraphReference: 'Paragraph F',
      evidenceSnippet: 'seasonal gaps remain in specific southern regions where Mediterranean beetles enter winter dormancy.',
      questionKeywords: 'primary reason why southern areas experience seasonal issues',
      passageParaphrase: 'seasonal issues ≈ seasonal gaps where beetles enter winter dormancy'
    }
  ]
};

export const FULL_TEST_1_PASSAGE_3: ReadingPassage = {
  id: 'ft1-p3-ant-specimens',
  sourceId: 'src-official-academic-reading',
  passageNumber: 3,
  title: 'Collecting and Classifying Ant Specimens',
  subtitle: 'Methodologies and ecological insights into ground-dwelling insect biodiversity',
  topic: 'Entomological Field Research & Taxonomy',
  wordCount: 920,
  difficulty: 'hard',
  estimatedBand: 'Band 6.5 - 8.5',
  testType: 'academic',
  createdFrom: 'official',
  copyrightStatus: 'fair-use-educational',
  verificationStatus: 'verified',
  content: [
    {
      label: 'A',
      text: 'Ants are ubiquitous components of terrestrial ecosystems, accounting for an estimated 15 to 20% of total terrestrial animal biomass. Because of their remarkable sensitivity to microclimatic variations, habitat degradation, and soil disturbance, ants serve as primary bioindicators in ecological monitoring programs. Rigorous field surveys necessitate standardized sampling methodologies capable of capturing diverse behavioral guilds.'
    },
    {
      label: 'B',
      text: 'The most universally employed sampling technique is pitfall trapping. A plastic container is excavated into the substrate so that its rim rests perfectly flush with the ground surface. Preservative liquid—commonly propylene glycol or dilute ethanol with a detergent surfactant to break surface tension—is deposited inside. Foraging worker ants traverse the lip and tumble into the fluid. While exceptional for collecting nocturnal and fast-running surface dwellers, pitfall traps are inherently biased: they disproportionately sample active foraging species while failing to capture sedentary or subterranean ants.'
    },
    {
      label: 'C',
      text: 'To access the cryptic fauna residing inside decaying forest leaf litter, researchers employ Winkler extractors. Leaf litter is sifted through coarse wire mesh to concentrate small arthropods and fine debris. This concentrated organic matter is then transferred into a suspended canvas cylinder containing internal mesh bags. As the leaf litter dries gradually under ambient temperatures over a 48-to-72-hour period, moisture-seeking ants migrate downward and drop through a funnel into a collection vial. This passive extraction yield provides superior qualitative diversity of diminutive, litter-dwelling taxa.'
    },
    {
      label: 'D',
      text: 'Direct hand collecting remains an indispensable adjunct to passive trapping methods. Armed with fine forceps and an aspirator (an oral suction device equipped with an in-line particulate filter), an experienced entomologist systematically inspects rotting logs, overturns subterranean stones, and investigates tree canopies. Hand searching facilitates direct observation of colonial social structures, nesting architectures, and rare specialized queen castes that never wander into pitfall traps.'
    },
    {
      label: 'E',
      text: 'Post-collection preservation and specimen preparation demand meticulous curatorial discipline. Collected ants must be stored in 95% ethanol for molecular sequencing or mounted on fine stainless steel pins or archival cardboard points for morphological examination. Each specimen must possess an indelible label detailing GPS coordinates, elevation, collection date, microhabitat characteristics, and collector identification. Without standardized taxonomic metadata, a physical specimen possesses negligible scientific value.'
    }
  ],
  questionTypes: ['yes-no-notgiven', 'summary-completion', 'multiple-choice'],
  questions: [
    {
      id: 'ft1-q27',
      number: 27,
      type: 'yes-no-notgiven',
      prompt: 'Ant populations are capable of providing reliable indications of environmental ecological health.',
      correctAnswer: 'YES',
      explanation: 'Paragraph A confirms ants serve as primary bioindicators in ecological monitoring due to their sensitivity to soil and climate changes.',
      explanationVi: 'Đoạn A khẳng định kiến đóng vai trò là loài chỉ thị sinh học chính (primary bioindicators) để đánh giá sức khỏe sinh thái.',
      paragraphReference: 'Paragraph A',
      evidenceSnippet: 'Because of their remarkable sensitivity to microclimatic variations, habitat degradation, and soil disturbance, ants serve as primary bioindicators in ecological monitoring programs.',
      questionKeywords: 'reliable indications of environmental health',
      passageParaphrase: 'reliable indications ≈ primary bioindicators in ecological monitoring'
    },
    {
      id: 'ft1-q28',
      number: 28,
      type: 'yes-no-notgiven',
      prompt: 'Pitfall traps provide an unbiased, fully representative sample of all ant species in a given habitat.',
      correctAnswer: 'NO',
      explanation: 'Paragraph B explicitly states pitfall traps are inherently biased because they favor active surface foragers over subterranean species.',
      explanationVi: 'Đoạn B khẳng định bẫy hố có tính thiên vị cố hữu (inherently biased), chỉ bắt được loài di chuyển nhanh mà bỏ sót loài dưới lòng đất.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'While exceptional for collecting nocturnal and fast-running surface dwellers, pitfall traps are inherently biased',
      questionKeywords: 'pitfall traps provide unbiased representative sample',
      passageParaphrase: 'unbiased representative sample ≠ inherently biased'
    },
    {
      id: 'ft1-q29',
      number: 29,
      type: 'yes-no-notgiven',
      prompt: 'Detergent is incorporated into pitfall trap fluid to eliminate surface tension.',
      correctAnswer: 'YES',
      explanation: 'Paragraph B explains detergent surfactant is added "to break surface tension", preventing ants from walking on top of the liquid.',
      explanationVi: 'Đoạn B giải thích chất tẩy rửa/xà phòng được pha vào dung dịch nhằm phá vỡ sức căng bề mặt để kiến chìm xuống.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'detergent surfactant to break surface tension—is deposited inside.',
      questionKeywords: 'detergent incorporated to eliminate surface tension',
      passageParaphrase: 'eliminate surface tension ≈ break surface tension'
    },
    {
      id: 'ft1-q30',
      number: 30,
      type: 'yes-no-notgiven',
      prompt: 'Winkler extractors require artificial electric heat lamps to dry out forest leaf litter.',
      correctAnswer: 'NO',
      explanation: 'Paragraph C specifies leaf litter dries "gradually under ambient temperatures", not via artificial heat lamps.',
      explanationVi: 'Đoạn C nêu rõ mẫu lá khô dần dưới nhiệt độ tự nhiên của môi trường (ambient temperatures), không dùng đèn sưởi nhân tạo.',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'As the leaf litter dries gradually under ambient temperatures over a 48-to-72-hour period',
      questionKeywords: 'require artificial electric heat lamps',
      passageParaphrase: 'artificial heat lamps ≠ dries gradually under ambient temperatures'
    },
    {
      id: 'ft1-q31',
      number: 31,
      type: 'yes-no-notgiven',
      prompt: 'An aspirator tool includes a protective component to prevent researchers from inhaling dust or particles.',
      correctAnswer: 'YES',
      explanation: 'Paragraph D notes the aspirator is equipped with an "in-line particulate filter".',
      explanationVi: 'Đoạn D xác nhận ống hút aspirator có gắn màng lọc hạt (in-line particulate filter) bảo vệ miệng và đường hô hấp.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'an aspirator (an oral suction device equipped with an in-line particulate filter)',
      questionKeywords: 'protective component to prevent inhaling dust',
      passageParaphrase: 'protective component ≈ in-line particulate filter'
    },
    {
      id: 'ft1-q32',
      number: 32,
      type: 'yes-no-notgiven',
      prompt: 'Molecular genetic sequencing of ants can be accomplished using dried specimens preserved on cardboard points.',
      correctAnswer: 'NO',
      explanation: 'Paragraph E clarifies specimens must be stored in 95% ethanol for molecular sequencing, whereas cardboard points are for morphological inspection.',
      explanationVi: 'Đoạn E nêu rõ mẫu dùng để giải trình tự ADN phân tử phải ngâm cồn 95%, còn dán lên bìa cứng (cardboard points) chỉ để quan sát hình thái bên ngoài.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'Collected ants must be stored in 95% ethanol for molecular sequencing or mounted on fine stainless steel pins or archival cardboard points for morphological examination.',
      questionKeywords: 'molecular sequencing accomplished using cardboard points',
      passageParaphrase: 'ethanol for molecular sequencing vs cardboard points for morphological examination'
    },
    {
      id: 'ft1-q33',
      number: 33,
      type: 'summary-completion',
      prompt: 'The rim of a pitfall trap must sit completely [ 33 ] with the surrounding soil.',
      correctAnswer: 'flush',
      acceptableAnswers: ['flush with the ground'],
      explanation: 'Paragraph B states the trap is placed so that "its rim rests perfectly flush with the ground surface."',
      explanationVi: 'Đoạn B nêu miệng hũ bẫy phải được đặt phẳng ngang bằng (flush) với mặt đất.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'its rim rests perfectly flush with the ground surface.',
      questionKeywords: 'rim must sit completely [ 33 ] with the soil',
      passageParaphrase: 'sit completely [ 33 ] with ≈ rests perfectly flush with'
    },
    {
      id: 'ft1-q34',
      number: 34,
      type: 'summary-completion',
      prompt: 'Winkler extractors are particularly effective at capturing the [ 34 ] ant species living in forest litter.',
      correctAnswer: 'cryptic',
      acceptableAnswers: ['cryptic fauna', 'diminutive'],
      explanation: 'Paragraph C: "To access the cryptic fauna residing inside decaying forest leaf litter, researchers employ Winkler extractors."',
      explanationVi: 'Đoạn C giải thích thiết bị Winkler giúp thu thập các loài động vật ẩn sinh (cryptic fauna) trong thảm lá mục.',
      paragraphReference: 'Paragraph C',
      evidenceSnippet: 'To access the cryptic fauna residing inside decaying forest leaf litter, researchers employ Winkler extractors.',
      questionKeywords: 'effective at capturing the [ 34 ] species',
      passageParaphrase: 'access the cryptic fauna ≈ capturing cryptic species'
    },
    {
      id: 'ft1-q35',
      number: 35,
      type: 'summary-completion',
      prompt: 'During hand sampling, biologists utilize [ 35 ] to grasp delicate insects without inflicting physical trauma.',
      correctAnswer: 'forceps',
      acceptableAnswers: ['fine forceps'],
      explanation: 'Paragraph D: "Armed with fine forceps and an aspirator... an experienced entomologist systematically inspects..."',
      explanationVi: 'Đoạn D nêu nhà nghiên cứu dùng nhíp gắp đầu mảnh (fine forceps) để thu thập mẫu vật cẩn thận.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'Armed with fine forceps and an aspirator',
      questionKeywords: 'utilize [ 35 ] to grasp delicate insects',
      passageParaphrase: 'Armed with fine forceps to collect specimens'
    },
    {
      id: 'ft1-q36',
      number: 36,
      type: 'summary-completion',
      prompt: 'Preserving ant specimens for DNA molecular extraction requires immersion in [ 36 ] percent ethanol.',
      correctAnswer: '95',
      acceptableAnswers: ['95%', 'ninety-five'],
      explanation: 'Paragraph E states ants "must be stored in 95% ethanol for molecular sequencing".',
      explanationVi: 'Đoạn E khẳng định việc bảo quản mẫu cho giải mã ADN đòi hỏi nồng độ cồn 95%.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'Collected ants must be stored in 95% ethanol for molecular sequencing',
      questionKeywords: 'molecular extraction requires immersion in [ 36 ] percent ethanol',
      passageParaphrase: 'immersion in [ 36 ] percent ethanol ≈ stored in 95% ethanol'
    },
    {
      id: 'ft1-q37',
      number: 37,
      type: 'multiple-choice',
      prompt: 'Why are ants considered exceptionally valuable bioindicators for environmental monitoring?',
      options: [
        'They represent the only insect group present on every continent.',
        'They are highly sensitive to microscopic changes in soil, climate, and habitat quality.',
        'They reproduce faster than any other terrestrial invertebrate.',
        'Their subterranean tunnels provide irrigation channels for agriculture.'
      ],
      correctAnswer: 'They are highly sensitive to microscopic changes in soil, climate, and habitat quality.',
      explanation: 'Paragraph A highlights their "remarkable sensitivity to microclimatic variations, habitat degradation, and soil disturbance".',
      explanationVi: 'Đoạn A chỉ ra tính nhạy cảm đặc biệt của loài kiến trước những thay đổi vi khí hậu và suy thoái môi trường sống.',
      paragraphReference: 'Paragraph A',
      evidenceSnippet: 'Because of their remarkable sensitivity to microclimatic variations, habitat degradation, and soil disturbance, ants serve as primary bioindicators',
      questionKeywords: 'why considered valuable bioindicators',
      passageParaphrase: 'valuable bioindicators ≈ primary bioindicators due to remarkable sensitivity'
    },
    {
      id: 'ft1-q38',
      number: 38,
      type: 'multiple-choice',
      prompt: 'What constitutes the fundamental scientific limitation of pitfall trapping?',
      options: [
        'The chemical preservatives contaminate groundwater reserves.',
        'Traps frequently flood during standard rainfall events.',
        'They over-sample active surface foragers while overlooking sedentary or underground ants.',
        'Plastic containers degrade too quickly under intense tropical sunlight.'
      ],
      correctAnswer: 'They over-sample active surface foragers while overlooking sedentary or underground ants.',
      explanation: 'Paragraph B explicitly states pitfall traps disproportionately sample active foraging species while failing to capture sedentary or subterranean ants.',
      explanationVi: 'Đoạn B nêu rõ nhược điểm lớn nhất là bẫy bắt quá nhiều loài bò nhanh trên mặt đất mà bỏ quên loài sống yên một chỗ hoặc dưới sâu.',
      paragraphReference: 'Paragraph B',
      evidenceSnippet: 'they disproportionately sample active foraging species while failing to capture sedentary or subterranean ants.',
      questionKeywords: 'fundamental scientific limitation of pitfall trapping',
      passageParaphrase: 'limitation ≈ inherently biased: disproportionately sample active foragers while failing to capture sedentary ants'
    },
    {
      id: 'ft1-q39',
      number: 39,
      type: 'multiple-choice',
      prompt: 'Which sampling method allows researchers to observe ant colony social structure and reproductive castes directly?',
      options: [
        'Propylene glycol pitfall traps',
        'Suspended Winkler canvas extractors',
        'Active direct hand collecting',
        'Aerial light traps'
      ],
      correctAnswer: 'Active direct hand collecting',
      explanation: 'Paragraph D confirms hand searching facilitates direct observation of colonial social structures and rare specialized queen castes.',
      explanationVi: 'Đoạn D khẳng định phương pháp tìm kiếm thủ công trực tiếp cho phép quan sát cấu trúc tổ và các kiến chúa hiếm gặp.',
      paragraphReference: 'Paragraph D',
      evidenceSnippet: 'Hand searching facilitates direct observation of colonial social structures, nesting architectures, and rare specialized queen castes',
      questionKeywords: 'observe colony social structure directly',
      passageParaphrase: 'observe colony social structure ≈ facilitates direct observation of colonial social structures'
    },
    {
      id: 'ft1-q40',
      number: 40,
      type: 'multiple-choice',
      prompt: 'According to the passage, an ant specimen lacks scientific validity if it:',
      options: [
        'Is mounted on archival paper rather than metal pins.',
        'Lacks comprehensive geographic and ecological metadata on its label.',
        'Has been preserved in ethanol for more than one year.',
        'Was collected during daylight hours rather than at night.'
      ],
      correctAnswer: 'Lacks comprehensive geographic and ecological metadata on its label.',
      explanation: 'Paragraph E states that without standardized taxonomic metadata (GPS, date, habitat), a physical specimen possesses negligible scientific value.',
      explanationVi: 'Đoạn E nhấn mạnh nếu thiếu nhãn ghi tọa độ GPS, ngày thu thập và đặc điểm môi trường sống, mẫu vật gần như không có giá trị khoa học.',
      paragraphReference: 'Paragraph E',
      evidenceSnippet: 'Without standardized taxonomic metadata, a physical specimen possesses negligible scientific value.',
      questionKeywords: 'specimen lacks scientific validity if',
      passageParaphrase: 'lacks scientific validity ≈ possesses negligible scientific value without standardized metadata'
    }
  ]
};

export const READING_FULL_TESTS: ReadingFullTest[] = [
  {
    id: 'full-test-academic-01',
    title: 'IELTS Academic Reading Full Mock Test 1',
    testNumber: 1,
    sourceId: 'src-official-academic-reading',
    passages: [FULL_TEST_1_PASSAGE_1, FULL_TEST_1_PASSAGE_2, FULL_TEST_1_PASSAGE_3],
    timeLimitMinutes: 60,
    totalQuestions: 40,
    createdFrom: 'official',
    copyrightStatus: 'fair-use-educational',
    description: 'Đề thi Academic Reading chuẩn 60 phút gồm 3 Passages khoa học lịch sử, sinh thái học và phương pháp luận côn trùng học. Tổng cộng 40 câu hỏi chuẩn hóa.'
  }
];

export const READING_PASSAGES: ReadingPassage[] = [
  FULL_TEST_1_PASSAGE_1,
  FULL_TEST_1_PASSAGE_2,
  FULL_TEST_1_PASSAGE_3
];

// ============================================================================
// FOUNDATION MINI SETS (BAND 3.5 -> 4.5)
// Short passages (200-400 words), 5-8 questions, one target skill each
// ============================================================================
export const READING_FOUNDATION_SETS: ReadingFoundationSet[] = [
  {
    id: 'found-read-1',
    title: 'Foundation Set 1: Solar Energy for Everyday Homes',
    targetBand: '3.5-4.5',
    targetSkill: 'Skimming & Scanning for Keywords (True / False / Not Given)',
    wordCount: 260,
    topic: 'Renewable Energy & Daily Life',
    sourceNotice: 'Adapted IELTS Foundation Mini-Set (Band 3.5 - 4.5)',
    passage: [
      {
        label: 'Paragraph A',
        text: 'Solar power is becoming an increasingly popular choice for households around the world. In sunny countries like Spain and Australia, thousands of families now install solar panels on their roofs. These panels convert direct sunlight into clean electrical power, allowing homes to run refrigerators, lights, and computers without producing smoke or air pollution.'
      },
      {
        label: 'Paragraph B',
        text: 'Although the initial cost of buying and installing solar panels remains somewhat expensive for average households, families can recover this investment over four to seven years. Once the panels are paid off, the electricity they produce is almost entirely free. In fact, many utility companies buy back extra power generated by residential panels during summer afternoons.'
      },
      {
        label: 'Paragraph C',
        text: 'However, solar energy does have practical limitations. Solar panels cannot generate electricity at night, and their output decreases substantially during prolonged rainy or cloudy weather. To solve this problem, homeowners increasingly install modern lithium batteries to store excess daytime energy for evening use.'
      }
    ],
    questions: [
      {
        id: 'found-r1-q1',
        number: 1,
        type: 'true-false-notgiven',
        prompt: 'Solar panels generate electricity without causing air contamination.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        explanation: 'Paragraph A khẳng định các tấm pin mặt trời cho phép gia đình chạy các thiết bị "without producing smoke or air pollution".',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'found-r1-q2',
        number: 2,
        type: 'true-false-notgiven',
        prompt: 'Installing rooftop solar panels is free of charge for all families in Spain.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        explanation: 'Paragraph B nêu rõ: "the initial cost of buying and installing solar panels remains somewhat expensive", trái ngược với "free of charge".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r1-q3',
        number: 3,
        type: 'true-false-notgiven',
        prompt: 'Most families usually recover their solar investment within four to seven years.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        explanation: 'Paragraph B khẳng định: "families can recover this investment over four to seven years".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r1-q4',
        number: 4,
        type: 'true-false-notgiven',
        prompt: 'Solar panels in Germany produce more power than those in Australia.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'NOT GIVEN',
        explanation: 'Bài đọc không hề nhắc tới nước Đức (Germany) hay so sánh sản lượng với Australia.',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'found-r1-q5',
        number: 5,
        type: 'true-false-notgiven',
        prompt: 'Solar panels produce the same amount of electricity on cloudy days as on sunny days.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        explanation: 'Paragraph C khẳng định: "their output decreases substantially during prolonged rainy or cloudy weather".',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'found-r1-q6',
        number: 6,
        type: 'true-false-notgiven',
        prompt: 'Batteries are used by some households to store extra solar power for nighttime use.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        explanation: 'Paragraph C khẳng định: "homeowners increasingly install modern lithium batteries to store excess daytime energy for evening use".',
        paragraphReference: 'Paragraph C'
      }
    ]
  },
  {
    id: 'found-read-2',
    title: 'Foundation Set 2: Sleep and Student Cognitive Performance',
    targetBand: '3.5-4.5',
    targetSkill: 'Sentence Completion & Predicting Word Classes',
    wordCount: 285,
    topic: 'Health, Education & Mental Wellbeing',
    sourceNotice: 'Adapted IELTS Foundation Mini-Set (Band 3.5 - 4.5)',
    passage: [
      {
        label: 'Paragraph A',
        text: 'Adequate sleep is vital for young learners and adolescents. While a student sleeps, the brain processes memories from daytime study and stores important facts into long-term memory. Neuroscientists have discovered that students who regularly sleep eight hours per night achieve higher marks in mathematics and language tests than peers who stay up late.'
      },
      {
        label: 'Paragraph B',
        text: 'In contrast, sleep deprivation produces immediate negative consequences. Students who suffer from chronic exhaustion exhibit poor concentration in class and frequently experience mood swings. Furthermore, a lack of deep rest weakens the immune system, making students far more vulnerable to seasonal colds and respiratory infections.'
      },
      {
        label: 'Paragraph C',
        text: 'To improve sleep hygiene, experts recommend establishing a consistent bedtime routine. Teenagers should avoid drinking caffeinated beverages like tea or coffee after 4:00 PM. Most importantly, switching off digital screens thirty minutes prior to sleeping allows the brain to produce melatonin, a natural hormone that triggers deep sleep.'
      }
    ],
    questions: [
      {
        id: 'found-r2-q1',
        number: 1,
        type: 'sentence-completion',
        prompt: 'During sleep, the human brain moves daytime study information into _____ memory. (NO MORE THAN TWO WORDS)',
        correctAnswer: 'long-term',
        acceptableAnswers: ['long term'],
        explanation: 'Paragraph A: "stores important facts into long-term memory".',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'found-r2-q2',
        number: 2,
        type: 'sentence-completion',
        prompt: 'Students who regularly get _____ hours of rest each night tend to score higher exam results. (NO MORE THAN ONE WORD OR NUMBER)',
        correctAnswer: '8',
        acceptableAnswers: ['eight'],
        explanation: 'Paragraph A: "students who regularly sleep eight hours per night achieve higher marks".',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'found-r2-q3',
        number: 3,
        type: 'sentence-completion',
        prompt: 'Exhausted students often display low levels of _____ during daytime lectures. (NO MORE THAN ONE WORD)',
        correctAnswer: 'concentration',
        explanation: 'Paragraph B: "exhibit poor concentration in class".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r2-q4',
        number: 4,
        type: 'sentence-completion',
        prompt: 'Insufficient sleep compromises the body’s _____ system, increasing susceptibility to colds. (NO MORE THAN ONE WORD)',
        correctAnswer: 'immune',
        explanation: 'Paragraph B: "weakens the immune system".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r2-q5',
        number: 5,
        type: 'sentence-completion',
        prompt: 'Medical specialists advise students not to consume _____ drinks late in the afternoon. (NO MORE THAN ONE WORD)',
        correctAnswer: 'caffeinated',
        explanation: 'Paragraph C: "avoid drinking caffeinated beverages".',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'found-r2-q6',
        number: 6,
        type: 'sentence-completion',
        prompt: 'Turning off electronic screens promotes the creation of _____, the hormone responsible for sleep. (NO MORE THAN ONE WORD)',
        correctAnswer: 'melatonin',
        explanation: 'Paragraph C: "allows the brain to produce melatonin, a natural hormone that triggers deep sleep".',
        paragraphReference: 'Paragraph C'
      }
    ]
  },
  {
    id: 'found-read-3',
    title: 'Foundation Set 3: Urban Public Transport Transformations',
    targetBand: '3.5-4.5',
    targetSkill: 'Identifying Factual Information & Multiple Choice',
    wordCount: 310,
    topic: 'Urban Geography & Public Infrastructure',
    sourceNotice: 'Adapted IELTS Foundation Mini-Set (Band 3.5 - 4.5)',
    passage: [
      {
        label: 'Paragraph A',
        text: 'In response to rapid urban population growth and severe highway gridlock, many major cities are investing heavily in rapid transit systems. Modern electric subway networks and dedicated bus rapid transit (BRT) corridors enable commuters to travel across metropolitan centers in a fraction of the time required by private automobiles.'
      },
      {
        label: 'Paragraph B',
        text: 'Aside from speed, environmental advantages are substantial. A single electric train can transport up to one thousand passengers while generating zero tailpipe emissions. Cities that expanded their light rail networks, such as Curitiba in Brazil and Zurich in Switzerland, observed a noticeable improvement in overall urban air quality within five years of system launch.'
      },
      {
        label: 'Paragraph C',
        text: 'Nevertheless, municipal authorities must overcome financial and logistical hurdles when constructing new transit lines. Subterranean tunneling beneath historic city centers requires immense capital budgets and frequently causes temporary disruptions for local street retailers. Consequently, urban planners now favor elevated monorails and bus lanes as faster, more economical alternatives.'
      }
    ],
    questions: [
      {
        id: 'found-r3-q1',
        number: 1,
        type: 'multiple-choice',
        prompt: 'Why are metropolitan authorities investing in rapid transit systems?',
        options: [
          'A. To encourage citizens to buy more private automobiles',
          'B. To address rising populations and severe road congestion',
          'C. To demolish historic buildings in city centers'
        ],
        correctAnswer: 'B. To address rising populations and severe road congestion',
        explanation: 'Paragraph A: "In response to rapid urban population growth and severe highway gridlock...".',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'found-r3-q2',
        number: 2,
        type: 'multiple-choice',
        prompt: 'What environmental benefit did Curitiba and Zurich experience after expanding rail systems?',
        options: [
          'A. Measurable improvements in local air quality',
          'B. A rapid increase in private car ownership',
          'C. Lower rainfall in winter months'
        ],
        correctAnswer: 'A. Measurable improvements in local air quality',
        explanation: 'Paragraph B: "observed a noticeable improvement in overall urban air quality".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r3-q3',
        number: 3,
        type: 'short-answer',
        prompt: 'How many commuters can a single modern electric train carry? (NO MORE THAN THREE WORDS OR A NUMBER)',
        correctAnswer: '1000',
        acceptableAnswers: ['one thousand', '1,000', 'up to 1000'],
        explanation: 'Paragraph B: "A single electric train can transport up to one thousand passengers".',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'found-r3-q4',
        number: 4,
        type: 'true-false-notgiven',
        prompt: 'Underground railway tunneling is inexpensive for city governments.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        explanation: 'Paragraph C khẳng định: "Subterranean tunneling... requires immense capital budgets", tức là vô cùng tốn kém, trái ngược với "inexpensive".',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'found-r3-q5',
        number: 5,
        type: 'true-false-notgiven',
        prompt: 'Tunnel construction can cause temporary problems for street-level shop owners.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        explanation: 'Paragraph C: "frequently causes temporary disruptions for local street retailers".',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'found-r3-q6',
        number: 6,
        type: 'short-answer',
        prompt: 'Which cheaper transit alternative do city planners now frequently prefer? (NO MORE THAN TWO WORDS)',
        correctAnswer: 'elevated monorails',
        acceptableAnswers: ['monorails', 'bus lanes'],
        explanation: 'Paragraph C: "urban planners now favor elevated monorails and bus lanes as faster, more economical alternatives".',
        paragraphReference: 'Paragraph C'
      }
    ]
  }
];
