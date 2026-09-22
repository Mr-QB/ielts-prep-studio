import { ListeningSection } from '../types';

export const LISTENING_SECTIONS: ListeningSection[] = [
  {
    id: 'cam12-t5-s1',
    sectionNumber: 1,
    title: 'Cambridge 12 Test 5 - Section 1: Family Excursions',
    context: 'A conversation between a tourist customer (Visitor) and a Travel Centre employee discussing family excursion packages: Cruise on a lake, Farm visit, and Cycling trips.',
    duration: 330,
    narratorVoice: 'en-GB',
    audioSources: [
      {
        label: 'Máy chủ 1: Giọng đọc Cambridge chuẩn (Speech Synthesis HD)',
        url: 'tts-built-in'
      },
      {
        label: 'Máy chủ 2: Audio Stream Trực tuyến (Public Mirror)',
        url: 'https://ia800204.us.archive.org/11/items/ielts-listening-sample-test-01/ielts-listening-p1.mp3'
      },
      {
        label: 'Máy chủ 3: Backup Mirror (Wikimedia Commons)',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/En-uk-accommodation.ogg'
      }
    ],
    instructions: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
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
VISITOR: That's OK. Er, so how do ...`,
    questions: [
      {
        id: 'c12-t5-q1',
        number: 1,
        type: 'fill-blank',
        prompt: 'Cruise on a lake: Can take photos of the [ 1 ] that surround the lake',
        correctAnswer: 'mountains',
        acceptableAnswers: ['mountain', 'the mountains'],
        explanation: 'Audioscript: "And don\'t forget to take pictures of the mountains. They\'re all around you when you\'re on the boat..."',
        transcriptTimestamp: 28
      },
      {
        id: 'c12-t5-q2',
        number: 2,
        type: 'fill-blank',
        prompt: 'Farm visit: Visit can include a 40-minute ride on a [ 2 ]',
        correctAnswer: 'horse',
        acceptableAnswers: ['a horse'],
        explanation: 'Audioscript: "Well, there\'s also a 40-minute trek round the farm on a horse, if he wants."',
        transcriptTimestamp: 62
      },
      {
        id: 'c12-t5-q3',
        number: 3,
        type: 'fill-blank',
        prompt: 'Visitors can walk in the farm’s [ 3 ] by the lake',
        correctAnswer: 'gardens',
        acceptableAnswers: ['garden', 'beautiful gardens'],
        explanation: 'Audioscript: "There are some very beautiful gardens along the side of the lake which also belong to the farm..."',
        transcriptTimestamp: 85
      },
      {
        id: 'c12-t5-q4',
        number: 4,
        type: 'fill-blank',
        prompt: '[ 4 ] is available at extra cost',
        correctAnswer: 'lunch',
        acceptableAnswers: ['meals', 'lunch meal'],
        explanation: 'Audioscript: "And can we get lunch there? You can, and it\'s very good, though it\'s not included in the basic cost."',
        transcriptTimestamp: 104
      },
      {
        id: 'c12-t5-q5',
        number: 5,
        type: 'fill-blank',
        prompt: 'Cycling trips: A [ 5 ] is provided',
        correctAnswer: 'map',
        acceptableAnswers: ['trail map', 'a map'],
        explanation: 'Audioscript: "They\'ll give you a map when you get your ticket for the cruise – there\'s no extra charge."',
        transcriptTimestamp: 132
      },
      {
        id: 'c12-t5-q6',
        number: 6,
        type: 'fill-blank',
        prompt: 'Only suitable for cyclists who have some [ 6 ]',
        correctAnswer: 'experience',
        acceptableAnswers: ['cycling experience'],
        explanation: 'Audioscript: "It wouldn\'t be suitable for your seven-year-old. It needs someone who\'s got a bit more experience."',
        transcriptTimestamp: 155
      },
      {
        id: 'c12-t5-q7',
        number: 7,
        type: 'fill-blank',
        prompt: 'Bikes can be hired from [ 7 ] (near the Cruise Ship terminal)',
        correctAnswer: 'Ratchesons',
        acceptableAnswers: ['ratchesons', 'Ratcheson'],
        explanation: 'Audioscript: "It\'s called Ratchesons... R-A-T-C-H-E-S-O-N-S."',
        transcriptTimestamp: 182
      },
      {
        id: 'c12-t5-q8',
        number: 8,
        type: 'fill-blank',
        prompt: 'Cyclists need: a repair kit, food and drink, a [ 8 ] (can be hired)',
        correctAnswer: 'helmet',
        acceptableAnswers: ['a helmet', 'bike helmet'],
        explanation: 'Audioscript: "And I assume I can rent a helmet from the bike place? Sure, you should definitely get that."',
        transcriptTimestamp: 212
      },
      {
        id: 'c12-t5-q9',
        number: 9,
        type: 'fill-blank',
        prompt: 'There are no [ 9 ] or accommodation in the area',
        correctAnswer: 'shops',
        acceptableAnswers: ['shop', 'stores'],
        explanation: 'Audioscript: "...you want to be well prepared because it\'s very remote – you won\'t see any shops round there..."',
        transcriptTimestamp: 236
      },
      {
        id: 'c12-t5-q10',
        number: 10,
        type: 'fill-blank',
        prompt: 'Total cost for whole family of cruise and farm visit: $ [ 10 ]',
        correctAnswer: '267',
        acceptableAnswers: ['267 dollars', '$267'],
        explanation: 'Audioscript: "Then I\'m afraid it\'s $267 because she has to pay the adult fare..."',
        transcriptTimestamp: 275
      }
    ]
  },
  {
    id: 'cam12-t5-s2',
    sectionNumber: 2,
    title: 'Cambridge 12 Test 5 - Section 2: Talk to New Kitchen Assistants',
    context: 'The manager of a busy restaurant, Joy Parkins, gives an orientation talk to newly hired kitchen assistants regarding duties, workplace safety, and team responsibilities.',
    duration: 350,
    narratorVoice: 'en-GB',
    audioSources: [
      {
        label: 'Máy chủ 1: Giọng đọc Cambridge chuẩn (Speech Synthesis HD)',
        url: 'tts-built-in'
      },
      {
        label: 'Máy chủ 2: Audio Stream Trực tuyến (Public Mirror)',
        url: 'https://ia800204.us.archive.org/11/items/ielts-listening-sample-test-01/ielts-listening-p2.mp3'
      }
    ],
    instructions: 'Choose the correct letter, A, B, or C for 11–14; choose TWO letters for 15–16; and match restaurant staff to responsibilities for 17–20.',
    transcript: `JOY PARKINS: Good morning everyone. My name's Joy Parkins and I'm the restaurant manager. And I understand that none of you've had any previous experience as kitchen assistants? Well, you might be feeling a bit nervous now, but most of our kitchen assistants say they enjoy the work. OK, they might get shouted at sometimes, but it's nothing personal, and they're pleased that they have so many different things to do, which means they never get bored. [Q11] And I'll tell you straightaway that if you do well, we might think about moving you up and giving you some more responsibility.

Right, well, you've all shown up on time, which is an excellent start. Now I'm glad to see none of you have unsuitable footwear, so that's good – you need to be careful as the floors can get very wet and slippery. Those of you with long hair have got it well out of the way, but some of you'll need to remove your rings and bracelets – just put them somewhere safe for today, and remember to leave them at home tomorrow, as they can be a safety hazard. [Q12]

Now it's going to be a busy day for you all today – we don't have any tables free for this evening, and only a few for lunch. [Q13] Fortunately we've got our Head Chef back – he was away on holiday all last week which meant the other chefs had extra work. Now, I'll tell you a bit more about the job in a minute but first, some general regulations. For all of you, whatever your age, there's some equipment you mustn't use until you've been properly trained, like the waste disposal system for example, for health and safety reasons. Then I think there are two of you here who are under 18 – that's Emma and Jake, isn't it? Right, so for you two, the meat slicer is out of bounds. [Q14] And of course none of you are allowed to use the electric mixer until you've been shown how it works.

Now you may have heard that this can be a stressful job, and I have to say that can be true. You'll be working an eight-hour day for the first week, though you'll have the chance to do overtime after that as well if you want to. But however long the hours are, you'll get a break in the middle. What you will find is that you're on your feet all day long, lifting and carrying, so if you're not fit now you soon will be! [Q15/16] You'll find you don't have much chance to take it easy – when someone tells you to do something you need to do it straightaway [Q15/16] – but at least we do have a very efficient air conditioning system compared with some kitchens.

Now let me tell you about some of the people you need to know. So as I said, I'm Joy Parkins and I decide who does what during the day and how long they work for. [Q17 - timetables] I'll be trying to get you to work with as many different people in the kitchen as possible, so that you learn while you're on the job. One person whose name you must remember is David Field. If you injure yourself at all, even if it's really minor, you must report to him and he'll make sure the incident is recorded and you get the appropriate treatment. He's trained to give basic treatment to staff himself, or he'll send you off somewhere else if necessary. [Q18 - first aid] Then there's Dexter Wills – he's the person you need to see if you smash a plate or something like that. Don't just leave it and hope no one will notice – it's really important to get things noted and replaced or there could be problems later. [Q19 - breakages] And finally, there's Mike Smith. He's the member of staff who takes care of all the stores of perishables, so if you notice we're getting low in flour or sugar or something, make sure you let him know so he can put in an order. [Q20 - food stocks]`,
    questions: [
      {
        id: 'c12-t5-q11',
        number: 11,
        type: 'multiple-choice',
        prompt: 'According to the manager, what do most people like about the job of kitchen assistant?',
        options: [
          'A. the variety of work',
          'B. the friendly atmosphere',
          'C. the opportunities for promotion'
        ],
        correctAnswer: 'A',
        explanation: 'Audioscript: "...they\'re pleased that they have so many different things to do, which means they never get bored."'
      },
      {
        id: 'c12-t5-q12',
        number: 12,
        type: 'multiple-choice',
        prompt: 'The manager is concerned about some of the new staff’s',
        options: [
          'A. jewellery',
          'B. hair styles',
          'C. shoes'
        ],
        correctAnswer: 'A',
        explanation: 'Audioscript: "...some of you\'ll need to remove your rings and bracelets... as they can be a safety hazard."'
      },
      {
        id: 'c12-t5-q13',
        number: 13,
        type: 'multiple-choice',
        prompt: 'The manager says that the day is likely to be busy for kitchen staff because',
        options: [
          'A. it is a public holiday',
          'B. the head chef is absent',
          'C. the restaurant is almost fully booked'
        ],
        correctAnswer: 'C',
        explanation: 'Audioscript: "...we don\'t have any tables free for this evening, and only a few for lunch."'
      },
      {
        id: 'c12-t5-q14',
        number: 14,
        type: 'multiple-choice',
        prompt: 'Only kitchen staff who are 18 or older are allowed to use',
        options: [
          'A. the waste disposal unit',
          'B. the electric mixer',
          'C. the meat slicer'
        ],
        correctAnswer: 'C',
        explanation: 'Audioscript: "Then I think there are two of you here who are under 18... Right, so for you two, the meat slicer is out of bounds."'
      },
      {
        id: 'c12-t5-q15',
        number: 15,
        type: 'multiple-choice',
        prompt: 'Questions 15 and 16 (Choose TWO letters A–E). According to the manager, which TWO things can make the job stressful? (Choice 1)',
        options: [
          'A. They have to follow orders immediately',
          'B. The kitchen gets very hot',
          'C. They may not be able to take a break',
          'D. They have to do overtime',
          'E. The work is physically demanding'
        ],
        correctAnswer: 'A',
        explanation: 'Audioscript: "when someone tells you to do something you need to do it straightaway" [A] and "you\'re on your feet all day long, lifting and carrying" [E].'
      },
      {
        id: 'c12-t5-q16',
        number: 16,
        type: 'multiple-choice',
        prompt: 'Questions 15 and 16 (Choice 2):',
        options: [
          'A. They have to follow orders immediately',
          'B. The kitchen gets very hot',
          'C. They may not be able to take a break',
          'D. They have to do overtime',
          'E. The work is physically demanding'
        ],
        correctAnswer: 'E',
        explanation: 'Answer is E (physically demanding) or A (follow orders immediately) in either order.'
      },
      {
        id: 'c12-t5-q17',
        number: 17,
        type: 'multiple-choice',
        prompt: 'Responsibility of Joy Parkins (Restaurant Manager):',
        options: [
          'A. training courses',
          'B. food stocks',
          'C. first aid',
          'D. breakages',
          'E. staff discounts',
          'F. timetables'
        ],
        correctAnswer: 'F',
        explanation: 'Audioscript: "I\'m Joy Parkins and I decide who does what during the day and how long they work for." -> F (timetables).'
      },
      {
        id: 'c12-t5-q18',
        number: 18,
        type: 'multiple-choice',
        prompt: 'Responsibility of David Field:',
        options: [
          'A. training courses',
          'B. food stocks',
          'C. first aid',
          'D. breakages',
          'E. staff discounts',
          'F. timetables'
        ],
        correctAnswer: 'C',
        explanation: 'Audioscript: "If you injure yourself at all... report to him... He\'s trained to give basic treatment" -> C (first aid).'
      },
      {
        id: 'c12-t5-q19',
        number: 19,
        type: 'multiple-choice',
        prompt: 'Responsibility of Dexter Wills:',
        options: [
          'A. training courses',
          'B. food stocks',
          'C. first aid',
          'D. breakages',
          'E. staff discounts',
          'F. timetables'
        ],
        correctAnswer: 'D',
        explanation: 'Audioscript: "Then there\'s Dexter Wills – he\'s the person you need to see if you smash a plate..." -> D (breakages).'
      },
      {
        id: 'c12-t5-q20',
        number: 20,
        type: 'multiple-choice',
        prompt: 'Responsibility of Mike Smith:',
        options: [
          'A. training courses',
          'B. food stocks',
          'C. first aid',
          'D. breakages',
          'E. staff discounts',
          'F. timetables'
        ],
        correctAnswer: 'B',
        explanation: 'Audioscript: "Mike Smith... takes care of all the stores of perishables... low in flour or sugar..." -> B (food stocks).'
      }
    ]
  },
  {
    id: 'cam12-t8-s1',
    sectionNumber: 3,
    title: 'Cambridge 12 Test 8 - Section 1: Cycle Tour Leader Applicant Enquiry',
    context: 'Margaret Smith enquires with Bob at Pembroke Cycling Holidays about becoming a cycle tour leader for summer expeditions.',
    duration: 320,
    narratorVoice: 'en-GB',
    audioSources: [
      {
        label: 'Máy chủ 1: Giọng đọc Cambridge chuẩn (Speech Synthesis HD)',
        url: 'tts-built-in'
      },
      {
        label: 'Máy chủ 2: Audio Stream Trực tuyến (Public Mirror)',
        url: 'https://ia600204.us.archive.org/11/items/ielts-listening-sample-test-01/ielts-listening-p3.mp3'
      }
    ],
    instructions: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
    transcript: `BOB: Hello, Pembroke Cycling Holidays, Bob speaking.
MARGARET: Oh hello. I've seen your advert for people to lead cycle trips. Are you the right person to speak to?
BOB: Yes, I am. Could I have your name, please?
MARGARET: It's Margaret Smith.
BOB: Are you looking for a permanent job, Margaret?
MARGARET: No, temporary. I've got a permanent job starting in a few months' time, and I want to do something else until then. [Q1]
BOB: What work do you do?
MARGARET: This will probably sound crazy – I used to be a lawyer, and then I made a complete career change and I'm going to be a doctor. I've just finished my training. [Q2]
BOB: Right. And have you had any experience of leading cycle trips?
MARGARET: Yes, I've led several bike tours in Africa. The trip to India that I had arranged to lead next month has now been cancelled, so when I saw you were advertising for tour leaders, I decided to apply. [Q3]
BOB: OK. Now we normally have two or three leaders on a trip, depending on the size of the group. Some tours are for very experienced cyclists, but we've got a tour coming up soon in Spain, which is proving so popular we need an additional leader. It's a cycling holiday for families. Would that suit you?
MARGARET: It certainly would. I enjoy working with children, and I probably need some more experience before I go on a really challenging trip.
BOB: That tour includes several teenagers: have you worked with that age group before?
MARGARET: Yes, I'm a volunteer worker in a youth club, where I help people to improve their cycling skills. Before that I helped out in a cycling club where I taught beginners. [Q4]
BOB: Well that's great. Now the trip I mentioned is just for a fortnight, but there might be the possibility of leading other tours after that. Would that fit in with your plans?
MARGARET: That'd be fine. I'll be free for five months. My job is due to start on October the 2nd, and I'm available from May the 1st until late September. [Q5]
BOB: Good. Now is there anything I need to know about the food you eat? We usually have one or two people in the group who don't eat meat, or have some sort of food allergy, so we're always very careful about that.
MARGARET: Yes, I'm allergic to cheese. Would that be a problem? [Q6]
BOB: No, as long as we have enough notice, we can deal with that.
MARGARET: That's great. Could you send the application form to 27 Arbuthnot Place – A-R-B-U-T-H-N-O-T – Place, Dumfries. [Q7]
BOB: And what's the postcode, please?
MARGARET: DG7 4PH. [Q8]
BOB: Got that. If you could return the application form by Friday this week, we can interview you on Tuesday next week. Say half past two. Would that be possible for you? [Q9]
MARGARET: Yes, it's fine.
BOB: And at the interview we'd like to find out about your experience of being a tour guide, so could you prepare a ten-minute talk about that, please? You don't need slides or any complicated equipment – just some notes. [Q10]
MARGARET: Right. I'll start thinking about that straightaway!`,
    questions: [
      {
        id: 'c12-t8-q1',
        number: 1,
        type: 'fill-blank',
        prompt: 'Applicant wants a [ 1 ] job',
        correctAnswer: 'temporary',
        acceptableAnswers: ['a temporary'],
        explanation: 'Audioscript: "No, temporary. I\'ve got a permanent job starting in a few months\' time..."'
      },
      {
        id: 'c12-t8-q2',
        number: 2,
        type: 'fill-blank',
        prompt: 'Will soon start work as a [ 2 ]',
        correctAnswer: 'doctor',
        acceptableAnswers: ['a doctor'],
        explanation: 'Audioscript: "...and I\'m going to be a doctor. I\'ve just finished my training."'
      },
      {
        id: 'c12-t8-q3',
        number: 3,
        type: 'fill-blank',
        prompt: 'Has led cycle trips in [ 3 ]',
        correctAnswer: 'Africa',
        acceptableAnswers: ['africa'],
        explanation: 'Audioscript: "Yes, I\'ve led several bike tours in Africa."'
      },
      {
        id: 'c12-t8-q4',
        number: 4,
        type: 'fill-blank',
        prompt: 'Is currently doing voluntary work with members of a [ 4 ] club',
        correctAnswer: 'youth',
        acceptableAnswers: ['a youth'],
        explanation: 'Audioscript: "Yes, I\'m a volunteer worker in a youth club..."'
      },
      {
        id: 'c12-t8-q5',
        number: 5,
        type: 'fill-blank',
        prompt: 'Available for five months from the 1st of [ 5 ]',
        correctAnswer: 'May',
        acceptableAnswers: ['may', '1st May'],
        explanation: 'Audioscript: "...and I\'m available from May the 1st until late September."'
      },
      {
        id: 'c12-t8-q6',
        number: 6,
        type: 'fill-blank',
        prompt: 'Can’t eat [ 6 ]',
        correctAnswer: 'cheese',
        acceptableAnswers: ['dairy cheese'],
        explanation: 'Audioscript: "Yes, I\'m allergic to cheese. Would that be a problem?"'
      },
      {
        id: 'c12-t8-q7',
        number: 7,
        type: 'fill-blank',
        prompt: 'Address: 27 [ 7 ] Place, Dumfries',
        correctAnswer: 'Arbuthnot',
        acceptableAnswers: ['arbuthnot'],
        explanation: 'Audioscript: "Could you send it to 27 Arbuthnot Place – A-R-B-U-T-H-N-O-T – Place..."'
      },
      {
        id: 'c12-t8-q8',
        number: 8,
        type: 'fill-blank',
        prompt: 'Postcode: [ 8 ]',
        correctAnswer: 'DG7 4PH',
        acceptableAnswers: ['dg7 4ph', 'DG74PH'],
        explanation: 'Audioscript: "DG7 4PH."'
      },
      {
        id: 'c12-t8-q9',
        number: 9,
        type: 'fill-blank',
        prompt: 'Interview at 2.30 pm on [ 9 ]',
        correctAnswer: 'Tuesday',
        acceptableAnswers: ['tuesday'],
        explanation: 'Audioscript: "...we can interview you on Tuesday next week. Say half past two."'
      },
      {
        id: 'c12-t8-q10',
        number: 10,
        type: 'fill-blank',
        prompt: 'Will plan a short 10-minute [ 10 ] about being a tour guide',
        correctAnswer: 'talk',
        acceptableAnswers: ['presentation', 'talk/presentation'],
        explanation: 'Audioscript: "...so could you prepare a ten-minute talk about that, please?"'
      }
    ]
  }
];
