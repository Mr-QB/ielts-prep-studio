import React, { useState } from 'react';
import { SPEAKING_PARTS_DATA, SPEAKING_GENERAL_TIPS, MY_STORY_BANK } from '../data/speakingData';

export const SpeakingNotesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 'story-bank' | 'general'>('story-bank');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(MY_STORY_BANK[0]?.id || 'story-robot-project');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const currentPart = typeof activeTab === 'number'
    ? SPEAKING_PARTS_DATA.find(p => p.part === activeTab) || SPEAKING_PARTS_DATA[0]
    : null;

  const currentStory = MY_STORY_BANK.find(s => s.id === selectedStoryId) || MY_STORY_BANK[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & Sub-tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Sổ tay Speaking IELTS • Lộ trình Band 4.0 → 6.5
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sổ Tay Phản Xạ & Ngân Hàng Câu Chuyện Speaking
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Tập trung vào sự trôi chảy tự nhiên, 3 câu chuyện vạn năng ứng dụng cho hàng chục đề Part 2 & 3, và khung tư duy phản xạ không ngắt quãng.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-700 shrink-0 self-start sm:self-auto">
            Mục tiêu: Fluency 6.5+ (Tự nhiên • Ít vấp)
          </div>
        </div>

        {/* 5 Tab Switcher */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'story-bank', label: '★ Ngân hàng câu chuyện vạn năng (3 Stories)' },
            { id: 1, label: 'Part 1: Phản xạ tự nhiên (A-R-E)' },
            { id: 2, label: 'Part 2: Khung kể chuyện 2 phút' },
            { id: 3, label: 'Part 3: Phản biện xã hội (O-R-E-C)' },
            { id: 'general', label: 'Chiến thuật phòng thi & Prompts AI' }
          ].map(tab => (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap cursor-pointer border transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NGÂN HÀNG CÂU CHUYỆN VẠN NĂNG (MY STORY BANK - DEFAULT)                */}
      {/* ========================================================================= */}
      {activeTab === 'story-bank' && (
        <div className="space-y-6">
          {/* Story Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MY_STORY_BANK.map(story => {
              const isSelected = selectedStoryId === story.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setSelectedStoryId(story.id)}
                  className={`p-4 rounded-lg border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{story.title}</div>
                  <div className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {story.tagline}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Story Detailed View */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-xs font-bold uppercase">
                CÂU CHUYỆN VẠN NĂNG #{MY_STORY_BANK.findIndex(s => s.id === currentStory.id) + 1}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{currentStory.title}</h2>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                <strong className="font-semibold text-slate-900 block mb-0.5">Ứng dụng vạn năng cho các chủ đề:</strong>
                {currentStory.tagline}
              </div>
            </div>

            {/* Applicable Cue Cards */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Các đề Cue Card Part 2 áp dụng được ngay (5+ đề thi thật)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStory.applicableCueCards.map((cue, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800">
                    • "{cue}"
                  </div>
                ))}
              </div>
            </div>

            {/* Short Version & 2-Minute Full Script */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Tóm tắt ý chính tiếng Việt (30 giây định hình ý tưởng)
                </h3>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 leading-relaxed">
                  {currentStory.shortVersion}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Bài nói mẫu hoàn chỉnh 2 phút (Extended Spoken Version)
                </h3>
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded text-sm font-serif italic text-slate-900 leading-relaxed">
                  "{currentStory.extendedVersion}"
                </div>
              </div>
            </div>

            {/* Useful Vocabulary & Feelings Vocabulary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Cụm từ ghi điểm (Action & Topic Collocations)
                </h3>
                <div className="space-y-1.5">
                  {currentStory.usefulVocab.map((item, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono">"{item.phrase}"</span>
                      <span className="text-slate-500 text-[11px]">{item.meaningVi}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Từ vựng diễn tả cảm xúc (Feelings & Reactions)
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentStory.feelingsVocab.map((f, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-medium text-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PART 1, 2, 3 FRAMEWORKS                                                */}
      {/* ========================================================================= */}
      {currentPart && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currentPart.title}</h2>
                <span className="text-xs font-semibold text-blue-900">{currentPart.frameworkName}</span>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold self-start sm:self-auto">
                {currentPart.part === 1 ? '15–25s / câu' : currentPart.part === 2 ? '2 phút liên tục' : '30–45s / câu'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
              <strong className="text-[10px] text-slate-500 uppercase block mb-1">Công thức phản xạ cốt lõi:</strong>
              {currentPart.formula}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPart.explanation}
            </p>
          </div>

          {/* Model Demonstration */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              Ví Dụ Thị Phạm (Model Demonstration)
            </h3>
            <div className="p-3 bg-blue-50/50 rounded border border-blue-100 text-xs font-bold text-blue-950">
              Câu hỏi giám khảo: "{currentPart.exampleDemonstration.question}"
            </div>

            <div className="space-y-2 mt-2">
              {currentPart.exampleDemonstration.steps.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">{step.label}:</span>
                  <p className="text-slate-700 italic font-serif">"{step.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Sentence Frames */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-3">
              Mẫu Câu Mở Đầu & Dẫn Ý Tự Nhiên
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentPart.usefulFrames.map((frame, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-slate-800 font-medium">
                  "{frame}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CHIẾN THUẬT PHÒNG THI & CHATGPT PROMPTS                                */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Fillers */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              Từ Đệm Tự Nhiên (Natural Fillers - Tránh ngập ngừng "Ừm... À...")
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPEAKING_GENERAL_TIPS.fillers.map((f, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900 font-mono">"{f.phrase}"</div>
                  <div className="text-[11px] text-slate-500">{f.context}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Elongation Techniques */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              3 Kỹ Thuật Kéo Dài Câu Trả Lời (Elongation)
            </h3>
            <div className="space-y-3">
              {SPEAKING_GENERAL_TIPS.elongationTechniques.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">{item.strategy}</div>
                  <p className="text-slate-600 text-[11px]">{item.prompt}</p>
                  <div className="p-2 bg-blue-50/50 rounded border border-blue-100 text-blue-950 font-serif italic text-xs">
                    "{item.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Correction & Unknown Words */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                Xử Lý Khi Quên Từ Vựng
              </h3>
              {SPEAKING_GENERAL_TIPS.handlingUnknownWords.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800">{item.strategy}:</span>
                  <p className="text-slate-600 italic">"{item.template}"</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                Kỹ Thuật Tự Sửa Lỗi (Self-Correction)
              </h3>
              {SPEAKING_GENERAL_TIPS.selfCorrection.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800">{item.strategy}:</span>
                  <p className="text-slate-600 italic">"{item.template}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* ChatGPT Prompt Templates */}
          <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Bộ Câu Lệnh ChatGPT Mẫu: Luyện Speaking Như Thi Thật
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sử dụng tính năng Voice Mode hoặc Text trên ChatGPT với các prompt sau để có bạn tập Speaking 24/7.
              </p>
            </div>

            <div className="space-y-3">
              {SPEAKING_GENERAL_TIPS.chatGptPrompts.map((cp, idx) => (
                <div key={idx} className="p-4 bg-slate-800 rounded border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{cp.label}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cp.prompt, `sp-${idx}`)}
                      className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-mono cursor-pointer"
                    >
                      {copiedPromptId === `sp-${idx}` ? '✓ Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{cp.description}</p>
                  <pre className="p-3 bg-slate-950 rounded text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {cp.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
