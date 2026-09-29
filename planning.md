# IELTS Prep Studio — Product & Engineering Planning

> **Purpose:** This document is the single source of truth for the next major development phase of IELTS Prep Studio.
>
> The goal is **not** to redesign the product into another flashcard clone.  
> Keep the current visual identity and overall form-based UI style.  
> We only borrow **learning mechanics, task design, service architecture, and workflow ideas** from other projects.

---

# 1. Product Direction

IELTS Prep Studio is a personal-first, potentially multi-user IELTS learning platform focused on:

1. Vocabulary acquisition and long-term retention.
2. Reading practice and reading strategies.
3. Listening practice and listening strategies.
4. Grammar as a structured knowledge base.
5. Writing notes and reusable structures.
6. Speaking notes and reusable stories.
7. Mistake tracking and spaced mistake review.
8. Personal progress tracking.
9. Local-first learning with lightweight cloud synchronization.

The learner profile currently targeted is:

- Current level: approximately IELTS 4.0.
- Target: IELTS 6.5 in about 6 months.
- Long-term target: IELTS 7.0 in about 1 year.
- Daily study time: approximately 3 hours.
- Reading and Listening are the main IELTS practice modules.
- Writing and Speaking are primarily supported through notes/frameworks; active practice can be done with ChatGPT.

---

# 2. Core Product Philosophy

The app should feel like:

> **A personal IELTS notebook that tells me what to learn next and makes me actively recall what I learned.**

It should NOT feel like:

- an engineering dashboard,
- a database admin UI,
- a generic flashcard clone,
- a gamified language-learning app,
- a collection of disconnected tools.

The primary learning loop is:

```text
LEARN
↓
PRACTICE
↓
MAKE A MISTAKE
↓
UNDERSTAND WHY
↓
SAVE THE MISTAKE / WORD
↓
RETRY LATER
↓
MASTER
```

Vocabulary should have an even stronger loop:

```text
ENCOUNTER WORD
↓
UNDERSTAND MEANING
↓
SAVE CONTEXT
↓
RECOGNIZE
↓
RECALL
↓
TYPE
↓
USE IN CONTEXT
↓
REVIEW LATER
↓
MASTER
```

---

# 3. Important Design Constraint

## Keep the current visual style

Do not copy the UI of Lexuni, Recall, Quizlet clones, Lector, or any referenced repository.

Those projects are useful for:

- practice queue design,
- spaced repetition behavior,
- answer checking,
- card scheduling,
- context-based vocabulary learning,
- bulk import,
- offline-first architecture,
- service organization,
- mistake handling.

They are NOT visual references.

### UI rule

The existing IELTS Prep Studio look-and-feel should remain recognizable.

Improvements should focus on:

- less visual noise,
- clearer hierarchy,
- fewer unnecessary icons,
- fewer tiny labels,
- better spacing,
- simpler actions,
- better content grouping.

Do not replace the current UI with a generic flashcard layout.

---

# 4. Platform Strategy

The main product remains a **web application**.

Recommended stack:

```text
Frontend
React + Vite

Local storage
IndexedDB

Cloud API
Cloudflare Worker or existing lightweight API

Cloud database
Cloudflare D1

Large static/audio files
Current Vite static assets for now
Optional R2 later
```

The web app should do as much work as possible on the client.

---

# 5. Lightweight Server Architecture

The goal is to comfortably support around 200 users without requiring a large server.

## Client responsibilities

The browser should handle:

- rendering,
- vocabulary review,
- answer checking,
- SRS/FSRS calculations,
- reading practice,
- listening practice state,
- retry queues,
- temporary session state,
- cached lessons,
- cached vocabulary,
- local review history.

## Cloud responsibilities

The server/cloud should handle:

- authentication,
- cross-device synchronization,
- persistent backup,
- changed records,
- user profile,
- personal vocabulary state,
- attempts,
- mistakes,
- progress,
- content version metadata.

The browser should **not** query the server for every card interaction.

Correct flow:

```text
User reviews 50 cards
↓
All interactions saved locally
↓
Session ends / periodic sync
↓
One batch sync request
```

Not:

```text
Review one card
↓
POST server

Review next card
↓
POST server
```

---

# 6. Static Content Strategy

The following content is mostly static and should not require database queries for every user:

