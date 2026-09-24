-- Cloudflare D1 Multi-User Relational Schema for IELTS Prep Studio

-- 1. USERS & SESSIONS
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    current_band REAL DEFAULT 4.0,
    target_band REAL DEFAULT 6.5,
    daily_study_minutes INTEGER DEFAULT 180,
    roadmap_start_date TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_login_at INTEGER,
    is_active INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    last_seen_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- 2. VOCABULARY DECKS & CARDS (SHARED OR USER-OWNED CONTENT)
CREATE TABLE IF NOT EXISTS vocab_decks (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT, -- NULL for shared/starter decks; user.id for personal decks
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    last_reviewed TEXT,
    total_cards INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vocab_decks_owner ON vocab_decks(owner_user_id);

CREATE TABLE IF NOT EXISTS vocab_cards (
    id TEXT PRIMARY KEY,
    deck_id TEXT NOT NULL,
    owner_user_id TEXT, -- NULL for shared/starter cards; user.id for custom user cards
    word TEXT NOT NULL,
    phonetic TEXT,
    part_of_speech TEXT,
    definition_vi TEXT NOT NULL,
    definition_en TEXT,
    example TEXT,
    collocations TEXT, -- JSON string array
    category TEXT,
    source TEXT,
    source_context TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES vocab_decks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vocab_cards_deck_id ON vocab_cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_vocab_cards_owner ON vocab_cards(owner_user_id);

-- 3. USER VOCABULARY SRS PROGRESS (STRICTLY ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS user_vocab_progress (
    user_id TEXT NOT NULL,
    card_id TEXT NOT NULL,
    ease_factor REAL DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    next_review TEXT NOT NULL,
    last_review TEXT,
    learning_status TEXT DEFAULT 'new', -- 'new' | 'learning' | 'review' | 'mastered'
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, card_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES vocab_cards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_vocab_next_review ON user_vocab_progress(user_id, next_review);
CREATE INDEX IF NOT EXISTS idx_user_vocab_status ON user_vocab_progress(user_id, learning_status);

-- 4. TEST ATTEMPTS (ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS test_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill TEXT NOT NULL, -- 'reading' | 'listening'
    section_id TEXT NOT NULL,
    section_title TEXT NOT NULL,
    test_type TEXT NOT NULL, -- 'practice' | 'full'
    date TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    band_score REAL NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    question_type_stats TEXT, -- JSON object
    mistake_tags TEXT, -- JSON array
    detailed_answers TEXT, -- JSON object
    created_at DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_test_attempts_skill ON test_attempts(user_id, skill);

-- 5. RECORDED MISTAKES (ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS recorded_mistakes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill TEXT NOT NULL, -- 'reading' | 'listening'
    test_id TEXT NOT NULL,
    test_title TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL,
    error_type TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    note TEXT,
    timestamp TEXT NOT NULL,
    created_at DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_recorded_mistakes_user ON recorded_mistakes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_recorded_mistakes_type ON recorded_mistakes(user_id, question_type);

-- 6. GRAMMAR PROGRESS (ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS grammar_progress (
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'not-started' | 'studying' | 'mastered'
    last_studied TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_grammar_progress_user ON grammar_progress(user_id);

-- 7. DAILY PROTOCOL (ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS daily_protocol (
    user_id TEXT NOT NULL,
    date TEXT NOT NULL, -- 'YYYY-MM-DD'
    day_number INTEGER NOT NULL,
    tasks TEXT NOT NULL, -- JSON string array
    streak_days INTEGER DEFAULT 1,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_daily_protocol_user ON daily_protocol(user_id, date);

-- 8. META SETTINGS (ISOLATED PER USER)
CREATE TABLE IF NOT EXISTS meta_settings (
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. VOCABULARY REVIEW LOGS (DETAILED AUDIT TRAIL PER USER)
CREATE TABLE IF NOT EXISTS vocab_review_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    card_id TEXT NOT NULL,
    review_mode TEXT NOT NULL,
    prompt_type TEXT,
    correct INTEGER NOT NULL,
    rating INTEGER,
    response_time_ms INTEGER,
    hint_used INTEGER DEFAULT 0,
    typed_answer TEXT,
    error_type TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES vocab_cards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vocab_review_log_user_card ON vocab_review_log(user_id, card_id, created_at);
CREATE INDEX IF NOT EXISTS idx_vocab_review_log_created ON vocab_review_log(user_id, created_at);

-- 10. CLIENT CHANGE LOG FOR BATCHED OFFLINE-FIRST SYNC
CREATE TABLE IF NOT EXISTS sync_changes (
    cursor INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    change_id TEXT NOT NULL,
    entity TEXT NOT NULL,
    record_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('upsert', 'delete')),
    payload TEXT,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE (user_id, change_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sync_changes_user_cursor ON sync_changes(user_id, cursor);
