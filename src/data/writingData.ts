import { WritingTask1Note, WritingTask2Note } from '../types';

export const WRITING_TASK1_NOTES: WritingTask1Note[] = [
  {
    id: 't1-line-graph',
    type: 'line-graph',
    title: 'Line Graph (Biểu Đồ Đường)',
    subtitle: 'Mô tả sự thay đổi và xu hướng của số liệu theo tiến trình thời gian',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase lại đề bài (1 câu)',
        formula: 'The line graph illustrates / compares / shows [thông tin đề bài] between [năm A] and [năm B] / over a period of [X] years.',
        sentenceFrames: [
          'The line graph illustrates the changes in the proportion of [X] in [location] from [year] to [year].',
          'The provided graph reveals how the figure for [X] fluctuated over a [X]-year period commencing in [year].'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Nêu 2–3 đặc điểm nổi bật nhất (xu hướng chung tăng/giảm, đối tượng cao nhất/thấp nhất)',
        formula: 'Overall, it is clear that [đối tượng A] experienced an upward trend, whereas [đối tượng B] witnessed a decline. Additionally, [đối tượng C] remained the highest throughout the timeframe.',
        sentenceFrames: [
          'Overall, what stands out from the graph is that while [A] and [B] saw an overall increase, the reverse was true for [C].',
          'In general, [A] consistently accounted for the largest percentage throughout the examined period.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả chi tiết nhóm số liệu 1 (thường là các đường cùng xu hướng tăng hoặc cùng nhóm)',
        formula: 'In [năm bắt đầu], the figure for [A] stood at [số liệu], before [tăng lên / giảm xuống] to [số liệu] in [năm].',
        sentenceFrames: [
          'Starting at [number] in [year], the figure for [X] rose moderately to reach a peak of [number] in [year].',
          'Between [year] and [year], there was a dramatic surge in the consumption of [X], climbing from [A] to [B].'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả chi tiết nhóm số liệu 2 (nhóm xu hướng ngược lại hoặc dao động/thấp hơn)',
        formula: 'By contrast, [đối tượng B] commenced at [số liệu] and subsequently dropped to [số liệu] at the end of the period.',
        sentenceFrames: [
          'Conversely, the number of [Y] witnessed a steady downward trend, falling from [number] to a low of [number].',
          'Regarding [Z], it plateaued at around [number] for the remainder of the timeframe.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Xu hướng Tăng',
        items: [
          'rose / increased / climbed steadily to [X]',
          'surged / rocketed / experienced a dramatic rise to [X]',
          'reached a peak of [X] in [year]'
        ]
      },
      {
        category: 'Xu hướng Giảm',
        items: [
          'declined / dropped / decreased moderately to [X]',
          'plummeted / slumped / shrank sharply to [X]',
          'hit a low of / bottomed out at [X]'
        ]
      },
      {
        category: 'Dao động & Giữ nguyên',
        items: [
          'fluctuated wildly between [A] and [B]',
          'remained relatively stable / constant at [X]',
          'plateaued / leveled off at [X]'
        ]
      },
      {
        category: 'Giới từ quan trọng (Dễ sai nhất)',
        items: [
          'increase BY 10% (tăng một khoảng 10%)',
          'increase TO 50% (tăng chạm mốc 50%)',
          'a rise OF 15% (mức tăng 15%)',
          'stood AT 20% (đang ở mốc 20%)'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Không viết đoạn Overview hoặc đưa số liệu chi tiết vào Overview',
        whyWrong: 'Tiêu chí Task Achievement yêu cầu Overview chỉ nêu xu hướng tổng quát, không chứa số liệu cụ thể.',
        fix: 'Viết Overview 2 câu nêu: 1) xu hướng tổng thể tăng/giảm, 2) đối tượng lớn nhất/nhỏ nhất.'
      },
      {
        mistake: 'Liệt kê từng năm một như đọc bảng biểu (năm 1990 là A, 1991 là B...)',
        whyWrong: 'Làm mất tính so sánh và phân tích nhóm, bài viết bị rời rạc.',
        fix: 'Nhóm các năm có xu hướng tương đồng và so sánh các đường với nhau tại các mốc đầu, mốc đỉnh và mốc cuối.'
      },
      {
        mistake: 'Đưa quan điểm cá nhân giải thích lý do ("vì kinh tế suy thoái...")',
        whyWrong: 'Task 1 chỉ báo cáo sự thật trên biểu đồ, tuyệt đối không suy đoán nguyên nhân.',
        fix: 'Chỉ trình bày khách quan những gì biểu đồ thể hiện.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ (Quy định chính thức; dưới 150 từ sẽ bị trừ điểm Task Achievement)',
      '[REQUIREMENT] Báo cáo trung thực số liệu trên biểu đồ, tuyệt đối không tự suy đoán nguyên nhân hoặc đưa ý kiến cá nhân',
      '[REQUIREMENT] Trình bày bài theo các đoạn văn hoàn chỉnh (Introduction, Overview, 2 Body), không dùng gạch đầu dòng',
      '[RECOMMENDED] Dành khoảng 20 phút cho Task 1 để dành 40 phút cho Task 2',
      '[RECOMMENDED] Đoạn Overview (1–2 câu) nêu rõ xu hướng tổng thể tăng/giảm và đối tượng cao/thấp nhất',
      '[RECOMMENDED] Gom nhóm các đường có xu hướng tương đồng và chọn lọc mốc đầu, mốc đỉnh và mốc cuối',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 160–180 từ để phát triển số liệu thoải mái mà không bị muộn giờ'
    ]
  },
  {
    id: 't1-bar-chart',
    type: 'bar-chart',
    title: 'Bar Chart (Biểu Đồ Cột)',
    subtitle: 'So sánh giữa các đối tượng (có thể theo thời gian hoặc tại một mốc cố định)',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài',
        formula: 'The bar chart compares the amount / number / percentage of [X] across [Y categories] in [year(s)].',
        sentenceFrames: [
          'The bar chart provides comparative data on the expenditure on [X] across five distinct nations in [year].',
          'The provided chart illustrates the proportion of male and female students participating in [activities] in [year].'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Nêu cột cao nhất, thấp nhất hoặc sự khác biệt lớn nhất giữa các nhóm',
        formula: 'Overall, [đối tượng A] had the highest figure, while [đối tượng B] recorded the lowest. Furthermore, [nhóm X] consistently surpassed [nhóm Y].',
        sentenceFrames: [
          'Overall, [Category A] dominated the figures, whereas [Category B] was by far the least favored.',
          'In general, there were notable discrepancies between genders, with males outnumbering females in most categories.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả và so sánh các hạng mục cao hơn / nổi bật hơn',
        formula: 'Looking first at [nhóm cao], [A] ranked first with [số liệu], closely followed by [B] at [số liệu].',
        sentenceFrames: [
          'Regarding the top performers, [A] accounted for the highest share at [X]%, which was nearly double that of [B] ([Y]%).',
          'In terms of [Category 1], the figure for [A] was approximately three times higher than that of [B].'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả và so sánh các hạng mục còn lại / thấp hơn',
        formula: 'In contrast, the figures for [các nhóm còn lại] were significantly lower, ranging from [X] to [Y].',
        sentenceFrames: [
          'By contrast, a negligible proportion of respondents chose [C], standing at a mere [X]%.',
          'A similar pattern was observed in [D], where the percentage hovered around [X]%.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'So sánh cấp bậc & Tỷ lệ',
        items: [
          'accounted for the lion’s share / the vast majority (chiếm thị phần lớn nhất)',
          'was twice as high as / doubled that of (cao gấp đôi)',
          'three times higher than / tripled (cao gấp ba)',
          'a negligible / minimal proportion (tỷ lệ không đáng kể, < 5%)'
        ]
      },
      {
        category: 'Cấu trúc so sánh câu ghép',
        items: [
          'while [A] stood at 40%, the figure for [B] was only 15%',
          '[A] emerged as the primary source, whereas [B] lagged far behind',
          'in stark contrast to [A], [B] recorded...'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Quên đơn vị đo lường (viết số 50 thay vì 50 million dollars hoặc 50%)',
        whyWrong: 'Dẫn đến hiểu sai bản chất số liệu.',
        fix: 'Luôn nhìn kỹ trục tung (Y-axis) để ghi chuẩn đơn vị.'
      },
      {
        mistake: 'Dùng từ chỉ xu hướng thay đổi (rose/fell) cho biểu đồ KHÔNG CÓ THỜI GIAN',
        whyWrong: 'Biểu đồ chỉ có 1 năm (static) không có sự tăng giảm, chỉ có sự hơn kém.',
        fix: 'Với biểu đồ 1 mốc thời gian, CHỈ dùng từ ngữ so sánh (higher, lower, twice as much, compared to).'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ theo đúng thể thức báo cáo IELTS Academic',
      '[REQUIREMENT] Xác định đúng đơn vị đo lường trên trục tung (triệu USD, %, tấn...)',
      '[RECOMMENDED] Xác định rõ biểu đồ tĩnh (1 năm - chỉ dùng từ ngữ so sánh hơn/kém) hay động (nhiều năm - dùng từ chỉ xu hướng tăng/giảm)',
      '[RECOMMENDED] Đoạn Overview chỉ ra rõ đối tượng lớn nhất / nhỏ nhất hoặc khoảng cách chênh lệch nổi bật',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 160–180 từ'
    ]
  },
  {
    id: 't1-pie-chart',
    type: 'pie-chart',
    title: 'Pie Chart (Biểu Đồ Tròn)',
    subtitle: 'Mô tả cơ cấu tỷ lệ phần trăm (phần chia của một tổng thể 100%)',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài',
        formula: 'The pie charts compare the distribution / breakdown of [X] in [location] in [năm].',
        sentenceFrames: [
          'The two pie charts illustrate how household expenditure was distributed among five categories in [year].',
          'The pie charts demonstrate the proportional allocation of energy sources in [country] across two distinct years.'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Chỉ ra phần quạt lớn nhất và sự dịch chuyển cơ cấu lớn nhất giữa các năm',
        formula: 'Overall, [phần A] constituted the major segment in both years. Additionally, there was a noticeable transition from [A] to [B].',
        sentenceFrames: [
          'Overall, [category A] made up the greatest portion of the total throughout the period, whereas [category B] remained the smallest.',
          'In general, the proportion allocated to [A] expanded noticeably, while that of [B] contracted.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả các phần quạt chiếm tỷ trọng lớn (> 20%)',
        formula: '[Phần A] accounted for the highest share at [X]%, followed by [Phần B] with [Y]%.',
        sentenceFrames: [
          'In [year 1], [Category A] dominated the chart, making up nearly half of the total at [45]%.',
          'This was followed by [Category B], which represented approximately a quarter ([26]%) of overall expenditure.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả các phần quạt nhỏ hơn và các thay đổi nhỏ',
        formula: 'The remaining portion was divided between [C], [D] and [E], with figures ranging from [X]% to [Y]%.',
        sentenceFrames: [
          'The remaining categories, namely [C] and [D], constituted relatively modest proportions at [8]% and [5]% respectively.',
          'Over the subsequent decade, the share of [C] shrank marginally to [4]%.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Từ vựng chỉ tỷ lệ phần trăm',
        items: [
          'constituted / accounted for / made up [X]%',
          'represented roughly one third (33%) / a quarter (25%) / half (50%)',
          'the lion’s share / the predominant segment (phần chiếm ưu thế)',
          'the remaining fraction / a negligible slice'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Cộng nhầm hoặc nói số liệu tuyệt đối thay vì tỷ lệ phần trăm',
        whyWrong: 'Pie chart biểu thị tỷ trọng (proportions), trừ khi đề bài ghi rõ số lượng tuyệt đối.',
        fix: 'Luôn dùng đơn vị % hoặc các phân số tương đương (one in four, a third).'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ, không chép nguyên văn câu chữ của đề bài',
      '[REQUIREMENT] Luôn dùng đơn vị % hoặc phân số tỷ lệ chính xác (trừ khi đề ghi rõ số lượng tuyệt đối)',
      '[RECOMMENDED] Sử dụng linh hoạt các động từ cơ cấu: accounted for, constituted, comprised, represented',
      '[RECOMMENDED] Quy đổi % sang phân số tự nhiên (ví dụ 48% -> nearly half, 74% -> almost three-quarters)',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 160–180 từ'
    ]
  },
  {
    id: 't1-table',
    type: 'table',
    title: 'Table (Bảng Số Liệu)',
    subtitle: 'Bảng chứa nhiều số liệu dày đặc đòi hỏi kỹ năng chọn lọc và nhóm thông tin',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài',
        formula: 'The table provides information on / details the numbers of [X] across [Y categories] in [Z].',
        sentenceFrames: [
          'The table presents data regarding the demographic breakdown of [X] in six countries during [year].'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Nêu nhóm có số liệu vượt trội và xu hướng chung',
        formula: 'Overall, [quốc gia/hạng mục A] ranked highest in terms of [tiêu chí 1], whereas [B] recorded the lowest figure.',
        sentenceFrames: [
          'Overall, it is evident that [A] surpassed all other nations in [metric], while the reverse pattern was evident in [B].'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Nhóm các hàng hoặc cột có giá trị cao nhất / xu hướng giống nhau',
        formula: 'Focusing on [nhóm 1], [đối tượng A] had the greatest amount at [số liệu]...',
        sentenceFrames: [
          'Regarding the nations with the highest expenditure, [A] took the lead with [X], followed closely by [B] at [Y].'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Nhóm các hàng hoặc cột có giá trị thấp hơn',
        formula: 'Turning to the remaining categories, the figures were significantly more subdued...',
        sentenceFrames: [
          'In contrast, the figures recorded for [C] and [D] were considerably lower, standing at [X] and [Y] respectively.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Từ vựng nhóm số liệu',
        items: [
          'ranked highest / occupied first position',
          'lagged behind / positioned at the bottom of the table',
          'in descending / ascending order'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Cố gắng chép hết tất cả con số trong bảng',
        whyWrong: 'Đề bài yêu cầu "summarise by selecting and reporting the main features". Chép hết bị trừ điểm nặng.',
        fix: 'Chỉ chọn các số liệu cao nhất, thấp nhất, điểm ngoặt hoặc có độ chênh lệch đột biến.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ, hoàn thành trong khoảng 20 phút',
      '[RECOMMENDED] Chọn lọc số liệu trọng yếu (cao nhất, thấp nhất, đột biến), tuyệt đối không liệt kê máy móc mọi con số',
      '[RECOMMENDED] Gom ít nhất 2 đối tượng vào cùng 1 câu so sánh thay vì viết các câu đơn rời rạc',
      '[OPTIONAL] Nhắm tới độ dài 160–180 từ'
    ]
  },
  {
    id: 't1-process',
    type: 'process',
    title: 'Process / Diagram (Quy Trình)',
    subtitle: 'Mô tả chu trình tự nhiên (vòng đời) hoặc quy trình sản xuất nhân tạo',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài',
        formula: 'The diagram illustrates the process of [sản xuất X / vòng đời của Y] / how [X] is produced.',
        sentenceFrames: [
          'The flowchart illustrates the sequential stages involved in the manufacturing of recycled paper.',
          'The diagram depicts the life cycle of the salmon from egg to mature adult.'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Đếm tổng số bước, chỉ rõ bước đầu tiên và bước kết thúc',
        formula: 'Overall, the process comprises [X] distinct stages, commencing with [bước đầu] and culminating in [bước cuối].',
        sentenceFrames: [
          'Overall, there are [six] main steps in this linear process, beginning with the collection of raw materials and culminating in the distribution of the finished product.',
          'In general, the life cycle consists of three cyclical phases, progressing from eggs to fry and ultimately to mature fish.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả từ bước 1 đến bước giữa quy trình',
        formula: 'In the initial phase, [nguyên liệu] is gathered and transported to [nơi xử lý]. Subsequently, ...',
        sentenceFrames: [
          'At the first stage of the process, [X] is harvested manually before being conveyed to a factory.',
          'Following this, the mixture is heated to a temperature of [X] degrees to eliminate impurities.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả từ bước giữa đến sản phẩm cuối cùng',
        formula: 'Moving to the next stage, [sản phẩm trung gian] undergoes [quá trình] before finally being packaged.',
        sentenceFrames: [
          'Once the filtration is complete, the substance is poured into specialized molds to solidify.',
          'Finally, the packaged goods are delivered to commercial retailers ready for consumer purchase.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Từ nối chỉ thứ tự các bước',
        items: [
          'initially / in the first stage / to begin with',
          'subsequently / following this / at the next juncture',
          'simultaneously / while this is taking place',
          'eventually / culminating in / in the final step'
        ]
      },
      {
        category: 'Cấu trúc Bị động học thuật (Bắt buộc cho quy trình nhân tạo)',
        items: [
          'is collected / are sorted into categories',
          'is subjected to intense heat / pressure',
          'is then transported / distributed to...'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Dùng câu chủ động ("Worker washes the fruit...")',
        whyWrong: 'Trong quy trình sản xuất công nghiệp, con người không quan trọng bằng đối tượng bị xử lý.',
        fix: 'Luôn dùng THỂ BỊ ĐỘNG (Passive voice): "The fruit is washed thoroughly under clean water."'
      },
      {
        mistake: 'Bỏ quên một bước trong hình vẽ',
        whyWrong: 'Bị trừ điểm Task Achievement vì báo cáo thiếu thông tin.',
        fix: 'Đánh số thứ tự 1, 2, 3... trực tiếp lên hình trước khi viết.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Báo cáo đầy đủ mọi bước xuất hiện trên sơ đồ, không được bỏ sót bất kỳ giai đoạn nào',
      '[REQUIREMENT] Viết tối thiểu 150 từ',
      '[RECOMMENDED] Đoạn Overview nêu rõ tổng số bước, bước bắt đầu và sản phẩm hoàn thiện cuối cùng',
      '[RECOMMENDED] Sử dụng thể bị động (passive voice) cho quy trình sản xuất nhân tạo',
      '[RECOMMENDED] Sử dụng đa dạng các từ nối trình tự thời gian (initially, subsequently, once, finally)'
    ]
  },
  {
    id: 't1-map',
    type: 'map',
    title: 'Map (Bản Đồ / Quy Hoạch)',
    subtitle: 'Mô tả sự thay đổi của một địa điểm giữa quá khứ - hiện tại hoặc hiện tại - tương lai',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài',
        formula: 'The maps illustrate the main transformations that occurred in [địa điểm] between [năm A] and [năm B].',
        sentenceFrames: [
          'The provided maps depict the key developmental changes that took place in the village of [X] over a 20-year span starting in 2000.'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Nêu sự thay đổi bao quát nhất (trở nên hiện đại hơn, công nghiệp hóa, mở rộng dịch vụ)',
        formula: 'Overall, the town experienced extensive modernization, transitioning from a predominantly rural landscape into a commercial and residential hub.',
        sentenceFrames: [
          'Overall, the area was substantially developed with the addition of numerous residential facilities and recreational amenities, at the expense of agricultural land.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả sự thay đổi ở phía Bắc hoặc khu vực trung tâm',
        formula: 'To the north of the area, [công trình cũ] was demolished and replaced by [công trình mới]...',
        sentenceFrames: [
          'In the northern section of the town, the old farmland was leveled to make way for a modern shopping complex.',
          'The road running through the center was widened, and a new roundabout was constructed at the main intersection.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả sự thay đổi ở phía Nam hoặc phần còn lại của bản đồ',
        formula: 'Looking towards the south, [công trình A] remained unaltered, whereas [khu vực B] was converted into...',
        sentenceFrames: [
          'In the southern half, while the historic church remained untouched, the woodland was cleared for residential expansion.',
          'Additionally, a new car park was erected adjacent to the railway station to facilitate commuters.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Từ vựng phá dỡ, xây mới, mở rộng',
        items: [
          'was demolished / knocked down / flattened / cleared to make way for [X]',
          'was constructed / built / erected / introduced',
          'was expanded / enlarged / extended',
          'was transformed / converted / turned into [X]',
          'remained unchanged / remained intact / was left untouched'
        ]
      },
      {
        category: 'Phương hướng & Vị trí',
        items: [
          'to the north / south / east / west of...',
          'in the north-eastern corner of the town',
          'adjacent to / in close proximity to / neighboring',
          'situated directly opposite to...'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Dùng "on the left / on the right" thay vì phương hướng địa lý',
        whyWrong: 'Trong bản đồ học thuật IELTS, bắt buộc dùng hướng Đông - Tây - Nam - Bắc (North, South, East, West).',
        fix: 'Dùng "In the north-west" thay vì "on the top left".'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ theo thể thức khách quan',
      '[RECOMMENDED] Sử dụng 4 hướng địa lý (North, South, East, West) thay vì vị trí thị giác (left, right, top, bottom)',
      '[RECOMMENDED] Sử dụng đa dạng các động từ biến đổi đô thị (demolished, erected, converted into, remained untouched)',
      '[RECOMMENDED] Đoạn Overview tóm tắt sự chuyển biến bao quát nhất (modernized, commercialized, residential expansion)'
    ]
  },
  {
    id: 't1-mixed-chart',
    type: 'mixed-chart',
    title: 'Mixed Chart (Biểu Đồ Kết Hợp)',
    subtitle: 'Kết hợp 2 dạng biểu đồ khác nhau (ví dụ: 1 cột + 1 đường, hoặc 1 bảng + 1 tròn)',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài giới thiệu cả 2 biểu đồ',
        formula: 'The bar chart illustrates [thông tin 1], while the accompanying pie chart shows [thông tin 2].',
        sentenceFrames: [
          'The bar chart demonstrates the amount of electricity produced in [location], while the pie chart breaks down the fuel sources utilized.'
        ]
      },
      {
        section: 'Overview',
        purpose: 'Nêu 1 điểm nổi bật nhất của biểu đồ thứ nhất và 1 điểm nổi bật nhất của biểu đồ thứ hai',
        formula: 'Overall, it is clear that while [điểm nổi bật biểu đồ 1], [điểm nổi bật biểu đồ 2].',
        sentenceFrames: [
          'Overall, total electricity generation experienced a sustained rise, with fossil fuels remaining the predominant source throughout the period.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Mô tả chi tiết và số liệu của biểu đồ thứ nhất',
        formula: 'Regarding the [tên biểu đồ 1], ...',
        sentenceFrames: [
          'In terms of the bar chart, electricity production stood at [X] in [year] before climbing substantially to [Y] in [year].'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Mô tả chi tiết biểu đồ thứ hai và liên hệ tương quan nếu có',
        formula: 'Turning to the [tên biểu đồ 2], ...',
        sentenceFrames: [
          'Concerning energy sources, coal accounted for over half the total ([55]%), whereas renewables made up a modest [10]%.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Từ nối chuyển đoạn giữa 2 biểu đồ',
        items: [
          'Regarding the first chart / As for the bar chart...',
          'Turning now to the pie chart / Looking at the second visual...',
          'This trend is mirrored in the accompanying table...'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Chỉ viết Overview cho 1 biểu đồ và quên biểu đồ thứ hai',
        whyWrong: 'Overview bị thiếu thông tin dẫn đến điểm Task Achievement tối đa chỉ đạt Band 5.',
        fix: 'Luôn viết 2 câu trong Overview: 1 câu tóm tắt Chart 1, 1 câu tóm tắt Chart 2.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 150 từ, đảm bảo mô tả cả 2 biểu đồ',
      '[RECOMMENDED] Đoạn Overview phải tóm tắt đặc điểm nổi bật của CẢ 2 biểu đồ (mỗi biểu đồ 1 câu)',
      '[RECOMMENDED] Chia rõ bố cục: Body 1 mô tả biểu đồ thứ nhất, Body 2 mô tả biểu đồ thứ hai và liên hệ tương quan',
      '[OPTIONAL] Nhắm tới độ dài 160–180 từ'
    ]
  }
];

export const WRITING_TASK2_NOTES: WritingTask2Note[] = [
  {
    id: 't2-opinion',
    type: 'opinion',
    title: 'Opinion Essay (Agree or Disagree)',
    subtitle: 'Đề bài hỏi bạn đồng ý hay không đồng ý với một quan điểm (To what extent do you agree or disagree?)',
    promptExample: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài + Khẳng định rõ lập trường (Thesis Statement) ngay từ đầu',
        formula: 'Sentence 1: Paraphrase đề bài. Sentence 2: I completely agree / disagree with this viewpoint because [Lý do 1] and [Lý do 2].',
        sentenceFrames: [
          'It is argued by some that high school curricula should incorporate mandatory volunteer work. In my view, I completely agree with this proposal, as it fosters social responsibility and provides practical life competencies.',
          'While many advocate for [X], I firmly disagree with this stance because it infringes upon personal freedom and may detract from academic performance.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Luận điểm thứ nhất củng cố quan điểm của bạn (P-E-E-L)',
        formula: 'Topic Sentence (Nêu luận điểm 1) → Explanation (Giải thích sâu vì sao) → Example (Ví dụ thực tế) → Link (Câu kết nối về luận đề).',
        sentenceFrames: [
          'The primary rationale behind my support is that [Luận điểm 1]. To elaborate, [Giải thích cơ chế]. For instance, [Dẫn chứng cụ thể]. Consequently, [Tác động tích cực].',
          'First and foremost, engaging in [X] cultivates [Y]. Specifically, when students participate in community initiatives, they gain firsthand exposure to social challenges, which in turn nurtures empathy.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Luận điểm thứ hai củng cố thêm cho quan điểm của bạn',
        formula: 'Topic Sentence (Nêu luận điểm 2) → Explanation → Example → Result.',
        sentenceFrames: [
          'Another compelling justification for my perspective is that [Luận điểm 2]. In other words, [Giải thích]. A case in point is [Ví dụ thực tế]. Hence, [Kết luận].',
          'Furthermore, this policy equips young individuals with essential interpersonal competencies, such as teamwork and conflict resolution, which cannot be acquired solely through textbook learning.'
        ]
      },
      {
        section: 'Conclusion',
        purpose: 'Khẳng định lại lập trường và tóm tắt 2 luận điểm chính (1–2 câu)',
        formula: 'In conclusion, I firmly maintain that [Quan điểm của bạn], given that it [Tóm tắt Lý do 1] as well as [Tóm tắt Lý do 2].',
        sentenceFrames: [
          'In conclusion, I strongly reaffirm my conviction that community service ought to be obligatory for secondary students, as it both instills civic awareness and enriches practical career readiness.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Thể hiện Lập trường dứt khoát (Strong Stance)',
        items: [
          'I completely concur with this viewpoint (Hoàn toàn đồng ý)',
          'I am strongly inclined to believe that...',
          'I unequivocally reject the notion that... (Dứt khoát bác bỏ)'
        ]
      },
      {
        category: 'Từ nối phát triển lập luận (Cohesive Devices)',
        items: [
          'First and foremost / Primarily (Đầu tiên và quan trọng nhất)',
          'To be more precise / To elaborate on this point (Nói chi tiết hơn)',
          'A prime illustration of this is / Take [X] as an evident example',
          'Consequently / As an inevitable outcome (Kết quả tất yếu là)'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Lập trường ba phải, lúc đồng ý lúc không mà không giải thích rõ ràng',
        whyWrong: 'Tiêu chí Task Response yêu cầu "presents a clear position throughout the response".',
        fix: 'Chọn 1 hướng (hoàn toàn đồng ý HOẶC hoàn toàn không đồng ý) và bảo vệ lập trường đó xuyên suốt từ Intro đến Conclusion.'
      },
      {
        mistake: 'Liệt kê quá nhiều ý tưởng nhưng không có câu giải thích (Explanation)',
        whyWrong: 'Giám khảo tìm kiếm chiều sâu lập luận chứ không chấm điểm số lượng ý.',
        fix: 'Mỗi đoạn Body chỉ cần 1 luận điểm chính, sau đó dùng 2–3 câu giải thích "Tại sao?" và "Hệ quả là gì?".'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 250 từ (Quy định bắt buộc; dưới 250 từ bị phạt điểm Task Response)',
      '[REQUIREMENT] Khẳng định lập trường rõ ràng (Clear Position) xuyên suốt bài từ mở bài đến kết bài',
      '[REQUIREMENT] Trình bày bài theo cấu trúc đoạn văn học thuật (Introduction, 2 Thân bài, Conclusion)',
      '[RECOMMENDED] Dành khoảng 40 phút cho Task 2',
      '[RECOMMENDED] Mỗi đoạn Body áp dụng công thức P-E-E-L (Point → Explanation → Example → Link)',
      '[RECOMMENDED] Dành 3–5 phút cuối giờ rà soát lỗi chia động từ, mạo từ (a/an/the) và chính tả',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 260–290 từ để lập luận sâu sắc'
    ]
  },
  {
    id: 't2-discussion',
    type: 'discussion',
    title: 'Discussion Essay (Discuss Both Views and Give Your Opinion)',
    subtitle: 'Thảo luận cả 2 luồng quan điểm trái ngược nhau và đưa ra quan điểm cá nhân',
    promptExample: 'Some people think that university education should be free for all students. Others, however, believe that students should pay for their higher education. Discuss both views and give your opinion.',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài giới thiệu 2 luồng ý kiến + Nêu quan điểm cá nhân',
        formula: 'Sentence 1: While some people argue that [View A], others maintain that [View B]. Sentence 2: In my opinion, [Quan điểm cá nhân của bạn].',
        sentenceFrames: [
          'While a school of thought advocates for tuition-free university education, others argue that undergraduates should finance their own tertiary studies. In my view, although state-funded education fosters equity, cost-sharing remains imperative to ensure institutional quality.',
          'Opinions are divided on whether [View A] or [View B]. From my standpoint, I lean towards the latter perspective because [Lý do ngắn].'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Thảo luận khách quan góc nhìn thứ nhất (View A)',
        formula: 'On the one hand, proponents of [View A] argue that [Lý do chính]. Explanation → Example.',
        sentenceFrames: [
          'On the one hand, there are valid arguments in favor of free higher education. Advocates primarily contend that removing financial barriers guarantees equal opportunities for talented individuals from underprivileged backgrounds. For example, in Nordic nations where tuition is abolished, social mobility is markedly higher.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Thảo luận góc nhìn thứ hai (View B) và lồng ghép quan điểm ủng hộ của bạn',
        formula: 'On the other hand, I side with those who believe that [View B]. Explanation → Example.',
        sentenceFrames: [
          'On the other hand, I would argue that obliging students to pay tuition fees is more sustainable. The primary justification is that governments face severe fiscal constraints, and allocating massive funds to universities may divert resources from vital sectors like healthcare and primary education. Furthermore, tuition fees incentivize students to take their academic studies more seriously.'
        ]
      },
      {
        section: 'Conclusion',
        purpose: 'Tóm lược cả 2 góc nhìn và tái khẳng định ý kiến cá nhân',
        formula: 'In conclusion, while both viewpoints possess merit, I believe that [Khẳng định lại View B].',
        sentenceFrames: [
          'In conclusion, while tuition exemption promotes egalitarianism, I maintain that a reasonable fee structure combined with targeted scholarships represents a far more balanced and viable strategy.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Mẫu câu thảo luận 2 chiều',
        items: [
          'On the one hand, advocates of [X] point out that...',
          'On the other hand, there are justifiable grounds to support [Y]',
          'While there are justifiable benefits to [A], the merits of [B] are more substantial'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Quên đưa ý kiến cá nhân ("give your opinion")',
        whyWrong: 'Đề bài yêu cầu thảo luận CẢ HAI mặt VÀ đưa ra ý kiến của bạn.',
        fix: 'Luôn thể hiện quan điểm của bạn ngay trong Introduction, khẳng định lại ở Body 2 và Conclusion.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 250 từ',
      '[REQUIREMENT] Thảo luận đầy đủ cả 2 quan điểm (View 1 & View 2) được nêu trong đề bài',
      '[REQUIREMENT] Thể hiện rõ quan điểm cá nhân (Give your opinion) theo đúng yêu cầu đề bài',
      '[RECOMMENDED] Dành 1 đoạn Body cho View 1, 1 đoạn Body cho View 2 (kèm phân tích vì sao bạn đồng tình hơn)',
      '[RECOMMENDED] Dành khoảng 40 phút cho Task 2',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 260–290 từ'
    ]
  },
  {
    id: 't2-advantages-disadvantages',
    type: 'advantages-disadvantages',
    title: 'Advantages & Disadvantages Essay',
    subtitle: 'Phân tích ưu điểm và nhược điểm (Do the advantages outweigh the disadvantages?)',
    promptExample: 'In many countries, an increasing number of people are buying food online. Do the advantages of this trend outweigh the disadvantages?',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài + Khẳng định ưu điểm vượt trội hơn hay ngược lại',
        formula: 'Sentence 1: Paraphrase xu hướng. Sentence 2: Although there are certain drawbacks, I am convinced that the benefits are far more significant.',
        sentenceFrames: [
          'In recent years, the habit of purchasing groceries and meals via digital platforms has proliferated. Although this phenomenon carries undeniable downsides regarding food quality and packaging waste, I believe that the convenience and time efficiency it confers are far more substantial.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Phân tích các mặt hạn chế (Disadvantages)',
        formula: 'On the one hand, several negative implications must be acknowledged. First, ... Furthermore, ...',
        sentenceFrames: [
          'On the one hand, the shift towards online food shopping is not without pitfalls. The chief concern relates to the inability to physically inspect fresh produce prior to purchase, occasionally resulting in subpar goods. Additionally, the proliferation of single-use delivery packaging exacerbates environmental pollution.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Phân tích các ưu điểm vượt trội (Advantages) củng cố cho kết luận',
        formula: 'On the other hand, the merits of this development are considerably more profound. Primarily, ...',
        sentenceFrames: [
          'On the other hand, I would assert that the upsides are far more prominent. Foremost among these is unparalleled convenience; consumers can procure necessities with a few smartphone taps, thereby liberating precious hours for career and familial pursuits. Moreover, online grocery marketplaces often provide transparent price comparisons, enabling budget-conscious households to economize.'
        ]
      },
      {
        section: 'Conclusion',
        purpose: 'Khẳng định lại ưu điểm vượt trội hơn nhược điểm',
        formula: 'In conclusion, despite the aforementioned concerns regarding [nhược điểm], I maintain that the advantages in terms of [ưu điểm] are vastly superior.',
        sentenceFrames: [
          'In conclusion, while issues pertaining to product verification and waste cannot be disregarded, they are decisively overshadowed by the transformative convenience and time savings that online food procurement delivers.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Cân đo ưu và nhược điểm',
        items: [
          'The benefits decisively outweigh / overshadow the drawbacks',
          'The merits are far more substantial than the demerits',
          'While [X] is a legitimate drawback, it is eclipsed by [Y]'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Chỉ liệt kê ưu và nhược điểm ngang nhau mà không kết luận cái nào vượt trội hơn',
        whyWrong: 'Câu hỏi là "Do the advantages outweigh the disadvantages?". Cần phải có phán quyết rõ ràng.',
        fix: 'Phải nói rõ: ưu điểm áp đảo nhược điểm (hoặc ngược lại) ngay từ mở bài và kết bài.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 250 từ',
      '[REQUIREMENT] Trả lời dứt khoát câu hỏi "Do the advantages outweigh the disadvantages?" ngay từ mở bài và kết bài',
      '[RECOMMENDED] Phân tích cả ưu điểm và nhược điểm, nhưng dành chiều sâu lập luận lớn hơn cho phần bạn cho là vượt trội',
      '[RECOMMENDED] Sử dụng các cấu trúc cân đo (The benefits decisively outweigh the drawbacks)',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 260–290 từ'
    ]
  },
  {
    id: 't2-problem-solution',
    type: 'problem-solution',
    title: 'Problem & Solution / Cause & Solution',
    subtitle: 'Xác định các nguyên nhân/vấn đề và đề xuất các giải pháp khả thi',
    promptExample: 'More and more wild animals are on the verge of extinction. What are the causes of this problem, and what measures can be taken to solve it?',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài + Giới thiệu sẽ phân tích nguyên nhân và giải pháp',
        formula: 'Sentence 1: Paraphrase vấn đề. Sentence 2: This alarming issue stems from [Nguyên nhân chính], and targeted remedial actions must be implemented by [chính phủ / cá nhân].',
        sentenceFrames: [
          'The accelerating decline of wildlife species has emerged as a grave global predicament. This issue is predominantly driven by habitat destruction and illicit poaching, and resolute measures must be enacted by authorities and conservation bodies to rectify the situation.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Phân tích 2 nguyên nhân cốt lõi (Causes / Problems)',
        formula: 'Two primary factors account for this crisis. First, ... Second, ...',
        sentenceFrames: [
          'Two main catalysts lie behind this crisis. Chief among these is massive deforestation to accommodate urban sprawl and intensive agriculture, which deprives wildlife of their natural ecosystems. Furthermore, commercial poaching fueled by the lucrative black market for ivory and rare animal pelts continues to decimate vulnerable populations.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Đề xuất 2 giải pháp tương ứng giải quyết triệt để các nguyên nhân trên (Solutions)',
        formula: 'To mitigate this adversity, concerted actions are essential. Firstly, [Giải pháp 1]. Secondly, [Giải pháp 2].',
        sentenceFrames: [
          'To solve this problem, effective measures must be taken. Firstly, governments should establish protected natural reserves and enforce strict laws against illegal hunting. Secondly, educational campaigns can help raise public awareness about protecting endangered species.'
        ]
      },
      {
        section: 'Conclusion',
        purpose: 'Tóm lược nguyên nhân và khẳng định tính cấp thiết của giải pháp',
        formula: 'In conclusion, wildlife depletion is largely attributable to [nguyên nhân], and it is imperative that [giải pháp] be executed promptly.',
        sentenceFrames: [
          'In conclusion, biodiversity loss is caused mainly by habitat destruction and illegal hunting. Strong government policies and public cooperation are essential to protect wildlife for future generations.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Nguyên nhân & Nguồn gốc',
        items: [
          'is predominantly attributable to / stems from / is driven by',
          'acts as a primary catalyst for [problem]',
          'is an inevitable byproduct of [factor]'
        ]
      },
      {
        category: 'Đề xuất Giải pháp',
        items: [
          'a viable remedy would be to [verb]',
          'stringent regulations should be implemented / enacted',
          'concerted efforts must be made to curb [issue]'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Giải pháp đưa ra không khớp với nguyên nhân nêu ở Body 1',
        whyWrong: 'Mất tính gắn kết logic (Coherence & Cohesion).',
        fix: 'Nguyên nhân 1 tương ứng với Giải pháp 1; Nguyên nhân 2 tương ứng với Giải pháp 2.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 250 từ, trả lời cả 2 vế (Nguyên nhân/Vấn đề và Giải pháp)',
      '[REQUIREMENT] Bố cục đoạn văn rõ ràng, không dùng gạch đầu dòng',
      '[RECOMMENDED] Các giải pháp ở Body 2 phải giải quyết trực tiếp và tương ứng với các nguyên nhân nêu ở Body 1',
      '[RECOMMENDED] Đề xuất giải pháp mang tính khả thi, thực tế cho chính phủ hoặc cộng đồng',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 260–290 từ'
    ]
  },
  {
    id: 't2-two-part-question',
    type: 'two-part-question',
    title: 'Two-Part Question (Direct Questions)',
    subtitle: 'Đề bài gồm 2 câu hỏi trực tiếp độc lập cần được trả lời thỏa đáng',
    promptExample: 'Nowadays, many people choose to live alone. Why is this the case? Is this a positive or negative development?',
    structure: [
      {
        section: 'Introduction',
        purpose: 'Paraphrase đề bài + Trả lời trực tiếp 2 câu hỏi trong 1–2 câu',
        formula: 'Sentence 1: Paraphrase hiện tượng. Sentence 2: In my view, this shift is primarily attributable to [Lý do Q1], and I consider it to be a predominantly [positive/negative] trend because [Lý do Q2].',
        sentenceFrames: [
          'In recent decades, solitary living has become a prevalent lifestyle choice worldwide. This phenomenon is predominantly fueled by escalating economic independence and shifting cultural norms, and I perceive it as a largely constructive trend despite potential social isolation concerns.'
        ]
      },
      {
        section: 'Body 1',
        purpose: 'Trả lời trọn vẹn câu hỏi thứ nhất (Question 1: Why / What)',
        formula: 'Addressing the reasons behind this trend, [Yếu tố 1] and [Yếu tố 2] play a pivotal role...',
        sentenceFrames: [
          'Regarding the underlying motives for living alone, modern economic empowerment stands as the foremost contributor. In contemporary society, improved career prospects allow individuals, particularly women, to achieve financial autonomy without relying on family units. Additionally, urbanization has cultivated a desire for autonomy and privacy.'
        ]
      },
      {
        section: 'Body 2',
        purpose: 'Trả lời trọn vẹn câu hỏi thứ hai (Question 2: Positive or Negative)',
        formula: 'Turning to the implications, I would argue that this is a largely [beneficial/detrimental] occurrence because...',
        sentenceFrames: [
          'From an evaluative standpoint, I believe this progression yields predominantly favorable outcomes. Living independently instills high degrees of self-reliance, time management, and emotional resilience. While solitude may occasionally give rise to loneliness, modern digital connectivity substantially mitigates alienation.'
        ]
      },
      {
        section: 'Conclusion',
        purpose: 'Tóm lược lại câu trả lời cho cả 2 câu hỏi',
        formula: 'In conclusion, solitary living is driven by [Lý do Q1], and its benefits regarding [Ưu điểm Q2] render it an overwhelmingly positive development.',
        sentenceFrames: [
          'In conclusion, the rise in single-person households is primarily propelled by economic independence, and its capacity to foster personal autonomy makes it a largely positive social evolution.'
        ]
      }
    ],
    usefulPhrases: [
      {
        category: 'Chuyển mạch giữa 2 câu hỏi',
        items: [
          'Addressing the first inquiry, ...',
          'With regard to whether this constitutes a positive or negative trend, ...',
          'Turning to the latter question, ...'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Chỉ trả lời 1 câu hỏi và bỏ sót câu hỏi còn lại',
        whyWrong: 'Điểm Task Response bị giới hạn ở Band 5 vì không hoàn thành trọn vẹn yêu cầu đề bài.',
        fix: 'Chia đều cấu trúc: Body 1 trả lời câu hỏi 1, Body 2 trả lời câu hỏi 2.'
      }
    ],
    checklist: [
      '[REQUIREMENT] Viết tối thiểu 250 từ',
      '[REQUIREMENT] Trả lời thỏa đáng và đầy đủ cả 2 câu hỏi riêng biệt trong đề bài',
      '[RECOMMENDED] Chia đều bố cục: Body 1 trả lời câu hỏi 1, Body 2 trả lời câu hỏi 2',
      '[RECOMMENDED] Trả lời trực tiếp cả 2 câu hỏi ngay trong câu Thesis Statement ở mở bài',
      '[OPTIONAL] Nhắm tới độ dài mục tiêu 260–290 từ'
    ]
  }
];

export interface WritingPhraseCategory {
  id: string;
  category: string;
  descriptionVi: string;
  corePhrases: string[];
  upgradePhrases: string[];
  exampleSentence: string;
}

export const WRITING_PHRASE_BANK: WritingPhraseCategory[] = [
  {
    id: 'wp-opinion',
    category: 'Nêu Ý Kiến (Give Opinion)',
    descriptionVi: 'Khẳng định lập trường trong câu mở bài và kết bài',
    corePhrases: ['In my view,...', 'I believe that...', 'From my perspective,...', 'It is my belief that...'],
    upgradePhrases: ['I would argue that...', 'I firmly subscribe to the view that...'],
    exampleSentence: 'In my view, government intervention is essential to reduce urban air pollution.'
  },
  {
    id: 'wp-reason',
    category: 'Nêu Lý Do (Give Reason)',
    descriptionVi: 'Giải thích nguyên nhân dẫn đến nhận định',
    corePhrases: ['One important reason is that...', 'This is primarily because...', 'The main factor behind this is...'],
    upgradePhrases: ['This phenomenon can be attributed to...', 'A primary justification for this is...'],
    exampleSentence: 'One important reason is that public transit fares are significantly lower than private car maintenance.'
  },
  {
    id: 'wp-example',
    category: 'Đưa Ví Dụ (Give Example)',
    descriptionVi: 'Minh họa luận điểm bằng dẫn chứng cụ thể',
    corePhrases: ['For example,...', 'For instance,...', 'A good illustration of this is...'],
    upgradePhrases: ['This is exemplified by...', 'A notable case in point is...'],
    exampleSentence: 'For example, many Nordic nations offer free university tuition to all citizens.'
  },
  {
    id: 'wp-cause',
    category: 'Nguyên Nhân (Cause)',
    descriptionVi: 'Diễn tả nguồn gốc của vấn đề',
    corePhrases: ['...is caused by...', '...leads to...', '...results in...'],
    upgradePhrases: ['...is largely stemmed from...', '...serves as a catalyst for...'],
    exampleSentence: 'Rapid industrial expansion often leads to severe water contamination in nearby rivers.'
  },
  {
    id: 'wp-effect',
    category: 'Hệ Quả (Effect)',
    descriptionVi: 'Diễn tả kết quả, tác động kéo theo',
    corePhrases: ['As a result,...', 'Consequently,...', 'Therefore,...'],
    upgradePhrases: ['As an inevitable consequence,...', 'This has a profound bearing on...'],
    exampleSentence: 'Consequently, many young professionals struggle with mounting living expenses.'
  },
  {
    id: 'wp-contrast',
    category: 'Tương Phản (Contrast)',
    descriptionVi: 'So sánh hai mặt đối lập của vấn đề',
    corePhrases: ['However,...', 'On the other hand,...', 'While [A], [B]...'],
    upgradePhrases: ['Conversely,...', 'In sharp contrast to [A], [B]...'],
    exampleSentence: 'While traditional classrooms encourage social bonding, online learning provides flexible schedules.'
  },
  {
    id: 'wp-comparison',
    category: 'So Sánh (Comparison)',
    descriptionVi: 'Đối chiếu các đối tượng hoặc nhóm số liệu',
    corePhrases: ['...is higher than...', 'Similarly,...', 'In comparison with...'],
    upgradePhrases: ['...surpasses that of...', '...is substantially more pronounced in...'],
    exampleSentence: 'The proportion of working women in Sweden was higher than that in neighboring countries.'
  },
  {
    id: 'wp-trend-up',
    category: 'Xu Hướng Tăng (Trend Up)',
    descriptionVi: 'Mô tả số liệu hoặc sự vật gia tăng trong Task 1 & 2',
    corePhrases: ['increased steadily', 'saw an upward trend', 'rose from [A] to [B]'],
    upgradePhrases: ['experienced a substantial surge', 'climbed to a historic peak of...'],
    exampleSentence: 'The number of international visitors increased steadily between 2010 and 2020.'
  },
  {
    id: 'wp-trend-down',
    category: 'Xu Hướng Giảm (Trend Down)',
    descriptionVi: 'Mô tả số liệu đi xuống hoặc suy thoái',
    corePhrases: ['decreased significantly', 'dropped to [number]', 'witnessed a downward trend'],
    upgradePhrases: ['plummeted abruptly', 'underwent a marked reduction'],
    exampleSentence: 'Coal consumption dropped significantly following the introduction of solar subsidies.'
  },
  {
    id: 'wp-trend-stable',
    category: 'Xu Hướng Ổn Định (Stable Trend)',
    descriptionVi: 'Mô tả số liệu đi ngang, dao động nhẹ',
    corePhrases: ['remained stable at around...', 'stayed relatively constant', 'fluctuated slightly'],
    upgradePhrases: ['plateaued at...', 'hovered around the [X]% mark'],
    exampleSentence: 'The literacy rate remained stable at around 92% throughout the decade.'
  },
  {
    id: 'wp-solution',
    category: 'Đề Xuất Giải Pháp (Solution)',
    descriptionVi: 'Khuyến nghị hành động cho chính phủ và cá nhân',
    corePhrases: ['Governments should...', 'One effective measure is to...', 'Individuals can contribute by...'],
    upgradePhrases: ['It is imperative that authorities...', 'A multi-pronged approach is required to...'],
    exampleSentence: 'Governments should invest in modern recycling plants to minimize urban waste.'
  },
  {
    id: 'wp-conclusion',
    category: 'Kết Luận (Conclusion)',
    descriptionVi: 'Tóm lược toàn bộ bài viết trong 1–2 câu',
    corePhrases: ['In conclusion,...', 'To sum up,...', 'Overall, it is evident that...'],
    upgradePhrases: ['Taking all factors into consideration,...', 'All things considered,...'],
    exampleSentence: 'In conclusion, while technological devices bring undeniable convenience, moderate screen time is essential.'
  }
];