- Grammar lessons.
- Reading strategy lessons.
- Listening strategy lessons.
- Writing notes.
- Speaking notes.
- Built-in vocabulary packs.
- Paraphrase banks.
- Phrase banks.
- Foundation exercises.

Initial implementation can keep them as:

```text
public/content/
src/data/
```

Later they can become versioned content packages:

```text
grammar-v5.json
reading-strategy-v3.json
listening-strategy-v4.json
vocab-core-v8.json
```

Clients should cache them.

---

# 7. Navigation / Information Architecture

Keep the UI form style, but organize the product logically.

Recommended top-level structure:

```text
HÔM NAY

LUYỆN
- Reading
- Listening

KIẾN THỨC
- Grammar
- Vocabulary
- Writing
- Speaking
- Chiến thuật

ÔN TẬP
- Lỗi sai
- Tiến độ
```

Writing and Speaking should not compete visually with Reading/Listening because they are not the primary practice engines.

---

# 8. Today Page

The Today page should answer one question:

> **What should I study now?**

Above the fold:

```text
Chào Bao

Ngày 17 / 180
Mục tiêu: 6.5

HÔM NAY

✓ Vocabulary        20 phút
○ Grammar           25 phút
○ Reading           50 phút
○ Listening         50 phút
○ Ôn lỗi sai        20 phút
○ Đọc paper         15 phút

65 / 180 phút
```

Then:

```text
NÊN LUYỆN TIẾP

Matching Headings
Độ chính xác: 52%

[Luyện]
```

Then:

```text
TỪ CẦN ÔN

18 từ

[Ôn ngay]
```

Do not show fake statistics.

If not enough data exists:

```text
Chưa đủ dữ liệu để xác định điểm yếu.

[Làm bài chẩn đoán]
```

If vocabulary due = 0:

```text
Không có từ đến hạn.

[Học 5 từ mới]
```

Never invent fallback values like 52% or 10 words due.

---

# 9. Smart Today Plan

Use simple rule-based recommendations.

Example:

```text
accuracy < 60%
→ strategy lesson + foundation practice

accuracy 60–75%
→ targeted practice

accuracy > 75%
→ mixed practice / passage / test
```

Do not classify an area as weak if there are too few observations.

Suggested minimum:

```text
question_count >= 10
```

Inputs may include:

- recent accuracy,
- total attempts,
- days since last practice,
- active mistakes,
- vocabulary due count,
- unfinished grammar topics.

---

# 10. Vocabulary Is the Most Important Learning Module

Vocabulary should become the most developed learning subsystem in the product.

It should not remain:

```text
word
→ click
→ see meaning
→ Good / Easy
```

It should become an adaptive active-recall engine.

---

# 11. Vocabulary Main Page

Recommended information hierarchy:

```text
VOCABULARY

ÔN HÔM NAY
18 từ
[Bắt đầu]

TỪ MỚI
5 từ đang học

TỪ CỦA TÔI
43 từ

CORE
4.0 → 5.5

IELTS CORE
5.5 → 6.5

UPGRADE
6.5 → 7+

TOPICS
Education
Environment
Technology
...
```

Do not display implementation details such as:

- SM-2 Engine,
- FSRS Engine,
- Lexical Resource Engine,
- database names.

---

# 12. Unified Vocabulary Review Session

Do not force the learner to choose between:

- Flashcard mode,
- Typing mode.

The system should automatically mix exercise types.

Example session:

```text
1. Recall meaning
2. Typing
3. Cloze
4. Recognition
5. Collocation
6. Audio spelling
7. Paraphrase discrimination
8. Same-session retry
```

The learner should simply click:

```text
Bắt đầu ôn
```

---

# 13. Vocabulary Exercise Types

## 13.1 Recall Meaning

Prompt:

```text
significant

Bạn nhớ nghĩa của từ này không?

[Hiện nghĩa]
```

After reveal:

```text
significant
= đáng kể

There was a significant increase in sales.

Collocations:
significant increase
significant difference
significant impact
```

---

## 13.2 Vietnamese → English Typing

```text
đáng kể

There was a ______ increase in sales.

[_______________]
```

Expected:

```text
significant
```

---

## 13.3 Cloze

```text
The difference between the two groups was ______.

[_______________]
```

---

## 13.4 Audio → Spelling

Play audio.

Prompt:

```text
[_______________]
```

Expected:

```text
significant
```

Audio priority:

