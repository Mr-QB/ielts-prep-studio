import React, { useState } from 'react';
import { WRITING_TASK1_NOTES, WRITING_TASK2_NOTES, WRITING_PHRASE_BANK } from '../data/writingData';
import { WritingTask1Type, WritingTask2Type } from '../types';

export const WritingNotesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2' | 'phrase-bank'>('task1');
  const [selectedTask1Type, setSelectedTask1Type] = useState<WritingTask1Type>('line-graph');
  const [selectedTask2Type, setSelectedTask2Type] = useState<WritingTask2Type>('opinion');
  const [activeSectionTab, setActiveSectionTab] = useState<'structure' | 'phrases' | 'mistakes' | 'checklist'>('structure');
  const [showAdvancedUpgrades, setShowAdvancedUpgrades] = useState<boolean>(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const currentTask1 = WRITING_TASK1_NOTES.find(t => t.type === selectedTask1Type) || WRITING_TASK1_NOTES[0];
  const currentTask2 = WRITING_TASK2_NOTES.find(t => t.type === selectedTask2Type) || WRITING_TASK2_NOTES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const renderChecklistItem = (item: string, idx: number) => {
    let badge = null;
    let cleanText = item;

    if (item.startsWith('[REQUIREMENT]')) {
      badge = (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-200 uppercase shrink-0">
          Bắt buộc (IELTS Rule)
        </span>
      );
      cleanText = item.replace('[REQUIREMENT]', '').trim();
    } else if (item.startsWith('[RECOMMENDED]')) {
      badge = (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800 border border-blue-200 uppercase shrink-0">
          Khuyến nghị (Strategy)
        </span>
      );
      cleanText = item.replace('[RECOMMENDED]', '').trim();
    } else if (item.startsWith('[OPTIONAL]')) {
      badge = (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200 uppercase shrink-0">
          Tùy chọn (Target)
        </span>
      );
      cleanText = item.replace('[OPTIONAL]', '').trim();
    }

    return (
      <li key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <span className="font-mono text-emerald-600 font-bold text-sm shrink-0">✓</span>
          <span className="text-slate-800 text-xs leading-relaxed">{cleanText}</span>
        </div>
        {badge}
      </li>
    );
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & 3 Primary Sub-tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Sổ tay Writing IELTS • Lộ trình Band 4.0 → 6.5
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sổ Tay Cấu Trúc & Ngân Hàng Viết IELTS
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Nắm vững khung bài viết Task 1 & Task 2, bộ câu mở và phát triển ý chuẩn mực, cùng 12 nhóm cụm từ chức năng vạn năng.
            </p>
          </div>

          {/* 3 Main Tabs Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('task1'); setActiveSectionTab('structure'); }}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'task1'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Task 1 (Report)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('task2'); setActiveSectionTab('structure'); }}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'task2'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Task 2 (Essay)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('phrase-bank')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'phrase-bank'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Ngân hàng cụm từ (12 nhóm)
            </button>
          </div>
        </div>

        {/* Sub-type selector for Task 1 or Task 2 */}
        {activeTab === 'task1' && (
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {WRITING_TASK1_NOTES.map(t1 => (
              <button
                key={t1.id}
                type="button"
                onClick={() => setSelectedTask1Type(t1.type)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap cursor-pointer border transition-colors ${
                  selectedTask1Type === t1.type
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t1.title.split(' (')[0]}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'task2' && (
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {WRITING_TASK2_NOTES.map(t2 => (
              <button
                key={t2.id}
                type="button"
                onClick={() => setSelectedTask2Type(t2.type)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap cursor-pointer border transition-colors ${
                  selectedTask2Type === t2.type
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t2.title.split(' (')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. TASK 1 VIEW                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'task1' && (
        <div className="space-y-6">
          {/* Active Task Header */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentTask1.title}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{currentTask1.subtitle}</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold self-start sm:self-auto">
                Mục tiêu: 20 phút • 150–180 từ
              </span>
            </div>

            {/* Inner Tabs: Structure, Phrases, Mistakes, Checklist */}
            <div className="flex items-center gap-2 pt-3">
              {[
                { id: 'structure', label: 'Dàn ý 4 đoạn' },
                { id: 'phrases', label: 'Cụm từ hữu ích' },
                { id: 'mistakes', label: 'Lỗi thường gặp' },
                { id: 'checklist', label: 'Checklist tự soát' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSectionTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer border ${
                    activeSectionTab === sub.id
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtab 1: Structure */}
          {activeSectionTab === 'structure' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask1.structure.map((sec, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                      ĐOẠN {idx + 1}: {sec.section}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sec.purpose}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800 leading-relaxed">
                    {sec.formula}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">Mẫu câu ứng dụng:</span>
                    {sec.sentenceFrames.map((frame, fIdx) => (
                      <div key={fIdx} className="p-2 bg-blue-50/50 border border-blue-100 rounded text-xs text-blue-950 font-serif italic">
                        "{frame}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 2: Phrases */}
          {activeSectionTab === 'phrases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask1.usefulPhrases.map((group, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                    {group.category}
                  </h3>
                  <div className="space-y-1.5 pt-1">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-800 font-mono">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 3: Mistakes */}
          {activeSectionTab === 'mistakes' && (
            <div className="space-y-3">
              {currentTask1.commonMistakes.map((m, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 text-xs">
                  <div className="font-bold text-rose-900 text-sm">⚠ Lỗi: {m.mistake}</div>
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded text-rose-800">
                    <strong>Tại sao sai:</strong> {m.whyWrong}
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-900 font-medium">
                    <strong>Cách sửa chuẩn:</strong> {m.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 4: Checklist */}
          {activeSectionTab === 'checklist' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                Checklist trước khi nộp bài Task 1
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentTask1.checklist.map((item, idx) => renderChecklistItem(item, idx))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TASK 2 VIEW                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'task2' && (
        <div className="space-y-6">
          {/* Active Task 2 Header */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentTask2.title}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{currentTask2.subtitle}</p>
                <div className="text-xs text-slate-500 italic mt-1">Đề bài ví dụ: "{currentTask2.promptExample}"</div>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold self-start sm:self-auto">
                Mục tiêu: 40 phút • 250–280 từ
              </span>
            </div>

            {/* Inner Tabs */}
            <div className="flex items-center gap-2 pt-3">
              {[
                { id: 'structure', label: 'Dàn ý 4 đoạn' },
                { id: 'phrases', label: 'Cụm từ lập luận' },
                { id: 'mistakes', label: 'Lỗi thường gặp' },
                { id: 'checklist', label: 'Checklist tự soát' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSectionTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer border ${
                    activeSectionTab === sub.id
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtab 1: Structure */}
          {activeSectionTab === 'structure' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask2.structure.map((sec, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                      {sec.section}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sec.purpose}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800 leading-relaxed">
                    {sec.formula}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">Câu mẫu tham khảo:</span>
                    {sec.sentenceFrames.map((frame, fIdx) => (
                      <div key={fIdx} className="p-2 bg-blue-50/50 border border-blue-100 rounded text-xs text-blue-950 font-serif italic">
                        "{frame}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 2: Phrases */}
          {activeSectionTab === 'phrases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTask2.usefulPhrases.map((group, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                    {group.category}
                  </h3>
                  <div className="space-y-1.5 pt-1">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-800 font-mono">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 3: Mistakes */}
          {activeSectionTab === 'mistakes' && (
            <div className="space-y-3">
              {currentTask2.commonMistakes.map((m, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 text-xs">
                  <div className="font-bold text-rose-900 text-sm">⚠ Lỗi: {m.mistake}</div>
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded text-rose-800">
                    <strong>Tại sao sai:</strong> {m.whyWrong}
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-900 font-medium">
                    <strong>Cách sửa chuẩn:</strong> {m.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 4: Checklist */}
          {activeSectionTab === 'checklist' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                Checklist kiểm tra Task 2 trước khi nộp
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentTask2.checklist.map((item, idx) => renderChecklistItem(item, idx))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WRITING PHRASE BANK (12 FUNCTIONAL CATEGORIES)                         */}
      {/* ========================================================================= */}
      {activeTab === 'phrase-bank' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-slate-900">12 Nhóm Cụm Từ Chức Năng Writing</div>
              <div className="text-xs text-slate-500">Bộ câu khung thiết yếu cho Introduction, Body Paragraphs và Conclusion.</div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedUpgrades(prev => !prev)}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer border ${
                showAdvancedUpgrades
                  ? 'bg-purple-900 text-white border-purple-900 font-semibold'
                  : 'bg-white text-purple-900 border-purple-300 hover:bg-purple-50'
              }`}
            >
              {showAdvancedUpgrades ? 'Ẩn cụm nâng cao Band 7+' : 'Hiện cụm nâng cao Band 7+'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WRITING_PHRASE_BANK.map(category => (
              <div key={category.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">{category.category}</h3>
                  <p className="text-xs text-slate-500">{category.descriptionVi}</p>
                </div>

                {/* Core Band 5.5 - 6.5 Phrases */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-600 uppercase font-mono">
                    Khung Cốt Lõi (Band 5.5 → 6.5):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category.corePhrases.map((phrase, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Optional Collapsible Upgrade Phrases (Band 7+) */}
                {showAdvancedUpgrades && (
                  <div className="space-y-1 pt-2 border-t border-purple-100">
                    <div className="text-[11px] font-bold text-purple-800 uppercase font-mono">
                      Cụm từ nâng cấp (Band 7+ Optional):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.upgradePhrases.map((phrase, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded text-xs font-mono text-purple-900">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example Context */}
                <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded text-xs text-blue-950 font-serif italic">
                  "{category.exampleSentence}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ChatGPT Evaluation Prompt Templates at the Bottom */}
      <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight">
            Bộ Câu Lệnh ChatGPT Mẫu: Tự Chấm & Nhận Nhận Xét Bài Viết
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dán bài viết của bạn cùng đề thi vào prompt dưới đây để nhờ AI sửa lỗi ngữ pháp, nâng cấp collocation và dự phóng Band score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 border border-slate-700 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-400">Prompt Chấm Task 1</span>
              <button
                type="button"
                onClick={() => handleCopy(`Please act as a strict IELTS Writing examiner.
Evaluate my Task 1 report based on official criteria (TR, CC, LR, GRA).
Prompt/Chart description: [Dán mô tả đề bài Task 1]
My report: [Dán bài viết của bạn]

Please provide:
1. Estimated Band Score for each criterion.
2. Corrections for any grammatical and numerical description errors.
3. 3 suggested collocation upgrades for Task 1.`, 'p-t1')}
                className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-mono cursor-pointer"
              >
                {copiedPromptId === 'p-t1' ? '✓ Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Please act as a strict IELTS Writing examiner.
Evaluate my Task 1 report based on official criteria (TR, CC, LR, GRA).
Prompt: [Dán đề bài Task 1]
My report: [Dán bài viết]`}
            </pre>
          </div>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-400">Prompt Chấm Task 2</span>
              <button
                type="button"
                onClick={() => handleCopy(`Please act as an experienced IELTS Writing examiner.
Assess my Task 2 essay based on: Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.
Prompt: [Dán đề bài Task 2]
My essay: [Dán bài viết của bạn]

Please provide:
1. Estimated Band Score with brief justification.
2. Direct line-by-line grammar & vocabulary corrections.
3. A polished Band 7.5+ version that preserves my original ideas.`, 'p-t2')}
                className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-mono cursor-pointer"
              >
                {copiedPromptId === 'p-t2' ? '✓ Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Please act as an experienced IELTS examiner.
Assess my Task 2 essay based on official descriptors.
Prompt: [Dán đề bài Task 2]
My essay: [Dán bài viết]`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
