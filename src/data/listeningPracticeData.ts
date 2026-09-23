import { ListeningSection } from '../types';

export const LISTENING_PRACTICE_SECTIONS: ListeningSection[] = [
  {
    id: 'practice-l-map-labelling',
    sourceId: 'src-practice-listening-sets',
    title: 'Listening Drill: Map & Plan Labelling (Sports Complex)',
    part: 2,
    sectionNumber: 2,
    context: 'A facility manager directing visitors around the newly refurbished Riverside Sports & Wellness Complex.',
    instructions: 'Label the map below. Write the correct letter, A-E, next to questions 1-4.',
    duration: 320,
    narratorVoice: 'en-GB',
    createdFrom: 'generated',
    copyrightStatus: 'original-content',
    verificationStatus: 'verified',
    audioSources: [
      {
        label: 'Browser TTS – practice fallback',
        url: '',
        isSynthetic: true
      }
    ],
    transcript: `MANAGER: Good morning and welcome to Riverside Sports Complex. Let me orient you to our main building layout.
As you enter through the main foyer doors, the reception desk is immediately ahead of you.
To your left, running along the west wall, is the main Olympic Swimming Pool.
If you walk past reception and turn right down the central corridor, the first door on your immediate right leads into the newly equipped Fitness Gymnasium.
Continuing past the gym to the far eastern corner, you will find the Squash Courts.
Directly opposite the squash courts on the northern side of the corridor is the Sports Cafe and Lounge.
Finally, the Locker and Changing Rooms are located right between the swimming pool and the reception foyer on the south-west side.`,
    questions: [
      {
        id: 'pmap-q1',
        number: 1,
        type: 'map-labelling',
        prompt: 'Fitness Gymnasium is located at:',
        options: [
          'A. Immediately on the right down the central corridor',
          'B. Running along the west wall',
          'C. At the far eastern corner',
          'D. Opposite the squash courts'
        ],
        correctAnswer: 'A. Immediately on the right down the central corridor',
        explanation: 'Manager says: "turn right down the central corridor, the first door on your immediate right leads into the newly equipped Fitness Gymnasium."',
        explanationVi: 'Người quản lý chỉ đường: rẽ phải vào hành lang chính, cửa đầu tiên ngay bên tay phải là phòng tập Gym.',
        answerSentence: 'turn right down the central corridor, the first door on your immediate right leads into the newly equipped Fitness Gymnasium.',
        distractor: 'west wall (swimming pool) or eastern corner (squash courts)',
        distractorNote: 'Phải theo dõi kỹ chuyển động định hướng: rẽ phải, cửa đầu tiên.',
        paraphraseNote: 'first door on your immediate right'
      },
      {
        id: 'pmap-q2',
        number: 2,
        type: 'map-labelling',
        prompt: 'Squash Courts are situated at:',
        options: [
          'A. To the left along the west wall',
          'B. At the far eastern corner of the corridor',
          'C. Directly between pool and reception',
          'D. Right in front of the main foyer doors'
        ],
        correctAnswer: 'B. At the far eastern corner of the corridor',
        explanation: 'Manager notes: "Continuing past the gym to the far eastern corner, you will find the Squash Courts."',
        explanationVi: 'Đi tiếp qua phòng gym tới góc xa nhất phía đông là sân bóng quần (Squash Courts).',
        answerSentence: 'Continuing past the gym to the far eastern corner, you will find the Squash Courts.',
        distractor: 'Sports Cafe (opposite)',
        distractorNote: 'Góc xa phía đông (far eastern corner) đối diện với quán Cafe.',
        paraphraseNote: 'far eastern corner'
      },
      {
        id: 'pmap-q3',
        number: 3,
        type: 'map-labelling',
        prompt: 'The Sports Cafe and Lounge is positioned:',
        options: [
          'A. On the west wall',
          'B. Next to the main reception desk',
          'C. Directly opposite the squash courts on the northern side',
          'D. In the basement'
        ],
        correctAnswer: 'C. Directly opposite the squash courts on the northern side',
        explanation: 'Manager confirms: "Directly opposite the squash courts on the northern side of the corridor is the Sports Cafe and Lounge."',
        explanationVi: 'Đối diện trực tiếp với sân bóng quần ở phía bắc của hành lang là quán Cafe thể thao.',
        answerSentence: 'Directly opposite the squash courts on the northern side of the corridor is the Sports Cafe and Lounge.',
        distractor: 'Squash courts',
        distractorNote: 'Cụm từ "directly opposite" chỉ vị trí đối diện bờ tường bên kia.',
        paraphraseNote: 'directly opposite'
      },
      {
        id: 'pmap-q4',
        number: 4,
        type: 'map-labelling',
        prompt: 'Locker and Changing Rooms are situated:',
        options: [
          'A. In the far eastern corner',
          'B. Right between the swimming pool and the reception foyer',
          'C. Inside the fitness gym',
          'D. Outside the main entrance'
        ],
        correctAnswer: 'B. Right between the swimming pool and the reception foyer',
        explanation: 'Manager: "Locker and Changing Rooms are located right between the swimming pool and the reception foyer on the south-west side."',
        explanationVi: 'Phòng thay đồ và tủ gửi đồ nằm kẹp giữa bể bơi và sảnh tiếp tân.',
        answerSentence: 'Locker and Changing Rooms are located right between the swimming pool and the reception foyer on the south-west side.',
        distractor: 'None',
        distractorNote: 'Từ nối "between X and Y" (ở giữa 2 địa điểm).',
        paraphraseNote: 'right between pool and reception'
      }
    ]
  }
];