```text
Dictionary audio
↓
cached audio
↓
TTS fallback
```

---

## 13.5 Collocation

```text
Choose the natural phrase:

A. strong increase
B. significant increase
C. heavy increase
D. hard increase
```

---

## 13.6 Paraphrase in Context

```text
The number of visitors increased significantly.

Which alternative keeps the meaning best?

A. rose considerably
B. exploded badly
C. lifted strongly
D. grew hardly
```

---

## 13.7 Word Family

Example:

```text
significant — adjective
significantly — adverb
significance — noun
```

Do not automatically create separate cards for all forms unless useful.

---

# 14. Adaptive Exercise Selection

Do not choose exercise types uniformly.

Example policy:

## New words

```text
40% recognition/reveal
30% typing
20% cloze
10% collocation
```

## Learning words

```text
15% recognition
45% typing
25% cloze
15% collocation/audio
```

## Mature words

```text
10% recognition
40% typing
25% context
15% collocation
10% audio
```

Principle:

> The stronger the memory, the more active recall should be required.

---

# 15. Same-Session Relearning

If the learner gets a word wrong, do not simply schedule it for tomorrow.

Example:

```text
environment

typed:
enviroment
```

Show:

```text
Almost correct — spelling

Your answer:
enviroment

Correct:
environment
```

Then put the card back into the session after approximately:

```text
3–7 cards
```

If correct next time:

```text
Recovered
```

If wrong again:

reinsert sooner.

---

# 16. Error Types

Do not treat every incorrect answer the same.

Suggested categories:

```text
RECALL_FAILURE
SPELLING_ERROR
MORPHOLOGY_ERROR
MEANING_CONFUSION
COLLOCATION_ERROR
CONTEXT_ERROR
```

Examples:

```text
environment
enviroment
→ SPELLING_ERROR
```

```text
significant
significance
→ MORPHOLOGY_ERROR
```

```text
mitigate
blank
→ RECALL_FAILURE
```

Use string-distance logic for typo classification.

Suggested algorithm:

```text
Damerau-Levenshtein
```

---

# 17. Response Time

Record:

```text
response_time_ms
hint_used
attempt_count
review_mode
correct
error_type
```

Do not automatically punish slower responses.

Response time should be a secondary memory-strength signal.

---

# 18. Review Log

Recommended table / model:

```text
vocab_review_log

id
user_id
card_id
review_mode
correct
rating
response_time_ms
hint_used
typed_answer
error_type
created_at
```

This can be stored locally first and synced later.

---

# 19. SRS / FSRS

Current scheduler can continue initially if stable.

However:

- Never hard-code button intervals if scheduler returns different intervals.
- Show the actual next interval.
- Preserve historical progress.

Long-term recommended scheduler:

```text
FSRS
```

But FSRS migration is lower priority than:

1. bulk input,
2. automatic enrichment,
3. adaptive review,
4. same-session relearning.

---

# 20. Bulk Add Vocabulary — Critical Requirement

The add-word feature must accept:

- one word,
- one phrase,
- multiline pasted text,
- numbered list,
- bullet list,
- semicolon-separated list,
- TXT file,
- CSV file.

Example input:

```text
consistency
candidate
dimensional
angular pattern
imdependent
diagnostic
formulation
rollout
consistent
conditioning
Basin collapse
```

Expected detection:

```text
consistency       → word
candidate         → word
dimensional       → word
angular pattern   → phrase
imdependent       → possible typo
diagnostic        → word
formulation       → word
rollout           → ambiguous word
consistent        → word family of consistency
conditioning      → ambiguous/technical
Basin collapse    → technical phrase
```

---

# 21. Bulk Parser Rules

Priority:

```text
newline
→ one item per line
```

Then:

```text
strip bullet prefixes:
-
*
•
```

Then:

```text
strip numbered prefixes:
1.
2.
3.
```

Semicolon may optionally separate items.

Do not blindly split by comma.

Example:

```text
consistent, reliable and robust
```

may be context, not three independent cards.

Comma splitting should only occur in explicit CSV mode.

---

# 22. Unified Add Vocabulary UI

Do not maintain separate mental models for:

- Add single word,
- Import file.

Use one flow.

Example:

```text
THÊM TỪ

Dán từ, cụm từ hoặc danh sách:

[ textarea ]

[ Dán clipboard ]
[ Chọn TXT/CSV ]

[ Phân tích ]
```

