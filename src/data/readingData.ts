import { ReadingPassage } from '../types';

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'cam12-t5-r1',
    passageNumber: 1,
    title: 'Cambridge 12 Test 5 - Section 1: UK Festivals & Big Rock Climbing Centre',
    subtitle: 'Authentic examination paper from Cambridge IELTS 12 General Training',
    topic: 'Leisure, Community Events & Recreation',
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
        text: 'Springwatch Festival: The much loved television series Springwatch celebrates the countryside as it does every year, with sheep herding, wood carving demonstrations, insect hunts and more activities, accompanied by live music and a great farmers’ market, offering all sorts of mouth-watering produce.'
      },
      {
        label: 'D',
        text: 'Wychwood Music Festival: Rightly nominated for the best family festival award every year since it began in 2005, this festival offers a combination of different music genres – many featuring artists from around the Wychwood area – and comedy, alongside a selection of outdoor cafés serving amazing world foods.'
      },
      {
        label: 'E',
        text: 'Love Food Festival: Bringing together a selection of the finest produce, this festival aims to educate visitors about how food should be produced and where it should come from, through sampling a range of tasty treats, cooked on site.'
      },
      {
        label: 'F',
        text: 'The 3 Wishes Faery Festival: The UK’s most magical event, this is a three-day festival of folk art, live music and fashion shows set in the beautiful wild surroundings of Bodmin Moor. If you don’t fancy taking a tent, some local residents usually offer to put visitors up.'
      },
      {
        label: 'G',
        text: 'Bath International Dance Festival: Featuring demonstrations from world champion dancers and stars from the TV series Strictly Come Dancing, the festival promises toe-tapping action, including a world-record attempt, where everyone is invited to join in.'
      },
      {
        label: 'Text 2 - Big Rock Climbing Centre',
        text: `Big Rock Climbing Centre is a modern, friendly, professionally run centre offering over 1,250 square metres of fantastic indoor climbing. We use trained and experienced instructors to give you the opportunity to learn and develop climbing skills, keep fit and have fun. Master our 11 m-high climbing walls, using a rope harness, for an unbeatable sense of achievement. Or experience the thrills of climbing without any harness in our special low-level arena, which has foam mats on the floor to cushion any fall safely.

Who is Big Rock for?
Almost anyone can enjoy Big Rock. Previous climbing experience and specialist equipment are not required. You can come on your own or with friends and family. Come as a fun alternative to the gym or for a special day out with the kids. If you're visiting with friends or family but not climbing, or just fancy coming to look, please feel free to relax in our excellent café overlooking the climbing areas.

Mobile Climbing Wall
Available on a day hire basis at any location, the Big Rock Mobile Climbing Wall is the perfect way to enhance any show, festival or event. The mobile wall can be used indoors or outdoors and features four unique 7.3 m-high climbing faces designed to allow four people to climb simultaneously. Quick to set up and pack up, the Mobile Climbing Wall is staffed by qualified and experienced climbing instructors, providing the opportunity to climb the wall in a controlled and safe environment. When considering what to wear, we've found that trousers and t-shirts are ideal. We will, however, ask people to remove scarves. Most flat shoes are suitable as long as they're enclosed and support the foot. The mobile wall is very adaptable and can be operated in light rain and winds up to 50 kph. There are, however, particular measures that we take in such conditions.

What about hiring the Mobile Climbing Wall for my school or college?
As climbing is different from the usual team games practised at schools, we've found that some students who don't usually like participating in sports are willing to have a go on the mobile climbing wall. If you're concerned that some children may not want to take part because they feel nervous if they climb, then please be assured that our instructors will support them up to a level which they're comfortable with. They will still benefit greatly from the experience.`
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
        explanation: 'Section G (Bath International Dance Festival) mentions: "...including a world-record attempt, where everyone is invited to join in."',
        paragraphReference: 'Section G'
      },
      {
        id: 'c12-r1-q2',
        number: 2,
        type: 'multiple-choice',
        prompt: 'People can listen to local musicians here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'D',
        explanation: 'Section D (Wychwood Music Festival): "...many featuring artists from around the Wychwood area..."',
        paragraphReference: 'Section D'
      },
      {
        id: 'c12-r1-q3',
        number: 3,
        type: 'multiple-choice',
        prompt: 'At this festival, people can listen to music in lots of different places.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'B',
        explanation: 'Section B (The Great Escape): "...more than 300 bands will perform to around 10,000 people in 30-plus venues..."',
        paragraphReference: 'Section B'
      },
      {
        id: 'c12-r1-q4',
        number: 4,
        type: 'multiple-choice',
        prompt: 'It is not necessary to pay for one of the events here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'A',
        explanation: 'Section A (Bath International Music Festival): "Starting with a great night of free music, \'Party in the City\' this year..."',
        paragraphReference: 'Section A'
      },
      {
        id: 'c12-r1-q5',
        number: 5,
        type: 'multiple-choice',
        prompt: 'It is possible to stay overnight at this festival.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'F',
        explanation: 'Section F (The 3 Wishes Faery Festival): "...If you don\'t fancy taking a tent, some local residents usually offer to put visitors up."',
        paragraphReference: 'Section F'
      },
      {
        id: 'c12-r1-q6',
        number: 6,
        type: 'multiple-choice',
        prompt: 'Children will enjoy this festival.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'D',
        explanation: 'Section D: "Rightly nominated for the best family festival award every year since it began in 2005..."',
        paragraphReference: 'Section D'
      },
      {
        id: 'c12-r1-q7',
        number: 7,
        type: 'multiple-choice',
        prompt: 'Visitors can get advice here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'E',
        explanation: 'Section E (Love Food Festival): "...aims to educate visitors about how food should be produced and where it should come from..."',
        paragraphReference: 'Section E'
      },
      {
        id: 'c12-r1-q8',
        number: 8,
        type: 'multiple-choice',
        prompt: 'People can watch craftspeople at work here.',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'C',
        explanation: 'Section C (Springwatch Festival): "...with sheep herding, wood carving demonstrations, insect hunts..."',
        paragraphReference: 'Section C'
      },
      {
        id: 'c12-r1-q9',
        number: 9,
        type: 'true-false-notgiven',
        prompt: 'When climbing at the Big Rock Centre, it is compulsory to be attached by a rope.',
        correctAnswer: 'FALSE',
        explanation: 'Text states: "Or experience the thrills of climbing without any harness in our special low-level arena..." -> not compulsory.',
        paragraphReference: 'Text 2 - Big Rock'
      },
      {
        id: 'c12-r1-q10',
        number: 10,
        type: 'true-false-notgiven',
        prompt: 'People who just want to watch the climbing can enter the Centre without paying.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'The text states non-climbers can relax in the café, but does not state whether admission is free or paid for spectators.',
        paragraphReference: 'Text 2 - Who is Big Rock for?'
      },
      {
        id: 'c12-r1-q11',
        number: 11,
        type: 'true-false-notgiven',
        prompt: 'People can arrange to have a climbing session in their own garden if they wish.',
        correctAnswer: 'TRUE',
        explanation: 'The Mobile Climbing Wall is "Available on a day hire basis at any location... indoors or outdoors".',
        paragraphReference: 'Text 2 - Mobile Climbing Wall'
      },
      {
        id: 'c12-r1-q12',
        number: 12,
        type: 'true-false-notgiven',
        prompt: 'A certain item of clothing is forbidden for participants.',
        correctAnswer: 'TRUE',
        explanation: '"We will, however, ask people to remove scarves." -> scarves are forbidden.',
        paragraphReference: 'Text 2 - Mobile Climbing Wall'
      },
      {
        id: 'c12-r1-q13',
        number: 13,
        type: 'true-false-notgiven',
        prompt: 'The Mobile Climbing Wall can only be used in dry, calm weather.',
        correctAnswer: 'FALSE',
        explanation: 'Text clearly says: "...can be operated in light rain and winds up to 50 kph."',
        paragraphReference: 'Text 2 - Mobile Climbing Wall'
      },
      {
        id: 'c12-r1-q14',
        number: 14,
        type: 'true-false-notgiven',
        prompt: 'It is inadvisable for children who are afraid of heights to use the Mobile Climbing Wall.',
        correctAnswer: 'FALSE',
        explanation: 'Text contradicts this: instructors support them to a level they are comfortable with and they will still benefit greatly.',
        paragraphReference: 'Text 2 - School hiring'
      }
    ]
  },
  {
    id: 'cam12-t5-r2',
    passageNumber: 2,
    title: 'Cambridge 12 Test 5 - Section 2: Marketing Advice & Working Time Regulations',
    subtitle: 'Workplace information and operational regulations from Cambridge IELTS 12',
    topic: 'Employment, Business & Regulations',
    content: [
      {
        label: 'Text 1: Marketing advice for new businesses',
        text: `If you're setting up your own business, here's some advice on getting customers.

Know where your customers look
Your customers aren't necessarily where you think they are. So if you're advertising where they're just not looking, it's wasted money. That's why it pays to do a bit of research. Every time someone contacts your company, ask them where they found out about you. And act on this information so you're advertising in the right places.

Always think like a customer
What makes your customers tick? Find out, and you're halfway to saying the right things in your advertising. So take the time to ask them. A simple phone or email survey of your own customers, politely asking why they use you, what they really like and what they don't, is invaluable.

Make sure customers know you're there
If a customer can't see you, they can't buy from you. There are loads of opportunities to promote your business – print, press, direct mail, telemarketing, email and the internet – and using a mix of these increases your chances of being seen (and remembered).

Ignore your customers and they'll go away
It sounds obvious, but companies who talk to their customers have much better retention rates than those that don't, so it's worth staying in touch. Capture your customers' email addresses upfront. Follow up a transaction to check they're happy with the service and, if possible, send them updates that are helpful, informative and relevant.

Know what works (and what doesn't)
Do what the professionals do, and measure all your advertising. That'll tell you what you're doing right – and where there's room for improvement. You never know, it might just throw up some information that could change your business for the better.

Remember word-of-mouth: the best advertising there is
A recent survey found that consumers are 50% more likely to be influenced by word-of-mouth recommendations than by TV or radio ads. So your reputation is your greatest asset. If your current customers are impressed with your company, they'll be more inclined to recommend you to others.`
      },
      {
        label: 'Text 2: Working Time Regulations for Mobile Workers',
        text: `These rules apply to drivers and crew of heavy goods vehicles or public service vehicles. The rules limit the amount of time that can be worked.
Those defined in the Regulations as being self-employed are currently not covered by the Regulations.

What are the limits?
• An average of 48 hours' work per week.
• In any single week up to 60 hours can be worked so long as the 48-hour average is maintained.
• Night work is limited to 10 hours per night, unless there is a workforce agreement to work longer.
• Statutory annual leave and any sick leave and/or maternity/paternity leave counts as working time.

What counts as work?
In general, any activities performed in connection with the transport operation count as work, for example, driving, loading/unloading and those checks that are the responsibility of drivers, such as checking lights, brakes, etc. There are a number of periods of time that do not count as work, for example, travelling between home and your normal place of work, lunch or other breaks and periods of availability.

Periods of availability are periods of time during which the mobile worker is not required to remain at their workstation but is required to be available for work, the foreseeable duration of which is known about in advance, for example:
• Delays at a distribution centre.
• Reporting for work then being informed that no duties are to be undertaken for a specified period.
• Accompanying a vehicle being transported, for example by train.
A period of availability can be taken at the workstation. Providing the worker has a reasonable amount of freedom (e.g. they can read and relax) for a known duration, this could satisfy the requirements of a period of availability.

Situations when a period of time should not be recorded as a period of availability:
• Hold-ups due to congestion, because the driver would be stopping and starting the vehicle.
• Frequently moving up within a queue (e.g. waiting within a queue to load or unload) every other minute.`
      }
    ],
    questions: [
      {
        id: 'c12-r2-q15',
        number: 15,
        type: 'summary-completion',
        prompt: 'Some [ 15 ] will help you to discover the most effective places to advertise.',
        correctAnswer: 'research',
        explanation: 'Text: "That\'s why it pays to do a bit of research."',
        paragraphReference: 'Text 1 - Know where your customers look'
      },
      {
        id: 'c12-r2-q16',
        number: 16,
        type: 'summary-completion',
        prompt: 'A [ 16 ] of your customers will show you how they feel about your company.',
        correctAnswer: 'survey',
        explanation: 'Text: "A simple phone or email survey of your own customers... is invaluable."',
        paragraphReference: 'Text 1 - Always think like a customer'
      },
      {
        id: 'c12-r2-q17',
        number: 17,
        type: 'summary-completion',
        prompt: 'A [ 17 ] of forms of advertising will make it more likely that potential customers will find out about you.',
        correctAnswer: 'mix',
        explanation: 'Text: "...and using a mix of these increases your chances of being seen..."',
        paragraphReference: 'Text 1 - Make sure customers know you\'re there'
      },
      {
        id: 'c12-r2-q18',
        number: 18,
        type: 'summary-completion',
        prompt: 'If you can, provide customers with useful [ 18 ] about your business.',
        correctAnswer: 'updates',
        explanation: 'Text: "...send them updates that are helpful, informative and relevant."',
        paragraphReference: 'Text 1 - Ignore your customers'
      },
      {
        id: 'c12-r2-q19',
        number: 19,
        type: 'summary-completion',
        prompt: 'Measuring the effects of your advertising can give you [ 19 ] that will improve your business.',
        correctAnswer: 'information',
        explanation: 'Text: "...it might just throw up some information that could change your business for the better."',
        paragraphReference: 'Text 1 - Know what works'
      },
      {
        id: 'c12-r2-q20',
        number: 20,
        type: 'summary-completion',
        prompt: 'Success in finding new customers largely depends on your [ 20 ].',
        correctAnswer: 'reputation',
        explanation: 'Text: "So your reputation is your greatest asset."',
        paragraphReference: 'Text 1 - Word-of-mouth'
      },
      {
        id: 'c12-r2-q21',
        number: 21,
        type: 'summary-completion',
        prompt: 'These regulations apply to people working on lorries, buses, etc. They don\'t apply to [ 21 ] workers.',
        correctAnswer: 'self-employed',
        explanation: 'Text: "Those defined in the Regulations as being self-employed are currently not covered..."',
        paragraphReference: 'Text 2 - Working Time Regulations'
      },
      {
        id: 'c12-r2-q22',
        number: 22,
        type: 'summary-completion',
        prompt: 'Maximum working hours: 60 hours a week, provided the [ 22 ] is no more than 48 hours.',
        correctAnswer: 'average',
        explanation: 'Text: "...so long as the 48-hour average is maintained."',
        paragraphReference: 'Text 2 - What are the limits?'
      },
      {
        id: 'c12-r2-q23',
        number: 23,
        type: 'summary-completion',
        prompt: 'Night work can be more than 10 hours with the [ 23 ] of the workers.',
        correctAnswer: 'agreement',
        explanation: 'Text: "...unless there is a workforce agreement to work longer."',
        paragraphReference: 'Text 2 - What are the limits?'
      },
      {
        id: 'c12-r2-q24',
        number: 24,
        type: 'summary-completion',
        prompt: 'Work includes driving, loading and unloading, and carrying out various [ 24 ] of the vehicle.',
        correctAnswer: 'checks',
        explanation: 'Text: "...and those checks that are the responsibility of drivers..."',
        paragraphReference: 'Text 2 - What counts as work?'
      },
      {
        id: 'c12-r2-q25',
        number: 25,
        type: 'summary-completion',
        prompt: 'Periods of availability include: going on a [ 25 ] or other form of transport with a vehicle',
        correctAnswer: 'train',
        explanation: 'Text: "Accompanying a vehicle being transported, for example by train."',
        paragraphReference: 'Text 2 - Periods of availability'
      },
      {
        id: 'c12-r2-q26',
        number: 26,
        type: 'summary-completion',
        prompt: 'A period at the workstation when the driver has some [ 26 ] might count as a period of availability',
        correctAnswer: 'freedom',
        explanation: 'Text: "Providing the worker has a reasonable amount of freedom (e.g. they can read and relax)..."',
        paragraphReference: 'Text 2 - Periods of availability'
      },
      {
        id: 'c12-r2-q27',
        number: 27,
        type: 'summary-completion',
        prompt: 'Periods of availability exclude: time spent stopping and starting the vehicle when [ 27 ] causes delays',
        correctAnswer: 'congestion',
        explanation: 'Text: "Hold-ups due to congestion, because the driver would be stopping and starting the vehicle."',
        paragraphReference: 'Text 2 - Exclusions'
      }
    ]
  },
  {
    id: 'cam12-t5-r3',
    passageNumber: 3,
    title: 'Cambridge 12 Test 5 - Section 3: A Brief History of Automata',
    subtitle: 'From Hellenistic clockwork to Enlightenment mechanical wonders',
    topic: 'History of Technology & Engineering',
    content: [
      {
        label: 'A',
        text: 'An automaton is a machine, usually made to resemble a person or animal, that operates on its own, once it has been started. Although few are constructed nowadays, they have a history stretching back well over two thousand years. Several myths show that the ancient Greeks were interested in the creation of automata. In one, Hephaestus, the god of all mechanical arts, was reputed to have made two female statues of pure gold which assisted him and accompanied him wherever he went. As well as giving automata a place in mythology, the Greeks almost certainly created some. These were probably activated by levers and powered by human action, although there are descriptions of steam and water being used as sources of power. Automata were sometimes intended as toys, or as tools for demonstrating basic scientific principles.'
      },
      {
        label: 'B',
        text: 'Other ancient cultures, too, seem to have developed automata. In Egypt, Ctesibius experimented with air pressure and pneumatic principles. One of his creations was a singing blackbird powered by water. A Chinese text of the third century BC describes a life-size, human-shaped figure that could walk rapidly, move its head up and down, sing and wink its eye.'
      },
      {
        label: 'C',
        text: 'Much later, Arab engineers of the ninth and thirteenth centuries wrote detailed treatises on how to build programmable musical fountains, mechanical servants, and elaborate clocks. A ninth-century ruler in Baghdad had a silver and gold tree with metal birds that sang. The art of creating automata developed considerably during the fifteenth century, linked with improvements in clock making: the mechanisms of automata and clocks had a great deal in common. Some truly remarkable automata were produced at this time. Muller was reputed to have made an artificial eagle which flew to greet the Emperor on his entry into Nuremberg, Germany, in 1470, then returned to perch on top of a city gate and, by stretching its wings and bowing, saluted the emperor on his arrival. Leonardo da Vinci made a lion in honour of the king of France, which advanced towards him, stopped, opened its chest with a claw and pointed to the French coat of arms.'
      },
      {
        label: 'D',
        text: 'Automata were normally very expensive toys for the very rich. They were made for royal or aristocratic patrons, to be viewed only by themselves and selected guests – who were expected to be impressed by their wealth. Automata were also created for public show, however, and many appeared on clock towers, such as the one in Bern, Switzerland, built in 1530.'
      },
      {
        label: 'E',
        text: 'During the eighteenth century, some watchmakers made automata to contribute to the progress of medicine and the natural sciences, particularly to investigate the mechanical laws governing the structure and movement of living things. Many of their creations simulated almost perfectly the complex structure of human beings and animals. Maillardet made extensive use of gearing and cogs to produce automata of horses, worked by turning a handle. Vaucanson produced a duck made of gilded copper which ate, drank and quacked like a real duck. He also made a life-size female flute player. Air passes through the complex mechanism, causing the lips and fingers of the player to move naturally on the flute, opening and closing holes on it. This automaton had a repertoire of twelve tunes.'
      },
      {
        label: 'F',
        text: 'In another well-known piece, Merlin\'s silver swan made in 1773, the swan sits in a stream consisting of glass rods where small silver fish are swimming. When the clockwork is wound, a music box plays and the glass rods rotate, giving the impression of a flowing stream. The swan turns its head from side to side. It soon notices the fish and bends down to catch and eat one, then raises its head to the upright position. The mechanism still works.'
      },
      {
        label: 'G',
        text: 'One of the most skilled makers of automata was the Swiss watchmaker Jaquet-Droz. He produced three automata which, even today, are considered wonders of science and mechanical engineering. One of these, The Writer, simulates a boy sitting at a desk, dipping his pen into the ink and writing perfectly legibly. Another stunning creation was the Mechanical Theatre at Salzburg, completed in 1752, depicting 18th-century court life and industrious artisans powered by water wheels.'
      }
    ],
    questions: [
      {
        id: 'c12-r3-q28',
        number: 28,
        type: 'summary-completion',
        prompt: 'The ancient Greeks had a number of [ 28 ] concerning automata.',
        correctAnswer: 'myths',
        explanation: 'Text: "Several myths show that the ancient Greeks were interested in the creation of automata."',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'c12-r3-q29',
        number: 29,
        type: 'summary-completion',
        prompt: 'The mechanism which controlled them consisted of [ 29 ] which were worked by human operators.',
        correctAnswer: 'levers',
        explanation: 'Text: "These were probably activated by levers and powered by human action..."',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'c12-r3-q30',
        number: 30,
        type: 'summary-completion',
        prompt: 'Some automata were designed to be [ 30 ] with an educational purpose.',
        correctAnswer: 'tools',
        explanation: 'Text: "...or as tools for demonstrating basic scientific principles."',
        paragraphReference: 'Paragraph A'
      },
      {
        id: 'c12-r3-q31',
        number: 31,
        type: 'multiple-choice',
        prompt: 'Created an automaton that represented a bird in water, interacting with its surroundings:',
        options: ['A. Ctesibius', 'B. Arab engineers', 'C. da Vinci', 'D. Maillardet', 'E. Vaucanson', 'F. Merlin', 'G. Jaquet-Droz'],
        correctAnswer: 'F',
        explanation: 'Merlin created the silver swan in a stream catching silver fish (Paragraph F).',
        paragraphReference: 'Paragraph F'
      },
      {
        id: 'c12-r3-q32',
        number: 32,
        type: 'multiple-choice',
        prompt: 'Created an automaton that performed on a musical instrument:',
        options: ['A. Ctesibius', 'B. Arab engineers', 'C. da Vinci', 'D. Maillardet', 'E. Vaucanson', 'F. Merlin', 'G. Jaquet-Droz'],
        correctAnswer: 'E',
        explanation: 'Vaucanson made a life-size female flute player playing 12 tunes (Paragraph E).',
        paragraphReference: 'Paragraph E'
      },
      {
        id: 'c12-r3-q33',
        number: 33,
        type: 'multiple-choice',
        prompt: 'Produced documents about how to create automata:',
        options: ['A. Ctesibius', 'B. Arab engineers', 'C. da Vinci', 'D. Maillardet', 'E. Vaucanson', 'F. Merlin', 'G. Jaquet-Droz'],
        correctAnswer: 'B',
        explanation: 'Arab engineers wrote detailed treatises on how to build automata (Paragraph C).',
        paragraphReference: 'Paragraph C'
      },
      {
        id: 'c12-r3-q34',
        number: 34,
        type: 'multiple-choice',
        prompt: 'Created automata which required a human being to operate the mechanism:',
        options: ['A. Ctesibius', 'B. Arab engineers', 'C. da Vinci', 'D. Maillardet', 'E. Vaucanson', 'F. Merlin', 'G. Jaquet-Droz'],
        correctAnswer: 'D',
        explanation: 'Maillardet made automata of horses "worked by turning a handle" (Paragraph E).',
        paragraphReference: 'Paragraph E'
      },
      {
        id: 'c12-r3-q35',
        number: 35,
        type: 'multiple-choice',
        prompt: 'Used air and water power:',
        options: ['A. Ctesibius', 'B. Arab engineers', 'C. da Vinci', 'D. Maillardet', 'E. Vaucanson', 'F. Merlin', 'G. Jaquet-Droz'],
        correctAnswer: 'A',
        explanation: 'Ctesibius experimented with air pressure (pneumatics) and singing blackbird powered by water (Paragraph B).',
        paragraphReference: 'Paragraph B'
      },
      {
        id: 'c12-r3-q36',
        number: 36,
        type: 'summary-completion',
        prompt: 'The Mechanical Theatre shows court life inside a [ 36 ].',
        correctAnswer: 'palace',
        explanation: 'Text: "The figures inside a palace depict eighteenth-century court life..."',
        paragraphReference: 'Paragraph G'
      },
      {
        id: 'c12-r3-q37',
        number: 37,
        type: 'summary-completion',
        prompt: 'In the Mechanical Theatre, building workers, butchers and a barber represent various [ 37 ] of the time.',
        correctAnswer: 'trades',
        explanation: 'Text: "...demonstrate all manner of trades of the period..."',
        paragraphReference: 'Paragraph G'
      },
      {
        id: 'c12-r3-q38',
        number: 38,
        type: 'summary-completion',
        prompt: '[ 38 ] provides the power that operates the Mechanical Theatre.',
        correctAnswer: 'water',
        explanation: 'Text: "...consisting of hidden waterwheels, copper wiring and cogwheels."',
        paragraphReference: 'Paragraph G'
      },
      {
        id: 'c12-r3-q39',
        number: 39,
        type: 'summary-completion',
        prompt: 'New [ 39 ] that developed in the nineteenth century reduced the cost of the production of automata.',
        correctAnswer: 'techniques',
        explanation: 'Text: "During the nineteenth century, mass production techniques meant that automata could be made cheaply..."',
        paragraphReference: 'Paragraph G'
      },
      {
        id: 'c12-r3-q40',
        number: 40,
        type: 'summary-completion',
        prompt: 'During the nineteenth century, most automata were intended for use by [ 40 ].',
        correctAnswer: 'children',
        explanation: 'Text: "...and they became toys for children rather than an expensive adult amusement."',
        paragraphReference: 'Paragraph G'
      }
    ]
  }
];
