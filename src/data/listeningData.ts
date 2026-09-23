import { LearningSource, ListeningSection } from '../types';

export const LISTENING_SOURCES: LearningSource[] = [
  {
    id: 'src-official-ielts-listening',
    provider: 'Official IELTS',
    title: 'IELTS.org Official Listening Sample Tasks',
    sourceType: 'official',
    testType: 'academic',
    canonicalSourceUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    isOfficial: true,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'external-only',
    description: 'Nguồn bài tập mẫu chính thức từ tổ chức sở hữu kỳ thi IELTS (ielts.org).'
  },
  {
    id: 'src-bc-listening',
    provider: 'British Council',
    title: 'British Council Official IELTS Practice Materials',
    sourceType: 'partner',
    testType: 'academic',
    canonicalSourceUrl: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/listening-practice-tests',
    isOfficial: true,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'external-only',
    description: 'Học liệu luyện thi Listening chính thức từ Hội đồng Anh (British Council).'
  },
  {
    id: 'src-cam12-listening-local',
    provider: 'Cambridge Local Reference',
    title: 'Cambridge IELTS 12 (User Local Study Reference)',
    sourceType: 'user-reference',
    testType: 'academic',
    isOfficial: false,
    isUserProvided: true,
    status: 'audio-unavailable',
    description: 'Đề thi tham khảo từ bộ sách Cambridge IELTS 12 của người dùng. Audio chính thức không có sẵn trên web public.'
  },
  {
    id: 'src-ielts-style-practice',
    provider: 'IELTS-style Practice',
    title: 'IELTS Academic Format Practice Exercises',
    sourceType: 'practice',
    testType: 'academic',
    isOfficial: false,
    isUserProvided: false,
    verifiedAt: '2026-09-22',
    status: 'verified',
    description: 'Bài luyện nghe chuẩn cấu trúc 4 Part IELTS Academic, kèm audio và audioscript đồng bộ 100%.'
  }
];