Preview:

```text
11 mục được phát hiện

✓ consistency
✓ candidate
✓ dimensional
✓ angular pattern       Phrase
! imdependent           Có thể là: independent
? formulation           Nhiều nghĩa
? rollout               Nhiều nghĩa
✓ consistent            Family: consistency
? conditioning          Context recommended
? Basin collapse        Technical phrase
```

Then:

```text
[Tra nghĩa tất cả]
```

---

# 23. Typo Detection

Do not silently auto-correct.

Example:

```text
imdependent
```

Show:

```text
Có thể bạn muốn:
independent

[Dùng đề xuất]
[Giữ nguyên]
```

Use:

- dictionary lookup,
- fuzzy matching,
- edit distance,
- optional Datamuse-like suggestion service.

---

# 24. Auto-Enrichment

After parsing terms, enrich automatically.

Expected fields:

```text
term
lemma
phonetic
audio
partOfSpeech
definitionEn
meaningVi
examples
collocations
paraphrases
sourceContext
sourceType
topic
level
```

User should usually only need to provide:

```text
word / phrase
```

and optionally:

```text
context
```

---

# 25. Dictionary Lookup Service

Recommended API shape:

```text
GET /api/vocab/lookup?word=mitigate
```

Normalize external dictionary result.

Response:

```json
{
  "word": "mitigate",
  "lemma": "mitigate",
  "phonetic": "...",
  "audio": "...",
  "partOfSpeech": "verb",
  "senses": [
    {
      "definitionEn": "...",
      "examples": [],
      "synonyms": [],
      "antonyms": []
    }
  ]
}
```

External dictionary implementation can change later.

The frontend should not depend directly on a third-party schema.

---

# 26. Vietnamese Meaning

The system can suggest Vietnamese meanings automatically.

However:

> Never auto-save a suggested meaning without user confirmation.

Example:

```text
issue
```

Possible meanings:

```text
vấn đề
số báo
phát hành
cấp/phát
```

User must choose the intended sense.

---

# 27. Context-Aware Vocabulary

This is especially important because the learner reads scientific papers.

Example word:

```text
conditioning
```

Without context, meaning is ambiguous.

Optional input:

```text
Context:

The conditioning of the optimization problem
becomes worse near singular configurations.
```

The system should infer the likely technical meaning.

Store:

```text
source_context
source_type
source_reference
```

Example card:

```text
conditioning

Trong context này:
độ điều kiện / tính điều kiện của bài toán

Related:
well-conditioned
ill-conditioned
condition number
```

---

# 28. Duplicate Handling

If a word already exists:

```text
mitigate
```

Do not create another card automatically.

Show:

```text
Bạn đã có từ này.

Next review:
tomorrow

Actions:
- Add new context
- Update meaning
- Cancel
```

Multiple contexts per word should be supported.

---

# 29. Word vs Phrase

The system must distinguish:

```text
consistency
→ word
```

```text
angular pattern
→ phrase
```

```text
basin collapse
→ phrase
```

This affects:

- answer checking,
- matching tolerance,
- cloze generation,
- context exercises.

---

# 30. Save Vocabulary From Reading

Reading should support:

```text
select/highlight unknown word
↓
Save to Vocabulary
```

Capture:

```text
selected term
full sentence
passage ID
question/test ID if applicable
source = reading
```

Then enrich automatically.

Later review may reuse the original sentence as cloze.

Example:

```text
The policy mitigated the negative effects.
```

Later:

```text
The policy ______ the negative effects.
```

---

# 31. Save Vocabulary From Listening

Same flow from transcript review.

Capture:

```text
word
transcript sentence
listening test
part
source = listening
```

---

# 32. Personal Vocabulary Priority

Words personally encountered in:

- Reading,
- Listening,
- papers,
- manual paste,

should receive high review priority.

The app should not bury them under large generic vocabulary decks.

---

# 33. Vocabulary Levels

Recommended structure:

```text
CORE
4.0 → 5.5

IELTS CORE
5.5 → 6.5

UPGRADE
6.5 → 7+
```

Default for the current learner:

```text
CORE 4.0 → 5.5
```

Foundation should include highly reusable words.

Examples:

```text
increase
decrease
change
reason
cause
effect
problem
solution
improve
reduce
important
likely
benefit
result
environment
education
technology
government
society
health
work
```

Move rarer terms such as:

