import React, { useEffect, useMemo, useState } from 'react';
import aptisSamplesJson from '../data/aptisSamples.json';
import { TestAttempt } from '../types';
import { loadAttemptsFromStorage, recordAttempt } from '../utils/db';
import { gradeAptisSample } from '../utils/aptis';

type AptisSample = {
  provenance: 'aptis_import_unverified';
  id: string;
  skill: 'reading' | 'listening' | 'speaking' | 'writing';
  part: string;
  title: string | null;
  instruction: string | null;
  content: Record<string, any>;
  answers: Record<string, any>;
  media: { type: string; path: string }[];
};

export const APTIS_SAMPLES = (aptisSamplesJson as Omit<AptisSample, 'provenance'>[]).map(sample => ({
  ...sample,
  provenance: 'aptis_import_unverified' as const
}));
const skills = [
  ['reading', 'Reading'], ['listening', 'Listening'], ['speaking', 'Speaking'], ['writing', 'Writing']
] as const;
const partLabels: Record<string, Record<string, string>> = {
  reading: { '1': 'Part 1', '2-3': 'Parts 2–3', '4': 'Part 4', '5': 'Part 5' },
  listening: { '1': 'Part 1', '2': 'Part 2', '3': 'Part 3', '4': 'Part 4' },
  speaking: { '1': 'Part 1', '2': 'Part 2', '3': 'Part 3', '4': 'Part 4' },
  writing: { '1': 'Part 1', '2': 'Part 2', '3': 'Part 3', '4': 'Part 4' }
};
const labels: Record<string, string> = {
  question: 'Question', sub_questions: 'Questions', image_description: 'Picture task', main_topic: 'Topic',
  instruction: 'Instructions', prompt: 'Task', recommended_time: 'Suggested time', wordLimit: 'Word limit',
  sampleAnswer: 'Sample answer', sample_answers: 'Sample answers', messages: 'Messages', paragraphs: 'Text',
  article: 'Reading text', first_sentence: 'First sentence', sentences_original: 'Sentences',
  full_text: 'Text', sentence: 'Sentence', text: 'Text', name: 'Speaker', options: 'Options',
  correctAnswer: 'Answer', example: 'Example', answer: 'Sample answer', content: 'Text'
};

function textOf(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function getTitle(sample: AptisSample) {
  return sample.title || textOf(sample.content.article?.title) || textOf(sample.content.club_name) ||
    textOf(sample.content.topic) || `${sample.skill[0].toUpperCase()}${sample.skill.slice(1)} ${partLabels[sample.skill][sample.part] || `Part ${sample.part}`}`;
}

function flattenText(value: unknown, key = '', out: { label: string; value: string }[] = []) {
  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();
    if (text && !['id', 'version', 'clubId', 'club_id', 'layout'].includes(key)) out.push({ label: labels[key] || key.replaceAll('_', ' '), value: text });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => flattenText(item, typeof item === 'object' && item ? (item.name ? 'name' : item.question ? 'question' : item.text ? 'text' : key) : key, out));
  } else if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([childKey, child]) => flattenText(child, childKey, out));
  }
  return out;
}