export const LISTENING_SECTIONS: ListeningSection[] = [
  // --- Official Sample Task 1: Part 1 Social Context (Note Completion) ---
  {
    id: 'official-sample-p1-transport',
    sourceId: 'src-official-ielts-listening',
    sectionNumber: 1,
    title: 'Official IELTS Sample: Transport Enquiry',
    context: 'A phone conversation between a traveller and a transport information clerk inquiring about regional train schedules, fare discounts, and bicycle carriage policies.',
    instructions: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
    duration: 310,
    narratorVoice: 'en-GB',
    canonicalUrl: 'https://ielts.org/for-test-takers/sample-test-questions',
    verificationStatus: 'external-only',
    sourceNotice: 'Bản quyền bài tập thuộc IELTS.org. Do chính sách CORS của nguồn chính thức, bạn có thể nghe trên trang gốc hoặc kích hoạt Giọng đọc mô phỏng (Browser TTS) để luyện tập trong app.',
    audioSources: [
      {
        label: 'Nguồn chính thức (Mở trang web IELTS.org)',
        url: 'https://ielts.org/for-test-takers/sample-test-questions',
        isStreamable: false
      },
      {
        label: 'Giọng đọc mô phỏng (Browser TTS – practice fallback)',
        url: 'tts-synthetic-practice',
        isSynthetic: true
      }
    ],
    transcript: `CLERK: Good morning, Travel Information Services. How can I help you today?
CALLER: Good morning. I'm planning a journey from Bristol to Manchester next Friday, and I'd like to check departure times and ticket prices.
CLERK: Certainly, madam. What time would you prefer to travel?
CALLER: Early morning, if possible. I need to attend a conference starting at 11:30 AM.
CLERK: Right. There is an express service leaving Bristol Temple Meads at 7:15 AM, arriving in Manchester Piccadilly at 10:20 AM. [Q1]
CALLER: That sounds ideal. How much is a standard single fare for that train?
CLERK: A standard single booked in advance is £42.50. However, if you possess a National Railcard, you receive a one-third discount, reducing it to £28.20. [Q2]
CALLER: I do have a railcard! That's wonderful. Can I reserve a window seat with a power socket?
CLERK: Yes, seat reservations are complimentary when booked online. Would you like a forward-facing seat in Coach D? [Q3]
CALLER: Yes, please. Oh, and another question: can I bring my folding bicycle on board? [Q4]
CLERK: Folding bicycles are permitted on all services free of charge, provided they are stored in the luggage rack. Non-folding bicycles require a prior reservation because there are only four spaces available per train. [Q5]
CALLER: Mine is a folding one, so that shouldn't be an issue. Where should I collect the tickets?
CLERK: You can retrieve them from any station self-service machine using the booking reference: TR-894-K. [Q6]
CALLER: TR-894-K. Got it. And is catering provided on that train?
CLERK: Yes, there is a buffet carriage serving hot drinks and light breakfast items throughout the journey. [Q7]
CALLER: Excellent. Thank you very much for your assistance.
CLERK: You're welcome. Have a safe journey!`,
    questions: [
      {
        id: 'off-p1-q1',
        number: 1,
        type: 'fill-blank',
        prompt: 'Arrival time in Manchester Piccadilly: [ 1 ] AM',
        correctAnswer: '10:20',
        acceptableAnswers: ['10.20', '10:20 am', '10.20 am'],
        explanation: 'Audioscript: "...arriving in Manchester Piccadilly at 10:20 AM."',
        transcriptTimestamp: 35
      },
      {
        id: 'off-p1-q2',
        number: 2,
        type: 'fill-blank',
        prompt: 'Discounted fare with Railcard: £ [ 2 ]',
        correctAnswer: '28.20',
        acceptableAnswers: ['28.2', '£28.20'],
        explanation: 'Audioscript: "...reducing it to £28.20."',
        transcriptTimestamp: 62
      },
      {
        id: 'off-p1-q3',
        number: 3,
        type: 'fill-blank',
        prompt: 'Reserved seat position: forward-facing seat in Coach [ 3 ]',
        correctAnswer: 'D',
        acceptableAnswers: ['Coach D', 'd'],
        explanation: 'Audioscript: "Would you like a forward-facing seat in Coach D?"',
        transcriptTimestamp: 85
      },
      {
        id: 'off-p1-q4',
        number: 4,
        type: 'fill-blank',
        prompt: 'Type of bicycle permitted without reservation: [ 4 ] bicycle',
        correctAnswer: 'folding',
        acceptableAnswers: ['a folding'],
        explanation: 'Audioscript: "Folding bicycles are permitted on all services free of charge..."',
        transcriptTimestamp: 108
      },
      {
        id: 'off-p1-q5',
        number: 5,
        type: 'fill-blank',
        prompt: 'Number of spaces for standard bicycles per train: [ 5 ]',
        correctAnswer: '4',
        acceptableAnswers: ['four', '4 spaces'],
        explanation: 'Audioscript: "...there are only four spaces available per train."',
        transcriptTimestamp: 130
      },
      {
        id: 'off-p1-q6',
        number: 6,
        type: 'fill-blank',
        prompt: 'Ticket collection reference code: [ 6 ]',
        correctAnswer: 'TR-894-K',
        acceptableAnswers: ['tr-894-k', 'TR 894 K', 'TR894K'],
        explanation: 'Audioscript: "using the booking reference: TR-894-K."',
        transcriptTimestamp: 155
      },
      {
        id: 'off-p1-q7',
        number: 7,
        type: 'fill-blank',
        prompt: 'Refreshments available in the [ 7 ] carriage',
        correctAnswer: 'buffet',
        acceptableAnswers: ['the buffet'],
        explanation: 'Audioscript: "...there is a buffet carriage serving hot drinks..."',
        transcriptTimestamp: 178
      }
    ]
  },

  // --- Official / British Council Sample Task 2: Part 2 Social Monologue (Multiple Choice & Plan) ---
  {
    id: 'bc-sample-p2-park',
    sourceId: 'src-bc-listening',
    sectionNumber: 2,
    title: 'British Council Practice: Riverdale Community Park Redevelopment',
    context: 'A local council coordinator delivers an informative presentation describing new facilities, environmental zones, and safety measures at Riverdale Community Park.',
    instructions: 'Choose the correct letter, A, B, or C.',
    duration: 340,
    narratorVoice: 'en-GB',
    canonicalUrl: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/listening-practice-tests',
    verificationStatus: 'external-only',
    sourceNotice: 'Học liệu thuộc British Council IELTS. Audio được lưu trữ trên nền tảng của British Council. Trong ứng dụng, bạn có thể chọn mở nguồn ngoài hoặc dùng Giọng đọc mô phỏng.',
    audioSources: [
      {
        label: 'Nguồn British Council chính thức',
        url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/listening-practice-tests',
        isStreamable: false
      },
      {
        label: 'Giọng đọc mô phỏng (Browser TTS – practice fallback)',
        url: 'tts-synthetic-practice',
        isSynthetic: true
      }
    ],
    transcript: `SPEAKER: Welcome, residents of Riverdale. I'm delighted to update you on the recent redevelopment of our community park. Over the past six months, contractors have completed major landscaping works aimed at enhancing biodiversity and leisure access for all generations.
First, regarding our new solar-powered lighting network. Previously, visitors expressed concern about illumination along the riverbank path after dusk. We have now installed thirty low-glare LED lamps, which not only illuminate the perimeter but also safeguard nocturnal wildlife habitats. [Q8]
Second, the children's adventure playground has been moved away from the main vehicular entrance to the northern lawn, where children can play safely without traffic interference. [Q9]
Furthermore, we have introduced a dedicated community herb garden. Anyone in the neighbourhood is welcome to harvest culinary herbs, provided they replace tools in the storage shed by 6:00 PM. [Q10]
Lastly, please note that cycling is strictly restricted to designated tarmac lanes to prevent accidents with pedestrians and dog walkers. [Q11]`,
    questions: [
      {
        id: 'bc-p2-q8',
        number: 8,
        type: 'multiple-choice',
        prompt: 'The new solar lighting system along the riverbank path was primarily designed to:',
        options: [
          'A. Lower municipal electricity expenses',
          'B. Provide evening safety while protecting nocturnal wildlife',
          'C. Deter unauthorized vehicular parking after dusk'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "...which not only illuminate the perimeter but also safeguard nocturnal wildlife habitats."'
      },
      {
        id: 'bc-p2-q9',
        number: 9,
        type: 'multiple-choice',
        prompt: 'The adventure playground was relocated because:',
        options: [
          'A. The northern lawn receives more direct sunlight',
          'B. The previous location was too close to traffic hazards',
          'C. The equipment needed softer turf surfacing'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "...moved away from the main vehicular entrance... where children can play safely without traffic interference."'
      },
      {
        id: 'bc-p2-q10',
        number: 10,
        type: 'multiple-choice',
        prompt: 'What condition is required when using the community herb garden?',
        options: [
          'A. Residents must sign an annual permit',
          'B. Tools must be returned to the shed by 6:00 PM',
          'C. Plants can only be collected during weekends'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "...provided they replace tools in the storage shed by 6:00 PM."'
      },
      {
        id: 'bc-p2-q11',
        number: 11,
        type: 'multiple-choice',
        prompt: 'Cyclists using Riverdale Park are required to:',
        options: [
          'A. Wear high-visibility helmets at all times',
          'B. Keep exclusively to designated paved paths',
          'C. Dismount when encountering canine walkers'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "...cycling is strictly restricted to designated tarmac lanes to prevent accidents..."'
      }
    ]
  },

  // --- IELTS-style Practice Part 3: Academic Discussion (Table & Multiple Choice) ---
  {
    id: 'practice-p3-renewable-energy',
    sourceId: 'src-ielts-style-practice',
    sectionNumber: 3,
    title: 'IELTS-Style Practice: Offshore Wind Farm Project Review',
    context: 'Two undergraduate engineering students, Clara and Liam, discuss their joint case study on North Sea offshore wind turbines with their academic supervisor, Dr. Harrison.',
    instructions: 'Choose the correct letter, A, B, or C; or fill in the blank with NO MORE THAN TWO WORDS.',
    duration: 360,
    narratorVoice: 'en-GB',
    verificationStatus: 'verified',
    sourceNotice: 'Bài luyện tập mô phỏng chuẩn format IELTS Academic Part 3. Audioscript và câu hỏi được đồng bộ chặt chẽ để kiểm tra kỹ năng nghe học thuật.',
    audioSources: [
      {
        label: 'Giọng đọc chuẩn (Browser TTS – practice fallback)',
        url: 'tts-synthetic-practice',
        isSynthetic: true
      }
    ],
    transcript: `DR HARRISON: Good afternoon, Clara, Liam. Let's look over your presentation slides for tomorrow's seminar on the Hornsea offshore wind project. Where did you encounter the most difficulty?
CLARA: Initially, we struggled to find reliable statistics on foundation manufacturing costs. Most industry reports combine turbine assembly and maritime installation under one umbrella budget. [Q12]
LIAM: Yes, but once we cross-referenced Danish university publications, we isolated the concrete seabed gravity base expenses clearly.
DR HARRISON: Excellent. And what about your analysis of acoustic disturbance to marine mammals during pile driving? [Q13]
CLARA: That was fascinating. The engineering consortium deployed air bubble curtains around the drilling rigs, which dampened underwater sound waves by nearly fifteen decibels. [Q14]
LIAM: We also found that seal populations returned to their usual foraging routes within three weeks of construction finishing, which contradicted earlier fears of long-term habitat abandonment. [Q15]
DR HARRISON: Very thorough. Now make sure your final conclusion doesn't just praise the output figures. You need to address transmission cable losses over long distances to the national grid. [Q16]`,
    questions: [
      {
        id: 'prac-p3-q12',
        number: 12,
        type: 'multiple-choice',
        prompt: 'Why was data gathering difficult at the beginning of their research?',
        options: [
          'A. University databases lacked offshore engineering journals',
          'B. Commercial reports combined distinct cost categories together',
          'C. Danish turbine manufacturers refused to share production specs'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "Most industry reports combine turbine assembly and maritime installation under one umbrella budget."'
      },
      {
        id: 'prac-p3-q13',
        number: 13,
        type: 'fill-blank',
        prompt: 'Specific foundation type analyzed: [ 13 ] base',
        correctAnswer: 'gravity',
        acceptableAnswers: ['gravity base', 'concrete seabed gravity'],
        explanation: 'Audioscript: "...we isolated the concrete seabed gravity base expenses clearly."'
      },
      {
        id: 'prac-p3-q14',
        number: 14,
        type: 'fill-blank',
        prompt: 'Sound-dampening technology used: air [ 14 ] curtains',
        correctAnswer: 'bubble',
        acceptableAnswers: ['bubbles', 'bubble curtains'],
        explanation: 'Audioscript: "The engineering consortium deployed air bubble curtains around the drilling rigs..."'
      },
      {
        id: 'prac-p3-q15',
        number: 15,
        type: 'fill-blank',
        prompt: 'Number of weeks for seals to resume foraging: [ 15 ] weeks',
        correctAnswer: '3',
        acceptableAnswers: ['three', '3 weeks'],
        explanation: 'Audioscript: "...seal populations returned to their usual foraging routes within three weeks..."'
      },
      {
        id: 'prac-p3-q16',
        number: 16,
        type: 'multiple-choice',
        prompt: 'Dr. Harrison advises the students that their conclusion must address:',
        options: [
          'A. Power losses during long-distance cable transmission',
          'B. The political dispute over marine territorial borders',
          'C. Routine turbine maintenance schedules in winter'
        ],
        correctAnswer: 'A',
        explanation: 'Audioscript: "You need to address transmission cable losses over long distances to the national grid."'
      }
    ]
  },

  // --- IELTS-style Practice Part 4: Academic Monologue (Summary / Sentence Completion) ---
  {
    id: 'practice-p4-microplastics',
    sourceId: 'src-ielts-style-practice',
    sectionNumber: 4,
    title: 'IELTS-Style Practice: Microplastics in Deep-Sea Sediments',
    context: 'A marine biology lecturer discusses recent oceanographic research concerning the distribution and ecological hazards of synthetic microfibers in benthic trenches.',
    instructions: 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.',
    duration: 380,
    narratorVoice: 'en-US',
    verificationStatus: 'verified',
    sourceNotice: 'Bài thuyết trình học thuật chuẩn Part 4 IELTS Academic. Giọng đọc mô phỏng rõ ràng, kèm giải thích chi tiết cho từng bẫy thông tin (distractors).',
    audioSources: [
      {
        label: 'Giọng đọc chuẩn (Browser TTS – practice fallback)',
        url: 'tts-synthetic-practice',
        isSynthetic: true
      }
    ],
    transcript: `LECTURER: In today's seminar, we examine anthropogenic pollutants in remote oceanic ecosystems. Until recently, oceanographers assumed buoyant synthetic polymers would remain primarily in surface gyres or along coastal shorelines. However, deep-submergence sampling has revealed dense deposits of microfibers resting within abyssal trenches at depths exceeding 6,000 meters. [Q17]
These microfibers originate predominantly from synthetic clothing shed during domestic laundry cycles. Because conventional wastewater treatment facilities lack fine filtration membranes, millions of fibers bypass filtration into river deltas daily. [Q18]
Once in the ocean, dense microbial biofilms adhere to the plastic surfaces. This process, known as biofouling, increases their overall density, accelerating their descent toward the seabed. [Q19]
Upon reaching benthic sediments, microplastics are ingested by bottom-dwelling detritivores, such as sea cucumbers and amphipods. These synthetic particles disrupt digestive enzymes and leach toxic plasticizers into benthic food webs. [Q20]`,
    questions: [
      {
        id: 'prac-p4-q17',
        number: 17,
        type: 'fill-blank',
        prompt: 'Microfibers have been detected in oceanic trenches below [ 17 ] meters.',
        correctAnswer: '6,000',
        acceptableAnswers: ['6000', '6,000 meters', 'six thousand'],
        explanation: 'Audioscript: "...resting within abyssal trenches at depths exceeding 6,000 meters."'
      },
      {
        id: 'prac-p4-q18',
        number: 18,
        type: 'fill-blank',
        prompt: 'Primary source of synthetic fibers: domestic [ 18 ] cycles.',
        correctAnswer: 'laundry',
        acceptableAnswers: ['washing', 'laundry cycles'],
        explanation: 'Audioscript: "...originate predominantly from synthetic clothing shed during domestic laundry cycles."'
      },
      {
        id: 'prac-p4-q19',
        number: 19,
        type: 'fill-blank',
        prompt: 'Process increasing microfiber density and sinking speed: [ 19 ].',
        correctAnswer: 'biofouling',
        acceptableAnswers: ['bio-fouling'],
        explanation: 'Audioscript: "This process, known as biofouling, increases their overall density..."'
      },
      {
        id: 'prac-p4-q20',
        number: 20,
        type: 'fill-blank',
        prompt: 'Chemicals that leach into food webs from ingested particles: toxic [ 20 ].',
        correctAnswer: 'plasticizers',
        acceptableAnswers: ['plasticiser', 'plasticisers', 'plasticizer'],
        explanation: 'Audioscript: "...disrupt digestive enzymes and leach toxic plasticizers into benthic food webs."'
      }
    ]
  },

  // --- Cambridge 12 User Reference Test 5 Section 1 (Classified as User Reference, Audio Unavailable) ---
  {
    id: 'cam12-t5-s1',
    sourceId: 'src-cam12-listening-local',
    sectionNumber: 1,
    title: 'Cambridge 12 Test 5 - Part 1: Family Excursions (User Local Reference)',
    context: 'A conversation between a tourist customer and a travel centre employee discussing family excursion packages.',
    instructions: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
    duration: 330,
    narratorVoice: 'en-GB',
    verificationStatus: 'audio-unavailable',
    sourceNotice: 'Học liệu tham khảo từ tài liệu cá nhân của người học. Audio gốc không có sẵn trên web; các liên kết mirror trôi nổi không được xác thực đã bị gỡ bỏ để đảm bảo tính chính xác.',
    audioSources: [
      {
        label: 'Giọng đọc mô phỏng (Browser TTS – practice fallback)',
        url: 'tts-synthetic-practice',
        isSynthetic: true
      }
    ],
    transcript: `TC EMPLOYEE: Hi. Can I help you?
VISITOR: I'd like to find out if you have any excursions suitable for families.
TC EMPLOYEE: Sure. How about taking your family for a cruise? We have a steamship that takes passengers out several times a day – it's over 100 years old.
VISITOR: That sounds interesting. How long is the trip?
TC EMPLOYEE: About an hour and a half. And don't forget to take pictures of the mountains. They're all around you when you're on the boat and they look fantastic. [Q1]
VISITOR: OK. And I assume there's a café or something on board?
TC EMPLOYEE: Sure. How old are your children?
VISITOR: Er, my daughter's fifteen and my son's seven.
TC EMPLOYEE: Right. Well there are various things you can do once you've crossed the lake, to make a day of it. One thing that's very popular is a visit to the Country Farm. You're met off the boat by the farmer and he'll take you to the holding pens, where the sheep are kept. Children love feeding them!
VISITOR: My son would love that. He really likes animals.
TC EMPLOYEE: Well, there's also a 40-minute trek round the farm on a horse, if he wants. [Q2]
VISITOR: Do you think he'd manage it? He hasn't done that before.
TC EMPLOYEE: Sure. It's suitable for complete beginners.
VISITOR: Ah, good.
TC EMPLOYEE: And again, visitors are welcome to explore the farm on their own, as long as they take care to close gates and so on. There are some very beautiful gardens along the side of the lake which also belong to the farm – they'll be just at their best now. You could easily spend an hour or two there. [Q3]
VISITOR: OK. Well that all sounds good. And can we get lunch there? [Q4]
TC EMPLOYEE: You can, and it's very good, though it's not included in the basic cost. You pay when you get there.
VISITOR: Right.
VISITOR: So is there anything else to do over on that side of the lake?
TC EMPLOYEE: Well, what you can do is take a bike over on the ship and then go on a cycling trip. There's a trail there called the Back Road – you could easily spend three or four hours exploring it, and the scenery's wonderful. They'll give you a map when you get your ticket for the cruise – there's no extra charge. [Q5]
VISITOR: What's the trail like in terms of difficulty?
TC EMPLOYEE: Quite challenging in places. It wouldn't be suitable for your seven-year-old. It needs someone who's got a bit more experience. [Q6]
VISITOR: Hmm. Well, my daughter loves cycling and so do I, so maybe the two of us could go, and my wife and son could stay on the farm. That might work out quite well. But we don't have bikes here... is there somewhere we could rent them?
TC EMPLOYEE: Yes, there's a place here in the city. It's called Ratchesons. [Q7]
VISITOR: I'll just make a note of that – er, how do you spell it?
TC EMPLOYEE: R-A-T-C-H-E-S-O-N-S. It's just by the cruise ship terminal.
VISITOR: OK.
TC EMPLOYEE: You'd also need to pick up a repair kit for the bike from there to take along with you, and you'd need to take along a snack and some water – it'd be best to get those in the city.
VISITOR: Fine. That shouldn't be a problem. And I assume I can rent a helmet from the bike place? [Q8]
TC EMPLOYEE: Sure, you should definitely get that. It's a great ride, but you want to be well prepared because it's very remote – you won't see any shops round there, or anywhere to stay, so you need to get back in time for the last boat. [Q9]
VISITOR: Yeah. So what sort of prices are we looking at here?
TC EMPLOYEE: Let's see, that'd be one adult and one child for the cruise with farm tour, that's $117, and an adult and a child for the cruise only so that's $214 dollars altogether. Oh, wait a minute, how old did you say your daughter was?
VISITOR: Fifteen.
TC EMPLOYEE: Then I'm afraid it's $267 because she has to pay the adult fare, which is $75 instead of the child fare which is $22 – sorry about that. [Q10]
VISITOR: That's OK.`,
    questions: [
      {
        id: 'c12-t5-q1',
        number: 1,
        type: 'fill-blank',
        prompt: 'Cruise on a lake: Can take photos of the [ 1 ] that surround the lake',
        correctAnswer: 'mountains',
        acceptableAnswers: ['mountain', 'the mountains'],
        explanation: 'Audioscript: "And don\'t forget to take pictures of the mountains."',
        transcriptTimestamp: 28
      },
      {
        id: 'c12-t5-q2',
        number: 2,
        type: 'fill-blank',
        prompt: 'Farm visit: Visit can include a 40-minute ride on a [ 2 ]',
        correctAnswer: 'horse',
        acceptableAnswers: ['a horse'],
        explanation: 'Audioscript: "...there\'s also a 40-minute trek round the farm on a horse..."',
        transcriptTimestamp: 62
      },
      {
        id: 'c12-t5-q3',
        number: 3,
        type: 'fill-blank',
        prompt: 'Visitors can walk in the farm’s [ 3 ] by the lake',
        correctAnswer: 'gardens',
        acceptableAnswers: ['garden', 'beautiful gardens'],
        explanation: 'Audioscript: "There are some very beautiful gardens along the side of the lake..."',
        transcriptTimestamp: 85
      },
      {
        id: 'c12-t5-q4',
        number: 4,
        type: 'fill-blank',
        prompt: '[ 4 ] is available at extra cost',
        correctAnswer: 'lunch',
        acceptableAnswers: ['meals'],
        explanation: 'Audioscript: "And can we get lunch there? You can... though it\'s not included in the basic cost."',
        transcriptTimestamp: 104
      },
      {
        id: 'c12-t5-q5',
        number: 5,
        type: 'fill-blank',
        prompt: 'Cycling trip: Visitors receive a [ 5 ] with their cruise ticket',
        correctAnswer: 'map',
        acceptableAnswers: ['a map'],
        explanation: 'Audioscript: "They\'ll give you a map when you get your ticket for the cruise..."',
        transcriptTimestamp: 135
      },
      {
        id: 'c12-t5-q6',
        number: 6,
        type: 'fill-blank',
        prompt: 'The Back Road trail requires cyclists to have [ 6 ]',
        correctAnswer: 'experience',
        acceptableAnswers: ['more experience'],
        explanation: 'Audioscript: "It needs someone who\'s got a bit more experience."',
        transcriptTimestamp: 160
      },
      {
        id: 'c12-t5-q7',
        number: 7,
        type: 'fill-blank',
        prompt: 'Bike hire shop name: [ 7 ]',
        correctAnswer: 'Ratchesons',
        acceptableAnswers: ['ratchesons'],
        explanation: 'Audioscript: "It\'s called Ratchesons. R-A-T-C-H-E-S-O-N-S."',
        transcriptTimestamp: 190
      },
      {
        id: 'c12-t5-q8',
        number: 8,
        type: 'fill-blank',
        prompt: 'Must rent a [ 8 ] from the cycle shop',
        correctAnswer: 'helmet',
        acceptableAnswers: ['a helmet', 'helmets'],
        explanation: 'Audioscript: "And I assume I can rent a helmet from the bike place? Sure..."',
        transcriptTimestamp: 215
      },
      {
        id: 'c12-t5-q9',
        number: 9,
        type: 'fill-blank',
        prompt: 'Must return in time for the last [ 9 ]',
        correctAnswer: 'boat',
        acceptableAnswers: ['the boat'],
        explanation: 'Audioscript: "...so you need to get back in time for the last boat."',
        transcriptTimestamp: 236
      },
      {
        id: 'c12-t5-q10',
        number: 10,
        type: 'fill-blank',
        prompt: 'Total cost for family: $ [ 10 ]',
        correctAnswer: '267',
        acceptableAnswers: ['267 dollars', '$267'],
        explanation: 'Audioscript: "Then I\'m afraid it\'s $267 because she has to pay the adult fare..."',
        transcriptTimestamp: 275
      }
    ]
  }
];