```text
proliferation
empirical
discrepancy
pedagogy
```

to later levels.

---

# 34. Vocabulary Sources

Recommended content hierarchy:

```text
1. Personal encountered words
2. High-frequency general vocabulary
3. IELTS functional vocabulary
4. Academic vocabulary
5. Rare upgrade vocabulary
```

Potential source families:

- NGSL-style high-frequency vocabulary.
- Academic word lists.
- Vocabulary extracted from Reading/Listening content.
- User personal vocabulary from papers.

Do not blindly import thousands of words.

Prefer:

```text
500 deeply learned useful words
```

over:

```text
5000 shallow cards
```

---

# 35. Paraphrase Bank

Paraphrase learning is important for Reading and Writing.

But do not teach synonyms as fully interchangeable.

Example:

```text
increase

rise
grow
escalate
```

Need nuance.

Store:

```text
word
alternative
register
collocation
example
usage_note
```

Example:

```text
rise
neutral
the number rose

grow
common
the population grew

escalate
usually negative/intense
costs escalated
```

---

# 36. Paraphrase Exercises

Example:

```text
The number of students ____ from 200 to 350.

A. rose
B. escalated
C. lifted
D. exploded
```

Correct:

```text
rose
```

Explain why.

---

# 37. Vocabulary Session Summary

At end:

```text
Hôm nay

Reviewed: 24
Remembered: 18
Spelling errors: 3
Forgot: 3
New words: 5
Need another round today: 3
```

Keep it simple.

No excessive charts.

---

# 38. Reading Structure

Recommended tabs:

```text
Học theo dạng
Luyện Passage
Full Test
```

Default:

```text
Học theo dạng
```

---

# 39. Reading Question Type Groups

Avoid 14 equal buttons.

Group:

```text
STATEMENTS
- True / False / Not Given
- Yes / No / Not Given

MATCHING
- Matching Headings
- Matching Information
- Matching Features
- Matching Sentence Endings

COMPLETION
- Sentence Completion
- Summary Completion
- Note Completion
- Table Completion
- Flow-chart Completion
- Diagram Labelling

QUESTIONS
- Multiple Choice
- Short Answer
```

---

# 40. Reading Strategy Lessons

Each question type should have:

```text
1. Cần hiểu gì?
2. Cách làm
3. Keyword / paraphrase
4. Bẫy thường gặp
5. Ví dụ
6. Mini practice
7. Review
```

Clearly distinguish:

```text
OFFICIAL FORMAT
RECOMMENDED STRATEGY
COMMON TRAP
```

Do not present coaching preferences as official IELTS rules.

Examples of claims to avoid:

```text
Always do Matching Headings first.
```

Instead:

```text
One useful strategy is...
Test whether this works for you.
```

---

# 41. Reading Foundation Mode

For learner around Band 4.0:

```text
200–400 words
5–8 questions
one target skill
```

Label clearly:

```text
Training Exercise
```

Do not pretend these are full IELTS tests.

---

# 42. Reading Review

Every question review should show:

```text
YOUR ANSWER

CORRECT ANSWER

EVIDENCE

QUESTION KEYWORDS

PARAPHRASE

WHY

VOCABULARY
```

Example:

```text
Question:
started

Passage:
was launched

Paraphrase:
started ≈ was launched
```

---

# 43. Listening Structure

Recommended tabs:

```text
Học kỹ năng
Luyện theo Part
Full Test
```

---

# 44. Listening Strategy Curriculum

Must include:

```text
Prediction before listening
Distractors
Form Completion
Note/Table Completion
Multiple Choice
Matching
Map & Plan
Sentence Completion
Short Answer
Names / Dates / Addresses
Numbers
Spelling
Singular / Plural
Part 3 speaker opinions
Part 4 signposting
Correction language
```

---

# 45. Listening Micro Drills

Example:

```text
"The class was originally scheduled for Room 12,
but it has been moved to Room 18."

Question:
Room: _____
```

Correct:

```text
18
```

Explain:

```text
12 = first information
18 = final information
```

Signal words:

```text
but
actually
however
instead
changed to
rather than
```

---

# 46. Listening Review

Order:

```text
YOUR ANSWER
CORRECT ANSWER
TRANSCRIPT SENTENCE
DISTRACTOR
PARAPHRASE
MY ERROR
ADD TO VOCAB
```

Error tags:

```text
spelling
plural/singular
number
distractor
missed keyword
unknown vocabulary
lost concentration
```

---

# 47. Listening Audio

For now:

```text
Vite static files
```

Later:

```text
R2
```

Priority:

```text
real audio
↓
private/local audio
↓
high-quality TTS
↓
browser TTS fallback
```

Never label TTS as official IELTS audio.

---

# 48. Grammar Structure

Organize by concept, not only G01–G26.

Recommended categories:

```text
NỀN TẢNG
- Sentence Structure
- Subject–Verb Agreement
- Tenses
- Articles
- Countable / Uncountable

MÔ TẢ & SO SÁNH
- Adjectives
- Adverbs
- Comparison
- Prepositions

MỆNH ĐỀ & CÂU PHỨC
- Relative Clauses
- Passive
- Modals
- Gerund / Infinitive
- Conditionals
- Complex Sentences

LIÊN KẾT Ý
- Cause & Effect
- Contrast
- Purpose
- Result
- Linking Ideas

ACADEMIC WRITING
- Hedging
- Cohesion
- Paragraph Linking

NÂNG CAO
- Participle Clauses
- Nominalisation
- Inversion
- Cleft Sentences
```

---

# 49. Standard Grammar Lesson

Every lesson should prefer:

```text
CẦN NHỚ TRONG 30 GIÂY

KHI NÀO DÙNG

CÔNG THỨC

VÍ DỤ DỄ

VÍ DỤ IELTS

LỖI THƯỜNG GẶP

MINI PRACTICE

TÓM TẮT
```

Do not overuse long theoretical explanations.

---

# 50. Grammar Content Quality

Avoid absolute or misleading claims.

Do not say:

```text
Inversion = Band 7.5+
Nominalisation = Band 7.5+
Never use will in if-clause
```

Prefer:

```text
optional advanced structure
normally
typically
in standard first conditional
```

Do not mark singular "they" as inherently incorrect.

---

# 51. Writing Notes

Writing should remain a cheat-sheet/reference module.

Do not turn it into an essay generator.

Each type should include:

```text
STRUCTURE
CORE FRAMES
OPTIONAL ADVANCED FRAMES
COMMON MISTAKES
CHECKLIST
```

Core language should be B1–B2 friendly.

Examples:

```text
I believe that...
One important reason is that...
For example,...
As a result,...
However,...
A possible solution is...
```

Advanced expressions should be collapsed by default.

---

# 52. Writing Task Types

Keep clearly separated:

```text
Opinion
Discussion
Advantages & Disadvantages
Outweigh
Problems & Solutions
Causes & Solutions
Two-part Question
```

Opinion allows:

```text
Agree
Disagree
Partly agree
```

Do not present one teacher strategy as an official IELTS requirement.

---

# 53. Writing Phrase Bank

Useful functional categories:

```text
Give Opinion
Give Reason
Give Example
Cause
Effect
Contrast
Comparison
Trend Up
Trend Down
Stable Trend
Solution
Conclusion
```

Each should provide:

```text
Core phrases
Optional upgrade phrases
Examples
```

---

# 54. Speaking Notes

Core frameworks:

## Part 1

```text
Answer
Reason
Example
```

## Part 2

```text
What
When / Where
Details
Why
Feeling
```

## Part 3

```text
Opinion
Reason
Example
Contrast / Consequence
```

Core language should remain natural.

Avoid overly academic phrases by default.

---

# 55. Speaking Story Bank

Maintain a reusable story bank.

Recommended stories:

```text
1. Difficult project
2. Teacher/person
3. Memorable trip
4. Useful object
5. Technology/device
6. Challenge/mistake
7. Achievement
8. Helping someone
9. Interesting event
10. New skill
11. Important decision
12. Favourite activity
```

Each story:

```text
Short version
Extended version
Useful phrases
Feelings
Possible cue cards
Related topics
```

---

# 56. Mistake Review System

Mistakes should not merely be stored.

Lifecycle:

```text
NEW
↓
RETRY
↓
LEARNING
↓
MASTERED
```

Simple schedule:

```text
first retry: +1 day
second retry: +3 days
third retry: +7 days
```

After two successful retries:

```text
MASTERED
```

---

# 57. Mistake Review UI

Example:

