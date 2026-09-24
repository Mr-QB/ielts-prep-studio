import type { VocabLookupResult, VocabLookupSense } from '../src/types';

// Curated high-frequency IELTS core bilingual dictionary with rich context & collocations
interface LexiconEntry {
  lemma: string;
  phonetic: string;
  partOfSpeech: string;
  audio?: string;
  senses: {
    definitionEn: string;
    viSuggestion: string;
    examples: string[];
    synonyms?: string[];
    antonyms?: string[];
    keywords?: string[];
  }[];
  collocations: string[];
  wordFamily?: { word: string; pos: string }[];
}

const IELTS_LEXICON: Record<string, LexiconEntry> = {
  mitigate: {
    lemma: 'mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    senses: [
      {
        definitionEn: 'to make something less harmful, unpleasant, or serious',
        viSuggestion: 'giảm nhẹ, làm giảm mức độ nghiêm trọng',
        examples: ['Governments should take measures to mitigate the effects of climate change.'],
        synonyms: ['alleviate', 'lessen', 'reduce', 'diminish'],
        antonyms: ['aggravate', 'exacerbate', 'worsen'],
        keywords: ['damage', 'harm', 'risk', 'effect', 'impact', 'climate', 'loss', 'disaster']
      }
    ],
    collocations: ['mitigate the effects of', 'mitigate risks', 'mitigate the impact', 'mitigate climate change'],
    wordFamily: [
      { word: 'mitigate', pos: 'verb' },
      { word: 'mitigation', pos: 'noun' },
      { word: 'mitigating', pos: 'adjective' }
    ]
  },
  significant: {
    lemma: 'significant',
    phonetic: '/sɪɡˈnɪf.ɪ.kənt/',
    partOfSpeech: 'adjective',
    senses: [
      {
        definitionEn: 'sufficiently great or important to be worthy of attention; noteworthy',
        viSuggestion: 'đáng kể, quan trọng',
        examples: ['There was a significant increase in sales over the last decade.'],
        synonyms: ['notable', 'considerable', 'substantial', 'remarkable'],
        antonyms: ['insignificant', 'minor', 'negligible'],
        keywords: ['increase', 'difference', 'impact', 'role', 'change', 'number', 'growth']
      }
    ],
    collocations: ['significant increase', 'significant difference', 'significant impact', 'play a significant role'],
    wordFamily: [
      { word: 'significant', pos: 'adjective' },
      { word: 'significantly', pos: 'adverb' },
      { word: 'significance', pos: 'noun' }
    ]
  },
  environment: {
    lemma: 'environment',
    phonetic: '/ɪnˈvaɪ.rən.mənt/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'the natural world, including land, water, air, plants, and animals',
        viSuggestion: 'môi trường tự nhiên',
        examples: ['We must act immediately to protect the environment for future generations.'],
        synonyms: ['natural world', 'ecosystem', 'surroundings'],
        keywords: ['protect', 'damage', 'climate', 'pollution', 'natural', 'nature', 'planet']
      },
      {
        definitionEn: 'the conditions and surroundings that someone lives or works in',
        viSuggestion: 'môi trường sống, môi trường làm việc',
        examples: ['A supportive learning environment helps students thrive.'],
        synonyms: ['setting', 'atmosphere', 'context'],
        keywords: ['work', 'school', 'learn', 'living', 'office', 'friendly', 'safe']
      }
    ],
    collocations: ['protect the environment', 'environmental damage', 'working environment', 'natural environment'],
    wordFamily: [
      { word: 'environment', pos: 'noun' },
      { word: 'environmental', pos: 'adjective' },
      { word: 'environmentally', pos: 'adverb' },
      { word: 'environmentalist', pos: 'noun' }
    ]
  },
  increase: {
    lemma: 'increase',
    phonetic: '/ɪnˈkriːs/',
    partOfSpeech: 'verb / noun',
    senses: [
      {
        definitionEn: 'to become or make greater in size, amount, intensity, or degree',
        viSuggestion: 'tăng lên, sự gia tăng',
        examples: ['The number of international students increased dramatically.'],
        synonyms: ['rise', 'grow', 'climb', 'escalate'],
        antonyms: ['decrease', 'drop', 'fall', 'decline'],
        keywords: ['number', 'rate', 'sales', 'population', 'dramatically', 'sharply', 'gradually']
      }
    ],
    collocations: ['increase significantly', 'sharp increase', 'steady increase', 'increase in popularity'],
    wordFamily: [
      { word: 'increase', pos: 'verb' },
      { word: 'increasingly', pos: 'adverb' },
      { word: 'increased', pos: 'adjective' }
    ]
  },
  decrease: {
    lemma: 'decrease',
    phonetic: '/dɪˈkriːs/',
    partOfSpeech: 'verb / noun',
    senses: [
      {
        definitionEn: 'to become or make smaller or fewer',
        viSuggestion: 'giảm xuống, sự sụt giảm',
        examples: ['Traffic congestion decreased after the new public transport system opened.'],
        synonyms: ['decline', 'drop', 'fall', 'diminish'],
        antonyms: ['increase', 'rise', 'grow'],
        keywords: ['drop', 'fall', 'number', 'rate', 'gradually', 'sharply']
      }
    ],
    collocations: ['decrease sharply', 'gradual decrease', 'decrease by 15%', 'significant decrease'],
    wordFamily: [
      { word: 'decrease', pos: 'verb' },
      { word: 'decreased', pos: 'adjective' }
    ]
  },
  benefit: {
    lemma: 'benefit',
    phonetic: '/ˈben.ɪ.fɪt/',
    partOfSpeech: 'noun / verb',
    senses: [
      {
        definitionEn: 'an advantage or positive effect that something produces',
        viSuggestion: 'lợi ích, mang lại lợi ích',
        examples: ['One major benefit of regular exercise is improved mental well-being.'],
        synonyms: ['advantage', 'merit', 'positive aspect'],
        antonyms: ['drawback', 'disadvantage'],
        keywords: ['advantage', 'health', 'financial', 'gain', 'positive']
      }
    ],
    collocations: ['derive benefit from', 'mutual benefit', 'long-term benefit', 'benefit greatly'],
    wordFamily: [
      { word: 'benefit', pos: 'noun' },
      { word: 'beneficial', pos: 'adjective' },
      { word: 'beneficiary', pos: 'noun' }
    ]
  },
  reduce: {
    lemma: 'reduce',
    phonetic: '/rɪˈdʒuːs/',
    partOfSpeech: 'verb',
    senses: [
      {
        definitionEn: 'to make something smaller or less in size, amount, or price',
        viSuggestion: 'cắt giảm, làm giảm bớt',
        examples: ['The government introduced subsidies to reduce the cost of renewable energy.'],
        synonyms: ['cut', 'lower', 'curb', 'diminish'],
        antonyms: ['increase', 'raise'],
        keywords: ['cost', 'pollution', 'risk', 'emissions', 'waste']
      }
    ],
    collocations: ['reduce emissions', 'reduce the risk of', 'reduce costs', 'drastically reduce'],
    wordFamily: [
      { word: 'reduce', pos: 'verb' },
      { word: 'reduction', pos: 'noun' },
      { word: 'reducible', pos: 'adjective' }
    ]
  },
  solution: {
    lemma: 'solution',
    phonetic: '/səˈluː.ʃən/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'a means of solving a problem or dealing with a difficult situation',
        viSuggestion: 'giải pháp, cách giải quyết',
        examples: ['Education is widely seen as the most sustainable solution to poverty.'],
        synonyms: ['answer', 'remedy', 'resolution'],
        keywords: ['problem', 'viable', 'practical', 'sustainable', 'effective']
      }
    ],
    collocations: ['viable solution', 'practical solution', 'find a solution to', 'long-term solution'],
    wordFamily: [
      { word: 'solve', pos: 'verb' },
      { word: 'solution', pos: 'noun' },
      { word: 'solvable', pos: 'adjective' }
    ]
  },
  challenge: {
    lemma: 'challenge',
    phonetic: '/ˈtʃæl.ɪndʒ/',
    partOfSpeech: 'noun / verb',
    senses: [
      {
        definitionEn: 'a new or difficult thing that tests someone and ability and determination',
        viSuggestion: 'thách thức, khó khăn cần vượt qua',
        examples: ['Rapid urbanisation poses serious infrastructure challenges.'],
        synonyms: ['obstacle', 'difficulty', 'test'],
        keywords: ['face', 'pose', 'overcome', 'major', 'formidable']
      }
    ],
    collocations: ['pose a challenge', 'face challenges', 'overcome challenges', 'major challenge'],
    wordFamily: [
      { word: 'challenge', pos: 'noun' },
      { word: 'challenging', pos: 'adjective' }
    ]
  },
  trend: {
    lemma: 'trend',
    phonetic: '/trend/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'a general direction in which something is developing or changing',
        viSuggestion: 'xu hướng, chiều hướng phát triển',
        examples: ['There has been an upward trend in remote employment over recent years.'],
        synonyms: ['tendency', 'movement', 'pattern'],
        keywords: ['upward', 'downward', 'general', 'market', 'consumer']
      }
    ],
    collocations: ['upward trend', 'downward trend', 'reverse a trend', 'growing trend'],
    wordFamily: [
      { word: 'trend', pos: 'noun' },
      { word: 'trendy', pos: 'adjective' }
    ]
  },
  education: {
    lemma: 'education',
    phonetic: '/ˌed.jʊˈkeɪ.ʃən/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'the process of receiving or giving systematic instruction, especially at a school or university',
        viSuggestion: 'giáo dục, việc học tập',
        examples: ['Higher education equips young people with critical analytical skills.'],
        synonyms: ['schooling', 'training', 'instruction'],
        keywords: ['school', 'university', 'student', 'higher', 'system', 'skills']
      }
    ],
    collocations: ['higher education', 'access to education', 'educational background', 'quality of education'],
    wordFamily: [
      { word: 'educate', pos: 'verb' },
      { word: 'education', pos: 'noun' },
      { word: 'educational', pos: 'adjective' },
      { word: 'educator', pos: 'noun' }
    ]
  },
  technology: {
    lemma: 'technology',
    phonetic: '/tekˈnɒl.ə.dʒi/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'scientific knowledge used in practical ways in industry or life',
        viSuggestion: 'công nghệ',
        examples: ['Modern technology has revolutionized how people communicate and work.'],
        synonyms: ['digital tools', 'innovation', 'engineering'],
        keywords: ['digital', 'modern', 'advance', 'ai', 'computer', 'device']
      }
    ],
    collocations: ['modern technology', 'technological advances', 'adopt new technology', 'digital technology'],
    wordFamily: [
      { word: 'technology', pos: 'noun' },
      { word: 'technological', pos: 'adjective' },
      { word: 'technologist', pos: 'noun' }
    ]
  },
  proliferation: {
    lemma: 'proliferation',
    phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
    partOfSpeech: 'noun',
    senses: [
      {
        definitionEn: 'rapid increase in the number or amount of something; rapid reproduction',
        viSuggestion: 'sự gia tăng nhanh chóng, sự sinh sôi',
        examples: ['The rapid proliferation of smartphones has transformed everyday life.'],
        synonyms: ['rapid growth', 'multiplication', 'expansion'],
        keywords: ['rapid', 'growth', 'spread', 'smartphones', 'weapons', 'nuclear']
      }
    ],
    collocations: ['rapid proliferation', 'nuclear proliferation', 'proliferation of digital devices'],
    wordFamily: [
      { word: 'proliferate', pos: 'verb' },
      { word: 'proliferation', pos: 'noun' }
    ]
  },
  unprecedented: {
    lemma: 'unprecedented',
    phonetic: '/ʌnˈpres.ɪ.den.tɪd/',
    partOfSpeech: 'adjective',
    senses: [
      {
        definitionEn: 'never done or known before; without previous example',
        viSuggestion: 'chưa từng có tiền lệ, chưa từng thấy',
        examples: ['The pandemic caused unprecedented disruption to global supply chains.'],
        synonyms: ['unmatched', 'unparalleled', 'novel'],
        keywords: ['scale', 'level', 'rate', 'growth', 'crisis', 'disruption']
      }
    ],
    collocations: ['unprecedented growth', 'on an unprecedented scale', 'unprecedented challenge'],
    wordFamily: [
      { word: 'precedent', pos: 'noun' },
      { word: 'unprecedented', pos: 'adjective' }
    ]
  }
};

