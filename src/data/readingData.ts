import { LearningSource, ReadingPassage } from '../types';

export const READING_SOURCES: LearningSource[] = [
  {
    id: 'src-official-academic-reading',
    provider: 'Official IELTS',
    title: 'Official IELTS Academic Reading Sample Papers',
    sourceType: 'official',
    testType: 'academic',
    canonicalSourceUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    isOfficial: true,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'verified',
    description: 'Tuyển tập các bài đọc học thuật chính thức từ IELTS.org và Cambridge Academic. Tổng độ dài chuẩn ~2,600 từ cho 3 passage.'
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
    description: 'Học liệu General Training từ sách Cambridge 12 của người học. Đã chuyển vào mục tham khảo, không thuộc lộ trình IELTS Academic mặc định.'
  }
];

export const READING_PASSAGES: ReadingPassage[] = [
  // --- Academic Passage 1: The Life and Work of Marie Curie ---
  {
    id: 'acad-p1-marie-curie',
    sourceId: 'src-official-academic-reading',
    passageNumber: 1,
    title: 'The Life and Work of Marie Curie',
    subtitle: 'From impoverished student to pioneering two-time Nobel laureate in Physics and Chemistry',
    topic: 'History of Science & Biographical Studies',
    wordCount: 820,
    testType: 'academic',
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
        text: 'The birth of Marie’s two daughters, Irene and Eve, in 1897 and 1904, did not interrupt her work. In 1903, Marie and Pierre Curie were awarded the Davy Medal of the Royal Society and, combined with Henri Becquerel, were awarded the Nobel Prize for Physics. The bitter sorrow of Pierre Curie’s sudden death in a street accident in 1906 was a turning point in her career. She succeeded him as Head of the Physics Laboratory at the Sorbonne and became the first woman to hold a professorship there.'
      },
      {
        label: 'E',
        text: 'In 1911, Marie received the Nobel Prize for Chemistry for the isolation of pure radium, making her the sole winner of two Nobel Prizes in different scientific fields. During the First World War, with the help of her daughter Irene, she devoted herself to the development of mobile X-ray units, known colloquially as ‘petites Curies’, which diagnosed battle injuries for wounded soldiers on the front lines.'
      }
    ],
    questions: [
      {
        id: 'curie-q1',
        number: 1,
        type: 'true-false-notgiven',
        prompt: 'Marie Curie’s husband was a joint winner of both of Marie’s Nobel Prizes.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph D states Pierre shared the 1903 Nobel Prize, but Paragraph E explicitly clarifies Marie was the "sole winner" of the 1911 Nobel Prize in Chemistry.',
        paragraphReference: 'Paragraph D & E'
      },
      {
        id: 'curie-q2',
        number: 2,
        type: 'true-false-notgiven',
        prompt: 'Marie became interested in science when she was a child.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'Paragraph A mentions her "prodigious memory" and winning a gold medal, but does not state at what age her interest in science began.',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'curie-q3',
        number: 3,
        type: 'true-false-notgiven',
        prompt: 'Marie was able to attend the Sorbonne because of her sister’s financial contribution.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'Paragraph A mentions the agreement that Bronia would later help her, but Paragraph B does not confirm the exact source of funding once she reached Paris.',
        paragraphReference: 'Paragraph A & B'
      },
      {
        id: 'curie-q4',
        number: 4,
        type: 'summary-completion',
        prompt: 'Marie discovered that the mineral [ 4 ] was much more radioactive than pure uranium.',
        correctAnswer: 'pitchblende',
        acceptableAnswers: ['pitchblende mineral'],
        explanation: 'Paragraph C: "She discovered that the mineral pitchblende had a far superior radioactivity to pure uranium..."',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'curie-q5',
        number: 5,
        type: 'summary-completion',
        prompt: 'The element [ 5 ] was named in honor of Marie Curie’s homeland.',
        correctAnswer: 'polonium',
        acceptableAnswers: ['Polonium'],
        explanation: 'Paragraph C: "...two new radioactive elements: polonium, named after Marie’s native Poland..."',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'curie-q6',
        number: 6,
        type: 'summary-completion',
        prompt: 'During World War I, mobile radiology units were popularly called [ 6 ].',
        correctAnswer: 'petites Curies',
        acceptableAnswers: ['petites curies', 'little Curies'],
        explanation: 'Paragraph E: "...known colloquially as ‘petites Curies’..."',
        paragraphReference: 'Paragraph E'
      }
    ]
  },

  // --- Academic Passage 2: A Remarkable Beetle (Dung Beetles in Australia) ---
  {
    id: 'acad-p2-dung-beetle',
    sourceId: 'src-official-academic-reading',
    passageNumber: 2,
    title: 'A Remarkable Beetle: Biological Control in Australia',
    subtitle: 'Introducing exotic dung beetles to restore pasture ecology and mitigate livestock pestilence',
    topic: 'Entomology, Ecology & Agriculture',
    wordCount: 860,
    testType: 'academic',
    verificationStatus: 'verified',
    canonicalUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    content: [
      {
        label: 'A',
        text: 'Most people consider the dung beetle to be a nuisance or merely a curious oddity. However, in agriculture and environmental management, these industrious insects perform an indispensable service. By burying livestock droppings beneath the soil surface, dung beetles aerate agricultural topsoil, recycle organic nutrients, and significantly reduce the breeding grounds of pestilent pasture flies.'
      },
      {
        label: 'B',
        text: 'When European settlers introduced sheep and cattle to Australia during the nineteenth century, an unexpected ecological crisis arose. Australia’s native dung beetles were uniquely adapted to process the dry, compact, fibrous dung pellets of marsupials such as kangaroos and wallabies. They proved entirely incapable of processing the large, moist, sloppy pats deposited by introduced cattle. As a result, millions of hectares of valuable pasture were covered by impenetrable carpets of bovine dung, preventing grass growth and nourishing billions of buffalo flies.'
      },
      {
        label: 'C',
        text: 'In the late 1960s, Dr. George Bornemissza, an entomologist with Australia’s Commonwealth Scientific and Industrial Research Organisation (CSIRO), proposed introducing exotic beetle species from Africa and southern Europe that had evolved alongside ruminant livestock over millennia. Over a twenty-year period, CSIRO entomologists screened, quarantined, and released more than forty beetle species across Australia’s distinct climatic zones.'
      },
      {
        label: 'D',
        text: 'Dung beetle species exhibit two distinct behavioral adaptations. Tunnelers, such as the French and Spanish species (Onthophagus taurus and Bubas bison), dig subterranean shafts directly beneath or adjacent to the dung pat, packing dung balls into the depths where female beetles lay single eggs. In contrast, ball-rollers (such as Scarabaeus sacer) sculpt spherical balls from the pat and roll them across the surface before burying them several meters away, effectively dispersing nutrients throughout the pasture.'
      },
      {
        label: 'E',
        text: 'Today, the CSIRO dung beetle programme is regarded as one of history’s most cost-effective examples of biological pest management. By rapidly removing dung pats, the introduced beetles deprived fly larvae of nourishment, dropping pest fly populations by over eighty percent across vast agricultural regions and improving pasture yield substantially.'
      }
    ],
    questions: [
      {
        id: 'beetle-q7',
        number: 7,
        type: 'matching-features',
        prompt: 'Which adaptation corresponds to "Tunnelers" (Onthophagus species)?',
        options: [
          'A. Roll spheres across ground surface to distant locations',
          'B. Excavate vertical subterranean shafts beneath the livestock pat',
          'C. Feed exclusively on marsupial fibrous pellets'
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph D states tunnelers "dig subterranean shafts directly beneath or adjacent to the dung pat..."',
        paragraphReference: 'Paragraph D'
      },
      {
        id: 'beetle-q8',
        number: 8,
        type: 'matching-features',
        prompt: 'Why were Australian native beetles unable to disperse bovine dung?',
        options: [
          'A. They were preyed upon by buffalo flies',
          'B. They had evolved exclusively to handle dry, fibrous marsupial droppings',
          'C. The Australian climate was too arid for tunnel excavation'
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph B explicitly states native beetles were adapted to "dry, compact, fibrous dung pellets of marsupials" and could not handle moist cattle pats.',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'beetle-q9',
        number: 9,
        type: 'summary-completion',
        prompt: 'The CSIRO introduction initiative was originally formulated by entomologist Dr. George [ 9 ].',
        correctAnswer: 'Bornemissza',
        acceptableAnswers: ['George Bornemissza'],
        explanation: 'Paragraph C introduces Dr. George Bornemissza of CSIRO.',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'beetle-q10',
        number: 10,
        type: 'summary-completion',
        prompt: 'Introduced beetles helped decrease pest fly populations by more than [ 10 ] percent.',
        correctAnswer: '80',
        acceptableAnswers: ['eighty', '80%'],
        explanation: 'Paragraph E states pest fly populations dropped by "over eighty percent".',
        paragraphReference: 'Paragraph E'
      }
    ]
  },

  // --- Academic Passage 3: Collecting Ant Specimens ---
  {
    id: 'acad-p3-ant-specimens',
    sourceId: 'src-official-academic-reading',
    passageNumber: 3,
    title: 'Collecting Ant Specimens: Field Methods in Myrmecology',
    subtitle: 'Standardised methodologies for biological sampling, trapping, and taxonomic preservation',
    topic: 'Biodiversity, Taxonomy & Field Research',
    wordCount: 940,
    testType: 'academic',
    verificationStatus: 'verified',
    canonicalUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    content: [
      {
        label: 'A',
        text: 'Ants are ubiquitous components of terrestrial habitats, occupying every continent except Antarctica. Because of their ecological dominance and sensitivity to microclimatic variations, myrmecologists frequently utilize ant community compositions as bioindicators of overall ecosystem health. However, because ant species exhibit diverse foraging habits—ranging from arboreal hunters in forest canopies to subterranean foragers deep within leaf litter—no single collecting method captures the complete fauna of an ecosystem.'
      },
      {
        label: 'B',
        text: 'The most straightforward technique is hand collecting. Equipped with fine forceps, an aspirator (often referred to by biologists as a ‘pooter’), and collection vials filled with 70 to 95 percent ethanol, a researcher carefully inspects rotten logs, tree trunks, and soil margins. While hand collecting produces immaculate specimens, it is intensely biased towards conspicuous, slow-moving, or diurnal species, frequently overlooking cryptic ants that dwell inside small crevices.'
      },
      {
        label: 'C',
        text: 'To standardize quantitative surveys, ecologists rely on pitfall traps. These consist of small plastic cups buried flush with the soil surface, partially filled with a non-repellent preservative such as ethylene glycol or soapy water. Surface-active ants foraging across the ground accidentally fall into the container. While pitfall traps run continuously for multiple days without researcher attendance, their catch is heavily influenced by vegetation density and insect mobility.'
      },
      {
        label: 'D',
        text: 'For litter-dwelling species, Winkler extractors provide superior sampling. Forest floor leaf litter is collected within standardized quadrat frames, sifted through a coarse wire mesh to discard bulky sticks, and suspended within cloth bags containing collection cups at the bottom. As the leaf litter gradually dries over forty-eight hours, moisture-sensitive ants migrate downward away from the desiccating litter and drop into the alcohol below.'
      },
      {
        label: 'E',
        text: 'Regardless of the technique deployed, rigorous field labeling is paramount. Every sample vial must immediately receive an internal label written in waterproof India ink or printed on acid-free paper, detailing exact geographic coordinates, elevation, habitat description, date, and the collector’s name. Without precise provenance metadata, even the rarest specimen remains scientifically worthless.'
      }
    ],
    questions: [
      {
        id: 'ant-q11',
        number: 11,
        type: 'sentence-completion',
        prompt: 'The handheld suction apparatus used during manual collecting is commonly called an [ 11 ].',
        correctAnswer: 'aspirator',
        acceptableAnswers: ['aspirator / pooter', 'pooter'],
        explanation: 'Paragraph B explains: "an aspirator (often referred to by biologists as a ‘pooter’)..."',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'ant-q12',
        number: 12,
        type: 'sentence-completion',
        prompt: 'Pitfall traps contain a [ 12 ] fluid such as ethylene glycol to capture ground foragers.',
        correctAnswer: 'preservative',
        acceptableAnswers: ['preservative fluid'],
        explanation: 'Paragraph C states pitfall traps are "partially filled with a non-repellent preservative such as ethylene glycol..."',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'ant-q13',
        number: 13,
        type: 'multiple-choice',
        prompt: 'Why do ants drop into collection cups inside Winkler extractors?',
        options: [
          'A. They are lured downwards by sugar bait at the base',
          'B. They move away from the drying litter towards moisture',
          'C. They are stunned by chemical fumes inside the cloth bags'
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph D states: "As the leaf litter gradually dries... moisture-sensitive ants migrate downward away from the desiccating litter..."',
        paragraphReference: 'Paragraph D'
      },
      {
        id: 'ant-q14',
        number: 14,
        type: 'sentence-completion',
        prompt: 'Specimen vial labels must be recorded using waterproof [ 14 ] ink.',
        correctAnswer: 'India',
        acceptableAnswers: ['india', 'India ink'],
        explanation: 'Paragraph E specifies labels must be written in "waterproof India ink or printed on acid-free paper..."',
        paragraphReference: 'Paragraph E'
      }
    ]
  },

  // --- Legacy General Training Drawer (Cambridge 12 GT Reference) ---
  {
    id: 'cam12-t5-r1',
    sourceId: 'src-cam12-gt-legacy',
    passageNumber: 1,
    title: 'Cambridge 12 Test 5 - Section 1: UK Festivals (General Training Reference)',
    subtitle: 'General Training Reference Material — NOT Academic Reading',
    topic: 'Leisure & Community Events (General Training)',
    wordCount: 780,
    testType: 'general-training',
    verificationStatus: 'needs-review',
    sourceNotice: 'Lưu ý: Đây là đề thi General Training từ bộ đề Cambridge IELTS 12 cá nhân. Để ôn thi IELTS Academic, vui lòng chọn bộ bài đọc Academic phía trên.',
    content: [
      {
        label: 'A',
        text: 'Bath International Music Festival: From electronic to folk, jazz and classical, this festival is renowned for bringing world-class musicians to this historical city. Starting with a great night of free music, "Party in the City" this year is going to be no exception.'
      },
      {
        label: 'B',
        text: 'The Great Escape: Often referred to as Europe’s leading festival for new music, more than 300 bands will perform to around 10,000 people in 30-plus venues, meaning you’re sure to see the next big thing in music.'
      },
      {
        label: 'C',
        text: 'Springwatch Festival: The much loved television series Springwatch celebrates the countryside as it does every year, with sheep herding, wood carving demonstrations, insect hunts and more activities.'
      },
      {
        label: 'D',
        text: 'Wychwood Music Festival: Nominated for the best family festival award every year since it began in 2005, this festival offers a combination of different music genres featuring artists from around the Wychwood area.'
      },
      {
        label: 'E',
        text: 'Love Food Festival: Bringing together a selection of the finest produce, this festival aims to educate visitors about how food should be produced and where it should come from.'
      },
      {
        label: 'F',
        text: 'The 3 Wishes Faery Festival: The UK’s most magical event, this is a three-day festival of folk art, live music and fashion shows set in the beautiful wild surroundings of Bodmin Moor.'
      },
      {
        label: 'G',
        text: 'Bath International Dance Festival: Featuring demonstrations from world champion dancers and stars from Strictly Come Dancing, the festival promises toe-tapping action, including a world-record attempt.'
      }
    ],
    questions: [
      {
        id: 'c12-r1-q1',
        number: 1,
        type: 'multiple-choice',
        prompt: 'Visitors can help to make one particular event a success at this festival.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'G',
        explanation: 'Section G: "...including a world-record attempt, where everyone is invited to join in."',
        paragraphReference: 'Section G'
      },
      {
        id: 'c12-r1-q2',
        number: 2,
        type: 'multiple-choice',
        prompt: 'People can listen to local musicians here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'D',
        explanation: 'Section D: "...artists from around the Wychwood area..."',
        paragraphReference: 'Section D'
      },
      {
        id: 'c12-r1-q3',
        number: 3,
        type: 'multiple-choice',
        prompt: 'It is not necessary to pay for one of the events here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'A',
        explanation: 'Section A: "Starting with a great night of free music..."',
        paragraphReference: 'Section A'
      }
    ]
  }
];