```text
MATCHING HEADINGS

Sai ngày 21/09

Lý do:
○ Không hiểu main idea
● Chọn theo keyword giống nhau
○ Không nhận ra paraphrase

[Thử lại]
```

This should become one of the main learning loops.

---

# 58. Progress Page

Progress should not duplicate Today.

Recommended sections:

```text
THIS WEEK
- Study minutes
- Reading questions
- Listening questions
- Vocabulary reviews

SKILL PROGRESS
- Reading accuracy
- Listening accuracy

MASTERY
- T/F/NG
- Matching Headings
- Listening MCQ
- Listening Map

GRAMMAR
12 / 20 Essential topics

VOCABULARY
420 / 600 Core words

CURRENT PHASE
Foundation / Skills / IELTS Practice / Exam
```

---

# 59. Competency-Based Progress

Do not rely only on:

```text
Day X / 180
```

Track:

```text
T/F/NG
Mastered

Matching Headings
Learning

Listening Map
Weak

Core Grammar
12/20

Core Vocabulary
420/600
```

---

# 60. Local-First Data Design

Primary runtime data should be local.

Recommended IndexedDB stores:

```text
user_vocabulary
vocab_review_log
vocab_progress

reading_attempts
listening_attempts

mistakes
mistake_retry_queue

grammar_progress
daily_progress

sync_queue
cached_content
cached_dictionary
```

Every local record should have:

```text
id
user_id
updated_at
sync_state
```

Possible states:

```text
synced
pending_create
pending_update
pending_delete
failed
```

---

# 61. Sync Architecture

Recommended core endpoints:

```text
GET  /api/bootstrap
POST /api/sync/push
GET  /api/sync/pull?cursor=...

GET  /api/vocab/lookup?q=...

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Avoid many small network requests.

---

# 62. Sync Push

Example:

```json
{
  "cursor": 17343,
  "changes": [
    {
      "entity": "vocab_progress",
      "operation": "update",
      "payload": {}
    }
  ]
}
```

Server responds:

```json
{
  "cursor": 17381,
  "accepted": 27
}
```

---

# 63. Cloud Data Role

D1 should be used as:

```text
cloud backup
cross-device sync
multi-user persistence
```

not as the source for every runtime interaction.

Store cloud-side:

```text
users
sessions
personal vocabulary metadata
vocabulary current state
attempt summaries
mistakes
progress
settings
sync cursors
```

---

# 64. 200 User Capacity Target

Architecture should comfortably support roughly:

```text
200 active users
```

without requiring a large dedicated server.

Target behavior:

```text
static assets
→ CDN

learning actions
→ local browser