/**
 * Naive lemmatizer to match inflected forms back to headword
 */
export function getLemma(rawWord: string): string {
  const w = rawWord.toLowerCase().trim();
  if (IELTS_LEXICON[w]) return w;

  // Common inflections
  if (w.endsWith('ing') && w.length > 5) {
    const candidate = w.slice(0, -3);
    if (IELTS_LEXICON[candidate]) return candidate;
    if (IELTS_LEXICON[candidate + 'e']) return candidate + 'e';
  }
  if (w.endsWith('ed') && w.length > 4) {
    const candidate = w.slice(0, -2);
    if (IELTS_LEXICON[candidate]) return candidate;
    if (IELTS_LEXICON[candidate + 'd']) return candidate + 'd';
    if (IELTS_LEXICON[candidate + 'e']) return candidate + 'e';
  }
  if (w.endsWith('s') && w.length > 3 && !w.endsWith('ss')) {
    const candidate = w.slice(0, -1);
    if (IELTS_LEXICON[candidate]) return candidate;
    if (w.endsWith('es') && IELTS_LEXICON[w.slice(0, -2)]) return w.slice(0, -2);
  }
  if (w.endsWith('ly') && w.length > 4) {
    const candidate = w.slice(0, -2);
    if (IELTS_LEXICON[candidate]) return candidate;
  }
  return w;
}