export const AptisSamplesView: React.FC = () => {
  const [skill, setSkill] = useState<AptisSample['skill']>('reading');
  const [part, setPart] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<AptisSample | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<TestAttempt[]>([]);

  useEffect(() => { void loadAttemptsFromStorage().then(items => setHistory(items.filter(item => item.examFamily === 'aptis'))); }, []);

  const availableParts = useMemo(() => [...new Set(APTIS_SAMPLES.filter(item => item.skill === skill).map(item => item.part))], [skill]);
  const filtered = useMemo(() => APTIS_SAMPLES.filter(item => item.skill === skill && (part === 'all' || item.part === part)), [skill, part]);
  const pageSize = 20;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageSamples = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const isAutoScored = selected?.skill === 'reading' || selected?.skill === 'listening';

  const changeSkill = (next: AptisSample['skill']) => { setSkill(next); setPart('all'); setPage(0); };
  const openSample = (sample: AptisSample) => { setSelected(sample); setAnswers({}); setScore(null); setSubmitted(false); };
  const setAnswer = (id: string, value: string) => setAnswers(current => ({ ...current, [id]: value }));

  const getQuestions = (sample: AptisSample) => sample.skill === 'listening'
    ? (sample.content.items ?? []) as Record<string, any>[]
    : (sample.content.questions ?? []) as Record<string, any>[];

  const grade = async () => {
    if (!selected || !isAutoScored) return;
    const result = gradeAptisSample(selected, answers);
    if (!result) return;
    const { score: correct, total } = result;
    setScore(correct);
    setSubmitted(true);
    const attempt: TestAttempt = {
      id: `aptis-${selected.id}-${Date.now()}`,
      examFamily: 'aptis',
      skill: selected.skill as 'reading' | 'listening',
      sectionId: selected.id,
      sectionTitle: getTitle(selected),
      date: new Date().toISOString(),
      score: correct,
      total,
      durationSeconds: 0,
      mode: 'study',
      userAnswers: answers,
      incorrectQuestionNumbers: [],
      mistakeTags: []
    };
    await recordAttempt(attempt);
    setHistory(items => [attempt, ...items.filter(item => item.id !== attempt.id)].slice(0, 100));
  };

  const choice = (id: string, options: unknown[], expected: string | undefined, namePrefix: string) => (
    <fieldset className="mt-4 space-y-2" key={id}>
      {options.map((rawOption, index) => {
        const option = typeof rawOption === 'object' && rawOption ? textOf((rawOption as any).text ?? (rawOption as any).label) : String(rawOption);
        const value = namePrefix === 'listen' ? String(index) : option;
        const correct = submitted && value === expected;
        return <label key={`${id}-${index}`} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm ${correct ? 'border-emerald-700 bg-emerald-50 text-emerald-950' : 'border-line bg-paper hover:bg-paper-deep'}`}>
          <input type="radio" name={`${namePrefix}-${id}`} value={value} checked={answers[id] === value} disabled={submitted} onChange={() => setAnswer(id, value)} className="mt-0.5 accent-emerald-800" />
          <span>{option}</span>
        </label>;
      })}
      {submitted && expected && <p className="text-xs text-emerald-800">Đáp án: {expected}</p>}
    </fieldset>
  );

  const renderPractice = (sample: AptisSample) => {
    if (sample.skill === 'listening') {
      return <div className="space-y-7">
        {sample.media.filter(item => item.type === 'audio').map(item => <audio key={item.path} controls preload="none" className="w-full" src={item.path}>Trình duyệt không hỗ trợ phát âm thanh.</audio>)}
        {(sample.content.items ?? []).map((item: Record<string, any>, i: number) => {
          const expected = String(item.answerIndex ?? sample.answers[item.id]?.answer_index ?? '');
          return <section key={item.id ?? i} className="border-b border-line pb-6 last:border-0"><h3 className="font-medium text-ink">{item.prompt || `Question ${i + 1}`}</h3>{choice(item.id ?? String(i), item.options ?? [], expected, 'listen')}</section>;
        })}
      </div>;
    }

    if (sample.part === '1') return <div className="space-y-7">
      {sample.content.full_text && <p className="whitespace-pre-wrap leading-8 text-ink">{sample.content.full_text}</p>}
      {(sample.content.questions ?? []).map((question: Record<string, any>, i: number) => {
        const expected = String(question.correctAnswer ?? sample.answers[question.id] ?? '');
        return <section key={question.id} className="border-b border-line pb-6 last:border-0"><h3 className="font-medium text-ink">{question.sentence || question.text || `Blank ${i + 1}`}</h3>{choice(question.id ?? String(i), question.options ?? [], expected, 'read')}</section>;
      })}
    </div>;

    if (sample.part === '2-3') {
      const sentences = sample.content.sentences_original ?? [];
      const target = sample.answers.correct_order ?? sentences.map((_: unknown, i: number) => i);
      return <div className="space-y-5">
        {sample.content.first_sentence && <p className="rounded-md bg-paper-deep p-4 leading-7">{sample.content.first_sentence}</p>}
        <p className="text-sm text-muted">Đặt các câu theo đúng thứ tự để tạo thành đoạn văn.</p>
        {sentences.map((sentence: { id: string; text: string }, i: number) => <label key={sentence.id} className="grid grid-cols-[auto_1fr] gap-3 rounded-md border border-line p-4">
          <select aria-label={`Vị trí câu ${i + 1}`} value={answers[sentence.id] ?? ''} disabled={submitted} onChange={event => setAnswer(sentence.id, event.target.value)} className="h-9 rounded border border-line bg-paper px-2 text-sm"><option value="">Vị trí</option>{sentences.map((_: unknown, position: number) => <option key={position} value={String(position + 1)}>{position + 1}</option>)}</select>
          <span className={submitted && Number(answers[sentence.id]) === target.indexOf(i) + 1 ? 'text-emerald-800' : 'leading-6'}>{sentence.text}</span>
        </label>)}
      </div>;
    }

    const paragraphs = sample.content.paragraphs ?? sample.content.article?.paragraphs ?? [];
    const questions = sample.content.questions ?? [];
    return <div className="space-y-7">
      {sample.content.instruction && <p className="leading-7 text-muted">{sample.content.instruction}</p>}
      {sample.content.article?.title && <h3 className="font-display text-2xl text-ink">{sample.content.article.title}</h3>}
      {paragraphs.map((paragraph: Record<string, any>, i: number) => <article key={paragraph.id ?? i} className="rounded-md bg-paper-deep p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{paragraph.name || paragraph.id?.split('::').at(-1) || `Paragraph ${i + 1}`}</h3><p className="whitespace-pre-wrap leading-7 text-ink">{paragraph.content}</p>
      </article>)}
      {questions.map((question: Record<string, any>, i: number) => {
        const expected = String(question.correctParagraphId ?? sample.answers[question.id] ?? '');
        const options = paragraphs.map((paragraph: Record<string, any>) => ({ text: paragraph.name || paragraph.id?.split('::').at(-1), value: paragraph.id }));
        return <section key={question.id} className="border-b border-line pb-6 last:border-0"><h3 className="font-medium text-ink">{question.text || `Question ${i + 1}`}</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{options.map((option: { text: string; value: string }) => <label key={option.value} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${submitted && expected === option.value ? 'border-emerald-700 bg-emerald-50' : 'border-line bg-paper'}`}><input type="radio" name={`read-${question.id}`} checked={answers[question.id] === option.value} disabled={submitted} onChange={() => setAnswer(question.id, option.value)} />{option.text}</label>)}</div>
        </section>;
      })}
    </div>;
  };

  if (selected) {
    const sampleTitle = getTitle(selected);
    const fields = selected.skill === 'speaking' || selected.skill === 'writing' ? flattenText(selected.content) : [];
    return <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <button type="button" onClick={() => setSelected(null)} className="text-sm text-accent hover:underline">← Tất cả mẫu đề</button>
      <header className="border-b border-line pb-6"><p className="eyebrow">{selected.skill.toUpperCase()} · {partLabels[selected.skill][selected.part] || `Part ${selected.part}`}</p><h1 className="mt-3 font-display text-4xl text-ink">{sampleTitle}</h1>{selected.instruction && <p className="mt-4 leading-7 text-muted">{selected.instruction}</p>}</header>
      {selected.media.filter(item => item.type === 'image').map(item => <img key={item.path} src={item.path} alt="Hình trong đề Aptis" loading="lazy" className="max-h-96 rounded-md border border-line object-contain" />)}
      {isAutoScored ? <>
        <div className="space-y-6">{renderPractice(selected)}</div>
        {submitted && score !== null && <div role="status" className="rounded-md border border-line bg-paper-deep p-5"><p className="text-sm text-muted">Kết quả lượt làm</p><p className="mt-1 font-display text-3xl text-ink">{score} / {selected.part === '2-3' ? 1 : getQuestions(selected).length} đúng</p></div>}
        <div className="flex flex-wrap gap-3">{!submitted ? <button type="button" onClick={() => void grade()} className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90">Nộp bài và xem kết quả</button> : <button type="button" onClick={() => { setAnswers({}); setScore(null); setSubmitted(false); }} className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-paper-deep">Làm lại mẫu này</button>}</div>
      </> : <section className="space-y-5">
        {fields.map((field, i) => <article key={`${field.label}-${i}`} className="border-b border-line pb-4"><h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{field.label}</h2><p className="whitespace-pre-wrap leading-7 text-ink">{field.value}</p></article>)}
        <p className="rounded-md bg-paper-deep p-4 text-sm leading-6 text-muted">Mẫu tham khảo để tự luyện. Ứng dụng không chấm điểm Speaking hoặc Writing.</p>
      </section>}
    </div>;
  }

  return <div className="mx-auto max-w-6xl space-y-9 pb-16">
    <header className="max-w-2xl"><p className="eyebrow">Aptis · Thư viện luyện tập</p><h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink">Mẫu đề bốn kỹ năng</h1><p className="mt-4 leading-7 text-muted">Làm Reading và Listening để xem kết quả. Speaking và Writing có đề cùng bài mẫu để bạn tự đối chiếu.</p><p className="mt-2 text-xs text-muted">Mẫu luyện tập từ AptisPrep, không phải đề thi Aptis chính thức.</p></header>
    <section aria-label="Chọn kỹ năng" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line">{skills.map(([id, label]) => <button key={id} type="button" onClick={() => changeSkill(id)} aria-pressed={skill === id} className={`border-b-2 px-1 py-3 text-sm font-semibold ${skill === id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>{label} <span className="ml-1 text-xs font-normal">{APTIS_SAMPLES.filter(item => item.skill === id).length}</span></button>)}</section>
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{[['all', 'Tất cả'], ...availableParts.map(key => [key, partLabels[skill][key] || `Part ${key}`])].map(([id, label]) => <button key={id} type="button" onClick={() => { setPart(id); setPage(0); }} aria-pressed={part === id} className={`rounded-full border px-3 py-1.5 text-xs ${part === id ? 'border-accent bg-accent text-white' : 'border-line text-muted hover:bg-paper-deep'}`}>{label}</button>)}</div><p className="text-xs text-muted">{filtered.length} mẫu đề</p></div>
    <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{pageSamples.map((sample, index) => <button key={sample.id} type="button" onClick={() => openSample(sample)} className="group border-b border-line py-5 text-left hover:bg-paper-deep/40">
      <span className="eyebrow">{partLabels[sample.skill][sample.part] || `Part ${sample.part}`} · Mẫu {page * pageSize + index + 1}</span><h2 className="mt-2 font-display text-xl text-ink group-hover:text-accent">{getTitle(sample)}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{sample.instruction || sample.content.question || sample.content.full_text || sample.content.article?.title || 'Mở mẫu để xem nội dung.'}</p>
    </button>)}</div>
    {pageCount > 1 && <div className="flex items-center justify-center gap-4"><button type="button" disabled={!page} onClick={() => setPage(page - 1)} className="rounded border border-line px-3 py-2 text-sm disabled:opacity-40">Trước</button><span className="text-sm text-muted">{page + 1} / {pageCount}</span><button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)} className="rounded border border-line px-3 py-2 text-sm disabled:opacity-40">Tiếp</button></div>}
    <section className="border-t border-line pt-8"><p className="eyebrow">Lịch sử Aptis</p><h2 className="mt-2 font-display text-2xl text-ink">Lượt Reading và Listening đã làm</h2>{history.length ? <div className="mt-4 divide-y divide-line">{history.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium text-ink">{item.skill} · {item.sectionTitle}</p><p className="text-xs text-muted">{new Date(item.date).toLocaleString()}</p></div><span className="font-mono text-sm text-ink">{item.score} / {item.total}</span></div>)}</div> : <p className="mt-3 text-sm text-muted">Chưa có lượt làm Aptis được lưu.</p>}</section>
  </div>;
};