cloud
→ batch sync only
```

The main bottlenecks to monitor are:

- D1 row reads,
- D1 row writes,
- unindexed queries,
- external dictionary lookup,
- audio traffic,
- unnecessary API calls.

CPU/RAM should not be the primary concern.

---

# 65. Content Quality Rules

All IELTS teaching content should distinguish between:

```text
OFFICIAL REQUIREMENT
RECOMMENDED STRATEGY
OPTIONAL UPGRADE
```

Never phrase coaching preferences as official exam rules.

Avoid statements like:

```text
IELTS examiner loves X
Use inversion for Band 7
You must always do X first
```

unless the statement is truly official.

---

# 66. Content Sources

Preferred public sources for structure and exam rules:

```text
IELTS.org
British Council
IDP
```

Vocabulary sources:

```text
high-frequency general vocabulary lists
academic vocabulary lists
trusted dictionaries
personal vocabulary from Reading/Listening/papers
```

Commercial Cambridge material should remain private/imported, not committed to a public repository.

---

# 67. Repositories to Learn From

Do not copy their design.

Use them for learning mechanics.

## Lexuni

Learn from:

- React/Vite local-first patterns,
- IndexedDB/Dexie usage,
- practice queue,
- bulk import,
- resume session.

## Recall

Learn from:

- FSRS integration,
- review service architecture,
- review history,
- card browser,
- session state.

## Lector

Learn from:

- reading text,
- click unknown word,
- save context,
- vocabulary from real content.

## StudySet / Quizlet Learn Clone

Learn from:

- delimiter detection,
- import preview,
- audio caching,
- session resume,
- multiple task types.

## No BS FSRS

Learn from:

- word vs phrase handling,
- answer matching,
- minimal FSRS flow.

## LinguaCafe / Lute

Learn from:

- vocabulary acquired from real text,
- dictionary/context workflow,
- familiarity status.

Again:

> Keep IELTS Prep Studio's current UI identity.

---

# 68. Recommended Development Order

## Phase 1 — Vocabulary Core

1. Unified bulk add.
2. Robust parser.
3. Typo detection.
4. Auto dictionary lookup.
5. Context-aware meaning.
6. Duplicate handling.
7. Save word from Reading/Listening.
8. Adaptive review modes.
9. Same-session relearning.
10. Error classification.
11. Review logs.

---

## Phase 2 — Vocabulary Content

1. Rebuild Core 4.0–5.5.
2. IELTS Core 5.5–6.5.
3. Upgrade 6.5–7+.
4. Paraphrase bank.
5. Collocation tasks.
6. Personal vocabulary priority.
7. Scientific-paper context support.

---

## Phase 3 — Reading

1. Complete strategy lessons.
2. Correct misleading strategy claims.
3. Foundation exercises.
4. Better evidence/paraphrase review.
5. Save unknown words.

---

## Phase 4 — Listening

1. Expand strategy curriculum.
2. Add micro drills.
3. Better transcript review.
4. Save unknown words.
5. Improve real audio support.

---

## Phase 5 — Knowledge Content

1. Grammar restructuring.
2. Grammar content audit.
3. Writing note cleanup.
4. Writing phrase bank.
5. Speaking story bank.

---

## Phase 6 — Review & Personalization

1. Mistake retry queue.
2. Competency progress.
3. Smart Today recommendations.
4. Diagnostic flow.

---

## Phase 7 — Scheduler Improvement

Only after previous phases stabilize:

```text
Evaluate FSRS migration.
```

Do not migrate scheduler early if review mechanics are still changing.

---

# 69. Acceptance Tests

## Vocabulary bulk import

Input:

```text
consistency
candidate
dimensional
angular pattern
imdependent
diagnostic
formulation
rollout
consistent
conditioning
Basin collapse
```

Expected:

- 11 detected entries.
- phrases preserved.
- typo suggestion for imdependent.
- consistent linked to consistency family.
- context recommendation for conditioning.
- technical phrase handling for Basin collapse.
- no placeholder cards silently saved.

---

## New word lookup

Input:

```text
mitigate
```

Expected:

```text
phonetic
POS
English definition
Vietnamese suggestion
audio
context field
meaning confirmation
```

---

## Same-session review

Add:

```text
significant
```

Same session should include more than one task form.

Example:

```text
first:
significant → recall meaning

later:
đáng kể → type significant
```

---

## Spelling error

Expected:

```text
environment
```

User types:

```text
enviroment
```

Expected:

```text
SPELLING_ERROR
```

not complete recall failure.

Reinsert later in same session.

---

## Context save

Reading:

```text
The new policy mitigated the negative effects.
```

Select:

```text
mitigated
```

Expected card:

```text
lemma = mitigate
source = reading
source_context = original sentence
```

Later review:

```text
The new policy ______ the negative effects.
```

---

## Today

If no weak-area data:

```text
Chưa đủ dữ liệu
```

not fake 52%.

If no vocab due:

```text
0 due
```

not fake 10.

---

## Reading

User unfamiliar with T/F/NG must be able to:

1. learn the rule,
2. see a trap,
3. see an example,
4. do 5 short questions,

without opening Full Test.

---

## Listening

User weak at correction/distractors must be able to:

1. open lesson,
2. see signal words,
3. practice short drills,
4. review transcript.

---

# 70. Definition of Done

A phase is complete only when:

```text
build passes
tests pass
data validation passes
offline behavior works
sync works
two-user isolation works
no fake analytics
no placeholder vocabulary saved without confirmation
```

---

# 71. Final Product Vision

IELTS Prep Studio should become:

```text
READ / LISTEN
↓
NOTICE UNKNOWN LANGUAGE
↓
SAVE
↓
UNDERSTAND
↓
RECALL
↓
TYPE
↓
USE
↓
REVIEW
↓
MASTER
```

At the same time:

```text
LEARN STRATEGY
↓
PRACTICE
↓
MAKE MISTAKE
↓
UNDERSTAND WHY
↓
RETRY
↓
MASTER
```

The user should spend attention on **English**, not on managing the app.

The interface should remain familiar and visually consistent with the current IELTS Prep Studio, while the learning engine becomes substantially more intelligent underneath.