/**
 * Score relevance of a sense given a context sentence
 */
function scoreSenseContext(definition: string, keywords: string[] | undefined, context: string): number {
  if (!context) return 0;
  const ctxWords = context.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  let score = 0;

  if (keywords) {
    for (const kw of keywords) {
      if (ctxWords.includes(kw.toLowerCase())) score += 5;
    }
  }

  const defWords = definition.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  for (const dw of defWords) {
    if (ctxWords.includes(dw)) score += 1;
  }

  return score;
}

/**
 * Main dictionary lookup function:
 * 1. Lemmatizes input
 * 2. Checks local curated lexicon (instant response & high quality)
 * 3. Attempts external dictionary API if needed
 * 4. Ranks senses if context is provided
 */
export async function lookupVocabularyWord(queryWord: string, context?: string): Promise<VocabLookupResult> {
  const cleanWord = queryWord.trim().toLowerCase();
  const lemma = getLemma(cleanWord);

  // 1. Check if word or lemma is in our curated IELTS lexicon
  const localEntry = IELTS_LEXICON[cleanWord] || IELTS_LEXICON[lemma];
  if (localEntry) {
    // Clone and score senses based on context
    const scoredSenses: VocabLookupSense[] = localEntry.senses.map(s => {
      const relevance = context ? scoreSenseContext(s.definitionEn, s.keywords, context) : 0;
      return {
        definitionEn: s.definitionEn,
        partOfSpeech: localEntry.partOfSpeech,
        examples: s.examples,
        synonyms: s.synonyms,
        antonyms: s.antonyms,
        viSuggestion: s.viSuggestion,
        relevanceScore: relevance
      };
    });

    // Sort highest relevance first if context provided
    if (context) {
      scoredSenses.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    return {
      word: cleanWord,
      lemma: localEntry.lemma,
      phonetic: localEntry.phonetic,
      audio: localEntry.audio,
      audioSource: localEntry.audio ? 'dictionary' : 'tts',
      partOfSpeech: localEntry.partOfSpeech,
      senses: scoredSenses,
      collocations: localEntry.collocations
    };
  }

  // 2. Try fetching from dictionaryapi.dev with 2500ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        let phonetic = entry.phonetic || '';
        let audioUrl: string | undefined;

        if (Array.isArray(entry.phonetics)) {
          for (const p of entry.phonetics) {
            if (!phonetic && p.text) phonetic = p.text;
            if (p.audio && !audioUrl) audioUrl = p.audio;
          }
        }

        const senses: VocabLookupSense[] = [];
        let primaryPos = 'word';

        if (Array.isArray(entry.meanings)) {
          for (const m of entry.meanings) {
            const pos = m.partOfSpeech || 'noun';
            if (primaryPos === 'word') primaryPos = pos;
            if (Array.isArray(m.definitions)) {
              for (const d of m.definitions.slice(0, 3)) {
                const relevance = context ? scoreSenseContext(d.definition || '', undefined, context) : 0;
                senses.push({
                  definitionEn: d.definition || '',
                  partOfSpeech: pos,
                  examples: d.example ? [d.example] : [],
                  synonyms: Array.isArray(d.synonyms) ? d.synonyms.slice(0, 4) : [],
                  antonyms: Array.isArray(d.antonyms) ? d.antonyms.slice(0, 4) : [],
                  viSuggestion: generateViSuggestion(cleanWord, d.definition || ''),
                  relevanceScore: relevance
                });
              }
            }
          }
        }

        if (context && senses.length > 1) {
          senses.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        }

        return {
          word: cleanWord,
          lemma: cleanWord,
          phonetic,
          audio: audioUrl,
          audioSource: audioUrl ? 'dictionary' : 'tts',
          partOfSpeech: primaryPos,
          senses
        };
      }
    }
  } catch {
    // Network timeout or offline - gracefully fall through to generic fallback
  }

  // No placeholder definitions: the client can explain that enrichment is unavailable.
  return {
    word: cleanWord,
    lemma: lemma,
    phonetic: '',
    audioSource: 'tts',
    partOfSpeech: '',
    senses: []
  };
}

/**
 * Intelligent Vietnamese suggestion based on common semantic patterns
 */
function generateViSuggestion(word: string, defEn: string): string {
  const lower = defEn.toLowerCase();
  if (lower.includes('make something less') || lower.includes('reduce')) {
    return 'làm giảm bớt, giảm nhẹ';
  }
  if (lower.includes('become or make greater') || lower.includes('increase')) {
    return 'làm gia tăng, tăng lên';
  }
  if (lower.includes('important') || lower.includes('worthy of attention')) {
    return 'quan trọng, đáng chú ý';
  }
  if (lower.includes('process of receiving') || lower.includes('instruction')) {
    return 'sự giáo dục, quá trình học tập';
  }
  return '';
}
