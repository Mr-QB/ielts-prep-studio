import { VocabCard, VocabDeck, ParaphraseItem } from '../types';

export const INITIAL_VOCAB_DECKS: VocabDeck[] = [
  // 1. CORE BAND 4.0 -> 5.5 (DEFAULT STARTER)
  {
    id: 'core-band-4-5',
    name: 'Core Vocabulary (Band 4.0 → 5.5)',
    description: 'Từ vựng cốt lõi, tần suất xuất hiện cao nhất trong bài thi IELTS Reading và Writing. Phù hợp cho người học xây dựng nền móng.',
    createdAt: '2026-09-23',
    source: 'Cambridge Academic Vocabulary Taxonomy',
    cards: [
      {
        id: 'v-core-1',
        word: 'increase',
        phonetic: '/ɪnˈkriːs/',
        partOfSpeech: 'verb',
        definitionVi: 'tăng lên, làm cho tăng',
        definitionEn: 'to become larger in amount or number',
        example: 'The number of university graduates increased significantly last year.',
        exampleVi: 'Số lượng sinh viên tốt nghiệp đại học đã tăng đáng kể vào năm ngoái.',
        collocations: ['increase significantly', 'a steady increase', 'increase in price'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-2',
        word: 'decrease',
        phonetic: '/dɪˈkriːs/',
        partOfSpeech: 'verb',
        definitionVi: 'giảm xuống, hạ bớt',
        definitionEn: 'to become less or smaller',
        example: 'The consumption of fossil fuels decreased after the new policy.',
        exampleVi: 'Mức tiêu thụ nhiên liệu hóa thạch đã giảm sau khi có chính sách mới.',
        collocations: ['decrease sharply', 'a dramatic decrease', 'decrease by 20%'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-3',
        word: 'solution',
        phonetic: '/səˈluː.ʃən/',
        partOfSpeech: 'noun',
        definitionVi: 'giải pháp, cách giải quyết',
        definitionEn: 'a way of solving a problem or dealing with a difficult situation',
        example: 'Investing in public transit is an effective solution to traffic jams.',
        exampleVi: 'Đầu tư vào giao thông công cộng là một giải pháp hiệu quả cho nạn kẹt xe.',
        collocations: ['practical solution', 'find a solution', 'long-term solution'],
        category: 'Society & Problems',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-4',
        word: 'improve',
        phonetic: '/ɪmˈpruːv/',
        partOfSpeech: 'verb',
        definitionVi: 'cải thiện, nâng cao chất lượng',
        definitionEn: 'to make something better or become better',
        example: 'Regular reading helps learners improve their vocabulary and grammar.',
        exampleVi: 'Đọc sách thường xuyên giúp người học cải thiện vốn từ vựng và ngữ pháp.',
        collocations: ['improve performance', 'dramatically improve', 'improve the quality'],
        category: 'Education & Progress',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-5',
        word: 'reduce',
        phonetic: '/rɪˈdʒuːs/',
        partOfSpeech: 'verb',
        definitionVi: 'cắt giảm, giảm bớt',
        definitionEn: 'to make something smaller in size, amount, or importance',
        example: 'Cycling to work helps reduce urban air pollution and noise.',
        exampleVi: 'Đi xe đạp đi làm giúp giảm thiểu ô nhiễm không khí và tiếng ồn đô thị.',
        collocations: ['reduce emissions', 'reduce the risk of', 'greatly reduce'],
        category: 'Environment',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-6',
        word: 'significant',
        phonetic: '/sɪɡˈnɪf.ɪ.kənt/',
        partOfSpeech: 'adjective',
        definitionVi: 'đáng kể, quan trọng',
        definitionEn: 'important or large enough to be noticeable',
        example: 'There was a significant difference between the two student groups.',
        exampleVi: 'Đã có một sự khác biệt đáng kể giữa hai nhóm học sinh.',
        collocations: ['significant increase', 'significant difference', 'significant impact'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-7',
        word: 'benefit',
        phonetic: '/ˈben.ɪ.fɪt/',
        partOfSpeech: 'noun',
        definitionVi: 'lợi ích, điều có lợi',
        definitionEn: 'a helpful or good effect, or something intended to help',
        example: 'One major benefit of online learning is flexibility in study hours.',
        exampleVi: 'Một lợi ích lớn của học trực tuyến là sự linh hoạt về giờ giấc học tập.',
        collocations: ['major benefit', 'reap the benefits', 'economic benefit'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-8',
        word: 'environment',
        phonetic: '/ɪnˈvaɪ.rən.mənt/',
        partOfSpeech: 'noun',
        definitionVi: 'môi trường sống tự nhiên',
        definitionEn: 'the air, water, and land in or on which people, animals, and plants live',
        example: 'Governments should enforce stricter laws to protect the natural environment.',
        exampleVi: 'Các chính phủ nên thực thi luật nghiêm ngặt hơn để bảo vệ môi trường tự nhiên.',
        collocations: ['protect the environment', 'environmental damage', 'natural environment'],
        category: 'Environment',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-9',
        word: 'cause',
        phonetic: '/kɔːz/',
        partOfSpeech: 'verb',
        definitionVi: 'gây ra, là nguyên nhân của',
        definitionEn: 'to make something happen, especially something bad',
        example: 'Deforestation causes severe soil erosion and biodiversity loss.',
        exampleVi: 'Chặt phá rừng gây ra xói mòn đất nghiêm trọng và mất đa dạng sinh học.',
        collocations: ['cause damage', 'cause pollution', 'root cause'],
        category: 'Cause & Effect',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-10',
        word: 'likely',
        phonetic: '/ˈlaɪ.kli/',
        partOfSpeech: 'adjective',
        definitionVi: 'có khả năng xảy ra, rất có thể',
        definitionEn: 'probable or expected to happen',
        example: 'Students who study consistently are more likely to achieve higher band scores.',
        exampleVi: 'Những học sinh học tập đều đặn có nhiều khả năng đạt band điểm cao hơn.',
        collocations: ['more likely to', 'highly likely', 'it is likely that'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      }
    ]
  },

  // 2. IELTS CORE (Band 5.5 -> 6.5)
  {
    id: 'starter-academic-core',
    name: 'IELTS Core (Band 5.5 → 6.5)',
    description: 'Từ vựng học thuật trung cấp dành cho bài đọc Passage 2 và bài viết Task 2.',
    createdAt: '2026-09-22',
    source: 'Cambridge Academic Vocabulary Taxonomy',
    cards: [
      {
        id: 'v-acad-1',
        word: 'proliferation',
        phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
        partOfSpeech: 'noun',
        definitionVi: 'sự tăng nhanh, sự sinh sôi nảy nở nhanh chóng',
        definitionEn: 'rapid increase in the number or amount of something',
        example: 'The proliferation of digital mobile devices has reshaped traditional study habits.',
        exampleVi: 'Sự gia tăng nhanh chóng của các thiết bị kỹ thuật số đã định hình lại thói quen học tập truyền thống.',
        collocations: ['rapid proliferation', 'proliferation of technology'],
        category: 'Technology & Progress',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-2',
        word: 'mitigate',
        phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
        partOfSpeech: 'verb',
        definitionVi: 'giảm nhẹ, làm dịu bớt (tác hại, rủi ro)',
        definitionEn: 'make something bad less severe, serious, or painful',
        example: 'Subsidizing public mass transit can mitigate vehicular carbon emissions in urban centers.',
        exampleVi: 'Trợ cấp giao thông công cộng có thể làm giảm bớt lượng khí thải carbon từ xe cơ giới tại các trung tâm đô thị.',
        collocations: ['mitigate risks', 'mitigate the impact', 'mitigate climate change'],
        category: 'Environment & Resources',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-3',
        word: 'deplete',
        phonetic: '/dɪˈpliːt/',
        partOfSpeech: 'verb',
        definitionVi: 'làm cạn kiệt, làm suy giảm nghiêm trọng',
        definitionEn: 'use up the supply or resources of something',
        example: 'Overexploitation of deep-water fisheries risks depleting regional marine biodiversity.',
        exampleVi: 'Việc khai thác quá mức các ngư trường nước sâu có nguy cơ làm cạn kiệt đa dạng sinh học biển của khu vực.',
        collocations: ['deplete resources', 'deplete energy reserves', 'severely depleted'],
        category: 'Environment & Agriculture',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-4',
        word: 'unprecedented',
        phonetic: '/ʌnˈpres.ɪ.den.tɪd/',
        partOfSpeech: 'adjective',
        definitionVi: 'chưa từng có tiền lệ, chưa từng thấy trước đây',
        definitionEn: 'never having happened or existed in the past',
        example: 'The international economy witnessed an unprecedented surge in digital consumer transactions.',
        exampleVi: 'Nền kinh tế quốc tế đã chứng kiến một sự bùng nổ chưa từng có trong các giao dịch tiêu dùng kỹ thuật số.',
        collocations: ['unprecedented scale', 'unprecedented challenge', 'unprecedented surge'],
        category: 'Economy & Society',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      }
    ]
  }
];

export interface TopicVocabulary {
  id: string;
  name: string;
  nameVi: string;
  coreWords: string[];
  usefulVerbs: string[];
  usefulAdjectives: string[];
  collocations: string[];
  paraphrases: { word: string; alternatives: string[] }[];
  exampleSentence: string;
}

export const VOCAB_TOPICS_DATA: TopicVocabulary[] = [
  {
    id: 'education',
    name: 'Education',
    nameVi: 'Giáo Dục',
    coreWords: ['curriculum', 'literacy', 'pedagogy', 'assessment', 'discipline', 'qualification'],
    usefulVerbs: ['acquire (knowledge)', 'cultivate (skills)', 'facilitate', 'assess', 'standardize'],
    usefulAdjectives: ['compulsory', 'academic', 'vocational', 'holistic', 'rigorous'],
    collocations: ['higher education', 'academic performance', 'curriculum reform', 'distance learning'],
    paraphrases: [
      { word: 'students', alternatives: ['pupils', 'learners', 'undergraduates', 'schoolchildren'] },
      { word: 'teach', alternatives: ['instruct', 'educate', 'impart knowledge to', 'train'] }
    ],
    exampleSentence: 'A well-rounded curriculum cultivates critical thinking skills rather than rote memorization.'
  },
  {
    id: 'environment',
    name: 'Environment',
    nameVi: 'Môi Trường',
    coreWords: ['biodiversity', 'emissions', 'conservation', 'habitat', 'deforestation', 'pollutant'],
    usefulVerbs: ['mitigate', 'deplete', 'contaminate', 'preserve', 'deteriorate'],
    usefulAdjectives: ['sustainable', 'hazardous', 'renewable', 'ecological', 'catastrophic'],
    collocations: ['carbon footprint', 'renewable energy', 'climate change', 'waste disposal'],
    paraphrases: [
      { word: 'pollution', alternatives: ['contamination', 'environmental degradation', 'toxic emissions'] },
      { word: 'protect', alternatives: ['conserve', 'preserve', 'safeguard', 'shield'] }
    ],
    exampleSentence: 'Governments must introduce stringent policies to preserve endangered marine habitats.'
  },
  {
    id: 'technology',
    name: 'Technology',
    nameVi: 'Công Nghệ',
    coreWords: ['automation', 'algorithm', 'telecommunication', 'innovation', 'artificial intelligence'],
    usefulVerbs: ['revolutionize', 'streamline', 'facilitate', 'disrupt', 'integrate'],
    usefulAdjectives: ['automated', 'indispensable', 'cutting-edge', 'obsolete', 'digital'],
    collocations: ['technological breakthrough', 'automated systems', 'digital divide', 'user-friendly interface'],
    paraphrases: [
      { word: 'devices', alternatives: ['gadgets', 'appliances', 'electronic equipment'] },
      { word: 'modern', alternatives: ['cutting-edge', 'state-of-the-art', 'contemporary', 'advanced'] }
    ],
    exampleSentence: 'Artificial intelligence is revolutionizing data processing and administrative tasks.'
  },
  {
    id: 'health',
    name: 'Health',
    nameVi: 'Sức Khỏe',
    coreWords: ['nutrition', 'sedentary lifestyle', 'longevity', 'epidemic', 'well-being'],
    usefulVerbs: ['alleviate', 'boost (immunity)', 'deteriorate', 'combat', 'prevent'],
    usefulAdjectives: ['chronic', 'nutritious', 'preventive', 'mental', 'sedentary'],
    collocations: ['sedentary lifestyle', 'balanced diet', 'mental well-being', 'healthcare expenditure'],
    paraphrases: [
      { word: 'exercise', alternatives: ['physical activity', 'bodily exertion', 'working out'] },
      { word: 'sick', alternatives: ['unwell', 'afflicted with disease', 'suffering from illness'] }
    ],
    exampleSentence: 'Regular physical activity and a balanced diet significantly reduce the risk of chronic diseases.'
  },
  {
    id: 'work',
    name: 'Work & Employment',
    nameVi: 'Công Việc & Việc Làm',
    coreWords: ['occupation', 'remuneration', 'productivity', 'job satisfaction', 'freelancer'],
    usefulVerbs: ['collaborate', 'delegate', 'negotiate', 'dismiss', 'promote'],
    usefulAdjectives: ['lucrative', 'demanding', 'flexible', 'monotonous', 'temporary'],
    collocations: ['work-life balance', 'career advancement', 'minimum wage', 'flexible hours'],
    paraphrases: [
      { word: 'job', alternatives: ['occupation', 'profession', 'career', 'employment'] },
      { word: 'salary', alternatives: ['remuneration', 'income', 'wages', 'earnings'] }
    ],
    exampleSentence: 'Achieving a healthy work-life balance is crucial for sustaining long-term productivity.'
  }
];

export const TOPIC_VOCABULARIES = VOCAB_TOPICS_DATA;

export const PARAPHRASE_BANK: ParaphraseItem[] = [
  {
    id: 'para-1',
    word: 'increase',
    meaningVi: 'tăng lên',
    category: 'trend',
    synonyms: [
      { word: 'rise', nuance: 'tự tăng, dùng cho cả Task 1 & 2', example: 'Sales rose steadily over five years.' },
      { word: 'grow', nuance: 'phát triển tăng trưởng', example: 'The population grew rapidly.' },
      { word: 'climb', nuance: 'leo lên mức cao hơn', example: 'Temperatures climbed to 38 degrees.' },
      { word: 'escalate', nuance: 'leo thang (thường mang nghĩa tiêu cực)', example: 'Tensions escalated between both groups.' }
    ]
  },
  {
    id: 'para-2',
    word: 'decrease',
    meaningVi: 'giảm xuống',
    category: 'trend',
    synonyms: [
      { word: 'fall', nuance: 'giảm sút phổ biến', example: 'Expenditure fell by 15%.' },
      { word: 'drop', nuance: 'rơi xuống nhanh', example: 'The rate dropped abruptly.' },
      { word: 'decline', nuance: 'suy giảm từ từ, trang trọng', example: 'The number of visitors declined steadily.' },
      { word: 'plummet', nuance: 'lao dốc rất mạnh', example: 'Oil prices plummeted during the crisis.' }
    ]
  },
  {
    id: 'para-3',
    word: 'important',
    meaningVi: 'quan trọng',
    category: 'importance',
    synonyms: [
      { word: 'significant', nuance: 'đáng kể, có tầm ảnh hưởng lớn', example: 'It played a significant role in modern history.' },
      { word: 'crucial', nuance: 'cực kỳ then chốt, mang tính quyết định', example: 'Early intervention is crucial for recovery.' },
      { word: 'vital', nuance: 'thiết yếu cho sự tồn tại hoặc thành công', example: 'Clean water is vital for public health.' },
      { word: 'essential', nuance: 'cần thiết cơ bản không thể thiếu', example: 'Teamwork is essential in this profession.' }
    ]
  },
  {
    id: 'para-4',
    word: 'cause',
    meaningVi: 'gây ra / nguyên nhân',
    category: 'cause-effect',
    synonyms: [
      { word: 'lead to', nuance: 'dẫn đến kết quả gì', example: 'Careless driving leads to road accidents.' },
      { word: 'result in', nuance: 'mang lại kết cục', example: 'The policy resulted in severe inflation.' },
      { word: 'bring about', nuance: 'đem lại sự thay đổi', example: 'Technology brought about major shifts in society.' },
      { word: 'trigger', nuance: 'châm ngòi, kích hoạt phản ứng', example: 'Pollution can trigger respiratory attacks.' }
    ]
  },
  {
    id: 'para-5',
    word: 'problem',
    meaningVi: 'vấn đề, khó khăn',
    category: 'problem-solution',
    synonyms: [
      { word: 'issue', nuance: 'vấn đề cần bàn luận, trung tính', example: 'Plastic waste is a pressing global issue.' },
      { word: 'obstacle', nuance: 'chướng ngại vật cản trở', example: 'High tariffs remain a major obstacle to trade.' },
      { word: 'dilemma', nuance: 'tình huống khó xử, tiến thoái lưỡng nan', example: 'Parents face a dilemma between career and childcare.' },
      { word: 'challenge', nuance: 'thử thách cần vượt qua', example: 'Aging populations pose a serious challenge for pensions.' }
    ]
  }
];
