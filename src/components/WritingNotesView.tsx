import React, { useState } from 'react';
import { WRITING_TASK1_NOTES, WRITING_TASK2_NOTES } from '../data/writingData';
import { WritingTask1Type, WritingTask2Type } from '../types';
import { BookOpen, CheckSquare, AlertTriangle, MessageSquare, Copy, Check } from 'lucide-react';

export const WritingNotesView: React.FC = () => {
  const [taskTab, setTaskTab] = useState<'task1' | 'task2'>('task1');
  const [selectedTask1Type, setSelectedTask1Type] = useState<WritingTask1Type>('line-graph');
  const [selectedTask2Type, setSelectedTask2Type] = useState<WritingTask2Type>('opinion');
  const [activeSectionTab, setActiveSectionTab] = useState<'structure' | 'phrases' | 'mistakes' | 'checklist'>('structure');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const currentTask1 = WRITING_TASK1_NOTES.find(t => t.type === selectedTask1Type) || WRITING_TASK1_NOTES[0];
  const currentTask2 = WRITING_TASK2_NOTES.find(t => t.type === selectedTask2Type) || WRITING_TASK2_NOTES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                ACADEMIC WRITING KNOWLEDGE BASE
              </span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                Notes & Frameworks Only
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Sổ Tay Cấu Trúc & Khung Viết IELTS Writing
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Tập trung vào cấu trúc chuẩn (Framework), câu khung tái sử dụng và lỗi thường gặp. Người học sử dụng các mẫu câu lệnh (Prompt Templates) dưới đây để luyện viết và nhận chấm điểm trực tiếp từ ChatGPT.
            </p>
          </div>

          {/* Task 1 vs Task 2 Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start md:self-auto border border-slate-200">
            <button
              type="button"
              onClick={() => { setTaskTab('task1'); setActiveSectionTab('structure'); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                taskTab === 'task1'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task 1 (Report 150+ từ)
            </button>
            <button
              type="button"
              onClick={() => { setTaskTab('task2'); setActiveSectionTab('structure'); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                taskTab === 'task2'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task 2 (Essay 250+ từ)
            </button>
          </div>
        </div>

        {/* Sub-type Horizontal Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          {taskTab === 'task1' ? (
            WRITING_TASK1_NOTES.map(t1 => (
              <button
                key={t1.id}
                type="button"
                onClick={() => setSelectedTask1Type(t1.type)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedTask1Type === t1.type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t1.title.split(' (')[0]}
              </button>
            ))
          ) : (
            WRITING_TASK2_NOTES.map(t2 => (
              <button
                key={t2.id}
                type="button"
                onClick={() => setSelectedTask2Type(t2.type)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedTask2Type === t2.type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t2.title.split(' (')[0]}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {taskTab === 'task1' ? (
        <div className="space-y-6">
          {/* Header Card for Selected Task 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currentTask1.title}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{currentTask1.subtitle}</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-[11px] font-semibold self-start sm:self-auto">
                Mục tiêu: 20 phút • 150–180 từ
              </span>
            </div>

            {/* Section View Tabs */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { id: 'structure', label: 'Cấu Trúc 4 Đoạn' },
                { id: 'phrases', label: 'Cụm Từ Ăn Điểm' },
                { id: 'mistakes', label: 'Lỗi Cần Tránh' },
                { id: 'checklist', label: 'Checklist Hoàn Thành' }
              ].map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionTab(sec.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeSectionTab === sec.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Structure */}
          {activeSectionTab === 'structure' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask1.structure.map((sec, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">Đoạn {idx + 1}</span>
                    <span className="text-xs font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                      {sec.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{sec.purpose}</p>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Công thức cốt lõi:</span>
                    {sec.formula}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Mẫu câu ứng dụng:</span>
                    {sec.sentenceFrames.map((frame, fIdx) => (
                      <div key={fIdx} className="p-2.5 bg-blue-50/50 rounded border border-blue-100 text-xs text-blue-950 font-sans">
                        "{frame}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Useful Phrases */}
          {activeSectionTab === 'phrases' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentTask1.usefulPhrases.map((group, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-3">
                    {group.category}
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {group.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-mono">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Common Mistakes */}
          {activeSectionTab === 'mistakes' && (
            <div className="space-y-4">
              {currentTask1.commonMistakes.map((m, idx) => (
                <div key={idx} className="bg-white border border-rose-200 rounded-lg p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lỗi: {m.mistake}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    <strong>Vì sao sai:</strong> {m.whyWrong}
                  </p>
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-950 font-medium ml-6">
                    <strong>Cách sửa chuẩn:</strong> {m.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Checklist */}
          {activeSectionTab === 'checklist' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Checklist Tự Đánh Giá Bài Task 1 Trước Khi Nộp</span>
              </h3>
              <div className="space-y-3">
                {currentTask1.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" className="mt-0.5 rounded text-slate-900 focus:ring-slate-900" />
                    <span className="text-xs text-slate-800 font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TASK 2 ESSAY VIEW */
        <div className="space-y-6">
          {/* Header Card for Selected Task 2 */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currentTask2.title}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{currentTask2.subtitle}</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-[11px] font-semibold self-start sm:self-auto">
                Mục tiêu: 40 phút • 250–290 từ
              </span>
            </div>

            {/* Prompt Example Box */}
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-700">
              <strong className="text-slate-900 block mb-1">Ví dụ đề bài thực tế:</strong>
              <p className="italic">"{currentTask2.promptExample}"</p>
            </div>

            {/* Section View Tabs */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { id: 'structure', label: 'Cấu Trúc PEEL 4 Đoạn' },
                { id: 'phrases', label: 'Mẫu Khung Lập Luận' },
                { id: 'mistakes', label: 'Lỗi Thường Gặp' },
                { id: 'checklist', label: 'Checklist Hoàn Thành' }
              ].map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionTab(sec.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeSectionTab === sec.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Structure */}
          {activeSectionTab === 'structure' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask2.structure.map((sec, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">Đoạn {idx + 1}</span>
                    <span className="text-xs font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                      {sec.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{sec.purpose}</p>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Cơ chế phát triển:</span>
                    {sec.formula}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Khung câu mẫu:</span>
                    {sec.sentenceFrames.map((frame, fIdx) => (
                      <div key={fIdx} className="p-2.5 bg-blue-50/50 rounded border border-blue-100 text-xs text-blue-950 font-sans">
                        "{frame}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Useful Phrases */}
          {activeSectionTab === 'phrases' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentTask2.usefulPhrases.map((group, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-3">
                    {group.category}
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {group.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-mono">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Common Mistakes */}
          {activeSectionTab === 'mistakes' && (
            <div className="space-y-4">
              {currentTask2.commonMistakes.map((m, idx) => (
                <div key={idx} className="bg-white border border-rose-200 rounded-lg p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lỗi: {m.mistake}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    <strong>Vì sao sai:</strong> {m.whyWrong}
                  </p>
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-950 font-medium ml-6">
                    <strong>Cách sửa chuẩn:</strong> {m.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Checklist */}
          {activeSectionTab === 'checklist' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Checklist Tự Đánh Giá Bài Essay Task 2</span>
              </h3>
              <div className="space-y-3">
                {currentTask2.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" className="mt-0.5 rounded text-slate-900 focus:ring-slate-900" />
                    <span className="text-xs text-slate-800 font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ChatGPT Prompt Template Card */}
      <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-tight">
              Prompt Mẫu Luyện Chấm Bài IELTS Writing Cùng ChatGPT
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Copy và dán vào ChatGPT</span>
        </div>

        <div className="p-4 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-slate-200 relative leading-relaxed">
          <button
            type="button"
            onClick={() => handleCopy(`Please act as a strict IELTS Examiner assessing my IELTS Writing ${taskTab === 'task1' ? 'Task 1 Report' : 'Task 2 Essay'}.
Topic/Question: [Dán đề bài tại đây]
My written response:
"[Dán bài viết của bạn tại đây]"

Please provide a detailed evaluation covering:
1. Estimated Band Score for all 4 official criteria (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy).
2. Grammatical and spelling errors: Quote the sentence, explain the mistake, and provide the corrected version.
3. Vocabulary upgrade: Identify 3-4 basic phrases and offer Band 7.5+ academic alternatives.
4. An improved, high-scoring rewrite of my essay that preserves my original ideas.`, 'chatgpt-writing')}
            className="absolute top-3 right-3 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer text-white"
          >
            {copiedPromptId === 'chatgpt-writing' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép Prompt</span>
              </>
            )}
          </button>
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
{`Please act as a strict IELTS Examiner assessing my IELTS Writing ${taskTab === 'task1' ? 'Task 1 Report' : 'Task 2 Essay'}.
Topic/Question: [Dán đề bài tại đây]
My written response:
"[Dán bài viết của bạn tại đây]"

Please provide a detailed evaluation covering:
1. Estimated Band Score for all 4 official criteria.
2. Grammatical and spelling errors with corrections.
3. High-level academic vocabulary upgrades.
4. An improved rewrite preserving my original ideas.`}
          </pre>
        </div>
      </div>
    </div>
  );
};
