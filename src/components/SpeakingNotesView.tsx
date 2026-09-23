import React, { useState } from 'react';
import { SPEAKING_PARTS_DATA, SPEAKING_GENERAL_TIPS } from '../data/speakingData';
import { MessageSquare, Mic, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

export const SpeakingNotesView: React.FC = () => {
  const [activePartTab, setActivePartTab] = useState<1 | 2 | 3 | 'general'>(1);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const currentPart = typeof activePartTab === 'number'
    ? SPEAKING_PARTS_DATA.find(p => p.part === activePartTab) || SPEAKING_PARTS_DATA[0]
    : null;

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
                ACADEMIC SPEAKING KNOWLEDGE BASE
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold">
                Notes & Frameworks Only
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Sổ Tay Chiến Thuật & Khung Trả Lời IELTS Speaking
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Tập trung vào khung tư duy phản xạ (Frameworks), các mẫu câu mở rộng ý, từ đệm tự nhiên (fillers) và mẫu prompt để luyện tập tương tác trực tiếp với ChatGPT. Không có voice recorder hay AI grading giả tạo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold">
              Mục tiêu: Fluency & Lexical 6.5 → 7.0
            </span>
          </div>
        </div>

        {/* Tab Switcher: Part 1, Part 2, Part 3, Chiến Thuật Chung */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 1, label: 'Part 1: Khung A-R-E' },
            { id: 2, label: 'Part 2: Khung 5 Điểm' },
            { id: 3, label: 'Part 3: Khung O-R-E-C' },
            { id: 'general', label: 'Chiến Thuật Chung & ChatGPT Prompts' }
          ].map(tab => (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => setActivePartTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                activePartTab === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Part 1, 2, 3 View */}
      {currentPart && (
        <div className="space-y-6">
          {/* Framework Overview Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currentPart.title}</h2>
                <span className="text-xs font-semibold text-emerald-700">{currentPart.frameworkName}</span>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-[11px] font-semibold self-start sm:self-auto">
                {currentPart.part === 1 ? '15–25s / câu' : currentPart.part === 2 ? '2 phút nói liên tục' : '30–45s / câu'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-800">
              <strong className="text-[10px] text-slate-500 uppercase block mb-1">Công thức phản xạ cốt lõi:</strong>
              {currentPart.formula}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPart.explanation}
            </p>
          </div>

          {/* Example Demonstration */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              Ví Dụ Thị Phạm (Model Demonstration)
            </h3>
            <div className="p-3 bg-blue-50/50 rounded border border-blue-100 text-xs font-bold text-blue-950">
              Câu hỏi giám khảo: "{currentPart.exampleDemonstration.question}"
            </div>

            <div className="space-y-2 mt-3">
              {currentPart.exampleDemonstration.steps.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">{step.label}:</span>
                  <p className="text-slate-700 italic">"{step.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Sentence Frames */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
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

          {/* Common Topics Bank */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-3">
              Ngân Hàng Chủ Đề Phổ Biến Nhất
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPart.commonTopics.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.topic}</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                    {item.sampleQuestions.map((q, qIdx) => (
                      <li key={qIdx}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* General Tips & ChatGPT Prompts Tab */}
      {activePartTab === 'general' && (
        <div className="space-y-6">
          {/* Fillers Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              Từ Đệm Tự Nhiên (Natural Fillers - Tránh "Ừm... À...")
            </h3>
            <p className="text-xs text-slate-600">
              Sử dụng các từ nối này khi bạn cần 2–3 giây để tổ chức suy nghĩ mà không bị trừ điểm Fluency vì ngập ngừng vô nghĩa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {SPEAKING_GENERAL_TIPS.fillers.map((f, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block font-mono">"{f.phrase}"</span>
                  <span className="text-slate-600 block text-[11px]">{f.context}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elongation Techniques */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              3 Kỹ Thuật Kéo Dài Câu Trả Lời (Elongation Techniques)
            </h3>
            <div className="space-y-3">
              {SPEAKING_GENERAL_TIPS.elongationTechniques.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded border border-slate-100 text-xs space-y-1.5">
                  <span className="font-bold text-slate-900 block">{item.strategy}</span>
                  <p className="text-slate-600 text-[11px]">{item.prompt}</p>
                  <div className="p-2 bg-blue-50/50 rounded border border-blue-100 text-blue-950 font-sans italic text-[11px]">
                    Ví dụ: "{item.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unknown words & Self correction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-2">
                Xử Lý Khi Quên Từ Vựng
              </h3>
              {SPEAKING_GENERAL_TIPS.handlingUnknownWords.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">{item.strategy}:</span>
                  <p className="text-slate-600 italic">"{item.template}"</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 mb-2">
                Kỹ Thuật Tự Sửa Lỗi (Self-Correction)
              </h3>
              {SPEAKING_GENERAL_TIPS.selfCorrection.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">{item.strategy}:</span>
                  <p className="text-slate-600 italic">"{item.template}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* ChatGPT Prompt Templates */}
          <div className="bg-slate-900 text-white rounded-lg p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight">
                Bộ Câu Lệnh ChatGPT Mẫu: Luyện Speaking Như Thi Thật
              </h3>
            </div>

            <div className="space-y-4">
              {SPEAKING_GENERAL_TIPS.chatGptPrompts.map((cp, idx) => (
                <div key={idx} className="p-4 bg-slate-800 rounded border border-slate-700 space-y-2 relative">
                  <div className="flex items-center justify-between pr-24">
                    <h4 className="text-xs font-bold text-emerald-400">{cp.label}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">{cp.description}</p>
                  <pre className="p-3 bg-slate-950 rounded text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {cp.prompt}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(cp.prompt, `prompt-${idx}`)}
                    className="absolute top-4 right-4 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer text-white"
                  >
                    {copiedPromptId === `prompt-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
