import { VocabCard, VocabDeck, ParaphraseItem } from '../types';

export const INITIAL_VOCAB_DECKS: VocabDeck[] = [
  // ==========================================
  // 1. CORE BAND 4.0 -> 5.5 (FOUNDATION FIRST)
  // High-frequency functional words from NGSL & IELTS General Foundation
  // ==========================================
  {
    id: 'core-band-4-5',
    name: 'Core Vocabulary (Band 4.0 → 5.5)',
    description: 'Bộ từ vựng nền tảng tần suất cao nhất (NGSL & IELTS Core). Tập trung vào từ chức năng diễn đạt số liệu, nguyên nhân, hệ quả và các chủ đề quen thuộc.',
    createdAt: '2026-09-23',
    source: 'NGSL & IELTS Core High-Frequency Framework',
    cards: [
      {
        id: 'v-core-1',
        word: 'increase',
        phonetic: '/ɪnˈkriːs/',
        partOfSpeech: 'verb / noun',
        definitionVi: 'tăng lên, sự gia tăng',
        definitionEn: 'to become larger in amount or number',
        example: 'The number of university graduates increased significantly last year.',
        exampleVi: 'Số lượng sinh viên tốt nghiệp đại học đã tăng đáng kể vào năm ngoái.',
        sourceContext: 'There was a significant increase in the number of international students.',
        collocations: ['increase significantly', 'a steady increase', 'increase in price', 'sharp increase'],
        paraphrases: ['rise', 'grow', 'climb'],
        category: 'Trend & Changes',
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
        partOfSpeech: 'verb / noun',
        definitionVi: 'giảm xuống, sự sụt giảm',
        definitionEn: 'to become less or smaller in amount or size',
        example: 'The consumption of fossil fuels decreased after the new policy.',
        exampleVi: 'Mức tiêu thụ nhiên liệu hóa thạch đã giảm sau khi có chính sách mới.',
        sourceContext: 'Traffic congestion decreased after the new public transport system opened.',
        collocations: ['decrease sharply', 'a dramatic decrease', 'decrease by 20%', 'gradual decrease'],
        paraphrases: ['fall', 'drop', 'decline'],
        category: 'Trend & Changes',
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
        sourceContext: 'Education is widely seen as the most sustainable solution to poverty.',
        collocations: ['practical solution', 'find a solution to', 'long-term solution', 'viable solution'],
        paraphrases: ['answer', 'remedy', 'resolution'],
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
        sourceContext: 'The government introduced training schemes to improve workers productivity.',
        collocations: ['improve performance', 'dramatically improve', 'improve the quality of'],
        paraphrases: ['enhance', 'upgrade', 'boost'],
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
        definitionVi: 'cắt giảm, làm giảm bớt',
        definitionEn: 'to make something smaller in size, amount, or importance',
        example: 'Cycling to work helps reduce urban air pollution and noise.',
        exampleVi: 'Đi xe đạp đi làm giúp giảm thiểu ô nhiễm không khí và tiếng ồn đô thị.',
        sourceContext: 'Governments should take decisive measures to reduce carbon emissions.',
        collocations: ['reduce emissions', 'reduce the risk of', 'greatly reduce', 'reduce costs'],
        paraphrases: ['cut', 'lower', 'curb'],
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
        sourceContext: 'There was a significant increase in sales over the last decade.',
        collocations: ['significant increase', 'significant difference', 'significant impact', 'play a significant role'],
        paraphrases: ['notable', 'considerable', 'substantial'],
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
        partOfSpeech: 'noun / verb',
        definitionVi: 'lợi ích, mang lại lợi ích',
        definitionEn: 'a helpful or good effect, or something intended to help',
        example: 'One major benefit of online learning is flexibility in study hours.',
        exampleVi: 'Một lợi ích lớn của học trực tuyến là sự linh hoạt về giờ giấc học tập.',
        sourceContext: 'Both employers and employees benefit greatly from flexible working policies.',
        collocations: ['major benefit', 'reap the benefits', 'economic benefit', 'benefit greatly from'],
        paraphrases: ['advantage', 'merit', 'positive aspect'],
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
        definitionVi: 'môi trường sống tự nhiên hoặc nơi làm việc',
        definitionEn: 'the air, water, and land in or on which people, animals, and plants live',
        example: 'Governments should enforce stricter laws to protect the natural environment.',
        exampleVi: 'Các chính phủ nên thực thi luật nghiêm ngặt hơn để bảo vệ môi trường tự nhiên.',
        sourceContext: 'We must act immediately to protect the environment for future generations.',
        collocations: ['protect the environment', 'environmental damage', 'natural environment', 'working environment'],
        paraphrases: ['ecosystem', 'surroundings', 'habitat'],
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
        partOfSpeech: 'verb / noun',
        definitionVi: 'gây ra, là nguyên nhân của',
        definitionEn: 'to make something happen, especially something bad',
        example: 'Deforestation causes severe soil erosion and biodiversity loss.',
        exampleVi: 'Chặt phá rừng gây ra xói mòn đất nghiêm trọng và mất đa dạng sinh học.',
        sourceContext: 'The main cause of urban air pollution is excessive motor vehicle traffic.',
        collocations: ['cause damage', 'cause pollution', 'root cause', 'leading cause of'],
        paraphrases: ['lead to', 'result in', 'bring about'],
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
        sourceContext: 'Without government intervention, housing prices are likely to climb further.',
        collocations: ['more likely to', 'highly likely', 'it is likely that'],
        paraphrases: ['probable', 'expected', 'inclined'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-11',
        word: 'education',
        phonetic: '/ˌed.jʊˈkeɪ.ʃən/',
        partOfSpeech: 'noun',
        definitionVi: 'nền giáo dục, sự học hành',
        definitionEn: 'the process of teaching or learning, especially in a school or college',
        example: 'Higher education equips young people with critical analytical skills.',
        exampleVi: 'Giáo dục đại học trang bị cho người trẻ các kỹ năng phân tích phản biện.',
        sourceContext: 'Equal access to quality education remains a vital public goal.',
        collocations: ['higher education', 'access to education', 'educational system', 'quality education'],
        paraphrases: ['schooling', 'instruction', 'academic training'],
        category: 'Education',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-12',
        word: 'technology',
        phonetic: '/tekˈnɒl.ə.dʒi/',
        partOfSpeech: 'noun',
        definitionVi: 'công nghệ, ứng dụng kỹ thuật',
        definitionEn: 'the application of scientific knowledge for practical purposes',
        example: 'Modern technology has revolutionized how people communicate and work.',
        exampleVi: 'Công nghệ hiện đại đã cách mạng hóa cách con người giao tiếp và làm việc.',
        sourceContext: 'The widespread adoption of digital technology changed learning habits.',
        collocations: ['modern technology', 'technological advances', 'adopt new technology', 'digital technology'],
        paraphrases: ['digital tools', 'innovation', 'engineering'],
        category: 'Technology',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-13',
        word: 'challenge',
        phonetic: '/ˈtʃæl.ɪndʒ/',
        partOfSpeech: 'noun / verb',
        definitionVi: 'thử thách, điều khó khăn cần vượt qua',
        definitionEn: 'something that needs great mental or physical effort to be done successfully',
        example: 'Rapid urbanisation poses serious infrastructure challenges for developing cities.',
        exampleVi: 'Đô thị hóa nhanh chóng đặt ra những thách thức cơ sở hạ tầng nghiêm trọng.',
        sourceContext: 'Overcoming language barriers is a common challenge for international students.',
        collocations: ['face challenges', 'pose a challenge', 'overcome challenges', 'major challenge'],
        paraphrases: ['obstacle', 'difficulty', 'test'],
        category: 'Society & Problems',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-14',
        word: 'trend',
        phonetic: '/trend/',
        partOfSpeech: 'noun',
        definitionVi: 'xu hướng, chiều hướng phát triển',
        definitionEn: 'a general direction in which a situation is changing or developing',
        example: 'There has been an upward trend in remote employment over recent years.',
        exampleVi: 'Đã có một xu hướng đi lên trong việc làm từ xa trong những năm gần đây.',
        sourceContext: 'The chart illustrates a clear downward trend in birth rates.',
        collocations: ['upward trend', 'downward trend', 'growing trend', 'reverse a trend'],
        paraphrases: ['pattern', 'tendency', 'movement'],
        category: 'Trend & Changes',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-core-15',
        word: 'factor',
        phonetic: '/ˈfæk.tər/',
        partOfSpeech: 'noun',
        definitionVi: 'yếu tố, nhân tố ảnh hưởng',
        definitionEn: 'a fact or situation that influences the result of something',
        example: 'Cost is often the deciding factor when families choose holiday destinations.',
        exampleVi: 'Chi phí thường là nhân tố quyết định khi các gia đình lựa chọn điểm đến nghỉ dưỡng.',
        sourceContext: 'Diet and physical exercise are key factors contributing to human longevity.',
        collocations: ['key factor', 'deciding factor', 'contributing factor', 'external factors'],
        paraphrases: ['element', 'determinant', 'component'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      }
    ]
  },

  // ==========================================
  // 2. IELTS CORE (Band 5.5 -> 6.5)
  // Academic & analytical vocabulary for Task 2 and Reading Passage 2
  // ==========================================
  {
    id: 'starter-academic-core',
    name: 'IELTS Core (Band 5.5 → 6.5)',
    description: 'Từ vựng học thuật trung cấp dành cho bài đọc Passage 2 và bài viết Task 2. Tăng cường khả năng lập luận sắc sảo.',
    createdAt: '2026-09-22',
    source: 'Academic Word List (AWL) Sublists 1–4',
    cards: [
      {
        id: 'v-acad-1',
        word: 'mitigate',
        phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
        partOfSpeech: 'verb',
        definitionVi: 'giảm nhẹ, làm dịu bớt (tác hại, rủi ro)',
        definitionEn: 'make something bad less severe, serious, or painful',
        example: 'Subsidizing public mass transit can mitigate vehicular carbon emissions in urban centers.',
        exampleVi: 'Trợ cấp giao thông công cộng có thể làm giảm bớt lượng khí thải carbon từ xe cơ giới.',
        sourceContext: 'Governments should take measures to mitigate the effects of climate change.',
        collocations: ['mitigate risks', 'mitigate the impact', 'mitigate climate change'],
        paraphrases: ['alleviate', 'lessen', 'diminish'],
        category: 'Environment & Policy',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-2',
        word: 'deplete',
        phonetic: '/dɪˈpliːt/',
        partOfSpeech: 'verb',
        definitionVi: 'làm cạn kiệt, làm suy giảm nghiêm trọng',
        definitionEn: 'use up the supply or resources of something',
        example: 'Overexploitation of deep-water fisheries risks depleting regional marine biodiversity.',
        exampleVi: 'Việc khai thác quá mức các ngư trường nước sâu có nguy cơ làm cạn kiệt đa dạng sinh học biển.',
        sourceContext: 'Fossil fuel reserves will be severely depleted if alternative energy sources are ignored.',
        collocations: ['deplete resources', 'deplete energy reserves', 'severely depleted'],
        paraphrases: ['exhaust', 'drain', 'consume entirely'],
        category: 'Environment & Resources',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-3',
        word: 'fluctuate',
        phonetic: '/ˈflʌk.tʃu.eɪt/',
        partOfSpeech: 'verb',
        definitionVi: 'dao động, biến động thất thường',
        definitionEn: 'to change continually; shift back and forth irregularly',
        example: 'Oil prices fluctuated wildly throughout the six-month period shown in the graph.',
        exampleVi: 'Giá dầu biến động dữ dội trong suốt giai đoạn 6 tháng được thể hiện trên biểu đồ.',
        sourceContext: 'The number of overseas tourists fluctuated between 200,000 and 350,000.',
        collocations: ['fluctuate wildly', 'fluctuate between A and B', 'fluctuating trend'],
        paraphrases: ['vary', 'oscillate', 'wave'],
        category: 'Trend & Changes',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-4',
        word: 'subsidize',
        phonetic: '/ˈsʌb.sɪ.daɪz/',
        partOfSpeech: 'verb',
        definitionVi: 'trợ cấp, hỗ trợ tài chính bằng công quỹ',
        definitionEn: 'to pay part of the cost of something',
        example: 'The state should subsidize solar panel installations to accelerate green energy adoption.',
        exampleVi: 'Nhà nước nên trợ cấp việc lắp đặt pin mặt trời để thúc đẩy sử dụng năng lượng xanh.',
        sourceContext: 'Many European nations heavily subsidize public rail transportation.',
        collocations: ['heavily subsidize', 'state-subsidized', 'subsidize public transport'],
        paraphrases: ['fund', 'finance', 'underwrite'],
        category: 'Government & Economics',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-acad-5',
        word: 'counterpart',
        phonetic: '/ˈkaʊn.tə.pɑːt/',
        partOfSpeech: 'noun',
        definitionVi: 'bên đối tác, người/vật tương ứng ở bên kia',
        definitionEn: 'a person or thing holding a corresponding position or function elsewhere',
        example: 'Female workers still earn less than their male counterparts in several legacy sectors.',
        exampleVi: 'Lao động nữ vẫn có thu nhập thấp hơn các đồng nghiệp nam tương đương trong một số ngành truyền thống.',
        sourceContext: 'Students at state schools performed as well as their private school counterparts.',
        collocations: ['male counterparts', 'foreign counterparts', 'their counterparts'],
        paraphrases: ['equivalent', 'peer', 'opposite number'],
        category: 'General Academic',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      }
    ]
  },

  // ==========================================
  // 3. UPGRADE (Band 6.5 -> 7.0+)
  // High-precision academic vocabulary (Moved here per user guideline)
  // ==========================================
  {
    id: 'starter-upgrade-band-7',
    name: 'Upgrade Vocabulary (Band 6.5 → 7.0+)',
    description: 'Từ vựng học thuật nâng cao cho người học hướng tới Band 7.0+. Không học dồn dập, chỉ dùng khi đã nắm vững nền tảng.',
    createdAt: '2026-09-23',
    source: 'Academic Vocabulary Level 7+',
    cards: [
      {
        id: 'v-upg-1',
        word: 'proliferation',
        phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
        partOfSpeech: 'noun',
        definitionVi: 'sự tăng nhanh chóng, sự sinh sôi nảy nở nhanh chóng',
        definitionEn: 'rapid increase in the number or amount of something',
        example: 'The rapid proliferation of digital mobile devices has transformed study habits.',
        exampleVi: 'Sự gia tăng nhanh chóng của các thiết bị kỹ thuật số đã định hình lại thói quen học tập.',
        sourceContext: 'The proliferation of social media platforms has introduced new challenges for privacy.',
        collocations: ['rapid proliferation', 'nuclear proliferation', 'proliferation of devices'],
        paraphrases: ['rapid expansion', 'multiplication', 'rapid spread'],
        category: 'Technology & Progress',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-upg-2',
        word: 'unprecedented',
        phonetic: '/ʌnˈpres.ɪ.den.tɪd/',
        partOfSpeech: 'adjective',
        definitionVi: 'chưa từng có tiền lệ, chưa từng thấy trước đây',
        definitionEn: 'never having happened or existed in the past',
        example: 'The pandemic caused unprecedented disruption to global international tourism.',
        exampleVi: 'Đại dịch gây ra sự gián đoạn chưa từng có đối với du lịch quốc tế toàn cầu.',
        sourceContext: 'Modern cities are expanding at an unprecedented rate.',
        collocations: ['unprecedented growth', 'on an unprecedented scale', 'unprecedented challenge'],
        paraphrases: ['unmatched', 'unparalleled', 'novel'],
        category: 'Society & History',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      },
      {
        id: 'v-upg-3',
        word: 'discrepancy',
        phonetic: '/dɪˈskrep.ən.si/',
        partOfSpeech: 'noun',
        definitionVi: 'sự chênh lệch, sự bất nhất giữa các số liệu',
        definitionEn: 'an unexpected difference between two things that should be the same',
        example: 'There was an unexplained discrepancy between the official survey and audited counts.',
        exampleVi: 'Có sự chênh lệch chưa giải thích được giữa khảo sát chính thức và số liệu kiểm toán.',
        sourceContext: 'Investigators found marked discrepancies in the reported income data.',
        collocations: ['marked discrepancy', 'glaring discrepancy', 'discrepancy between'],
        paraphrases: ['inconsistency', 'divergence', 'variance'],
        category: 'Analysis & Data',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      }
    ]
  }
];

// ==========================================
// TOPIC VOCABULARIES DATA
// ==========================================
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

// ==========================================
// PARAPHRASE BANK WITH DISCRIMINATION EXERCISES (Section 33 & 34)
// Not simple 1:1 synonyms - teaches register, nuance, collocations & usage constraints
// ==========================================
export const PARAPHRASE_BANK: ParaphraseItem[] = [
  {
    id: 'para-1',
    word: 'increase',
    meaningVi: 'tăng lên (xu hướng số liệu hoặc mức độ)',
    category: 'trend',
    synonyms: [
      {
        word: 'rise',
        nuance: 'tự tăng, trung tính, cực kỳ tự nhiên cho xu hướng số liệu Writing Task 1',
        register: 'neutral',
        collocation: 'the number rose steadily',
        example: 'Sales rose steadily over the five-year period.',
        usageNote: 'Dùng như nội động từ (không cần tân ngữ): Sales rose, KHÔNG viết: The company rose sales.'
      },
      {
        word: 'grow',
        nuance: 'tăng trưởng, mở rộng dần theo thời gian (dân số, kinh tế, quy mô)',
        register: 'common',
        collocation: 'the population grew rapidly',
        example: 'The urban population grew rapidly between 2000 and 2020.',
        usageNote: 'Thích hợp khi mô tả sự phát triển tự nhiên của thực thể sống hoặc nền kinh tế.'
      },
      {
        word: 'escalate',
        nuance: 'leo thang, tăng nhanh về mức độ nghiêm trọng hoặc xung đột',
        register: 'formal / intense',
        collocation: 'costs escalated dramatically',
        example: 'Operational costs escalated during the energy crisis.',
        usageNote: 'Thường mang hàm ý tiêu cực hoặc khẩn cấp (xung đột, chi phí leo thang).'
      },
      {
        word: 'climb',
        nuance: 'leo lên mức cao hơn (dùng đa dạng hóa văn phong biểu đồ)',
        register: 'neutral',
        collocation: 'temperatures climbed to 38°C',
        example: 'Temperatures climbed steadily throughout the afternoon.'
      }
    ],
    discriminationExercise: {
      sentence: 'The number of international students ____ from 200 to 350 over the four-year study.',
      options: ['rose', 'escalated', 'lifted', 'exploded'],
      correctAnswer: 'rose',
      explanation: '"rise" là cách diễn đạt chuẩn mực và tự nhiên nhất cho xu hướng số liệu khách quan trong IELTS Writing Task 1. "escalate" chỉ dùng khi căng thẳng hoặc chi phí leo thang tiêu cực.'
    }
  },
  {
    id: 'para-2',
    word: 'decrease',
    meaningVi: 'giảm xuống, hạ bớt',
    category: 'trend',
    synonyms: [
      {
        word: 'fall',
        nuance: 'giảm xuống, thông dụng và tự nhiên nhất',
        register: 'neutral',
        collocation: 'expenditure fell by 15%',
        example: 'Household expenditure on luxury goods fell by 15%.'
      },
      {
        word: 'drop',
        nuance: 'sụt giảm nhanh hoặc đột ngột',
        register: 'common',
        collocation: 'the unemployment rate dropped',
        example: 'The unemployment rate dropped abruptly following the stimulus package.'
      },
      {
        word: 'decline',
        nuance: 'suy giảm từ từ, mang sắc thái học thuật và trang trọng',
        register: 'academic',
        collocation: 'the number of visitors declined steadily',
        example: 'The proportion of manual workers declined steadily over the decade.'
      },
      {
        word: 'plummet',
        nuance: 'lao dốc thẳng đứng với tốc độ cực nhanh',
        register: 'vivid / descriptive',
        collocation: 'shares plummeted to an all-time low',
        example: 'Stock prices plummeted during the market crash.'
      }
    ],
    discriminationExercise: {
      sentence: 'Over the twenty-year observation period, birth rates in European nations steadily ____.',
      options: ['declined', 'plummeted', 'crumbled', 'crashed'],
      correctAnswer: 'declined',
      explanation: '"steadily declined" là collocation học thuật chuẩn xác cho xu hướng suy giảm dần đều qua nhiều năm. "plummet" chỉ sự rơi tự do đột ngột, không đi với "steadily".'
    }
  },
  {
    id: 'para-3',
    word: 'important',
    meaningVi: 'quan trọng, có ý nghĩa lớn',
    category: 'importance',
    synonyms: [
      {
        word: 'significant',
        nuance: 'đáng kể, có tầm ảnh hưởng lớn và dễ nhận thấy',
        register: 'academic',
        collocation: 'play a significant role in',
        example: 'Parental involvement plays a significant role in childhood literacy.'
      },
      {
        word: 'crucial',
        nuance: 'cực kỳ then chốt, quyết định sự thành bại',
        register: 'formal',
        collocation: 'a crucial factor in success',
        example: 'Early medical diagnosis is crucial for long-term recovery.'
      },
      {
        word: 'vital',
        nuance: 'thiết yếu cho sự sống còn hoặc vận hành cơ bản',
        register: 'formal',
        collocation: 'vital for public health',
        example: 'Clean drinking water is vital for community well-being.'
      },
      {
        word: 'essential',
        nuance: 'cần thiết cơ bản không thể thiếu được',
        register: 'neutral',
        collocation: 'an essential skill for learners',
        example: 'Clear communication is an essential skill in modern workplaces.'
      }
    ],
    discriminationExercise: {
      sentence: 'Adequate sleep and balanced nutrition are ____ for maintaining a healthy immune system.',
      options: ['vital', 'ponderous', 'heavy', 'ponderable'],
      correctAnswer: 'vital',
      explanation: '"vital for" là cấu trúc tự nhiên diễn tả yếu tố thiết yếu cho sức khỏe hoặc sự sống.'
    }
  },
  {
    id: 'para-4',
    word: 'cause',
    meaningVi: 'gây ra / nguyên nhân',
    category: 'cause-effect',
    synonyms: [
      {
        word: 'lead to',
        nuance: 'dẫn tới chuỗi kết quả tiếp theo',
        register: 'neutral',
        collocation: 'lead to environmental degradation',
        example: 'Unregulated tourism can lead to irreversible environmental damage.'
      },
      {
        word: 'result in',
        nuance: 'mang lại kết cục cuối cùng',
        register: 'formal',
        collocation: 'result in financial loss',
        example: 'Failure to adopt digital workflows resulted in substantial losses.'
      },
      {
        word: 'trigger',
        nuance: 'châm ngòi hoặc kích hoạt phản ứng dây chuyền',
        register: 'vivid',
        collocation: 'trigger public protests',
        example: 'The sudden price hike triggered widespread consumer backlash.'
      },
      {
        word: 'give rise to',
        nuance: 'làm nảy sinh hoặc khởi đầu cho một hiện tượng mới',
        register: 'academic',
        collocation: 'give rise to new concerns',
        example: 'Automated monitoring gave rise to ethical concerns regarding privacy.'
      }
    ],
    discriminationExercise: {
      sentence: 'Poor urban planning often ____ severe traffic congestion in major capitals.',
      options: ['results in', 'results of', 'makes in', 'leads from'],
      correctAnswer: 'results in',
      explanation: '"results in + Noun phrase" là cấu trúc chính xác (mang lại kết cục). Chú ý không nhầm với "results from" (bắt nguồn từ).'
    }
  },
  {
    id: 'para-5',
    word: 'problem',
    meaningVi: 'vấn đề, khó khăn cần xử lý',
    category: 'problem-solution',
    synonyms: [
      {
        word: 'issue',
        nuance: 'vấn đề xã hội hoặc đề tài cần bàn luận (trung tính hơn "problem")',
        register: 'academic / formal',
        collocation: 'a pressing global issue',
        example: 'Plastic waste in our oceans has become a pressing global issue.'
      },
      {
        word: 'obstacle',
        nuance: 'chướng ngại vật hoặc rào cản ngăn bước tiến',
        register: 'formal',
        collocation: 'overcome a major obstacle',
        example: 'High tuition fees remain a formidable obstacle for impoverished students.'
      },
      {
        word: 'challenge',
        nuance: 'thách thức đòi hỏi nỗ lực để vượt qua (mang sắc thái xây dựng hơn "problem")',
        register: 'common academic',
        collocation: 'pose a serious challenge',
        example: 'Adapting to artificial intelligence poses a serious challenge for educators.'
      },
      {
        word: 'dilemma',
        nuance: 'tình huống khó xử, tiến thoái lưỡng nan giữa hai lựa chọn khó',
        register: 'formal',
        collocation: 'face a moral dilemma',
        example: 'Working parents face a constant dilemma between professional advancement and family time.'
      }
    ],
    discriminationExercise: {
      sentence: 'Local authorities face a difficult ____ between funding public transit and repairing old roads.',
      options: ['dilemma', 'obstacle', 'nuisance', 'tragedy'],
      correctAnswer: 'dilemma',
      explanation: '"dilemma" mô tả chính xác tình thế phải lựa chọn khó khăn giữa hai phương án đối lập.'
    }
  },
  {
    id: 'para-6',
    word: 'solution',
    meaningVi: 'giải pháp, biện pháp xử lý vấn đề',
    category: 'problem-solution',
    synonyms: [
      {
        word: 'measure',
        nuance: 'biện pháp hành động cụ thể hoặc chính sách can thiệp',
        register: 'formal / policy',
        collocation: 'adopt stringent measures',
        example: 'The municipal government adopted preventative measures to curb emissions.'
      },
      {
        word: 'remedy',
        nuance: 'phương thuốc cứu vãn hoặc cách khắc phục hậu quả',
        register: 'formal',
        collocation: 'a long-term remedy for unemployment',
        example: 'Tax relief served as a temporary remedy for struggling enterprises.'
      },
      {
        word: 'approach',
        nuance: 'hướng tiếp cận phương pháp luận',
        register: 'academic',
        collocation: 'a holistic approach to learning',
        example: 'Modern educators prefer an integrated approach to language acquisition.'
      },
      {
        word: 'intervention',
        nuance: 'sự can thiệp có chủ đích của cơ quan chức năng hoặc y tế',
        register: 'academic / policy',
        collocation: 'early state intervention',
        example: 'Early pedagogical intervention prevents persistent reading deficiencies.'
      }
    ],
    discriminationExercise: {
      sentence: 'To tackle youth unemployment, authorities must introduce targeted fiscal ____ without delay.',
      options: ['measures', 'prescriptions', 'remedies', 'recipes'],
      correctAnswer: 'measures',
      explanation: '"fiscal measures" là collocation cố định trong chính sách kinh tế công; "remedies" thường đi với hậu quả đã xảy ra.'
    }
  },
  {
    id: 'para-7',
    word: 'improve',
    meaningVi: 'cải thiện, nâng cao chất lượng hoặc điều kiện',
    category: 'trend',
    synonyms: [
      {
        word: 'enhance',
        nuance: 'tăng cường giá trị, vẻ đẹp hoặc sức hút sẵn có',
        register: 'formal / academic',
        collocation: 'enhance productivity',
        example: 'Modernized machinery significantly enhanced factory productivity.'
      },
      {
        word: 'boost',
        nuance: 'thúc đẩy tăng mạnh mẽ và nhanh chóng (năng lượng, kinh tế, tinh thần)',
        register: 'common',
        collocation: 'boost economic growth',
        example: 'Export incentives helped boost regional economic growth.'
      },
      {
        word: 'upgrade',
        nuance: 'nâng cấp trang thiết bị, công nghệ hoặc tiêu chuẩn kỹ thuật',
        register: 'technical / practical',
        collocation: 'upgrade public transport facilities',
        example: 'Cities must upgrade aging sewage systems before the rainy season.'
      },
      {
        word: 'bolster',
        nuance: 'chống đỡ, gia cố làm cho vững chắc hơn',
        register: 'formal / academic',
        collocation: 'bolster local confidence',
        example: 'Additional security patrols were deployed to bolster public confidence.'
      }
    ],
    discriminationExercise: {
      sentence: 'Installing solar panels will considerably ____ the energy efficiency of the municipal stadium.',
      options: ['enhance', 'escalate', 'expand', 'enlarge'],
      correctAnswer: 'enhance',
      explanation: '"enhance efficiency" là collocation chuẩn mực diễn tả việc nâng cao hiệu suất hoạt động.'
    }
  },
  {
    id: 'para-8',
    word: 'benefit',
    meaningVi: 'lợi ích, điểm tích cực mang lại',
    category: 'general',
    synonyms: [
      {
        word: 'advantage',
        nuance: 'ưu thế cạnh tranh hoặc điều kiện thuận lợi hơn',
        register: 'neutral',
        collocation: 'gain a competitive advantage',
        example: 'Bilingual candidates enjoy a notable advantage in international trade.'
      },
      {
        word: 'merit',
        nuance: 'giá trị nội tại xứng đáng hoặc ưu điểm đáng khen',
        register: 'formal / academic',
        collocation: 'the merits and drawbacks',
        example: 'Committee members debated the merits and drawbacks of remote work.'
      },
      {
        word: 'perk',
        nuance: 'đãi ngộ hoặc quyền lợi phụ đi kèm công việc',
        register: 'informal / corporate',
        collocation: 'company perks',
        example: 'Complimentary gym access is a popular perk among tech employees.'
      },
      {
        word: 'asset',
        nuance: 'tài sản quý giá hoặc phẩm chất mang lại thành công',
        register: 'formal',
        collocation: 'a valuable asset to the team',
        example: 'Critical thinking is an indispensable asset in modern academia.'
      }
    ],
    discriminationExercise: {
      sentence: 'Fluency in multiple languages constitutes an invaluable ____ for diplomats and negotiators.',
      options: ['asset', 'profit', 'dividend', 'subsidy'],
      correctAnswer: 'asset',
      explanation: '"invaluable asset" là collocation cao cấp chỉ phẩm chất hoặc kỹ năng cực kỳ hữu ích.'
    }
  },
  {
    id: 'para-9',
    word: 'reduce',
    meaningVi: 'cắt giảm, làm hạ bớt',
    category: 'trend',
    synonyms: [
      {
        word: 'curtail',
        nuance: 'chặn bớt, rút ngắn hoặc giới hạn đột ngột (chi tiêu, quyền lợi)',
        register: 'formal / academic',
        collocation: 'curtail public expenditure',
        example: 'Austere budgets forced the ministry to curtail cultural subsidies.'
      },
      {
        word: 'alleviate',
        nuance: 'làm dịu đi nỗi đau, gánh nặng hoặc mức độ nghiêm trọng',
        register: 'formal / academic',
        collocation: 'alleviate poverty and suffering',
        example: 'Microfinance programs aim to alleviate severe rural poverty.'
      },
      {
        word: 'diminish',
        nuance: 'giảm sút dần về uy tín, tầm quan trọng hoặc năng lượng',
        register: 'formal',
        collocation: 'diminish in importance',
        example: 'The leader’s political influence began to diminish after the scandal.'
      },
      {
        word: 'cut back on',
        nuance: 'cắt giảm chi tiêu hoặc tiêu dùng cá nhân/gia đình',
        register: 'phrasal / common',
        collocation: 'cut back on carbon emissions',
        example: 'Citizens are encouraged to cut back on single-use packaging.'
      }
    ],
    discriminationExercise: {
      sentence: 'The primary purpose of humanitarian aid is to ____ the suffering of refugees.',
      options: ['alleviate', 'abbreviate', 'contract', 'dismantle'],
      correctAnswer: 'alleviate',
      explanation: '"alleviate suffering/pain/poverty" là collocation học thuật chuẩn xác cho việc làm nhẹ bớt nỗi đau hoặc gánh nặng.'
    }
  },
  {
    id: 'para-10',
    word: 'result',
    meaningVi: 'kết quả, hậu quả của một chuỗi sự việc',
    category: 'cause-effect',
    synonyms: [
      {
        word: 'outcome',
        nuance: 'kết quả cuối cùng của một quá trình, cuộc đàm phán hoặc thí nghiệm',
        register: 'neutral academic',
        collocation: 'a favorable outcome',
        example: 'The final outcome of the climate negotiations exceeded expectations.'
      },
      {
        word: 'consequence',
        nuance: 'hậu quả (thường mang sắc thái tiêu cực hoặc tác động nghiêm trọng)',
        register: 'formal',
        collocation: 'disastrous consequences',
        example: 'Uncontrolled logging will bring catastrophic environmental consequences.'
      },
      {
        word: 'implication',
        nuance: 'hệ lụy hoặc tác động gián tiếp trong tương lai',
        register: 'academic',
        collocation: 'profound implications for policy',
        example: 'The findings hold profound implications for future urban infrastructure.'
      },
      {
        word: 'aftermath',
        nuance: 'hậu quả sau một thảm họa, biến cố hoặc cuộc chiến',
        register: 'vivid / formal',
        collocation: 'in the immediate aftermath of',
        example: 'Volunteers provided essential relief in the aftermath of the typhoon.'
      }
    ],
    discriminationExercise: {
      sentence: 'The research paper highlights the profound ____ that artificial intelligence will exert on white-collar jobs.',
      options: ['implications', 'conclusions', 'complications', 'terminations'],
      correctAnswer: 'implications',
      explanation: '"profound implications for/on" diễn tả hệ lụy và tác động sâu rộng tới tương lai.'
    }
  }
];
