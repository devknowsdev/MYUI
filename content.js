if (globalThis.__myui_content_loaded) {
  // Already injected in this page MAIN world — no-op.
  // background.js unconditionally dispatches myui:toggle after injection,
  // so the toggle still fires correctly without any action here.
} else {
globalThis.__myui_content_loaded = true;
(() => {
  const TERM_DEFS = globalThis.TERM_DEFS || {};
  const TERM_DEF_LOOKUP = new Map(Object.entries(TERM_DEFS).map(([key, value]) => [normalize(key), String(value || "").trim()]));
  const SECTION_HOTKEYS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const TOOL_TRAY_WIDTH = 248;
  const ALL_SECTIONS_KEY = "__all__";
  const PANEL_MIN_WIDTH = 320;
  const PANEL_MAX_WIDTH = 980;
  const PANEL_MIN_HEIGHT = 260;
  const PANEL_MAX_HEIGHT = 720;
  const SESSION_MIN_WIDTH = 220;
  const SESSION_MAX_WIDTH = 720;
  const SESSION_MIN_HEIGHT = 160;
  const SESSION_MAX_HEIGHT = 900;

  const STORAGE_KEY = "myuiPrefsV1";
  const LEGACY_STORAGE_KEYS = [];
  const PAGE_STORAGE_KEY = "myuiPrefsPageV1";
  const MASTER_STORAGE_KEY = "myuiMasterV1";
  const COMPACT_STORAGE_KEY = "myuiCompactQuickTagV1";
  const MYUI_BUILD = "2026-03-31-b14"; // persistent armed-field print target, live-safe focus lock
  globalThis.MYUI_BUILD = MYUI_BUILD;
  globalThis.__MYUI_BUILD__ = MYUI_BUILD;
  globalThis.__MYUI_PATCH_LABEL__ = "persistent-armed-field-print-target-live-safe";
  const REQUESTED_RENDER_BIND_PATH = globalThis.__MYUI_RENDER_BIND_PATH__ === "legacy-shared"
    ? "legacy-shared"
    : "compact-only";
  const ACTIVE_RENDER_BIND_PATH = REQUESTED_RENDER_BIND_PATH === "compact-only"
    && typeof globalThis.__MYUI_createCompactRenderModule === "function"
      ? "compact-only"
      : "legacy-shared";
  if (REQUESTED_RENDER_BIND_PATH === "compact-only" && ACTIVE_RENDER_BIND_PATH !== "compact-only") {
    console.warn("[MYUI] Compact-only render/bind path requested but compact render factory is unavailable. Falling back to legacy shared render path.");
  }
  const COMPACT_HISTORY_LIMIT = 40;
  const COMPACT_PHRASE_LIMIT = 160;
  const COMPACT_UNDEFINED_STOP_WORDS = new Set([
    "a", "an", "the", "and", "or", "but", "if", "then", "than",
    "of", "in", "on", "at", "by", "for", "from", "to", "into", "onto",
    "with", "without", "over", "under", "through", "across", "between",
    "after", "before", "during", "around", "this", "that", "these", "those",
    "it", "its", "i", "me", "my", "you", "your", "we", "our", "they", "their",
    "he", "his", "she", "her", "them", "is", "are", "was", "were", "be",
    "been", "being", "do", "does", "did", "doing", "have", "has", "had",
    "having", "can", "could", "should", "would", "may", "might", "must",
    "will", "just", "very", "more", "most", "less"
  ]);
  const COMPACT_SOURCE_FILE = "final_terms_codex_package/myui_compact_terms_2026-04-07_master_updated.csv";
  const COMPACT_CANONICAL_UPPER_TOKENS = new Map([
    ["adsr", "ADSR"],
    ["am", "AM"],
    ["bpm", "BPM"],
    ["daw", "DAW"],
    ["edm", "EDM"],
    ["eq", "EQ"],
    ["fm", "FM"],
    ["lfo", "LFO"],
    ["lufs", "LUFS"],
    ["midi", "MIDI"],
    ["rms", "RMS"],
    ["vst", "VST"]
  ]);
  const COMPACT_ROMAN_NUMERALS = new Set(["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]);
  const COMPACT_VIBE_ALLOWED_LY_TERMS = new Set(["melancholy"]);
  const COMPACT_VIBE_CATEGORY_HINT = /\b(vibe|feel|feeling|emotion|energy|mood|dynamic|dynamics)\b/;
  const COMPACT_TEXTURE_TAXONOMY_HINT = /\b(texture|timbre|tone|tonal|textural|grain|gravel|warmth|bright(?:ness)?|dark(?:ness)?|airy|breath(?:y|ily)?|muddy|gritty|shimmer(?:y)?|lush|hollow|thin|thick|organic(?:ally)?|synthe(?:tic|tically)|mechanic(?:al|ally)|digital(?:ly)?|analog(?:ue)?|glassy|glossy|crisp(?:y)?|distort(?:ed|ion)?|saturat(?:ed|ion))\b/;
  const COMPACT_PRODUCTION_TAXONOMY_HINT = /\b(production|record(?:ing)?|mix|master(?:ing)?|effect|effects|fx|reverb|delay|compress(?:ion)?|eq|stereo|spatial|processing|daw|vst|lufs|rms)\b/;
  const COMPACT_ARRANGEMENT_TAXONOMY_HINT = /\b(arrangement|arrange|structure|section|performance|delivery|harmony|melody|rhythm|groove|motion|canon(?:ical(?:ly)?)?|counterpoint|contrapuntal(?:ly)?|chromatic(?:ally)?|diatonic(?:ally)?|modal(?:ly)?|polyrhythm(?:ic(?:ally)?)?|theme|thematic(?:ally)?|progression|style|genre)\b/;
  const COMPACT_RUNTIME_SECTION_META = {
    instruments: {
      sectionKey: "instruments",
      sectionLabel: "Instruments",
      category: "Instruments / sources",
      flowBucket: "Instruments",
      functionBucket: "Instrumental"
    },
    vibe: {
      sectionKey: "vibe",
      sectionLabel: "Vibe",
      category: "Mood / feeling",
      flowBucket: "Energy",
      functionBucket: "Expressive"
    },
    texture: {
      sectionKey: "texture",
      sectionLabel: "Texture",
      category: "Texture / timbre",
      flowBucket: "Texture",
      functionBucket: "Textural"
    },
    arrangement: {
      sectionKey: "arrangement",
      sectionLabel: "Arrangement",
      category: "Performance / delivery",
      flowBucket: "Form",
      functionBucket: "Arrangement"
    },
    production: {
      sectionKey: "production",
      sectionLabel: "Production",
      category: "Production / recording / effects",
      flowBucket: "Production",
      functionBucket: "Production"
    }
  };
  const COMPACT_GROUPS = [
    {
      key: "instruments",
      label: "Instruments",
      sectionKey: "instruments",
      sectionLabel: "Instruments",
      category: "Custom Instruments",
      flowBucket: "Instruments",
      functionBucket: "Instrumental",
      palette: { h: 140, s: 22 }
    },
    {
      key: "feel",
      label: "Vibe",
      sectionKey: "vibe",
      sectionLabel: "Vibe",
      category: "Custom Vibe",
      flowBucket: "Energy",
      functionBucket: "Expressive",
      palette: { h: 340, s: 24 }
    },
    {
      key: "texture",
      label: "Texture",
      sectionKey: "texture",
      sectionLabel: "Texture",
      category: "Custom Texture",
      flowBucket: "Texture",
      functionBucket: "Textural",
      palette: { h: 190, s: 24 }
    },
    {
      key: "arrangement",
      label: "Arrangement",
      sectionKey: "arrangement",
      sectionLabel: "Arrangement",
      category: "Custom Arrangement",
      flowBucket: "Form",
      functionBucket: "Arrangement",
      palette: { h: 40, s: 24 }
    },
    {
      key: "production",
      label: "Production",
      sectionKey: "production",
      sectionLabel: "Production",
      category: "Custom Production",
      flowBucket: "Production",
      functionBucket: "Production",
      palette: { h: 215, s: 26 }
    }
  ];
  const SECTION_ORDER = ["connect", "feel", "sound", "form", "instruments", "mix"];
  const HOTKEY_WINDOW_SIZE = 10;
  const HOTKEY_PAGE_STEP = 4;
  const TERMS_HOTKEYS = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
  const CONN_HOTKEYS = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª", "º"];
  const SECTION_HUES = {
    connect: 260, feel: 340, sound: 190,
    form: 40, instruments: 140, mix: 210
  };
  const SECTION_CAT_HOTKEYS = {
    connect: "c", feel: "f", sound: "s",
    form: "r", instruments: "i", mix: "m"
  };
  const CAT_HOTKEY_SECTION = Object.fromEntries(
    Object.entries(SECTION_CAT_HOTKEYS).map(([sec, k]) => [k, sec])
  );
  const SECTION_DESCRIPTIONS = {
    connect: "Connectives and positional language for linking observations",
    feel: "Rhythm, energy, dynamics, and emotional character",
    sound: "Tonal texture, production quality, and mix character",
    form: "Song structure, sections, and formal devices",
    instruments: "Instrument sources, types, and vocal categories",
    mix: "How elements relate, interact, and move within the arrangement"
  };
  let DEFAULT_MASTER_ROWS = Array.isArray(globalThis.MYUI_TERM_MASTER) ? globalThis.MYUI_TERM_MASTER.map((row, index) => normalizeMasterRow(row, index)) : [];
  let MASTER_ROWS = DEFAULT_MASTER_ROWS.map((row) => ({ ...row }));
  let CUSTOM_TERM_ENTRIES = [];
  let COMPACT_SOURCE_ROWS = [];
  let COMPACT_ACTIVE_ROWS = [];
  let LEGACY_COMPACT_CUSTOM_ENTRIES = [];
  let COMPACT_TERMS = [];
  let COMPACT_TERM_MAP = new Map();
  let TERMS = [];
  let CATEGORY_CONFIG = [];
  let SECTION_META = [];
  let CATEGORY_META = new Map();
  let TERM_MAP = new Map();
  let TERM_BY_SHORTCUT = new Map();
  let TERM_FAMILY_MEMBERS = new Map();

  const state = {
    visible: false,
    appActive: false,
    autoHide: false,
    stayActive: false,
    query: "",
    queryInput: "",
    searchScope: "all",
    themeMode: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    layoutCols: 2,
    orderMode: "dataset",
    helpOpen: false,
    helpHover: false,
    hoverTooltipTitle: "",
    hoverTooltipBody: "",
    selectedSection: "",
    expandedCats: new Set(),
    previewKey: "",
    pinnedKey: "",
    panelWidth: 680,
    panelHeight: 360,
    dock: "float",
    stickyMode: false,
    controlsCollapsed: false,
    navCollapsed: false,
    floatX: Math.max(24, window.innerWidth - 740),
    floatY: 72,
    sidebarMode: null,
    toolTrayInstruments: false,
    toolTrayVibes: false,
    toolTrayExpandedInstruments: false,
    toolTrayExpandedVibes: false,
    selectedToolSec: "",
    selectedToolIndex: -1,
    instrumentsList: [],
    vibeList: [],
    editMode: false,
    writeMode: true,
    masterDirty: false,
    hoverX: 0,
    hoverY: 0,
    editorOpen: false,
    editorQuery: "",
    editorSection: "",
    editorCategory: "",
    editorStatus: "all",
    editorMessage: "",
    editorNewShortcut: "",
    editorNewTerm: "",
    editorNewNotes: "",
    hotkeySectionKey: "",
    hotkeyPrevSectionKey: "",
    hotkeyPinnedSectionKey: "",
    hotkeyArmedAt: 0,
    searchOnlyMode: false,
    searchCatsVisible: false,
    searchCategoryFilter: "",
    focusMode: false,
    uiScale: 1.05,
    panelOpacity: 0.96,
    sessionOpen: false,
    sessionX: Math.max(24, window.innerWidth - 432),
    sessionY: 96,
    sessionWidth: 380,
    sessionHeight: 560,
    sessionItems: [],
    sessionMinimized: false,
    sessionPage: 0,
    quickTagMode: "compact",
    compactTermsOpen: true,
    compactTermsX: Math.max(24, window.innerWidth - 1312),
    compactTermsY: 96,
    compactTermsWidth: 420,
    compactTermsHeight: 560,
    compactTermsMinimized: false,
    compactTagsOpen: true,
    compactTagsX: Math.max(24, window.innerWidth - 868),
    compactTagsY: 96,
    compactTagsWidth: 360,
    compactTagsHeight: 560,
    compactTagsMinimized: false,
    compactPrintsOpen: false,
    compactPrintsX: Math.max(24, window.innerWidth - 868),
    compactPrintsY: 404,
    compactPrintsWidth: 420,
    compactPrintsHeight: 320,
    compactPrintsMinimized: false,
    compactPhrasesOpen: false,
    compactPhrasesX: Math.max(24, window.innerWidth - 1308),
    compactPhrasesY: 404,
    compactPhrasesWidth: 420,
    compactPhrasesHeight: 320,
    compactPhrasesMinimized: false,
    compactPhrasesSentencesOpen: true,
    compactPhrasesManualOpen: true,
    compactSessionTermsOpen: false,
    compactSessionTermsX: Math.max(24, window.innerWidth - 1240),
    compactSessionTermsY: 96,
    compactSessionTermsWidth: 340,
    compactSessionTermsHeight: 480,
    compactSessionTermsMinimized: false,
    compactSessionTermsOrderMode: "category",
    compactMasterComposeOpen: true,
    compactMasterPhrasesOpen: true,
    compactMasterHistoryOpen: false,
    compactTermsSearchOpen: true,
    compactTermsResultsOpen: true,
    compactTermsCustomOpen: true,
    compactTermsLibraryOpen: true,
    compactTermsUndefinedOpen: true,
    compactTermsActiveSection: "instruments",
    compactTermsCategoryOpen: {},
    compactGroupInstrumentsOpen: true,
    compactGroupFeelOpen: true,
    compactGroupTextureOpen: true,
    compactGroupArrangementOpen: true,
    compactGroupProductionOpen: true,
    fullSentenceMode: false,
    composerText: "",
    composerOpen: false,
    composerFocused: false,
    compactQuery: "",
    compactComposeText: "",
    compactCustomTermText: "",
    compactCustomTermShortcut: "",
    compactCustomTermGroup: "feel",
    compactPrintHistory: [],
    compactPhraseBank: [],
    compactManualPhraseBank: [],
    compactManualPhraseText: "",
    compactStatusMessage: "",
    compactStatusKind: "info",
    compactSitePrintPromptOpen: false,
    compactSitePrintPromptText: "",
    compactInterimTranscript: "",
    compactDictationActive: false,
    compactSpeechAvailable: false,
    compactSourceReady: false,
    confirmExitOpen: false,
    confirmNextTrack: false,
    connectivesEnabled: true,
    connectivesCustom: null,
    connEditOpen: false,
    connPencilOpen: false,
    connAddOpen: false,
    connAddInput: "",
    connDeleteArmed: false,
    connDeleteTarget: null,
    listenConnectives: [],
    insFloat: false,
    insX: Math.max(24, window.innerWidth - 600),
    insY: 72,
    insMinimized: false,
    vibFloat: false,
    vibX: Math.max(24, window.innerWidth - 600),
    vibY: 280,
    vibMinimized: false,
    listenMode: "word",
    undefinedTerms: [],
    undefinedOpen: false,
    quickConnOpen: false,
    quickTemplates: [],
    quickTemplateNameInput: "",
    quickTemplateSelected: "",
    quickSortMode: "custom",
    editorUndefinedOpen: false,
    editorTermsOpen: false,
    inputTermsOpen: false,
    inputTermsText: "",
    inputTermsStatus: "",
    inputTermsParsed: [],
    quickComposePinned: true,
    quickConnectPinned: false,
    quickPhrasesPinned: false,
    quickTermsPinned: true,
    quickTemplatesPinned: false,
    composerChips: [],
    composerStealing: false,
    composerChipCounter: 0,
    quickConnectInput: "",
    quickPhrasesInput: "",
    quickTermsInput: "",
    quickTempTermInput: "",
    quickConnectDeleteMode: false,
    quickPhrasesDeleteMode: false,
    quickTermsDeleteMode: false,
    quickComposerDeleteMode: false,
    quickConnectDeleteTarget: null,
    quickPhrasesDeleteTarget: null,
    quickTermsDeleteTarget: null,
    quickPhrases: [],
    quickTermsViewMode: "user",
    quickConnectOrderMode: "user",
    quickPhrasesOrderMode: "user",
    quickTermsCatOpen: "",
    quickTermsCatPins: [],
    quickTermsHotkeyOffset: 0,
    quickConnHotkeyOffset: 0,
    quickPhrasesHotkeyOffset: 0,
    quickLastActiveSection: "terms",
    quickAltTarget: "connect",
    quickModifier: null,
    quickModifierArmed: false,
    composerPills: [],
    composerPillCounter: 0,
    composerSelectedPillId: null,
    composerDragId: null,
    termDragIdx: null,
    termDragOverIdx: null,
    quickHotkeysArmed: false,
    quickMoveMode: null,
    quickMovePillIdx: null,
    composerNextCapitalise: false,
    composerPendingPillMeta: null,
    tempTermsOpen: false,
    tempTermsInput: "",
    tempTermsShortcutInput: "",
    tempTermsAwaitingShortcut: false,
    tempTermsPendingText: "",
    tempTermsDeleteMode: false,
    tempTermsDeleteTarget: null,
    tempTermsEditTarget: null,
    tempTermsEditText: "",
    tempTermsEditShortcut: ""
  };

  let host = null;
  let shadow = null;
  let injected = false;
  let lastFocusedField = null;
  let armedFieldSelection = null;
  let compactArmedField = null;
  let compactArmedFieldSelection = null;
  let collapseTimer = null;
  let isResizing = false;
  let dockDragUntil = 0;
  let toolUndoStack = [];
  let toolRedoStack = [];
  let styleNode = null;
  let contentNode = null;
  let compactSpeechAdapter = null;
  let renderScheduled = false;
  let _savePrefsTimer = null;
  let _initReady = false;
  let _pendingToggle = false;
  let _listenCleanup = null;
  let _queuedComposerRestoreSnapshot = null;
  let _queuedComposerRestoreUntil = 0;
  let _pendingCompactMicStopCommand = null;
  let _compactMicStopRequested = false;
  let _compactMicStopCommandTimer = null;

  function isCompactOnlyRenderBindPath() {
    return ACTIVE_RENDER_BIND_PATH === "compact-only";
  }

  function getStoredArmedField() {
    return isCompactOnlyRenderBindPath() ? compactArmedField : lastFocusedField;
  }

  function setStoredArmedField(field) {
    if (isCompactOnlyRenderBindPath()) compactArmedField = field;
    else lastFocusedField = field;
  }

  function getStoredArmedFieldSelection() {
    return isCompactOnlyRenderBindPath() ? compactArmedFieldSelection : armedFieldSelection;
  }

  function setStoredArmedFieldSelection(snapshot) {
    if (isCompactOnlyRenderBindPath()) compactArmedFieldSelection = snapshot;
    else armedFieldSelection = snapshot;
  }

  function clearStoredArmedFieldSelection() {
    if (isCompactOnlyRenderBindPath()) compactArmedFieldSelection = null;
    else armedFieldSelection = null;
  }

  function shouldTrackDocumentArmedField() {
    if (!state.appActive || !state.sessionOpen) return false;
    if (isCompactOnlyRenderBindPath()) return true;
    return !!(state.writeMode || isCompactQuickTagMode());
  }

  function shouldInstallLegacyDocumentHotkeys() {
    return !isCompactOnlyRenderBindPath();
  }

  function shouldStartLegacyListenRuntime() {
    return !isCompactOnlyRenderBindPath();
  }

  function shouldInstallCompactWindowHotkeys() {
    return isCompactOnlyRenderBindPath();
  }

  function queuePrefsSave(delay = 180) {
    clearTimeout(_savePrefsTimer);
    _savePrefsTimer = setTimeout(savePrefs, delay);
  }

  const COMPACT_WINDOW_HOTKEYS = {
    Digit0: { label: "MYUI", openKey: "sessionOpen", minimizedKey: "sessionMinimized", master: true },
    Digit1: { label: "Prints", openKey: "compactPrintsOpen", minimizedKey: "compactPrintsMinimized" },
    Digit2: { label: "Phrases", openKey: "compactPhrasesOpen", minimizedKey: "compactPhrasesMinimized" },
    Digit3: { label: "Terms", openKey: "compactTermsOpen", minimizedKey: "compactTermsMinimized" },
    Digit4: { label: "Tags", openKey: "compactTagsOpen", minimizedKey: "compactTagsMinimized" },
    Digit5: { label: "Session", openKey: "compactSessionTermsOpen", minimizedKey: "compactSessionTermsMinimized" }
  };

  function ensureCompactOnlyAppActive() {
    if (state.appActive) return false;
    state.appActive = true;
    enterCompactQuickTagMode();
    return true;
  }

  function toggleCompactWindowFromHotkey(binding) {
    if (!binding) return false;
    const activated = ensureCompactOnlyAppActive();
    if (binding.master) {
      state.sessionOpen = true;
      state.sessionMinimized = activated ? false : !state.sessionMinimized;
      queuePrefsSave();
      render();
      return true;
    }
    if (state.sessionMinimized) return true;
    if (activated) {
      state[binding.openKey] = true;
      state[binding.minimizedKey] = false;
    } else {
      state[binding.openKey] = !state[binding.openKey];
      if (state[binding.openKey]) state[binding.minimizedKey] = false;
    }
    queuePrefsSave();
    render();
    return true;
  }

  function handleCompactWindowHotkeys(event) {
    if (!shouldInstallCompactWindowHotkeys()) return;
    if (!_initReady || event.defaultPrevented || event.isComposing || event.repeat) return;
    if (!event.metaKey || !event.altKey || event.ctrlKey || event.shiftKey) return;
    const binding = COMPACT_WINDOW_HOTKEYS[String(event.code || "")];
    if (!binding) return;
    event.preventDefault();
    event.stopPropagation();
    toggleCompactWindowFromHotkey(binding);
  }


  // ── Listen mode ─────────────────────────────────────────────────────────────

  // Pre-built normalized term lookup — rebuilt when terms change
  let _listenTermIndex = null;
  let _listenDebounceTimer = null;

  function buildListenIndex() {
    _listenTermIndex = TERMS.map(term => ({
      term,
      norm: normalize(term.p),
      words: normalize(term.p).split(/\s+/)
    }));
  }

  function listenMatchScore(inputNorm, entryNorm) {
    if (!inputNorm || !entryNorm) return 0;
    if (inputNorm === entryNorm) return 1;
    if (entryNorm.includes(inputNorm) && inputNorm.length >= 3) return inputNorm.length / entryNorm.length;
    if (inputNorm.includes(entryNorm) && entryNorm.length >= 3) return entryNorm.length / inputNorm.length;
    // Skip Levenshtein if length diff is too large — fast reject
    if (Math.abs(inputNorm.length - entryNorm.length) > 3) return 0;
    const la = inputNorm.length, lb = entryNorm.length;
    // Use two-row rolling array instead of full matrix — O(n) space
    let prev = Array.from({ length: lb + 1 }, (_, j) => j);
    let curr = new Array(lb + 1);
    for (let i = 1; i <= la; i++) {
      curr[0] = i;
      for (let j = 1; j <= lb; j++) {
        curr[j] = inputNorm[i-1] === entryNorm[j-1]
          ? prev[j-1]
          : 1 + Math.min(prev[j], curr[j-1], prev[j-1]);
      }
      [prev, curr] = [curr, prev];
    }
    const dist = prev[lb];
    const maxLen = Math.max(la, lb);
    return maxLen ? (maxLen - dist) / maxLen : 0;
  }

  function extractNewTokens(prev, curr) {
    if (!curr.startsWith(prev)) return [];
    const delta = curr.slice(prev.length);
    if (!delta.includes(" ")) return [];
    const parts = delta.split(" ");
    const completed = parts.slice(0, -1);
    return completed
      .map(w => w.replace(/[^a-zA-Z0-9\-']/g, "").toLowerCase())
      .filter(w => w.length >= 2 && !w.includes(" ") && !/^\d+$/.test(w));
  }

  function processListenTokens(newTokens) {
    if (state.listenMode === "off" || !newTokens.length || !TERMS.length) return;
    if (!_listenTermIndex || _listenTermIndex.length !== TERMS.length) buildListenIndex();
    const THRESHOLD = 0.90;
    const candidates = new Set(newTokens.filter(t => t.length >= 3));
    if (!candidates.size) return;
    let didChange = false;

    for (const entry of _listenTermIndex) {
      const firstLetters = new Set(entry.words.map(w => w[0]));
      if (![...candidates].some(c => firstLetters.has(c[0]))) continue;
      let matched = false;
      for (const token of candidates) {
        if (listenMatchScore(token, entry.norm) >= THRESHOLD) { matched = true; break; }
      }
      if (!matched) continue;
      const { term } = entry;
      const sec = term.sec;
      if (sec === "connect") {
        const allConn = new Set([...getConnectives(), ...state.listenConnectives].map(normalize));
        if (!allConn.has(normalize(term.p))) {
          state.listenConnectives = [...state.listenConnectives, term.p];
          if (!state.connEditOpen) state.connEditOpen = true;
          didChange = true;
        }
        continue;
      }
      const key = termKey(term);
      const alreadyInSession = state.sessionItems.some(item => item.key === key);
      if (sec === "instruments") {
        const list = state.instrumentsList;
        if (!list.some(item => toolItemText(item) === term.p)) {
          pushToolHistory();
          list.push({ text: term.p, display: term.s || term.p, label: term.p, active: true });
          setToolTrayOpen("instruments", true); didChange = true;
        }
        if (!alreadyInSession) {
          state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
          if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
          state.sessionOpen = true; didChange = true;
        }
        continue;
      }
      if (sec === "feel" || sec === "sound") {
        const list = state.vibeList;
        if (!list.some(item => toolItemText(item) === term.p)) {
          pushToolHistory();
          list.push({ text: term.p, display: term.s || term.p, label: term.p, active: true });
          setToolTrayOpen("vibes", true); didChange = true;
        }
        if (!alreadyInSession) {
          state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
          if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
          state.sessionOpen = true; didChange = true;
        }
        continue;
      }
      if (!alreadyInSession) {
        state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
        if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
        state.sessionOpen = true; didChange = true;
      }
    }

    // Undefined collection — runs once per token set, after all term matching is complete
    const knownConnectives = new Set([...getConnectives(), ...state.listenConnectives].map(normalize));
    for (const token of candidates) {
      if (token.length < 5) continue;
      if (token.includes(" ")) continue;
      if (knownConnectives.has(normalize(token))) continue;
      const alreadyMatched = _listenTermIndex.some(e =>
        listenMatchScore(normalize(token), e.norm) >= THRESHOLD);
      if (!alreadyMatched) {
        const norm = normalize(token);
        if (!state.undefinedTerms.some(u => normalize(undefinedTermText(u)) === norm)) {
          state.undefinedTerms = [token, ...state.undefinedTerms].slice(0, 200);
          didChange = true;
        }
      }
    }

    if (didChange) {
      queuePrefsSave(600);
      render();
    }
  }

  function startListening() {
    stopListening();
    buildListenIndex();
    // Compose-local render-collect branch: derived collection happens when
    // pending textarea text is rendered into pills, not on each input event.
    _listenCleanup = () => {
      clearTimeout(_listenDebounceTimer);
    };
  }

  function stopListening() {
    if (_listenCleanup) { _listenCleanup(); _listenCleanup = null; }
  }

  // ── END Listen mode ──────────────────────────────────────────────────────────

  const DEFAULT_CONNECTIVES = [
    "with", "and", "but", "while", "as", "over", "under", "through", "into",
    "against", "beneath", "above", "alongside", "within", "between", "behind",
    "before", "after", "yet", "though", "because", "then", "or", "when"
  ];

  function getConnectives() {
    if (Array.isArray(state.connectivesCustom)) return state.connectivesCustom;
    return DEFAULT_CONNECTIVES;
  }

  function undefinedTermText(entry) {
    return typeof entry === "string" ? entry : (entry?.text || "");
  }

  function undefinedTermShortcut(entry) {
    return typeof entry === "object" && entry?.shortcut ? entry.shortcut : "";
  }

  function undefinedSessionKey(text) {
    const clean = String(text || "").trim();
    const norm = normalize(clean);
    return norm ? `undefined::${norm}` : "";
  }

  function isUndefinedSessionItem(item) {
    return String(item?.key || "").startsWith("undefined::");
  }

  function upsertUndefinedSessionItem(entry) {
    const text = undefinedTermText(entry).trim();
    const key = undefinedSessionKey(text);
    if (!text || !key) return false;
    const now = Date.now();
    const shortcut = undefinedTermShortcut(entry).trim();
    const next = state.sessionItems.filter((item) => item.key !== key);
    const existing = state.sessionItems.find((item) => item.key === key);
    next.unshift({
      key,
      shortcut: shortcut || String(existing?.shortcut || "").trim(),
      text,
      count: (existing?.count || 0) + 1,
      updatedAt: now
    });
    state.sessionItems = next.slice(0, 80);
    state.sessionOpen = true;
    return true;
  }

  function removeUndefinedSessionItem(entry) {
    const key = undefinedSessionKey(typeof entry === "string" ? entry : undefinedTermText(entry));
    if (!key) return false;
    const before = state.sessionItems.length;
    state.sessionItems = state.sessionItems.filter((item) => item.key !== key);
    return state.sessionItems.length !== before;
  }

  function sortedConnectives() {
    const custom = getConnectives();
    const listen = state.listenConnectives || [];
    return [...custom, ...listen.filter(w => !custom.includes(w))];
  }

  function addToQsSection(key) {
    const inputKey = key === "connect" ? "quickConnectInput"
                   : key === "phrases" ? "quickPhrasesInput"
                   : "quickTermsInput";
    const text = (state[inputKey] || "").trim();
    if (!text) return;

    if (key === "connect") {
      const current = getConnectives();
      if (!current.some(w => normalize(w) === normalize(text))) {
        state.connectivesCustom = [...current, text];
      }
    } else if (key === "phrases") {
      const id = Date.now();
      state.quickPhrases = [...(state.quickPhrases || []), { id, text }];
    } else if (key === "terms") {
      const sessionKey = `custom::terms::${normalize(text)}`;
      if (!state.sessionItems.some(i => i.key === sessionKey)) {
        state.sessionItems = [
          { key: sessionKey, shortcut: "", text, count: 1, updatedAt: Date.now() },
          ...state.sessionItems
        ].slice(0, 80);
        state.sessionOpen = true;
      }
    }

    state[inputKey] = "";
    savePrefs(); render();
  }

  function executeQsDelete(key) {
    if (key === "connect") {
      const target = state.quickConnectDeleteTarget;
      if (target) {
        const base = getConnectives().filter(w => w !== target);
        state.connectivesCustom = base.length ? base : null;
        state.listenConnectives = state.listenConnectives.filter(w => w !== target);
      }
      state.quickConnectDeleteMode = false;
      state.quickConnectDeleteTarget = null;
    } else if (key === "phrases") {
      const target = state.quickPhrasesDeleteTarget;
      if (target !== null) {
        state.quickPhrases = (state.quickPhrases || []).filter(p => p.id !== target);
      }
      state.quickPhrasesDeleteMode = false;
      state.quickPhrasesDeleteTarget = null;
    } else if (key === "terms") {
      const target = state.quickTermsDeleteTarget;
      if (target !== null) {
        state.sessionItems = state.sessionItems.filter((_, i) => i !== target);
      }
      state.quickTermsDeleteMode = false;
      state.quickTermsDeleteTarget = null;
    }
    savePrefs(); render();
  }

  function boolish(value) {
    return value === true || value === 1 || value === "1" || String(value || "").toLowerCase() === "true";
  }

  function escapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function makeRowId(row, fallbackIndex) {
    return row?.id || [row?.code || "", row?.section_key || row?.sectionKey || "", row?.category || row?.label || "", row?.shortcut || row?.s || "", normalize(row?.term || row?.p || ""), fallbackIndex].join("::");
  }

  function normalizeMasterRow(row, fallbackIndex = 0) {
    const normalized = {
      id: makeRowId(row, fallbackIndex),
      code: String(row?.code || "").trim(),
      category: String(row?.category || row?.label || "").trim(),
      section_key: String(row?.section_key || row?.sectionKey || "").trim(),
      section_label: String(row?.section_label || row?.sectionLabel || "").trim(),
      flow_bucket: String(row?.flow_bucket || row?.flowBucket || "").trim(),
      function_bucket: String(row?.function_bucket || row?.functionBucket || "").trim(),
      palette_h: String(row?.palette_h ?? row?.palette?.h ?? "210").trim(),
      palette_s: String(row?.palette_s ?? row?.palette?.s ?? "18").trim(),
      shortcut: String(row?.shortcut || row?.s || "").trim(),
      term: String(row?.term || row?.p || "").trim(),
      base_shortcut: String(row?.base_shortcut || row?.baseShortcut || "").trim(),
      suffix: String(row?.suffix || "").trim(),
      notes: String(row?.notes || "").trim(),
      order_code: String(row?.order_code ?? row?.ord ?? "0").trim(),
      hidden: boolish(row?.hidden),
      deleted: boolish(row?.deleted)
    };
    if (!normalized.section_label && normalized.section_key) normalized.section_label = titleCase(normalized.section_key);
    if (!normalized.flow_bucket && normalized.section_label) normalized.flow_bucket = normalized.section_label;
    return normalized;
  }

  function normalizeCompactShortcutValue(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    const lower = text.toLowerCase();
    if (COMPACT_CANONICAL_UPPER_TOKENS.has(lower) && text === text.toUpperCase()) return COMPACT_CANONICAL_UPPER_TOKENS.get(lower);
    if (COMPACT_ROMAN_NUMERALS.has(lower) && text === text.toUpperCase()) return lower.toUpperCase();
    return lower;
  }

  function normalizeCompactTermValue(value) {
    let text = String(value || "").trim().toLowerCase();
    if (!text) return "";

    text = text.replace(/\b(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\b/g, (match) => {
      const lower = match.toLowerCase();
      return COMPACT_ROMAN_NUMERALS.has(lower) ? lower.toUpperCase() : match;
    });

    COMPACT_CANONICAL_UPPER_TOKENS.forEach((upper, lower) => {
      const singularPattern = new RegExp(`\\b${escapeRegex(lower)}\\b`, "g");
      const pluralPattern = new RegExp(`\\b${escapeRegex(lower)}s\\b`, "g");
      text = text.replace(pluralPattern, `${upper}s`);
      text = text.replace(singularPattern, upper);
    });

    return text;
  }

  function compactCanonicalSectionKey(value) {
    const key = normalize(value);
    if (key === "feel") return "vibe";
    if (key === "sound") return "texture";
    if (key === "form") return "arrangement";
    if (key === "mix") return "production";
    return key;
  }

  function compactCategorySectionKey(value) {
    const key = normalize(value);
    if (!key) return "";
    if (key === "instruments / voices") return "instruments";
    if (key === "descriptors / mood / texture") return "vibe";
    if (key === "production / recording / effects") return "production";
    if (key === "form / arrangement / function") return "arrangement";
    if (key === "harmony / melody / tonality") return "arrangement";
    if (key === "performance / technique") return "arrangement";
    if (key === "genre / style") return "arrangement";
    if (key === "rhythm / tempo / meter") return "arrangement";
    if (key === "annotation / relational phrases") return "arrangement";
    return "";
  }

  function compactVibeTermIsAdverbial(term) {
    const words = normalize(term).split(/\s+/).filter(Boolean);
    if (!words.length) return false;
    const lastWord = words[words.length - 1];
    return /ly$/.test(lastWord) && !COMPACT_VIBE_ALLOWED_LY_TERMS.has(lastWord);
  }

  function compactResolvedSectionMeta(row, normalizedTerm) {
    const rawSectionKey = compactCanonicalSectionKey(row?.section_key || row?.sectionKey || "");
    const rawCategory = String(row?.category || row?.label || "").trim();
    const rawFlowBucket = String(row?.flow_bucket || row?.flowBucket || "").trim();
    const rawFunctionBucket = String(row?.function_bucket || row?.functionBucket || "").trim();
    const normalizedCategory = normalize(rawCategory);
    const categorySectionKey = compactCategorySectionKey(rawCategory);
    const inferredGroupKey = compactCanonicalSectionKey(compactGroupKeyFromValue([
      rawSectionKey,
      rawCategory,
      rawFlowBucket,
      rawFunctionBucket,
      row?.section_label || row?.sectionLabel || "",
      row?.notes || ""
    ].filter(Boolean).join(" ")));
    const initialSectionKey = rawSectionKey || categorySectionKey || inferredGroupKey || "vibe";
    const shouldIgnoreCategoryForVibeSplit = categorySectionKey === "vibe"
      && normalizedCategory === "descriptors / mood / texture";
    const taxonomyHaystack = normalize([
      normalizedTerm,
      shouldIgnoreCategoryForVibeSplit ? "" : rawCategory,
      rawFlowBucket,
      rawFunctionBucket,
      row?.notes || ""
    ].filter(Boolean).join(" "));
    const isVibeCandidate = initialSectionKey === "vibe"
      || normalizedCategory === "mood / feeling"
      || COMPACT_VIBE_CATEGORY_HINT.test(normalizedCategory);

    let resolvedSectionKey = initialSectionKey;
    if (isVibeCandidate) {
      if (COMPACT_PRODUCTION_TAXONOMY_HINT.test(taxonomyHaystack)) resolvedSectionKey = "production";
      else if (COMPACT_TEXTURE_TAXONOMY_HINT.test(taxonomyHaystack)) resolvedSectionKey = "texture";
      else if (COMPACT_ARRANGEMENT_TAXONOMY_HINT.test(taxonomyHaystack)) resolvedSectionKey = "arrangement";
      else if (compactVibeTermIsAdverbial(normalizedTerm)) resolvedSectionKey = "arrangement";
      else resolvedSectionKey = "vibe";
    }

    const sectionMeta = COMPACT_RUNTIME_SECTION_META[resolvedSectionKey] || COMPACT_RUNTIME_SECTION_META.vibe;
    const movedOutOfVibe = isVibeCandidate && resolvedSectionKey !== "vibe";
    const shouldResetCategory = movedOutOfVibe && (!rawCategory || normalizedCategory === "mood / feeling");

    return {
      sectionKey: sectionMeta.sectionKey,
      sectionLabel: sectionMeta.sectionLabel,
      category: shouldResetCategory ? sectionMeta.category : (rawCategory || sectionMeta.category),
      flowBucket: movedOutOfVibe || !rawFlowBucket ? sectionMeta.flowBucket : rawFlowBucket,
      functionBucket: movedOutOfVibe || !rawFunctionBucket ? sectionMeta.functionBucket : rawFunctionBucket
    };
  }

  function normalizeCompactLibraryRow(row, fallbackIndex = 0) {
    const rawShortcut = row?.shortcut ?? row?.s ?? "";
    const rawBaseShortcut = row?.base_shortcut ?? row?.baseShortcut ?? "";
    const rawTerm = row?.term ?? row?.p ?? "";
    const normalizedTerm = normalizeCompactTermValue(rawTerm);
    const sectionMeta = compactResolvedSectionMeta(row, normalizedTerm);
    return normalizeMasterRow({
      ...row,
      category: sectionMeta.category,
      section_key: sectionMeta.sectionKey,
      section_label: sectionMeta.sectionLabel,
      flow_bucket: sectionMeta.flowBucket,
      function_bucket: sectionMeta.functionBucket,
      shortcut: normalizeCompactShortcutValue(rawShortcut),
      base_shortcut: rawBaseShortcut ? normalizeCompactShortcutValue(rawBaseShortcut) : "",
      term: normalizedTerm
    }, fallbackIndex);
  }

  function compactGroupConfig(groupKey) {
    const resolvedKey = groupKey === "vibe" ? "feel" : groupKey;
    return COMPACT_GROUPS.find((group) => group.key === resolvedKey) || COMPACT_GROUPS[1];
  }

  function compactGroupOptions() {
    return COMPACT_GROUPS.map((group) => ({ key: group.key, label: group.label }));
  }

  function compactCustomTermToRow(entry, index = 0) {
    const group = compactGroupConfig(entry?.groupKey);
    const createdAt = Number(entry?.createdAt) || Date.now();
    return normalizeMasterRow({
      id: String(entry?.id || `compact::${createdAt}::${index}`),
      code: `CMP-${group.key.toUpperCase()}`,
      category: group.category,
      section_key: group.sectionKey,
      section_label: group.sectionLabel,
      flow_bucket: group.flowBucket,
      function_bucket: group.functionBucket,
      palette_h: String(group.palette.h),
      palette_s: String(group.palette.s),
      shortcut: String(entry?.shortcut || "").trim(),
      term: String(entry?.term || "").trim(),
      notes: String(entry?.notes || `Custom compact term · ${group.label}`),
      order_code: String(9000 + index),
      hidden: false,
      deleted: false
    }, index);
  }

  function compactGroupKeyFromValue(value) {
    const text = normalize(value);
    if (!text) return "";
    const categorySectionKey = compactCategorySectionKey(text);
    if (categorySectionKey) return categorySectionKey === "vibe" ? "feel" : categorySectionKey;
    if (/instrument|source|drum|guitar|bass|synth|vocal|keys|piano|string|horn|woodwind/.test(text)) return "instruments";
    if (/vibe|feel|feeling|energy|emotion|dynamic|dynamics|mood/.test(text)) return "feel";
    if (/production|record|recording|mix|master|mastering|effect|effects|fx|reverb|delay|compress|compression|eq|stereo|spatial|processing/.test(text)) return "production";
    if (/texture|tone|sound|tonal|textural|timbre|color|grain|surface|warmth|brightness/.test(text)) return "texture";
    if (/arrangement|arrange|form|structure|section|state|performance|delivery|harmony|melody|rhythm|groove|motion|style|genre/.test(text)) return "arrangement";
    return "";
  }

  function flattenCompactSourcePayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    const directArrays = [payload.terms, payload.items, payload.rows, payload.data, payload.entries, payload.pack];
    for (const entry of directArrays) {
      if (Array.isArray(entry)) return entry;
    }
    const groupedArrays = [payload.groups, payload.sections, payload.categories];
    for (const groupCollection of groupedArrays) {
      if (Array.isArray(groupCollection)) {
        return groupCollection.flatMap((group) => {
          const groupKey = group?.key || group?.group || group?.name || group?.label || group?.section || group?.title || "";
          const items = group?.terms || group?.items || group?.rows || group?.entries || [];
          return Array.isArray(items) ? items.map((item) => ({ __groupKey: groupKey, ...item })) : [];
        });
      }
      if (groupCollection && typeof groupCollection === "object") {
        return Object.entries(groupCollection).flatMap(([groupKey, items]) =>
          Array.isArray(items) ? items.map((item) => ({ __groupKey: groupKey, ...item })) : []
        );
      }
    }
    return [];
  }

  function compactSourceItemToRow(item, index = 0) {
    if (!item || typeof item !== "object") return null;
    const term = String(item.term || item.text || item.phrase || item.p || "").trim();
    const shortcut = String(item.shortcut || item.key || item.s || "").trim();
    if (!term || !shortcut) return null;
    const inferredGroupKey = compactGroupKeyFromValue(
      item.groupKey ||
      item.group ||
      item.section_key ||
      item.section ||
      item.sectionLabel ||
      item.category_label ||
      item.category ||
      item.subcategory ||
      item.bucket ||
      item.__groupKey
    );
    const group = compactGroupConfig(inferredGroupKey || "feel");
    const category = String(item.category_label || item.label || item.sectionLabel || item.category || item.bucket || group.label).trim() || group.label;
    return normalizeCompactLibraryRow({
      id: String(item.id || `slim::${group.key}::${normalize(term)}::${index}`),
      code: String(item.code || item.category || `SLM-${group.key.toUpperCase()}`),
      category,
      section_key: group.sectionKey,
      section_label: group.sectionLabel,
      flow_bucket: String(item.flow_bucket || item.flowBucket || group.flowBucket),
      function_bucket: String(item.function_bucket || item.functionBucket || group.functionBucket),
      palette_h: String(item.palette_h ?? item.palette?.h ?? group.palette.h),
      palette_s: String(item.palette_s ?? item.palette?.s ?? group.palette.s),
      shortcut,
      term,
      base_shortcut: String(item.base_shortcut || item.baseShortcut || ""),
      suffix: String(item.suffix || ""),
      notes: String(item.notes || item.description || item.definition || item.desc || ""),
      order_code: String(item.order_code ?? item.ord ?? index),
      hidden: false,
      deleted: false
    }, index);
  }

  function cloneCompactLibraryRows(rows) {
    return (rows || []).map((row, index) => normalizeCompactLibraryRow(row, index));
  }

  function sanitizeCompactLibraryRows(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((item, index) => compactSourceItemToRow(item, index))
      .filter(Boolean);
  }

  function restoreStoredCompactLibraryRows(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;
        const directRow = normalizeCompactLibraryRow(item, index);
        if (directRow.shortcut && directRow.term) return directRow;
        return compactSourceItemToRow(item, index);
      })
      .filter(Boolean);
  }

  function defaultCompactLibraryRows() {
    return cloneCompactLibraryRows(COMPACT_SOURCE_ROWS.length ? COMPACT_SOURCE_ROWS : MASTER_ROWS);
  }

  function activeCompactLibraryRows() {
    return COMPACT_ACTIVE_ROWS.length ? COMPACT_ACTIVE_ROWS : defaultCompactLibraryRows();
  }

  function materializeActiveCompactLibraryRows() {
    if (!COMPACT_ACTIVE_ROWS.length) COMPACT_ACTIVE_ROWS = defaultCompactLibraryRows();
    return COMPACT_ACTIVE_ROWS;
  }

  function compactBaseRows() {
    return activeCompactLibraryRows();
  }

  function compactRuntimeRows() {
    return compactBaseRows().filter((row) => !row.deleted && !row.hidden);
  }

  function rebuildCompactRuntimeData() {
    const rows = compactRuntimeRows().filter((row) => row.shortcut && row.term && row.category && row.section_key);
    COMPACT_TERMS = rows.map((row, index) => ({
      p: row.term,
      s: row.shortcut,
      sec: row.section_key,
      secLabel: row.section_label || titleCase(row.section_key),
      cat: row.category,
      catCode: row.code || row.category,
      catLabel: row.category,
      flowBucket: row.flow_bucket || "",
      functionBucket: row.function_bucket || "",
      baseShortcut: row.base_shortcut || "",
      suffix: row.suffix || "",
      ord: Number(row.order_code || index),
      rowId: row.id,
      notes: row.notes || ""
    }));
    COMPACT_TERM_MAP = new Map(COMPACT_TERMS.map((term) => [termKey(term), term]));
    state.compactSourceReady = !!COMPACT_SOURCE_ROWS.length;
  }

  function runtimeMasterRows() {
    return MASTER_ROWS.concat(CUSTOM_TERM_ENTRIES.map((entry, index) => compactCustomTermToRow(entry, index)));
  }

  function activeMasterRows() {
    return runtimeMasterRows().filter((row) => !row.deleted && !row.hidden);
  }

  function rebuildRuntimeData() {
    _listenTermIndex = null; // invalidate listen index
    const catMap = new Map();
    const activeRows = activeMasterRows().filter((row) => row.shortcut && row.term && row.category && row.section_key);

    activeRows.forEach((row, index) => {
      const catKey = row.code || `${row.section_key}::${row.category}`;
      if (!catMap.has(catKey)) {
        catMap.set(catKey, {
          code: row.code || row.category,
          label: row.category,
          display: row.category,
          sectionKey: row.section_key,
          sectionLabel: row.section_label || titleCase(row.section_key),
          flowBucket: row.flow_bucket || row.section_label || titleCase(row.section_key),
          functionBucket: row.function_bucket || "",
          palette: {
            h: Number(row.palette_h || 210),
            s: Number(row.palette_s || 18)
          },
          sortCode: Number(row.order_code || 0),
          terms: []
        });
      }
      catMap.get(catKey).terms.push({
        s: row.shortcut,
        p: row.term,
        baseShortcut: row.base_shortcut || "",
        suffix: row.suffix || "",
        ord: index,
        rowId: row.id,
        notes: row.notes || ""
      });
    });

    CATEGORY_CONFIG = Array.from(catMap.values()).sort((a, b) => {
      const sec = compareSectionKeys(a.sectionKey, b.sectionKey);
      if (sec) return sec;
      const order = (Number(a.sortCode || 0) - Number(b.sortCode || 0));
      if (order) return order;
      const code = String(a.code || "").localeCompare(String(b.code || ""));
      if (code) return code;
      return String(a.label).localeCompare(String(b.label));
    });

    TERMS = CATEGORY_CONFIG.flatMap((cat) => cat.terms.map((term, index) => ({
      p: term.p,
      s: term.s,
      sec: cat.sectionKey,
      secLabel: cat.sectionLabel,
      cat: cat.display,
      catCode: cat.code,
      catLabel: cat.label,
      flowBucket: cat.flowBucket,
      functionBucket: cat.functionBucket,
      baseShortcut: term.baseShortcut || "",
      suffix: term.suffix || "",
      ord: Number.isFinite(term.ord) ? term.ord : index,
      rowId: term.rowId,
      notes: term.notes || ""
    })));

    SECTION_META = buildSectionMeta();
    CATEGORY_META = new Map();
    TERM_MAP = new Map();
    TERM_BY_SHORTCUT = new Map();
    TERM_FAMILY_MEMBERS = new Map();

    for (const category of CATEGORY_CONFIG) {
      if (!category?.display) continue;
      CATEGORY_META.set(category.display, category);
    }
    for (const term of TERMS) {
      TERM_MAP.set(termKey(term), term);
      if (term?.s) TERM_BY_SHORTCUT.set(term.s, term);
      const famKey = familyKey(term);
      if (!TERM_FAMILY_MEMBERS.has(famKey)) TERM_FAMILY_MEMBERS.set(famKey, []);
      TERM_FAMILY_MEMBERS.get(famKey).push(term);
    }

    if (state.selectedSection && state.selectedSection !== ALL_SECTIONS_KEY && !SECTION_META.some((section) => section.key === state.selectedSection)) {
      state.selectedSection = "";
      state.expandedCats.clear();
    }
    rebuildCompactRuntimeData();
  }

  function csvHeaders() {
    return [
      "code","category","section_key","section_label","flow_bucket","function_bucket",
      "palette_h","palette_s","shortcut","term","base_shortcut","suffix","notes","order_code","hidden","deleted"
    ];
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    if (!/[",\n]/.test(text)) return text;
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function parseCsvLine(line, delimiter = ",") {
    const fields = [];
    let cur = "", inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuote = true; }
        else if (ch === delimiter) { fields.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
    }
    fields.push(cur.trim());
    return fields;
  }

  function detectDelimitedTextSeparator(raw) {
    const candidates = [",", ";", "\t"];
    const sampleLines = String(raw || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .slice(0, 6);
    if (!sampleLines.length) return ",";

    let bestDelimiter = ",";
    let bestScore = -1;
    for (const delimiter of candidates) {
      const fieldCounts = sampleLines.map((line) => parseCsvLine(line, delimiter).length);
      const usefulRows = fieldCounts.filter((count) => count > 1).length;
      const totalFields = fieldCounts.reduce((sum, count) => sum + count, 0);
      const firstCount = fieldCounts[0] || 0;
      const score = usefulRows * 1000 + totalFields * 10 + firstCount;
      if (score > bestScore) {
        bestScore = score;
        bestDelimiter = delimiter;
      }
    }
    return bestDelimiter;
  }

  function parseInputTerms(raw) {
    const delimiter = detectDelimitedTextSeparator(raw);
    const lines = String(raw || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results = [];
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const fields = parseCsvLine(line, delimiter);
      const shortcut = String(fields[0] || "").trim();
      const term = String(fields[1] || "").trim();
      const section_key = String(fields[2] || "").trim().toLowerCase();
      const category = String(fields[3] || "").trim();
      const notes = String(fields[4] || "").trim();
      if (!shortcut || !term) continue;
      results.push({ shortcut, term, section_key, category, notes });
    }
    return results;
  }

  function validateAndSetInputTerms(raw) {
    state.inputTermsText = raw;
    if (!raw.trim()) {
      state.inputTermsStatus = "";
      state.inputTermsParsed = [];
      return;
    }
    try {
      const parsed = parseInputTerms(raw);
      if (!parsed.length) {
        state.inputTermsStatus = "error:No valid rows found — need at least shortcut and term columns";
        state.inputTermsParsed = [];
        return;
      }
      state.inputTermsParsed = parsed;
      state.inputTermsStatus = `ok:${parsed.length} row${parsed.length !== 1 ? "s" : ""} ready to import`;
    } catch (e) {
      state.inputTermsStatus = `error:Parse error — ${e.message}`;
      state.inputTermsParsed = [];
    }
  }

  function exportMasterCsv() {
    const headers = csvHeaders();
    const lines = [headers.join(",")].concat(MASTER_ROWS.map((row) => headers.map((key) => csvEscape(row[key])).join(",")));
    downloadText(`terms_master_export_${dateStamp()}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
  }

  function xmlEscape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function buildPlistText() {
    const rows = activeMasterRows().filter((row) => row.shortcut && row.term).slice().sort((a, b) => {
      const shortcutDiff = String(a.shortcut).localeCompare(String(b.shortcut));
      if (shortcutDiff) return shortcutDiff;
      return String(a.term).localeCompare(String(b.term));
    });
    const body = rows.map((row) => `  <dict>
    <key>phrase</key>
    <string>${xmlEscape(row.term)}</string>
    <key>shortcut</key>
    <string>${xmlEscape(row.shortcut)}</string>
  </dict>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
${body}
</array>
</plist>
`;
  }

  function exportPlist() {
    downloadText(`MYUI_Shortcuts_${dateStamp()}.plist`, buildPlistText(), "application/x-plist;charset=utf-8");
  }

  function dateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function downloadText(filename, text, mimeType = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.documentElement.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function compactLibraryCsvHeaders() {
    return ["shortcut", "term", "section_key", "category", "notes"];
  }

  function activeCompactLibraryExportRows() {
    return activeCompactLibraryRows()
      .filter((row) => row.shortcut && row.term && !row.deleted && !row.hidden)
      .slice()
      .sort((a, b) => {
        const shortcutDiff = String(a.shortcut || "").localeCompare(String(b.shortcut || ""));
        if (shortcutDiff) return shortcutDiff;
        return String(a.term || "").localeCompare(String(b.term || ""));
      });
  }

  function buildCompactLibraryCsvText() {
    const headers = compactLibraryCsvHeaders();
    const lines = [headers.join(",")].concat(
      activeCompactLibraryExportRows().map((row) => headers.map((key) => csvEscape(row[key] || "")).join(","))
    );
    return lines.join("\n");
  }

  function buildCompactLibraryPlistText() {
    const body = activeCompactLibraryExportRows().map((row) => `  <dict>
    <key>phrase</key>
    <string>${xmlEscape(row.term)}</string>
    <key>shortcut</key>
    <string>${xmlEscape(row.shortcut)}</string>
    <key>section_key</key>
    <string>${xmlEscape(row.section_key || "")}</string>
    <key>category</key>
    <string>${xmlEscape(row.category || "")}</string>
    <key>notes</key>
    <string>${xmlEscape(row.notes || "")}</string>
  </dict>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
${body}
</array>
</plist>
`;
  }

  function exportCompactLibraryFiles() {
    downloadText(`myui_compact_terms_${dateStamp()}.csv`, buildCompactLibraryCsvText(), "text/csv;charset=utf-8");
    setTimeout(() => {
      downloadText(`myui_compact_terms_${dateStamp()}.plist`, buildCompactLibraryPlistText(), "application/x-plist;charset=utf-8");
    }, 120);
    setCompactStatus("Exported the active compact terms library as .csv and .plist.", "success");
    render();
    return true;
  }

  function compactImportFieldMap(headers) {
    const map = new Map();
    headers.forEach((header, index) => {
      const key = normalize(header).replace(/[^a-z0-9]+/g, "_");
      if (key) map.set(key, index);
    });
    return map;
  }

  function compactImportFieldValue(fields, fieldMap, names) {
    for (const name of names) {
      const index = fieldMap.get(name);
      if (Number.isInteger(index)) return String(fields[index] || "").trim();
    }
    return "";
  }

  function parseCompactLibraryCsv(raw) {
    const delimiter = detectDelimitedTextSeparator(raw);
    const lines = String(raw || "").split(/\r?\n/).filter((line) => line.trim());
    if (!lines.length) throw new Error("CSV file is empty.");
    const firstFields = parseCsvLine(lines[0], delimiter);
    const fieldMap = compactImportFieldMap(firstFields);
    const hasHeader = ["shortcut", "term", "phrase"].some((key) => fieldMap.has(key));
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const rows = [];
    const skipped = [];
    dataLines.forEach((line, index) => {
      if (!line.trim() || line.trim().startsWith("#")) return;
      const fields = parseCsvLine(line, delimiter);
      const record = hasHeader ? {
        shortcut: compactImportFieldValue(fields, fieldMap, ["shortcut", "key", "s"]),
        term: compactImportFieldValue(fields, fieldMap, ["term", "phrase", "text", "p"]),
        section_key: compactImportFieldValue(fields, fieldMap, ["section_key", "section", "group", "group_key"]),
        category: compactImportFieldValue(fields, fieldMap, ["category", "category_label", "subcategory", "label"]),
        notes: compactImportFieldValue(fields, fieldMap, ["notes", "description", "definition", "desc"])
      } : {
        shortcut: String(fields[0] || "").trim(),
        term: String(fields[1] || "").trim(),
        section_key: String(fields[2] || "").trim(),
        category: String(fields[3] || "").trim(),
        notes: String(fields[4] || "").trim()
      };
      const row = compactSourceItemToRow(record, index);
      if (!row) {
        skipped.push(index + 1 + (hasHeader ? 1 : 0));
        return;
      }
      rows.push(row);
    });
    if (!rows.length) throw new Error("No valid import rows were found.");
    return { rows, skippedCount: skipped.length };
  }

  function plistNodeValue(node) {
    if (!node) return "";
    const name = String(node.tagName || "").toLowerCase();
    if (name === "true") return true;
    if (name === "false") return false;
    return String(node.textContent || "").trim();
  }

  function parseCompactLibraryPlist(raw) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(raw || ""), "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid .plist file.");
    const dicts = Array.from(doc.querySelectorAll("plist > array > dict"));
    if (!dicts.length) throw new Error("No import entries were found in the .plist file.");
    const rows = [];
    let skippedCount = 0;
    dicts.forEach((dictNode, index) => {
      const record = {};
      let lastKey = "";
      Array.from(dictNode.children).forEach((child) => {
        const name = String(child.tagName || "").toLowerCase();
        if (name === "key") {
          lastKey = String(child.textContent || "").trim();
          return;
        }
        if (!lastKey) return;
        record[lastKey] = plistNodeValue(child);
        lastKey = "";
      });
      const row = compactSourceItemToRow(record, index);
      if (!row) {
        skippedCount += 1;
        return;
      }
      rows.push(row);
    });
    if (!rows.length) throw new Error("No valid import rows were found in the .plist file.");
    return { rows, skippedCount };
  }

  function replaceCompactLibraryRows(rows, message) {
    COMPACT_ACTIVE_ROWS = cloneCompactLibraryRows(rows);
    CUSTOM_TERM_ENTRIES = [];
    rebuildRuntimeData();
    saveCompactData();
    setCompactStatus(message, "success");
    render();
    return true;
  }

  function compactLibraryIdentityKey(row) {
    return normalize(row?.term || row?.p || "");
  }

  function compactLibraryRowsEquivalent(a, b) {
    const keys = [
      "shortcut",
      "term",
      "section_key",
      "section_label",
      "category",
      "code",
      "flow_bucket",
      "function_bucket",
      "base_shortcut",
      "suffix",
      "notes",
      "order_code",
      "hidden",
      "deleted"
    ];
    return keys.every((key) => String(a?.[key] ?? "") === String(b?.[key] ?? ""));
  }

  function reconcileImportedCompactLibraryRows(importedRows) {
    const currentRows = cloneCompactLibraryRows(activeCompactLibraryRows());
    const currentByTerm = new Map();
    currentRows.forEach((row) => {
      const key = compactLibraryIdentityKey(row);
      if (key && !currentByTerm.has(key)) currentByTerm.set(key, row);
    });

    const nextRows = [];
    const nextIndexByKey = new Map();
    let updated = 0;
    let added = 0;

    (importedRows || []).forEach((row, index) => {
      const normalizedRow = normalizeMasterRow(row, index);
      const key = compactLibraryIdentityKey(normalizedRow);
      if (!key) return;
      const current = currentByTerm.get(key);
      const nextRow = current
        ? normalizeMasterRow({ ...normalizedRow, id: current.id || normalizedRow.id }, index)
        : normalizedRow;

      if (current) {
        if (!compactLibraryRowsEquivalent(current, nextRow)) updated += 1;
      } else {
        added += 1;
      }

      if (nextIndexByKey.has(key)) {
        nextRows[nextIndexByKey.get(key)] = nextRow;
      } else {
        nextIndexByKey.set(key, nextRows.length);
        nextRows.push(nextRow);
      }
    });

    const removed = currentRows.reduce((count, row) => {
      const key = compactLibraryIdentityKey(row);
      return key && !nextIndexByKey.has(key) ? count + 1 : count;
    }, 0);

    return { rows: nextRows, added, updated, removed };
  }

  function resetCompactLibraryToDefault() {
    const confirmed = window.confirm("Reset the compact terms library to the factory default? This will discard the currently active imported or customized library and replace it with the bundled factory default.");
    if (!confirmed) return false;
    return replaceCompactLibraryRows(defaultCompactLibraryRows(), "Restored the compact terms library to the factory default.");
  }

  async function importCompactLibraryFile(file) {
    if (!file) return false;
    const name = String(file.name || "").trim();
    const lowerName = name.toLowerCase();
    let parsed;
    try {
      const raw = await file.text();
      parsed = lowerName.endsWith(".plist")
        ? parseCompactLibraryPlist(raw)
        : parseCompactLibraryCsv(raw);
    } catch (error) {
      setCompactStatus(`Import failed: ${error.message || "invalid file"}`, "error");
      render();
      return false;
    }
    const reconciled = reconcileImportedCompactLibraryRows(parsed.rows);
    return replaceCompactLibraryRows(
      reconciled.rows,
      [
        "Imported successfully",
        `${reconciled.updated} updated`,
        `${reconciled.added} added`,
        `${reconciled.removed} removed`,
        parsed.skippedCount ? `${parsed.skippedCount} malformed row${parsed.skippedCount === 1 ? "" : "s"} skipped` : ""
      ].filter(Boolean).join(" · ")
    );
  }

  function editorSections() {
    return [...new Set(MASTER_ROWS.map((row) => row.section_key).filter(Boolean))].sort(compareSectionKeys);
  }

  function editorCategories() {
    const rows = state.editorSection ? MASTER_ROWS.filter((row) => row.section_key === state.editorSection) : MASTER_ROWS;
    const categories = [...new Set(rows.map((row) => row.category).filter(Boolean))];
    if (state.editorSection) {
      const configured = categoriesForSection(state.editorSection).map((entry) => entry.display);
      const rank = new Map(configured.map((name, index) => [name, index]));
      categories.sort((a, b) => {
        const diff = (rank.has(a) ? rank.get(a) : 999) - (rank.has(b) ? rank.get(b) : 999);
        if (diff) return diff;
        return a.localeCompare(b);
      });
      return categories;
    }
    return categories.sort((a, b) => a.localeCompare(b));
  }
  function editorCategoryTemplates() {
    return MASTER_ROWS.filter((row) => {
      if (row.deleted) return false;
      if (!row.section_key || !row.category) return false;
      if (state.editorSection && row.section_key !== state.editorSection) return false;
      return true;
    }).sort((a, b) => {
      const sec = String(a.section_key).localeCompare(String(b.section_key));
      if (sec) return sec;
      const cat = String(a.category).localeCompare(String(b.category));
      if (cat) return cat;
      return Number(a.order_code || 0) - Number(b.order_code || 0);
    }).filter((row, index, arr) => index === arr.findIndex((item) => item.section_key === row.section_key && item.category === row.category));
  }


  function inlineCategoryRows(sectionKey, categoryDisplay) {
    return MASTER_ROWS.filter((row) => row.section_key === sectionKey && row.category === categoryDisplay).sort((a, b) => {
      const deletedDiff = Number(a.deleted) - Number(b.deleted);
      if (deletedDiff) return deletedDiff;
      const hiddenDiff = Number(a.hidden) - Number(b.hidden);
      if (hiddenDiff) return hiddenDiff;
      const ord = Number(a.order_code || 0) - Number(b.order_code || 0);
      if (ord) return ord;
      const shortcut = String(a.shortcut).localeCompare(String(b.shortcut));
      if (shortcut) return shortcut;
      return String(a.term).localeCompare(String(b.term));
    });
  }

  function rowConflictDetails(row) {
    if (!row || row.deleted) return { shortcut: false, term: false, messages: [] };
    const shortcut = normalize(row.shortcut);
    const term = normalize(row.term);
    const others = MASTER_ROWS.filter((other) => other.id !== row.id && !other.deleted);
    const shortcutConflict = !!(shortcut && others.some((other) => normalize(other.shortcut) === shortcut));
    const termConflict = !!(term && others.some((other) => normalize(other.term) === term && normalize(other.section_key) === normalize(row.section_key)));
    const messages = [];
    if (shortcutConflict && row.shortcut) messages.push(`Shortcut “${row.shortcut}” already exists.`);
    if (termConflict && row.term) messages.push(`Term “${row.term}” already exists in ${titleCase(row.section_key)}.`);
    return { shortcut: shortcutConflict, term: termConflict, messages };
  }

  function conflictingRows() {
    return MASTER_ROWS.filter((row) => {
      const info = rowConflictDetails(row);
      return info.shortcut || info.term;
    });
  }

  function addInlineCategoryRow(sectionKey, categoryDisplay) {
    const template = MASTER_ROWS.find((row) => row.section_key === sectionKey && row.category === categoryDisplay)
      || MASTER_ROWS.find((row) => row.section_key === sectionKey)
      || MASTER_ROWS[0]
      || normalizeMasterRow({}, MASTER_ROWS.length + 1);
    const sameCategory = MASTER_ROWS.filter((row) => row.section_key === sectionKey && row.category === categoryDisplay);
    const nextOrder = (sameCategory.reduce((max, row) => Math.max(max, Number(row.order_code || 0) || 0), 0) || 0) + 1;
    const next = normalizeMasterRow({
      ...template,
      id: `custom::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
      section_key: sectionKey,
      section_label: titleCase(sectionKey),
      category: categoryDisplay,
      shortcut: '',
      term: '',
      base_shortcut: '',
      suffix: '',
      notes: '',
      order_code: String(nextOrder),
      hidden: false,
      deleted: false
    }, MASTER_ROWS.length + 1);
    MASTER_ROWS.unshift(next);
    state.masterDirty = true;
    state.editorMessage = `Added a blank row to ${titleCase(sectionKey)} · ${categoryDisplay}`;
  }

  function saveAndExportAll() {
    saveMasterRows('Saved changes');
    exportMasterCsv();
    setTimeout(() => exportPlist(), 220);
    state.editorMessage = 'Saved and exported CSV and .plist';
  }

  function renderDirtyBanner() {
    const conflictCount = conflictingRows().length;
    if (!state.masterDirty && !state.editorMessage && !conflictCount) return '';
    const bits = [];
    if (state.masterDirty) bits.push('Unsaved changes');
    if (conflictCount) bits.push(`${conflictCount} conflict${conflictCount === 1 ? '' : 's'} to review`);
    if (!bits.length && state.editorMessage) bits.push(state.editorMessage);
    return `<div class="save-banner ${state.masterDirty ? 'dirty' : ''} ${conflictCount ? 'warn' : ''}">${esc(state.editorMessage || bits.join(' · '))}${state.editorMessage && bits.length > 1 ? ` <span class="save-banner-meta">${esc(bits.filter((bit) => bit !== state.editorMessage).join(' · '))}</span>` : ''}</div>`;
  }

  function renderInlineCategoryEditor(entry) {
    const rows = inlineCategoryRows(entry.sectionKey, entry.display);
    const conflictCount = rows.filter((row) => {
      const info = rowConflictDetails(row);
      return info.shortcut || info.term;
    }).length;
    return `
      <div class="inline-edit-shell">
        <div class="inline-edit-head">
          <div>
            <div class="inline-edit-title">Edit ${esc(entry.label)}</div>
            <div class="inline-edit-meta">${rows.length} row${rows.length === 1 ? '' : 's'}${conflictCount ? ` · ${conflictCount} conflict${conflictCount === 1 ? '' : 's'}` : ''}</div>
          </div>
          <button class="ghost-btn inline-add-row-btn" type="button" data-inline-add-sec="${esc(entry.sectionKey)}" data-inline-add-cat="${esc(entry.display)}">+ Add row</button>
        </div>
        <div class="inline-edit-list">
          ${rows.length ? rows.map((row) => renderInlineEditRow(row)).join('') : `<div class="editor-empty-state">No rows in this category yet.</div>`}
        </div>
      </div>
    `;
  }

  function renderInlineEditRow(row) {
    const info = rowConflictDetails(row);
    const rowClass = [row.deleted ? 'deleted' : '', row.hidden ? 'hidden' : '', (info.shortcut || info.term) ? 'warn' : ''].filter(Boolean).join(' ');
    return `
      <div class="inline-edit-row-wrap ${rowClass}">
        <div class="inline-edit-row">
          <input class="editor-cell inline-edit-cell short ${info.shortcut ? 'warn' : ''}" data-inline-row="${esc(row.id)}" data-inline-field="shortcut" value="${esc(row.shortcut)}" placeholder="short" />
          <input class="editor-cell inline-edit-cell term ${info.term ? 'warn' : ''}" data-inline-row="${esc(row.id)}" data-inline-field="term" value="${esc(row.term)}" placeholder="term" />
          <button class="ghost-btn subtle inline-row-btn" type="button" data-inline-toggle-hidden="${esc(row.id)}">${row.hidden ? 'Show' : 'Hide'}</button>
          <button class="ghost-btn subtle inline-row-btn danger-row" type="button" data-inline-toggle-deleted="${esc(row.id)}">${row.deleted ? 'Undo' : 'Del'}</button>
        </div>
        ${(info.messages.length || row.hidden || row.deleted) ? `<div class="inline-edit-warning">${[...info.messages, row.hidden ? 'Hidden' : '', row.deleted ? 'Deleted' : ''].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
      </div>
    `;
  }

  function createEditorRowFromContext() {
    if (!state.editorSection || !state.editorCategory) {
      setEditorMessage("Choose a section and category first");
      return false;
    }
    const shortcut = String(state.editorNewShortcut || "").trim();
    const term = String(state.editorNewTerm || "").trim();
    if (!shortcut || !term) {
      setEditorMessage("Enter both shortcut and term");
      return false;
    }
    const template = MASTER_ROWS.find((row) => row.section_key === state.editorSection && row.category === state.editorCategory)
      || MASTER_ROWS.find((row) => row.section_key === state.editorSection)
      || MASTER_ROWS[0]
      || normalizeMasterRow({}, MASTER_ROWS.length + 1);
    const sameCategory = MASTER_ROWS.filter((row) => row.section_key === state.editorSection && row.category === state.editorCategory);
    const nextOrder = (sameCategory.reduce((max, row) => Math.max(max, Number(row.order_code || 0) || 0), 0) || 0) + 1;
    const next = normalizeMasterRow({
      ...template,
      id: `custom::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
      shortcut,
      term,
      base_shortcut: "",
      suffix: "",
      notes: String(state.editorNewNotes || "").trim(),
      order_code: String(nextOrder),
      hidden: false,
      deleted: false
    }, MASTER_ROWS.length + 1);
    MASTER_ROWS.unshift(next);
    state.editorStatus = "all";
    state.editorNewShortcut = "";
    state.editorNewTerm = "";
    state.editorNewNotes = "";
    setEditorMessage(`Added ${term} to ${titleCase(state.editorSection)} › ${state.editorCategory}`);
    return true;
  }

  function setEditorMessage(message) {
    state.editorMessage = message;
  }

  function editorVisibleRows() {
    return MASTER_ROWS.filter((row) => {
      const statusOk = state.editorStatus === "all"
        ? true
        : state.editorStatus === "active"
          ? !row.hidden && !row.deleted
          : state.editorStatus === "hidden"
            ? row.hidden && !row.deleted
            : row.deleted;
      if (!statusOk) return false;
      if (state.editorSection && row.section_key !== state.editorSection) return false;
      if (state.editorCategory && row.category !== state.editorCategory) return false;
      if (!state.editorQuery) return true;
      const haystack = [row.shortcut, row.term, row.category, row.section_key, row.section_label, row.code, row.notes].map(normalize).join(" ");
      return haystack.includes(normalize(state.editorQuery));
    }).sort((a, b) => {
      const sec = String(a.section_key).localeCompare(String(b.section_key));
      if (sec) return sec;
      const cat = String(a.category).localeCompare(String(b.category));
      if (cat) return cat;
      const ord = Number(a.order_code || 0) - Number(b.order_code || 0);
      if (ord) return ord;
      return String(a.shortcut).localeCompare(String(b.shortcut));
    });
  }

  function duplicateShortcutConflicts() {
    const counts = new Map();
    for (const row of activeMasterRows()) {
      const sc = normalize(row.shortcut);
      if (!sc) continue;
      counts.set(sc, (counts.get(sc) || 0) + 1);
    }
    return counts;
  }

  function duplicateTermConflicts() {
    const counts = new Map();
    for (const row of activeMasterRows()) {
      const term = normalize(row.term);
      if (!term) continue;
      counts.set(term, (counts.get(term) || 0) + 1);
    }
    return counts;
  }

  function buildSectionMeta() {
    const order = [];
    const map = new Map();
    for (const category of CATEGORY_CONFIG) {
      if (!category?.sectionKey) continue;
      if (!map.has(category.sectionKey)) {
        map.set(category.sectionKey, {
          key: category.sectionKey,
          label: category.sectionLabel || titleCase(category.sectionKey),
          description: sectionDescription(category.sectionKey),
          categories: []
        });
        order.push(category.sectionKey);
      }
      map.get(category.sectionKey).categories.push(category);
    }

    if (!order.length) {
      const fallback = [...new Set(TERMS.map((term) => term.sec).filter(Boolean))].sort(compareSectionKeys);
      fallback.forEach((key) => {
        map.set(key, { key, label: titleCase(key), description: sectionDescription(key), categories: [] });
      });
      return fallback.map((key) => map.get(key));
    }

    return order.sort(compareSectionKeys).map((key) => map.get(key));
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function termKey(term) {
    return `${term.sec}::${term.cat}::${normalize(term.p)}`;
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function stripCode(label) {
    return String(label || "").replace(/^[A-Z]\d+\s+[—-]\s+/, "").trim();
  }

  function categoryMetaFromTerm(term) {
    return CATEGORY_META.get(term.cat) || null;
  }

  function displayCategory(categoryDisplay) {
    const meta = CATEGORY_META.get(categoryDisplay);
    return meta?.label || stripCode(categoryDisplay);
  }

  function sectionLabel(sectionKey) {
    if (sectionKey === ALL_SECTIONS_KEY) return "All";
    return SECTION_META.find((section) => section.key === sectionKey)?.label || titleCase(sectionKey);
  }

  function sectionSortIndex(sectionKey) {
    const idx = SECTION_ORDER.indexOf(String(sectionKey || ""));
    return idx === -1 ? 999 : idx;
  }

  function compareSectionKeys(a, b) {
    const diff = sectionSortIndex(a) - sectionSortIndex(b);
    if (diff) return diff;
    return String(a || "").localeCompare(String(b || ""));
  }

  function sectionDescription(sectionKey) {
    return SECTION_DESCRIPTIONS[String(sectionKey || "")] || "";
  }

  function sectionHotkey(index) {
    return SECTION_HOTKEYS[index] || "";
  }

  function sectionIndexByHotkey(key) {
    const idx = SECTION_HOTKEYS.indexOf(String(key || "").toLowerCase());
    return idx;
  }

  function activeCategoryRoute(term) {
    if (!term) return null;
    if (term.sec === "instruments") return "instruments";
    if (term.sec === "vibe") return "vibes";
    const label = normalize(displayCategory(term.cat));
    const sec = String(term.sec || "");
    if (sec === "feel") return "vibes";
    if (sec === "sound" && label.includes("texture")) return "vibes";
    if (label.includes("emotion") || label.includes("texture") || label.includes("dynamic") || label.includes("energy")) return "vibes";
    return null;
  }

  function activeSearchScopeLabel() {
    return state.searchScope === "category" ? "cat" : "all";
  }

  function currentSectionEntries(sectionKey = state.selectedSection || state.hotkeySectionKey) {
    if (!sectionKey || sectionKey === ALL_SECTIONS_KEY) return [];
    return categorySummaries(sectionKey);
  }

  function shouldUseScopedSearch(term) {
    return state.searchScope === "category" && !!state.selectedSection && state.selectedSection !== ALL_SECTIONS_KEY && term.sec !== state.selectedSection;
  }

  function familyKey(term) {
    return String(term?.baseShortcut || term?.s || normalize(term?.p || ""));
  }

  function familyMembers(term) {
    return TERM_FAMILY_MEMBERS.get(familyKey(term)) || (term ? [term] : []);
  }

  function primaryFamilyTerm(items) {
    const ordered = sortTerms(items || []);
    return ordered.find((item) => !item?.suffix) || ordered[0] || null;
  }

  function groupedTerms(items) {
    const groups = [];
    const seen = new Map();
    sortTerms(items || []).forEach((term) => {
      const key = familyKey(term);
      if (!seen.has(key)) {
        const group = { key, all: [] };
        seen.set(key, group);
        groups.push(group);
      }
      seen.get(key).all.push(term);
    });

    return groups.map((group) => {
      const ordered = sortTerms(group.all);
      const primary = primaryFamilyTerm(ordered);
      return {
        key: group.key,
        primary,
        variants: ordered.filter((item) => item !== primary),
        all: ordered
      };
    });
  }

  function termSearchHaystack(term) {
    const meta = categoryMetaFromTerm(term);
    return [
      term.p,
      term.s,
      meta?.label,
      meta?.sectionLabel
    ].map(normalize).join(" ");
  }

  function searchInputSnapshot() {
    const active = shadow?.activeElement;
    const searchInput = active?.id === "bp-compact-search"
      ? shadow?.getElementById("bp-compact-search")
      : shadow?.getElementById("bp-search");
    if (!searchInput || active !== searchInput) return null;
    return {
      id: searchInput.id,
      focused: true,
      start: Number.isFinite(searchInput.selectionStart) ? searchInput.selectionStart : null,
      end: Number.isFinite(searchInput.selectionEnd) ? searchInput.selectionEnd : null
    };
  }

  function restoreSearchInput(snapshot) {
    if (!snapshot?.focused || !snapshot?.id) return;
    const searchInput = shadow?.getElementById(snapshot.id);
    if (!searchInput) return;
    searchInput.focus({ preventScroll: true });
    if (Number.isFinite(snapshot.start) && Number.isFinite(snapshot.end) && typeof searchInput.setSelectionRange === "function") {
      searchInput.setSelectionRange(snapshot.start, snapshot.end);
    }
  }

  const QS_INPUT_IDS = new Set([
    "bp-qs-input-connect",
    "bp-qs-input-phrases",
    "bp-qs-input-terms",
    "bp-temp-term-input"
  ]);

  function qsInputSnapshot() {
    const active = shadow?.activeElement;
    if (!active || !QS_INPUT_IDS.has(active.id)) return null;
    return {
      id: active.id,
      start: Number.isFinite(active.selectionStart) ? active.selectionStart : null,
      end:   Number.isFinite(active.selectionEnd)   ? active.selectionEnd   : null
    };
  }

  function restoreQsInput(snapshot) {
    if (!snapshot?.id) return;
    const el = shadow?.getElementById(snapshot.id);
    if (!el) return;
    el.focus({ preventScroll: true });
    if (Number.isFinite(snapshot.start) && Number.isFinite(snapshot.end) && typeof el.setSelectionRange === "function") {
      el.setSelectionRange(snapshot.start, snapshot.end);
    }
  }


  function composerInputSnapshot(options = {}) {
    const active = shadow?.activeElement;
    const el = active?.id === "bp-compact-compose"
      ? shadow?.getElementById("bp-compact-compose")
      : shadow?.getElementById("bp-composer-text");
    if (!el || active !== el) {
      if (!options.consumeQueued) return null;
      if (_queuedComposerRestoreSnapshot && Date.now() <= _queuedComposerRestoreUntil) {
        const snapshot = _queuedComposerRestoreSnapshot;
        _queuedComposerRestoreSnapshot = null;
        _queuedComposerRestoreUntil = 0;
        return snapshot;
      }
      _queuedComposerRestoreSnapshot = null;
      _queuedComposerRestoreUntil = 0;
      return null;
    }
    const value = String(el.value || "");
    const start = Number.isFinite(el.selectionStart) ? el.selectionStart : value.length;
    const end = Number.isFinite(el.selectionEnd) ? el.selectionEnd : start;
    return {
      id: el.id,
      focused: true,
      startFromEnd: Math.max(0, value.length - start),
      endFromEnd: Math.max(0, value.length - end)
    };
  }

  function queueComposerRestoreSnapshot(snapshot = composerInputSnapshot()) {
    if (!snapshot?.focused || !snapshot?.id) return false;
    _queuedComposerRestoreSnapshot = snapshot;
    _queuedComposerRestoreUntil = Date.now() + 800;
    return true;
  }

  function restoreComposerInput(snapshot, options = {}) {
    if (!snapshot?.focused || !snapshot?.id) return;
    const el = shadow?.getElementById(snapshot.id);
    if (!el) return;
    const toEnd = options.toEnd !== false;
    const value = String(el.value || "");
    el.focus({ preventScroll: true });
    if (typeof el.setSelectionRange !== "function") return;
    if (toEnd) {
      el.setSelectionRange(value.length, value.length);
      return;
    }
    const start = clamp(value.length - (snapshot.startFromEnd || 0), 0, value.length);
    const end = clamp(value.length - (snapshot.endFromEnd || 0), 0, value.length);
    el.setSelectionRange(start, end);
  }

  function focusComposerAfterArming(snapshot = null, options = {}) {
    if (!state.appActive || !state.sessionOpen) return false;
    const el = shadow?.getElementById("bp-composer-text");
    if (!el) return false;
    const keepSelection = options.keepSelection !== false;
    if (snapshot?.focused) {
      restoreComposerInput(snapshot, { toEnd: keepSelection ? false : true });
    } else {
      el.focus({ preventScroll: true });
      if (typeof el.setSelectionRange === "function") {
        const value = String(el.value || "");
        el.setSelectionRange(value.length, value.length);
      }
    }
    state.composerFocused = true;
    return true;
  }

  function captureArmedFieldSelectionFromPointer(field, event) {
    if (!field || !event) return snapshotArmedFieldSelection(field);
    if (field.isContentEditable || field.getAttribute?.("contenteditable") === "true" || field.getAttribute?.("role") === "textbox") {
      const rangeFromPoint = document.caretRangeFromPoint?.(event.clientX, event.clientY);
      const posFromPoint = document.caretPositionFromPoint?.(event.clientX, event.clientY);
      let range = null;
      if (rangeFromPoint && field.contains(rangeFromPoint.startContainer)) {
        range = rangeFromPoint.cloneRange();
      } else if (posFromPoint && field.contains(posFromPoint.offsetNode)) {
        range = document.createRange();
        range.setStart(posFromPoint.offsetNode, posFromPoint.offset);
        range.collapse(true);
      }
      if (range) {
        const snapshot = { kind: "range", range };
        setStoredArmedFieldSelection(snapshot);
        return snapshot;
      }
    }
    return snapshotArmedFieldSelection(field);
  }

  function isEditableNode(node) {
    return !!node && (
      node.tagName === "INPUT" ||
      node.tagName === "TEXTAREA" ||
      node.isContentEditable ||
      node.getAttribute?.("contenteditable") === "true" ||
      node.getAttribute?.("role") === "textbox"
    );
  }

  function isMyuiShadowNode(node) {
    return !!node && node.getRootNode?.() === shadow;
  }

  function resolveEditableField(node) {
    let el = node;
    while (el && el !== document.documentElement && el !== document.body) {
      if (host?.contains(el) || isMyuiShadowNode(el)) return null;
      if (isEditableNode(el)) return el;
      el = el.parentElement || el.parentNode;
    }
    return isEditableNode(el) && !host?.contains(el) && !isMyuiShadowNode(el) ? el : null;
  }


  function clearArmedField(field = null) {
    const activeField = getStoredArmedField();
    if (!field || activeField === field) setStoredArmedField(null);
    clearStoredArmedFieldSelection();
  }

  function armWriteField(field, options = {}) {
    if (!field) return false;
    const changed = getStoredArmedField() !== field;
    setStoredArmedField(field);
    if (options.captureNow) snapshotArmedFieldSelection(field);
    return changed;
  }

  function snapshotArmedFieldSelection(field = currentWriteField()) {
    if (!field) {
      clearStoredArmedFieldSelection();
      return null;
    }
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      const value = String(field.value || "");
      const start = Number.isFinite(field.selectionStart) ? field.selectionStart : value.length;
      const end = Number.isFinite(field.selectionEnd) ? field.selectionEnd : start;
      const snapshot = { kind: "text", start, end };
      setStoredArmedFieldSelection(snapshot);
      return snapshot;
    }
    if (field.isContentEditable || field.getAttribute?.("contenteditable") === "true" || field.getAttribute?.("role") === "textbox") {
      const selection = window.getSelection?.();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        if (field.contains(range.startContainer) && field.contains(range.endContainer)) {
          const snapshot = { kind: "range", range: range.cloneRange() };
          setStoredArmedFieldSelection(snapshot);
          return snapshot;
        }
      }
      const snapshot = { kind: "range", range: null };
      setStoredArmedFieldSelection(snapshot);
      return snapshot;
    }
    clearStoredArmedFieldSelection();
    return null;
  }

  function restoreArmedFieldSelection(field = currentWriteField()) {
    if (!field) return false;
    field.focus?.({ preventScroll: true });
    const snapshot = getStoredArmedFieldSelection();
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      const value = String(field.value || "");
      const start = clamp(Number.isFinite(snapshot?.start) ? snapshot.start : value.length, 0, value.length);
      const end = clamp(Number.isFinite(snapshot?.end) ? snapshot.end : start, 0, value.length);
      if (typeof field.setSelectionRange === "function") field.setSelectionRange(start, end);
      return true;
    }
    if (field.isContentEditable || field.getAttribute?.("contenteditable") === "true" || field.getAttribute?.("role") === "textbox") {
      const selection = window.getSelection?.();
      const range = snapshot?.kind === "range" ? snapshot.range : null;
      if (selection && range && document.contains(range.startContainer) && document.contains(range.endContainer)
          && field.contains(range.startContainer) && field.contains(range.endContainer)) {
        selection.removeAllRanges();
        selection.addRange(range.cloneRange());
        return true;
      }
      if (selection) {
        const fallback = document.createRange();
        fallback.selectNodeContents(field);
        fallback.collapse(false);
        selection.removeAllRanges();
        selection.addRange(fallback);
        setStoredArmedFieldSelection({ kind: "range", range: fallback.cloneRange() });
        return true;
      }
    }
    return false;
  }

  function activeInsertText(term, route) {
    if (!term) return "";
    const base = term?.baseShortcut ? TERM_BY_SHORTCUT.get(term.baseShortcut) : null;
    if (route === "vibes" && term?.suffix === "ly" && base?.p) return base.p;
    return term.p;
  }

  function resolveWriteVariantTerm(term, event) {
    if (!term) return term;
    const orderedFamily = sortTerms(familyMembers(term));
    if (!orderedFamily.length) return term;
    const current = orderedFamily.find((item) => termKey(item) === termKey(term)) || term;
    if (event?.metaKey) {
      return orderedFamily.find((item) => String(item?.suffix || "") === "s") || current;
    }
    if (event?.altKey) {
      if (String(current?.suffix || "") === "y") {
        return orderedFamily.find((item) => String(item?.suffix || "") === "ly") || current;
      }
      return orderedFamily.find((item) => String(item?.suffix || "") === "y")
        || orderedFamily.find((item) => String(item?.suffix || "") === "ly")
        || current;
    }
    return current;
  }

  function addTermToSession(term) {
    if (!term) return;
    const key = termKey(term);
    const now = Date.now();
    const next = state.sessionItems.filter((item) => item.key !== key);
    const existing = state.sessionItems.find((item) => item.key === key);
    next.unshift({
      key,
      shortcut: String(term?.s || "").trim(),
      text: String(term?.p || "").trim(),
      count: (existing?.count || 0) + 1,
      updatedAt: now
    });
    state.sessionItems = next.slice(0, 80);
    state.sessionOpen = true;
  }

  function upsertToolStateTerm(sec, term) {
    if (!term) return false;
    const text = activeInsertText(term, sec);
    if (!text) return false;
    const list = getToolList(sec);
    const existing = list.findIndex((item) => toolItemText(item) === text);
    if (existing !== -1) {
      list[existing].display = String(term?.s || text).trim();
      list[existing].label = text;
      list[existing].active = true;
      state.selectedToolIndex = existing;
    } else {
      list.push({ text, display: String(term?.s || text).trim(), label: text, active: true });
      state.selectedToolIndex = list.length - 1;
    }
    state.selectedToolSec = sec;
    ensureToolTrayOpen(sec);
    return true;
  }

  function addTermToToolState(sec, term) {
    const updated = upsertToolStateTerm(sec, term);
    if (!updated) return false;
    addTermToSession(term);
    queuePrefsSave();
    return updated;
  }

  function sessionTermAt(index) {
    const item = state.sessionItems[index];
    if (!item) return null;
    return TERM_MAP.get(item.key) || null;
  }

  function termByKey(key) {
    return TERM_MAP.get(key) || null;
  }

  function writeSessionItem(index, event) {
    const item = state.sessionItems[index];
    if (!item) return false;

    const target = publishTarget();
    if (target === "inactive") {
      state.editorMessage = "No write target — open Compose or click a page field";
      render();
      return false;
    }

    // Resolve text — variant handling only matters for direct page writes
    const term = sessionTermAt(index);
    let raw = "";
    if (term) {
      const writeTarget = target === "page" ? resolveWriteVariantTerm(term, event) : term;
      raw = activeInsertText(writeTarget, activeCategoryRoute(writeTarget) || "");
    }
    if (!raw || !raw.trim()) raw = item.text;

    const ok = routeInsert(raw, "term");
    render();
    return ok;
  }

  function toolOpenProp(sec) {
    return sec === "instruments" ? "toolTrayInstruments" : "toolTrayVibes";
  }

  function toolExpandedProp(sec) {
    return sec === "instruments" ? "toolTrayExpandedInstruments" : "toolTrayExpandedVibes";
  }

  function toolButtonLabel(sec) {
    return sec === "instruments" ? "Ins Tag" : "Vib Tag";
  }

  function toolLabel(sec) {
    return sec === "instruments" ? "Instruments" : "Vibes";
  }

  function getToolList(sec) {
    return sec === "instruments" ? state.instrumentsList : state.vibeList;
  }

  function toolItemText(item) {
    return String(item?.text || "").trim();
  }

  function toolItemDisplay(item) {
    return String(item?.display || item?.shortcut || item?.text || "").trim();
  }

  function toolItemLabel(item) {
    return String(item?.label || item?.text || item?.display || "").trim();
  }

  function printableToolTexts(sec) {
    return getToolList(sec).filter((item) => item.active !== false).map((item) => toolItemText(item)).filter(Boolean);
  }

  function isToolTrayOpen(sec) {
    return !!state[toolOpenProp(sec)];
  }

  function isToolTrayExpanded(sec) {
    return !!state[toolExpandedProp(sec)];
  }

  function setToolTrayOpen(sec, open) {
    state[toolOpenProp(sec)] = !!open;
  }

  function setToolTrayExpanded(sec, expanded) {
    state[toolExpandedProp(sec)] = !!expanded;
  }

  function toggleToolTray(sec) {
    const nextOpen = !isToolTrayOpen(sec);
    setToolTrayOpen(sec, nextOpen);
    if (!nextOpen) setToolTrayExpanded(sec, false);
    state.selectedToolSec = sec;
    state.selectedToolIndex = -1;
  }

  function ensureToolTrayOpen(sec) {
    setToolTrayOpen(sec, true);
    state.selectedToolSec = sec;
  }

  function snapshotTools() {
    return {
      instrumentsList: state.instrumentsList.map((item) => ({ ...item })),
      vibeList: state.vibeList.map((item) => ({ ...item }))
    };
  }

  function restoreToolSnapshot(snapshot) {
    if (!snapshot) return;
    state.instrumentsList = (snapshot.instrumentsList || []).map((item) => ({ ...item }));
    state.vibeList = (snapshot.vibeList || []).map((item) => ({ ...item }));
    state.selectedToolIndex = -1;
  }

  function pushToolHistory() {
    toolUndoStack.push(snapshotTools());
    if (toolUndoStack.length > 80) toolUndoStack.shift();
    toolRedoStack = [];
  }

  function undoToolHistory() {
    if (!toolUndoStack.length) return false;
    toolRedoStack.push(snapshotTools());
    restoreToolSnapshot(toolUndoStack.pop());
    return true;
  }

  function redoToolHistory() {
    if (!toolRedoStack.length) return false;
    toolUndoStack.push(snapshotTools());
    restoreToolSnapshot(toolRedoStack.pop());
    return true;
  }

  function flashTermByKey(key) {
    setTimeout(() => {
      shadow.querySelectorAll(`.term-card[data-key="${cssEscape(key)}"], .variant-pill[data-variant-key="${cssEscape(key)}"]`).forEach((node) => {
        node.classList.add("added");
        setTimeout(() => node.classList.remove("added"), 520);
      });
    }, 0);
  }

  function handleTermActivation(term, key, hasDef, event) {
    const writeTarget = resolveWriteVariantTerm(term, event);
    const quickTagComposeOpen = !!(state.appActive && state.sessionOpen && !state.sessionMinimized);

    if (!quickTagComposeOpen) {
      const sourceEl = event?.target?.closest?.(".term-card, .variant-pill") || null;
      const keepHoverPreview = !!sourceEl?.matches?.(":hover");
      if (state.pinnedKey === key) {
        state.pinnedKey = "";
        if (!keepHoverPreview) state.previewKey = "";
      } else {
        state.pinnedKey = key;
        state.previewKey = key;
      }
      updateHelpHighlight();
      syncHoverTooltip();
      return;
    }

    // Sentence mode: composer only, never session
    if (state.fullSentenceMode && state.composerFocused) {
      const text = activeInsertText(writeTarget, "") || writeTarget?.p || "";
      if (text) {
        state.composerText = state.composerText
          ? state.composerText.trimEnd() + " " + text
          : text;
        state.composerFocused = false;
        flashTermByKey(key);
        savePrefs();
        render();
      }
      return;
    }

    // All other modes: always add to session
    addTermToSession(term);

    state.composerPendingPillMeta = { sec: term.sec || null, cat: term.cat || null };
    const published = routeInsert(activeInsertText(writeTarget, activeCategoryRoute(writeTarget) || ""), "term");
    if (!published) state.composerPendingPillMeta = null;
    const route = activeCategoryRoute(term);
    if (route) {
      ensureToolTrayOpen(route);
      addTermToTool(route, term);
    }
    if (published || route) flashTermByKey(key);
    savePrefs();
    render();
  }

  function termsForCategory(categoryDisplay) {
    return TERMS.filter((term) => term.cat === categoryDisplay);
  }

  function getDefinition(term) {
    if (!term) return "";
    const keys = [term?.p, term?.baseShortcut ? TERM_BY_SHORTCUT.get(term.baseShortcut)?.p : "", String(term?.p || "").replace(/ly$/i, "")];
    for (const key of keys) {
      const normalizedKey = normalize(key);
      if (!normalizedKey) continue;
      const direct = TERM_DEFS[key];
      if (typeof direct === "string" && direct.trim()) return direct.trim();
      const normalized = TERM_DEF_LOOKUP.get(normalizedKey);
      if (normalized) return normalized;
    }
    return "";
  }

  function getHelpText(term) {
    const definition = getDefinition(term);
    if (definition) return definition;
    const note = String(term?.notes || "").trim();
    if (note && normalize(note) !== normalize(term?.p || "")) return note;
    return "";
  }

  function sectionCount(sectionKey) {
    if (sectionKey === ALL_SECTIONS_KEY) return TERMS.length;
    return TERMS.filter((term) => term.sec === sectionKey).length;
  }

  function topSections() {
    return SECTION_META.filter((section) => TERMS.some((term) => term.sec === section.key));
  }

  function categoriesForSection(sectionKey) {
    const configured = SECTION_META.find((section) => section.key === sectionKey)?.categories || [];
    if (configured.length) return configured;
    const observed = [...new Set(TERMS.filter((term) => term.sec === sectionKey).map((term) => term.cat))];
    return observed.map((display) => ({
      display,
      label: displayCategory(display),
      sectionKey,
      sectionLabel: sectionLabel(sectionKey),
      terms: termsForCategory(display)
    }));
  }

  function intensityFor(term) {
    const text = `${normalize(term.p)} ${normalize(getHelpText(term))}`;
    let score = 0.52;
    const high = [/aggressive|anthemic|cathartic|dramatic|explosive|euphoric|feral|frenzied|hard|intense|joyous|menacing|militant|obsessive|paranoid|triumphant|volatile|weight/, /dance-ready|locked-in|pulsing|rolling|swinging/];
    const low = [/bittersweet|brooding|dreamy|ethereal|floating|fragile|gentle|ghostly|glassy|haunted|immersive|mournful|smooth|soft|soothing|spacious|sweet|tender|vulnerable|warm|wistful/];
    const medium = [/bouncy|cinematic|eerie|hopeful|hypnotic|longing|melancholic|mystical|radiant|restless|sentimental|shimmer|swaying|uneasy|yearning/];
    for (const pattern of high) if (pattern.test(text)) score += 0.24;
    for (const pattern of medium) if (pattern.test(text)) score += 0.1;
    for (const pattern of low) if (pattern.test(text)) score -= 0.18;
    const label = displayCategory(term.cat);
    if (/Dynamics|Energy|Drums|Percussion/.test(label)) score += 0.12;
    if (/Atmospheric|Light|Warm|Connectives/.test(label)) score -= 0.06;
    return clamp(score, 0.16, 0.94);
  }

  function paletteForCategory(categoryDisplay) {
    const palette = CATEGORY_META.get(categoryDisplay)?.palette || { h: 214, s: 18 };
    return palette;
  }

  function paletteForSection(sectionKey) {
    const palettes = {
      connect: { h: 212, s: 26 },
      feel: { h: 332, s: 28 },
      sound: { h: 196, s: 24 },
      form: { h: 38, s: 30 },
      instruments: { h: 142, s: 24 },
      mix: { h: 272, s: 22 },
      [ALL_SECTIONS_KEY]: { h: 220, s: 14 }
    };
    return palettes[sectionKey] || palettes[ALL_SECTIONS_KEY];
  }

  function sectionChipVars(sectionKey, active = false) {
    const p = paletteForSection(sectionKey);
    if (state.themeMode === "dark") {
      return active
        ? `--cat-chip-bg:hsl(${p.h} ${clamp(p.s + 6, 12, 46)}% 34%);--cat-chip-border:hsl(${p.h} ${clamp(p.s + 4, 12, 46)}% 46%);--cat-chip-text:#f7f8fb;--cat-chip-badge:hsl(${p.h} ${clamp(p.s + 4, 12, 46)}% 24%);`
        : `--cat-chip-bg:hsl(${p.h} ${clamp(p.s - 2, 8, 34)}% 15%);--cat-chip-border:hsl(${p.h} ${clamp(p.s + 2, 8, 40)}% 27%);--cat-chip-text:#ecf1fa;--cat-chip-badge:hsl(${p.h} ${clamp(p.s + 2, 8, 40)}% 22%);`;
    }
    return active
      ? `--cat-chip-bg:hsl(${p.h} ${clamp(p.s + 8, 12, 50)}% 84%);--cat-chip-border:hsl(${p.h} ${clamp(p.s + 8, 12, 50)}% 68%);--cat-chip-text:#17202b;--cat-chip-badge:hsl(${p.h} ${clamp(p.s + 8, 12, 50)}% 74%);`
      : `--cat-chip-bg:hsl(${p.h} ${clamp(p.s + 4, 10, 44)}% 94%);--cat-chip-border:hsl(${p.h} ${clamp(p.s + 6, 10, 48)}% 82%);--cat-chip-text:#203042;--cat-chip-badge:hsl(${p.h} ${clamp(p.s + 6, 10, 48)}% 88%);`;
  }

  function categoryChipVars(categoryDisplay, active = false) {
    const p = paletteForCategory(categoryDisplay);
    if (state.themeMode === "dark") {
      return active
        ? `--chip-soft-bg:hsl(${p.h} ${clamp(p.s + 6, 10, 42)}% 34%);--chip-border:hsl(${p.h} ${clamp(p.s + 6, 10, 42)}% 46%);--chip-soft-text:#f7f8fb;--chip-badge-bg:hsl(${p.h} ${clamp(p.s + 6, 10, 42)}% 24%);--chip-badge-text:#eef3ff;`
        : `--chip-soft-bg:hsl(${p.h} ${clamp(p.s - 2, 8, 30)}% 16%);--chip-border:hsl(${p.h} ${clamp(p.s + 3, 8, 36)}% 28%);--chip-soft-text:#eef2ff;--chip-badge-bg:hsl(${p.h} ${clamp(p.s + 2, 8, 36)}% 22%);--chip-badge-text:#eef3ff;`;
    }
    return active
      ? `--chip-soft-bg:hsl(${p.h} ${clamp(p.s + 10, 12, 52)}% 84%);--chip-border:hsl(${p.h} ${clamp(p.s + 10, 12, 52)}% 68%);--chip-soft-text:#17202b;--chip-badge-bg:hsl(${p.h} ${clamp(p.s + 10, 12, 52)}% 74%);--chip-badge-text:#17202b;`
      : `--chip-soft-bg:hsl(${p.h} ${clamp(p.s + 4, 10, 46)}% 95%);--chip-border:hsl(${p.h} ${clamp(p.s + 6, 10, 50)}% 82%);--chip-soft-text:#203042;--chip-badge-bg:hsl(${p.h} ${clamp(p.s + 6, 10, 50)}% 89%);--chip-badge-text:#203042;`;
  }

  function cardVars(term) {
    const palette = paletteForCategory(term.cat);
    const intensity = intensityFor(term);
    const sat = clamp((palette.s || 18) + intensity * 10, 10, 80);

    if (state.themeMode === "dark") {
      const bgL = clamp(12 + intensity * 7, 12, 20);
      const borderL = clamp(22 + intensity * 10, 20, 34);
      const chipL = clamp(30 + intensity * 10, 28, 44);
      return [
        `--card-bg:hsl(${palette.h} ${clamp(sat - 8, 10, 52)}% ${bgL}%)`,
        `--card-border:hsl(${palette.h} ${clamp(sat - 2, 10, 60)}% ${borderL}%)`,
        `--card-text:#f7f8fb`,
        `--card-muted:rgba(245,247,251,0.72)`,
        `--shortcut-bg:hsl(${palette.h} ${clamp(sat, 12, 64)}% ${chipL}%)`,
        `--shortcut-text:#f7f8fb`
      ].join(";");
    }

    const bgL = clamp(97 - intensity * 10, 84, 96);
    const borderL = clamp(80 - intensity * 15, 52, 82);
    const chipL = clamp(25 - intensity * 6, 16, 28);
    return [
      `--card-bg:hsl(${palette.h} ${sat}% ${bgL}%)`,
      `--card-border:hsl(${palette.h} ${clamp(sat + 4, 12, 86)}% ${borderL}%)`,
      `--card-text:#17202b`,
      `--card-muted:rgba(23,32,43,0.68)`,
      `--shortcut-bg:hsl(${palette.h} ${clamp(sat + 10, 16, 88)}% ${chipL}%)`,
      `--shortcut-text:#ffffff`
    ].join(";");
  }

  function matchesQuery(term) {
    const query = normalize(state.query);
    if (!query) return true;
    if (shouldUseScopedSearch(term)) return false;
    return termSearchHaystack(term).includes(query);
  }

  function visibleTermsInScope() {
    let pool = TERMS;
    if (state.selectedSection && state.selectedSection !== ALL_SECTIONS_KEY) {
      pool = pool.filter((term) => term.sec === state.selectedSection);
    }
    return pool.filter(matchesQuery);
  }

  function compactProductionishTerm(term) {
    if (!term) return false;
    if (term.sec === "production" || term.sec === "mix") return true;
    const haystack = normalize([
      term.sec,
      term.sectionLabel,
      term.cat,
      term.flowBucket,
      term.functionBucket,
      term.notes
    ].filter(Boolean).join(" "));
    return /production|record|recording|mix|master|mastering|effect|effects|fx|reverb|delay|compress|compression|eq|stereo|spatial|processing/.test(haystack);
  }

  function compactGroupMatches(groupKey, term) {
    if (!term) return false;
    if (groupKey === "instruments") return term.sec === "instruments";
    if (groupKey === "feel") return term.sec === "vibe";
    if (groupKey === "texture") return (term.sec === "texture" || term.sec === "sound") && !compactProductionishTerm(term);
    if (groupKey === "arrangement") return term.sec === "arrangement" || term.sec === "form" || term.functionBucket === "Arrangement";
    if (groupKey === "production") return compactProductionishTerm(term);
    return false;
  }

  function duplicateCompactShortcuts(rows) {
    const counts = new Map();
    (rows || []).forEach((row) => {
      const shortcut = String(row?.shortcut || "").trim();
      if (!shortcut) return;
      counts.set(shortcut, (counts.get(shortcut) || 0) + 1);
    });
    return Array.from(counts.entries()).filter(([, count]) => count > 1).map(([shortcut]) => shortcut);
  }

  function compactTermSearchScore(term, query) {
    if (!query) return 99;
    const shortcut = normalize(term?.s);
    const text = normalize(term?.p);
    if (shortcut === query) return 0;
    if (text === query) return 1;
    if (shortcut.startsWith(query)) return 2;
    if (text.startsWith(query)) return 3;
    if (shortcut.includes(query)) return 4;
    if (text.includes(query)) return 5;
    return 99;
  }

  function compactVisibleGroups() {
    const query = normalize(state.compactQuery);
    const pool = COMPACT_TERMS.length ? COMPACT_TERMS : TERMS;
    return COMPACT_GROUPS.map((group) => {
      let terms = pool.filter((term) => compactGroupMatches(group.key, term));
      if (query) {
        terms = terms.filter((term) => {
          const text = normalize(term?.p);
          const shortcut = normalize(term?.s);
          return text.includes(query) || shortcut.includes(query);
        });
      }
      const seen = new Set();
      terms = terms
        .slice()
        .sort((a, b) => {
          const scoreDiff = compactTermSearchScore(a, query) - compactTermSearchScore(b, query);
          if (scoreDiff) return scoreDiff;
          const shortcutDiff = String(a?.s || "").localeCompare(String(b?.s || ""));
          if (shortcutDiff) return shortcutDiff;
          return String(a?.p || "").localeCompare(String(b?.p || ""));
        })
        .filter((term) => {
          const key = termKey(term);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      const categoryMap = new Map();
      terms.forEach((term) => {
        const label = term?.cat || group.label;
        if (!categoryMap.has(label)) categoryMap.set(label, []);
        categoryMap.get(label).push(term);
      });

      return {
        key: group.key,
        label: group.label,
        count: terms.length,
        categories: Array.from(categoryMap.entries()).map(([label, groupTerms]) => ({
          label,
          terms: groupTerms
        }))
      };
    });
  }

  function categorySummaries(sectionKey) {
    return categoriesForSection(sectionKey)
      .map((category) => {
        const allTerms = termsForCategory(category.display).filter((term) => term.sec === sectionKey);
        const visibleTerms = allTerms.filter(matchesQuery);
        return {
          key: category.display,
          label: category.label || displayCategory(category.display),
          display: category.display,
          sectionKey,
          totalCount: allTerms.length,
          visibleCount: visibleTerms.length,
          terms: sortTerms(visibleTerms)
        };
      })
      .filter((entry) => !state.query || entry.visibleCount > 0);
  }

  function categorySearchHaystack(category) {
    return [
      category?.label,
      category?.display,
      category?.sectionLabel,
      category?.sectionKey,
      category?.flowBucket,
      category?.functionBucket,
      category?.code
    ].map(normalize).join(" ");
  }

  function searchOnlyBlocks() {
    const query = normalize(state.query);
    const scopedSection = state.searchScope === "category" && state.selectedSection && state.selectedSection !== ALL_SECTIONS_KEY
      ? state.selectedSection
      : "";

    return CATEGORY_CONFIG
      .filter((category) => !scopedSection || category.sectionKey === scopedSection)
      .map((category) => {
        const allTerms = sortTerms(termsForCategory(category.display).filter((term) => !scopedSection || term.sec === scopedSection));
        const matchedTerms = query ? allTerms.filter(matchesQuery) : allTerms;
        const directCategoryMatch = state.searchScope === "category" && query ? categorySearchHaystack(category).includes(query) : false;
        const terms = matchedTerms;
        return {
          display: category.display,
          label: category.label || displayCategory(category.display),
          sectionKey: category.sectionKey,
          sectionLabel: category.sectionLabel || sectionLabel(category.sectionKey),
          categoryMatch: directCategoryMatch,
          totalCount: allTerms.length,
          visibleCount: terms.length,
          terms
        };
      })
      .filter((entry) => {
        if (state.searchCategoryFilter && entry.display !== state.searchCategoryFilter) return false;
        if (!query) return entry.visibleCount > 0;
        if (state.searchScope === "all") return entry.visibleCount > 0;
        return entry.categoryMatch || entry.visibleCount > 0;
      })
      .sort((a, b) => {
        if (state.searchScope === "category") {
          const matchDiff = Number(b.categoryMatch) - Number(a.categoryMatch);
          if (matchDiff) return matchDiff;
        }
        const secDiff = compareSectionKeys(a.sectionKey, b.sectionKey);
        if (secDiff) return secDiff;
        const orderDiff = (Number(CATEGORY_META.get(a.display)?.sortCode || 0) - Number(CATEGORY_META.get(b.display)?.sortCode || 0));
        if (orderDiff) return orderDiff;
        return String(a.label).localeCompare(String(b.label));
      });
  }

  function suffixRank(value) {
    switch (String(value || "")) {
      case "": return 0;
      case "s": return 1;
      case "d": return 2;
      case "g": return 3;
      case "y": return 4;
      case "ly": return 5;
      default: return 9;
    }
  }

  function datasetAnchor(term) {
    const base = term?.baseShortcut ? TERM_BY_SHORTCUT.get(term.baseShortcut) : null;
    return Number.isFinite(base?.ord) ? base.ord : (Number.isFinite(term?.ord) ? term.ord : 9999);
  }

  function sortTerms(items) {
    const arr = items.slice();
    if (state.orderMode === "alpha-term") {
      arr.sort((a, b) => String(a.p).localeCompare(String(b.p)));
    } else if (state.orderMode === "alpha-shortcut") {
      arr.sort((a, b) => String(a.s).localeCompare(String(b.s)));
    } else {
      arr.sort((a, b) => {
        const anchorDiff = datasetAnchor(a) - datasetAnchor(b);
        if (anchorDiff) return anchorDiff;
        const suffixDiff = suffixRank(a?.suffix) - suffixRank(b?.suffix);
        if (suffixDiff) return suffixDiff;
        const ordDiff = (Number(a?.ord || 0) - Number(b?.ord || 0));
        if (ordDiff) return ordDiff;
        return String(a.s).localeCompare(String(b.s));
      });
    }
    return arr;
  }

  function visibleHelpTerms() {
    const dedupe = (terms) => {
      const seen = new Set();
      return sortTerms(terms)
        .filter((term) => getHelpText(term))
        .filter((term) => {
          const key = termKey(term);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    };
    const scoped = dedupe(visibleTermsInScope());
    return scoped.length ? scoped : dedupe(TERMS);
  }

  function currentWriteField() {
    const field = getStoredArmedField();
    if (!field) return null;
    if (!document.contains(field)) {
      clearArmedField(field);
      return null;
    }
    if (host?.contains(field) || isMyuiShadowNode(field)) {
      clearArmedField(field);
      return null;
    }
    if (!isEditableNode(field)) {
      clearArmedField(field);
      return null;
    }
    return field;
  }

  function currentWriteState() {
    return !!currentWriteField();
  }

  // ── Unified publish target ────────────────────────────────────────────────
  // Returns: "page" | "compose-proxy" | "compose-local" | "inactive"
  function publishTarget() {
    const composeActive = !!(state.appActive && state.sessionOpen);
    if (composeActive) return "compose-local";
    return "inactive";
  }

  // Routes resolved text to the correct destination.
  // Returns true on success, false on inactive (also sets editorMessage).
  // Callers are responsible for calling render() after.
  function routeInsert(text, type) {
    const clean = String(text || "").trim();
    if (!clean) return false;
    const target = publishTarget();
    if (target === "compose-local") {
      if (isCompactQuickTagMode()) {
        appendCompactComposeText(clean);
        return true;
      }
      if (!state.writeMode) {
        state.editorMessage = "Live off — Quick-Tag Compose publish paused";
        return false;
      }
      insertAtComposerCursor(clean + " ", type || "term");
      return true;
    }
    state.editorMessage = "Open Quick-Tag to publish into Compose";
    return false;
  }

  function smartInsertTermText(baseText) {
    const text = String(baseText || '').trim();
    if (!text) return '';
    const field = currentWriteField();
    if (!field) return `${text} `;
    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      const value = String(field.value || '');
      const start = Number.isFinite(field.selectionStart) ? field.selectionStart : value.length;
      const end = Number.isFinite(field.selectionEnd) ? field.selectionEnd : start;
      const before = start > 0 ? value[start - 1] : '';
      const after = end < value.length ? value[end] : '';
      const needsLeadingSpace = !!before && !/[\s([\[{\-–—/,;:]$/.test(before);
      const needsTrailingSpace = !after || !/^\s/.test(after);
      return `${needsLeadingSpace ? ' ' : ''}${text}${needsTrailingSpace ? ' ' : ''}`;
    }
    return `${text} `;
  }

  function insertTermIntoFocusedField(term) {
    const text = smartInsertTermText(activeInsertText(term, activeCategoryRoute(term) || ''));
    if (!text.trim()) return false;
    if (!currentWriteField()) {
      state.editorMessage = 'Select a page field first';
      render();
      return false;
    }
    insertIntoField(text, false);
    state.editorMessage = `Wrote ${activeInsertText(term, activeCategoryRoute(term) || '')}`;
    render();
    return true;
  }

  function insertIntoField(text, pressEnter) {
    const field = currentWriteField();
    if (!field) return false;
    restoreArmedFieldSelection(field);

    let inserted = false;
    try {
      inserted = document.execCommand("insertText", false, text);
    } catch (_) {
      inserted = false;
    }

    if (!inserted) {
      if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
        const value = String(field.value || "");
        const start = Number.isFinite(field.selectionStart) ? field.selectionStart : value.length;
        const end = Number.isFinite(field.selectionEnd) ? field.selectionEnd : start;
        field.value = value.slice(0, start) + text + value.slice(end);
        if (typeof field.setSelectionRange === "function") field.setSelectionRange(start + text.length, start + text.length);
      } else if (field.isContentEditable || field.getAttribute("contenteditable") === "true" || field.getAttribute?.("role") === "textbox") {
        const selection = window.getSelection?.();
        let range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        if (!range || !field.contains(range.startContainer) || !field.contains(range.endContainer)) {
          range = document.createRange();
          range.selectNodeContents(field);
          range.collapse(false);
        }
        range.deleteContents();
        const node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }

    snapshotArmedFieldSelection(field);

    if (pressEnter) {
      setTimeout(() => {
        const opts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
        field.dispatchEvent(new KeyboardEvent("keydown", opts));
        field.dispatchEvent(new KeyboardEvent("keypress", opts));
        field.dispatchEvent(new KeyboardEvent("keyup", opts));
        snapshotArmedFieldSelection(field);
      }, 20);
    }
    return true;
  }

  function insertChips(items) {
    if (!items?.length || !currentWriteField()) return false;
    let index = 0;
    const insertNext = () => {
      if (index >= items.length) return;
      insertIntoField(items[index], true);
      index += 1;
      setTimeout(insertNext, 90);
    };
    insertNext();
    return true;
  }


  function commitSearch(scope) {
    state.searchScope = scope === "category" ? "category" : "all";
    state.query = String(state.queryInput || "").trim();
    if (state.searchScope === "category") {
      state.searchCatsVisible = true;
    } else {
      state.searchCatsVisible = false;
      state.searchCategoryFilter = "";
    }
    savePrefs();
    render();
  }

  function syncLiveSearch(nextValue) {
    state.queryInput = String(nextValue || "");
    state.query = state.queryInput.trim();
    if (state.searchScope === "category") {
      state.searchCatsVisible = !!state.query || state.searchCatsVisible;
      if (state.searchCategoryFilter) {
        const blocks = searchOnlyBlocks();
        const stillVisible = blocks.some((entry) => entry.display === state.searchCategoryFilter && entry.visibleCount > 0);
        if (!stillVisible) state.searchCategoryFilter = "";
      }
    } else if (!state.query) {
      state.searchCategoryFilter = "";
    }
    queuePrefsSave(300);
    render();
  }

  function syncPageInset() {
    document.documentElement.style.paddingRight = "";
    document.documentElement.style.paddingLeft = "";
    document.documentElement.style.paddingBottom = "";
    if (document.body) {
      document.body.style.paddingRight = "";
      document.body.style.paddingLeft = "";
      document.body.style.paddingBottom = "";
    }
  }


  function isHorizontalDock() {
    return state.dock === "top" || state.dock === "bottom";
  }

  function isFloatDock() {
    return state.dock === "float";
  }

  function currentShellWidth() {
    const panel = state.visible ? state.panelWidth : 0;
    return (state.visible ? 18 + panel : 22);
  }

  function currentShellHeight() {
    if (state.visible) {
      if (isHorizontalDock()) {
        return 18 + state.panelHeight;
      }
      return Math.max(state.panelHeight, 360);
    }
    return 22;
  }

  function clampFloatPosition(x, y) {
    const margin = 12;
    const maxX = Math.max(margin, window.innerWidth - currentShellWidth() - margin);
    const maxY = Math.max(margin, window.innerHeight - currentShellHeight() - margin);
    return {
      x: clamp(Number.isFinite(x) ? x : state.floatX, margin, maxX),
      y: clamp(Number.isFinite(y) ? y : state.floatY, margin, maxY)
    };
  }

  function clampSessionPosition(x, y, width = state.sessionWidth, height = state.sessionHeight) {
    const margin = 12;
    const safeWidth = clamp(width, SESSION_MIN_WIDTH, Math.min(window.innerWidth - margin * 2, SESSION_MAX_WIDTH));
    const safeHeight = clamp(height, SESSION_MIN_HEIGHT, Math.min(window.innerHeight - margin * 2, SESSION_MAX_HEIGHT));
    const maxX = Math.max(margin, window.innerWidth - safeWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - safeHeight - margin);
    return {
      x: clamp(Number.isFinite(x) ? x : state.sessionX, margin, maxX),
      y: clamp(Number.isFinite(y) ? y : state.sessionY, margin, maxY),
      width: safeWidth,
      height: safeHeight
    };
  }

  function snapDockFromPoint(x, y) {
    const edge = 96;
    if (y <= edge) return "top";
    if (y >= window.innerHeight - edge) return "bottom";
    if (x <= edge) return "left";
    if (x >= window.innerWidth - edge) return "right";
    return "float";
  }

  function shellInlineStyle() {
    const pos = clampFloatPosition(state.floatX, state.floatY);
    state.floatX = pos.x;
    state.floatY = pos.y;
    const horizontalTrayOpen = isHorizontalDock() && ["instruments", "vibes"].some((sec) => isToolTrayOpen(sec));
    const drawerWidth = horizontalTrayOpen ? TOOL_TRAY_WIDTH : 0;
    return `--panel-width:${state.panelWidth}px;--panel-height:${state.panelHeight}px;--cols:${state.layoutCols};--drawer-width:${drawerWidth}px;--drawer-open:0px;--float-x:${state.floatX}px;--float-y:${state.floatY}px;--ui-scale:${state.uiScale};--panel-opacity:${state.panelOpacity};`;
  }

  function activateSectionHotkey(sectionKey) {
    if (!sectionKey) return;
    state.visible = true;
    if (state.hotkeySectionKey === sectionKey) return;
    state.hotkeyPrevSectionKey = state.selectedSection || "";
    state.hotkeyPinnedSectionKey = state.selectedSection === sectionKey ? sectionKey : "";
    state.selectedSection = sectionKey;
    state.hotkeySectionKey = sectionKey;
    state.hotkeyArmedAt = Date.now();
    state.previewKey = "";
    state.pinnedKey = "";
    render();
  }

  function releaseSectionHotkey(sectionKey) {
    if (!sectionKey || state.hotkeySectionKey !== sectionKey) return;
    state.visible = true;
    state.selectedSection = state.hotkeyPinnedSectionKey === sectionKey
      ? sectionKey
      : (state.hotkeyPrevSectionKey || "");
    state.hotkeySectionKey = "";
    state.hotkeyPrevSectionKey = "";
    state.hotkeyPinnedSectionKey = "";
    state.hotkeyArmedAt = 0;
    render();
  }

  function toggleSectionByIndex(index) {
    const section = topSections()[index];
    if (!section) return;
    state.visible = true;
    if (state.selectedSection === section.key) {
      state.selectedSection = "";
      state.expandedCats.clear();
      state.hotkeySectionKey = "";
      state.hotkeyPrevSectionKey = "";
      state.hotkeyPinnedSectionKey = "";
    } else {
      state.selectedSection = section.key;
      state.expandedCats.clear();
      state.hotkeySectionKey = section.key;
      state.hotkeyPrevSectionKey = "";
      state.hotkeyPinnedSectionKey = section.key;
    }
    state.hotkeyArmedAt = Date.now();
    state.previewKey = "";
    state.pinnedKey = "";
    render();
  }

  function toggleCategoryByIndex(sectionKey, index) {
    const entry = currentSectionEntries(sectionKey)[index];
    if (!entry) return;
    state.visible = true;
    if (state.selectedSection !== sectionKey && state.selectedSection !== ALL_SECTIONS_KEY) {
      state.selectedSection = sectionKey;
    }
    const isOpen = state.expandedCats.has(entry.display);
    if (isOpen) {
      state.expandedCats.delete(entry.display);
    } else {
      if (state.focusMode) state.expandedCats.clear();
      state.expandedCats.add(entry.display);
    }
    render();
  }

  function pluginHotkeyContext() {
    if (!host) return false;
    if (host.matches(":hover")) return true;
    if (host.contains(document.activeElement)) return true;
    if (state.sessionOpen && !state.sessionMinimized) {
      const sessionWin = shadow.getElementById("bp-session-window");
      if (sessionWin && sessionWin.matches(":hover")) return true;
    }
    return false;
  }

  function getHotkeyWindow(list, offset) {
    const start = Math.min(offset, Math.max(0, list.length - HOTKEY_WINDOW_SIZE));
    return list.slice(start, start + HOTKEY_WINDOW_SIZE);
  }

  function quickHotkeySectionKey(section = state.quickLastActiveSection) {
    return section === "connect" || section === "phrases" ? section : "terms";
  }

  function quickHotkeyList(section) {
    const key = quickHotkeySectionKey(section);
    if (key === "connect") {
      const list = sortedConnectives();
      return state.quickConnectOrderMode === "az"
        ? [...list].sort((a, b) => a.localeCompare(b))
        : list;
    }
    if (key === "phrases") {
      const list = state.quickPhrases || [];
      return state.quickPhrasesOrderMode === "az"
        ? [...list].sort((a, b) => (a.text || "").localeCompare(b.text || ""))
        : list;
    }
    const list = state.sessionItems;
    return state.quickTermsViewMode === "az"
      ? [...list].sort((a, b) => String(a?.text || a?.p || a?.shortcut || a?.key || "").localeCompare(
          String(b?.text || b?.p || b?.shortcut || b?.key || "")
        ))
      : list;
  }

  function quickHotkeyOffsetKey(section) {
    const key = quickHotkeySectionKey(section);
    if (key === "connect") return "quickConnHotkeyOffset";
    if (key === "phrases") return "quickPhrasesHotkeyOffset";
    return "quickTermsHotkeyOffset";
  }

  function scrollQuickHotkeyWindow(direction, section = state.quickLastActiveSection) {
    const offsetKey = quickHotkeyOffsetKey(section);
    const list = quickHotkeyList(section);
    const maxOffset = Math.max(0, list.length - HOTKEY_WINDOW_SIZE);
    state[offsetKey] = clamp(state[offsetKey] + (direction * HOTKEY_PAGE_STEP), 0, maxOffset);
  }

  function resetQuickHotkeyWindow(section = state.quickLastActiveSection) {
    state[quickHotkeyOffsetKey(section)] = 0;
  }

  function applyModifierToText(text, modifier) {
    if (!modifier || !text) return text;
    if (modifier === "plural") return text.replace(/y$/, "ies").replace(/([^s])$/, "$1s");
    if (modifier === "adverb") return text + "ly";
    return text;
  }

  function applyTermModifier(term, modifier) {
    if (!modifier || !term) return activeInsertText(term, "") || term.p || "";
    const members = TERM_FAMILY_MEMBERS?.get(familyKey(term)) || [];
    if (modifier === "plural") {
      const plural = members.find(m => m.suffix === "s" || m.suffix === "d");
      return plural ? (activeInsertText(plural, "") || plural.p) : (term.p + "s");
    }
    if (modifier === "adverb") {
      const adverb = members.find(m => m.suffix === "ly" || m.suffix === "ally");
      return adverb ? (activeInsertText(adverb, "") || adverb.p) : (term.p + "ly");
    }
    if (modifier === "secondary") {
      const other = members.find(m => m !== term && m.suffix !== "s" && m.suffix !== "ly");
      return other ? (activeInsertText(other, "") || other.p) : (activeInsertText(term, "") || term.p);
    }
    return activeInsertText(term, "") || term.p || "";
  }

  function joinComposerPills(pills) {
    return (pills || []).reduce((acc, pill) => {
      if (!acc) return pill.text;
      if (pill.type === "text" && /^[,.]/.test(pill.text)) return acc + pill.text;
      return acc + " " + pill.text;
    }, "");
  }

  function getComposerPendingTextFromValue(value) {
    const raw = String(value || "");
    const pillText = joinComposerPills(state.composerPills || []);
    if (!pillText) return raw;
    if (raw.startsWith(pillText)) {
      let pending = raw.slice(pillText.length);
      if (pending.startsWith(" ")) pending = pending.slice(1);
      return pending;
    }
    return raw;
  }

  function composerInsertPendingPill(pill) {
    if (!pill) return;
    if (state.composerSelectedPillId !== null) {
      const idx = state.composerPills.findIndex((item) => item.id === state.composerSelectedPillId);
      if (idx >= 0) {
        state.composerPills = [
          ...state.composerPills.slice(0, idx + 1),
          pill,
          ...state.composerPills.slice(idx + 1)
        ];
        state.composerSelectedPillId = pill.id;
        return;
      }
    }
    state.composerPills = [...state.composerPills, pill];
    state.composerSelectedPillId = pill.id;
  }

  function collectComposerRenderState(pills) {
    if (!Array.isArray(pills) || !pills.length) return false;
    let didChange = false;

    const collectKnownTerm = (term) => {
      if (!term) return;
      const sec = term.sec;
      if (sec === "connect") {
        const allConn = new Set([...getConnectives(), ...state.listenConnectives].map(normalize));
        if (!allConn.has(normalize(term.p))) {
          state.listenConnectives = [...state.listenConnectives, term.p];
          if (!state.connEditOpen) state.connEditOpen = true;
          didChange = true;
        }
        return;
      }

      const key = termKey(term);
      const alreadyInSession = state.sessionItems.some((item) => item.key === key);
      if (sec === "instruments") {
        const list = state.instrumentsList;
        if (!list.some((item) => toolItemText(item) === term.p)) {
          pushToolHistory();
          list.push({ text: term.p, display: term.s || term.p, label: term.p, active: true });
          setToolTrayOpen("instruments", true);
          didChange = true;
        }
        if (!alreadyInSession) {
          state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
          if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
          state.sessionOpen = true;
          didChange = true;
        }
        return;
      }

      if (sec === "feel" || sec === "sound") {
        const list = state.vibeList;
        if (!list.some((item) => toolItemText(item) === term.p)) {
          pushToolHistory();
          list.push({ text: term.p, display: term.s || term.p, label: term.p, active: true });
          setToolTrayOpen("vibes", true);
          didChange = true;
        }
        if (!alreadyInSession) {
          state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
          if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
          state.sessionOpen = true;
          didChange = true;
        }
        return;
      }

      if (!alreadyInSession) {
        state.sessionItems.unshift({ key, shortcut: term.s || "", text: term.p, count: 1, updatedAt: Date.now() });
        if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
        state.sessionOpen = true;
        didChange = true;
      }
    };

    for (const pill of pills) {
      if (!pill) continue;
      if (pill.type === "term") {
        const resolvedTerm = pill.termKey ? TERM_MAP.get(pill.termKey) : null;
        if (resolvedTerm) collectKnownTerm(resolvedTerm);
        continue;
      }
      if (pill.type === "undefined") {
        const text = String(pill.text || "").trim();
        const norm = normalize(text);
        if (norm && !state.undefinedTerms.some((u) => normalize(undefinedTermText(u)) === norm)) {
          state.undefinedTerms = [text, ...state.undefinedTerms].slice(0, 200);
          didChange = true;
        }
      }
    }

    return didChange;
  }

  function composerMatchTermText(tokens, startIndex) {
    const candidateTerms = TERMS.filter((term) => term?.sec !== "connect" && term?.p);
    let best = null;
    for (const term of candidateTerms) {
      const parts = String(term.p || "").trim().split(/\s+/).filter(Boolean);
      if (!parts.length || startIndex + parts.length > tokens.length) continue;
      const source = tokens.slice(startIndex, startIndex + parts.length).map((token) => normalize(token.raw));
      const target = parts.map((part) => normalize(part));
      const isMatch = source.length === target.length && source.every((part, idx) => part === target[idx]);
      if (!isMatch) continue;
      if (!best || parts.length > best.parts.length) best = { term, parts };
    }
    return best;
  }

  function parseComposerPendingText(raw, options = {}) {
    const input = String(raw || "");
    const trimmed = input.trim();
    if (!trimmed) return { pills: [], remainder: "" };
    const flushTail = !!options.flushTail;
    const sourceTerms = Array.isArray(options.termList) && options.termList.length ? options.termList : TERMS;
    const trailingBoundary = /[\s,.!?;:]$/.test(input);
    const tokens = (trimmed.match(/[^\s,.!?;:]+|[,.!?;:]/g) || []).map((piece) => ({ raw: piece, norm: normalize(piece) }));
    const pills = [];
    let pendingWords = [];
    const candidateTerms = sourceTerms.filter((term) => term?.sec !== "connect" && term?.p).map((term) => ({
      term,
      parts: String(term.p || "").trim().split(/\s+/).filter(Boolean).map((part) => normalize(part))
    })).filter((entry) => entry.parts.length);
    const connectorSet = new Set(getConnectives().map((item) => normalize(item)));

    const pushPill = (pill) => {
      state.composerPillCounter = (state.composerPillCounter || 0) + 1;
      pills.push({ id: state.composerPillCounter, ...pill });
    };

    const flushPendingWords = () => {
      const text = pendingWords.join(" ").trim();
      if (!text) return;
      pushPill({ type: "undefined", text });
      pendingWords = [];
    };

    const exactTermForWords = (words) => {
      const target = words.map((word) => normalize(word));
      let best = null;
      for (const entry of candidateTerms) {
        if (entry.parts.length !== target.length) continue;
        if (!entry.parts.every((part, idx) => part === target[idx])) continue;
        if (!best || entry.parts.length > best.parts.length) best = entry;
      }
      return best;
    };

    const hasLongerPrefixForWords = (words) => {
      const target = words.map((word) => normalize(word));
      return candidateTerms.some((entry) => entry.parts.length > target.length && target.every((part, idx) => entry.parts[idx] === part));
    };

    for (let index = 0; index < tokens.length;) {
      const token = tokens[index];
      if (/^[,.!?;:]$/.test(token.raw)) {
        flushPendingWords();
        pushPill({ type: "text", text: token.raw });
        index += 1;
        continue;
      }

      const tokenNorm = normalize(token.raw);
      if (connectorSet.has(tokenNorm)) {
        pendingWords.push(token.raw);
        index += 1;
        continue;
      }

      let bestExact = null;
      let bestPrefixLength = 0;
      for (let end = index; end < tokens.length; end += 1) {
        const candidateSlice = tokens.slice(index, end + 1);
        if (candidateSlice.some((item) => /^[,.!?;:]$/.test(item.raw))) break;
        const words = candidateSlice.map((item) => item.raw);
        const exact = exactTermForWords(words);
        if (exact && (!bestExact || exact.parts.length > bestExact.parts.length)) bestExact = exact;
        if (hasLongerPrefixForWords(words)) bestPrefixLength = words.length;
      }

      if (!bestExact) {
        pendingWords.push(token.raw);
        index += 1;
        continue;
      }

      const exactLength = bestExact.parts.length;
      const exactEndsAtTail = index + exactLength === tokens.length;
      const ambiguousExact = bestPrefixLength === exactLength;
      const hasLongerInProgress = bestPrefixLength > exactLength;

      if (!flushTail && !trailingBoundary && (exactEndsAtTail || hasLongerInProgress || ambiguousExact)) {
        pendingWords.push(...tokens.slice(index).map((item) => item.raw));
        break;
      }

      if (ambiguousExact) {
        pendingWords.push(...tokens.slice(index, index + exactLength).map((item) => item.raw));
        index += exactLength;
        continue;
      }

      flushPendingWords();
      pushPill({ type: "term", text: bestExact.term.p, termKey: termKey(bestExact.term) });
      index += exactLength;
    }

    const shouldFlushTail = flushTail || trailingBoundary;
    if (shouldFlushTail) flushPendingWords();
    return {
      pills,
      remainder: shouldFlushTail ? "" : pendingWords.join(" ").trim()
    };
  }

  function composerPillsFromPendingText(raw) {
    return parseComposerPendingText(raw, { flushTail: true }).pills;
  }

  function reconcileComposerTypedInput(rawValue) {
    const pending = getComposerPendingTextFromValue(rawValue);
    const parsed = parseComposerPendingText(pending, { flushTail: false });
    parsed.pills.forEach((pill) => composerInsertPendingPill(pill));
    state.composerText = parsed.remainder;
    return parsed.pills.length > 0;
  }

  function getComposerResolvedText() {
    const pillText = joinComposerPills(state.composerPills || []);
    const pending = String(state.composerText || "").trim();
    if (!pillText) return pending;
    if (!pending) return pillText;
    if (/^[,.]/.test(pending)) return pillText + pending;
    return `${pillText} ${pending}`;
  }

  function syncComposerText(options = {}) {
    const focusSnapshot = options.focusSnapshot || composerInputSnapshot();
    if (!state.quickComposePinned) {
      state.composerText = joinComposerPills(state.composerPills || []);
    } else {
      state.composerText = String(state.composerText || "").trim();
    }
    render();
    setTimeout(() => restoreComposerInput(focusSnapshot, { toEnd: options.toEnd !== false }), 0);
  }

  function flushComposerPendingText(options = {}) {
    const raw = String(state.composerText || "").trim();
    if (!raw) return false;
    const parsed = parseComposerPendingText(raw, { flushTail: true });
    if (!parsed.pills.length) {
      state.composerText = raw;
      return false;
    }
    if (options.collectDerived) collectComposerRenderState(parsed.pills);
    parsed.pills.forEach((pill) => composerInsertPendingPill(pill));
    state.composerText = "";
    return true;
  }

  function insertAtComposerCursor(text, type = "term") {
    const pillMeta = state.composerPendingPillMeta || {};
    state.composerPendingPillMeta = null;
    if (state.quickComposePinned) {
      // Flush any uncommitted textarea words before adding the new pill
      flushComposerPendingText({ collectDerived: true });
      state.composerPillCounter = (state.composerPillCounter || 0) + 1;
      let insertText = text.trim();
      if (state.composerNextCapitalise && insertText) {
        insertText = insertText.charAt(0).toUpperCase() + insertText.slice(1);
        state.composerNextCapitalise = false;
      }
      const isTermPill = type === "term";
      const newPill = {
        id: state.composerPillCounter,
        type,
        text: insertText,
        sec: isTermPill ? (pillMeta.sec || null) : null,
        cat: isTermPill ? (pillMeta.cat || null) : null
      };
      if (state.composerSelectedPillId !== null) {
        const idx = state.composerPills.findIndex(p => p.id === state.composerSelectedPillId);
        if (idx >= 0) {
          state.composerPills = [
            ...state.composerPills.slice(0, idx + 1),
            newPill,
            ...state.composerPills.slice(idx + 1)
          ];
          state.composerSelectedPillId = newPill.id;
          syncComposerText({ focusSnapshot: { focused: true, startFromEnd: 0, endFromEnd: 0 } });
          return;
        }
      }
      state.composerPills = [...state.composerPills, newPill];
      state.composerSelectedPillId = newPill.id;
      syncComposerText({ focusSnapshot: { focused: true, startFromEnd: 0, endFromEnd: 0 } });
      return;
    }
    const ta = shadow.getElementById("bp-composer-text");
    if (ta) {
      const start = ta.selectionStart || ta.value.length;
      const end = ta.selectionEnd || start;
      ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + text.length;
      state.composerText = ta.value;
    }
  }

  function isCompactQuickTagMode() {
    return ACTIVE_RENDER_BIND_PATH === "compact-only" || state.quickTagMode === "compact";
  }

  function setCompactStatus(message, kind = "info") {
    state.compactStatusMessage = String(message || "").trim();
    state.compactStatusKind = kind === "error" ? "error" : kind === "success" ? "success" : "info";
  }

  function clearCompactStatus() {
    state.compactStatusMessage = "";
    state.compactStatusKind = "info";
  }

  function compactComposeHasMeaningfulText(text = state.compactComposeText) {
    return !!String(text || "").trim();
  }

  function compactShouldCapitalizeSegmentStart(previousText) {
    const prior = String(previousText || "").replace(/\s+$/, "");
    if (!prior) return true;
    return /[.!?]$/.test(prior);
  }

  function compactShouldPreserveLeadingUppercaseWord(word) {
    const text = String(word || "");
    if (!text) return false;
    if (/^I(?:['’].+)?$/.test(text)) return true;
    if (/^[A-Z0-9]+(?:[-/][A-Z0-9]+)*$/.test(text) && /[A-Z]/.test(text)) return true;
    return false;
  }

  function applyCompactLeadingSentenceCase(text, capitalizeStart = true) {
    const source = String(text || "");
    const match = /^([^A-Za-z]*)([A-Za-z][A-Za-z0-9'’-]*)/.exec(source);
    if (!match) return source;
    const prefix = match[1];
    const word = match[2];
    let nextWord = word;
    if (capitalizeStart) {
      nextWord = word.charAt(0).toUpperCase() + word.slice(1);
    } else if (!compactShouldPreserveLeadingUppercaseWord(word)) {
      nextWord = word.charAt(0).toLowerCase() + word.slice(1);
    }
    return `${prefix}${nextWord}${source.slice(prefix.length + word.length)}`;
  }

  function capitalizeCompactOutputSentences(text, options = {}) {
    const source = String(text || "");
    if (!source) return "";
    const capitalizeStart = options.capitalizeStart !== false;
    const withLeadingCase = applyCompactLeadingSentenceCase(source, capitalizeStart);
    return withLeadingCase.replace(/([.!?]\s+)([a-z])/g, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);
  }

  function normalizeCompactOutputText(text, options = {}) {
    const capitalizeStart = options.capitalizeStart !== false;
    let normalizedText = String(text || "").replace(/\r\n?/g, "\n");
    if (!normalizedText.trim()) return "";

    normalizedText = normalizedText
      .replace(/\b(?:p\s*d|pd)\b/gi, " . ")
      .replace(/\bcomma\b/gi, " , ");

    normalizedText = normalizedText
      .replace(/\s+/g, " ")
      .replace(/\s+([.,])/g, "$1")
      .replace(/([.,])(?:\s*[.,])+/g, "$1")
      .replace(/([.,])\s*/g, "$1 ")
      .replace(/\s{2,}/g, " ")
      .trim();

    normalizedText = capitalizeCompactOutputSentences(normalizedText, { capitalizeStart });
    return normalizedText;
  }

  function extractCompactMicStopCommand(text) {
    const raw = String(text || "").replace(/\s+/g, " ").trim();
    if (!raw) return { command: "", text: "" };
    const commands = [
      { command: "site", regex: /(?:^|[\s.,;:!?])(?:p\s*t\s*s|pts)\s*$/i },
      { command: "app", regex: /(?:^|[\s.,;:!?])(?:p\s*t\s*a|pta)\s*$/i }
    ];
    for (const entry of commands) {
      const match = entry.regex.exec(raw);
      if (!match) continue;
      return {
        command: entry.command,
        text: raw.slice(0, match.index).trim()
      };
    }
    return { command: "", text: raw };
  }

  function clearCompactMicStopCommand() {
    _pendingCompactMicStopCommand = null;
  }

  function clearCompactMicStopCommandTimer() {
    if (_compactMicStopCommandTimer) clearTimeout(_compactMicStopCommandTimer);
    _compactMicStopCommandTimer = null;
  }

  function cancelCompactMicStopCommand() {
    clearCompactMicStopCommandTimer();
    _pendingCompactMicStopCommand = null;
    _compactMicStopRequested = false;
  }

  function shouldExecuteCompactMicStopCommand() {
    return !!_pendingCompactMicStopCommand?.command && (_compactMicStopRequested || !state.compactDictationActive);
  }

  function scheduleCompactMicStopCommandExecution(delay = 240) {
    clearCompactMicStopCommandTimer();
    _compactMicStopCommandTimer = setTimeout(() => {
      _compactMicStopCommandTimer = null;
      if (!shouldExecuteCompactMicStopCommand()) return;
      executeCompactMicStopCommand();
      render();
    }, delay);
  }

  function normalizeCompactComposeOutputInPlace(text = state.compactComposeText) {
    const normalizedText = normalizeCompactOutputText(text);
    setCompactComposeText(normalizedText);
    return normalizedText;
  }

  function appendCompactDictationFinalText(text) {
    const raw = String(text || "").trim();
    if (!raw) return false;
    const pending = extractCompactMicStopCommand(raw);
    const beforeText = String(state.compactComposeText || "");
    const normalizedSegment = normalizeCompactOutputText(pending.text, {
      capitalizeStart: compactShouldCapitalizeSegmentStart(beforeText)
    });
    if (normalizedSegment && !appendCompactComposeText(normalizedSegment, { preserveMicStopCommand: true })) return false;
    _pendingCompactMicStopCommand = pending.command ? { command: pending.command } : null;
    return true;
  }

  function executeCompactMicStopCommand() {
    clearCompactMicStopCommandTimer();
    const pending = _pendingCompactMicStopCommand;
    _pendingCompactMicStopCommand = null;
    _compactMicStopRequested = false;
    if (!pending?.command) return false;

    if (pending.command === "site") {
      performCompactAppPrint();
      performCompactPrint();
      return true;
    }
    performCompactAppPrint();
    return true;
  }

  function openCompactSitePrintPrompt(text = state.compactComposeText) {
    const clean = String(text || "").trim();
    if (!clean) {
      state.compactSitePrintPromptOpen = false;
      state.compactSitePrintPromptText = "";
      return false;
    }
    state.compactSitePrintPromptOpen = true;
    state.compactSitePrintPromptText = clean;
    return true;
  }

  function closeCompactSitePrintPrompt() {
    state.compactSitePrintPromptOpen = false;
    state.compactSitePrintPromptText = "";
  }

  function enterCompactQuickTagMode() {
    state.quickTagMode = "compact";
    state.visible = false;
    state.sessionOpen = true;
    state.sessionMinimized = false;
    state.compactTermsOpen = true;
    state.compactTermsMinimized = false;
    state.compactTagsOpen = true;
    state.compactTagsMinimized = false;
    state.quickComposePinned = true;
    state.listenMode = "word";
    state.sessionWidth = Math.max(state.sessionWidth || 0, 380);
    state.sessionHeight = Math.max(state.sessionHeight || 0, 560);
    state.compactTermsWidth = Math.max(state.compactTermsWidth || 0, 380);
    state.compactTermsHeight = Math.max(state.compactTermsHeight || 0, 520);
    state.compactTagsWidth = Math.max(state.compactTagsWidth || 0, 320);
    state.compactTagsHeight = Math.max(state.compactTagsHeight || 0, 420);
    state.compactPrintsWidth = Math.max(state.compactPrintsWidth || 0, 340);
    state.compactPrintsHeight = Math.max(state.compactPrintsHeight || 0, 260);
    state.compactPhrasesWidth = Math.max(state.compactPhrasesWidth || 0, 340);
    state.compactPhrasesHeight = Math.max(state.compactPhrasesHeight || 0, 260);
    state.compactSessionTermsWidth = Math.max(state.compactSessionTermsWidth || 0, 320);
    state.compactSessionTermsHeight = Math.max(state.compactSessionTermsHeight || 0, 420);
    setToolTrayOpen("instruments", true);
    setToolTrayOpen("vibes", true);
  }

  function enterLegacyQuickTagMode() {
    if (ACTIVE_RENDER_BIND_PATH === "compact-only") {
      enterCompactQuickTagMode();
      return;
    }
    state.quickTagMode = "legacy";
    state.visible = true;
    state.compactTermsOpen = false;
    state.compactTagsOpen = false;
    state.sessionOpen = true;
    state.sessionMinimized = false;
  }

  function clearCompactSessionData() {
    clearSessionWorkingState({ closeSessionUi: false, closeComposerUi: false, closeToolTrays: false });
    state.sessionOpen = true;
    state.compactTermsOpen = true;
    state.compactTagsOpen = true;
    closeCompactSitePrintPrompt();
    setCompactStatus("Cleared compose and tagger session content.", "info");
    savePrefs();
    render();
    return true;
  }

  function clearCompactSessionTerms() {
    if (!(state.sessionItems || []).length) {
      setCompactStatus("Session Terms is already empty.", "info");
      render();
      return false;
    }
    state.sessionItems = [];
    state.sessionPage = 0;
    state.quickTermsDeleteMode = false;
    state.quickTermsDeleteTarget = null;
    state.quickTermsHotkeyOffset = 0;
    if (state.quickMoveMode === "terms") {
      state.quickMoveMode = null;
      state.quickMovePillIdx = null;
    }
    setCompactStatus("Cleared current session terms.", "info");
    queuePrefsSave();
    render();
    return true;
  }

  function deleteCompactSessionTerm(index) {
    if (!Number.isInteger(index) || index < 0 || index >= (state.sessionItems || []).length) return false;
    const item = state.sessionItems[index];
    state.sessionItems = state.sessionItems.filter((_, itemIndex) => itemIndex !== index);
    state.sessionPage = 0;
    state.quickTermsDeleteTarget = null;
    if (state.quickMoveMode === "terms") {
      state.quickMoveMode = null;
      state.quickMovePillIdx = null;
    }
    setCompactStatus(`Removed "${item?.text || item?.shortcut || "session term"}" from Session Terms.`, "info");
    queuePrefsSave();
    render();
    return true;
  }

  function deleteCompactHistoryEntry(entryId) {
    const before = state.compactPrintHistory.length;
    state.compactPrintHistory = (state.compactPrintHistory || []).filter((entry) => entry.id !== entryId);
    if (state.compactPrintHistory.length === before) return false;
    saveCompactData();
    setCompactStatus("Removed item from Full Prints / History.", "info");
    render();
    return true;
  }

  function deleteCompactPhraseEntry(entryId) {
    const beforeSentences = state.compactPhraseBank.length;
    state.compactPhraseBank = (state.compactPhraseBank || []).filter((entry) => entry.id !== entryId);
    if (state.compactPhraseBank.length !== beforeSentences) {
      saveCompactData();
      setCompactStatus("Removed sentence from Sentences.", "info");
      render();
      return true;
    }
    const beforeManual = (state.compactManualPhraseBank || []).length;
    state.compactManualPhraseBank = (state.compactManualPhraseBank || []).filter((entry) => entry.id !== entryId);
    if (state.compactManualPhraseBank.length === beforeManual) return false;
    saveCompactData();
    setCompactStatus("Removed phrase from manual Phrases.", "info");
    render();
    return true;
  }

  function deleteCompactUndefinedEntry(index) {
    if (!Number.isInteger(index) || index < 0 || index >= (state.undefinedTerms || []).length) return false;
    const entry = state.undefinedTerms[index];
    state.undefinedTerms = state.undefinedTerms.filter((_, itemIndex) => itemIndex !== index);
    removeUndefinedSessionItem(entry);
    saveCompactData();
    setCompactStatus("Removed undefined term.", "info");
    render();
    return true;
  }

  function sanitizeCompactCustomTerms(items) {
    if (!Array.isArray(items)) return [];
    return items
      .slice(0, 200)
      .map((item, index) => ({
        id: String(item?.id || `compact::${Date.now()}::${index}`).trim(),
        term: String(item?.term || item?.text || "").trim(),
        shortcut: String(item?.shortcut || "").trim(),
        groupKey: compactGroupConfig(item?.groupKey).key,
        createdAt: Number(item?.createdAt) || Date.now(),
        notes: String(item?.notes || "").trim()
      }))
      .filter((item) => item.term && item.shortcut);
  }

  function sanitizeCompactUndefinedTerms(items) {
    if (!Array.isArray(items)) return [];
    return items
      .slice(0, 200)
      .map((item) => {
        if (typeof item === "string") {
          const text = item.trim();
          return text ? text : null;
        }
        const text = String(item?.text || "").trim();
        if (!text) return null;
        const shortcut = String(item?.shortcut || "").trim();
        return shortcut ? { text, shortcut, source: String(item?.source || "compact") } : text;
      })
      .filter(Boolean);
  }

  function sanitizeCompactPrintHistory(items) {
    if (!Array.isArray(items)) return [];
    return items
      .slice(0, COMPACT_HISTORY_LIMIT)
      .map((item, index) => {
        if (typeof item === "string") {
          const text = item.trim();
          return text ? { id: `compact-print::${index}`, text, printedAt: Date.now() - index } : null;
        }
        const text = String(item?.text || "").trim();
        if (!text) return null;
        return {
          id: String(item?.id || `compact-print::${index}`),
          text,
          printedAt: Number(item?.printedAt) || Date.now()
        };
      })
      .filter(Boolean);
  }

  function sanitizeCompactPhraseBank(items) {
    if (!Array.isArray(items)) return [];
    return items
      .slice(0, COMPACT_PHRASE_LIMIT)
      .map((item, index) => {
        if (typeof item === "string") {
          const text = item.trim();
          return text ? { id: `compact-phrase::${index}`, text, sourcePrintId: "", capturedAt: Date.now() - index } : null;
        }
        const text = String(item?.text || "").trim();
        if (!text) return null;
        return {
          id: String(item?.id || `compact-phrase::${index}`),
          text,
          sourcePrintId: String(item?.sourcePrintId || ""),
          capturedAt: Number(item?.capturedAt) || Date.now()
        };
      })
      .filter(Boolean);
  }

  function sanitizeCompactManualPhraseBank(items) {
    return sanitizeCompactPhraseBank(items);
  }

  async function loadCompactSourceRows() {
    COMPACT_SOURCE_ROWS = [];
    try {
      const url = assetUrl(COMPACT_SOURCE_FILE);
      if (!url) {
        console.warn(`[MYUI] Failed to resolve compact source URL for ${COMPACT_SOURCE_FILE}.`);
        return;
      }
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[MYUI] Failed to load compact source (${response.status}).`, url);
        return;
      }
      const lowerName = String(COMPACT_SOURCE_FILE || "").toLowerCase();
      if (lowerName.endsWith(".csv")) {
        const raw = await response.text();
        const parsed = parseCompactLibraryCsv(raw);
        COMPACT_SOURCE_ROWS = cloneCompactLibraryRows(parsed.rows);
      } else {
        const payload = await response.json();
        COMPACT_SOURCE_ROWS = flattenCompactSourcePayload(payload)
          .map((item, index) => compactSourceItemToRow(item, index))
          .filter(Boolean);
      }
      const duplicateShortcuts = duplicateCompactShortcuts(COMPACT_SOURCE_ROWS);
      if (duplicateShortcuts.length) {
        console.warn("[MYUI] Duplicate shortcuts remain in the bundled compact source after resolution.", duplicateShortcuts);
      }
    } catch (error) {
      console.warn(`[MYUI] Failed to load compact source ${COMPACT_SOURCE_FILE}.`, error);
      COMPACT_SOURCE_ROWS = [];
    }
  }

  async function loadCompactData() {
    const area = chrome?.storage?.local;
    if (!area) {
      COMPACT_ACTIVE_ROWS = [];
      LEGACY_COMPACT_CUSTOM_ENTRIES = [];
      CUSTOM_TERM_ENTRIES = [];
      state.compactPrintHistory = [];
      state.compactPhraseBank = [];
      state.compactManualPhraseBank = [];
      return;
    }
    try {
      const stored = await new Promise((resolve) => {
        try {
          const maybe = area.get(COMPACT_STORAGE_KEY, (value) => resolve(value));
          if (maybe?.then) maybe.then(resolve).catch(() => resolve({}));
        } catch (_) {
          resolve({});
        }
      });
      const payload = stored?.[COMPACT_STORAGE_KEY] || {};
      COMPACT_ACTIVE_ROWS = restoreStoredCompactLibraryRows(payload.activeLibraryRows);
      LEGACY_COMPACT_CUSTOM_ENTRIES = sanitizeCompactCustomTerms(payload.customTerms);
      CUSTOM_TERM_ENTRIES = [];
      state.compactPrintHistory = sanitizeCompactPrintHistory(payload.fullPrintHistory || payload.printHistory);
      state.compactPhraseBank = sanitizeCompactPhraseBank(payload.phraseBank);
      state.compactManualPhraseBank = sanitizeCompactManualPhraseBank(payload.manualPhraseBank);
      const storedUndefined = sanitizeCompactUndefinedTerms(payload.undefinedTerms);
      if (storedUndefined.length) state.undefinedTerms = storedUndefined;
    } catch (_) {
      COMPACT_ACTIVE_ROWS = [];
      LEGACY_COMPACT_CUSTOM_ENTRIES = [];
      CUSTOM_TERM_ENTRIES = [];
      state.compactPrintHistory = [];
      state.compactPhraseBank = [];
      state.compactManualPhraseBank = [];
    }
  }

  function saveCompactData() {
    const area = chrome?.storage?.local;
    if (!area) return;
    const payload = {
      [COMPACT_STORAGE_KEY]: {
        activeLibraryRows: cloneCompactLibraryRows(activeCompactLibraryRows()),
        customTerms: [],
        fullPrintHistory: sanitizeCompactPrintHistory(state.compactPrintHistory),
        phraseBank: sanitizeCompactPhraseBank(state.compactPhraseBank),
        manualPhraseBank: sanitizeCompactManualPhraseBank(state.compactManualPhraseBank),
        undefinedTerms: sanitizeCompactUndefinedTerms(state.undefinedTerms)
      }
    };
    try {
      const maybe = area.set(payload, () => {});
      if (maybe?.catch) maybe.catch(() => {});
    } catch (_) {}
  }

  function finalizeCompactLibraryState() {
    if (!COMPACT_ACTIVE_ROWS.length && LEGACY_COMPACT_CUSTOM_ENTRIES.length) {
      const migratedRows = defaultCompactLibraryRows().concat(
        LEGACY_COMPACT_CUSTOM_ENTRIES.map((entry, index) => compactCustomTermToRow(entry, index))
      );
      COMPACT_ACTIVE_ROWS = cloneCompactLibraryRows(migratedRows);
    }
    LEGACY_COMPACT_CUSTOM_ENTRIES = [];
    CUSTOM_TERM_ENTRIES = [];
  }

  function appendCompactComposeText(text, options = {}) {
    const { preserveMicStopCommand = false } = options || {};
    const clean = String(text || "").trim();
    if (!clean) return false;
    if (preserveMicStopCommand) clearCompactMicStopCommand();
    else cancelCompactMicStopCommand();
    const current = String(state.compactComposeText || "");
    const needsLeadingSpace = !!current && !/[\s([{/]$/.test(current) && !/^[.,;:!?)}\]]/.test(clean);
    state.compactComposeText = `${current}${needsLeadingSpace ? " " : ""}${clean}`.trim();
    state.compactInterimTranscript = "";
    closeCompactSitePrintPrompt();
    return true;
  }

  function setCompactComposeText(text) {
    cancelCompactMicStopCommand();
    state.compactComposeText = String(text || "").trim();
    state.compactInterimTranscript = "";
    closeCompactSitePrintPrompt();
  }

  function compactUndefinedCandidateToken(token) {
    const clean = String(token || "")
      .trim()
      .toLowerCase()
      .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
    if (!clean) return "";
    if (!/^[a-z0-9][a-z0-9'-]*$/.test(clean)) return "";
    return clean;
  }

  function compactKnownWordSet() {
    const known = new Set();
    [...getConnectives(), ...state.listenConnectives].forEach((entry) => {
      const token = compactUndefinedCandidateToken(entry);
      if (token) known.add(token);
    });
    const sourceTerms = COMPACT_TERMS.length ? COMPACT_TERMS : TERMS;
    sourceTerms.forEach((term) => {
      if (!term?.p || term?.sec === "connect") return;
      String(term.p || "").split(/\s+/).forEach((part) => {
        const token = compactUndefinedCandidateToken(part);
        if (token) known.add(token);
      });
    });
    return known;
  }

  function collectCompactUndefinedTerms(text = state.compactComposeText) {
    const parsed = parseComposerPendingText(String(text || ""), {
      flushTail: true,
      termList: COMPACT_TERMS.length ? COMPACT_TERMS : TERMS
    });
    if (!parsed?.pills?.length) return false;
    const knownWords = compactKnownWordSet();
    const seen = new Set(
      (state.undefinedTerms || [])
        .map((entry) => compactUndefinedCandidateToken(undefinedTermText(entry)))
        .filter(Boolean)
    );
    const collected = [];
    let didChange = false;
    parsed.pills.forEach((pill) => {
      if (!pill || pill.type !== "undefined") return;
      const words = String(pill.text || "").match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || [];
      words.forEach((word) => {
        const norm = compactUndefinedCandidateToken(word);
        if (!norm) return;
        if (knownWords.has(norm) || COMPACT_UNDEFINED_STOP_WORDS.has(norm) || seen.has(norm)) return;
        seen.add(norm);
        collected.push(norm);
        didChange = true;
      });
    });
    if (didChange) {
      state.undefinedTerms = [...collected, ...state.undefinedTerms].slice(0, 200);
      collected.forEach((word) => upsertUndefinedSessionItem(word));
      saveCompactData();
    }
    return didChange;
  }

  function compactShortcutCollision(shortcut) {
    const target = normalize(shortcut);
    if (!target) return null;
    return compactRuntimeRows().find((row) => normalize(row.shortcut) === target) || null;
  }

  function saveCompactCustomTerm() {
    const term = String(state.compactCustomTermText || "").trim();
    const shortcut = String(state.compactCustomTermShortcut || "").trim();
    const group = compactGroupConfig(state.compactCustomTermGroup);
    if (!term || !shortcut) {
      setCompactStatus("Enter both a custom term and a shortcut before saving.", "error");
      render();
      return false;
    }
    const shortcutCollision = compactShortcutCollision(shortcut);
    if (shortcutCollision) {
      setCompactStatus(`Shortcut "${shortcut}" already belongs to "${shortcutCollision.term}".`, "error");
      render();
      return false;
    }
    const duplicateTerm = compactRuntimeRows().find((row) => normalize(row.term) === normalize(term));
    if (duplicateTerm) {
      setCompactStatus(`"${term}" already exists in the runtime term set.`, "error");
      render();
      return false;
    }
    const nextEntry = compactCustomTermToRow({
      id: `compact::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
      term,
      shortcut,
      groupKey: group.key,
      createdAt: Date.now(),
      notes: `Custom compact term · ${group.label}`
    }, 0);
    COMPACT_ACTIVE_ROWS = [nextEntry, ...materializeActiveCompactLibraryRows()];
    const norm = normalize(term);
    state.undefinedTerms = (state.undefinedTerms || []).filter((entry) => normalize(undefinedTermText(entry)) !== norm);
    removeUndefinedSessionItem(term);
    state.compactCustomTermText = "";
    state.compactCustomTermShortcut = "";
    state.compactCustomTermGroup = group.key;
    rebuildRuntimeData();
    saveCompactData();
    setCompactStatus(`Saved "${term}" to ${group.label}.`, "success");
    render();
    return true;
  }

  function queueCompactCustomTerm(source, groupKey = state.compactCustomTermGroup) {
    const nextText = typeof source === "object" ? undefinedTermText(source).trim() : String(source || "").trim();
    const nextShortcut = typeof source === "object" ? undefinedTermShortcut(source).trim() : "";
    if (!nextText) return false;
    state.compactCustomTermText = nextText;
    state.compactCustomTermShortcut = nextShortcut;
    state.compactCustomTermGroup = compactGroupConfig(groupKey).key;
    state.compactTermsOpen = true;
    state.compactTermsMinimized = false;
    setCompactStatus(`Custom term form loaded for "${nextText}".`, "info");
    render();
    return true;
  }

  function captureCompactComposeOutput(text) {
    const clean = String(text || "").trim();
    if (!clean) return { text: "", harvestedTerms: [] };
    collectCompactUndefinedTerms(clean);
    recordCompactPrint(clean);
    const harvestedTerms = harvestCompactKnownTermsFromText(clean);
    state.compactInterimTranscript = "";
    return { text: clean, harvestedTerms };
  }

  function compactPhraseKey(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function addCompactManualPhrase(text = state.compactManualPhraseText) {
    const clean = compactPhraseKey(text);
    if (!clean) {
      setCompactStatus("Type a phrase before adding it.", "error");
      render();
      return false;
    }
    const exists = (state.compactManualPhraseBank || []).some((entry) => compactPhraseKey(entry?.text) === clean);
    if (exists) {
      setCompactStatus(`"${clean}" is already in manual Phrases.`, "info");
      render();
      return false;
    }
    state.compactManualPhraseBank = [{
      id: `compact-manual-phrase::${Date.now()}::${Math.random().toString(36).slice(2, 6)}`,
      text: clean,
      sourcePrintId: "",
      capturedAt: Date.now()
    }, ...(state.compactManualPhraseBank || [])].slice(0, COMPACT_PHRASE_LIMIT);
    state.compactManualPhraseText = "";
    saveCompactData();
    setCompactStatus(`Added "${clean}" to manual Phrases.`, "success");
    render();
    return true;
  }

  function extractCompactPhrasesFromPrint(text, sourcePrintId = "") {
    const raw = String(text || "");
    if (!raw.trim()) return [];
    const seen = new Set();
    return raw
      .split(/\r?\n+/)
      .flatMap((line) => line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
      .map((fragment) => fragment.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((fragment) => {
        const key = compactPhraseKey(fragment);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((fragment, index) => ({
        id: `compact-phrase::${Date.now()}::${index}::${Math.random().toString(36).slice(2, 6)}`,
        text: fragment,
        sourcePrintId,
        capturedAt: Date.now()
      }));
  }

  function recordCompactPrint(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    const existingPrintEntry = (state.compactPrintHistory || []).find((item) => String(item?.text || "").trim() === clean);
    const entry = existingPrintEntry || {
      id: `compact-print::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
      text: clean,
      printedAt: Date.now()
    };
    if (!existingPrintEntry) {
      state.compactPrintHistory = [entry, ...(state.compactPrintHistory || [])].slice(0, COMPACT_HISTORY_LIMIT);
    }
    const existingPhraseTexts = new Set(
      (state.compactPhraseBank || [])
        .map((item) => compactPhraseKey(item?.text))
        .filter(Boolean)
    );
    const phraseEntries = extractCompactPhrasesFromPrint(clean, entry.id)
      .filter((item) => !existingPhraseTexts.has(compactPhraseKey(item.text)));
    if (phraseEntries.length) {
      state.compactPhraseBank = [...phraseEntries, ...(state.compactPhraseBank || [])].slice(0, COMPACT_PHRASE_LIMIT);
    }
    saveCompactData();
  }

  function compactHarvestScanText(text) {
    return ` ${String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()} `;
  }

  function detectCompactKnownTermsInText(text) {
    const haystack = compactHarvestScanText(text);
    if (!haystack.trim()) return [];
    const pool = (COMPACT_TERMS.length ? COMPACT_TERMS : TERMS)
      .filter((term) => term?.p && term?.sec !== "connect");
    const matches = [];
    const consumed = [];
    const seen = new Set();
    const sorted = pool.slice().sort((a, b) => {
      const aWords = compactHarvestScanText(a.p).trim().split(/\s+/).filter(Boolean).length;
      const bWords = compactHarvestScanText(b.p).trim().split(/\s+/).filter(Boolean).length;
      if (bWords !== aWords) return bWords - aWords;
      const lenDiff = String(b?.p || "").length - String(a?.p || "").length;
      if (lenDiff) return lenDiff;
      return sortTerms([a, b])[0] === a ? -1 : 1;
    });

    for (const term of sorted) {
      const key = termKey(term);
      if (seen.has(key)) continue;
      const needle = compactHarvestScanText(term.p);
      if (!needle.trim()) continue;
      let start = haystack.indexOf(needle);
      while (start !== -1) {
        const end = start + needle.length;
        const overlaps = consumed.some((range) => Math.max(range.start, start) < Math.min(range.end, end));
        if (!overlaps) {
          seen.add(key);
          consumed.push({ start, end });
          matches.push({ start, term });
          break;
        }
        start = haystack.indexOf(needle, start + 1);
      }
    }

    return matches
      .sort((a, b) => a.start - b.start)
      .map((entry) => entry.term);
  }

  function harvestCompactKnownTermsFromText(text) {
    const matchedTerms = detectCompactKnownTermsInText(text);
    if (!matchedTerms.length) return [];
    matchedTerms.forEach((term) => {
      addTermToSession(term);
      const route = activeCategoryRoute(term);
      if (route === "instruments" || route === "vibes") {
        upsertToolStateTerm(route, term);
      }
    });
    queuePrefsSave();
    return matchedTerms;
  }

  function ensureCompactArmedField(errorMessage) {
    const activeField = resolveEditableField(document.activeElement);
    if (activeField) armWriteField(activeField, { captureNow: true });
    const field = currentWriteField();
    if (field) return field;
    setCompactStatus(errorMessage, "error");
    render();
    return null;
  }

  function useCompactHistoryEntry(entryId) {
    const entry = (state.compactPrintHistory || []).find((item) => item.id === entryId);
    if (!entry) return false;
    setCompactComposeText(entry.text);
    setCompactStatus(`Loaded "${entry.text}" into Compose.`, "info");
    render();
    return true;
  }

  function useCompactPhraseEntry(entryId) {
    const entry = (state.compactPhraseBank || []).find((item) => item.id === entryId)
      || (state.compactManualPhraseBank || []).find((item) => item.id === entryId);
    if (!entry) return false;
    if (!appendCompactComposeText(entry.text)) return false;
    setCompactStatus(`Appended phrase "${entry.text}" to Compose.`, "info");
    render();
    return true;
  }

  function appendCompactTermByKey(key) {
    const term = COMPACT_TERM_MAP.get(key) || TERM_MAP.get(key);
    if (!term) return false;
    const route = activeCategoryRoute(term) || "";
    const text = activeInsertText(term, route) || term.p;
    if (!appendCompactComposeText(text)) return false;
    if (route === "instruments" || route === "vibes") addTermToToolState(route, term);
    clearCompactStatus();
    render();
    return true;
  }

  function performCompactToolPrint(sec) {
    const items = printableToolTexts(sec);
    if (!items.length) {
      setCompactStatus(`${toolLabel(sec)} tagger is empty.`, "error");
      render();
      return false;
    }
    const field = ensureCompactArmedField(`No page field armed. Click inside the target page field first, then print ${toolLabel(sec).toLowerCase()} tags.`);
    if (!field) return false;
    const printed = insertChips(items);
    if (!printed) {
      setCompactStatus(`Print failed for the armed page field. Re-arm the field and try printing ${toolLabel(sec).toLowerCase()} tags again.`, "error");
      render();
      return false;
    }
    snapshotArmedFieldSelection(field);
    setCompactStatus(`Printed ${items.length} ${toolLabel(sec).toLowerCase()} tag${items.length === 1 ? "" : "s"} to the armed field.`, "success");
    render();
    return true;
  }

  function performCompactAppPrint() {
    const text = String(state.compactComposeText || "").trim();
    if (!text) {
      setCompactStatus("Compose is empty.", "error");
      render();
      return false;
    }
    const { harvestedTerms } = captureCompactComposeOutput(text);
    openCompactSitePrintPrompt(text);
    setCompactStatus(
      harvestedTerms.length
        ? `Saved to the app, updated history and phrases, and harvested ${harvestedTerms.length} known term${harvestedTerms.length === 1 ? "" : "s"}.`
        : "Saved to the app and updated history and phrases.",
      "success"
    );
    render();
    return true;
  }

  function performCompactPrint() {
    const text = String(state.compactComposeText || "").trim();
    if (!text) {
      setCompactStatus("Compose is empty.", "error");
      render();
      return false;
    }
    if (!ensureCompactArmedField("No page field armed. Click inside the target page field first, then press Print to Page.")) return false;
    const printed = insertIntoField(smartInsertTermText(text), false);
    if (!printed) {
      setCompactStatus("Print to Page failed for the armed page field. Re-arm the field and try again.", "error");
      render();
      return false;
    }
    const { harvestedTerms } = captureCompactComposeOutput(text);
    closeCompactSitePrintPrompt();
    setCompactStatus(
      harvestedTerms.length
        ? `Printed to the page, updated history and phrases, and harvested ${harvestedTerms.length} known term${harvestedTerms.length === 1 ? "" : "s"}.`
        : "Printed to the page and updated history and phrases.",
      "success"
    );
    render();
    return true;
  }

  function compactSpeechErrorMessage(code) {
    if (code === "not-allowed" || code === "service-not-allowed") return "Microphone access was blocked.";
    if (code === "no-speech") return "No speech was detected.";
    if (code === "audio-capture") return "No microphone input is available.";
    if (code === "network") return "Speech recognition hit a network error.";
    return "Browser speech recognition failed.";
  }

  function createBrowserSpeechAdapter() {
    const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let resultHandler = () => {};
    let errorHandler = () => {};
    let stateHandler = () => {};

    const buildRecognition = () => {
      if (!SpeechCtor) return null;
      const next = new SpeechCtor();
      next.continuous = true;
      next.interimResults = true;
      next.lang = navigator.language || "en-US";
      next.onstart = () => stateHandler({ listening: true });
      next.onend = () => stateHandler({ listening: false });
      next.onerror = (event) => {
        errorHandler({
          code: String(event?.error || "speech-error"),
          message: compactSpeechErrorMessage(event?.error)
        });
      };
      next.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const transcript = String(event.results[index]?.[0]?.transcript || "").trim();
          if (!transcript) continue;
          if (event.results[index].isFinal) finalText += `${finalText ? " " : ""}${transcript}`;
          else interimText += `${interimText ? " " : ""}${transcript}`;
        }
        resultHandler({ finalText, interimText });
      };
      return next;
    };

    return {
      start() {
        if (!SpeechCtor) throw new Error("Speech recognition unavailable");
        if (recognition) {
          try { recognition.abort(); } catch (_) {}
          recognition = null;
        }
        recognition = buildRecognition();
        recognition.start();
      },
      stop() {
        if (!recognition) return;
        try { recognition.stop(); } catch (_) {}
      },
      isAvailable() {
        return !!SpeechCtor;
      },
      onResult(callback) {
        resultHandler = typeof callback === "function" ? callback : () => {};
      },
      onError(callback) {
        errorHandler = typeof callback === "function" ? callback : () => {};
      },
      onStateChange(callback) {
        stateHandler = typeof callback === "function" ? callback : () => {};
      }
    };
  }

  function ensureCompactSpeechAdapter() {
    if (compactSpeechAdapter) return compactSpeechAdapter;
    compactSpeechAdapter = createBrowserSpeechAdapter();
    compactSpeechAdapter.onResult(({ finalText, interimText }) => {
      state.compactSpeechAvailable = compactSpeechAdapter.isAvailable();
      state.compactInterimTranscript = String(interimText || "").trim();
      if (finalText) {
        const appended = appendCompactDictationFinalText(finalText);
        const executedCommand = _pendingCompactMicStopCommand?.command
          ? executeCompactMicStopCommand()
          : false;
        if (appended && !executedCommand) {
          setCompactStatus("Transcript appended to Compose.", "success");
        }
      }
      render();
    });
    compactSpeechAdapter.onError(({ message }) => {
      const shouldExecutePendingCommand = shouldExecuteCompactMicStopCommand();
      state.compactDictationActive = false;
      state.compactInterimTranscript = "";
      state.compactSpeechAvailable = compactSpeechAdapter.isAvailable();
      if (shouldExecutePendingCommand) {
        executeCompactMicStopCommand();
        render();
        return;
      }
      cancelCompactMicStopCommand();
      setCompactStatus(message || "Browser speech recognition failed.", "error");
      render();
    });
    compactSpeechAdapter.onStateChange(({ listening }) => {
      state.compactDictationActive = !!listening;
      if (!listening) {
        state.compactInterimTranscript = "";
        if (shouldExecuteCompactMicStopCommand()) executeCompactMicStopCommand();
      }
      render();
    });
    state.compactSpeechAvailable = compactSpeechAdapter.isAvailable();
    return compactSpeechAdapter;
  }

  function compactSpeechAvailable() {
    return ensureCompactSpeechAdapter().isAvailable();
  }

  function toggleCompactDictation() {
    const adapter = ensureCompactSpeechAdapter();
    state.compactSpeechAvailable = adapter.isAvailable();
    if (!adapter.isAvailable()) {
      cancelCompactMicStopCommand();
      state.compactDictationActive = false;
      state.compactInterimTranscript = "";
      setCompactStatus("Browser speech recognition is unavailable here. The rest of the compact tagger still works normally.", "error");
      render();
      return false;
    }
    if (state.compactDictationActive) {
      _compactMicStopRequested = true;
      adapter.stop();
      scheduleCompactMicStopCommandExecution();
      setCompactStatus("Dictation stopped.", "info");
      render();
      return false;
    }
    try {
      cancelCompactMicStopCommand();
      state.compactInterimTranscript = "";
      adapter.start();
      state.compactDictationActive = true;
      setCompactStatus("Listening…", "info");
      render();
      return true;
    } catch (error) {
      state.compactDictationActive = false;
      state.compactInterimTranscript = "";
      setCompactStatus(error?.message || "Browser speech recognition could not start.", "error");
      render();
      return false;
    }
  }

  function handleGlobalHotkeys(event) {
    if (isCompactOnlyRenderBindPath()) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    if (!pluginHotkeyContext()) return;
    const rawKey = String(event.key || "");
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const target = path[0] || event.target;
    const activeShadowEl = shadow?.activeElement;
    const composerKeyActive = activeShadowEl?.id === "bp-composer-text" || activeShadowEl?.id === "bp-compact-compose";
    const myuiEditableTarget = isEditableNode(target) && isMyuiShadowNode(target) &&
      target?.id !== "bp-search" && target?.id !== "bp-composer-text" && target?.id !== "bp-compact-compose";
    const myuiEditableActive = isEditableNode(activeShadowEl) && isMyuiShadowNode(activeShadowEl) &&
      activeShadowEl?.id !== "bp-search" && activeShadowEl?.id !== "bp-composer-text" && activeShadowEl?.id !== "bp-compact-compose";
    if (composerKeyActive && (
      rawKey.length === 1 ||
      rawKey === "Backspace" || rawKey === "ArrowLeft" || rawKey === "ArrowRight" ||
      rawKey === "ArrowUp" || rawKey === "ArrowDown" ||
      rawKey === "Home" || rawKey === "End" ||
      rawKey === "Enter" || rawKey === "Tab"
    )) {
      return;
    }
    if (myuiEditableTarget || myuiEditableActive) return;
    if (rawKey === "Backspace") {
      const composeActive = activeShadowEl?.id === "bp-composer-text";
      if (!composeActive && !isEditableNode(target) && !isEditableNode(activeShadowEl)) {
        event.preventDefault();
      }
      if (!composeActive) return;
    }
    if ((rawKey === "Shift" || event.key === "Shift") && state.searchOnlyMode) {
      event.preventDefault();
      state.searchCatsVisible = !state.searchCatsVisible;
      savePrefs();
      render();
      return;
    }
    const searchInput = shadow?.getElementById("bp-search");
    if (document.activeElement === searchInput || activeShadowEl === searchInput) return;
    if (isEditableNode(target) || isEditableNode(activeShadowEl)) {
      // Bypass 1: Compose is pinned — all QuickTag keys route to compose regardless of arm state
      const composeBypass = (state.quickComposePinned || state.composerStealing) &&
                            state.sessionOpen && !state.sessionMinimized;
      // Bypass 2: Hotkeys explicitly armed by the user
      const armedBypass = state.quickHotkeysArmed && state.sessionOpen && !state.sessionMinimized;
      if (!composeBypass && !armedBypass) return;
      // Only pass through QuickTag-specific key groups; everything else stays suppressed
      const isQtKey = TERMS_HOTKEYS.includes(rawKey) ||
                      CONN_HOTKEYS.includes(rawKey)  ||
                      rawKey === "/" || rawKey === ":" || rawKey === "," || rawKey === "|" ||
                      rawKey === "=" || rawKey === "-" || rawKey === "0" ||
                      /^[1-9]$/.test(rawKey);
      if (!isQtKey) return;
    }
    const searchInputEl = shadow?.getElementById("bp-search");
    if (document.activeElement === searchInputEl || activeShadowEl === searchInputEl) return;
    const quickActive = state.sessionOpen && !state.sessionMinimized;
    const quickTarget = state.quickAltTarget === "phrases" ? "phrases" : "connect";
    const quickTermsList = getHotkeyWindow(quickHotkeyList("terms"), state.quickTermsHotkeyOffset || 0);
    const quickConnList = getHotkeyWindow(quickHotkeyList("connect"), state.quickConnHotkeyOffset || 0);
    const quickPhrasesList = getHotkeyWindow(quickHotkeyList("phrases"), state.quickPhrasesHotkeyOffset || 0);

    if (!quickActive && rawKey === "Escape" && state.quickHotkeysArmed) {
      event.preventDefault();
      state.quickHotkeysArmed = false;
      savePrefs();
      render();
      return;
    }

    if (quickActive) {
      if (rawKey === "Escape") {
        if (state.quickHotkeysArmed || state.quickModifierArmed) {
          event.preventDefault();
          state.quickHotkeysArmed = false;
          state.quickModifierArmed = false;
          state.quickModifier = null;
          savePrefs();
          render();
        }
        return;
      }

      if (rawKey === ":") {
        event.preventDefault();
        const nextArmed = !(state.quickModifierArmed && state.quickModifier === "plural");
        state.quickModifierArmed = nextArmed;
        state.quickModifier = nextArmed ? "plural" : null;
        savePrefs();
        render();
        return;
      }
      if (rawKey === ",") {
        event.preventDefault();
        const nextArmed = !(state.quickModifierArmed && state.quickModifier === "adverb");
        state.quickModifierArmed = nextArmed;
        state.quickModifier = nextArmed ? "adverb" : null;
        savePrefs();
        render();
        return;
      }
      if (rawKey === "|") {
        event.preventDefault();
        const nextArmed = !(state.quickModifierArmed && state.quickModifier === "secondary");
        state.quickModifierArmed = nextArmed;
        state.quickModifier = nextArmed ? "secondary" : null;
        savePrefs();
        render();
        return;
      }
      if (rawKey === "/") {
        event.preventDefault();
        state.quickAltTarget = quickTarget === "connect" ? "phrases" : "connect";
        state.quickLastActiveSection = state.quickAltTarget;
        savePrefs();
        render();
        return;
      }
      if (rawKey === "=" || rawKey === "+") {
        event.preventDefault();
        scrollQuickHotkeyWindow(1);
        render();
        return;
      }
      if (rawKey === "-") {
        event.preventDefault();
        scrollQuickHotkeyWindow(-1);
        render();
        return;
      }
      if (rawKey === "0") {
        event.preventDefault();
        resetQuickHotkeyWindow();
        render();
        return;
      }

      const termsIdx = TERMS_HOTKEYS.indexOf(rawKey);
      if (termsIdx !== -1) {
        event.preventDefault();
        const item = quickTermsList[termsIdx];
        if (!item) return;
        const term = TERM_MAP.get(item.key) || null;
        const modifier = state.quickModifierArmed ? state.quickModifier : null;
        const rawText = term
          ? (activeInsertText(term, activeCategoryRoute(term) || "") || item.text || "")
          : (item.text || "");
        const text = modifier
          ? (term ? applyTermModifier(term, modifier) : applyModifierToText(rawText, modifier))
          : rawText;
        state.quickLastActiveSection = "terms";
        state.quickModifier = null;
        state.quickModifierArmed = false;
        routeInsert(text, "term");
        render();
        return;
      }

      const connIdx = CONN_HOTKEYS.indexOf(rawKey);
      if (connIdx !== -1) {
        event.preventDefault();
        const key = quickTarget === "phrases" ? "phrases" : "connect";
        const item = key === "phrases" ? quickPhrasesList[connIdx] : quickConnList[connIdx];
        if (!item) return;
        const rawText = typeof item === "string" ? item : (item.text || item.p || "");
        const modifier = state.quickModifierArmed ? state.quickModifier : null;
        const text = modifier ? applyModifierToText(rawText, modifier) : rawText;
        state.quickLastActiveSection = key;
        state.quickModifier = null;
        state.quickModifierArmed = false;
        routeInsert(text, key === "connect" ? "connector" : "term");
        render();
        return;
      }
    }

    const catShortcutSection = CAT_HOTKEY_SECTION[rawKey.toLowerCase()];
    if (catShortcutSection) {
      event.preventDefault();
      if (event.repeat && state.hotkeySectionKey === catShortcutSection) return;
      activateSectionHotkey(catShortcutSection);
      return;
    }

    const topIndex = sectionIndexByHotkey(rawKey);
    if (topIndex !== -1) {
      event.preventDefault();
      const section = topSections()[topIndex];
      if (!section) return;
      if (event.repeat && state.hotkeySectionKey === section.key) return;
      activateSectionHotkey(section.key);
      return;
    }
    if (/^[1-9]$/.test(rawKey) && state.hotkeySectionKey) {
      event.preventDefault();
      toggleCategoryByIndex(state.hotkeySectionKey, Number(rawKey) - 1);
    }
  }


  function handleGlobalHotkeysRelease(event) {
    if (isCompactOnlyRenderBindPath()) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    if (!pluginHotkeyContext()) return;
    const rawKey = String(event.key || "");
    const catShortcutSection = CAT_HOTKEY_SECTION[rawKey.toLowerCase()];
    if (catShortcutSection) {
      releaseSectionHotkey(catShortcutSection);
      return;
    }
    const topIndex = sectionIndexByHotkey(rawKey);
    if (topIndex !== -1) {
      const section = topSections()[topIndex];
      if (section) releaseSectionHotkey(section.key);
    }
  }

  function handleToolTrayKeys(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const target = path[0] || event.target;
    const activeShadowEl = shadow?.activeElement;
    if ((event.metaKey || event.ctrlKey) && String(event.key || "").toLowerCase() === "z") {
      if (isEditableNode(target) || isEditableNode(activeShadowEl)) return;
      event.preventDefault();
      const redone = event.shiftKey ? redoToolHistory() : undoToolHistory();
      if (redone) render();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== "Delete") return;
    if (isEditableNode(target) || isEditableNode(activeShadowEl)) return;
    const sec = state.selectedToolSec;
    const idx = state.selectedToolIndex;
    const list = sec ? getToolList(sec) : null;
    if (!list || !list[idx]) return;
    event.preventDefault();
    const label = toolItemLabel(list[idx]) || toolItemText(list[idx]);
    if (!window.confirm(`Delete "${label}" from ${toolLabel(sec)}?`)) return;
    pushToolHistory();
    list.splice(idx, 1);
    state.selectedToolIndex = -1;
    render();
  }

  function init() {
    if (injected) return;
    injected = true;

    host = document.createElement("div");
    host.id = "myui-host";
    host.style.cssText = [
      "all: initial",
      "position: fixed",
      "inset: 0",
      "z-index: 2147483647",
      "pointer-events: none",
      "font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    ].join(";");

    document.documentElement.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });

    host.addEventListener("mousedown", (e) => {
      // Prevent focus steal on all MYUI interactions
      // EXCEPT inputs inside the shadow (search, composer, editor cells)
      const rawTarget = e.composedPath?.()?.[0] || e.target;
      const target = rawTarget?.nodeType === 1 ? rawTarget : rawTarget?.parentElement || e.target;
      const tag = target?.tagName;
      const buttonLike = target?.closest?.("button,a,[role=button]");
      const toolChip = target?.closest?.("[data-tool-chipsec][data-tool-chip]");
      if (isCompactOnlyRenderBindPath()) {
        if ((buttonLike || toolChip) && shadow?.activeElement?.id === "bp-compact-compose") {
          queueComposerRestoreSnapshot();
        }
        return;
      }
      if (buttonLike || toolChip) {
        if (shadow?.activeElement?.id === "bp-compact-compose") {
          queueComposerRestoreSnapshot();
        }
        return;
      }
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      e.preventDefault();
    }, true);

    styleNode = document.createElement("style");
    shadow.appendChild(styleNode);
    contentNode = document.createElement("div");
    contentNode.style.display = "contents";
    shadow.appendChild(contentNode);
    bindDelegatedEvents();

    shadow.addEventListener("mousemove", (event) => {
      state.hoverX = event.clientX;
      state.hoverY = event.clientY;
      syncHoverTooltip();
    });

    document.addEventListener("pointerdown", (event) => {
      if (!shouldTrackDocumentArmedField()) return;
      const target = event.composedPath?.()?.[0] || event.target;
      if (host?.contains(target) || isMyuiShadowNode(target)) return;
      const field = resolveEditableField(target);
      if (!field) return;
      armWriteField(field);
      captureArmedFieldSelectionFromPointer(field, event);
    }, true);

    document.addEventListener("focusin", (event) => {
      if (!shouldTrackDocumentArmedField()) return;
      const target = event.composedPath?.()?.[0] || event.target;
      if (host?.contains(target) || isMyuiShadowNode(target)) return;
      const field = resolveEditableField(target);
      if (!field) return;
      const changed = armWriteField(field, { captureNow: true });
      if (changed && isCompactQuickTagMode()) render();
    }, true);

    document.addEventListener("selectionchange", () => {
      if (!shouldTrackDocumentArmedField()) return;
      const field = currentWriteField();
      if (!field) return;
      const active = document.activeElement;
      const selection = window.getSelection?.();
      const inFieldSelection = !!(selection?.rangeCount && field.contains(selection.anchorNode) && field.contains(selection.focusNode));
      const inputFieldActive = active === field && (field.tagName === "INPUT" || field.tagName === "TEXTAREA");
      if (inFieldSelection || inputFieldActive) snapshotArmedFieldSelection(field);
    }, true);

    document.addEventListener("focusout", () => {
      setTimeout(() => {
        const field = getStoredArmedField();
        if (field && !document.contains(field)) {
          clearArmedField(field);
          render();
        }
      }, 0);
    }, true);

    setInterval(() => {
      const field = getStoredArmedField();
      if (field && !document.contains(field)) {
        clearArmedField(field);
      }
    }, 1000);

    if (shouldInstallLegacyDocumentHotkeys()) {
      document.addEventListener("keydown", handleGlobalHotkeys, true);
      document.addEventListener("keyup", handleGlobalHotkeysRelease, true);
    }
    if (shouldInstallCompactWindowHotkeys()) {
      document.addEventListener("keydown", handleCompactWindowHotkeys, true);
    }
    document.addEventListener("keydown", handleToolTrayKeys, true);

    window.addEventListener("myui:toggle", () => {
      if (!_initReady) { _pendingToggle = !_pendingToggle; return; }
      state.appActive = !state.appActive;
      if (state.appActive) {
        if (isCompactQuickTagMode()) enterCompactQuickTagMode();
        else {
          state.visible = true;
          state.sessionOpen = true;
          state.quickComposePinned = true;
          state.listenMode = "word";
        }
        if (shouldStartLegacyListenRuntime()) startListening();
      } else {
        if (state.compactDictationActive) toggleCompactDictation();
        if (shouldStartLegacyListenRuntime()) stopListening();
        state.visible = false;
      }
      render();
    });

    Promise.all([loadPrefs(), loadMasterRows(), loadCompactSourceRows(), loadCompactData(), loadStyles()]).finally(() => {
      finalizeCompactLibraryState();
      rebuildRuntimeData();
      state.queryInput = typeof state.queryInput === "string" ? state.queryInput : state.query;
      state.query = typeof state.query === "string" ? state.query : String(state.queryInput || "").trim();
      state.compactSpeechAvailable = compactSpeechAvailable();
      _initReady = true;
      if (_pendingToggle) {
        _pendingToggle = false;
        state.appActive = !state.appActive;
        if (state.appActive) {
          if (isCompactQuickTagMode()) enterCompactQuickTagMode();
          else {
            state.visible = true;
            state.sessionOpen = true;
            state.quickComposePinned = true;
            state.listenMode = "word";
          }
        } else {
          if (state.compactDictationActive) toggleCompactDictation();
          state.visible = false;
        }
      }
      state.quickComposePinned = true;
      state.listenMode = "word";
      if (state.appActive && isCompactQuickTagMode()) enterCompactQuickTagMode();
      else if (state.appActive) state.sessionOpen = true;
      if (shouldStartLegacyListenRuntime()) startListening();
      render();
      window.addEventListener("resize", () => {
        state.panelWidth = clamp(state.panelWidth, PANEL_MIN_WIDTH, Math.min(window.innerWidth - 20, PANEL_MAX_WIDTH));
        state.panelHeight = clamp(state.panelHeight, PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 20, PANEL_MAX_HEIGHT));
        const pos = clampFloatPosition(state.floatX, state.floatY);
        state.floatX = pos.x;
        state.floatY = pos.y;
        const sessionPos = clampSessionPosition(state.sessionX, state.sessionY, state.sessionWidth, state.sessionHeight);
        state.sessionX = sessionPos.x;
        state.sessionY = sessionPos.y;
        state.sessionWidth = sessionPos.width;
        state.sessionHeight = sessionPos.height;
        const compactTermsPos = clampSessionPosition(state.compactTermsX, state.compactTermsY, state.compactTermsWidth, state.compactTermsHeight);
        state.compactTermsX = compactTermsPos.x;
        state.compactTermsY = compactTermsPos.y;
        state.compactTermsWidth = compactTermsPos.width;
        state.compactTermsHeight = compactTermsPos.height;
        const compactTagsPos = clampSessionPosition(state.compactTagsX, state.compactTagsY, state.compactTagsWidth, state.compactTagsHeight);
        state.compactTagsX = compactTagsPos.x;
        state.compactTagsY = compactTagsPos.y;
        state.compactTagsWidth = compactTagsPos.width;
        state.compactTagsHeight = compactTagsPos.height;
        const compactPrintsPos = clampSessionPosition(state.compactPrintsX, state.compactPrintsY, state.compactPrintsWidth, state.compactPrintsHeight);
        state.compactPrintsX = compactPrintsPos.x;
        state.compactPrintsY = compactPrintsPos.y;
        state.compactPrintsWidth = compactPrintsPos.width;
        state.compactPrintsHeight = compactPrintsPos.height;
        const compactPhrasesPos = clampSessionPosition(state.compactPhrasesX, state.compactPhrasesY, state.compactPhrasesWidth, state.compactPhrasesHeight);
        state.compactPhrasesX = compactPhrasesPos.x;
        state.compactPhrasesY = compactPhrasesPos.y;
        state.compactPhrasesWidth = compactPhrasesPos.width;
        state.compactPhrasesHeight = compactPhrasesPos.height;
        const compactSessionTermsPos = clampSessionPosition(
          state.compactSessionTermsX,
          state.compactSessionTermsY,
          state.compactSessionTermsWidth,
          state.compactSessionTermsHeight
        );
        state.compactSessionTermsX = compactSessionTermsPos.x;
        state.compactSessionTermsY = compactSessionTermsPos.y;
        state.compactSessionTermsWidth = compactSessionTermsPos.width;
        state.compactSessionTermsHeight = compactSessionTermsPos.height;
        render();
      });
      const persistOnLifecycle = () => savePrefs();
      window.addEventListener("pagehide", persistOnLifecycle, true);
      window.addEventListener("beforeunload", persistOnLifecycle, true);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "visible") {
          // When stayActive is off, collapse the panel on tab/window defocus
          if (!state.stayActive && state.visible) {
            state.visible = false;
            render();
          }
          savePrefs();
        }
      }, true);
    });
  }

  function sanitizeToolList(items) {
    if (!Array.isArray(items)) return [];
    return items.slice(0, 120).map((item) => ({
      text: String(item?.text || "").trim(),
      display: String(item?.display || item?.text || "").trim(),
      label: String(item?.label || item?.text || "").trim(),
      active: item?.active !== false
    })).filter((item) => item.text || item.display || item.label);
  }

  function sanitizeSessionItems(items) {
    if (!Array.isArray(items)) return [];
    return items.slice(0, 120).map((item, index) => ({
      key: String(item?.key || `${index}`).trim(),
      shortcut: String(item?.shortcut || "").trim(),
      text: String(item?.text || "").trim(),
      count: Math.max(1, Number(item?.count) || 1),
      updatedAt: Number(item?.updatedAt) || Date.now()
    })).filter((item) => item.key && item.text);
  }

  function clearSessionWorkingState(options = {}) {
    const closeSessionUi = options.closeSessionUi !== false;
    const closeComposerUi = options.closeComposerUi !== false;
    const closeToolTrays = options.closeToolTrays !== false;

    state.sessionItems = [];
    state.sessionPage = 0;
    state.sessionMinimized = false;
    if (closeSessionUi) state.sessionOpen = false;

    state.instrumentsList = [];
    state.vibeList = [];
    if (closeToolTrays) {
      setToolTrayOpen("instruments", false);
      setToolTrayOpen("vibes", false);
      setToolTrayExpanded("instruments", false);
      setToolTrayExpanded("vibes", false);
    }
    state.selectedToolIndex = -1;

    state.composerText = "";
    state.composerPills = [];
    state.composerSelectedPillId = null;
    state.composerDragId = null;
    state.composerNextCapitalise = false;
    state.composerPendingPillMeta = null;
    state.composerFocused = false;
    state.compactComposeText = "";
    state.compactInterimTranscript = "";
    state.compactDictationActive = false;
    clearCompactStatus();
    if (compactSpeechAdapter) compactSpeechAdapter.stop();
    if (closeComposerUi) state.composerOpen = false;

    state.composerChips = [];
    state.composerChipCounter = 0;
    state.confirmNextTrack = false;
    state.quickTermsHotkeyOffset = 0;
    state.quickConnHotkeyOffset = 0;
    state.quickPhrasesHotkeyOffset = 0;
    state.quickHotkeysArmed = false;
    state.quickMoveMode = null;
    state.quickMovePillIdx = null;
    state.connDeleteArmed = false;
    state.connDeleteTarget = null;
    state.listenConnectives = [];
  }

  // ── Persistence module (loaded from persist.js via globalThis) ──
  const { buildPrefsSnapshot, readPageStorage, applyPrefs, loadPrefs, savePrefs } = globalThis.__MYUI_createPersistModule({
    state, clamp, clampFloatPosition, clampSessionPosition,
    STORAGE_KEY, LEGACY_STORAGE_KEYS, PAGE_STORAGE_KEY, MYUI_BUILD,
    PANEL_MIN_WIDTH, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MAX_HEIGHT,
  });

  function assetUrl(path) {
    const safePath = String(path || "").replace(/^\/+/, "");
    try {
      if (chrome?.runtime?.getURL) return chrome.runtime.getURL(safePath);
    } catch (_) {}
    const base = String(globalThis.__MYUI_ASSET_BASE__ || "").trim();
    if (!base) return "";
    try {
      return new URL(safePath, base).toString();
    } catch (_) {
      return `${base.replace(/\/?$/, "/")}${safePath}`;
    }
  }

  async function loadStyles() {
    const url = assetUrl("styles.css");
    if (!url) {
      console.warn("[MYUI] Failed to resolve styles.css URL.");
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[MYUI] Failed to load styles.css (${response.status}).`, url);
        return;
      }
      const css = await response.text();
      if (!styleNode) {
        console.warn("[MYUI] Shadow style node was missing when styles.css loaded.");
        return;
      }
      styleNode.textContent = css;
      if (!css.trim()) console.warn("[MYUI] Loaded empty styles.css text.", url);
    } catch (error) {
      console.warn("[MYUI] Failed to load styles.css.", error);
    }
  }

  async function devReset() {
    const confirmed = window.confirm("Hard reset MYUI? This clears all saved MYUI data, including templates, edited terms, and settings.");
    if (!confirmed) return;

    try { window.localStorage?.removeItem(PAGE_STORAGE_KEY); } catch (_) {}

    const keysToRemove = [STORAGE_KEY, MASTER_STORAGE_KEY, COMPACT_STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    try {
      const area = chrome?.storage?.local;
      if (area) {
        await new Promise((resolve) => {
          try {
            const maybe = area.remove(keysToRemove, () => resolve());
            if (maybe?.then) maybe.then(resolve).catch(() => resolve());
          } catch (_) {
            resolve();
          }
        });
      }
    } catch (_) {}

    clearSessionWorkingState({ closeSessionUi: true, closeComposerUi: true, closeToolTrays: true });
    state.quickPhrases = [];
    state.quickTermsViewMode = "user";
    state.quickConnectOrderMode = "user";
    state.quickPhrasesOrderMode = "user";
    state.undefinedTerms = [];
    CUSTOM_TERM_ENTRIES = [];
    COMPACT_ACTIVE_ROWS = [];
    LEGACY_COMPACT_CUSTOM_ENTRIES = [];
    state.compactPrintHistory = [];
    state.compactPhraseBank = [];
    state.compactManualPhraseBank = [];
    COMPACT_SOURCE_ROWS = [];
    COMPACT_TERMS = [];
    COMPACT_TERM_MAP = new Map();
    window.location.reload();
  }

  async function loadMasterRows() {
    const area = chrome?.storage?.local;
    if (!area) {
      MASTER_ROWS = DEFAULT_MASTER_ROWS.map((row) => ({ ...row }));
      return;
    }
    try {
      const stored = await new Promise((resolve) => {
        try {
          const maybe = area.get(MASTER_STORAGE_KEY, (value) => resolve(value));
          if (maybe?.then) maybe.then(resolve).catch(() => resolve({}));
        } catch (_) {
          resolve({});
        }
      });
      const rows = stored?.[MASTER_STORAGE_KEY]?.rows;
      MASTER_ROWS = Array.isArray(rows) && rows.length
        ? rows.map((row, index) => normalizeMasterRow(row, index))
        : DEFAULT_MASTER_ROWS.map((row) => ({ ...row }));
    } catch (_) {
      MASTER_ROWS = DEFAULT_MASTER_ROWS.map((row) => ({ ...row }));
    }
  }

  function saveMasterRows(message = "Saved") {
    MASTER_ROWS = MASTER_ROWS.map((row, index) => normalizeMasterRow(row, index));
    rebuildRuntimeData();
    state.editorMessage = message;
    state.masterDirty = false;
    const area = chrome?.storage?.local;
    if (!area) {
      render();
      return;
    }
    const payload = { [MASTER_STORAGE_KEY]: { rows: MASTER_ROWS } };
    try {
      const maybe = area.set(payload, () => {
        render();
      });
      if (maybe?.then) {
        maybe.then(() => render()).catch(() => render());
      }
    } catch (_) {
      render();
    }
  }

  function restoreDefaultMasterRows() {
    MASTER_ROWS = DEFAULT_MASTER_ROWS.map((row) => ({ ...row }));
    saveMasterRows("Restored defaults");
  }

  function confirmTempTermAdd() {
    const text = state.tempTermsPendingText.trim();
    if (!text) {
      state.tempTermsAwaitingShortcut = false;
      render(); return;
    }
    const shortcut = state.tempTermsShortcutInput.trim();
    const entry = shortcut ? { text, shortcut, source: "manual" } : text;
    const norm = normalize(text);
    if (!state.undefinedTerms.some(u => normalize(undefinedTermText(u)) === norm)) {
      state.undefinedTerms = [entry, ...state.undefinedTerms].slice(0, 200);
    }
    state.tempTermsAwaitingShortcut = false;
    state.tempTermsPendingText = "";
    state.tempTermsShortcutInput = "";
    savePrefs();
    saveCompactData();
    render();
  }

  function confirmTempTermEdit(idx) {
    const text = state.tempTermsEditText.trim();
    if (!text) { state.tempTermsEditTarget = null; render(); return; }
    const shortcut = state.tempTermsEditShortcut.trim();
    const entry = shortcut ? { text, shortcut, source: "manual" } : text;
    const norm = normalize(text);
    const isDupe = state.undefinedTerms.some((u, i) => i !== idx && normalize(undefinedTermText(u)) === norm);
    if (!isDupe) {
      state.undefinedTerms = state.undefinedTerms.map((u, i) => i === idx ? entry : u);
    }
    state.tempTermsEditTarget = null;
    state.tempTermsEditText = "";
    state.tempTermsEditShortcut = "";
    savePrefs();
    saveCompactData();
    render();
  }

  function exportTempTermsToAI() {
    const header = "section_key,category,shortcut,term,notes";
    const rows = state.undefinedTerms.map(entry => {
      const text = undefinedTermText(entry);
      const shortcut = undefinedTermShortcut(entry);
      return `"","","${shortcut.replace(/"/g, '""')}","${text.replace(/"/g, '""')}",""`;
    });
    const csv = [header, ...rows].join("\n");
    const prompt = `You are preparing a MYUI import dataset.

The CSV below contains uncategorised terms collected during annotation sessions.
Process ONLY the rows where section_key is empty.
Do NOT alter rows that already have a section_key.

For each uncategorised term:
- Assign section_key (one of: connect, feel, sound, form, instruments, mix)
- Assign category (short grouping label matching existing categories where possible)
- Propose shortcut if missing (2-6 chars, vowels stripped)
- Add a one-sentence definition in notes
- Mark connector/linking words with section_key = connect
- Prefix uncertain notes with ?

Output the complete CSV including already-categorised rows unchanged.
Do not add markdown or code fences.

--- CSV ---
${csv}`;
    if (!navigator.clipboard?.writeText) {
      state.editorMessage = "Copy failed — check browser permissions";
      render();
      return;
    }
    navigator.clipboard.writeText(prompt).then(() => {
      state.editorMessage = `Exported ${state.undefinedTerms.length} terms — prompt copied to clipboard`;
      render();
    }).catch(() => {
      state.editorMessage = "Copy failed — check browser permissions";
      render();
    });
  }

  function qsOrderBtn(key) {
    if (key === "terms") {
      const labels = { user: "Order: User", az: "Order: A–Z", cat: "Order: Cat" };
      return `<button class="qs-order-btn" id="bp-terms-view-cycle" type="button" title="Cycle order">${labels[state.quickTermsViewMode] || "Order: User"}</button>`;
    }
    if (key === "connect") {
      return `<button class="qs-order-btn" id="bp-connect-order-cycle" type="button" title="Cycle order">${state.quickConnectOrderMode === "az" ? "Order: A–Z" : "Order: User"}</button>`;
    }
    if (key === "phrases") {
      return `<button class="qs-order-btn" id="bp-phrases-order-cycle" type="button" title="Cycle order">${state.quickPhrasesOrderMode === "az" ? "Order: A–Z" : "Order: User"}</button>`;
    }
    return "";
  }

  // ── Render module (loaded from render.js) ─────────────────────────────────
  const createRenderModule = ACTIVE_RENDER_BIND_PATH === "compact-only"
    ? (globalThis.__MYUI_createCompactRenderModule || globalThis.__MYUI_createRenderModule)
    : globalThis.__MYUI_createRenderModule;

  const {
    render,
    bindDelegatedEvents,
    updateHelpHighlight,
    syncHoverTooltip,
  } = createRenderModule({
    state,
    // — utilities —
    esc, normalize, clamp, clampFloatPosition, clampSessionPosition,
    cssEscape, stripCode, termKey, boolish, titleCase,
    // — section / category —
    sectionLabel, sectionDescription, sectionHotkey, sectionSortIndex,
    sectionIndexByHotkey, displayCategory, categoryMetaFromTerm,
    activeCategoryRoute, activeSearchScopeLabel, currentSectionEntries,
    // — data / queries —
    getConnectives, sortedConnectives,
    visibleTermsInScope, categorySummaries, categorySearchHaystack,
    searchOnlyBlocks, matchesQuery, suffixRank, sortTerms, visibleHelpTerms,
    currentWriteField, currentWriteState, publishTarget,
    datasetAnchor, cardVars, activeMasterRows, groupedTerms,
    sectionChipVars, categoryChipVars, topSections, sectionCount,
    getHelpText,
    // — editor helpers —
    editorSections, editorCategories, editorCategoryTemplates, editorVisibleRows,
    duplicateShortcutConflicts, duplicateTermConflicts,
    conflictingRows, rowConflictDetails, addInlineCategoryRow, buildSectionMeta,
    inlineCategoryRows,
    // — undefined-term helpers —
    undefinedTermText, undefinedTermShortcut,
    // — hotkey helpers —
    getHotkeyWindow, quickHotkeyList, quickHotkeyOffsetKey, pluginHotkeyContext,
    quickHotkeySectionKey, scrollQuickHotkeyWindow, resetQuickHotkeyWindow,
    activateSectionHotkey, releaseSectionHotkey,
    toggleSectionByIndex, toggleCategoryByIndex,
    // — insert / composer —
    insertTermIntoFocusedField, insertChips, insertAtComposerCursor,
    syncComposerText, flushComposerPendingText, reconcileComposerTypedInput,
    joinComposerPills, getComposerResolvedText, getComposerPendingTextFromValue,
    composerPillsFromPendingText,
    // — compact quick-tag —
    isCompactQuickTagMode, compactVisibleGroups, compactGroupOptions,
    enterCompactQuickTagMode, enterLegacyQuickTagMode,
    compactComposeHasMeaningfulText, openCompactSitePrintPrompt, closeCompactSitePrintPrompt,
    resetCompactLibraryToDefault, exportCompactLibraryFiles, importCompactLibraryFile,
    clearCompactMicStopCommand, cancelCompactMicStopCommand, queueCompactCustomTerm, appendCompactComposeText, appendCompactTermByKey, performCompactAppPrint, performCompactPrint, performCompactToolPrint,
    useCompactHistoryEntry, useCompactPhraseEntry, addCompactManualPhrase, saveCompactCustomTerm, toggleCompactDictation,
    deleteCompactHistoryEntry, deleteCompactPhraseEntry, deleteCompactUndefinedEntry,
    clearCompactSessionData, clearCompactSessionTerms, deleteCompactSessionTerm,
    collectCompactUndefinedTerms,
    // — input snapshots —
    searchInputSnapshot, restoreSearchInput,
    qsInputSnapshot, restoreQsInput,
    composerInputSnapshot, restoreComposerInput,
    // — search —
    commitSearch, syncLiveSearch,
    // — layout —
    isHorizontalDock, isFloatDock, currentShellWidth, currentShellHeight,
    shellInlineStyle, snapDockFromPoint, syncPageInset,
    // — QuickTag ops —
    addToQsSection, executeQsDelete,
    addTermToSession, sessionTermAt, writeSessionItem,
    // — tool tray ops —
    getToolList, activeInsertText, toolButtonLabel, toolLabel,
    toolItemText, toolItemDisplay, toolItemLabel,
    printableToolTexts, isToolTrayOpen, isToolTrayExpanded,
    setToolTrayOpen, setToolTrayExpanded, toggleToolTray, ensureToolTrayOpen,
    pushToolHistory, undoToolHistory, redoToolHistory,
    // — persist —
    savePrefs, saveCompactData, saveMasterRows, restoreDefaultMasterRows, queuePrefsSave,
    validateAndSetInputTerms, parseInputTerms,
    exportMasterCsv, exportPlist, downloadText,
    // — editor ops —
    createEditorRowFromContext, saveAndExportAll, setEditorMessage,
    // — session —
    sanitizeToolList, sanitizeSessionItems, clearSessionWorkingState,
    // — modifier —
    applyModifierToText, applyTermModifier,
    // — field arming —
    resolveEditableField, armWriteField, captureArmedFieldSelectionFromPointer,
    focusComposerAfterArming,
    // — term activation —
    termByKey, handleTermActivation, flashTermByKey, insertIntoField, routeInsert,
    smartInsertTermText,
    // — audio —
    startListening, stopListening,
    // — dev —
    devReset, rebuildRuntimeData,
    // — non-render action helpers (relocated in step 1) —
    confirmTempTermAdd, confirmTempTermEdit, exportTempTermsToAI, qsOrderBtn,
    // — early render helpers (defined before this block) —
    renderDirtyBanner, renderInlineCategoryEditor,
    // — constants —
    MYUI_BUILD, SECTION_HOTKEYS,
    HOTKEY_WINDOW_SIZE, TERMS_HOTKEYS, CONN_HOTKEYS,
    PANEL_MIN_WIDTH, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MAX_HEIGHT,
    SESSION_MIN_WIDTH, SESSION_MAX_WIDTH, SESSION_MIN_HEIGHT, SESSION_MAX_HEIGHT,
    TOOL_TRAY_WIDTH, ALL_SECTIONS_KEY, TERM_DEF_LOOKUP,
  });

  init();
})();
} // end __myui_content_loaded guard
