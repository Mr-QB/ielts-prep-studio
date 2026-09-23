import React, { useState, useEffect, useRef } from 'react';
import { lookupVocabularyApi, addWordToVocabDeck } from '../utils/db';
import { VocabLookupResult } from '../types';

interface WordCapturePopoverProps {
  sourceLabel: string;
  sourceType: 'reading' | 'listening';
}

export const WordCapturePopover: React.FC<WordCapturePopoverProps> = ({ sourceLabel, sourceType }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [contextSentence, setContextSentence] = useState<string>('');
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  // Quick confirm modal state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<VocabLookupResult | null>(null);
  const [confirmedMeaningVi, setConfirmedMeaningVi] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setCoords(null);
        setSelectedWord(null);
        return;
      }

      const raw = selection.toString().trim();
      // Allow single words or 2-word phrases
      if (!raw || raw.length > 35 || raw.split(/\s+/).length > 3) {
        setCoords(null);
        setSelectedWord(null);
        return;
      }

      // Clean punctuation
      const cleanWord = raw.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      if (cleanWord.length < 2) {
        setCoords(null);
        return;
      }

      // Extract enclosing sentence
      let sentence = '';
      try {
        const anchorNode = selection.anchorNode;
        if (anchorNode && anchorNode.textContent) {
          const fullText = anchorNode.textContent;
          const offset = selection.anchorOffset;
          // Find start of sentence
          let start = Math.max(0, offset - 100);
          for (let i = offset; i >= 0; i--) {
            if (['.', '!', '?', '\n'].includes(fullText[i]) && i < offset) {
              start = i + 1;
              break;
            }
          }
          // Find end of sentence
          let end = Math.min(fullText.length, offset + 150);
          for (let i = offset; i < fullText.length; i++) {
            if (['.', '!', '?', '\n'].includes(fullText[i])) {
              end = i + 1;
              break;
            }
          }
          sentence = fullText.slice(start, end).trim();
        }
      } catch {}

      if (!sentence) {
        sentence = `Context containing the word "${cleanWord}".`;
      }

      // Compute popover position
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setCoords({
          top: rect.top - 42,
          left: rect.left + rect.width / 2
        });
        setSelectedWord(cleanWord);
        setContextSentence(sentence);
      } catch {
        setCoords(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      // Clicked elsewhere
      setCoords(null);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleOpenCaptureModal = async () => {
    if (!selectedWord) return;
    setCoords(null);
    setShowConfirmModal(true);
    setIsLookingUp(true);

    const result = await lookupVocabularyApi(selectedWord, contextSentence);
    setLookupResult(result);
    if (result.senses && result.senses.length > 0 && result.senses[0].viSuggestion) {
      setConfirmedMeaningVi(result.senses[0].viSuggestion);
    } else {
      setConfirmedMeaningVi(`Nghĩa của từ "${selectedWord}"`);
    }
    setIsLookingUp(false);
  };

  const handleConfirmSave = async () => {
    if (!selectedWord) return;

    const chosenSense = lookupResult?.senses[0];
    const finalVi = confirmedMeaningVi.trim() || chosenSense?.viSuggestion || `Nghĩa của từ "${selectedWord}"`;

    const res = await addWordToVocabDeck({
      word: selectedWord,
      lemma: lookupResult?.lemma || selectedWord.toLowerCase(),
      phonetic: lookupResult?.phonetic,
      partOfSpeech: lookupResult?.partOfSpeech || 'vocabulary',
      definitionVi: finalVi,
      definitionEn: chosenSense?.definitionEn,
      example: contextSentence,
      sourceContext: contextSentence,
      source: sourceLabel,
      sourceType: sourceType,
      priority: 10,
      audio: lookupResult?.audio,
      audioSource: lookupResult?.audioSource,
      collocations: lookupResult?.collocations || []
    });

    setShowConfirmModal(false);
    showToast(res.message);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <>
      {/* Floating Mini Action Popover */}
      {coords && selectedWord && (
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: `${Math.max(10, coords.top)}px`,
            left: `${coords.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={handleOpenCaptureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold shadow-lg hover:bg-slate-800 cursor-pointer border border-slate-700 whitespace-nowrap active:scale-95 transition-all"
          >
            <span>📖</span>
            <span>Lưu &ldquo;{selectedWord}&rdquo; vào Từ vựng</span>
          </button>
        </div>
      )}

      {/* Confirmation & Sense Selector Modal */}
      {showConfirmModal && selectedWord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">{selectedWord}</span>
                {lookupResult?.phonetic && (
                  <span className="text-xs font-mono text-slate-500">{lookupResult.phonetic}</span>
                )}
                {lookupResult?.partOfSpeech && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                    {lookupResult.partOfSpeech}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Context sentence preview */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Câu ngữ cảnh trích xuất từ {sourceType === 'reading' ? 'bài đọc' : 'bài nghe'}:
              </span>
              <div className="text-slate-800 font-serif italic leading-relaxed">
                &ldquo;{contextSentence}&rdquo;
              </div>
            </div>

            {/* Vietnamese meaning suggestion */}
            {isLookingUp ? (
              <div className="py-4 text-center text-xs text-slate-500">
                Đang tra cứu từ điển và phân tích nét nghĩa trong câu...
              </div>
            ) : (
              <div className="space-y-3">
                {lookupResult?.senses && lookupResult.senses.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Định nghĩa tiếng Anh:</label>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                      {lookupResult.senses[0].definitionEn}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nghĩa tiếng Việt (Xác nhận hoặc chỉnh sửa):
                  </label>
                  <input
                    type="text"
                    value={confirmedMeaningVi}
                    onChange={(e) => setConfirmedMeaningVi(e.target.value)}
                    placeholder="VD: giảm nhẹ, đáng kể..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isLookingUp}
                onClick={handleConfirmSave}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
};
