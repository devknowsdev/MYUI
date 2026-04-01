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
  const SESSION_MAX_WIDTH = 520;
  const SESSION_MIN_HEIGHT = 160;
  const SESSION_MAX_HEIGHT = 520;

  const STORAGE_KEY = "myuiPrefsV1";
  const LEGACY_STORAGE_KEYS = [];
  const PAGE_STORAGE_KEY = "myuiPrefsPageV1";
  const MASTER_STORAGE_KEY = "myuiMasterV1";
  const MYUI_BUILD = "2026-03-31-b14"; // persistent armed-field print target, live-safe focus lock
  globalThis.MYUI_BUILD = MYUI_BUILD;
  globalThis.__MYUI_BUILD__ = MYUI_BUILD;
  globalThis.__MYUI_PATCH_LABEL__ = "persistent-armed-field-print-target-live-safe";
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
    sessionX: Math.max(24, window.innerWidth - 336),
    sessionY: 96,
    sessionWidth: 288,
    sessionHeight: 232,
    sessionItems: [],
    sessionMinimized: false,
    sessionPage: 0,
    fullSentenceMode: false,
    composerText: "",
    composerOpen: false,
    composerFocused: false,
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
  let collapseTimer = null;
  let isResizing = false;
  let dockDragUntil = 0;
  let toolUndoStack = [];
  let toolRedoStack = [];
  let styleNode = null;
  let contentNode = null;
  let renderScheduled = false;
  let _savePrefsTimer = null;
  let _initReady = false;
  let _pendingToggle = false;
  let _listenCleanup = null;


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
      clearTimeout(_savePrefsTimer);
      _savePrefsTimer = setTimeout(savePrefs, 600);
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

  function activeMasterRows() {
    return MASTER_ROWS.filter((row) => !row.deleted && !row.hidden);
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

  function parseCsvLine(line) {
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
        else if (ch === ',') { fields.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
    }
    fields.push(cur.trim());
    return fields;
  }

  function parseInputTerms(raw) {
    const lines = String(raw || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results = [];
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const fields = parseCsvLine(line);
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
    const searchInput = shadow?.getElementById("bp-search");
    if (!searchInput || active !== searchInput) return null;
    return {
      focused: true,
      start: Number.isFinite(searchInput.selectionStart) ? searchInput.selectionStart : null,
      end: Number.isFinite(searchInput.selectionEnd) ? searchInput.selectionEnd : null
    };
  }

  function restoreSearchInput(snapshot) {
    if (!snapshot?.focused) return;
    const searchInput = shadow?.getElementById("bp-search");
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


  function composerInputSnapshot() {
    const el = shadow?.getElementById("bp-composer-text");
    const active = shadow?.activeElement;
    if (!el || active !== el) return null;
    const value = String(el.value || "");
    const start = Number.isFinite(el.selectionStart) ? el.selectionStart : value.length;
    const end = Number.isFinite(el.selectionEnd) ? el.selectionEnd : start;
    return {
      focused: true,
      startFromEnd: Math.max(0, value.length - start),
      endFromEnd: Math.max(0, value.length - end)
    };
  }

  function restoreComposerInput(snapshot, options = {}) {
    if (!snapshot?.focused) return;
    const el = shadow?.getElementById("bp-composer-text");
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
        armedFieldSelection = { kind: "range", range };
        return armedFieldSelection;
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

  function resolveEditableField(node) {
    let el = node;
    while (el && el !== document.documentElement && el !== document.body) {
      if (host?.contains(el)) return null;
      if (isEditableNode(el)) return el;
      el = el.parentElement || el.parentNode;
    }
    return isEditableNode(el) && !host?.contains(el) ? el : null;
  }


  function clearArmedField(field = null) {
    if (!field || lastFocusedField === field) lastFocusedField = null;
    armedFieldSelection = null;
  }

  function armWriteField(field, options = {}) {
    if (!field) return false;
    const changed = lastFocusedField !== field;
    lastFocusedField = field;
    if (options.captureNow) snapshotArmedFieldSelection(field);
    return changed;
  }

  function snapshotArmedFieldSelection(field = currentWriteField()) {
    if (!field) {
      armedFieldSelection = null;
      return null;
    }
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      const value = String(field.value || "");
      const start = Number.isFinite(field.selectionStart) ? field.selectionStart : value.length;
      const end = Number.isFinite(field.selectionEnd) ? field.selectionEnd : start;
      armedFieldSelection = { kind: "text", start, end };
      return armedFieldSelection;
    }
    if (field.isContentEditable || field.getAttribute?.("contenteditable") === "true" || field.getAttribute?.("role") === "textbox") {
      const selection = window.getSelection?.();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        if (field.contains(range.startContainer) && field.contains(range.endContainer)) {
          armedFieldSelection = { kind: "range", range: range.cloneRange() };
          return armedFieldSelection;
        }
      }
      armedFieldSelection = { kind: "range", range: null };
      return armedFieldSelection;
    }
    armedFieldSelection = null;
    return null;
  }

  function restoreArmedFieldSelection(field = currentWriteField()) {
    if (!field) return false;
    field.focus?.({ preventScroll: true });
    const snapshot = armedFieldSelection;
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
        armedFieldSelection = { kind: "range", range: fallback.cloneRange() };
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

  function sessionTermAt(index) {
    const item = state.sessionItems[index];
    if (!item) return null;
    return TERM_MAP.get(item.key) || null;
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

    const published = routeInsert(activeInsertText(writeTarget, activeCategoryRoute(writeTarget) || ""), "term");
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
    if (!lastFocusedField) return null;
    if (!document.contains(lastFocusedField)) {
      clearArmedField(lastFocusedField);
      return null;
    }
    if (host?.contains(lastFocusedField)) {
      clearArmedField(lastFocusedField);
      return null;
    }
    if (!isEditableNode(lastFocusedField)) {
      clearArmedField(lastFocusedField);
      return null;
    }
    return lastFocusedField;
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
    clearTimeout(_savePrefsTimer);
    _savePrefsTimer = setTimeout(savePrefs, 300);
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
    const trailingBoundary = /[\s,.!?;:]$/.test(input);
    const tokens = (trimmed.match(/[^\s,.!?;:]+|[,.!?;:]/g) || []).map((piece) => ({ raw: piece, norm: normalize(piece) }));
    const pills = [];
    let pendingWords = [];
    const candidateTerms = TERMS.filter((term) => term?.sec !== "connect" && term?.p).map((term) => ({
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
    if (state.quickComposePinned) {
      // Flush any uncommitted textarea words before adding the new pill
      flushComposerPendingText({ collectDerived: true });
      state.composerPillCounter = (state.composerPillCounter || 0) + 1;
      let insertText = text.trim();
      if (state.composerNextCapitalise && insertText) {
        insertText = insertText.charAt(0).toUpperCase() + insertText.slice(1);
        state.composerNextCapitalise = false;
      }
      const newPill = { id: state.composerPillCounter, type, text: insertText };
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

  function handleGlobalHotkeys(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    if (!pluginHotkeyContext()) return;
    const rawKey = String(event.key || "");
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const target = path[0] || event.target;
    const activeShadowEl = shadow?.activeElement;
    const composerKeyActive = activeShadowEl?.id === "bp-composer-text";
    if (composerKeyActive && (
      rawKey.length === 1 ||
      rawKey === "Backspace" || rawKey === "ArrowLeft" || rawKey === "ArrowRight" ||
      rawKey === "Enter" || rawKey === "Tab"
    )) {
      return;
    }
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
    const quickComposePinned = state.quickComposePinned || state.composerStealing;
    const quickTarget = state.quickAltTarget === "phrases" ? "phrases" : "connect";
    const quickTermsList = getQuickTermsList();
    const quickConnList = getHotkeyWindow(sortedConnectives(), state.quickConnHotkeyOffset || 0);
    const quickPhrasesList = getHotkeyWindow((state.quickPhrases || []).map((item) => item.text), state.quickPhrasesHotkeyOffset || 0);

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
        fireQuickTermAtIndex(termsIdx);
        render();
        return;
      }

      const connIdx = CONN_HOTKEYS.indexOf(rawKey);
      if (connIdx !== -1) {
        event.preventDefault();
        if (quickTarget === "phrases") fireQuickPhraseAtIndex(connIdx);
        else fireQuickConnectiveAtIndex(connIdx);
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
      const target = e.composedPath?.()?.[0] || e.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      e.preventDefault();
    }, true);

    styleNode = document.createElement("style");
    styleNode.textContent = styles();
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
      if (!state.appActive || !state.sessionOpen || !state.writeMode) return;
      const target = event.composedPath?.()?.[0] || event.target;
      if (host?.contains(target)) return;
      const field = resolveEditableField(target);
      if (!field) return;
      armWriteField(field);
      captureArmedFieldSelectionFromPointer(field, event);
    }, true);

    document.addEventListener("selectionchange", () => {
      if (!state.appActive) return;
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
        const field = lastFocusedField;
        if (field && !document.contains(field)) {
          clearArmedField(field);
          render();
        }
      }, 0);
    }, true);

    setInterval(() => {
      if (lastFocusedField && !document.contains(lastFocusedField)) {
        clearArmedField(lastFocusedField);
      }
    }, 1000);

    document.addEventListener("keydown", handleGlobalHotkeys, true);
    document.addEventListener("keyup", handleGlobalHotkeysRelease, true);
    document.addEventListener("keydown", handleToolTrayKeys, true);

    window.addEventListener("myui:toggle", () => {
      if (!_initReady) { _pendingToggle = !_pendingToggle; return; }
      state.appActive = !state.appActive;
      if (state.appActive) {
        state.visible = true;
        state.sessionOpen = true;
        state.quickComposePinned = true;
        state.listenMode = "word";
        startListening();
      } else {
        stopListening();
        clearSessionWorkingState({ closeSessionUi: true, closeComposerUi: true, closeToolTrays: true });
        state.visible = false;
      }
      render();
    });

    Promise.all([loadPrefs(), loadMasterRows()]).finally(() => {
      rebuildRuntimeData();
      state.queryInput = typeof state.queryInput === "string" ? state.queryInput : state.query;
      state.query = typeof state.query === "string" ? state.query : String(state.queryInput || "").trim();
      _initReady = true;
      console.log(`[MYUI] build ${MYUI_BUILD}`);
      if (_pendingToggle) {
        _pendingToggle = false;
        state.appActive = !state.appActive;
        if (state.appActive) {
          state.visible = true;
          state.sessionOpen = true;
          state.quickComposePinned = true;
          state.listenMode = "word";
        } else {
          state.visible = false;
        }
      }
      state.quickComposePinned = true;
      state.listenMode = "word";
      if (state.appActive) state.sessionOpen = true;
      startListening();
      render();
      window.addEventListener("resize", () => {
        state.panelWidth = clamp(state.panelWidth, PANEL_MIN_WIDTH, Math.min(window.innerWidth - 20, PANEL_MAX_WIDTH));
        state.panelHeight = clamp(state.panelHeight, PANEL_MIN_HEIGHT, Math.min(window.innerWidth - 20, PANEL_MAX_HEIGHT));
        const pos = clampFloatPosition(state.floatX, state.floatY);
        state.floatX = pos.x;
        state.floatY = pos.y;
        const sessionPos = clampSessionPosition(state.sessionX, state.sessionY, state.sessionWidth, state.sessionHeight);
        state.sessionX = sessionPos.x;
        state.sessionY = sessionPos.y;
        state.sessionWidth = sessionPos.width;
        state.sessionHeight = sessionPos.height;
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
    state.composerFocused = false;
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

  function buildPrefsSnapshot() {
    return {
      visible: state.visible,
      stayActive: state.stayActive,
      themeMode: state.themeMode,
      layoutCols: state.layoutCols,
      orderMode: state.orderMode,
      helpOpen: state.helpOpen,
      helpHover: state.helpHover,
      autoHide: state.autoHide,
      searchScope: state.searchScope,
      query: state.query,
      queryInput: state.queryInput,
      selectedSection: state.selectedSection,
      expandedCats: Array.from(state.expandedCats || []),
      panelWidth: state.panelWidth,
      panelHeight: state.panelHeight,
      dock: state.dock,
      controlsCollapsed: state.controlsCollapsed,
      navCollapsed: state.navCollapsed,
      floatX: state.floatX,
      floatY: state.floatY,
      searchOnlyMode: state.searchOnlyMode,
      searchCatsVisible: state.searchCatsVisible,
      searchCategoryFilter: state.searchCategoryFilter,
      focusMode: state.focusMode,
      writeMode: state.writeMode,
      uiScale: state.uiScale,
      panelOpacity: state.panelOpacity,
      toolTrayInstruments: state.toolTrayInstruments,
      toolTrayVibes: state.toolTrayVibes,
      toolTrayExpandedInstruments: state.toolTrayExpandedInstruments,
      toolTrayExpandedVibes: state.toolTrayExpandedVibes,
      selectedToolSec: state.selectedToolSec,
      sessionX: state.sessionX,
      sessionY: state.sessionY,
      sessionWidth: state.sessionWidth,
      sessionHeight: state.sessionHeight,
      fullSentenceMode: state.fullSentenceMode,
      connectivesEnabled: state.connectivesEnabled,
      connectivesCustom: state.connectivesCustom,
      listenConnectives: state.listenConnectives,
      insFloat: state.insFloat,
      insX: state.insX,
      insY: state.insY,
      insMinimized: state.insMinimized,
      vibFloat: state.vibFloat,
      vibX: state.vibX,
      vibY: state.vibY,
      vibMinimized: state.vibMinimized,
      listenMode: state.listenMode,
      undefinedTerms: state.undefinedTerms,
      quickTemplates: state.quickTemplates,
      editorUndefinedOpen: state.editorUndefinedOpen,
      editorTermsOpen: state.editorTermsOpen,
      tempTermsOpen: state.tempTermsOpen,
      tempTermsInput: state.tempTermsInput,
      tempTermsShortcutInput: state.tempTermsShortcutInput,
      tempTermsAwaitingShortcut: state.tempTermsAwaitingShortcut,
      tempTermsPendingText: state.tempTermsPendingText,
      tempTermsEditText: state.tempTermsEditText,
      tempTermsEditShortcut: state.tempTermsEditShortcut,
      quickComposePinned: state.quickComposePinned,
      quickConnectPinned: state.quickConnectPinned,
      quickPhrasesPinned: state.quickPhrasesPinned,
      quickTermsPinned: state.quickTermsPinned,
      quickTemplatesPinned: state.quickTemplatesPinned,
      quickConnectInput: state.quickConnectInput,
      quickPhrasesInput: state.quickPhrasesInput,
      quickTermsInput: state.quickTermsInput,
      quickTempTermInput: state.quickTempTermInput,
      quickPhrases: state.quickPhrases,
      quickTermsViewMode: state.quickTermsViewMode,
      quickConnectOrderMode: state.quickConnectOrderMode,
      quickPhrasesOrderMode: state.quickPhrasesOrderMode,
      quickTermsCatOpen: state.quickTermsCatOpen,
      quickTermsCatPins: state.quickTermsCatPins,
      quickTermsHotkeyOffset: state.quickTermsHotkeyOffset,
      quickConnHotkeyOffset: state.quickConnHotkeyOffset,
      quickPhrasesHotkeyOffset: state.quickPhrasesHotkeyOffset,
      quickLastActiveSection: state.quickLastActiveSection,
      quickAltTarget: state.quickAltTarget
    };
  }

  function readPageStorage() {
    try {
      const raw = window.localStorage?.getItem(PAGE_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      if (parsed.__build && parsed.__build !== MYUI_BUILD) {
        window.localStorage?.removeItem(PAGE_STORAGE_KEY);
        return {};
      }
      return parsed;
    } catch (_) {
      return {};
    }
  }

  function applyPrefs(prefs) {
    if (!prefs || typeof prefs !== "object") return;
    // state.visible intentionally not restored — always starts closed on new page
    if (["light", "dark"].includes(prefs.themeMode)) state.themeMode = prefs.themeMode;
    if ([1, 2, 3, 4].includes(prefs.layoutCols)) state.layoutCols = prefs.layoutCols;
    if (["dataset", "alpha-term", "alpha-shortcut"].includes(prefs.orderMode)) state.orderMode = prefs.orderMode;
    if (typeof prefs.helpOpen === "boolean") state.helpOpen = prefs.helpOpen;
    if (typeof prefs.helpHover === "boolean") state.helpHover = prefs.helpHover;
    if (typeof prefs.autoHide === "boolean") state.autoHide = prefs.autoHide;
    if (typeof prefs.stayActive === "boolean") state.stayActive = prefs.stayActive;
    if (["all", "category"].includes(prefs.searchScope)) state.searchScope = prefs.searchScope;
    if (typeof prefs.queryInput === "string") state.queryInput = prefs.queryInput;
    if (typeof prefs.query === "string") state.query = prefs.query;
    if (typeof prefs.selectedSection === "string") state.selectedSection = prefs.selectedSection;
    if (Array.isArray(prefs.expandedCats)) state.expandedCats = new Set(prefs.expandedCats.filter(Boolean));
    if (typeof prefs.panelWidth === "number") state.panelWidth = clamp(prefs.panelWidth, PANEL_MIN_WIDTH, Math.min(window.innerWidth - 20, PANEL_MAX_WIDTH));
    if (typeof prefs.panelHeight === "number") state.panelHeight = clamp(prefs.panelHeight, PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 20, PANEL_MAX_HEIGHT));
    if (["right", "left", "bottom", "top", "float"].includes(prefs.dock)) state.dock = prefs.dock;
    if (typeof prefs.controlsCollapsed === "boolean") state.controlsCollapsed = prefs.controlsCollapsed;
    if (typeof prefs.navCollapsed === "boolean") state.navCollapsed = prefs.navCollapsed;
    if (typeof prefs.floatX === "number") state.floatX = prefs.floatX;
    if (typeof prefs.floatY === "number") state.floatY = prefs.floatY;
    if (typeof prefs.searchOnlyMode === "boolean") state.searchOnlyMode = prefs.searchOnlyMode;
    if (typeof prefs.searchCatsVisible === "boolean") state.searchCatsVisible = prefs.searchCatsVisible;
    if (typeof prefs.searchCategoryFilter === "string") state.searchCategoryFilter = prefs.searchCategoryFilter;
    if (typeof prefs.focusMode === "boolean") state.focusMode = prefs.focusMode;
    if (typeof prefs.writeMode === "boolean") state.writeMode = prefs.writeMode;
    if (typeof prefs.uiScale === "number") state.uiScale = clamp(prefs.uiScale, 0.85, 1.5);
    if (typeof prefs.panelOpacity === "number") state.panelOpacity = clamp(prefs.panelOpacity, 0.45, 1);
    if (typeof prefs.toolTrayInstruments === "boolean") state.toolTrayInstruments = prefs.toolTrayInstruments;
    if (typeof prefs.toolTrayVibes === "boolean") state.toolTrayVibes = prefs.toolTrayVibes;
    if (typeof prefs.toolTrayExpandedInstruments === "boolean") state.toolTrayExpandedInstruments = prefs.toolTrayExpandedInstruments;
    if (typeof prefs.toolTrayExpandedVibes === "boolean") state.toolTrayExpandedVibes = prefs.toolTrayExpandedVibes;
    if (typeof prefs.selectedToolSec === "string") state.selectedToolSec = prefs.selectedToolSec;
    if (typeof prefs.sessionOpen === "boolean") state.sessionOpen = false;
    if (typeof prefs.sessionX === "number") state.sessionX = prefs.sessionX;
    if (typeof prefs.sessionY === "number") state.sessionY = prefs.sessionY;
    if (typeof prefs.sessionWidth === "number") state.sessionWidth = prefs.sessionWidth;
    if (typeof prefs.sessionHeight === "number") state.sessionHeight = prefs.sessionHeight;
    state.fullSentenceMode = false;
    state.composerOpen = false;
    state.sessionMinimized = false;
    state.sessionPage = 0;
    if (typeof prefs.connectivesEnabled === "boolean") state.connectivesEnabled = prefs.connectivesEnabled;
    if (prefs.connectivesCustom !== undefined) state.connectivesCustom = prefs.connectivesCustom;
    if (Array.isArray(prefs.listenConnectives)) state.listenConnectives = prefs.listenConnectives;
    if (typeof prefs.insFloat === "boolean") state.insFloat = prefs.insFloat;
    if (typeof prefs.insX === "number") state.insX = prefs.insX;
    if (typeof prefs.insY === "number") state.insY = prefs.insY;
    if (typeof prefs.insMinimized === "boolean") state.insMinimized = prefs.insMinimized;
    if (typeof prefs.vibFloat === "boolean") state.vibFloat = prefs.vibFloat;
    if (typeof prefs.vibX === "number") state.vibX = prefs.vibX;
    if (typeof prefs.vibY === "number") state.vibY = prefs.vibY;
    if (typeof prefs.vibMinimized === "boolean") state.vibMinimized = prefs.vibMinimized;
    state.listenMode = "word";
    if (Array.isArray(prefs.undefinedTerms)) state.undefinedTerms = prefs.undefinedTerms;
    if (Array.isArray(prefs.quickTemplates)) state.quickTemplates = prefs.quickTemplates;
    if (typeof prefs.editorUndefinedOpen === "boolean") state.editorUndefinedOpen = prefs.editorUndefinedOpen;
    if (typeof prefs.editorTermsOpen === "boolean") state.editorTermsOpen = prefs.editorTermsOpen;
    if (typeof prefs.tempTermsOpen === "boolean") state.tempTermsOpen = prefs.tempTermsOpen;
    if (typeof prefs.tempTermsInput === "string") state.tempTermsInput = prefs.tempTermsInput;
    if (typeof prefs.tempTermsShortcutInput === "string") state.tempTermsShortcutInput = prefs.tempTermsShortcutInput;
    if (typeof prefs.tempTermsAwaitingShortcut === "boolean") state.tempTermsAwaitingShortcut = prefs.tempTermsAwaitingShortcut;
    if (typeof prefs.tempTermsPendingText === "string") state.tempTermsPendingText = prefs.tempTermsPendingText;
    if (typeof prefs.tempTermsEditText === "string") state.tempTermsEditText = prefs.tempTermsEditText;
    if (typeof prefs.tempTermsEditShortcut === "string") state.tempTermsEditShortcut = prefs.tempTermsEditShortcut;
    state.quickComposePinned = true;
    if (typeof prefs.quickConnectPinned === "boolean") state.quickConnectPinned = prefs.quickConnectPinned;
    if (typeof prefs.quickPhrasesPinned === "boolean") state.quickPhrasesPinned = prefs.quickPhrasesPinned;
    if (typeof prefs.quickTermsPinned === "boolean") state.quickTermsPinned = prefs.quickTermsPinned;
    if (typeof prefs.quickTemplatesPinned === "boolean") state.quickTemplatesPinned = prefs.quickTemplatesPinned;
    if (typeof prefs.quickConnectInput === "string") state.quickConnectInput = prefs.quickConnectInput;
    if (typeof prefs.quickPhrasesInput === "string") state.quickPhrasesInput = prefs.quickPhrasesInput;
    if (typeof prefs.quickTermsInput === "string") state.quickTermsInput = prefs.quickTermsInput;
    if (typeof prefs.quickTempTermInput === "string") state.quickTempTermInput = prefs.quickTempTermInput;
    if (Array.isArray(prefs.quickPhrases)) state.quickPhrases = prefs.quickPhrases;
    if (typeof prefs.quickTermsViewMode === "string") state.quickTermsViewMode = prefs.quickTermsViewMode;
    if (typeof prefs.quickConnectOrderMode === "string") state.quickConnectOrderMode = prefs.quickConnectOrderMode;
    if (typeof prefs.quickPhrasesOrderMode === "string") state.quickPhrasesOrderMode = prefs.quickPhrasesOrderMode;
    if (typeof prefs.quickTermsCatOpen === "string") state.quickTermsCatOpen = prefs.quickTermsCatOpen;
    if (Array.isArray(prefs.quickTermsCatPins)) state.quickTermsCatPins = prefs.quickTermsCatPins;
    if (typeof prefs.quickTermsHotkeyOffset === "number") state.quickTermsHotkeyOffset = prefs.quickTermsHotkeyOffset;
    if (typeof prefs.quickConnHotkeyOffset === "number") state.quickConnHotkeyOffset = prefs.quickConnHotkeyOffset;
    if (typeof prefs.quickPhrasesHotkeyOffset === "number") state.quickPhrasesHotkeyOffset = prefs.quickPhrasesHotkeyOffset;
    if (typeof prefs.quickLastActiveSection === "string") state.quickLastActiveSection = prefs.quickLastActiveSection;
    if (typeof prefs.quickAltTarget === "string") state.quickAltTarget = prefs.quickAltTarget;
    const pos = clampFloatPosition(state.floatX, state.floatY);
    state.floatX = pos.x;
    state.floatY = pos.y;
    const sessionPos = clampSessionPosition(state.sessionX, state.sessionY, state.sessionWidth, state.sessionHeight);
    state.sessionX = sessionPos.x;
    state.sessionY = sessionPos.y;
    state.sessionWidth = sessionPos.width;
    state.sessionHeight = sessionPos.height;
    state.query = typeof state.query === "string" ? state.query : String(state.queryInput || "").trim();
    state.queryInput = typeof state.queryInput === "string" ? state.queryInput : state.query;
  }


  async function loadPrefs() {
    const area = chrome?.storage?.local;
    try {
      let prefs = {};
      if (area) {
        const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
        const stored = await new Promise((resolve) => {
          try {
            const maybe = area.get(keys, (value) => resolve(value));
            if (maybe?.then) maybe.then(resolve).catch(() => resolve({}));
          } catch (_) {
            resolve({});
          }
        });
        prefs = stored?.[STORAGE_KEY] || {};
        if (!prefs || !Object.keys(prefs).length) {
          for (const key of LEGACY_STORAGE_KEYS) {
            if (stored?.[key] && Object.keys(stored[key]).length) {
              prefs = stored[key];
              break;
            }
          }
        }
      }
      const pagePrefs = readPageStorage();
      applyPrefs({ ...prefs, ...pagePrefs });
    } catch (_) {
      applyPrefs(readPageStorage());
    }
  }

  function savePrefs() {
    const snapshot = buildPrefsSnapshot();
    try {
      window.localStorage?.setItem(PAGE_STORAGE_KEY, JSON.stringify({ ...snapshot, __build: MYUI_BUILD }));
    } catch (_) {}
    const area = chrome?.storage?.local;
    if (!area) return;
    const payload = {
      [STORAGE_KEY]: snapshot
    };
    try {
      const maybe = area.set(payload, () => {});
      if (maybe?.catch) maybe.catch(() => {});
    } catch (_) {}
  }

  async function devReset() {
    const confirmed = window.confirm("Hard reset MYUI? This clears all saved MYUI data, including templates, edited terms, and settings.");
    if (!confirmed) return;

    try { window.localStorage?.removeItem(PAGE_STORAGE_KEY); } catch (_) {}

    const keysToRemove = [STORAGE_KEY, MASTER_STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
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
    console.log(`[MYUI] devReset — hard reset complete (build ${MYUI_BUILD})`);
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

  function renderFieldTargetIndicator() {
    const field = currentWriteField();
    if (!field || !document.contains(field) || host?.contains(field)) return "";
    let rect;
    try { rect = field.getBoundingClientRect(); } catch (_) { return ""; }
    if (!rect || rect.width < 2 || rect.height < 2) return "";
    const x = Math.round(rect.right - 14);
    const y = Math.round(rect.top + 4);
    const title = "MYUI print target armed — click Print to write into this field";
    return `<div class="field-target-indicator fti-ready" style="left:${x}px;top:${y}px;" title="${esc(title)}" aria-hidden="true"></div>`;
  }

  function render() {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(() => {
      renderScheduled = false;
      const searchSnapshot = searchInputSnapshot();
      const qsSnapshot = qsInputSnapshot();
      const composerSnapshot = composerInputSnapshot();
      state.hoverTooltipTitle = "";
      state.hoverTooltipBody = "";
      const isOpen = state.visible;
      const isActive = state.appActive;
      const hasDockedTray = isOpen && ["instruments", "vibes"].some(sec => isToolTrayOpen(sec) && !(sec === "instruments" ? state.insFloat : state.vibFloat));
      const shellClass = `shell ${isOpen ? "open" : "closed"} ${state.themeMode} dock-${state.dock} ${isHorizontalDock() ? "dock-horizontal" : ""} ${hasDockedTray ? "has-tool-trays" : ""}`;
      contentNode.innerHTML = `
        <div class="${shellClass}" style="${shellInlineStyle()}">
          ${isOpen ? renderPanel() : ""}
          ${hasDockedTray ? renderDockedTrays() : ""}
          ${isActive ? renderRail() : ""}
        </div>
        ${isActive ? renderFloatingTrays() : ""}
        ${isActive ? renderSessionWindow() : ""}
        ${isActive ? renderSessionConnPanel() : ""}
        ${isActive ? renderFieldTargetIndicator() : ""}
      `;
      bindEvents();
      restoreSearchInput(searchSnapshot);
      restoreQsInput(qsSnapshot);
      restoreComposerInput(composerSnapshot);
      updateHelpHighlight();
      syncHoverTooltip();
      syncToolTrayViewport();
      syncSessionViewport();
      syncPageInset();
    });
  }

  function renderRail() {
    const value = Math.round(state.uiScale * 100);
    const horiz = isHorizontalDock();
    const slider = state.visible ? `
      <label class="rail-scale" for="bp-size-slider" title="Interface size">
        <input id="bp-size-slider" class="rail-size-slider" type="range" min="85" max="150" step="5" value="${value}" aria-label="Global interface size" />
      </label>` : "";
    return `
      <div class="rail" id="bp-rail" aria-label="Tag MYUI panel">
        <button class="rail-drag" id="bp-rail-drag" type="button" aria-label="Move or snap panel" title="Move or snap left, right, top, or bottom.">
          <span class="rail-drag-mark">✥</span>
        </button>
        <button class="rail-toggle" id="bp-rail-toggle" type="button" aria-label="Open Tag MYUI panel" title="Open or collapse Tag MYUI">
          <span class="rail-mark ${horiz ? "rail-mark-horiz" : "rail-mark-vert"}">MYUI</span>
        </button>
        ${slider}
      </div>
    `;
  }

  function renderPanel() {
    const conflictCount = conflictingRows().length;

    return `
      <section class="panel">
        <div class="resizer" id="bp-resizer" aria-hidden="true"></div>
        <div class="corner-resizer" id="bp-corner-resizer" aria-hidden="true"></div>
        <header class="panel-header" id="bp-drag-header">
          <div class="header-actions">

            <button class="icon-btn header-mode-btn ${state.writeMode ? "active header-live-on" : ""}"
              id="bp-write-mode" type="button" title="Publish clicked items into Quick-Tag Compose">Live</button>

            <button class="icon-btn header-mode-btn ${state.sessionOpen ? "active" : ""}"
              id="bp-session-toggle" type="button" title="Open Quick-Tag window">
              Quick-Tag${state.sessionItems.length ? ` <span class="header-count">${state.sessionItems.length}</span>` : ""}
            </button>

            <button class="icon-btn header-mode-btn next-track-btn"
              id="bp-next-track" type="button" title="Clear Ins, Vib and Quick for the next track">New</button>

            <button class="icon-btn header-mode-btn ${state.autoHide ? "active" : ""}"
              id="bp-autohide" type="button" title="Auto-hide when cursor leaves">Hide</button>

            <span class="header-divider"></span>

            <button class="icon-btn header-util-btn ${state.editorOpen ? "active" : ""}"
              id="bp-edit-mode" type="button" title="Open editor">✏</button>

            <button class="icon-btn header-util-btn"
              id="bp-theme" type="button" title="Toggle light/dark">${state.themeMode === "dark" ? "☀" : "☾"}</button>

            <button class="icon-btn header-util-btn ${state.helpOpen ? "active" : ""}"
              id="bp-help" type="button" title="How-to and info">i</button>

            <button class="icon-btn header-util-btn help-mark ${state.helpHover ? "active" : ""}"
              id="bp-help-hover" type="button" title="Hover terms to see definitions">?</button>

            ${state.masterDirty ? `<button class="icon-btn save-exit-btn ${conflictCount ? "warn" : ""}"
              id="bp-save-exit" type="button">Save</button>` : ""}

            <button class="icon-btn danger header-util-btn" id="bp-close" type="button"
              aria-label="Collapse panel">×</button>

          </div>
        </header>

        ${renderConfirmExitModal()}
        ${renderConfirmNextTrackModal()}
        ${renderDirtyBanner()}
        ${renderControlArea()}
        <div class="content-shell ${state.helpOpen && !state.editorOpen ? "with-help" : ""}">
          <div class="main-scroll">
            ${state.editorOpen ? renderEditorView() : renderMainView()}
          </div>
          ${state.helpOpen && !state.editorOpen ? renderHelpPane() : ""}
        </div>
      </section>
    `;
  }

  function renderControlArea() {
    const categorySearchUi = state.searchScope === "category" && !!state.query;
    const topNav = !categorySearchUi ? renderTopCategoryRow(isHorizontalDock()) : "";
    const categoryDropdown = (categorySearchUi && state.searchCatsVisible) ? renderSearchCategoryDropdown() : "";
    return `
      <div class="controls-stack">
        ${renderSearchToolbar()}
        ${renderSecondaryControls()}
        <div class="control-box tone-c hotkey-box">${renderHotkeyLegend()}</div>
      </div>
      ${categoryDropdown || topNav}
    `;
  }

  function renderSearchToolbar(searchOnly = false) {
    const helpActive = state.helpHover;
    const orderLabels = { "dataset": "A–Z Cat", "alpha-term": "A–Z Term", "alpha-shortcut": "A–Z Short" };
    const viewLabel = state.searchOnlyMode ? "Term view" : "Category view";
    const undefCount = (state.undefinedTerms || []).length;
    return `
      <div class="search-bar-row">
        <label class="search-wrap search-shell" for="bp-search">
          <input id="bp-search" type="search"
            placeholder="Search shortcuts, terms or categories"
            value="${esc(state.queryInput)}" />
        </label>
        <button class="search-mode-btn" id="bp-order-cycle" type="button"
          title="Cycle result order">
          ${orderLabels[state.orderMode] || "A–Z Cat"}
        </button>
        <button class="search-mode-btn ${state.searchOnlyMode ? "active" : ""}"
          id="bp-view-cycle" type="button"
          title="Toggle between category view and term list view">
          ${viewLabel}
        </button>
        <button class="search-mode-btn temp-terms-toggle-btn${state.tempTermsOpen ? " active" : ""}"
          id="bp-temp-terms-toggle" type="button"
          title="Temporary terms${undefCount ? ` (${undefCount})` : ""}">⊕${undefCount ? `<span class="temp-terms-count">${undefCount}</span>` : ""}</button>
      </div>
      <div class="temp-terms-bar${state.tempTermsOpen ? " temp-terms-open" : ""}">
        ${state.tempTermsOpen ? `
          ${state.tempTermsAwaitingShortcut ? `
            <div class="temp-terms-add-row">
              <span class="temp-terms-pending">${esc(state.tempTermsPendingText)}</span>
              <input class="temp-terms-input" id="bp-temp-shortcut-input"
                type="text" placeholder="Shortcut (Enter to skip)…"
                value="${esc(state.tempTermsShortcutInput)}" />
              <button class="qs-add-btn qs-add-active" type="button"
                id="bp-temp-confirm" title="Confirm">+</button>
              <button class="qs-del-btn" type="button"
                id="bp-temp-cancel-shortcut" title="Cancel">✕</button>
            </div>
          ` : `
            <div class="temp-terms-add-row">
              <input class="temp-terms-input" id="bp-temp-term-input"
                type="text" placeholder="Add term…"
                value="${esc(state.tempTermsInput)}" />
              <button class="qs-add-btn${state.tempTermsInput.trim() ? " qs-add-active" : ""}"
                type="button" id="bp-temp-add" title="Add term">+</button>
              <button class="qs-del-btn${state.tempTermsDeleteMode
                ? (state.tempTermsDeleteTarget !== null ? " qs-del-green" : " qs-del-armed") : ""}"
                type="button" id="bp-temp-delete-toggle" title="Delete">−</button>
              <button class="temp-terms-edit-btn${state.tempTermsEditTarget !== null ? " active" : ""}"
                type="button" id="bp-temp-edit-toggle" title="Edit pills">✎</button>
            </div>
          `}
          ${(state.undefinedTerms || []).length ? `
            <div class="temp-terms-pill-list">
              ${(state.undefinedTerms || []).map((entry, i) => {
                const text = undefinedTermText(entry);
                const shortcut = undefinedTermShortcut(entry);
                const isEditTarget = state.tempTermsEditTarget === i;
                const isDeleteTarget = state.tempTermsDeleteTarget === i;
                const isDeleteMode = state.tempTermsDeleteMode;
                const isEditMode = state.tempTermsEditTarget !== null;

                if (isEditTarget) {
                  return `
                    <span class="temp-terms-pill temp-terms-pill-editing">
                      <input class="temp-terms-edit-input" id="bp-temp-edit-text"
                        type="text" value="${esc(state.tempTermsEditText)}"
                        placeholder="Term" />
                      <input class="temp-terms-edit-shortcut" id="bp-temp-edit-shortcut"
                        type="text" value="${esc(state.tempTermsEditShortcut)}"
                        placeholder="Short" />
                      <button class="qs-add-btn qs-add-active" type="button"
                        data-temp-edit-confirm="${i}" title="Save">✓</button>
                      <button class="qs-del-btn" type="button"
                        data-temp-edit-cancel="${i}" title="Cancel">✕</button>
                    </span>`;
                }
                return `
                  <span class="temp-terms-pill${isDeleteMode && isDeleteTarget ? " qs-pill-targeted" : ""}${isDeleteMode && !isDeleteTarget ? " qs-pill-deletable" : ""}"
                    data-temp-pill="${i}">
                    ${shortcut ? `<code class="temp-terms-shortcut">${esc(shortcut)}</code>` : ""}
                    <span class="temp-terms-text">${esc(text)}</span>
                    ${isEditMode && !isDeleteMode ? `<button class="temp-terms-edit-pill-btn"
                      type="button" data-temp-edit="${i}" title="Edit">✎</button>` : ""}
                    <button class="temp-terms-remove" type="button"
                      data-temp-remove="${i}" aria-label="Remove">×</button>
                  </span>`;
              }).join("")}
            </div>
            <div class="temp-terms-export-row">
              <span class="temp-terms-export-hint">
                ${(state.undefinedTerms || []).length} term${(state.undefinedTerms || []).length !== 1 ? "s" : ""}
                — uncategorised terms will be structured by AI
              </span>
              <button class="temp-terms-export-btn" id="bp-temp-export"
                type="button" title="Export for AI processing">⎙ Export</button>
            </div>
          ` : `<div class="qs-empty">No terms yet — type above to add.</div>`}
        ` : ""}
      </div>
      ${helpActive ? `
      <div class="inline-def-bar" id="bp-def-bar" aria-live="polite">
        <span class="inline-def-mark">?</span>
        <span class="inline-def-title" id="bp-def-bar-title">Definition mode</span>
        <span class="inline-def-sep">—</span>
        <span class="inline-def-body" id="bp-def-bar-body">Hover a term to see its definition.</span>
      </div>` : ""}
    `;
  }

  function renderSecondaryControls(searchOnly = false) {
    const viewModeLabel = state.layoutCols === 1 ? "Single view" : "Multi view";
    return `
      <div class="controls-row">
        <button class="seg-btn ${state.focusMode ? "active" : ""}" id="bp-focus"
          type="button" title="Only expand one category at a time">Focus</button>
        <button class="seg-btn" id="bp-layout-toggle"
          type="button" title="Toggle single or multi column layout">${viewModeLabel}</button>
      </div>
    `;
  }

  function renderStandardControlStack() {
    return `
      <div class="controls-stack">
        ${renderSearchToolbar(false)}
        ${renderSecondaryControls(false)}
        <div class="control-box tone-c hotkey-box">${renderHotkeyLegend()}</div>
      </div>
    `;
  }

  function renderSearchCategoryDropdown() {
    const blocks = searchOnlyBlocks();
    if (!(state.searchScope === "category" && state.searchCatsVisible)) return "";
    return `<div class="control-box tone-a search-cats-box"><div class="search-cats-dropdown">${blocks.map((entry) => renderSearchCategoryChip(entry)).join("")}</div></div>`;
  }

  function renderToolSectionGrid(searchOnly = false) {
    return `
      <div class="control-box tone-b tool-section-grid-box ${searchOnly ? "search-tool-grid-box" : ""}">
        <div class="tool-launch-bar ${isHorizontalDock() ? "horizontal" : "vertical"}">
          ${renderToolLauncher("instruments")}
          ${renderToolLauncher("vibes")}
        </div>
      </div>
    `;
  }

  function renderInlineToolSection(secKey) {
    const list = getToolList(secKey);
    const total = list.length;
    const open = isToolTrayOpen(secKey);
    const expanded = isToolTrayExpanded(secKey);
    const fillClass = total ? "filled" : "empty";
    return `
      <section class="tool-inline-section ${open ? "open" : "collapsed"} ${expanded ? "expanded" : "compact"} ${fillClass}" data-tool-panel="${esc(secKey)}">
        <div class="tool-inline-head">
          <button class="tool-launch-btn tool-inline-toggle ${fillClass} ${open ? "active" : ""}" type="button" data-tool="${esc(secKey)}" title="Show or hide ${esc(toolLabel(secKey))} tags">
            <span class="tool-square-label">${esc(toolButtonLabel(secKey))}</span>
            <span class="tool-launch-meta">${total}</span>
          </button>
          <div class="tool-inline-actions">
            <button class="icon-btn small slim ${open && expanded ? "active" : ""}" type="button" data-tool-mode="${esc(secKey)}" title="${expanded ? "Compact view" : "Full view"}">${expanded ? "▣" : "▤"}</button>
            <button class="icon-btn small slim ${total ? "ready" : ""}" type="button" data-tool-print="${esc(secKey)}" title="Send all ${esc(toolLabel(secKey))} tags to Quick-Tag Compose">⎙</button>
            <button class="icon-btn small slim" type="button" data-tool-clear="${esc(secKey)}" title="Clear all ${esc(toolLabel(secKey))} tags" ${total ? "" : "disabled"}>⌫</button>
          </div>
        </div>
        ${open ? `
          <div class="tool-inline-body">
            ${list.length ? `
              <div class="tool-chip-grid ${expanded ? "expanded" : "compact"}">
                ${list.map((item, index) => renderInlineToolChip(secKey, item, index, expanded)).join("")}
              </div>` : `<div class="drawer-empty mini-empty">No tags yet.</div>`}
            ${expanded ? `
              <div class="tool-tray-add-row inline-add-row">
                <input class="drawer-input" id="drawer-input-${esc(secKey)}" type="text" placeholder="Add custom…" data-tool-input="${esc(secKey)}" />
                <button class="drawer-add-btn" type="button" data-tool-add="${esc(secKey)}">+</button>
              </div>` : ""}
          </div>` : ""}
      </section>
    `;
  }

  function renderInlineToolChip(secKey, item, index, expanded) {
    const label = expanded ? toolItemLabel(item) : (toolItemDisplay(item) || toolItemLabel(item));
    const fullLabel = toolItemLabel(item) || label;
    return `
      <span class="tool-chip ${expanded ? "full" : "mini"}" data-tool-tag="${esc(secKey)}::${index}" data-tool-chipsec="${esc(secKey)}" data-tool-chip="${index}">
        <span class="tool-chip-label">${esc(label)}</span>
        <button class="tool-chip-remove" type="button" data-tool-remove="${index}" data-tool-removesec="${esc(secKey)}" aria-label="Remove ${esc(fullLabel)}" title="Remove ${esc(fullLabel)}">×</button>
      </span>
    `;
  }

  function renderHotkeyLegend(compact = false) {
    return `
      <div class="hotkey-legend ${compact ? "compact" : ""}">
        <span class="hotkey-pill">Q–P</span><span class="hotkey-text">sections</span>
        <span class="hotkey-pill">1–9</span><span class="hotkey-text">categories</span>
        <span class="hotkey-pill">= / −</span><span class="hotkey-text">Quick pages</span>
      </div>
    `;
  }

  function renderTopCategoryRow(horizontal = false) {
    return `
      <div class="top-category-row ${horizontal ? "horizontal-nav" : ""}">
        ${renderViewAllButton()}
        ${topSections().map((section, index) => renderTopSectionButton(section, index)).join("")}
      </div>
    `;
  }

  function renderViewAllButton() {
    const active = state.selectedSection === ALL_SECTIONS_KEY;
    return `
      <button class="top-cat-btn ${active ? "active" : ""}" type="button" data-section="${esc(ALL_SECTIONS_KEY)}" style="${sectionChipVars(ALL_SECTIONS_KEY, active)}">
        <span class="top-cat-name">All</span>
        <span class="top-cat-count">${sectionCount(ALL_SECTIONS_KEY)}</span>
      </button>
    `;
  }

  function renderTopSectionButton(section, index) {
    const active = state.selectedSection === section.key;
    return `
      <button class="top-cat-btn ${active ? "active" : ""}" type="button" data-section="${esc(section.key)}" style="${sectionChipVars(section.key, active)}">
        <span class="top-cat-name">${esc(section.label)}</span>
        <span class="top-cat-count">${sectionCount(section.key)}</span>
      </button>
    `;
  }

  function renderToolLauncher(secKey) {
    const list = getToolList(secKey);
    const active = isToolTrayOpen(secKey);
    const totalCount = list.length;
    const fillClass = totalCount ? "filled" : "empty";
    const shortLabel = secKey === "instruments" ? "Ins" : "Vib";
    return `
      <button class="tool-launch-btn tool-compact ${fillClass} ${active ? "active" : ""}" type="button" data-tool="${esc(secKey)}" title="Show or hide ${esc(toolButtonLabel(secKey))}">
        <span class="tool-launch-name">${esc(shortLabel)}</span>
        <span class="tool-launch-meta">${totalCount}</span>
      </button>
    `;
  }

  function renderMainView() {
    if (state.searchOnlyMode) {
      return renderSearchResultsView();
    }

    if (state.query) {
      return renderSearchResultsView();
    }

    if (!state.selectedSection) {
      return `
        <div class="empty-state">
          <div class="empty-title">Choose a top category</div>
          <p>Select one of the main categories above, or choose All, to open sub-categories in the main panel.</p>
        </div>
      `;
    }

    const sectionsToShow = state.selectedSection
      ? (state.selectedSection === ALL_SECTIONS_KEY
          ? topSections().filter((section) => categorySummaries(section.key).some((entry) => entry.visibleCount > 0))
          : topSections().filter((section) => section.key === state.selectedSection))
      : topSections().filter((section) => categorySummaries(section.key).some((entry) => entry.visibleCount > 0));

    if (!sectionsToShow.length) {
      return `
        <div class="empty-state compact">
          <div class="empty-title">No matches</div>
          <p>Nothing matches the current search.</p>
        </div>
      `;
    }

    return sectionsToShow.map((section) => renderSectionBlock(section)).join("");
  }

  function renderSearchOnlyView() {
    return renderSearchResultsView();
  }

  function renderSearchResultsView() {
    const blocks = searchOnlyBlocks();
    if (!blocks.length) {
      const q = state.queryInput.trim();
      const alreadySaved = q && (state.undefinedTerms || []).some(u => normalize(undefinedTermText(u)) === normalize(q));
      return `
        <div class="empty-state compact">
          <div class="empty-title">No matches</div>
          <p>Try a shortcut, a full term, or a category like Strings or Dynamics.</p>
          ${q ? `<button class="ghost-btn slim${alreadySaved ? " active" : ""}" id="bp-search-save-undefined" type="button" title="${alreadySaved ? "Already saved to Undefined" : "Save this term to Undefined in the editor"}">${alreadySaved ? "Saved" : "Save undefined"}</button>` : ""}
        </div>
      `;
    }

    if (state.searchScope === "category" && !state.searchCategoryFilter) {
      return `
        <section class="search-only-view compact-results-only cats-prompt">
          <div class="empty-state compact inline-empty">
            <div class="empty-title">Choose a category</div>
            <p>Use <strong>Categories</strong> above to open one of the matched groups.</p>
          </div>
        </section>
      `;
    }

    if (state.searchScope === "category") {
      return `
        <section class="search-only-view category-results-view">
          <div class="accordion-list search-category-results">
            ${blocks.map((entry, index) => renderCategoryAccordion(entry, index, true, true)).join("")}
          </div>
        </section>
      `;
    }

    const flatGroups = groupedTerms(blocks.flatMap((entry) => entry.terms));
    return `
      <section class="search-only-view compact-results-only cats-hidden all-pills">
        <div class="search-pill-grid search-flat-grid" style="--search-cols:${Math.max(1, state.layoutCols)};">
          ${flatGroups.map(renderSearchPillGroup).join("")}
        </div>
      </section>
    `;
  }

  function renderSearchCategoryChip(entry) {
    const active = state.searchCategoryFilter === entry.display;
    return `
      <button class="search-category-chip ${active ? "active" : ""} ${entry.categoryMatch ? "match" : ""}" type="button" data-search-cat="${esc(entry.display)}" style="${categoryChipVars(entry.display, active)}">
        <span class="search-category-name">${esc(entry.label)}</span>
        <span class="search-category-meta">${esc(entry.sectionLabel)}</span>
        <span class="search-category-count">${entry.visibleCount}</span>
      </button>
    `;
  }

  function renderSearchPillGroup(group) {
    const term = group.primary;
    const key = termKey(term);
    const definition = getHelpText(term);
    const active = group.all.some((item) => state.pinnedKey === termKey(item) || (!state.pinnedKey && state.previewKey === termKey(item)));
    const clickable = state.sidebarMode || definition || activeCategoryRoute(term);
    return `
      <article class="term-card search-pill ${definition ? "defable" : ""} ${clickable ? "clickable" : ""} ${active ? "active" : ""}" data-key="${esc(key)}" data-has-def="${definition ? "1" : "0"}" style="${cardVars(term)}">
        <div class="search-pill-main">
          <code class="shortcut-pill">${esc(term.s)}</code>
          ${group.variants.length ? `<div class="variant-pill-row inline-variants">${group.variants.map(renderVariantPill).join("")}</div>` : ""}
        </div>
        <div class="search-pill-term">${esc(term.p)}</div>
      </article>
    `;
  }

  function renderSectionBlock(section) {
    const categories = categorySummaries(section.key);
    if (!categories.length) return "";

    return `
      <section class="section-block">
        ${(!state.selectedSection || state.selectedSection === ALL_SECTIONS_KEY) ? `<div class="section-heading">${esc(section.label)}</div>` : ""}
        <div class="accordion-list">
          ${categories.map((entry, index) => renderCategoryAccordion(entry, index)).join("")}
        </div>
      </section>
    `;
  }

  function renderCategoryAccordion(entry, index, forceExpanded = false, useVisibleCount = false) {
    const expanded = (forceExpanded || state.query) ? true : state.expandedCats.has(entry.display);
    const count = (useVisibleCount || state.query) ? entry.visibleCount : entry.totalCount;
    const groups = groupedTerms(entry.terms);
    const palette = paletteForCategory(entry.display);
    const rowStyle = state.themeMode === "dark"
      ? `--row-tint:hsl(${palette.h} ${palette.s}% 16%);--row-border:hsl(${palette.h} ${clamp(palette.s + 8, 10, 78)}% 30%);--row-accent:hsl(${palette.h} ${clamp(palette.s + 8, 10, 78)}% 72%);`
      : `--row-tint:hsl(${palette.h} ${palette.s}% 95%);--row-border:hsl(${palette.h} ${clamp(palette.s + 8, 10, 78)}% 80%);--row-accent:hsl(${palette.h} ${clamp(palette.s + 4, 10, 78)}% 32%);`;

    return `
      <div class="accordion-item ${expanded ? "open" : ""}">
        <button class="accordion-row" type="button" data-accordion="${esc(entry.display)}" style="${rowStyle}">
          <span class="accordion-row-main">
            <span class="accordion-index">${index + 1}</span>
            <span class="accordion-arrow">▸</span>
            <span class="accordion-label">${esc(entry.label)}</span><span class="accordion-hotkey-hint">${index + 1}</span>
          </span>
          <span class="accordion-count">${count}</span>
        </button>
        ${expanded ? `
          <div class="accordion-panel">
            ${state.editMode ? renderInlineCategoryEditor(entry) : ""}
            <div class="cards-grid">
              ${groups.map(renderCardGroup).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderVariantPill(term) {
    const key = termKey(term);
    const active = state.pinnedKey === key || (!state.pinnedKey && state.previewKey === key);
    const defable = !!getHelpText(term);
    return `<button class="variant-pill ${active ? "active" : ""} ${defable ? "defable" : ""}" type="button" data-variant-key="${esc(key)}" data-has-def="${defable ? "1" : "0"}" title="${esc(`${term.p} · ${term.s}`)}">${esc(term.suffix || term.s)}</button>`;
  }

  function renderCardGroup(group) {
    const term = group.primary;
    const key = termKey(term);
    const definition = getHelpText(term);
    const active = group.all.some((item) => state.pinnedKey === termKey(item) || (!state.pinnedKey && state.previewKey === termKey(item)));
    const clickable = state.sidebarMode || definition || activeCategoryRoute(term);
    return `
      <article class="term-card ${definition ? "defable" : ""} ${clickable ? "clickable" : ""} ${active ? "active" : ""}" data-key="${esc(key)}" data-has-def="${definition ? "1" : "0"}" style="${cardVars(term)}">
        <div class="card-top">
          <div class="card-chip-row">
            <code class="shortcut-pill">${esc(term.s)}</code>
            ${group.variants.length ? `<div class="variant-pill-row">${group.variants.map(renderVariantPill).join("")}</div>` : ""}
          </div>
          ${definition ? `<span class="def-dot" aria-hidden="true"></span>` : ""}
        </div>
        <div class="term-label">${esc(term.p)}</div>
      </article>
    `;
  }

function renderComposerWindow() {
  const hasText = state.composerText.trim().length > 0;
  const connectives = getConnectives();
  const allConns = [...connectives, ...state.listenConnectives];
  const hint = state.composerFocused ? "active — click terms to add" : "click here, then click terms";
  const deleteArmed = state.connDeleteArmed;
  const deleteTarget = state.connDeleteTarget;

  return `
    <div class="composer-bar${state.composerFocused ? " composer-focused" : ""}">
      <div class="composer-row">
        <textarea class="composer-input" id="bp-composer-text" placeholder="${hint}" rows="2">${esc(state.composerText)}</textarea>
        <div class="composer-actions-col">
          <button class="composer-btn${hasText ? " composer-print" : ""}" id="bp-composer-print" type="button" title="Print to selected field"${!hasText ? " disabled" : ""}>⎙ Print</button>
          <button class="composer-btn" id="bp-composer-clear" type="button">Clear</button>
          <button class="composer-btn${state.connEditOpen ? " composer-conn-on" : ""}" id="bp-conn-edit" type="button" title="Connectives (Tab)">conn</button>
        </div>
      </div>
      ${state.connEditOpen ? `
        <div class="conn-panel">
          <div class="conn-pill-row">
            ${allConns.map((w, i) => {
              const isListen = i >= connectives.length;
              const isTarget = deleteArmed && deleteTarget === w;
              let cls = "conn-pill";
              if (isListen) cls += " conn-pill-listen";
              if (deleteArmed) cls += isTarget ? " conn-pill-delete-target" : " conn-pill-delete-mode";
              return `<button class="${cls}" type="button" data-conn-insert="${esc(w)}" data-conn-word="${esc(w)}">${esc(w)}</button>`;
            }).join("")}
            <button class="conn-pencil-btn${state.connPencilOpen ? " composer-conn-on" : ""}" id="bp-conn-pencil" type="button" title="Add / delete connectives">✎</button>
          </div>
          ${state.connPencilOpen ? `
            <div class="conn-editor-bar">
              ${state.connAddOpen ? `
                <div class="conn-add-row">
                  <input class="conn-add-input" id="bp-conn-add-input" type="text" placeholder="new word" value="${esc(state.connAddInput || "")}" autocomplete="off" />
                  <button class="conn-action-btn" id="bp-conn-add-confirm" type="button">Add</button>
                  <button class="conn-action-btn conn-action-cancel" id="bp-conn-add-cancel" type="button">✕</button>
                </div>` : `
                <button class="conn-action-btn" id="bp-conn-add-open" type="button">+ Add</button>`}
              <button class="conn-action-btn${deleteArmed ? " conn-delete-armed" : ""}${deleteTarget ? " conn-delete-ready" : ""}" id="bp-conn-delete-toggle" type="button" title="${deleteArmed && deleteTarget ? "Click to confirm delete" : deleteArmed ? "Now click a connective to delete it" : "Delete a connective"}">
                ${deleteArmed && deleteTarget ? `Delete "${esc(deleteTarget)}"` : "− Delete"}
              </button>
              ${deleteArmed ? `<button class="conn-action-btn conn-action-cancel" id="bp-conn-delete-cancel" type="button">Cancel</button>` : ""}
              <button class="conn-action-btn conn-action-reset" id="bp-conn-reset" type="button">Reset</button>
            </div>` : ""}
        </div>` : ""}
    </div>
  `;
}

function renderConfirmExitModal() {
  if (!state.confirmExitOpen) return "";
  return `
    <div class="confirm-exit-overlay" id="bp-confirm-overlay">
      <div class="confirm-exit-modal">
        <div class="confirm-exit-title">Save and exit?</div>
        <div class="confirm-exit-body">This will save your changes and export updated CSV and .plist files.</div>
        <div class="confirm-exit-actions">
          <button class="confirm-btn confirm-cancel" id="bp-confirm-cancel" type="button">Cancel</button>
          <button class="confirm-btn confirm-ok" id="bp-confirm-ok" type="button">Save &amp; Export</button>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmNextTrackModal() {
  if (!state.confirmNextTrack) return "";
  return `
    <div class="confirm-exit-overlay" id="bp-confirm-next-overlay">
      <div class="confirm-exit-modal">
        <div class="confirm-exit-title">Clear all current panes?</div>
        <div class="confirm-exit-body">Ins, Vib, Quick, and connectives will be cleared for the next track. Custom terms, templates, and undefined terms are preserved.</div>
        <div class="confirm-exit-actions">
          <button class="confirm-btn confirm-cancel" id="bp-next-cancel" type="button">Cancel</button>
          <button class="confirm-btn confirm-next-ok" id="bp-next-confirm" type="button">Clear &amp; Next</button>
        </div>
      </div>
    </div>
  `;
}

function renderDefinitionBar() {
  return `
    <section class="definition-bar" id="bp-def-bar" aria-live="polite">
      <div class="definition-bar-top">
        <span class="definition-bar-mark">?</span>
        <div class="definition-bar-title" id="bp-def-bar-title">Definition mode</div>
      </div>
      <div class="definition-bar-body" id="bp-def-bar-body">Hover a term, pill, or tray item to view its definition.</div>
    </section>
  `;
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
    savePrefs(); render();
  }

  function confirmTempTermEdit(idx) {
    const text = state.tempTermsEditText.trim();
    if (!text) { state.tempTermsEditTarget = null; render(); return; }
    const shortcut = state.tempTermsEditShortcut.trim();
    const entry = shortcut ? { text, shortcut, source: "manual" } : text;
    state.undefinedTerms = state.undefinedTerms.map((u, i) => i === idx ? entry : u);
    state.tempTermsEditTarget = null;
    state.tempTermsEditText = "";
    state.tempTermsEditShortcut = "";
    savePrefs(); render();
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
    navigator.clipboard?.writeText(prompt).then(() => {
      state.editorMessage = `Exported ${state.undefinedTerms.length} terms — prompt copied to clipboard`;
      render();
    }).catch(() => {
      state.editorMessage = "Copy failed — check browser permissions";
      render();
    });
  }

  const QUICK_ITEMS_PER_PAGE = 20;

  function renderQuickHeader(hasItems, undefCount, minLabel) {
    const composeActive = state.quickComposePinned || state.composerStealing;
    const hkArmed = state.quickHotkeysArmed;
    return `
      <div class="session-window-header" id="bp-session-drag">
        <span class="session-window-title">
          <span class="session-compose-dot${composeActive ? " session-compose-dot--on" : ""}"
            title="${composeActive ? "Compose active" : "Compose inactive"}"></span>
          quick
          <span class="myui-build-tag" title="Build">${MYUI_BUILD}</span>
        </span>
        <div class="session-window-actions">
          <button class="session-ctrl-btn session-hk-btn${hkArmed ? " session-hk-btn--armed" : ""}"
            id="bp-qs-arm-hotkeys" type="button"
            title="${hkArmed ? "Hotkeys armed — click to disarm" : "Arm hotkeys (bypass field focus)"}">
            ⌨${hkArmed ? " ON" : ""}
          </button>
          ${undefCount ? `<button class="session-ctrl-btn session-undef-btn${state.undefinedOpen ? " active" : ""}"
            id="bp-undefined-toggle" type="button">${undefCount} new</button>` : ""}
          <button class="session-ctrl-btn session-ctrl-btn-dev" id="myui-dev-reset" type="button" title="DEV: clear all stored state and reset QuickTag">↺</button>
          <button class="session-ctrl-btn" id="bp-session-minimize" type="button">${minLabel}</button>
          <button class="session-ctrl-btn session-close-btn" id="bp-session-close" type="button">×</button>
        </div>
      </div>
    `;
  }

  function renderQsTopStrip(key) {
    const offset = key === "terms"   ? state.quickTermsHotkeyOffset
                 : key === "connect" ? state.quickConnHotkeyOffset
                 : key === "phrases" ? state.quickPhrasesHotkeyOffset
                 : 0;
    const hotkeys = key === "terms"   ? TERMS_HOTKEYS
                  : (key === "connect" || key === "phrases") ? CONN_HOTKEYS
                  : [];
    let list = [];
    if (key === "terms") list = state.sessionItems;
    else if (key === "connect") list = [...getConnectives(), ...state.listenConnectives];
    else if (key === "phrases") list = state.quickPhrases || [];
    if (!list.length || !hotkeys.length) return "";
    const win = getHotkeyWindow(list, offset);
    const top4 = win.slice(0, 4);
    const isArmed = state.quickModifierArmed;
    const maxOffset = Math.max(0, list.length - HOTKEY_WINDOW_SIZE);
    const canPrev = offset > 0;
    const canNext = offset < maxOffset;
    const showCycle = list.length > HOTKEY_WINDOW_SIZE;
    return `
      <div class="qs-top-strip">
        ${showCycle ? `<button class="qs-cycle-btn qs-cycle-prev${canPrev ? "" : " qs-cycle-disabled"}"
          type="button" data-qs-cycle-prev="${key}" title="Previous window">‹</button>` : ""}
        ${top4.map((item, i) => {
          const text = typeof item === "string" ? item : item.text || item.p || "";
          const hk = hotkeys[i] || "";
          return `<button class="qs-strip-pill${isArmed ? " qs-strip-armed" : ""}"
            type="button" data-strip-key="${key}" data-strip-idx="${i + offset}">
            <span class="qs-strip-hk">${esc(hk)}</span>
            <span class="qs-strip-text">${esc(text.slice(0, 12))}</span>
          </button>`;
        }).join("")}
        ${showCycle ? `<button class="qs-cycle-btn qs-cycle-next${canNext ? "" : " qs-cycle-disabled"}"
          type="button" data-qs-cycle-next="${key}" title="Next window">›</button>` : ""}
      </div>
    `;
  }

  function qsHotkeyHint(key) {
    if (key === "terms")   return `<span class="qs-hk-hint">⇧1–0</span>`;
    if (key === "connect") return `<span class="qs-hk-hint">⌥1–0</span>`;
    if (key === "phrases") return `<span class="qs-hk-hint">⌥1–0</span>`;
    return "";
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

  function renderQuickSection(key, label, pinned, bodyHtml) {
    const openKey = `quick${key.charAt(0).toUpperCase() + key.slice(1)}Pinned`;
    const isOpen = state[openKey];
    const hasControls = key !== "compose" && key !== "templates";
    return `
      <div class="qs-section${isOpen ? " qs-open" : ""}">
        <div class="qs-header" data-qs-toggle="${key}">
          <button class="qs-pin${pinned ? " qs-pin-active" : ""}"
            type="button" data-qs-pin="${key}" title="Pin open">📌</button>
          <span class="qs-chevron">${isOpen ? "▾" : "▸"}</span>
          <span class="qs-label">${label}</span>
          ${qsHotkeyHint(key)}
          <span class="qs-header-spacer"></span>
          ${hasControls ? qsOrderBtn(key) : ""}
          ${isOpen && hasControls ? `<button class="qs-hide-btn" type="button" data-qs-hide="${key}" title="Collapse section">Hide</button>` : ""}
          ${hasControls ? renderQsSectionControls(key) : ""}
        </div>
        ${isOpen ? `<div class="qs-body">${bodyHtml}</div>` : ""}
      </div>
    `;
  }

  function renderQsSectionControls(key) {
    if (key === "compose" || key === "templates") return "";
    const inputId = `bp-qs-input-${key}`;
    const inputKey = key === "connect" ? "quickConnectInput"
                   : key === "phrases" ? "quickPhrasesInput"
                   : "quickTermsInput";
    const modeKey = key === "connect" ? "quickConnectDeleteMode"
                  : key === "phrases" ? "quickPhrasesDeleteMode"
                  : "quickTermsDeleteMode";
    const targetKey = key === "connect" ? "quickConnectDeleteTarget"
                    : key === "phrases" ? "quickPhrasesDeleteTarget"
                    : "quickTermsDeleteTarget";
    const inputVal = state[inputKey] || "";
    const deleteMode = state[modeKey];
    const hasTarget = state[targetKey] !== null;
    const delClass = !deleteMode ? ""
                   : hasTarget   ? " qs-del-green"
                   :               " qs-del-armed";
    return `
      <input class="qs-input" id="${inputId}" type="text"
        placeholder="Add…" value="${esc(inputVal)}" />
      <button class="qs-add-btn${inputVal.trim() ? " qs-add-active" : ""}"
        type="button" data-qs-add="${key}" title="Add">
        <span class="qs-inline-icon qs-inline-icon-plus" aria-hidden="true">+</span>
      </button>
      <button class="qs-del-btn${delClass}"
        type="button" data-qs-delete="${key}" title="Delete">
        <span class="qs-inline-icon qs-inline-icon-trash" aria-hidden="true">🗑</span>
      </button>
    `;
  }

  function renderComposeSectionBody() {
    const resolvedText = getComposerResolvedText();
    const hasText = resolvedText.trim().length > 0;
    const hasPills = state.composerPills.length > 0;
      return `
      <div class="qs-compose-body">
        <div class="qs-compose-helper">${state.composerSelectedPillId !== null ? "Selected pill mode — move it with the arrows or keyboard, and the sentence updates immediately." : "Type here first, or click terms/connectors to add pills alongside the text. Typed terms collect when you render with Enter or before save/print."}</div>
        ${hasPills ? `
          <div class="qs-preview-tray" id="bp-preview-tray">
            ${state.composerPills.map(pill => {
              const isSelected = state.composerSelectedPillId === pill.id;
              const isDragging = state.composerDragId === pill.id;
              return `
                <div class="qs-preview-pill${isSelected ? " qs-preview-selected" : ""}${isDragging ? " qs-preview-dragging" : ""}${pill.type === "text" ? " qs-preview-text-pill" : ""}${pill.type === "connector" ? " qs-preview-conn-pill" : ""}${pill.type === "undefined" ? " qs-preview-undefined-pill" : ""}"
                  draggable="true" data-pill-id="${pill.id}" data-pill-select="${pill.id}">
                  <span class="qs-preview-pill-text">${esc(pill.text)}</span>
                  ${isSelected ? `
                    <button class="qs-pill-move-btn" type="button" data-pill-up="${pill.id}" title="Move left">←</button>
                    <button class="qs-pill-move-btn" type="button" data-pill-down="${pill.id}" title="Move right">→</button>` : ""}
                </div>`;
            }).join("")}
            <button class="qs-preview-delete" id="bp-preview-clear" type="button" title="Clear all pills">×</button>
          </div>` : ""}
        <textarea class="qs-compose-area" id="bp-composer-text"
          rows="3" placeholder="Type directly here or click terms to build the sentence…"
          >${esc(resolvedText)}</textarea>
        <div class="qs-compose-actions">
          <span class="compose-status-pill ${state.writeMode ? "csp-green" : "csp-red"}" title="${state.writeMode ? "Clicked items publish into Quick-Tag Compose" : "Clicked-item publish is paused"}">${state.writeMode ? "● Compose on" : "● Compose off"}</span>
          <span class="compose-status-pill ${currentWriteState() ? "csp-green" : "csp-amber"}" title="${currentWriteState() ? "A page field is armed for Print" : "Click a real page field to arm Print"}">${currentWriteState() ? "● Field ready" : "◑ No field"}</span>
          <button class="qs-print-btn ${currentWriteState() ? "qs-print-ready" : "qs-print-no-field"}" id="bp-composer-print"
            type="button" ${!hasText ? "disabled" : ""}>
            ${currentWriteState() ? "Print" : "Page off"}
          </button>
          <button class="qs-save-chip-btn" id="bp-composer-save-chip"
            type="button" ${!hasText ? "disabled" : ""}>Save</button>
          <button class="qs-clear-btn" id="bp-composer-clear"
            type="button">Clear</button>
        </div>
        ${state.composerChips.length ? `
          <div class="qs-chip-list">
            ${state.composerChips.map(chip => `
              <div class="qs-chip-row">
                <button class="qs-chip${chip.active ? " qs-chip-active" : ""}"
                  type="button" data-chip-id="${chip.id}">
                  <span class="qs-chip-num">${chip.id}</span>
                  <span class="qs-chip-text">${esc(chip.text)}</span>
                </button>
                <button class="qs-chip-del" type="button" data-chip-del="${chip.id}" title="Delete chip">×</button>
              </div>`).join("")}
          </div>` : ""}
      </div>
    `;
  }

  function renderConnectSectionBody() {
    const custom = getConnectives();
    const listenConns = state.listenConnectives || [];
    if (!custom.length && !listenConns.length) {
      return `<div class="qs-empty">No connectives yet.</div>`;
    }
    const deleteMode = state.quickConnectDeleteMode;
    const allWords = [...custom, ...listenConns.filter(w => !custom.includes(w))];
    const sorted = state.quickConnectOrderMode === "az"
      ? [...allWords].sort((a, b) => a.localeCompare(b))
      : allWords;
    const offset = state.quickConnHotkeyOffset;
    const win = getHotkeyWindow(sorted, offset);
    const winSet = new Map(win.map((w, i) => [typeof w === "string" ? w : (w.text || w.p || ""), i]));
    return `
      <div class="qs-pill-list${deleteMode ? " qs-delete-active" : ""}">
        ${sorted.map(w => {
          const isListen = !custom.includes(w);
          const slotIdx = winSet.has(w) ? winSet.get(w) : -1;
          const numLabel = slotIdx >= 0 && slotIdx < 9 ? String(slotIdx + 1) : slotIdx === 9 ? "0" : "";
          const cls = `qs-pill conn-pill${isListen ? " conn-pill-listen" : ""}${deleteMode ? (state.quickConnectDeleteTarget === w ? " qs-pill-targeted" : " qs-pill-deletable") : ""}`;
          return `<button class="${cls}" type="button" data-conn-insert="${esc(w)}"${isListen ? ' title="From Listen"' : ""}>
            ${numLabel ? `<span class="terms-pill-num">${numLabel}</span>` : ""}<span class="conn-pill-text">${esc(w)}</span>
          </button>`;
        }).join("")}
      </div>
    `;
  }

  function renderPhrasesSectionBody() {
    const phrases = state.quickPhrases || [];
    const deleteMode = state.quickPhrasesDeleteMode;
    if (!phrases.length) {
      return `<div class="qs-empty">No phrases yet. Add one above.</div>`;
    }
    const sorted = state.quickPhrasesOrderMode === "az"
      ? [...phrases].sort((a, b) => (a.text || "").localeCompare(b.text || ""))
      : phrases;
    const offset = state.quickPhrasesHotkeyOffset;
    const win = getHotkeyWindow(sorted, offset);
    const winSet = new Map(win.map((p, i) => [p.id, i]));
    return `
      <div class="qs-pill-list${deleteMode ? " qs-delete-active" : ""}">
        ${sorted.map((p) => {
          const slotIdx = winSet.has(p.id) ? winSet.get(p.id) : -1;
          const numLabel = slotIdx >= 0 && slotIdx < 9 ? String(slotIdx + 1) : slotIdx === 9 ? "0" : "";
          const cls = `qs-pill phrase-pill${deleteMode ? (state.quickPhrasesDeleteTarget === p.id ? " qs-pill-targeted" : " qs-pill-deletable") : ""}`;
          return `<button class="${cls}" type="button" data-phrase-write="${p.id}">
            ${numLabel ? `<span class="terms-pill-num">${numLabel}</span>` : ""}<span class="phrase-pill-text">${esc(p.text)}</span>
          </button>`;
        }).join("")}
      </div>
    `;
  }

  function renderTermsCatView() {
    const groups = {};
    for (const item of state.sessionItems) {
      const sec = item.key?.split("::")?.[0] || "mix";
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(item);
    }
    return SECTION_ORDER.filter(sec => groups[sec]?.length).map(sec => {
      const items = groups[sec];
      const hotkey = SECTION_CAT_HOTKEYS[sec] || "";
      const isPinned = (state.quickTermsCatPins || []).includes(sec);
      const isOpen = isPinned || state.quickTermsCatOpen === sec;
      const hue = SECTION_HUES[sec] || 210;
      return `
        <div class="qs-cat-group${isOpen ? " qs-cat-open" : ""}" data-cat-sec="${sec}">
          <div class="qs-cat-header" data-cat-toggle="${sec}">
            <button class="qs-cat-pin${isPinned ? " qs-pin-active" : ""}"
              type="button" data-cat-pin="${sec}">📌</button>
            <span class="qs-cat-chevron">${isOpen ? "▾" : "▸"}</span>
            <span class="qs-cat-label"
              style="color:hsla(${hue},55%,55%,1)">${esc(sectionLabel(sec))}</span>
            <span class="qs-cat-count">${items.length}</span>
            ${hotkey ? `<span class="qs-cat-hotkey">${hotkey.toUpperCase()}</span>` : ""}
          </div>
          ${isOpen ? `
            <div class="qs-cat-body">
              ${items.slice(0, 10).map((item, i) => {
                const numLabel = i < 9 ? String(i + 1) : i === 9 ? "0" : "";
                const globalIdx = state.sessionItems.indexOf(item);
                const deleteAttr = state.quickTermsDeleteMode ? ` data-session-remove="${globalIdx}"` : "";
                return `
                  <button class="qs-pill terms-pill" type="button"
                    data-session-write="${globalIdx}" data-session-item="${globalIdx}"${deleteAttr}
                    title="${esc(item.text || "")}">
                    ${numLabel ? `<span class="terms-pill-num">${numLabel}</span>` : ""}
                    <span class="terms-pill-text">${esc(item.text || "")}</span>
                  </button>`;
              }).join("")}
              ${items.length > 10 ? `<div class="qs-cat-overflow">+${items.length - 10} more</div>` : ""}
            </div>` : ""}
        </div>`;
    }).join("");
  }

  function renderTermsSectionBody(pageItems, totalPages, page, hasItems) {
    const storeRow = `
      <div class="qs-terms-footer">
        <div class="session-store-row">
          <input class="session-template-name" id="bp-template-name" type="text"
            placeholder="Name this set…" value="${esc(state.quickTemplateNameInput || "")}" />
          <button class="session-ctrl-btn" id="bp-template-save" type="button">Store</button>
        </div>
        <button class="session-ctrl-btn" id="bp-session-clear" type="button">Clear</button>
      </div>`;
    if (!hasItems) {
      return `<div class="qs-empty">Click terms to collect them here.</div>`;
    }
    if (state.quickTermsViewMode === "cat") {
      return `<div class="qs-terms-body">${renderTermsCatView()}${storeRow}</div>`;
    }
    const displayItems = state.quickTermsViewMode === "az"
      ? [...state.sessionItems].sort((a, b) => (a.text || "").localeCompare(b.text || ""))
      : pageItems;
    const deleteMode = state.quickTermsDeleteMode;
    const inMoveMode = state.quickMoveMode === "terms" && state.quickTermsViewMode === "user";
    const moveBtn = state.quickTermsViewMode === "user" ? `
      <button class="qs-move-btn${inMoveMode ? " qs-move-btn--active" : ""}"
        type="button" data-qs-move="terms"
        title="${inMoveMode ? "Exit move mode (Enter or click away)" : "Reorder pills"}">
        ${inMoveMode ? "Done" : "Move"}
      </button>` : "";
    return `
      <div class="qs-terms-body">
        ${state.quickTermsViewMode === "user" ? `<div class="qs-terms-toolbar">${moveBtn}</div>` : ""}
        <div class="qs-pill-list terms-pill-list${deleteMode ? " qs-delete-active" : ""}${inMoveMode ? " qs-move-active" : ""}">
          ${displayItems.map((item, i) => {
            const absIdx = state.quickTermsViewMode === "az"
              ? state.sessionItems.indexOf(item)
              : page * QUICK_ITEMS_PER_PAGE + i;
            const extra = deleteMode ? (state.quickTermsDeleteTarget === absIdx ? "qs-pill-targeted" : "qs-pill-deletable") : "";
            return renderSessionItem(item, absIdx, i, extra, false);
          }).join("")}
        </div>
        ${totalPages > 1 && state.quickTermsViewMode === "user" ? `
          <div class="qs-pagination">
            <button class="qs-page-btn" id="bp-session-page-prev" type="button" ${page === 0 ? "disabled" : ""}>‹</button>
            <span class="qs-page-label">${page + 1} / ${totalPages}</span>
            <button class="qs-page-btn" id="bp-session-page-next" type="button" ${page >= totalPages - 1 ? "disabled" : ""}>›</button>
          </div>` : ""}
        ${storeRow}
      </div>
    `;
  }

  function renderTemplatesSectionBody(templates) {
    if (!templates.length) {
      return `<div class="qs-empty">No saved templates. Use Store in the Terms section.</div>`;
    }
    return `
      <div class="qs-item-list">
        ${templates.map((t, i) => `
          <div class="qs-item">
            <button class="qs-item-load" type="button" data-template-load="${i}">${esc(t.name)} <span class="template-item-count">${t.items.length}</span></button>
            <button class="qs-item-remove" type="button" data-template-delete="${i}" title="Delete template">×</button>
          </div>`).join("")}
      </div>
    `;
  }

function renderSessionWindow() {
  const pos = clampSessionPosition(state.sessionX, state.sessionY, state.sessionWidth, state.sessionHeight);
  state.sessionX = pos.x;
  state.sessionY = pos.y;
  state.sessionWidth = pos.width;
  state.sessionHeight = pos.height;
  if (!state.sessionOpen) return "";
  const minLabel = state.sessionMinimized ? "▾" : "▴";
  const hasItems = state.sessionItems.length > 0;
  const undefTerms = state.undefinedTerms || [];
  const undefCount = undefTerms.length;
  const page = Math.max(0, state.sessionPage || 0);
  const totalPages = Math.max(1, Math.ceil(state.sessionItems.length / QUICK_ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = state.sessionItems.slice(safePage * QUICK_ITEMS_PER_PAGE, (safePage + 1) * QUICK_ITEMS_PER_PAGE);

  return `
    <aside class="session-window ${state.themeMode}${state.sessionMinimized ? " minimized" : ""}"
      id="bp-session-window"
      style="left:${state.sessionX}px;top:${state.sessionY}px;width:${state.sessionWidth}px;${state.sessionMinimized ? "" : `height:${state.sessionHeight}px;min-height:${SESSION_MIN_HEIGHT}px;`}">

      ${renderQuickHeader(hasItems, undefCount, minLabel)}

      ${state.sessionMinimized ? "" : `
        <div class="qs-compose-shell">
          <div class="qs-compose-shell-title">Compose</div>
          ${renderComposeSectionBody()}
        </div>
        ${renderQuickSection("connect", "Connect", state.quickConnectPinned,
            renderConnectSectionBody())}
        ${renderQuickSection("phrases", "Phrases", state.quickPhrasesPinned,
            renderPhrasesSectionBody())}
        ${renderQuickSection("terms", "Terms", state.quickTermsPinned,
            renderTermsSectionBody(pageItems, totalPages, safePage, hasItems))}
        <div class="session-window-resizer" id="bp-session-resizer" aria-hidden="true"></div>
      `}
    </aside>
  `;
}

function renderSessionConnPanel() {
  if (!state.sessionOpen || state.sessionMinimized || !state.quickConnOpen) return "";
  return `
    <div class="session-conn-panel ${state.themeMode}" id="bp-session-conn-panel" style="position:fixed;z-index:2147483645;">
      <div class="session-conn-pills">
        ${getConnectives().map(w => `<button class="conn-pill session-conn-pill" type="button" data-conn-insert="${esc(w)}">${esc(w)}</button>`).join("")}
        ${state.listenConnectives.map(w => `<button class="conn-pill conn-pill-listen session-conn-pill" type="button" data-conn-insert="${esc(w)}" title="From Listen">${esc(w)}</button>`).join("")}
      </div>
      <div class="session-conn-hint">Click to insert into composer</div>
    </div>
  `;
}

function renderSessionItem(item, index, pageIndex, extraClass = "", draggable = false) {
  const label = item.text || item.shortcut || `item ${index + 1}`;
  const numLabel = pageIndex < 9 ? String(pageIndex + 1) : pageIndex === 9 ? "0" : "";
  const inMoveMode = state.quickMoveMode === "terms";
  const isSelected = inMoveMode && state.quickMovePillIdx === index;
  const moveClass = inMoveMode ? (isSelected ? " qs-pill--move-selected" : " qs-pill--move-idle") : "";
  const moveAttr = inMoveMode ? ` data-move-select="${index}"` : "";
  const deleteAttr = state.quickTermsDeleteMode ? ` data-session-remove="${index}"` : "";
  // Note: draggable parameter accepted but no longer used — free-drag replaced by move mode.
  // Drag event listeners are bound once on contentNode and stay inert unless draggable attrs are emitted.
  return `
    <button class="qs-pill terms-pill${extraClass ? " " + extraClass : ""}${moveClass}" type="button"
      data-session-write="${index}" data-session-item="${index}"${deleteAttr}${moveAttr}
      title="${esc(label)}">
      ${numLabel ? `<span class="terms-pill-num">${numLabel}</span>` : ""}
      <span class="terms-pill-text">${esc(label)}</span>
      ${isSelected ? `
        <button class="qs-move-arrow" type="button" data-move-left="${index}" title="Move left">‹</button>
        <button class="qs-move-arrow" type="button" data-move-right="${index}" title="Move right">›</button>` : ""}
    </button>
  `;
}

function renderHelpPane() {
  const controls = [
    ["Edit", "Toggle inline editing. Opens the first category ready to edit. Unsaved changes show a red Save & Exit button."],
    ["Live", "Green when active. Clicked terms, connectors, phrases, and tool prints publish into Quick-Tag Compose. Turn it off as a failsafe to pause compose publishing while keeping Quick-Tag open."],
    ["Compose", "Compose is the default writing surface inside Quick-Tag. Typed words collect when you render them into pills. Click a real page field to arm Print for that field."],
    ["Listen", "This build collects typed known terms and undefined phrases when you render pending Compose text, rather than on every keystroke."],
    ["Next track", "Clears Ins, Vib, Quick session, and hotkey window offsets for the next track. Custom terms, templates, and undefined terms are all preserved."],
    ["quick", "Opens the Quick window. Compose is permanently shown at the top in this build, followed by Connect, Phrases, and Terms. The top-4 strip in each section header shows the first items in the current hotkey window for one-click access."],
    ["?", "Toggles definition mode. Hover any term to see its definition inline below the search bar."],
    ["Search", "Switches to search-first mode. 'all' gives flat results, 'cat' gives category-first. Shift toggles the category list."],
    ["Auto-hide", "Collapses the panel when the cursor leaves. Move to the rail edge to reopen."],
    ["Save & Exit", "Appears in red when you have unsaved edits. Confirms before exporting updated CSV and .plist."],
  ];

  const workflows = [
    ["Live mode", "Turn on Live to publish clicked terms, connectors, phrases, and tool prints into Quick-Tag Compose. Compose is the default surface; Print can target an explicitly armed page field."],
    ["Compose with pills", "Compose stays visible at the top of Quick-Tag. Each term or connector click adds a pill to the preview tray above the textarea. Click a pill to select it — subsequent insertions land after it. Drag pills to reorder. ← → buttons move the selected pill. Press , or . in the textarea to insert punctuation pills (period sets capitalise-next). Backspace at position 0 removes the last or selected pill."],
    ["Hotkey workflow", "Keep Quick open. Use Shift+1–0 (!@#$%^&*()) to fire session terms by position in the current window. Use Alt+1–0 to fire connect or phrases items (/ toggles which). Use = / − to scroll the window forward/back. The top-4 strip in each section header mirrors the first four items for click access without keyboard."],
    ["Modifiers", "Press : to arm plural, , to arm adverb (–ly), | to arm secondary variant. The strip pills turn orange when armed. The next hotkey or strip-click applies the modifier and disarms. If Compose is pinned with a pill selected, arming applies the modifier immediately to that pill."],
    ["Terms view modes", "The Terms section has three views — User (insertion order, paged), A–Z (alphabetical), Cat (grouped by section). In Cat mode, press the section letter (c/f/s/r/i/m) to expand/collapse a group, then 1–9/0 to fire an item from that group. 📌 pins a group open permanently."],
    ["Connectives", "Open with the Connect section or Tab in the composer. Click a pill to insert it. Click ✎ to edit the list. Listen-detected connectives appear highlighted. Use Alt+1–0 to fire from the hotkey window when Alt target is set to connect (default)."],
    ["Ins and Vib tags", "Click Ins or Vib in the header to open the tray. Click any term to add it; click a pill to toggle active/inactive. Print sends only active pills. Undo/redo with ↩ ↪. Float with ⊢, drag back near the panel to dock."],
    ["Listen mode", "Word mode: processes completed words (words followed by a space) as you type. Field mode: scans the full content of each field when you focus it — useful for fields you paste into. Both modes route matched terms to Ins/Vib/Quick/Connect. Unmatched words (5+ chars, not a known connective) are saved to Undefined Terms."],
    ["Templates", "In Quick, name the current term set and press Store. Load any saved template from the dropdown. Manage and delete templates in the Editor."],
    ["Undefined terms", "Collected by Listen when typed words don't match any term. Open the Editor to review them. Copy AI prompt generates a structured prompt for Claude or GPT to propose shortcut/term/section entries. Use Import terms (CSV) to bring accepted entries back in."],
    ["Edit and export", "Turn on Edit to alter rows inline or add via the editor form. Save & Exit exports CSV and .plist. The .plist is ready for macOS text replacements."],
    ["Move and resize", "Drag ✥ to move the panel. Drop near any edge to snap-dock. The size slider scales the interface. Floating windows (Ins, Vib, Quick) drag freely and dock back near the panel."],
  ];

  const hotkeys = [
    ["Q–P", "Jump to a section (main panel)"],
    ["1–9", "Expand a category (section armed) · Fire a cat-section item (Cat view) · Fire session item directly (Quick open, non-Cat)"],
    ["= / −", "Scroll hotkey window forward / backward by 4"],
    ["! @ # $ % ^ & * ( )", "Shift+1–0 — fire session terms 1–10 from current hotkey window"],
    ["Alt+1–0", "Fire connect or phrases items 1–10 from current window (Mac: ¡™£¢∞§¶•ªº)"],
    ["/", "Toggle Alt-key target between Connect and Phrases"],
    [":", "Arm plural modifier (press again to disarm)"],
    [",", "Arm adverb (–ly) modifier (press again to disarm)"],
    ["|", "Arm secondary-variant modifier (press again to disarm)"],
    ["c f s r i m", "Cat view: expand/collapse section group (Connect/Feel/Sound/foRm/Instruments/Mix)"],
    [", / .", "In pinned Compose textarea: insert comma or period pill (. also sets capitalise-next)"],
    ["Backspace", "In pinned Compose textarea at position 0: remove selected or last pill"],
    ["Tab", "Toggle connectives panel (in composer textarea)"],
    ["⌘+click", "Insert plural form"],
    ["⌥+click", "Insert y/ly variant"],
    ["⌘+Z / ⌘+⇧+Z", "Undo / redo tray changes"],
  ];

  const currentOrigin = (() => {
    try { return new URL(window.location.href).origin; } catch (_) { return window.location.origin || ""; }
  })();

  return `
    <aside class="help-pane help-pane-howto">
      <div class="help-header">
        <div class="eyebrow">Info</div>
        <div class="help-title">MYUI — How to use</div>
      </div>

      <section class="help-logic-block">
        <div class="help-logic-title">Site preferences</div>
        <div class="howto-menu-list">
          <div class="howto-menu-row" style="align-items:center">
            <div class="howto-menu-label">Stay active between window changes</div>
            <div class="howto-menu-copy">
              <button id="myui-stay-active-toggle" type="button"
                style="border-radius:5px;border:1px solid rgba(109,140,255,0.30);
                       background:${state.stayActive ? "rgba(109,140,255,0.22)" : "rgba(109,140,255,0.07)"};
                       color:inherit;padding:2px 10px;font:inherit;
                       font-size:calc(9px * var(--ui-scale));font-weight:800;cursor:pointer">
                ${state.stayActive ? "On" : "Off"}
              </button>
            </div>
          </div>
          <div class="howto-menu-row" style="align-items:center">
            <div class="howto-menu-label" style="word-break:break-all;font-size:calc(9px * var(--ui-scale));opacity:0.6">${esc(currentOrigin)}</div>
            <div class="howto-menu-copy">
              <button id="myui-remove-site" type="button"
                style="border-radius:5px;border:1px solid rgba(220,38,38,0.30);
                       background:rgba(220,38,38,0.07);color:inherit;padding:2px 10px;
                       font:inherit;font-size:calc(9px * var(--ui-scale));font-weight:800;cursor:pointer">
                Remove site
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="help-logic-block">
        <div class="help-logic-title">Controls</div>
        <div class="howto-menu-list">
          ${controls.map(([label, copy]) => `
            <div class="howto-menu-row">
              <div class="howto-menu-label">${esc(label)}</div>
              <div class="howto-menu-copy">${esc(copy)}</div>
            </div>`).join("")}
        </div>
      </section>

      <section class="help-logic-block">
        <div class="help-logic-title">Workflows</div>
        <div class="howto-workflow-list">
          ${workflows.map(([title, copy]) => `
            <article class="howto-card">
              <div class="howto-card-title">${esc(title)}</div>
              <p class="howto-card-copy">${esc(copy)}</p>
            </article>`).join("")}
        </div>
      </section>

      <section class="help-logic-block">
        <div class="help-logic-title">Keyboard shortcuts</div>
        <div class="howto-menu-list">
          ${hotkeys.map(([key, desc]) => `
            <div class="howto-menu-row">
              <div class="howto-menu-label"><code>${esc(key)}</code></div>
              <div class="howto-menu-copy">${esc(desc)}</div>
            </div>`).join("")}
        </div>
      </section>

      <section class="help-logic-block">
        <div class="help-logic-title">Shortcut rules</div>
        <ul class="help-logic-list">
          <li><strong>R1</strong> Strip vowels to a consonant skeleton wherever possible.</li>
          <li><strong>R3</strong> Keep <code>ch</code>, <code>sh</code>, <code>th</code>, and <code>wh</code> intact as digraphs.</li>
          <li><strong>R6–R7</strong> Preserve doubled consonants at compound joins; phrases drop articles and use <code>2</code> for "to" and <code>4</code> for "for".</li>
          <li><strong>R8</strong> Family endings append to the stem: <code>d</code>, <code>g</code>, <code>y</code>, <code>s</code>, <code>ly</code>.</li>
          <li><strong>R9</strong> Resolve conflicts by restoring the most distinctive vowel instead of inventing arbitrary letters.</li>
          <li><strong>R10</strong> Directional particles after verbs compress to their vowel: <code>out → o</code>, <code>up → u</code>, <code>in → i</code>.</li>
        </ul>
      </section>

      <section class="help-logic-block">
        <div class="help-logic-title">AI dataset prompt</div>
        <p class="howto-card-copy">Use this with GPT or Claude to convert a glossary or undefined-terms list into MYUI import format:</p>
        <div class="ai-prompt-block">You are preparing a MYUI import dataset. Read the uploaded files and output a structured dataset with fields: section, category, shortcut, term, definition, notes, connector_flag (true/false). Rules: separate connectors from non-connectors; preserve original wording; deduplicate near-duplicates; propose shortcuts only when missing and mark them as proposed; flag conflicts; do not silently merge conflicting meanings; output CSV-ready and JSON-ready form. If an undefined-terms list is included: group similar items, infer likely section/category, propose definitions, mark low-confidence suggestions clearly, produce only candidate entries and a review list.</div>
      </section>
    </aside>
  `;
}


function renderEditorView() {
    const activeCount = activeMasterRows().length;
    const hiddenCount = MASTER_ROWS.filter((row) => row.hidden && !row.deleted).length;
    const deletedCount = MASTER_ROWS.filter((row) => row.deleted).length;

    return `
      <div class="editor-shell">
        <div class="editor-global-bar">
          <div class="editor-global-stats">
            <span class="editor-stat">Active ${activeCount}</span>
            <span class="editor-stat">Hidden ${hiddenCount}</span>
            <span class="editor-stat">Deleted ${deletedCount}</span>
            ${state.editorMessage ? `<span class="editor-message">${esc(state.editorMessage)}</span>` : ""}
          </div>
          <div class="editor-global-actions">
            <button class="ghost-btn" id="bp-editor-save" type="button">Save</button>
            <button class="ghost-btn" id="bp-editor-export-csv" type="button">Export CSV</button>
            <button class="ghost-btn" id="bp-editor-export-plist" type="button">Export .plist</button>
            <button class="ghost-btn" id="bp-editor-reset" type="button">Restore defaults</button>
          </div>
        </div>

        ${renderEditorUndefinedSection()}
        ${renderEditorTermsSection()}
        ${renderEditorTemplates()}
      </div>
    `;
  }

  function renderEditorUndefinedSection() {
    const terms = state.undefinedTerms || [];
    const open = state.editorUndefinedOpen;
    return `
      <div class="editor-collapsible-section">
        <div class="editor-section-header" id="bp-editor-undefined-toggle">
          <span class="editor-section-label">Undefined terms</span>
          ${terms.length ? `<span class="editor-section-badge">${terms.length}</span>` : ""}
          <span class="editor-section-chevron">${open ? "▴" : "▾"}</span>
        </div>
        ${open ? `
          <div class="editor-section-body">
            ${terms.length ? `
              <div class="editor-subsection">
                <div class="editor-subsection-actions">
                  <button class="ghost-btn slim" id="bp-copy-ai-prompt" type="button">Copy AI prompt</button>
                  <button class="ghost-btn slim danger" id="bp-undefined-clear" type="button">Clear all</button>
                </div>
                <div class="undefined-list">${terms.map((t, i) => `
                  <span class="undefined-pill">${esc(undefinedTermText(t))}${undefinedTermShortcut(t) ? ` <code style="opacity:0.6;font-size:9px">${esc(undefinedTermShortcut(t))}</code>` : ""}<button class="undefined-remove" type="button" data-undefined-remove="${i}" aria-label="Remove">×</button></span>
                `).join("")}</div>
                <div class="editor-hint">These phrases were typed on the site but didn't match any terms. Copy AI prompt to generate candidate entries.</div>
              </div>
            ` : `<div class="editor-empty-state">No undefined terms collected yet. Turn on Listen and annotate to harvest new phrases.</div>`}
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderEditorTermsSection() {
    const open = state.editorTermsOpen;
    return `
      <div class="editor-collapsible-section">
        <div class="editor-section-header" id="bp-editor-terms-toggle">
          <span class="editor-section-label">Terms &amp; shortcuts</span>
          <span class="editor-section-chevron">${open ? "▴" : "▾"}</span>
        </div>
        ${open ? `<div class="editor-section-body">${renderEditorInputTermsBody()}${renderEditorTermsTable()}</div>` : ""}
      </div>
    `;
  }

  function renderEditorInputTermsBody() {
    const isOpen = state.inputTermsOpen;
    const status = state.inputTermsStatus || "";
    const isValid = status.startsWith("ok:");
    const isError = status.startsWith("error:");
    const statusText = status.replace(/^(ok|error):/, "");
    const parsed = state.inputTermsParsed || [];
    const knownSections = new Set(MASTER_ROWS.map(r => r.section_key).filter(Boolean));
    const unknownSections = parsed.length ? [...new Set(parsed.filter(r => r.section_key && !knownSections.has(r.section_key)).map(r => r.section_key))] : [];
    const newCategories = parsed.length ? [...new Set(parsed.filter(r => r.category).map(r => r.section_key + "::" + r.category).filter(combo => {
      const [sk, cat] = combo.split("::");
      return !MASTER_ROWS.some(row => row.section_key === sk && row.category === cat);
    }))] : [];

    return `
      <div class="editor-subsection">
        <div class="editor-subsection-title">
          <button class="ghost-btn slim" id="bp-input-terms-open" type="button">${isOpen ? "Hide import" : "Import terms (CSV)"}</button>
        </div>
        ${isOpen ? `
          <div class="input-terms-area">
            <textarea id="bp-input-terms-text" class="input-terms-textarea" placeholder="shortcut,term,section_key,category,notes&#10;e.g. ;drvg,Driving,feel,Energy / Drive,Optional note" rows="6">${esc(state.inputTermsText)}</textarea>
            ${renderImportStatusLine(isValid, isError, statusText)}
            ${renderImportWarnings(unknownSections)}
            ${renderNewCategoryWarnings(newCategories)}
            <div class="input-terms-actions">
              <button class="ghost-btn slim" id="bp-input-terms-clear" type="button">Clear</button>
              <button class="ghost-btn slim ${isValid ? "input-save-valid" : "input-save-invalid"}" id="bp-input-terms-save" type="button" ${!isValid ? "disabled" : ""}>Save &amp; Import (${parsed.length})</button>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderImportStatusLine(isValid, isError, statusText) {
    if (!statusText) return "";
    return `<div class="input-terms-status ${isValid ? "valid" : isError ? "invalid" : ""}">${esc(statusText)}</div>`;
  }

  function renderImportWarnings(unknownSections) {
    if (!unknownSections.length) return "";
    return `
      <div class="import-warnings">
        <span class="import-warn-label">Unknown sections (will be created):</span>
        ${unknownSections.map(s => `<span class="undefined-pill">${esc(s)}</span>`).join("")}
      </div>
    `;
  }

  function renderNewCategoryWarnings(newCategories) {
    if (!newCategories.length) return "";
    return `
      <div class="import-warnings">
        <span class="import-warn-label">New categories (will be created):</span>
        ${newCategories.map(c => { const [, cat] = c.split("::"); return `<span class="undefined-pill">${esc(cat)}</span>`; }).join("")}
      </div>
    `;
  }

  function renderEditorTermsTable() {
    const rows = editorVisibleRows();
    const sections = editorSections();
    const categories = editorCategories();
    const shortcutConflicts = duplicateShortcutConflicts();
    const termConflicts = duplicateTermConflicts();
    return `
      <div class="editor-subsection">
        <div class="editor-subsection-title">Quick add</div>
        <div class="editor-quick-copy">Choose where the term belongs first. Section and category details are filled automatically from that entry point.</div>
        <div class="editor-section-chips">
          ${sections.map((section) => `<button class="section-chip ${state.editorSection === section ? "active" : ""}" type="button" data-editor-section-chip="${esc(section)}">${esc(titleCase(section))}</button>`).join("")}
        </div>
        <div class="editor-category-chips">
          ${categories.length ? categories.map((category) => `<button class="subcat-row ${state.editorCategory === category ? "active" : ""}" type="button" data-editor-category-chip="${esc(category)}"><span>${esc(category)}</span><span class="subcat-count">${MASTER_ROWS.filter((row) => row.section_key === state.editorSection && row.category === category && !row.deleted).length}</span></button>`).join("") : `<div class="editor-empty-state">Choose a section to see categories.</div>`}
        </div>
        <div class="editor-entry-card ${state.editorSection && state.editorCategory ? "is-ready" : ""}">
          <div class="editor-entry-context">${state.editorSection && state.editorCategory ? `Adding to <strong>${esc(titleCase(state.editorSection))}</strong> · <strong>${esc(state.editorCategory)}</strong>` : `Choose a section and category before adding a shortcut.`}</div>
          <div class="editor-entry-grid">
            <input class="editor-cell" id="bp-editor-new-shortcut" type="text" placeholder="Shortcut" value="${esc(state.editorNewShortcut)}" />
            <input class="editor-cell" id="bp-editor-new-term" type="text" placeholder="Term" value="${esc(state.editorNewTerm)}" />
            <input class="editor-cell" id="bp-editor-new-notes" type="text" placeholder="Optional notes" value="${esc(state.editorNewNotes)}" />
            <button class="ghost-btn" id="bp-editor-add-context" type="button">Add to category</button>
            <button class="ghost-btn subtle" id="bp-editor-add" type="button">Add blank row</button>
          </div>
        </div>
      </div>

      <div class="editor-subsection">
        <div class="editor-filters">
          <label class="search-wrap editor-search"><input id="bp-editor-search" type="search" placeholder="Search shortcut, term, category, notes" value="${esc(state.editorQuery)}" /></label>
          <select id="bp-editor-section">
            <option value="">All sections</option>
            ${sections.map((section) => `<option value="${esc(section)}" ${state.editorSection === section ? "selected" : ""}>${esc(titleCase(section))}</option>`).join("")}
          </select>
          <select id="bp-editor-category">
            <option value="">All categories</option>
            ${categories.map((category) => `<option value="${esc(category)}" ${state.editorCategory === category ? "selected" : ""}>${esc(category)}</option>`).join("")}
          </select>
          <select id="bp-editor-status">
            <option value="all" ${state.editorStatus === "all" ? "selected" : ""}>All</option>
            <option value="active" ${state.editorStatus === "active" ? "selected" : ""}>Active</option>
            <option value="hidden" ${state.editorStatus === "hidden" ? "selected" : ""}>Hidden</option>
            <option value="deleted" ${state.editorStatus === "deleted" ? "selected" : ""}>Deleted</option>
          </select>
        </div>
        <div class="editor-hint">Quick add fills section/category details from the selected entry point. The full table below stays available for advanced edits. Save stores your changes in the extension. Export .plist downloads active visible shortcuts for macOS text replacements.</div>
        <div class="editor-table-wrap">
          <table class="editor-table">
            <thead>
              <tr>
                <th>Shortcut</th><th>Term</th><th>Section</th><th>Category</th>
                <th>Code</th><th>Base</th><th>Suffix</th><th>Order</th>
                <th>Hue</th><th>Sat</th><th>Notes</th><th>State</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => renderEditorRow(row, shortcutConflicts, termConflicts)).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderEditorTemplates() {
    const templates = state.quickTemplates || [];
    return `
      <div class="editor-section-block">
        <div class="editor-section-heading">Quick templates</div>
        <div class="editor-section-body">
          ${templates.length ? `
            <div class="template-list">
              ${templates.map((t, i) => `
                <div class="template-row">
                  <span class="template-name">${esc(t.name)}</span>
                  <span class="template-count">${t.items.length} items</span>
                  <button class="ghost-btn slim" type="button" data-template-load="${i}" title="Load into Quick">Load</button>
                  <button class="ghost-btn slim danger" type="button" data-template-delete="${i}" title="Delete template">×</button>
                </div>
              `).join("")}
            </div>` : `<div class="editor-empty-state">No saved templates. Use the Store button in the Quick window to save a set.</div>`}
        </div>
      </div>
    `;
  }

  function renderEditorUndefined() { return ""; }

  function renderEditorRow(row, shortcutConflicts, termConflicts) {
    const shortcutDup = row.shortcut && (shortcutConflicts.get(normalize(row.shortcut)) || 0) > 1;
    const termDup = row.term && (termConflicts.get(normalize(row.term)) || 0) > 1;
    const rowClass = [row.hidden ? "is-hidden" : "", row.deleted ? "is-deleted" : "", shortcutDup || termDup ? "has-warning" : ""].filter(Boolean).join(" ");
    return `
      <tr class="${rowClass}" data-editor-row="${esc(row.id)}">
        <td><input class="editor-cell ${shortcutDup ? "warn" : ""}" data-edit-row="${esc(row.id)}" data-edit-field="shortcut" value="${esc(row.shortcut)}" /></td>
        <td><input class="editor-cell ${termDup ? "warn" : ""}" data-edit-row="${esc(row.id)}" data-edit-field="term" value="${esc(row.term)}" /></td>
        <td><input class="editor-cell" data-edit-row="${esc(row.id)}" data-edit-field="section_key" value="${esc(row.section_key)}" /></td>
        <td><input class="editor-cell" data-edit-row="${esc(row.id)}" data-edit-field="category" value="${esc(row.category)}" /></td>
        <td><input class="editor-cell slim" data-edit-row="${esc(row.id)}" data-edit-field="code" value="${esc(row.code)}" /></td>
        <td><input class="editor-cell slim" data-edit-row="${esc(row.id)}" data-edit-field="base_shortcut" value="${esc(row.base_shortcut)}" /></td>
        <td><input class="editor-cell slim" data-edit-row="${esc(row.id)}" data-edit-field="suffix" value="${esc(row.suffix)}" /></td>
        <td><input class="editor-cell slim" data-edit-row="${esc(row.id)}" data-edit-field="order_code" value="${esc(row.order_code)}" /></td>
        <td><input class="editor-cell tiny" data-edit-row="${esc(row.id)}" data-edit-field="palette_h" value="${esc(row.palette_h)}" /></td>
        <td><input class="editor-cell tiny" data-edit-row="${esc(row.id)}" data-edit-field="palette_s" value="${esc(row.palette_s)}" /></td>
        <td><input class="editor-cell" data-edit-row="${esc(row.id)}" data-edit-field="notes" value="${esc(row.notes)}" /></td>
        <td>
          <div class="editor-row-actions">
            <button class="ghost-btn small ${row.hidden ? "active" : ""}" type="button" data-row-toggle-hidden="${esc(row.id)}">Hide</button>
            <button class="ghost-btn small ${row.deleted ? "active" : ""}" type="button" data-row-toggle-deleted="${esc(row.id)}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }

  function renderDockedTrays() {
    const secs = ["instruments", "vibes"].filter(sec => isToolTrayOpen(sec) && !(sec === "instruments" ? state.insFloat : state.vibFloat));
    if (!secs.length) return "";
    return `<div class="tool-tray-stack">${secs.map(sec => renderToolTray(sec)).join("")}</div>`;
  }

  function renderFloatingTrays() {
    const secs = ["instruments", "vibes"].filter(sec => isToolTrayOpen(sec) && (sec === "instruments" ? state.insFloat : state.vibFloat));
    if (!secs.length) return "";
    return secs.map(sec => renderToolTray(sec)).join("");
  }

  // Keep alias for any legacy callers
  function renderToolTrays() { return renderDockedTrays(); }

  function renderToolTray(secKey) {
    const list = getToolList(secKey);
    const label = secKey === "instruments" ? "Ins" : "Vib";
    const isFloating = secKey === "instruments" ? state.insFloat : state.vibFloat;
    const isMin = secKey === "instruments" ? state.insMinimized : state.vibMinimized;
    const floatX = secKey === "instruments" ? state.insX : state.vibX;
    const floatY = secKey === "instruments" ? state.insY : state.vibY;
    const activeCount = list.filter(i => i.active !== false).length;
    const hasPrintable = activeCount > 0;
    const floatStyle = isFloating ? `position:fixed;left:${floatX}px;top:${floatY}px;z-index:2147483646;` : "";
    const minLabel = isMin ? "▾" : "▴";
    const themeClass = state.themeMode === "dark" ? " dark-tray" : " light-tray";
    return `
      <aside class="tool-tray tool-tray-${esc(secKey)} ${state.themeMode} ${isToolTrayOpen(secKey) ? "open" : "collapsed"}${isFloating ? " tray-floating" : ""}${themeClass}" data-tray="${esc(secKey)}" style="${floatStyle}" id="bp-tray-${esc(secKey)}">
        <div class="tool-tray-head" id="bp-tray-drag-${esc(secKey)}">
          <span class="tool-tray-label">${esc(label)}</span>
          <div class="tool-tray-head-actions">
            ${!isMin && list.length ? `<button class="tray-ctrl-btn" type="button" data-tool-clear="${esc(secKey)}">Clear</button>` : ""}
            <button class="tray-ctrl-btn ${hasPrintable ? "tray-print-ready" : ""}" type="button" data-tool-print="${esc(secKey)}" title="Send active items to Quick-Tag Compose">⎙</button>
            ${!isMin ? `<button class="tray-ctrl-btn" type="button" data-tool-undo="${esc(secKey)}" title="Undo">↩</button>
            <button class="tray-ctrl-btn" type="button" data-tool-redo="${esc(secKey)}" title="Redo">↪</button>` : ""}
            ${isFloating
              ? `<button class="tray-ctrl-btn" id="bp-tray-dock-${esc(secKey)}" type="button" title="Dock back to panel">⊣</button>`
              : `<button class="tray-ctrl-btn" id="bp-tray-float-${esc(secKey)}" type="button" title="Float independently">⊢</button>`}
            <button class="tray-ctrl-btn" id="bp-tray-min-${esc(secKey)}" type="button" title="${isMin ? "Expand" : "Minimize"}">${minLabel}</button>
          </div>
        </div>
        ${isMin ? "" : `
          <div class="tray-pill-list">
            ${list.length ? list.map((item, index) => `
              <span class="tray-compact-pill ${item.active !== false ? "pill-active" : "pill-inactive"}" data-tool-chip="${index}" data-tool-chipsec="${esc(secKey)}" title="${esc(toolItemLabel(item))}">
                <span class="tray-pill-text">${esc(toolItemDisplay(item) || toolItemLabel(item))}</span>
                <button class="tray-pill-x" type="button" data-tool-remove="${index}" data-tool-removesec="${esc(secKey)}" aria-label="Remove">×</button>
              </span>
            `).join("") : `<div class="tray-empty-msg">No items yet.</div>`}
          </div>
          <div class="tool-tray-add-row">
            <input class="drawer-input" id="drawer-input-${esc(secKey)}" type="text" placeholder="Add custom…" data-tool-input="${esc(secKey)}" />
            <button class="drawer-add-btn" type="button" data-tool-add="${esc(secKey)}">+</button>
          </div>
        `}
      </aside>
    `;
  }

  function bindDelegatedEvents() {
    // Persistent delegated drag handlers bind once on contentNode.
    contentNode.addEventListener("dragstart", (event) => {
      const composerPill = event.target.closest("[data-pill-id]");
      if (composerPill) {
        state.composerDragId = Number(composerPill.dataset.pillId);
        event.dataTransfer.effectAllowed = "move";
        render();
        return;
      }
      const termPill = event.target.closest("[data-term-drag-idx]");
      if (!termPill) return;
      state.termDragIdx = Number(termPill.dataset.termDragIdx);
      event.dataTransfer.effectAllowed = "move";
    });

    contentNode.addEventListener("dragover", (event) => {
      const composerPill = event.target.closest("[data-pill-id]");
      if (composerPill && state.composerDragId !== null) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        return;
      }
      const termPill = event.target.closest("[data-term-drag-idx]");
      if (!termPill || state.termDragIdx === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const overIdx = Number(termPill.dataset.termDragIdx);
      if (overIdx !== state.termDragOverIdx) state.termDragOverIdx = overIdx;
    });

    contentNode.addEventListener("drop", (event) => {
      const composerPill = event.target.closest("[data-pill-id]");
      if (composerPill && state.composerDragId !== null) {
        event.preventDefault();
        const toId = Number(composerPill.dataset.pillId);
        const fromId = state.composerDragId;
        if (fromId === toId) { state.composerDragId = null; render(); return; }
        const pills = [...state.composerPills];
        const fromIdx = pills.findIndex(p => p.id === fromId);
        const toIdx = pills.findIndex(p => p.id === toId);
        if (fromIdx === -1 || toIdx === -1) { state.composerDragId = null; render(); return; }
        const [moved] = pills.splice(fromIdx, 1);
        pills.splice(toIdx, 0, moved);
        state.composerPills = pills;
        state.composerDragId = null;
        syncComposerText();
        return;
      }
      const termPill = event.target.closest("[data-term-drag-idx]");
      if (!termPill || state.termDragIdx === null) return;
      event.preventDefault();
      const fromIdx = state.termDragIdx;
      const toIdx = Number(termPill.dataset.termDragIdx);
      state.termDragIdx = null;
      state.termDragOverIdx = null;
      if (fromIdx === toIdx) { render(); return; }
      const items = [...state.sessionItems];
      if (fromIdx < 0 || fromIdx >= items.length || toIdx < 0 || toIdx >= items.length) { render(); return; }
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      state.sessionItems = items;
      savePrefs();
      render();
    });

    contentNode.addEventListener("dragend", (event) => {
      if (event.target.closest("[data-pill-id]") || state.composerDragId !== null) {
        state.composerDragId = null;
        render();
        return;
      }
      if (event.target.closest("[data-term-drag-idx]") || state.termDragIdx !== null) {
        state.termDragIdx = null;
        state.termDragOverIdx = null;
        render();
      }
    });

    contentNode.addEventListener("click", (event) => {
      const t = event.target;

      // ── Move mode: click-away exit ──
      if (state.quickMoveMode === "terms") {
        const inPillList = t.closest(".terms-pill-list, [data-move-select], [data-move-left], [data-move-right], [data-qs-move]");
        if (!inPillList) {
          state.quickMoveMode = null;
          state.quickMovePillIdx = null;
          render();
          // Do not return — allow the click to proceed normally
        }
      }

      const toolRemove = t.closest("[data-tool-remove]");
      if (toolRemove) {
        event.stopPropagation();
        const sec = toolRemove.dataset.toolRemovesec;
        const idx = Number(toolRemove.dataset.toolRemove);
        const list = getToolList(sec);
        if (!list[idx]) return;
        pushToolHistory();
        list.splice(idx, 1);
        state.selectedToolSec = sec;
        state.selectedToolIndex = -1;
        savePrefs();
        render();
        return;
      }

      // ── Quick-Tag section toggle / pin ──
      const qsToggle = t.closest("[data-qs-toggle]");
      if (qsToggle) {
        const key = qsToggle.dataset.qsToggle;
        const toggleGuard = t.closest("[data-qs-pin]") || t.closest("[data-qs-add]") || t.closest("[data-qs-delete]") || t.closest("[data-qs-hide]") || t.closest("[data-qs-move]") || t.closest("[data-qs-cycle-prev]") || t.closest("[data-qs-cycle-next]") || t.closest(".qs-input");
        if (!toggleGuard) {
          const pinKey = `quick${key.charAt(0).toUpperCase() + key.slice(1)}Pinned`;
          state[pinKey] = !state[pinKey];
          savePrefs(); render(); return;
        }
      }
      const qsPin = t.closest("[data-qs-pin]");
      if (qsPin) {
        const key = qsPin.dataset.qsPin;
        const pinKey = `quick${key.charAt(0).toUpperCase() + key.slice(1)}Pinned`;
        state[pinKey] = !state[pinKey];
        savePrefs(); render(); return;
      }

      const qsHide = t.closest("[data-qs-hide]");
      if (qsHide) {
        const key = qsHide.dataset.qsHide;
        const openKey = `quick${key.charAt(0).toUpperCase() + key.slice(1)}Pinned`;
        state[openKey] = false;
        render(); return;
      }

      // ── Hotkeys armed toggle ──
      if (t.closest("#bp-qs-arm-hotkeys")) {
        state.quickHotkeysArmed = !state.quickHotkeysArmed;
        render(); return;
      }

      // ── Cycle prev / next (< >) ──
      const cycleNext = t.closest("[data-qs-cycle-next]");
      if (cycleNext) {
        const key = cycleNext.dataset.qsCycleNext;
        const list = key === "terms" ? state.sessionItems
                   : key === "connect" ? [...getConnectives(), ...state.listenConnectives]
                   : (state.quickPhrases || []);
        const offsetKey = key === "terms" ? "quickTermsHotkeyOffset"
                        : key === "connect" ? "quickConnHotkeyOffset"
                        : "quickPhrasesHotkeyOffset";
        const maxOffset = Math.max(0, list.length - HOTKEY_WINDOW_SIZE);
        state[offsetKey] = Math.min(state[offsetKey] + HOTKEY_PAGE_STEP, maxOffset);
        render(); return;
      }
      const cyclePrev = t.closest("[data-qs-cycle-prev]");
      if (cyclePrev) {
        const key = cyclePrev.dataset.qsCyclePrev;
        const offsetKey = key === "terms" ? "quickTermsHotkeyOffset"
                        : key === "connect" ? "quickConnHotkeyOffset"
                        : "quickPhrasesHotkeyOffset";
        state[offsetKey] = Math.max(0, state[offsetKey] - HOTKEY_PAGE_STEP);
        render(); return;
      }

      // ── Move mode toggle button ──
      const qsMove = t.closest("[data-qs-move]");
      if (qsMove) {
        const key = qsMove.dataset.qsMove;
        if (state.quickMoveMode === key) {
          state.quickMoveMode = null;
          state.quickMovePillIdx = null;
        } else {
          state.quickMoveMode = key;
          state.quickMovePillIdx = null;
        }
        render(); return;
      }

      // ── Move mode: left/right arrows on selected pill ──
      const moveLeft = t.closest("[data-move-left]");
      if (moveLeft) {
        event.stopPropagation();
        const idx = Number(moveLeft.dataset.moveLeft);
        if (idx > 0) {
          const items = [...state.sessionItems];
          [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
          state.sessionItems = items;
          state.quickMovePillIdx = idx - 1;
          savePrefs();
        }
        render(); return;
      }
      const moveRight = t.closest("[data-move-right]");
      if (moveRight) {
        event.stopPropagation();
        const idx = Number(moveRight.dataset.moveRight);
        if (idx < state.sessionItems.length - 1) {
          const items = [...state.sessionItems];
          [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]];
          state.sessionItems = items;
          state.quickMovePillIdx = idx + 1;
          savePrefs();
        }
        render(); return;
      }

      // ── Move mode: pill selection ──
      const moveSelect = t.closest("[data-move-select]");
      if (moveSelect && state.quickMoveMode === "terms") {
        event.stopPropagation();
        const idx = Number(moveSelect.dataset.moveSelect);
        state.quickMovePillIdx = state.quickMovePillIdx === idx ? null : idx;
        render(); return;
      }

      // ── Quick-Tag add button ──
      const qsAdd = t.closest("[data-qs-add]");
      if (qsAdd) { addToQsSection(qsAdd.dataset.qsAdd); return; }

      // ── Quick-Tag delete button (3-state cycle) ──
      const qsDel = t.closest("[data-qs-delete]");
      if (qsDel) {
        const key = qsDel.dataset.qsDelete;
        const modeKey = key === "connect" ? "quickConnectDeleteMode" : key === "phrases" ? "quickPhrasesDeleteMode" : "quickTermsDeleteMode";
        const targetKey = key === "connect" ? "quickConnectDeleteTarget" : key === "phrases" ? "quickPhrasesDeleteTarget" : "quickTermsDeleteTarget";
        if (state[modeKey] && state[targetKey] !== null) {
          executeQsDelete(key);
        } else if (state[modeKey]) {
          state[modeKey] = false;
          state[targetKey] = null;
        } else {
          state[modeKey] = true;
          state[targetKey] = null;
          if (key !== "connect") state.quickConnectDeleteMode = false;
          if (key !== "phrases") state.quickPhrasesDeleteMode = false;
          if (key !== "terms")   state.quickTermsDeleteMode = false;
        }
        render(); return;
      }

      // ── Phrases: write to field or target for delete ──
      const phrasePillEl = t.closest("[data-phrase-write]");
      if (phrasePillEl) {
        const id = Number(phrasePillEl.dataset.phraseWrite);
        if (state.quickPhrasesDeleteMode) {
          if (state.quickPhrasesDeleteTarget === id) {
            executeQsDelete("phrases");
          } else {
            state.quickPhrasesDeleteTarget = id;
            render();
          }
          return;
        }
        const phrase = (state.quickPhrases || []).find(p => p.id === id);
        if (phrase && phrase.text) {
          routeInsert(phrase.text, "term");
          render();
        }
        return;
      }
      const phraseRemove = t.closest("[data-phrase-remove]");
      if (phraseRemove) {
        const idx = Number(phraseRemove.dataset.phraseRemove);
        state.quickPhrases = (state.quickPhrases || []).filter((_, i) => i !== idx);
        savePrefs(); render(); return;
      }

      // ── Terms delete mode: intercept session-remove to set target ──
      const sessionRemoveEl = t.closest("[data-session-remove]");
      if (sessionRemoveEl && state.quickTermsDeleteMode) {
        const idx = Number(sessionRemoveEl.dataset.sessionRemove);
        if (state.quickTermsDeleteTarget === idx) {
          executeQsDelete("terms");
        } else {
          state.quickTermsDeleteTarget = idx;
          render();
        }
        return;
      }

      const sessionRemove = t.closest("[data-session-remove]");
      if (sessionRemove) {
        event.stopPropagation();
        const index = Number(sessionRemove.dataset.sessionRemove);
        if (!state.sessionItems[index]) return;
        state.sessionItems.splice(index, 1);
        savePrefs();
        render();
        return;
      }

      const catToggle = t.closest("[data-cat-toggle]");
      if (catToggle && state.quickTermsViewMode === "cat") {
        if (t.closest("[data-cat-pin]")) return;
        const sec = catToggle.dataset.catToggle;
        state.quickTermsCatOpen = state.quickTermsCatOpen === sec ? "" : sec;
        render(); return;
      }
      const catPin = t.closest("[data-cat-pin]");
      if (catPin && state.quickTermsViewMode === "cat") {
        const sec = catPin.dataset.catPin;
        const pins = state.quickTermsCatPins || [];
        state.quickTermsCatPins = pins.includes(sec)
          ? pins.filter(p => p !== sec) : [...pins, sec];
        savePrefs(); render(); return;
      }

      const sessionWrite = t.closest("[data-session-write]");
      if (sessionWrite) {
        event.stopPropagation();
        // In move mode, pill click selects — handled above by data-move-select.
        // Guard here prevents double-fire; move-select handler already returned.
        if (state.quickMoveMode === "terms") return;
        writeSessionItem(Number(sessionWrite.dataset.sessionWrite), event);
        return;
      }

      const variantPill = t.closest(".variant-pill");
      if (variantPill) {
        event.stopPropagation();
        const key = variantPill.dataset.variantKey || "";
        const term = TERM_MAP.get(key);
        if (!term) return;
        handleTermActivation(term, key, variantPill.dataset.hasDef === "1", event);
        return;
      }

      const termCard = t.closest(".term-card");
      if (termCard) {
        const key = termCard.dataset.key || "";
        const term = TERM_MAP.get(key);
        if (!term) return;
        handleTermActivation(term, key, termCard.dataset.hasDef === "1", event);
        return;
      }

      const helpEntry = t.closest(".help-entry");
      if (helpEntry) {
        const key = helpEntry.dataset.helpKey || "";
        if (!key) return;
        if (state.pinnedKey === key) { state.pinnedKey = ""; state.previewKey = ""; }
        else { state.pinnedKey = key; state.previewKey = key; }
        updateHelpHighlight();
        return;
      }

      const toolChip = t.closest("[data-tool-chipsec][data-tool-chip]");
      if (toolChip) {
        if (t.closest("[data-tool-remove]")) return;
        const sec = toolChip.dataset.toolChipsec;
        const idx = Number(toolChip.dataset.toolChip);
        const list = getToolList(sec);
        if (!list[idx]) return;
        pushToolHistory();
        list[idx].active = list[idx].active === false ? true : false;
        state.selectedToolSec = sec;
        state.selectedToolIndex = idx;
        savePrefs();
        render();
        return;
      }

      const toolMode = t.closest("[data-tool-mode]");
      if (toolMode) {
        const sec = toolMode.dataset.toolMode;
        if (!sec) return;
        setToolTrayOpen(sec, true);
        setToolTrayExpanded(sec, !isToolTrayExpanded(sec));
        state.selectedToolSec = sec;
        state.selectedToolIndex = -1;
        savePrefs();
        render();
        return;
      }

      const toolClear = t.closest("[data-tool-clear]");
      if (toolClear) {
        const sec = toolClear.dataset.toolClear;
        const list = getToolList(sec);
        if (!list.length) return;
        pushToolHistory();
        if (sec === "instruments") state.instrumentsList = [];
        else if (sec === "vibes") state.vibeList = [];
        state.selectedToolSec = sec;
        state.selectedToolIndex = -1;
        savePrefs();
        render();
        return;
      }

      const toolUndo = t.closest("[data-tool-undo]");
      if (toolUndo) {
        if (undoToolHistory()) { savePrefs(); render(); }
        return;
      }

      const toolRedo = t.closest("[data-tool-redo]");
      if (toolRedo) {
        if (redoToolHistory()) { savePrefs(); render(); }
        return;
      }

      const toolPrint = t.closest("[data-tool-print]");
      if (toolPrint) {
        const items = printableToolTexts(toolPrint.dataset.toolPrint);
        if (items.length) {
          items.forEach((item) => routeInsert(item, "term"));
          savePrefs();
          render();
        }
        return;
      }

      const toolAdd = t.closest("[data-tool-add]");
      if (toolAdd) {
        const sec = toolAdd.dataset.toolAdd;
        const input = shadow.getElementById(`drawer-input-${sec}`);
        addCustomToTool(sec, input?.value.trim() || "");
        if (input) { input.value = ""; input.focus(); }
        return;
      }

      const toolBtn = t.closest("[data-tool]");
      if (toolBtn && !t.closest("[data-tool-mode],[data-tool-clear],[data-tool-remove],[data-tool-print],[data-tool-add],[data-tool-undo],[data-tool-redo]")) {
        event.stopPropagation();
        toggleToolTray(toolBtn.dataset.tool);
        state.visible = true;
        savePrefs();
        render();
        return;
      }

      const sectionBtn = t.closest("[data-section]");
      if (sectionBtn) {
        const key = sectionBtn.dataset.section || "";
        if (state.selectedSection === key) {
          state.selectedSection = "";
          state.expandedCats.clear();
          state.hotkeySectionKey = "";
        } else {
          state.selectedSection = key;
          state.expandedCats.clear();
          state.hotkeySectionKey = key;
        }
        state.hotkeyArmedAt = Date.now();
        state.previewKey = "";
        state.pinnedKey = "";
        render();
        return;
      }

      const accordion = t.closest("[data-accordion]");
      if (accordion) {
        const category = accordion.dataset.accordion || "";
        if (!category || state.query) return;
        if (state.expandedCats.has(category)) state.expandedCats.delete(category);
        else { if (state.focusMode) state.expandedCats.clear(); state.expandedCats.add(category); }
        render();
        return;
      }

      const orderBtn = t.closest("[data-order]");
      if (orderBtn) {
        const value = orderBtn.dataset.order;
        if (!["dataset", "alpha-term", "alpha-shortcut"].includes(value)) return;
        state.orderMode = value;
        savePrefs();
        render();
        return;
      }

      const colsBtn = t.closest("[data-cols]");
      if (colsBtn) {
        const cols = Number(colsBtn.dataset.cols);
        if (![1, 2, 3, 4].includes(cols)) return;
        state.layoutCols = cols;
        savePrefs();
        render();
        return;
      }

      const searchCat = t.closest("[data-search-cat]");
      if (searchCat) {
        const value = searchCat.dataset.searchCat || "";
        state.searchScope = "category";
        state.searchCatsVisible = true;
        state.searchCategoryFilter = state.searchCategoryFilter === value ? "" : value;
        savePrefs();
        render();
        return;
      }

      const inlineAdd = t.closest("[data-inline-add-sec][data-inline-add-cat]");
      if (inlineAdd) {
        addInlineCategoryRow(inlineAdd.dataset.inlineAddSec || "", inlineAdd.dataset.inlineAddCat || "");
        render();
        return;
      }

      const inlineToggleHidden = t.closest("[data-inline-toggle-hidden]");
      if (inlineToggleHidden) {
        const row = MASTER_ROWS.find((r) => r.id === inlineToggleHidden.dataset.inlineToggleHidden);
        if (!row) return;
        row.hidden = !row.hidden;
        if (row.hidden) row.deleted = false;
        state.masterDirty = true;
        state.editorMessage = row.hidden ? "Row hidden" : "Row restored";
        render();
        return;
      }

      const inlineToggleDeleted = t.closest("[data-inline-toggle-deleted]");
      if (inlineToggleDeleted) {
        const row = MASTER_ROWS.find((r) => r.id === inlineToggleDeleted.dataset.inlineToggleDeleted);
        if (!row) return;
        row.deleted = !row.deleted;
        if (row.deleted) row.hidden = false;
        state.masterDirty = true;
        state.editorMessage = row.deleted ? "Row marked deleted" : "Row restored";
        render();
        return;
      }

      const editorSectionChip = t.closest("[data-editor-section-chip]");
      if (editorSectionChip) {
        state.editorSection = editorSectionChip.dataset.editorSectionChip || "";
        if (state.editorCategory && !editorCategories().includes(state.editorCategory)) state.editorCategory = "";
        render();
        return;
      }

      const editorCategoryChip = t.closest("[data-editor-category-chip]");
      if (editorCategoryChip) {
        state.editorCategory = editorCategoryChip.dataset.editorCategoryChip || "";
        render();
        return;
      }

      const rowToggleHidden = t.closest("[data-row-toggle-hidden]");
      if (rowToggleHidden) {
        const row = MASTER_ROWS.find((r) => r.id === rowToggleHidden.dataset.rowToggleHidden);
        if (!row) return;
        row.hidden = !row.hidden;
        if (row.hidden) row.deleted = false;
        state.editorMessage = row.hidden ? "Row hidden" : "Row restored";
        render();
        return;
      }

      const rowToggleDeleted = t.closest("[data-row-toggle-deleted]");
      if (rowToggleDeleted) {
        const row = MASTER_ROWS.find((r) => r.id === rowToggleDeleted.dataset.rowToggleDeleted);
        if (!row) return;
        row.deleted = !row.deleted;
        if (row.deleted) row.hidden = false;
        state.editorMessage = row.deleted ? "Row marked deleted" : "Row restored";
        render();
        return;
      }

      // ── Feature 4: top-strip pill click ──
      const stripPill = t.closest("[data-strip-key][data-strip-idx]");
      if (stripPill) {
        const key = stripPill.dataset.stripKey;
        const idx = Number(stripPill.dataset.stripIdx);
        let list = [];
        if (key === "terms") list = state.sessionItems;
        else if (key === "connect") list = [...getConnectives(), ...state.listenConnectives];
        else if (key === "phrases") list = state.quickPhrases || [];
        const item = list[idx];
        if (!item) return;
        const rawText = typeof item === "string" ? item : (item.text || item.p || "");
        const modifier = state.quickModifierArmed ? state.quickModifier : null;
        const text = modifier ? applyModifierToText(rawText, modifier) : rawText;
        state.quickModifier = null;
        state.quickModifierArmed = false;
        const stripType = key === "connect" ? "connector" : "term";
        routeInsert(text, stripType);
        render();
        return;
      }

      // ── Feature 4: top-strip cycle button ──
      const stripCycle = t.closest("[data-strip-cycle]");
      if (stripCycle) {
        const key = stripCycle.dataset.stripCycle;
        if (key === "terms") {
          const max = Math.max(0, state.sessionItems.length - HOTKEY_WINDOW_SIZE);
          state.quickTermsHotkeyOffset = state.quickTermsHotkeyOffset >= max ? 0 : Math.min(max, state.quickTermsHotkeyOffset + HOTKEY_PAGE_STEP);
        } else if (key === "connect") {
          const list = [...getConnectives(), ...state.listenConnectives];
          const max = Math.max(0, list.length - HOTKEY_WINDOW_SIZE);
          state.quickConnHotkeyOffset = state.quickConnHotkeyOffset >= max ? 0 : Math.min(max, state.quickConnHotkeyOffset + HOTKEY_PAGE_STEP);
        } else if (key === "phrases") {
          const max = Math.max(0, (state.quickPhrases || []).length - HOTKEY_WINDOW_SIZE);
          state.quickPhrasesHotkeyOffset = state.quickPhrasesHotkeyOffset >= max ? 0 : Math.min(max, state.quickPhrasesHotkeyOffset + HOTKEY_PAGE_STEP);
        }
        render(); return;
      }

      // ── Feature 5: preview pill select ──
      const pillSelect = t.closest("[data-pill-select]");
      if (pillSelect && !t.closest("[data-pill-up],[data-pill-down]")) {
        const pillId = Number(pillSelect.dataset.pillSelect);
        state.composerSelectedPillId = state.composerSelectedPillId === pillId ? null : pillId;
        syncComposerText({ toEnd: false }); return;
      }

      // ── Feature 5: pill move up (←) ──
      const pillUp = t.closest("[data-pill-up]");
      if (pillUp) {
        const pillId = Number(pillUp.dataset.pillUp);
        const idx = state.composerPills.findIndex(p => p.id === pillId);
        if (idx > 0) {
          const pills = [...state.composerPills];
          [pills[idx - 1], pills[idx]] = [pills[idx], pills[idx - 1]];
          state.composerPills = pills;
          syncComposerText({ toEnd: false });
        }
        return;
      }

      // ── Feature 5: pill move down (→) ──
      const pillDown = t.closest("[data-pill-down]");
      if (pillDown) {
        const pillId = Number(pillDown.dataset.pillDown);
        const idx = state.composerPills.findIndex(p => p.id === pillId);
        if (idx !== -1 && idx < state.composerPills.length - 1) {
          const pills = [...state.composerPills];
          [pills[idx], pills[idx + 1]] = [pills[idx + 1], pills[idx]];
          state.composerPills = pills;
          syncComposerText({ toEnd: false });
        }
        return;
      }
    });

    contentNode.addEventListener("mouseover", (event) => {
      const t = event.target;

      const toolTag = t.closest("[data-tool-tag]");
      if (toolTag && !toolTag.contains(event.relatedTarget)) {
        if (!state.helpHover) return;
        const item = getToolList(toolTag.dataset.toolChipsec)[Number(toolTag.dataset.toolChip)];
        const label = toolItemLabel(item); const display = toolItemDisplay(item);
        state.hoverTooltipTitle = label && label !== display ? label : (label || "");
        state.hoverTooltipBody = ""; syncHoverTooltip();
        return;
      }

      const toolChip = t.closest("[data-tool-chipsec][data-tool-chip]");
      if (toolChip && !toolChip.contains(event.relatedTarget)) {
        if (!state.helpHover) return;
        const item = getToolList(toolChip.dataset.toolChipsec)[Number(toolChip.dataset.toolChip)];
        if (!item) return;
        const label = toolItemLabel(item); const display = toolItemDisplay(item);
        state.hoverTooltipTitle = label && label !== display ? label : (label || display || "");
        state.hoverTooltipBody = ""; syncHoverTooltip();
        return;
      }

      const termCard = t.closest(".term-card");
      if (termCard && !termCard.contains(event.relatedTarget)) {
        if (!state.helpHover || state.pinnedKey || termCard.dataset.hasDef !== "1") return;
        state.hoverTooltipTitle = ""; state.hoverTooltipBody = "";
        state.previewKey = termCard.dataset.key || "";
        updateHelpHighlight(); syncHoverTooltip();
        return;
      }

      const pill = t.closest(".variant-pill");
      if (pill && !pill.contains(event.relatedTarget)) {
        if (!state.helpHover || state.pinnedKey || pill.dataset.hasDef !== "1") return;
        state.hoverTooltipTitle = ""; state.hoverTooltipBody = "";
        state.previewKey = pill.dataset.variantKey || "";
        updateHelpHighlight(); syncHoverTooltip();
        return;
      }

      const helpEntry = t.closest(".help-entry");
      if (helpEntry && !helpEntry.contains(event.relatedTarget)) {
        if (state.pinnedKey) return;
        state.hoverTooltipTitle = ""; state.hoverTooltipBody = "";
        state.previewKey = helpEntry.dataset.helpKey || "";
        updateHelpHighlight(); syncHoverTooltip();
        return;
      }

      const sessionItem = t.closest("[data-session-item]");
      if (sessionItem && !sessionItem.contains(event.relatedTarget)) {
        if (!state.helpHover) return;
        const index = Number(sessionItem.dataset.sessionItem);
        const item = state.sessionItems[index];
        const term = sessionTermAt(index);
        const helpText = term ? getHelpText(term) : "";
        if (!helpText) return;
        state.hoverTooltipTitle = `${item?.text || term.p} · ${item?.shortcut || term.s}`;
        state.hoverTooltipBody = helpText; syncHoverTooltip();
        return;
      }
    });

    contentNode.addEventListener("mouseout", (event) => {
      const t = event.target;

      const clearTooltip = () => { state.hoverTooltipTitle = ""; state.hoverTooltipBody = ""; syncHoverTooltip(); };
      const clearPreview = (key) => { if (state.previewKey === key) { state.previewKey = ""; updateHelpHighlight(); syncHoverTooltip(); } };

      if (t.closest("[data-tool-tag]")?.contains && !t.closest("[data-tool-tag]").contains(event.relatedTarget)) { clearTooltip(); return; }
      if (t.closest("[data-tool-chipsec][data-tool-chip]")?.contains && !t.closest("[data-tool-chipsec][data-tool-chip]").contains(event.relatedTarget)) { clearTooltip(); return; }

      const termCard = t.closest(".term-card");
      if (termCard && !termCard.contains(event.relatedTarget)) {
        if (state.helpHover && !state.pinnedKey) clearPreview(termCard.dataset.key || "");
        return;
      }

      const pill = t.closest(".variant-pill");
      if (pill && !pill.contains(event.relatedTarget)) {
        if (state.helpHover && !state.pinnedKey) clearPreview(pill.dataset.variantKey || "");
        return;
      }

      const helpEntry = t.closest(".help-entry");
      if (helpEntry && !helpEntry.contains(event.relatedTarget)) {
        if (!state.pinnedKey) clearPreview(helpEntry.dataset.helpKey || "");
        return;
      }

      if (t.closest("[data-session-item]")?.contains && !t.closest("[data-session-item]").contains(event.relatedTarget)) { clearTooltip(); return; }
    });

    contentNode.addEventListener("keydown", (event) => {
      const t = event.target;

      // Enter on connector add input confirms add
      if (t.id === "bp-conn-add-input" && event.key === "Enter") {
        event.preventDefault();
        const word = (state.connAddInput || "").trim().toLowerCase();
        if (word) {
          const current = getConnectives();
          if (!current.some(w => normalize(w) === normalize(word))) {
            state.connectivesCustom = [...current, word];
          }
        }
        state.connAddOpen = false;
        state.connAddInput = "";
        savePrefs(); render(); return;
      }

      // Escape on connector add input cancels
      if (t.id === "bp-conn-add-input" && event.key === "Escape") {
        state.connAddOpen = false;
        state.connAddInput = "";
        render(); return;
      }

      // Tab in composer toggles connectives panel
      if (t.id === "bp-composer-text" && event.key === "Tab") {
        event.preventDefault();
        state.connEditOpen = !state.connEditOpen;
        render();
        setTimeout(() => { shadow.getElementById("bp-composer-text")?.focus(); }, 20);
        return;
      }

      // ── Composer textarea keydown shortcuts (Compose pinned) ──
      if (t.id === "bp-composer-text" && state.quickComposePinned) {
        const focusSnapshot = composerInputSnapshot() || { focused: true, startFromEnd: 0, endFromEnd: 0 };

        // Backspace: only deletes an explicitly selected pill; otherwise normal textarea behavior
        if (event.key === "Backspace" && state.composerPills.length > 0 && state.composerSelectedPillId !== null) {
          event.preventDefault();
          state.composerPills = state.composerPills.filter(p => p.id !== state.composerSelectedPillId);
          state.composerSelectedPillId = state.composerPills.length > 0
            ? state.composerPills[state.composerPills.length - 1].id : null;
          syncComposerText({ focusSnapshot }); return;
        }

        // ArrowLeft / ArrowRight: move selected pill when one is selected
        if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && state.composerSelectedPillId !== null) {
          const idx = state.composerPills.findIndex(p => p.id === state.composerSelectedPillId);
          if (idx !== -1) {
            event.preventDefault();
            const pills = [...state.composerPills];
            if (event.key === "ArrowLeft" && idx > 0) {
              [pills[idx - 1], pills[idx]] = [pills[idx], pills[idx - 1]];
              state.composerPills = pills;
              syncComposerText({ focusSnapshot }); return;
            }
            if (event.key === "ArrowRight" && idx < pills.length - 1) {
              [pills[idx + 1], pills[idx]] = [pills[idx], pills[idx + 1]];
              state.composerPills = pills;
              syncComposerText({ focusSnapshot }); return;
            }
            restoreComposerInput(focusSnapshot, { toEnd: false });
            return;
          }
        }

        // Enter: commit pending textarea text into parsed pills
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          flushComposerPendingText({ collectDerived: true });
          syncComposerText({ focusSnapshot });
          return;
        }

        // Comma pill
        if (event.key === ",") {
          event.preventDefault();
          flushComposerPendingText({ collectDerived: true });
          state.composerPillCounter = (state.composerPillCounter || 0) + 1;
          const pill = { id: state.composerPillCounter, type: "text", text: "," };
          if (state.composerSelectedPillId !== null) {
            const idx = state.composerPills.findIndex(p => p.id === state.composerSelectedPillId);
            if (idx !== -1) {
              state.composerPills = [...state.composerPills.slice(0, idx + 1), pill, ...state.composerPills.slice(idx + 1)];
              state.composerSelectedPillId = pill.id;
            } else {
              state.composerPills = [...state.composerPills, pill];
              state.composerSelectedPillId = pill.id;
            }
          } else {
            state.composerPills = [...state.composerPills, pill];
            state.composerSelectedPillId = pill.id;
          }
          syncComposerText({ focusSnapshot }); return;
        }

        // Period pill (also sets capitalise-next)
        if (event.key === ".") {
          event.preventDefault();
          flushComposerPendingText({ collectDerived: true });
          state.composerPillCounter = (state.composerPillCounter || 0) + 1;
          const pill = { id: state.composerPillCounter, type: "text", text: "." };
          if (state.composerSelectedPillId !== null) {
            const idx = state.composerPills.findIndex(p => p.id === state.composerSelectedPillId);
            if (idx !== -1) {
              state.composerPills = [...state.composerPills.slice(0, idx + 1), pill, ...state.composerPills.slice(idx + 1)];
              state.composerSelectedPillId = pill.id;
            } else {
              state.composerPills = [...state.composerPills, pill];
              state.composerSelectedPillId = pill.id;
            }
          } else {
            state.composerPills = [...state.composerPills, pill];
            state.composerSelectedPillId = pill.id;
          }
          state.composerNextCapitalise = true;
          syncComposerText({ focusSnapshot }); return;
        }
      }

      const toolInput = t.closest("[data-tool-input]");
      if (toolInput) {
        if (event.key === "Enter" || event.key === "+") {
          if (event.key === "+") event.preventDefault();
          addCustomToTool(toolInput.dataset.toolInput, t.value.trim());
          t.value = "";
        }
        return;
      }

      if (t.id === "bp-search" && event.key === "Enter") {
        event.preventDefault();
        syncLiveSearch(t.value);
        return;
      }

      if (["bp-editor-new-shortcut", "bp-editor-new-term", "bp-editor-new-notes"].includes(t.id) && event.key === "Enter") {
        event.preventDefault();
        if (createEditorRowFromContext()) render();
        return;
      }
      if (t.id === "bp-temp-term-input" && event.key === "Enter") {
        event.preventDefault();
        const text = state.tempTermsInput.trim();
        if (!text) return;
        state.tempTermsPendingText = text;
        state.tempTermsInput = "";
        state.tempTermsShortcutInput = "";
        state.tempTermsAwaitingShortcut = true;
        render();
        setTimeout(() => shadow.getElementById("bp-temp-shortcut-input")?.focus(), 30);
        return;
      }
      if (t.id === "bp-temp-shortcut-input" && (event.key === "Enter" || event.key === "Escape")) {
        event.preventDefault();
        confirmTempTermAdd(); return;
      }
      if (t.id === "bp-temp-edit-text" && event.key === "Enter") {
        event.preventDefault();
        const idx = state.tempTermsEditTarget;
        if (idx !== null) confirmTempTermEdit(idx);
        return;
      }
      if (t.id === "bp-qs-input-connect" && event.key === "Enter") {
        event.preventDefault(); addToQsSection("connect"); return;
      }
      if (t.id === "bp-qs-input-phrases" && event.key === "Enter") {
        event.preventDefault(); addToQsSection("phrases"); return;
      }
      if (t.id === "bp-qs-input-terms" && event.key === "Enter") {
        event.preventDefault(); addToQsSection("terms"); return;
      }
    });

    contentNode.addEventListener("change", (event) => {
      const t = event.target;
      if (t.id === "bp-template-select") {
        const idx = Number(t.value);
        if (!isNaN(idx) && state.quickTemplates[idx]) {
          state.sessionItems = state.quickTemplates[idx].items.map(i => ({ ...i }));
          state.sessionPage = 0;
          state.sessionOpen = true;
          state.editorMessage = `Loaded "${state.quickTemplates[idx].name}"`;
          savePrefs(); render();
        }
        return;
      }
      if (t.id === "bp-size-slider") {
        state.uiScale = clamp(Number(t.value) / 100, 0.85, 1.5);
        savePrefs();
        render();
        return;
      }
      if (t.id === "bp-editor-section") {
        state.editorSection = t.value;
        if (state.editorCategory && !editorCategories().includes(state.editorCategory)) state.editorCategory = "";
        render();
        return;
      }
      if (t.id === "bp-editor-category") { state.editorCategory = t.value; render(); return; }
      if (t.id === "bp-editor-status") { state.editorStatus = t.value; render(); return; }
    });

    contentNode.addEventListener("focusin", (event) => {
      if (event.target.id === "bp-composer-text") {
        state.composerFocused = true;
        return;
      }
      if (state.composerFocused && !event.target.closest(".composer-bar") && !event.target.closest(".qs-compose-shell")) {
        state.composerFocused = false;
      }
    });

    contentNode.addEventListener("focusout", (event) => {
      if (event.target.id === "bp-composer-text") {
        const related = event.relatedTarget;
        const staysInComposer = related && (
          related.id === "bp-composer-text" ||
          related.closest?.(".composer-bar") ||
          related.closest?.(".qs-compose-shell")
        );
        if (!staysInComposer) state.composerFocused = false;
      }
    });

    contentNode.addEventListener("mousedown", (event) => {
      if (event.target?.id === "bp-composer-text") {
        state.composerFocused = true;
      }
    });

    contentNode.addEventListener("input", (event) => {
      const t = event.target;

      if (t.id === "bp-search") { syncLiveSearch(t.value); return; }
      if (t.id === "bp-composer-text") {
        if (state.quickComposePinned) {
          state.composerText = getComposerPendingTextFromValue(t.value);
        } else {
          state.composerText = t.value;
        }
        clearTimeout(_savePrefsTimer);
        _savePrefsTimer = setTimeout(savePrefs, 400);
        return;
      }
      if (t.id === "bp-template-name") { state.quickTemplateNameInput = t.value; return; }
      if (t.id === "bp-conn-add-input") { state.connAddInput = t.value; return; }

      if (t.id === "bp-size-slider") {
        state.uiScale = clamp(Number(t.value) / 100, 0.85, 1.5);
        contentNode.querySelector(".shell")?.style.setProperty("--ui-scale", String(state.uiScale));
        return;
      }

      if (t.id === "bp-input-terms-text") { validateAndSetInputTerms(t.value); render(); return; }
      if (t.id === "bp-temp-term-input") { state.tempTermsInput = t.value; render(); return; }
      if (t.id === "bp-temp-shortcut-input") { state.tempTermsShortcutInput = t.value; return; }
      if (t.id === "bp-temp-edit-text") { state.tempTermsEditText = t.value; return; }
      if (t.id === "bp-temp-edit-shortcut") { state.tempTermsEditShortcut = t.value; return; }
      if (t.id === "bp-qs-input-connect") { state.quickConnectInput = t.value; return; }
      if (t.id === "bp-qs-input-phrases") { state.quickPhrasesInput = t.value; return; }
      if (t.id === "bp-qs-input-terms")   { state.quickTermsInput = t.value; return; }
      if (t.id === "bp-editor-search") { state.editorQuery = t.value; render(); return; }
      if (t.id === "bp-editor-new-shortcut") { state.editorNewShortcut = t.value; return; }
      if (t.id === "bp-editor-new-term") { state.editorNewTerm = t.value; return; }
      if (t.id === "bp-editor-new-notes") { state.editorNewNotes = t.value; return; }

      const inlineField = t.closest("[data-inline-row][data-inline-field]");
      if (inlineField) {
        const row = MASTER_ROWS.find((r) => r.id === inlineField.dataset.inlineRow);
        if (!row) return;
        const field = inlineField.dataset.inlineField;
        row[field] = t.value;
        if (field === "section_key") row.section_label = titleCase(t.value);
        state.masterDirty = true;
        state.editorMessage = "Unsaved changes";
        return;
      }

      const editField = t.closest("[data-edit-row][data-edit-field]");
      if (editField) {
        const row = MASTER_ROWS.find((r) => r.id === editField.dataset.editRow);
        if (!row) return;
        const field = editField.dataset.editField;
        row[field] = t.value;
        if (field === "section_key") {
          row.section_label = titleCase(t.value);
          if (!row.flow_bucket || normalize(row.flow_bucket) === normalize(titleCase(row.section_label || ""))) {
            row.flow_bucket = titleCase(t.value);
          }
        }
        state.editorMessage = "Unsaved changes";
        return;
      }
    });

    contentNode.addEventListener("click", (event) => {
      const t = event.target;
      const id = t.closest("button,a,[role=button]")?.id || t.id || "";

      if (id === "bp-rail-toggle") {
        event.stopPropagation();
        if (Date.now() < dockDragUntil) return;
        if (!state.visible) { state.visible = true; render(); }
        return;
      }
      if (id === "bp-close") { clearSessionWorkingState({ closeSessionUi: true, closeComposerUi: true, closeToolTrays: true }); state.appActive = false; state.visible = false; savePrefs(); render(); return; }
      if (id === "bp-theme") { state.themeMode = state.themeMode === "dark" ? "light" : "dark"; savePrefs(); render(); return; }
      if (id === "bp-help-hover") {
        state.helpHover = !state.helpHover;
        if (!state.helpHover && !state.helpOpen) state.previewKey = "";
        savePrefs(); render(); return;
      }
      if (id === "bp-help") {
        state.helpOpen = !state.helpOpen;
        if (!state.helpOpen) { state.pinnedKey = ""; if (!state.helpHover) state.previewKey = ""; }
        savePrefs(); render(); return;
      }
      if (id === "myui-stay-active-toggle") {
        state.stayActive = !state.stayActive;
        savePrefs(); render(); return;
      }
      if (id === "myui-dev-reset") { devReset(); return; }
      if (id === "myui-remove-site") {
        if (!window.confirm("Remove this site from the MYUI whitelist?")) return;
        const origin = (() => {
          try { return new URL(window.location.href).origin; } catch (_) { return window.location.origin || ""; }
        })();
        if (origin && chrome?.storage?.local) {
          chrome.storage.local.get("myuiWhitelist", (result) => {
            const list = Array.isArray(result.myuiWhitelist) ? result.myuiWhitelist : [];
            chrome.storage.local.set({ myuiWhitelist: list.filter((o) => o !== origin) });
          });
        }
        state.visible = false;
        render();
        return;
      }
      if (id === "bp-autohide") {
        state.autoHide = !state.autoHide;
        state.visible = !state.autoHide;
        savePrefs(); render(); return;
      }
      if (id === "bp-focus") {
        state.focusMode = !state.focusMode;
        if (state.focusMode && state.expandedCats.size > 1) {
          const first = state.expandedCats.values().next().value;
          state.expandedCats = new Set(first ? [first] : []);
        }
        savePrefs(); render(); return;
      }
      if (id === "bp-order-cycle") {
        const modes = ["dataset", "alpha-term", "alpha-shortcut"];
        const idx = modes.indexOf(state.orderMode);
        state.orderMode = modes[(idx + 1) % modes.length];
        savePrefs(); render(); return;
      }
      if (id === "bp-view-cycle") {
        state.searchOnlyMode = !state.searchOnlyMode;
        if (state.searchOnlyMode) {
          state.navCollapsed = true;
          state.sidebarMode = null;
        }
        savePrefs(); render(); return;
      }
      if (id === "bp-layout-toggle") {
        state.layoutCols = state.layoutCols === 1 ? 2 : 1;
        savePrefs(); render(); return;
      }
      if (id === "bp-toggle-nav") {
        if (state.searchOnlyMode || (state.searchScope === "category" && !!state.query)) {
          state.searchCatsVisible = !state.searchCatsVisible;
        } else {
          state.navCollapsed = !state.navCollapsed;
        }
        savePrefs(); render(); return;
      }
      if (id === "bp-search-cats-toggle") { state.searchCatsVisible = !state.searchCatsVisible; savePrefs(); render(); return; }
      if (id === "bp-clear-pin") { if (!state.helpHover) state.previewKey = ""; state.pinnedKey = ""; render(); return; }
      if (id === "bp-edit-mode") {
        state.editMode = !state.editMode;
        state.editorOpen = state.editMode;
        if (state.editMode) {
          // Always land on a real section — never __all__
          const secKey = (state.selectedSection && state.selectedSection !== "__all__")
            ? state.selectedSection
            : (topSections()[0]?.key || "");
          if (secKey) {
            state.selectedSection = secKey;
            state.hotkeySectionKey = secKey;
            const cats = categorySummaries(secKey);
            if (cats.length) state.expandedCats.add(cats[0].display);
          }
          state.searchOnlyMode = false; // ensure category view is visible
        } else {
          state.editorMessage = state.masterDirty ? "Unsaved changes" : "";
        }
        render(); return;
      }
      if (id === "bp-write-mode" || id === "bp-write-mode-search") {
        state.writeMode = !state.writeMode;
        if (state.writeMode) { state.fullSentenceMode = false; }
        savePrefs(); render(); return;
      }
      if (id === "bp-next-track") {
        state.confirmNextTrack = true;
        render(); return;
      }
      if (id === "bp-next-cancel") {
        state.confirmNextTrack = false;
        render(); return;
      }
      if (id === "bp-next-confirm") {
        state.confirmNextTrack = false;
        pushToolHistory();
        clearSessionWorkingState({ closeSessionUi: false, closeComposerUi: false, closeToolTrays: true });
        state.editorMessage = "Next track — session working state cleared";
        savePrefs(); render(); return;
      }
      if (id === "bp-full-sentence") {
        state.fullSentenceMode = false;
        state.composerOpen = false;
        state.composerFocused = false;
        state.editorMessage = "Full sentence mode is not active in this compose-local branch";
        savePrefs(); render(); return;
      }
      if (id === "bp-composer-print") {
        flushComposerPendingText({ collectDerived: true });
        const text = getComposerResolvedText().trim();
        if (!text) return;
        if (!currentWriteField()) {
          state.editorMessage = "Select a page field first";
          render(); return;
        }
        const composeSnapshot = composerInputSnapshot();
        insertIntoField(smartInsertTermText(text), false);
        state.editorMessage = "Printed to selected field";
        setTimeout(() => focusComposerAfterArming(composeSnapshot, { keepSelection: true }), 0);
        render(); return;
      }
      if (id === "bp-composer-clear") {
        state.composerText = "";
        state.composerPills = [];
        state.composerSelectedPillId = null;
        state.composerDragId = null;
        state.composerNextCapitalise = false;
        render(); return;
      }
      if (id === "bp-composer-save-chip") {
        flushComposerPendingText({ collectDerived: true });
        const text = getComposerResolvedText().trim();
        if (!text) return;
        state.composerChipCounter = (state.composerChipCounter || 0) + 1;
        state.composerChips = [...(state.composerChips || []),
          { id: state.composerChipCounter, text, active: false }];
        render(); return;
      }
      const chipDel = t.closest("[data-chip-del]");
      if (chipDel) {
        event.stopPropagation();
        const chipId = Number(chipDel.dataset.chipDel);
        state.composerChips = (state.composerChips || []).filter(c => c.id !== chipId);
        render(); return;
      }

      const chipEl = t.closest("[data-chip-id]");
      if (chipEl) {
        const chipId = Number(chipEl.dataset.chipId);
        const chip = (state.composerChips || []).find(c => c.id === chipId);
        if (chip) {
          state.composerText = chip.text;
          state.composerPills = [];
          state.composerSelectedPillId = null;
          state.composerChips = state.composerChips.map(c => ({ ...c, active: c.id === chipId }));
          render();
        }
        return;
      }
      if (id === "bp-composer-close") { state.composerOpen = false; state.fullSentenceMode = false; savePrefs(); render(); return; }
      if (id === "bp-conn-toggle") { state.connectivesEnabled = !state.connectivesEnabled; savePrefs(); render(); return; }
      if (id === "bp-conn-edit") {
        state.connEditOpen = !state.connEditOpen;
        if (!state.connEditOpen) {
          state.connPencilOpen = false;
          state.connAddOpen = false;
          state.connAddInput = "";
          state.connDeleteArmed = false;
          state.connDeleteTarget = null;
        }
        render(); return;
      }
      if (id === "bp-conn-pencil") {
        state.connPencilOpen = !state.connPencilOpen;
        if (!state.connPencilOpen) {
          state.connAddOpen = false;
          state.connAddInput = "";
          state.connDeleteArmed = false;
          state.connDeleteTarget = null;
        }
        render(); return;
      }
      // Add flow
      if (id === "bp-conn-add-open") { state.connAddOpen = true; state.connAddInput = ""; render(); return; }
      if (id === "bp-conn-add-cancel") { state.connAddOpen = false; state.connAddInput = ""; render(); return; }
      if (id === "bp-conn-add-confirm") {
        const word = (state.connAddInput || "").trim().toLowerCase();
        if (word) {
          const current = getConnectives();
          if (!current.some(w => normalize(w) === normalize(word))) {
            state.connectivesCustom = [...current, word];
          }
        }
        state.connAddOpen = false;
        state.connAddInput = "";
        savePrefs(); render(); return;
      }
      // Delete flow
      if (id === "bp-conn-delete-toggle") {
        if (state.connDeleteArmed && state.connDeleteTarget) {
          // Confirm delete — remove the target
          const word = state.connDeleteTarget;
          const base = getConnectives().filter(w => w !== word);
          state.connectivesCustom = base.length ? base : null;
          state.listenConnectives = state.listenConnectives.filter(w => w !== word);
          state.connDeleteArmed = false;
          state.connDeleteTarget = null;
          savePrefs(); render(); return;
        }
        if (state.connDeleteArmed) {
          // Armed but no target yet — disarm
          state.connDeleteArmed = false;
          state.connDeleteTarget = null;
        } else {
          // Arm delete mode
          state.connDeleteArmed = true;
          state.connDeleteTarget = null;
        }
        render(); return;
      }
      if (id === "bp-conn-delete-cancel") {
        state.connDeleteArmed = false;
        state.connDeleteTarget = null;
        render(); return;
      }
      if (id === "bp-conn-reset") {
        state.connectivesCustom = null;
        state.connPencilOpen = false;
        state.connAddOpen = false;
        state.connAddInput = "";
        state.connDeleteArmed = false;
        state.connDeleteTarget = null;
        savePrefs(); render(); return;
      }
      // Pill click — when delete armed, set target; otherwise insert into composer
      const connPill = t.closest("[data-conn-word]");
      if (connPill && state.connDeleteArmed) {
        const word = connPill.dataset.connWord;
        if (state.connDeleteTarget === word) {
          // Second click on same pill — confirm delete
          const base = getConnectives().filter(w => w !== word);
          state.connectivesCustom = base.length ? base : null;
          state.listenConnectives = state.listenConnectives.filter(w => w !== word);
          state.connDeleteArmed = false;
          state.connDeleteTarget = null;
          savePrefs(); render(); return;
        }
        state.connDeleteTarget = word;
        render(); return;
      }
      // ── Connect section delete mode: intercept conn-insert to set target ──
      const connPillEl = t.closest("[data-conn-insert]");
      if (connPillEl && state.quickConnectDeleteMode) {
        const word = connPillEl.dataset.connInsert;
        if (state.quickConnectDeleteTarget === word) {
          executeQsDelete("connect");
        } else {
          state.quickConnectDeleteTarget = word;
          render();
        }
        return;
      }

      const connInsert = t.closest("[data-conn-insert]");
      if (connInsert && !state.connDeleteArmed) {
        const word = connInsert.dataset.connInsert;
        routeInsert(word, "connector");
        render();
        return;
      }
      if (id === "bp-tray-float-instruments") { state.insFloat = true; savePrefs(); render(); return; }
      if (id === "bp-tray-float-vibes") { state.vibFloat = true; savePrefs(); render(); return; }
      if (id === "bp-tray-dock-instruments") { state.insFloat = false; savePrefs(); render(); return; }
      if (id === "bp-tray-dock-vibes") { state.vibFloat = false; savePrefs(); render(); return; }
      if (id === "bp-tray-min-instruments") { state.insMinimized = !state.insMinimized; savePrefs(); render(); return; }
      if (id === "bp-tray-min-vibes") { state.vibMinimized = !state.vibMinimized; savePrefs(); render(); return; }
      if (id === "bp-temp-terms-toggle") {
        state.tempTermsOpen = !state.tempTermsOpen;
        if (!state.tempTermsOpen) {
          state.tempTermsDeleteMode = false;
          state.tempTermsDeleteTarget = null;
          state.tempTermsEditTarget = null;
          state.tempTermsAwaitingShortcut = false;
        }
        savePrefs(); render(); return;
      }
      if (id === "bp-temp-add") {
        const text = state.tempTermsInput.trim();
        if (!text) return;
        state.tempTermsPendingText = text;
        state.tempTermsInput = "";
        state.tempTermsShortcutInput = "";
        state.tempTermsAwaitingShortcut = true;
        render();
        setTimeout(() => shadow.getElementById("bp-temp-shortcut-input")?.focus(), 30);
        return;
      }
      if (id === "bp-temp-confirm") { confirmTempTermAdd(); return; }
      if (id === "bp-temp-cancel-shortcut") {
        state.tempTermsAwaitingShortcut = false;
        state.tempTermsPendingText = "";
        state.tempTermsShortcutInput = "";
        render(); return;
      }
      if (id === "bp-temp-delete-toggle") {
        if (state.tempTermsDeleteMode && state.tempTermsDeleteTarget !== null) {
          state.undefinedTerms = state.undefinedTerms.filter((_, i) => i !== state.tempTermsDeleteTarget);
          state.tempTermsDeleteMode = false;
          state.tempTermsDeleteTarget = null;
        } else if (state.tempTermsDeleteMode) {
          state.tempTermsDeleteMode = false;
          state.tempTermsDeleteTarget = null;
        } else {
          state.tempTermsDeleteMode = true;
          state.tempTermsDeleteTarget = null;
          state.tempTermsEditTarget = null;
        }
        savePrefs(); render(); return;
      }
      if (id === "bp-temp-edit-toggle") {
        if (state.tempTermsEditTarget !== null) {
          state.tempTermsEditTarget = null;
        }
        state.tempTermsDeleteMode = false;
        state.tempTermsDeleteTarget = null;
        render(); return;
      }
      if (id === "bp-temp-export") { exportTempTermsToAI(); return; }
      const tempPill = t.closest("[data-temp-pill]");
      if (tempPill && state.tempTermsDeleteMode) {
        const idx = Number(tempPill.dataset.tempPill);
        if (state.tempTermsDeleteTarget === idx) {
          state.undefinedTerms = state.undefinedTerms.filter((_, i) => i !== idx);
          state.tempTermsDeleteMode = false;
          state.tempTermsDeleteTarget = null;
        } else {
          state.tempTermsDeleteTarget = idx;
        }
        savePrefs(); render(); return;
      }
      const tempRemove = t.closest("[data-temp-remove]");
      if (tempRemove && !state.tempTermsDeleteMode) {
        const idx = Number(tempRemove.dataset.tempRemove);
        state.undefinedTerms = state.undefinedTerms.filter((_, i) => i !== idx);
        savePrefs(); render(); return;
      }
      const tempEditBtn = t.closest("[data-temp-edit]");
      if (tempEditBtn) {
        const idx = Number(tempEditBtn.dataset.tempEdit);
        const entry = state.undefinedTerms[idx];
        state.tempTermsEditTarget = idx;
        state.tempTermsEditText = undefinedTermText(entry);
        state.tempTermsEditShortcut = undefinedTermShortcut(entry);
        render();
        setTimeout(() => shadow.getElementById("bp-temp-edit-text")?.focus(), 30);
        return;
      }
      const tempEditConfirm = t.closest("[data-temp-edit-confirm]");
      if (tempEditConfirm) {
        confirmTempTermEdit(Number(tempEditConfirm.dataset.tempEditConfirm)); return;
      }
      const tempEditCancel = t.closest("[data-temp-edit-cancel]");
      if (tempEditCancel) {
        state.tempTermsEditTarget = null; render(); return;
      }
      if (id === "bp-session-minimize") {
        state.sessionMinimized = !state.sessionMinimized;
        if (state.sessionMinimized) { state.quickHotkeysArmed = false; state.quickMoveMode = null; state.quickMovePillIdx = null; }
        savePrefs(); render(); return;
      }
      if (id === "bp-save-exit") { state.confirmExitOpen = true; render(); return; }
      if (id === "bp-confirm-cancel") { state.confirmExitOpen = false; render(); return; }
      if (id === "bp-confirm-ok") { state.confirmExitOpen = false; saveAndExportAll(); render(); return; }
      if (id === "bp-session-toggle") { state.sessionOpen = !state.sessionOpen; savePrefs(); render(); return; }
      if (id === "bp-session-close") { state.sessionOpen = false; state.quickHotkeysArmed = false; state.quickMoveMode = null; state.quickMovePillIdx = null; savePrefs(); render(); return; }
      if (id === "bp-session-clear") { clearSessionWorkingState({ closeSessionUi: false, closeComposerUi: false, closeToolTrays: true }); state.editorMessage = "Session working state cleared"; savePrefs(); render(); return; }
      if (id === "bp-preview-clear") {
        state.composerText = "";
        state.composerPills = [];
        state.composerSelectedPillId = null;
        state.composerDragId = null;
        syncComposerText(); return;
      }
      if (id === "bp-terms-view-cycle") {
        const modes = ["user", "az", "cat"];
        state.quickTermsViewMode = modes[(modes.indexOf(state.quickTermsViewMode) + 1) % modes.length];
        if (state.quickTermsViewMode !== "cat") state.quickTermsCatOpen = "";
        savePrefs(); render(); return;
      }
      if (id === "bp-connect-order-cycle") {
        state.quickConnectOrderMode = state.quickConnectOrderMode === "user" ? "az" : "user";
        savePrefs(); render(); return;
      }
      if (id === "bp-phrases-order-cycle") {
        state.quickPhrasesOrderMode = state.quickPhrasesOrderMode === "user" ? "az" : "user";
        savePrefs(); render(); return;
      }
      if (id === "bp-session-page-prev") { state.sessionPage = Math.max(0, (state.sessionPage || 0) - 1); render(); return; }
      if (id === "bp-session-page-next") {
        const totalPgs = Math.ceil(state.sessionItems.length / QUICK_ITEMS_PER_PAGE);
        state.sessionPage = Math.min(Math.max(0, totalPgs - 1), (state.sessionPage || 0) + 1);
        render(); return;
      }
      if (id === "bp-undefined-toggle") { state.undefinedOpen = !state.undefinedOpen; render(); return; }
      if (id === "bp-quick-conn") {
        state.quickConnOpen = !state.quickConnOpen;
        render(); return;
      }
      if (id === "bp-quick-ins") {
        const open = isToolTrayOpen("instruments");
        if (open) setToolTrayOpen("instruments", false); else ensureToolTrayOpen("instruments");
        savePrefs(); render(); return;
      }
      if (id === "bp-quick-vib") {
        const open = isToolTrayOpen("vibes");
        if (open) setToolTrayOpen("vibes", false); else ensureToolTrayOpen("vibes");
        savePrefs(); render(); return;
      }
      if (id === "bp-quick-sort") {
        const modes = ["az", "category", "custom"];
        const idx = modes.indexOf(state.quickSortMode);
        state.quickSortMode = modes[(idx + 1) % modes.length];
        render(); return;
      }
      if (id === "bp-undefined-save") {
        state.editorOpen = true;
        state.editMode = true;
        state.undefinedOpen = false;
        state.editorMessage = `${state.undefinedTerms.length} undefined terms ready — see below`;
        render();
        setTimeout(() => {
          const el = shadow.querySelector(".editor-section-block");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return;
      }
      if (id === "bp-template-save") {
        const nameInput = shadow.getElementById("bp-template-name");
        const name = (nameInput?.value || state.quickTemplateNameInput || "").trim();
        if (!name) { state.editorMessage = "Enter a name for this template"; render(); return; }
        if (!state.sessionItems.length) { state.editorMessage = "No items to store"; render(); return; }
        const existing = (state.quickTemplates || []).findIndex(t => t.name === name);
        const entry = { name, items: state.sessionItems.map(i => ({ ...i })) };
        if (existing >= 0) {
          state.quickTemplates = [...state.quickTemplates];
          state.quickTemplates[existing] = entry;
        } else {
          state.quickTemplates = [...(state.quickTemplates || []), entry];
        }
        state.quickTemplateNameInput = "";
        state.editorMessage = `Template "${name}" saved`;
        savePrefs(); render(); return;
      }
      const templateLoad = t.closest("[data-template-load]");
      if (templateLoad) {
        const idx = Number(templateLoad.dataset.templateLoad);
        if (!isNaN(idx) && state.quickTemplates[idx]) {
          state.sessionItems = state.quickTemplates[idx].items.map(i => ({ ...i }));
          state.sessionPage = 0;
          state.sessionOpen = true;
          state.editorMessage = `Loaded "${state.quickTemplates[idx].name}"`;
          savePrefs(); render();
        }
        return;
      }
      const templateDelete = t.closest("[data-template-delete]");
      if (templateDelete) {
        const idx = Number(templateDelete.dataset.templateDelete);
        if (!isNaN(idx)) {
          const name = state.quickTemplates[idx]?.name;
          state.quickTemplates = (state.quickTemplates || []).filter((_, i) => i !== idx);
          state.editorMessage = `Template "${name}" deleted`;
          savePrefs(); render();
        }
        return;
      }
      if (id === "bp-search-save-undefined") {
        const q = state.queryInput.trim();
        if (q) {
          const norm = normalize(q);
          if (!state.undefinedTerms.some(u => normalize(undefinedTermText(u)) === norm)) {
            state.undefinedTerms = [q, ...state.undefinedTerms].slice(0, 200);
            state.editorMessage = `"${q}" saved to undefined terms`;
            savePrefs();
          } else {
            state.editorMessage = `"${q}" already in undefined terms`;
          }
          render();
        }
        return;
      }
      if (id === "bp-editor-undefined-toggle") {
        state.editorUndefinedOpen = !state.editorUndefinedOpen;
        savePrefs(); render(); return;
      }
      if (id === "bp-editor-terms-toggle") {
        state.editorTermsOpen = !state.editorTermsOpen;
        savePrefs(); render(); return;
      }
      if (id === "bp-input-terms-open") {
        state.inputTermsOpen = !state.inputTermsOpen;
        render(); return;
      }
      if (id === "bp-input-terms-clear") {
        state.inputTermsText = "";
        state.inputTermsStatus = "";
        state.inputTermsParsed = [];
        render(); return;
      }
      if (id === "bp-input-terms-save") {
        const parsed = state.inputTermsParsed || [];
        if (!parsed.length) return;
        let added = 0;
        for (const item of parsed) {
          const row = normalizeMasterRow({
            shortcut: item.shortcut,
            term: item.term,
            section_key: item.section_key || "",
            section_label: titleCase(item.section_key || ""),
            category: item.category || "",
            notes: item.notes || "",
            id: `imported::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
            hidden: false,
            deleted: false
          }, MASTER_ROWS.length + 1);
          MASTER_ROWS.push(row);
          added++;
        }
        rebuildRuntimeData();
        saveMasterRows(`Imported ${added} row${added !== 1 ? "s" : ""}`);
        state.inputTermsText = "";
        state.inputTermsStatus = "";
        state.inputTermsParsed = [];
        state.inputTermsOpen = false;
        render(); return;
      }
      if (id === "bp-copy-ai-prompt") {
        const terms = state.undefinedTerms || [];
        const prompt = `I have a music annotation tool. The following phrases were typed by annotators but didn't match any existing shortcut terms. Please suggest shortcut + term pairs (CSV format: shortcut,term,section_key,category) for each one:\n\n${terms.map(u => undefinedTermText(u)).join("\n")}`;
        navigator.clipboard?.writeText(prompt).then(() => {
          state.editorMessage = `AI prompt copied (${terms.length} terms)`;
          render();
        }).catch(() => {
          state.editorMessage = "Copy failed — try a different browser";
          render();
        });
        return;
      }
      if (id === "bp-undefined-copy") {
        const text = (state.undefinedTerms || []).map(u => undefinedTermText(u)).join("\n");
        navigator.clipboard?.writeText(text).then(() => {
          state.editorMessage = `Copied ${state.undefinedTerms.length} undefined terms`;
          render();
        }).catch(() => {
          state.editorMessage = "Copy failed — try a different browser";
          render();
        });
        return;
      }
      if (id === "bp-undefined-clear") {
        state.undefinedTerms = [];
        state.editorMessage = "Undefined terms cleared";
        savePrefs(); render(); return;
      }
      const undefinedRemove = t.closest("[data-undefined-remove]");
      if (undefinedRemove) {
        const idx = Number(undefinedRemove.dataset.undefinedRemove);
        if (!isNaN(idx)) {
          state.undefinedTerms = (state.undefinedTerms || []).filter((_, i) => i !== idx);
          savePrefs(); render();
        }
        return;
      }
      if (id === "bp-save-export") { saveAndExportAll(); render(); return; }
      if (id === "bp-editor") {
        state.editorOpen = !state.editorOpen;
        state.editorMessage = "";
        if (state.editorOpen) { state.sidebarMode = null; state.helpOpen = false; }
        render(); return;
      }
      if (id === "bp-editor-add-context") { if (createEditorRowFromContext()) render(); return; }
      if (id === "bp-editor-add") {
        const template = MASTER_ROWS.find((row) => (state.editorCategory && row.category === state.editorCategory) || (state.editorSection && row.section_key === state.editorSection)) || MASTER_ROWS[0] || normalizeMasterRow({}, MASTER_ROWS.length + 1);
        MASTER_ROWS.unshift(normalizeMasterRow({
          ...template,
          id: `custom::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
          shortcut: "", term: "", base_shortcut: "", suffix: "", notes: "", hidden: false, deleted: false
        }, MASTER_ROWS.length + 1));
        state.editorMessage = "Blank row added"; render(); return;
      }
      if (id === "bp-editor-save") { saveMasterRows("Saved changes"); return; }
      if (id === "bp-editor-export-csv") { exportMasterCsv(); state.editorMessage = "CSV exported"; render(); return; }
      if (id === "bp-editor-export-plist") { exportPlist(); state.editorMessage = ".plist exported"; render(); return; }
      if (id === "bp-editor-reset") { restoreDefaultMasterRows(); return; }
    });
  }

  function bindEvents() {
    const shell = contentNode.querySelector(".shell");

    shell?.addEventListener("mouseenter", () => {
      if (collapseTimer) { clearTimeout(collapseTimer); collapseTimer = null; }
      if (state.autoHide && !state.visible && !isResizing) { state.visible = true; render(); }
    });

    shell?.addEventListener("mouseleave", () => {
      if (!state.autoHide || !state.visible || isResizing) return;
      collapseTimer = setTimeout(() => { state.visible = false; render(); }, 140);
    });

    // Widen rail hit target for auto-hide
    const rail = contentNode.querySelector(".rail");
    if (rail && state.autoHide) {
      rail.style.minWidth = "44px";
      rail.style.minHeight = "44px";
    }

    bindResize();
    bindPanelDrag();
    bindDockDrag();
    bindSessionWindow();
    bindFloatTray("instruments");
    bindFloatTray("vibes");

  }

  function addTermToTool(sec, term) {
    const text = activeInsertText(term, sec);
    if (!text) return;
    const list = getToolList(sec);
    const display = term?.s || text;
    const label = text;
    const existing = list.findIndex((item) => toolItemText(item) === text);
    pushToolHistory();
    if (existing !== -1) {
      list[existing].display = display;
      list[existing].label = label;
      state.selectedToolIndex = existing;
    } else {
      list.push({ text, display, label, active: true });
      state.selectedToolIndex = list.length - 1;
    }
    state.selectedToolSec = sec;
    ensureToolTrayOpen(sec);
    // Mirror to Quick session
    addTermToSession(term);
    savePrefs();
    render();
  }

  function addCustomToTool(sec, text) {
    if (!text) return;
    const list = getToolList(sec);
    const existing = list.findIndex((item) => toolItemText(item) === text);
    pushToolHistory();
    if (existing !== -1) {
      list[existing].display = list[existing].display || text;
      list[existing].label = list[existing].label || text;
      state.selectedToolIndex = existing;
    } else {
      list.push({ text, display: text, label: text, active: true });
      state.selectedToolIndex = list.length - 1;
    }
    state.selectedToolSec = sec;
    ensureToolTrayOpen(sec);
    setToolTrayExpanded(sec, true);
    // Mirror custom entry to Quick session
    const key = `custom::${sec}::${normalize(text)}`;
    if (!state.sessionItems.some(item => item.key === key)) {
      state.sessionItems.unshift({ key, shortcut: "", text, count: 1, updatedAt: Date.now() });
      if (state.sessionItems.length > 80) state.sessionItems = state.sessionItems.slice(0, 80);
      state.sessionOpen = true;
    }
    savePrefs();
    render();
  }

  function updateHelpHighlight() {
    const activeKey = state.pinnedKey || state.previewKey;
    shadow.querySelectorAll(".help-entry").forEach((entry) => {
      entry.classList.toggle("active", !!activeKey && entry.dataset.helpKey === activeKey);
    });
    shadow.querySelectorAll(".term-card").forEach((entry) => {
      entry.classList.toggle("active", !!activeKey && entry.dataset.key === activeKey);
    });
    shadow.querySelectorAll(".variant-pill").forEach((entry) => {
      entry.classList.toggle("active", !!activeKey && entry.dataset.variantKey === activeKey);
    });
  }

function syncHoverTooltip() {
  const titleEl = shadow.getElementById("bp-def-bar-title");
  const bodyEl = shadow.getElementById("bp-def-bar-body");
  const bar = shadow.getElementById("bp-def-bar");
  if (!titleEl || !bodyEl) return;

  let title = String(state.hoverTooltipTitle || "").trim();
  let body = String(state.hoverTooltipBody || "").trim();

  if (!title && !body && state.previewKey) {
    const term = TERM_MAP.get(state.previewKey);
    const definition = term ? getHelpText(term) : "";
    if (definition) {
      title = `${term.p} · ${term.s}`;
      body = definition;
    }
  }

  if (title && !body) { body = title; title = ""; }

  if (!state.helpHover || (!title && !body)) {
    if (bar) bar.classList.remove("active-term");
    titleEl.textContent = "?";
    bodyEl.textContent = "Hover a term to see its definition.";
    return;
  }

  if (bar) bar.classList.add("active-term");
  titleEl.textContent = title || "Definition";
  bodyEl.textContent = body || "";
}

function syncToolTrayViewport() {
  const shellEl = shadow.querySelector('.shell');
  const stack = shadow.querySelector('.tool-tray-stack');
  if (!shellEl || !stack) return;

  stack.style.top = '';
  stack.style.bottom = '';
  stack.style.maxHeight = '';
  stack.style.overflowY = '';
  stack.style.paddingRight = '';

  const shellRect = shellEl.getBoundingClientRect();
  const viewportPad = 8;

  stack.style.overflowY = 'auto';
  stack.style.paddingRight = '2px';

  // Constrain each individual tray so two trays never total more than viewport
  const trays = stack.querySelectorAll('.tool-tray');
  const stackCount = trays.length;
  if (stackCount > 1) {
    const maxPerTray = Math.floor((window.innerHeight - viewportPad * 2 - 8) / stackCount);
    trays.forEach(tray => { tray.style.maxHeight = `${Math.max(120, maxPerTray)}px`; tray.style.overflowY = 'auto'; });
  } else {
    trays.forEach(tray => { tray.style.maxHeight = ''; tray.style.overflowY = ''; });
  }

  if (isHorizontalDock()) {
    const rawTop = shellRect.top + 42;
    const availableHeight = Math.max(160, window.innerHeight - rawTop - viewportPad);
    stack.style.top = '42px';
    stack.style.maxHeight = `${availableHeight}px`;
    return;
  }

  const availableHeight = Math.max(180, window.innerHeight - viewportPad * 2);
  const desiredTop = 42;
  const rawTop = shellRect.top + desiredTop;
  const stackHeight = Math.min(stack.scrollHeight || stack.getBoundingClientRect().height || 0, availableHeight);
  const clampedTop = Math.max(viewportPad, Math.min(rawTop, window.innerHeight - stackHeight - viewportPad));
  const offsetTop = clampedTop - shellRect.top;

  stack.style.top = `${offsetTop}px`;
  stack.style.maxHeight = `${availableHeight}px`;
}

function syncSessionViewport() {
  const sessionWin = shadow.getElementById('bp-session-window');
  if (!sessionWin) return;
  const pos = clampSessionPosition(state.sessionX, state.sessionY, state.sessionWidth, state.sessionHeight);
  state.sessionX = pos.x;
  state.sessionY = pos.y;
  state.sessionWidth = pos.width;
  state.sessionHeight = pos.height;
  sessionWin.style.left = `${pos.x}px`;
  sessionWin.style.top = `${pos.y}px`;
  sessionWin.style.width = `${pos.width}px`;
  sessionWin.style.height = `${pos.height}px`;
  const connPanel = shadow.getElementById('bp-session-conn-panel');
  if (connPanel) {
    const windowRect = sessionWin.getBoundingClientRect();
    connPanel.style.top = `${windowRect.bottom + 4}px`;
    connPanel.style.left = `${windowRect.left}px`;
    connPanel.style.width = `${windowRect.width}px`;
    connPanel.style.pointerEvents = "auto";
  }
}

function bindResize() {

    const edgeHandle = shadow.getElementById("bp-resizer");
    const cornerHandle = shadow.getElementById("bp-corner-resizer");

    edgeHandle?.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      isResizing = true;
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = state.panelWidth;
      const startHeight = state.panelHeight;
      const onMove = (e) => {
        if (state.dock === "bottom") {
          state.panelHeight = clamp(window.innerHeight - e.clientY, PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 12, PANEL_MAX_HEIGHT));
        } else if (state.dock === "top") {
          state.panelHeight = clamp(e.clientY, PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 12, PANEL_MAX_HEIGHT));
        } else if (state.dock === "left") {
          state.panelWidth = clamp(e.clientX, PANEL_MIN_WIDTH, Math.min(window.innerWidth - 12, PANEL_MAX_WIDTH));
        } else if (state.dock === "right") {
          state.panelWidth = clamp(window.innerWidth - e.clientX, PANEL_MIN_WIDTH, Math.min(window.innerWidth - 12, PANEL_MAX_WIDTH));
        } else {
          state.panelWidth = clamp(startWidth + (e.clientX - startX), PANEL_MIN_WIDTH, Math.min(window.innerWidth - 24, PANEL_MAX_WIDTH));
        }
        const pos = clampFloatPosition(state.floatX, state.floatY);
        state.floatX = pos.x;
        state.floatY = pos.y;
        const shell = shadow.querySelector(".shell");
        shell?.style.setProperty("--panel-width", `${state.panelWidth}px`);
        shell?.style.setProperty("--panel-height", `${state.panelHeight}px`);
      };
      const onUp = () => {
        isResizing = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        savePrefs();
        render();
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });

    cornerHandle?.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      isResizing = true;
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = state.panelWidth;
      const startHeight = state.panelHeight;
      const onMove = (e) => {
        state.panelWidth = clamp(startWidth + (e.clientX - startX), PANEL_MIN_WIDTH, Math.min(window.innerWidth - 24, PANEL_MAX_WIDTH));
        state.panelHeight = clamp(startHeight + (e.clientY - startY), PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 24, PANEL_MAX_HEIGHT));
        const pos = clampFloatPosition(state.floatX, state.floatY);
        state.floatX = pos.x;
        state.floatY = pos.y;
        const shell = shadow.querySelector(".shell");
        shell?.style.setProperty("--panel-width", `${state.panelWidth}px`);
        shell?.style.setProperty("--panel-height", `${state.panelHeight}px`);
      };
      const onUp = () => {
        isResizing = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        savePrefs();
        render();
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  function bindPanelDrag() {
    const header = shadow.getElementById("bp-drag-header");
    if (!header) return;
    header.addEventListener("mousedown", (event) => {
      if (event.target.closest("button,input,select,textarea,label,a")) return;
      event.preventDefault();
      let moved = false;
      const shellRect = shadow.querySelector(".shell")?.getBoundingClientRect() || { left: state.floatX, top: state.floatY };
      const offsetX = Math.max(24, event.clientX - shellRect.left);
      const offsetY = Math.max(16, event.clientY - shellRect.top);
      const onMove = (e) => {
        if (Math.abs(e.clientX - event.clientX) > 4 || Math.abs(e.clientY - event.clientY) > 4) moved = true;
        if (!moved) return;
        const nextDock = snapDockFromPoint(e.clientX, e.clientY);
        if (nextDock === "float") {
          state.dock = "float";
          const pos = clampFloatPosition(e.clientX - offsetX, e.clientY - offsetY);
          state.floatX = pos.x;
          state.floatY = pos.y;
        } else {
          state.dock = nextDock;
        }
        state.visible = true;
        render();
      };
      const onUp = (e) => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (!moved) return;
        dockDragUntil = Date.now() + 180;
        const nextDock = snapDockFromPoint(e.clientX, e.clientY);
        if (nextDock === "float") {
          const pos = clampFloatPosition(e.clientX - offsetX, e.clientY - offsetY);
          state.floatX = pos.x;
          state.floatY = pos.y;
          state.dock = "float";
        } else {
          state.dock = nextDock;
        }
        state.visible = true;
        savePrefs();
        render();
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  function bindDockDrag() {
    const dragHandle = shadow.getElementById("bp-rail-drag");
    if (!dragHandle) return;
    dragHandle.addEventListener("mousedown", (event) => {
      let moved = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const offsetX = isFloatDock() ? Math.max(10, startX - state.floatX) : 12;
      const offsetY = isFloatDock() ? Math.max(10, startY - state.floatY) : 12;
      event.preventDefault();
      const onMove = (e) => {
        if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) moved = true;
        if (!moved) return;
        const nextDock = snapDockFromPoint(e.clientX, e.clientY);
        if (nextDock === "float") {
          state.dock = "float";
          const pos = clampFloatPosition(e.clientX - offsetX, e.clientY - offsetY);
          state.floatX = pos.x;
          state.floatY = pos.y;
        } else {
          state.dock = nextDock;
        }
        state.visible = true;
        render();
      };
      const onUp = (e) => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (!moved) return;
        dockDragUntil = Date.now() + 260;
        const nextDock = snapDockFromPoint(e.clientX, e.clientY);
        if (nextDock === "float") {
          const pos = clampFloatPosition(e.clientX - offsetX, e.clientY - offsetY);
          state.floatX = pos.x;
          state.floatY = pos.y;
          state.dock = "float";
        } else {
          state.dock = nextDock;
        }
        state.visible = true;
        savePrefs();
        render();
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  function bindSessionWindow() {
    const sessionWin = shadow.getElementById("bp-session-window");
    if (!sessionWin) return;
    const header = shadow.getElementById("bp-session-drag");
    const resizer = shadow.getElementById("bp-session-resizer");

    const startDrag = (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      const rect = sessionWin.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      document.body.style.userSelect = "none";

      const onMove = (e) => {
        const pos = clampSessionPosition(e.clientX - offsetX, e.clientY - offsetY, state.sessionWidth, state.sessionHeight);
        state.sessionX = pos.x;
        state.sessionY = pos.y;
        syncSessionViewport();
      };

      const onUp = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        savePrefs();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    };

    const startResize = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = state.sessionWidth;
      const startHeight = sessionWin.getBoundingClientRect().height || state.sessionHeight;
      document.body.style.userSelect = "none";

      const onMove = (e) => {
        const width = clamp(startWidth + (e.clientX - startX), SESSION_MIN_WIDTH, Math.min(window.innerWidth - 24, SESSION_MAX_WIDTH));
        const height = clamp(startHeight + (e.clientY - startY), SESSION_MIN_HEIGHT, Math.min(window.innerHeight - 24, SESSION_MAX_HEIGHT));
        const pos = clampSessionPosition(state.sessionX, state.sessionY, width, height);
        state.sessionWidth = pos.width;
        state.sessionHeight = pos.height;
        state.sessionX = pos.x;
        state.sessionY = pos.y;
        syncSessionViewport();
      };

      const onUp = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        savePrefs();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    };

    header?.addEventListener("pointerdown", startDrag);
    resizer?.addEventListener("pointerdown", startResize);
  }

  function bindFloatTray(secKey) {
    const trayEl = shadow.getElementById(`bp-tray-${secKey}`);
    if (!trayEl) return;
    const isFloat = secKey === "instruments" ? state.insFloat : state.vibFloat;
    if (!isFloat) return;
    const dragHandle = shadow.getElementById(`bp-tray-drag-${secKey}`);
    if (!dragHandle) return;

    dragHandle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button,input")) return;
      event.preventDefault();
      const rect = trayEl.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const trayW = rect.width;
      const trayH = rect.height;
      document.body.style.userSelect = "none";

      const onMove = (e) => {
        const nx = clamp(e.clientX - offsetX, 0, window.innerWidth - trayW);
        const ny = clamp(e.clientY - offsetY, 0, window.innerHeight - trayH);
        if (secKey === "instruments") { state.insX = nx; state.insY = ny; }
        else { state.vibX = nx; state.vibY = ny; }
        trayEl.style.left = nx + "px";
        trayEl.style.top = ny + "px";
      };

      const onUp = (e) => {
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        const shellEl = contentNode.querySelector(".shell");
        if (shellEl) {
          const sr = shellEl.getBoundingClientRect();
          const near = e.clientX >= sr.left - 60 && e.clientX <= sr.right + 60 &&
                        e.clientY >= sr.top - 60 && e.clientY <= sr.bottom + 60;
          if (near) {
            if (secKey === "instruments") state.insFloat = false;
            else state.vibFloat = false;
          }
        }
        savePrefs();
        render();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    });
  }

  function styles() {
    return `
      <style>
        :host, *, *::before, *::after { box-sizing: border-box; }
        button, input, code { font: inherit; }

        .shell {
          position: fixed;
          display: flex;
          gap: 6px;
          pointer-events: auto;
          overflow: visible;
        }

        /* ── Field target indicator ── */
        .field-target-indicator {
          position: fixed;
          z-index: 2147483646;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.82;
        }

        .field-target-indicator.fti-ready {
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.65);
        }

        /* ── Compose status badge ── */
        .compose-status-pill {
          display: inline-flex;
          align-items: center;
          padding: 1px 7px;
          border-radius: 999px;
          font-size: calc(9px * var(--ui-scale));
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
          border: 1px solid transparent;
        }

        .csp-green {
          background: rgba(34,197,94,0.14);
          color: #16a34a;
          border-color: rgba(34,197,94,0.28);
        }

        .dark .csp-green { color: #4ade80; }

        .csp-amber {
          background: rgba(245,158,11,0.14);
          color: #b45309;
          border-color: rgba(245,158,11,0.28);
        }

        .dark .csp-amber { color: #fbbf24; }

        .csp-red {
          background: rgba(239,68,68,0.14);
          color: #b91c1c;
          border-color: rgba(239,68,68,0.28);
        }

        .dark .csp-red { color: #f87171; }

        .shell.dock-right {
          top: 50%;
          right: 0;
          left: auto;
          bottom: auto;
          transform: translateY(-50%);
          height: min(90vh, 860px);
          width: 20px;
          justify-content: flex-end;
          align-items: stretch;
          flex-direction: row;
        }

        .shell.dock-right.open {
          width: min(calc(100vw - 10px), calc(var(--panel-width) + 30px));
        }

        .shell.dock-right.open.has-tool-trays {
          width: min(calc(100vw - 10px), calc(var(--panel-width) + 30px + 248px + 16px));
        }

        .shell.dock-left {
          top: 50%;
          left: 0;
          right: auto;
          bottom: auto;
          transform: translateY(-50%);
          height: min(90vh, 860px);
          width: 20px;
          align-items: stretch;
          flex-direction: row;
        }

        .shell.dock-left.open {
          width: min(calc(100vw - 10px), calc(var(--panel-width) + 30px));
        }

        .shell.dock-left.open.has-tool-trays {
          width: min(calc(100vw - 10px), calc(var(--panel-width) + 30px + 248px + 16px));
        }

        .shell.dock-bottom {
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 110px;
          height: 28px;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-end;
        }

        .shell.dock-bottom.open {
          width: min(calc(100vw - 14px), var(--panel-width));
          height: min(calc(100vh - 10px), calc(var(--panel-height) + var(--drawer-open) + 24px));
        }

        .rail {
          width: 42px;
          min-width: 42px;
          border: none;
          border-radius: 0 12px 12px 0;
          cursor: default;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          padding: 12px 2px;
          font-size: 9px;
          font-weight: 900;
          user-select: none;
          flex-shrink: 0;
          box-shadow: -8px 14px 30px rgba(7, 12, 22, 0.18);
          z-index: 3;
          pointer-events: auto;
        }

        .rail-toggle {
          border: none;
          background: transparent;
          color: inherit;
          padding: 0;
          margin: 0;
          cursor: move;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          flex: 0 0 auto;
        }

        .rail-drag {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: inherit;
          padding: 2px 3px;
          margin: 0;
          cursor: move;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          min-height: 20px;
          border-radius: 7px;
          user-select: none;
          flex: 0 0 auto;
        }

        .rail-drag:active {
          cursor: move;
        }

        .light .rail {
          background: rgba(243, 246, 252, 0.88);
          color: #304155;
          border: 1px solid rgba(48, 65, 85, 0.12);
          border-right: none;
        }

        .dock-left.light .rail { border-right: 1px solid rgba(48, 65, 85, 0.12); border-left: none; }
        .dock-bottom.light .rail { border-right: 1px solid rgba(48, 65, 85, 0.12); border-bottom: none; }

        .light .rail-drag { border-color: rgba(48, 65, 85, 0.16); background: rgba(255, 255, 255, 0.84); }

        .dark .rail {
          background: rgba(18, 22, 31, 0.90);
          color: #eef2ff;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-right: none;
        }

        .dock-left.dark .rail { border-right: 1px solid rgba(255,255,255,0.10); border-left: none; }
        .dock-bottom.dark .rail { border-right: 1px solid rgba(255,255,255,0.10); border-bottom: none; }

        .dark .rail-drag { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.08); }

        .rail-mark {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.10em;
          line-height: 1;
          white-space: nowrap;
          text-transform: uppercase;
          opacity: 0.90;
          flex-shrink: 0;
        }

        .rail-mark-vert {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }

        .rail-mark-horiz {
          writing-mode: horizontal-tb;
        }

        .rail-drag-mark {
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.02em;
          opacity: 0.96;
          text-transform: none;
          transform: none;
        }

        .dock-left .rail {
          order: 1;
          border-radius: 12px 0 0 12px;
          box-shadow: 8px 14px 30px rgba(7, 12, 22, 0.18);
        }

        .dock-bottom .rail-drag,
        .dock-top .rail-drag {
          margin: 0;
          min-width: 34px;
          min-height: 22px;
          align-self: center;
        }

        .dock-bottom .rail-drag-mark,
        .dock-top .rail-drag-mark {
          transform: none;
        }

        .dock-bottom .rail {
          order: 3;
          width: 160px;
          height: 30px;
          border-radius: 12px 12px 0 0;
          flex-direction: row;
          align-items: center;
          box-shadow: 0 -8px 22px rgba(7, 12, 22, 0.18);
        }

        .shell.dock-right .rail,
        .shell.dock-left .rail {
          min-height: min(90vh, 860px);
          height: min(90vh, 860px);
          justify-content: space-between;
          padding: 12px 2px;
        }

        .shell.dock-top .rail,
        .shell.dock-bottom .rail {
          min-width: 100%;
          height: 42px;
          flex-direction: row;
          justify-content: space-between;
          padding: 2px 12px;
        }

        .shell.dock-right .panel { order: 1; }
        .shell.dock-right .rail { order: 2; }

        .shell.dock-right .tool-tray-stack {
          right: calc(100% + 8px);
          left: auto;
        }

        .shell.dock-left .tool-tray-stack {
          left: calc(100% + 8px);
          right: auto;
        }

        .shell.dock-top.has-tool-trays .panel,
        .shell.dock-bottom.has-tool-trays .panel {
          width: calc(100% - var(--drawer-width) - 10px);
          flex: 1 1 auto;
          min-width: 0;
        }

        .shell.dock-top.has-tool-trays,
        .shell.dock-bottom.has-tool-trays {
          align-items: stretch;
        }

        .shell.dock-right .rail-scale-label,
        .shell.dock-left .rail-scale-label,
        .shell.dock-float .rail-scale-label {
          display: none;
        }

        .help-mark,
        .info-mark {
          min-width: 28px;
          padding-left: 0;
          padding-right: 0;
          text-align: center;
        }

        .info-mark { font-style: italic; }

        .light .tool-launch-btn.empty {
          background: rgba(255, 228, 228, 0.92);
          border-color: rgba(209, 129, 129, 0.65);
          color: #6a2a2a;
        }

        .dark .tool-launch-btn.empty {
          background: rgba(124, 45, 58, 0.44);
          border-color: rgba(232, 152, 163, 0.44);
          color: #ffe7ea;
        }

        .light .tool-launch-btn.filled {
          background: rgba(217, 242, 220, 0.98);
          border-color: rgba(94, 162, 108, 0.6);
          color: #174624;
        }

        .dark .tool-launch-btn.filled {
          background: rgba(44, 105, 58, 0.52);
          border-color: rgba(138, 224, 158, 0.42);
          color: #eefdf1;
        }

        .light .tool-launch-btn.active,
        .dark .tool-launch-btn.active {
          box-shadow: 0 0 0 2px rgba(109, 140, 255, 0.24);
        }

        .tool-tray-stack {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 8px;
          top: 42px;
          z-index: 4;
          pointer-events: auto;
          overflow: visible;
        }

        .tool-tray {
          width: var(--tool-tray-width, 248px);

          border-radius: 12px;
          padding: 7px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          box-shadow: 0 14px 32px rgba(8, 12, 20, 0.22);
          pointer-events: auto;
        }

        .light .tool-tray { background: rgba(247, 249, 253, 0.90); border: 1px solid rgba(48,65,85,0.12); }
        .dark .tool-tray { background: rgba(21, 26, 36, 0.90); border: 1px solid rgba(255,255,255,0.10); }
        .shell.dock-top .tool-tray,
        .shell.dock-bottom .tool-tray {
          width: var(--drawer-width);
          max-width: var(--drawer-width);
          max-height: calc(var(--panel-height) - 52px);
        }
        .tool-tray-mini-title {
          border-radius: 10px;
          padding: 6px 8px;
          background: linear-gradient(135deg, rgba(90, 123, 229, 0.9), rgba(79, 100, 191, 0.92));
        }

        .shell.dock-right .tool-tray-stack,
        .shell.dock-float .tool-tray-stack {
          right: calc(100% + 8px);
        }

        .shell.dock-left .tool-tray-stack {
          left: calc(100% + 8px);
        }

        .shell.dock-top .tool-tray-stack,
        .shell.dock-bottom .tool-tray-stack {
          top: 42px;
          right: 0;
          left: auto;
          flex-direction: column;
          align-items: stretch;
          flex-wrap: nowrap;
          width: var(--drawer-width);
        }

        .tool-tray-add-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tool-tray-mini-title {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.02em;
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap:6px;
          color: #ffffff;
        }
        .tool-tray-title-text {
          color: #ffffff;
          font-weight: 900;
        }
        .tool-tray-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4px;
        }
        .tool-tray-actions-grid .icon-btn {
          width: 100%;
          min-height: 18px;
          padding: 1px 4px;
          font-size: 7px;
          line-height: 1;
          justify-content: center;
        }
        .tool-action-placeholder {
          display: block;
          min-height: 30px;
        }
        .tool-tray-count { font-size: 9px; opacity: 0.96; padding: 1px 5px; border-radius: 999px; background: rgba(109, 140, 255, 0.22); color: #ffffff; }
        .tool-tray-chip-list { display: flex; flex-wrap: wrap; gap: 5px; max-height: min(68vh, 560px); overflow: auto; }
        .tool-tray-chip-list.mini-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; max-height: min(24vh, 112px); }
        .tool-tray-chip-list.full-list { flex-direction: column; flex-wrap: nowrap; }
        .tray-pill { border-radius: 9px; padding: 5px 8px; font-size: 10px; font-weight: 800; max-width: 100%; border: 1px solid transparent; }
        .tray-pill.mini { width: 100%; min-width: 0; min-height: 28px; justify-content: center; padding: 4px 7px; }
        .tray-pill.full { width: 100%; justify-content: flex-start; text-align: left; }
        .mini-empty { padding: 10px 12px; font-size: 11px; }
        .slim { padding-left: 8px; padding-right: 8px; }
        .tray-pill.selected { outline: 2px solid rgba(102, 173, 255, 0.9); outline-offset: 1px; }
        .light .tray-pill.active { background: rgba(214,231,255,0.96); color: #163a61; border-color: rgba(22,58,97,0.14); }
        .light .tray-pill.inactive { background: rgba(230,235,243,0.96); color: #526174; border-color: rgba(82,97,116,0.14); }
        .dark .tray-pill.active { background: rgba(74,115,166,0.32); color: #eff6ff; border-color: rgba(175,214,255,0.20); }
        .dark .tray-pill.inactive { background: rgba(255,255,255,0.08); color: #d3dceb; border-color: rgba(255,255,255,0.10); }
        .tool-emphasis { min-width: 72px; min-height: 42px; }
        .tool-launch-name { font-size: calc(9px * var(--ui-scale)); font-weight: 900; letter-spacing: 0.01em; white-space: nowrap; color: #ffffff; }
        .tool-square-label,
        .tool-launch-meta,
        .tool-chip-label,
        .tool-inline-title {
          color: inherit;
        }
        .tool-launch-meta { font-size: 10px; font-weight: 900; opacity: 0.98; color: #ffffff; }
        .icon-btn.ready, .print-btn.ready { background: rgba(74, 183, 93, 0.92) !important; color: white !important; border-color: rgba(32, 122, 53, 0.7) !important; }
        .icon-btn:disabled,
        .ghost-btn:disabled,
        .seg-btn:disabled { opacity: 0.38; cursor: default; box-shadow: none !important; }

        .panel {
          position: relative;

          flex: 0 0 var(--panel-width);
          width: var(--panel-width);
          border-radius: 18px 0 0 18px;
          padding: 8px 8px 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
          min-width: 0;
          box-shadow: -18px 24px 56px rgba(8, 12, 20, 0.22);
          pointer-events: auto;
        }

        .dock-left .panel {
          order: 2;
          border-radius: 0 18px 18px 0;
          padding: 8px 10px 8px 8px;
          box-shadow: 18px 24px 56px rgba(8, 12, 20, 0.22);
        }

        .dock-bottom .panel {
          order: 2;
          width: min(calc(100vw - 14px), var(--panel-width));
          flex: 0 0 var(--panel-height);
          height: var(--panel-height);
          border-radius: 18px 18px 0 0;
          padding: 10px 10px 8px;
          box-shadow: 0 -18px 36px rgba(8, 12, 20, 0.22);
        }

        .light .panel {
          background: rgba(250, 251, 255, 0.88);
          border: 1px solid rgba(46, 58, 80, 0.12);
          color: #17202b;
        }

        .dark .panel {
          background: rgba(14, 18, 28, 0.90);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f7f8fb;
        }

        .resizer {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          cursor: ew-resize;
          z-index: 9;
        }

        .dock-left .resizer {
          left: auto;
          right: 0;
        }

        .dock-bottom .resizer {
          left: 0;
          right: 0;
          top: 0;
          bottom: auto;
          width: auto;
          height: 8px;
          cursor: ns-resize;
        }

        .panel-header,
        .search-row,
        .compact-toolbar,
        .top-category-row,
        .header-actions,
        .tool-launchers,
        .drawer-actions,
        .help-entry-top,
        .card-top,
        .accordion-row,
        .accordion-row-main {
          display: flex;
          align-items: center;
        }

        .panel-header {
          justify-content: space-between;
          gap: 6px;
          align-items: flex-start;
        }

        .header-actions,
        .tool-launchers,
        .drawer-actions,
        .top-category-row,
        .accordion-row,
        .accordion-row-main,
        .help-entry-top,
        .card-top {
          gap: 6px;
        }

        .eyebrow {
          font-size: calc(9px * var(--ui-scale));
          text-transform: uppercase;
          letter-spacing: 0.13em;
          opacity: 0.64;
          font-weight: 800;
        }

        .panel-title {
          margin: 1px 0 0;
          font-size: calc(13px * var(--ui-scale));
          line-height: 1.08;
          font-weight: 800;
        }

        .icon-btn,
        .ghost-btn,
        .seg-btn,
        .top-cat-btn,
        .tool-launch-btn,
        .accordion-row,
        .drawer-chip,
        .drawer-add-btn,
        .print-btn {
          border: none;
          cursor: pointer;
          transition: transform 0.14s ease, background-color 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease;
        }

        .icon-btn,
        .ghost-btn,
        .seg-btn {
          border-radius: 6px;
          padding: calc(5px * var(--ui-scale)) calc(8px * var(--ui-scale));
          font-size: calc(9px * var(--ui-scale));
          font-weight: 800;
          white-space: nowrap;
        }


        .header-actions {
          flex-wrap: wrap;
          justify-content: flex-end;
          row-gap: 4px;
        }

        .header-actions #bp-help-hover,
        .header-actions #bp-help { order: -1; }

        .small { padding: 6px 7px; font-size: 10px; }
        .small-close { padding: 5px 6px; min-width: 24px; font-size: 11px; }
        .danger { width: 34px; padding: 0; font-size: 18px; line-height: 1; }

        .light .icon-btn,
        .light .ghost-btn,
        .light .seg-btn,
        .light .drawer-chip,
        .light .drawer-add-btn,
        .light .print-btn {
          background: rgba(23, 32, 43, 0.055);
          color: #1b2633;
        }

        .light .tool-launch-btn,
        .light .top-cat-btn {
          background: var(--cat-chip-bg, rgba(31, 44, 64, 0.06));
          border: 1px solid var(--cat-chip-border, rgba(31, 44, 64, 0.12));
          color: var(--cat-chip-text, #1b2633);
        }

        .dark .icon-btn,
        .dark .ghost-btn,
        .dark .seg-btn,
        .dark .drawer-chip,
        .dark .drawer-add-btn,
        .dark .print-btn {
          background: rgba(255, 255, 255, 0.07);
          color: #f7f8fb;
        }

        .dark .tool-launch-btn,
        .dark .top-cat-btn {
          background: var(--cat-chip-bg, rgba(255,255,255,0.07));
          border: 1px solid var(--cat-chip-border, rgba(255,255,255,0.1));
          color: var(--cat-chip-text, #f7f8fb);
        }

        .icon-btn.active,
        .seg-btn.active,
        .top-cat-btn.active,
        .tool-launch-btn.active {
          transform: translateY(-1px);
          box-shadow: 0 0 0 2px rgba(109, 140, 255, 0.24), 0 8px 18px rgba(70, 96, 194, 0.18);
        }

        .light .icon-btn.active,
        .light .seg-btn.active {
          background: #7ca6ff;
          color: #08131f;
          border-color: rgba(41, 88, 164, 0.42);
        }

        .light .top-cat-btn.active,
        .light .tool-launch-btn.active {
          background: var(--cat-chip-bg, #dfe8f8);
          color: var(--cat-chip-text, #17202b);
          border-color: var(--cat-chip-border, rgba(31,44,64,0.22));
        }

        .dark .icon-btn.active,
        .dark .seg-btn.active {
          background: rgba(151, 182, 255, 0.9);
          color: #0b1220;
          border-color: rgba(222, 233, 255, 0.62);
        }

        .dark .top-cat-btn.active,
        .dark .tool-launch-btn.active {
          background: var(--cat-chip-bg, rgba(237,242,255,0.18));
          color: var(--cat-chip-text, #f7f8fb);
          border-color: var(--cat-chip-border, rgba(237,242,255,0.26));
        }

        .light .tool-launch-btn.empty {
          background: rgba(255, 228, 228, 0.92);
          border: 1px solid rgba(209, 129, 129, 0.65);
          color: #6a2a2a;
        }

        .dark .tool-launch-btn.empty {
          background: rgba(124, 45, 58, 0.52);
          border: 1px solid rgba(232, 152, 163, 0.5);
          color: #ffe7ea;
        }

        .light .tool-launch-btn.filled {
          background: rgba(217, 242, 220, 0.98);
          border: 1px solid rgba(94, 162, 108, 0.6);
          color: #174624;
        }

        .dark .tool-launch-btn.filled {
          background: rgba(44, 105, 58, 0.64);
          border: 1px solid rgba(138, 224, 158, 0.5);
          color: #eefdf1;
        }

        .light .tool-launch-btn.active { box-shadow: 0 0 0 2px rgba(61,108,255,0.26), 0 10px 20px rgba(61,108,255,0.14); }
        .dark .tool-launch-btn.active { box-shadow: 0 0 0 2px rgba(151,182,255,0.34), 0 10px 20px rgba(151,182,255,0.16); }

        .controls-stack { display: flex; flex-direction: column; gap: 6px; }
        .search-only-controls { gap: 6px; }

        .control-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: calc(5px * var(--ui-scale)) calc(6px * var(--ui-scale));
          border: 1px solid var(--panel-border);
          border-radius: 7px;
        }

        .light .control-box.tone-a { background: rgba(31,44,64,0.045); }
        .light .control-box.tone-b { background: rgba(31,44,64,0.065); }
        .light .control-box.tone-c { background: rgba(31,44,64,0.035); }
        .dark .control-box.tone-a { background: rgba(255,255,255,0.055); }
        .dark .control-box.tone-b { background: rgba(255,255,255,0.085); }
        .dark .control-box.tone-c { background: rgba(255,255,255,0.04); }

        .toolbar-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .toolbar-row-search { align-items: stretch; }
        .toolbar-row-controls { justify-content: space-between; }
        .search-secondary-controls { row-gap: 8px; }

        .search-row { gap: 0; flex: 1 1 260px; min-width: 0; }
        .search-wrap { flex: 1; }
        .search-shell { position: relative; display: block; }
        .search-actions {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          gap: 6px;
        }
        .search-mini {
          border: none;
          border-radius: 5px;
          min-width: calc(30px * var(--ui-scale));
          padding: calc(4px * var(--ui-scale)) calc(6px * var(--ui-scale));
          font-size: calc(9px * var(--ui-scale));
          font-weight: 900;
          cursor: pointer;
        }

        #bp-search,
        .drawer-input {
          width: 100%;
          border-radius: 8px;
          padding: calc(8px * var(--ui-scale)) calc(86px * var(--ui-scale)) calc(8px * var(--ui-scale)) calc(10px * var(--ui-scale));
          outline: none;
          font-size: calc(11px * var(--ui-scale));
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }

        .light #bp-search,
        .light .drawer-input {
          border: 1px solid rgba(32, 48, 66, 0.16);
          background: rgba(255, 255, 255, 0.98);
          color: #17202b;
        }

        .dark #bp-search,
        .dark .drawer-input {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #f7f8fb;
        }

        #bp-search:focus,
        .drawer-input:focus {
          box-shadow: 0 0 0 3px rgba(97, 126, 255, 0.18);
        }

        .compact-toolbar {
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }

        .utility-group { margin-left: auto; }

        .mini-group {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .compact-right { margin-left: auto; }

        .mini-label {
          font-size: calc(10px * var(--ui-scale));
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.64;
          font-weight: 800;
        }

        .segmented {
          display: inline-flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .compact-seg .seg-btn { padding: calc(5px * var(--ui-scale)) calc(7px * var(--ui-scale)); font-size: calc(10px * var(--ui-scale)); }

        .tool-section-grid-box {
          padding: calc(6px * var(--ui-scale));
        }

        .tool-launch-bar {
          display: flex;
          gap: 6px;
          width: 100%;
          flex-wrap: wrap;
        }

        .tool-launch-bar.horizontal,
        .tool-launch-bar.vertical {
          flex-direction: row;
        }

        .tool-launch-btn.tool-compact {
          min-width: 0;
          flex: 1 1 calc(50% - 3px);
          justify-content: space-between;
          padding: calc(2px * var(--ui-scale)) calc(5px * var(--ui-scale));
          border-radius: 7px;
          min-height: calc(20px * var(--ui-scale));
        }

        .tool-inline-section {
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .light .tool-inline-section { background: rgba(255,255,255,0.5); }
        .dark .tool-inline-section { background: rgba(255,255,255,0.045); }

        .tool-inline-head,
        .tool-inline-actions,
        .tool-inline-body,
        .tool-chip {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tool-inline-head {
          justify-content: space-between;
          align-items: flex-start;
        }

        .tool-inline-toggle {
          min-width: 0;
          flex: 1 1 auto;
          justify-content: space-between;
          padding: calc(2px * var(--ui-scale)) calc(6px * var(--ui-scale));
        }

        .tool-inline-actions {
          flex: 0 0 auto;
          gap: 4px;
        }

        .tool-inline-actions .icon-btn.small {
          min-width: 22px;
          min-height: 20px;
          padding-left: 0;
          padding-right: 0;
          font-size: calc(9px * var(--ui-scale));
        }

        .tool-inline-body {
          flex-direction: column;
          align-items: stretch;
        }

        .tool-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-height: 220px;
          overflow: auto;
        }

        .tool-chip-grid.expanded {
          display: grid;
          grid-template-columns: 1fr;
        }

        .tool-chip {
          min-width: 0;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 2px 4px 2px 6px;
          justify-content: space-between;
          max-width: 100%;
        }

        .light .tool-chip {
          background: rgba(222, 232, 249, 0.96);
          border-color: rgba(55, 88, 136, 0.18);
          color: #12243a;
        }

        .dark .tool-chip {
          background: rgba(72, 99, 148, 0.36);
          border-color: rgba(175, 214, 255, 0.18);
          color: #f3f7ff;
        }

        .tool-chip.mini {
          max-width: calc(50% - 3px);
          min-height: 24px;
        }

        .tool-chip.full {
          width: 100%;
          border-radius: 12px;
          min-height: 28px;
        }

        .tool-chip-label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
        }

        .tool-chip-remove {
          border: none;
          background: rgba(0,0,0,0.12);
          color: inherit;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          cursor: pointer;
          flex: 0 0 auto;
          line-height: 1;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: calc(9px * var(--ui-scale));
        }

        .dark .tool-chip-remove { background: rgba(255,255,255,0.12); }
        .inline-add-row .drawer-add-btn { min-width: 32px; padding-left: 0; padding-right: 0; }

        .tool-launch-btn,
        .top-cat-btn {
          border-radius: 6px;
          padding: calc(3px * var(--ui-scale)) calc(6px * var(--ui-scale));
          font-size: calc(9.5px * var(--ui-scale));
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .tool-launch-count,
        .top-cat-count {
          font-size: calc(8px * var(--ui-scale));
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 4px;
          background: var(--cat-chip-badge, rgba(31,44,64,0.08));
          opacity: 0.86;
        }

        .top-category-row {
          gap: 5px;
          flex-wrap: wrap;
          padding-bottom: 1px;
        }

        .top-cat-hotkey,
        .accordion-index {
          width: calc(16px * var(--ui-scale));
          height: calc(16px * var(--ui-scale));
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: calc(10px * var(--ui-scale));
          font-weight: 900;
        }

        .light .top-cat-hotkey,
        .light .accordion-index,
        .light .search-mini { background: rgba(23,32,43,0.08); color: #203042; }
        .dark .top-cat-hotkey,
        .dark .accordion-index,
        .dark .search-mini { background: rgba(255,255,255,0.08); color: #f7f8fb; }
        .search-mini.active { transform: translateY(-1px); }
        .light .search-mini.active { background: #3d6cff; color: #fff; box-shadow: 0 0 0 2px rgba(61,108,255,0.18); }
        .dark .search-mini.active { background: #9db5ff; color: #111420; box-shadow: 0 0 0 2px rgba(157,181,255,0.22); }

        .dropdown-toggle {
          border: 1px solid var(--panel-border);
          background: transparent;
          color: inherit;
          border-radius: 6px;
          padding: calc(6px * var(--ui-scale)) calc(8px * var(--ui-scale));
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          white-space: nowrap;
        }

        .dropdown-shortcut,
        .accordion-hotkey-hint,
        .hotkey-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: calc(18px * var(--ui-scale));
          height: calc(16px * var(--ui-scale));
          padding: 0 calc(4px * var(--ui-scale));
          border-radius: 4px;
          font-size: calc(9px * var(--ui-scale));
          font-weight: 900;
        }

        .light .dropdown-shortcut,
        .light .accordion-hotkey-hint,
        .light .hotkey-pill { background: rgba(23,32,43,0.08); color: #203042; }
        .dark .dropdown-shortcut,
        .dark .accordion-hotkey-hint,
        .dark .hotkey-pill { background: rgba(255,255,255,0.10); color: #f7f8fb; }

        .dropdown-toggle.active .dropdown-arrow { transform: rotate(180deg); }
        .dropdown-arrow { transition: transform 0.12s ease; }
        .dropdown-toggle.write-mini.ready {
          border-color: rgba(74, 183, 93, 0.54);
          box-shadow: inset 0 0 0 1px rgba(74, 183, 93, 0.18);
        }

        .search-cats-box {
          padding: calc(6px * var(--ui-scale));
        }

        .search-cats-dropdown {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .hotkey-box { justify-content: flex-start; }
        .hotkey-legend {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: calc(9px * var(--ui-scale));
          font-weight: 700;
          opacity: 0.9;
        }
        .hotkey-legend.compact { gap: 5px; }
        .hotkey-text { opacity: 0.72; }

        .tool-square {
          border-radius: 6px;
          width: calc(48px * var(--ui-scale));
          min-width: calc(48px * var(--ui-scale));
          height: calc(42px * var(--ui-scale));
          padding: calc(6px * var(--ui-scale));
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .tool-square-label { font-size: calc(9px * var(--ui-scale)); font-weight: 900; letter-spacing: 0.01em; white-space: nowrap; line-height: 1; }


        .size-group {
          min-width: min(168px, 100%);
        }

        .size-control {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
        }

        #bp-size-slider {
          width: min(120px, 32vw);
          accent-color: #6d8cff;
          cursor: pointer;
        }

        .rail-scale {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          min-width: 0;
          margin-top: auto;
          flex: 0 0 auto;
          cursor: default;
          user-select: none;
        }

        .rail-size-slider {
          width: 44px;
          height: 12px;
          margin: 0;
          transform: rotate(-90deg);
          transform-origin: center;
          accent-color: #6d8cff;
          cursor: pointer;
        }

        .dock-bottom .rail-scale,
        .dock-top .rail-scale {
          flex-direction: row;
          gap: 6px;
          margin-top: 0;
          margin-left: auto;
        }

        .dock-bottom .rail-size-slider,
        .dock-top .rail-size-slider {
          width: 44px;
          height: 14px;
          transform: none;
        }

.definition-bar {
  border-radius: 10px;
  border: 1px solid var(--panel-border);
  padding: 8px 10px;
  min-height: calc(62px * var(--ui-scale));
  max-height: calc(62px * var(--ui-scale));
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.light .definition-bar {
  background: rgba(255,255,255,0.58);
}

.dark .definition-bar {
  background: rgba(255,255,255,0.06);
}

.definition-bar.active-term {
  box-shadow: inset 0 0 0 1px rgba(109,140,255,0.2);
}

.definition-bar-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.definition-bar-mark {
  width: calc(18px * var(--ui-scale));
  height: calc(18px * var(--ui-scale));
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: calc(11px * var(--ui-scale));
  font-weight: 900;
  flex: 0 0 auto;
  background: rgba(109,140,255,0.16);
  color: #dbe5ff;
  border: 1px solid rgba(109,140,255,0.24);
}

.light .definition-bar-mark {
  background: rgba(109,140,255,0.14);
  color: #2b3e70;
}

.definition-bar-title {
  min-width: 0;
  font-size: calc(11px * var(--ui-scale));
  font-weight: 800;
  opacity: 0.86;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.definition-bar-body {
  font-size: calc(11px * var(--ui-scale));
  line-height: 1.38;
  opacity: 0.9;
  overflow: auto;
  padding-right: 2px;
}

        .save-banner {
          border-radius: 8px;
          padding: 7px 10px;
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          margin-top: -2px;
        }

        .light .save-banner {
          background: rgba(31,44,64,0.06);
          color: #1b2633;
          border: 1px solid rgba(31,44,64,0.12);
        }

        .dark .save-banner {
          background: rgba(255,255,255,0.07);
          color: #f7f8fb;
          border: 1px solid rgba(255,255,255,0.10);
        }

        .light .save-banner.dirty,
        .light .save-export-btn {
          background: #d94d47;
          color: #fff;
          border: 1px solid rgba(140, 29, 24, 0.42);
        }

        .dark .save-banner.dirty,
        .dark .save-export-btn {
          background: #ff6c63;
          color: #201111;
          border: 1px solid rgba(255, 214, 210, 0.32);
        }

        .save-banner.warn,
        .save-export-btn.warn {
          box-shadow: 0 0 0 2px rgba(255, 174, 0, 0.22);
        }

        .save-banner-meta { opacity: 0.88; }

        .inline-edit-shell {
          display: grid;
          gap: 8px;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 12px;
        }

        .light .inline-edit-shell { background: rgba(31,44,64,0.05); border: 1px solid rgba(31,44,64,0.10); }
        .dark .inline-edit-shell { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }

        .inline-edit-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .inline-edit-title { font-size: calc(11px * var(--ui-scale)); font-weight: 900; }
        .inline-edit-meta { font-size: calc(10px * var(--ui-scale)); opacity: 0.78; }
        .inline-edit-list { display: grid; gap: 6px; }
        .inline-edit-row-wrap { display: grid; gap: 4px; }
        .inline-edit-row { display: grid; grid-template-columns: minmax(62px, 88px) minmax(0, 1fr) auto auto; gap: 6px; align-items: center; }
        .inline-edit-cell { min-width: 0; }
        .inline-edit-cell.short { text-transform: none; }
        .inline-edit-cell.term { width: 100%; }
        .inline-row-btn { padding: 5px 7px; font-size: 10px; }
        .danger-row { color: #fff; }
        .light .danger-row { background: rgba(209,72,54,0.9); }
        .dark .danger-row { background: rgba(255,108,99,0.88); color: #1c0e0d; }
        .inline-edit-warning { font-size: calc(10px * var(--ui-scale)); font-weight: 700; }
        .light .inline-edit-warning { color: #8a3b23; }
        .dark .inline-edit-warning { color: #ffd2c8; }
        .inline-edit-row-wrap.hidden .inline-edit-cell,
        .inline-edit-row-wrap.deleted .inline-edit-cell { opacity: 0.68; }
        .inline-edit-row-wrap.warn .inline-edit-cell.warn { box-shadow: 0 0 0 2px rgba(255,174,0,0.18) inset; }
        .inline-add-row-btn { white-space: nowrap; }

        .content-shell {
          flex: 1 1 0;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          overflow: hidden;
        }

        .content-shell.with-help {
          grid-template-columns: minmax(0, 1fr) minmax(calc(240px * var(--ui-scale)), calc(300px * var(--ui-scale)));
        }

        .main-scroll {
          min-height: 0;
          overflow: auto;
          padding-right: 4px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-heading {
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.68;
          margin-bottom: 4px;
        }

        .section-block { display: flex; flex-direction: column; gap: 8px; }
        .accordion-list { display: flex; flex-direction: column; gap: 8px; }

        .accordion-item {
          border-radius: 8px;
          overflow: hidden;
        }

        .accordion-row {
          width: 100%;
          justify-content: space-between;
          padding: calc(6px * var(--ui-scale)) calc(8px * var(--ui-scale));
          background: var(--row-tint);
          border: 1px solid var(--row-border);
          color: inherit;
        }

        .accordion-row:hover { transform: translateY(-1px); }

        .accordion-label {
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          line-height: 1.15;
        }

        .accordion-hotkey-hint {
          margin-left: 6px;
          opacity: 0.78;
        }

        .accordion-arrow {
          color: var(--row-accent);
          font-size: calc(11px * var(--ui-scale));
          transition: transform 0.14s ease;
        }

        .accordion-item.open .accordion-arrow {
          transform: rotate(90deg);
        }

        .accordion-count {
          min-width: 22px;
          text-align: center;
          font-size: calc(9px * var(--ui-scale));
          font-weight: 800;
          border-radius: 5px;
          padding: calc(3px * var(--ui-scale)) calc(7px * var(--ui-scale));
        }

        .light .accordion-count {
          background: rgba(23,32,43,0.06);
          color: #203042;
        }

        .dark .accordion-count {
          background: rgba(255,255,255,0.08);
          color: #f7f8fb;
        }

        .accordion-panel {
          padding: 8px 0 2px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
          gap: 4px;
        }

        .term-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: calc(5px * var(--ui-scale)) calc(6px * var(--ui-scale));
          border-radius: 8px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--card-text);
          min-height: calc(44px * var(--ui-scale));
          box-shadow: 0 6px 16px rgba(10, 16, 26, 0.08);
          transition: transform 0.14s ease, box-shadow 0.14s ease, border-color 0.14s ease;
        }

        .term-card.clickable { cursor: pointer; }

        .term-card:hover,
        .term-card.active,
        .term-card.added,
        .variant-pill:hover,
        .variant-pill.active,
        .variant-pill.added {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(10, 16, 26, 0.14);
        }

        .card-top {
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .card-chip-row,
        .variant-pill-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .shortcut-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: calc(38px * var(--ui-scale));
          padding: calc(3px * var(--ui-scale)) calc(6px * var(--ui-scale));
          border-radius: 5px;
          background: var(--shortcut-bg);
          color: var(--shortcut-text);
          font-size: calc(10px * var(--ui-scale));
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .variant-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: calc(22px * var(--ui-scale));
          padding: calc(3px * var(--ui-scale)) calc(6px * var(--ui-scale));
          border-radius: 5px;
          border: 1px solid var(--card-border);
          background: color-mix(in srgb, var(--card-bg) 70%, var(--shortcut-bg) 30%);
          color: var(--card-text);
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          line-height: 1;
          cursor: pointer;
          transition: transform 0.14s ease, box-shadow 0.14s ease, border-color 0.14s ease;
        }

        .def-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.26;
          flex: 0 0 auto;
        }

        .term-label {
          font-size: calc(10px * var(--ui-scale));
          line-height: 1.18;
          font-weight: 700;
        }

        .help-pane {
          min-height: 0;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-left: 2px;
        }

        .help-title { font-size: calc(16px * var(--ui-scale)); font-weight: 800; margin-top: 3px; }
        .help-caption, .help-meta, .help-empty p, .drawer-copy, .empty-state p {
          font-size: calc(11px * var(--ui-scale));
          line-height: 1.45;
          opacity: 0.76;
        }

        .help-list { display: flex; flex-direction: column; gap: 8px; }

        .help-logic-block {
          border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid rgba(127,127,127,0.12);
        }

        .light .help-logic-block { background: rgba(23,32,43,0.03); }
        .dark .help-logic-block { background: rgba(255,255,255,0.04); }
        .help-logic-title {
          font-size: calc(12px * var(--ui-scale));
          font-weight: 800;
          margin-bottom: 6px;
        }
        .help-logic-list {
          margin: 0;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: calc(10px * var(--ui-scale));
          line-height: 1.42;
          opacity: 0.88;
        }
        .help-logic-list code {
          font-size: calc(10px * var(--ui-scale));
          font-weight: 700;
        }

.howto-menu-list,
.howto-workflow-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.howto-menu-row {
  display: grid;
  grid-template-columns: minmax(calc(68px * var(--ui-scale)), calc(88px * var(--ui-scale))) 1fr;
  gap: 8px;
  align-items: start;
}

.howto-menu-label,
.howto-card-title {
  font-size: calc(11px * var(--ui-scale));
  font-weight: 800;
}

.howto-menu-copy,
.howto-card-copy {
  font-size: calc(11px * var(--ui-scale));
  line-height: 1.42;
  opacity: 0.88;
  margin: 0;
}

.howto-card {
  border-radius: 10px;
  border: 1px solid rgba(127,127,127,0.12);
  padding: 9px 10px;
}

.light .howto-card { background: rgba(23, 32, 43, 0.04); }
.dark .howto-card { background: rgba(255,255,255,0.05); }

        .empty-state,
        .help-empty,
        .drawer-empty {
          border-radius: 8px;
          padding: 16px;
        }

        .light .empty-state,
        .light .help-empty,
        .light .drawer-empty {
          background: rgba(23, 32, 43, 0.04);
        }

        .dark .empty-state,
        .dark .help-empty,
        .dark .drawer-empty {
          background: rgba(255,255,255,0.05);
        }

        .empty-title { font-size: 16px; font-weight: 800; margin-bottom: 5px; }

        .drawer {
          position: relative;
          flex: 0 0 var(--drawer-width);
          width: var(--drawer-width);
          border-radius: 18px 0 0 18px;
          border: 1px solid rgba(127,127,127,0.12);
          box-shadow: -12px 20px 34px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          overflow: auto;
          z-index: 8;
          pointer-events: auto;
        }

        .dock-left .drawer {
          order: 3;
          border-radius: 0 18px 18px 0;
          box-shadow: 12px 20px 34px rgba(0,0,0,0.12);
        }

        .dock-bottom .drawer {
          order: 1;
          width: min(calc(100vw - 14px), var(--panel-width));
          flex: 0 0 var(--drawer-width);
          height: var(--drawer-width);
          border-radius: 18px 18px 0 0;
          box-shadow: 0 -12px 24px rgba(0,0,0,0.12);
        }

        .light .drawer { background: rgba(255,255,255,0.98); }
        .dark .drawer { background: rgba(20,24,32,0.97); }
        .drawer-title { font-size: 15px; font-weight: 800; margin-top: 2px; }
        .drawer-header { display:flex; align-items:start; justify-content:space-between; gap:8px; }
        .print-btn { width: 100%; border-radius: 10px; padding: 8px 10px; font-size: 12px; font-weight: 800; }
        .drawer-chip-list { display: flex; flex-wrap: wrap; gap: calc(5px * var(--ui-scale)); align-content: flex-start; }
        .drawer-chip { border-radius: 999px; padding: calc(5px * var(--ui-scale)) calc(9px * var(--ui-scale)); font-size: calc(10px * var(--ui-scale)); font-weight: 700; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 1; min-width: 0; }
        .drawer-chip.inactive { opacity: 0.52; }
        .drawer-add-row { display:grid; grid-template-columns: 1fr 40px; gap: 8px; }
        .drawer-add-btn { border-radius: 10px; font-size: 18px; font-weight: 800; }

        .editor-shell {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
          flex: 1;
        }
        .editor-toolbar,
        .editor-toolbar-actions,
        .editor-filters,
        .editor-stats,
        .editor-row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .editor-toolbar { justify-content: space-between; }
        .editor-title { font-size: 15px; font-weight: 800; margin-top: 3px; }
        .editor-summary-block { min-width: 0; }
        .editor-stats { font-size: 11px; }
        .editor-stat, .editor-message {
          padding: 4px 7px;
          border-radius: 999px;
          font-weight: 700;
        }
        .light .editor-stat, .light .editor-message { background: rgba(23,32,43,0.06); }
        .dark .editor-stat, .dark .editor-message { background: rgba(255,255,255,0.08); }
        .editor-message { color: #2a6b4b; }
        .editor-filters input,
        .editor-filters select {
          width: 100%;
          border-radius: 9px;
          border: 1px solid rgba(127,127,127,0.18);
          background: transparent;
          padding: 6px 7px;
          font-size: 11px;
          color: inherit;
        }
        .editor-cell {
          border-radius: 6px;
          border: 1px solid var(--panel-border);
          padding: calc(4px * var(--ui-scale)) calc(6px * var(--ui-scale));
          font-size: calc(10px * var(--ui-scale));
          font-weight: 500;
          color: inherit;
          background: transparent;
          width: 100%;
          min-width: 80px;
        }
        .editor-cell:focus { outline: none; border-color: rgba(109,140,255,0.50); box-shadow: 0 0 0 2px rgba(109,140,255,0.12); }
        .editor-filters select { min-width: 130px; }
        .editor-search { min-width: min(260px, 100%); }
        .editor-hint { font-size: 11px; opacity: 0.72; }
        .editor-table-wrap {
          flex: 1;
          min-height: 0;
          overflow: auto;
          border-radius: 8px;
          border: 1px solid rgba(127,127,127,0.16);
        }
        .editor-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .editor-table th,
        .editor-table td {
          padding: 6px;
          vertical-align: top;
          border-bottom: 1px solid rgba(127,127,127,0.12);
        }
        .editor-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          text-align: left;
          font-size: calc(10px * var(--ui-scale));
          text-transform: uppercase;
          letter-spacing: 0.06em;
          backdrop-filter: blur(14px);
        }
        .light .editor-table thead th { background: rgba(248,250,255,0.98); }
        .dark .editor-table thead th { background: rgba(15,19,28,0.98); }
        .editor-cell.slim { min-width: 72px; }
        .editor-cell.tiny { min-width: 54px; }
        .editor-cell.warn {
          border-color: rgba(220,38,38,0.50) !important;
        }
        .editor-table tr.is-hidden { opacity: 0.7; }
        .editor-table tr.is-deleted { opacity: 0.45; text-decoration: line-through; }
        .editor-table tr.has-warning td { background: rgba(208, 109, 55, 0.06); }

        .drawer-left {
          align-self: stretch;
        }

        .light .drawer-chip.active { background: #1f2c40; color: #fff; }
        .dark .drawer-chip.active { background: rgba(255,255,255,0.16); color: #fff; }

        .dock-bottom .panel-header,
        .dock-bottom .toolbar-row-search,
        .dock-bottom .toolbar-row-controls {
          flex-wrap: wrap;
        }

        .dock-bottom .tool-launchers {
          margin-left: auto;
        }

        @media (max-width: 980px) {
          .shell.dock-right.open, .shell.dock-left.open { width: min(calc(100vw - 10px), calc(var(--panel-width) + 30px)); }
          .shell.dock-bottom.open { width: min(calc(100vw - 10px), var(--panel-width)); }
          
          .help-pane {
            border-top: 1px solid rgba(127,127,127,0.16);
            padding-top: 10px;
          }
          .drawer { width: min(240px, 56vw); }
          .tool-section-grid.horizontal { grid-template-columns: 1fr; }
        }

        .corner-resizer {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 14px;
          height: 14px;
          cursor: nwse-resize;
          z-index: 9;
          display: none;
        }

        .corner-resizer::before {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 8px;
          height: 8px;
          border-right: 2px solid rgba(127,127,127,0.7);
          border-bottom: 2px solid rgba(127,127,127,0.7);
          border-radius: 0 0 3px 0;
        }

        .shell.dock-float {
          left: var(--float-x);
          top: var(--float-y);
          transform: none;
          width: 24px;
          min-height: 28px;
          align-items: stretch;
          flex-direction: row;
        }

        .shell.dock-float.open {
          width: min(calc(100vw - 20px), calc(var(--panel-width) + 30px));
        }

        .shell.dock-top {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 110px;
          height: 28px;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }

        .shell.dock-top.open,
        .shell.dock-bottom.open {
          width: calc(100vw - 14px);
        }

        .shell.dock-top.open {
          height: min(calc(100vh - 10px), calc(var(--panel-height) + var(--drawer-open) + 24px));
        }

        .dock-top .rail {
          order: 1;
          align-self: center;
          width: 110px;
          height: 28px;
          border-radius: 0 0 12px 12px;
          flex-direction: row;
          box-shadow: 0 8px 22px rgba(7, 12, 22, 0.18);
        }

        .dock-top.light .rail {
          border-top: none;
          border-right: 1px solid rgba(48, 65, 85, 0.12);
        }

        .dock-top.dark .rail {
          border-top: none;
          border-right: 1px solid rgba(255,255,255,0.10);
        }

        .dock-top .rail-mark { transform: none; }

        .dock-float .panel {
          order: 2;
          border-radius: 18px;
          height: var(--panel-height);
          flex: 0 0 var(--panel-width);
          width: var(--panel-width);
        }

        .dock-float .corner-resizer { display: block; }
        .dock-right .corner-resizer,
        .dock-left .corner-resizer,
        .dock-top .corner-resizer,
        .dock-bottom .corner-resizer { display: none; }

        .dock-float .panel-header { cursor: move; }
        .dock-float .panel-header button { cursor: pointer; }

        .dock-top .panel,
        .dock-bottom .panel {
          width: calc(100vw - 14px);
          max-width: calc(100vw - 14px);
        }

        .dock-top .panel {
          order: 2;
          flex: 0 0 var(--panel-height);
          height: var(--panel-height);
          border-radius: 0 0 18px 18px;
          padding: 10px 10px 8px;
          box-shadow: 0 18px 36px rgba(8, 12, 20, 0.22);
        }

        .dock-top .resizer {
          left: 0;
          right: 0;
          top: auto;
          bottom: 0;
          width: auto;
          height: 8px;
          cursor: ns-resize;
        }

        .dock-top .drawer,
        .dock-bottom .drawer {
          width: calc(100vw - 14px);
          max-width: calc(100vw - 14px);
        }

        .dock-top .drawer {
          order: 3;
          flex: 0 0 var(--drawer-width);
          height: var(--drawer-width);
          border-radius: 0 0 18px 18px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }

        .horizontal-control-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .horizontal-control-line {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2px;
        }

        .horizontal-control-line .mini-group,
        .horizontal-tools,
        .horizontal-search,
        .horizontal-nav .top-cat-btn,
        .horizontal-control-line .control-box {
          flex: 0 0 auto;
        }

        .horizontal-search {
          flex: 1 1 300px;
          min-width: 260px;
        }

        .horizontal-nav {
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2px;
        }

        .dock-horizontal .main-scroll {
          padding-right: 2px;
        }

        .dock-horizontal .panel-header {
          align-items: center;
        }

        .dock-horizontal .header-actions {
          flex-wrap: nowrap;
          overflow-x: auto;
        }

        .dock-horizontal .panel-title {
          font-size: 12px;
        }

        .dock-horizontal .eyebrow {
          font-size: 8px;
        }

        .controls-stack + .top-category-row,
        .horizontal-control-wrap + .content-shell {
          margin-top: 0;
        }

        .top-category-row {
          overflow-x: auto;
        }


        .search-only-view {
          display: grid;
          gap: 10px;
        }

        .search-only-category-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }

        .search-only-blocks {
          display: grid;
          gap: 10px;
        }

        .search-only-block {
          display: grid;
          gap: 8px;
        }

        .search-only-block-head {
          display: flex;
          justify-content: center;
        }

        .search-category-chip {
          border: 1px solid var(--panel-border);
          background: var(--chip-soft-bg, rgba(90,110,140,0.10));
          color: var(--text-main);
          border-radius: 6px;
          padding: calc(4px * var(--ui-scale)) calc(8px * var(--ui-scale));
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font: inherit;
          cursor: pointer;
          min-height: calc(24px * var(--ui-scale));
          max-width: 100%;
        }

        .search-category-chip.match {
          box-shadow: inset 0 0 0 1px var(--panel-border-strong);
        }

        .search-category-chip.active {
          background: var(--chip-soft-bg, rgba(31,44,64,0.92));
          color: var(--chip-soft-text, #fff);
          border-color: var(--chip-border, transparent);
        }

        .search-category-name {
          font-size: calc(10px * var(--ui-scale));
          font-weight: 700;
          line-height: 1;
        }

        .search-category-meta,
        .search-category-count {
          font-size: calc(9px * var(--ui-scale));
          line-height: 1;
        }

        .search-category-count {
          padding: 2px 5px;
          border-radius: 4px;
          background: var(--chip-badge-bg, rgba(31,44,64,0.08));
          color: var(--chip-badge-text, currentColor);
        }

        .search-category-meta { opacity: 0.72; }

        .search-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .search-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 7px;
          min-height: 0;
          width: auto;
          max-width: 100%;
        }

        .search-pill-main {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .search-pill-term {
          font-size: calc(10px * var(--ui-scale));
          font-weight: 600;
          line-height: 1.1;
          white-space: nowrap;
        }

        .inline-variants {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .search-only-controls .toolbar-row-search {
          margin-bottom: 0;
        }

        .search-only-row .search-row {
          flex: 1 1 auto;
        }

        .search-flat-grid {
          align-items: flex-start;
        }

        .dock-horizontal .accordion-list {
          gap: 5px;
        }

        .dock-horizontal .accordion-row {
          padding: 5px 7px;
        }

        .dock-horizontal .accordion-label {
          font-size: 9px;
          line-height: 1.1;
        }

        .dock-horizontal .accordion-count {
          min-width: 18px;
          padding: 2px 5px;
          font-size: 8px;
        }

        .dock-horizontal .cards-grid {
          grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
          gap: 4px;
        }

        .dock-horizontal .term-card {
          padding: 4px 5px;
          min-height: 40px;
          border-radius: 9px;
          gap: 4px;
        }

        .dock-horizontal .card-chip-row,
        .dock-horizontal .variant-pill-row {
          gap: 4px;
        }

        .dock-horizontal .shortcut-pill {
          min-width: 34px;
          padding: 2px 5px;
          font-size: 9px;
        }

        .dock-horizontal .variant-pill {
          min-width: 18px;
          padding: 2px 5px;
          font-size: 8px;
        }

        .dock-horizontal .term-label,
        .dock-horizontal .search-pill-term {
          font-size: 9px;
          line-height: 1.05;
        }

        .dock-horizontal .search-category-chip {
          padding: 3px 6px;
          gap: 4px;
          min-height: 20px;
        }

        .dock-horizontal .search-category-name {
          font-size: 9px;
        }

        .dock-horizontal .search-category-meta,
        .dock-horizontal .search-category-count {
          font-size: 8px;
        }

        .dock-horizontal .search-pill-grid {
          gap: 4px;
        }

        .dock-horizontal .search-pill {
          padding: 4px 6px;
          gap: 4px;
        }

        .dock-horizontal .top-category-row {
          gap: 4px;
        }

        .dock-horizontal .top-cat-btn {
          padding: 2px 5px;
          gap: 4px;
          font-size: 8.5px;
        }

        .dock-horizontal .top-cat-hotkey,
        .dock-horizontal .accordion-index {
          width: 14px;
          height: 14px;
          font-size: 8px;
        }

        .light {
          --chip-soft-bg: rgba(31,44,64,0.08);
          --chip-strong-bg: #1f2c40;
          --chip-strong-text: #fff;
          --panel-border: rgba(48,65,85,0.13);
          --panel-border-strong: rgba(48,65,85,0.22);
          --panel-bg: rgba(243,246,252,0.97);
          --text-primary: #163046;
          --text-secondary: #526174;
        }

        .dark {
          --chip-soft-bg: rgba(255,255,255,0.08);
          --chip-strong-bg: #edf2ff;
          --chip-strong-text: #111420;
          --panel-border: rgba(255,255,255,0.10);
          --panel-border-strong: rgba(255,255,255,0.18);
          --panel-bg: rgba(18,22,31,0.96);
          --text-primary: #eef2ff;
          --text-secondary: #94a3b8;
        }

        .session-window {
          position: fixed;
          z-index: 2147483648;
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          pointer-events: auto;
          overflow: clip;
          box-shadow: 0 18px 42px rgba(8, 12, 20, 0.26);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .light.session-window,
        .light .session-window {
          background: rgba(247, 249, 253, 0.78);
          border: 1px solid rgba(48, 65, 85, 0.14);
          color: #163046;
        }

        .dark.session-window,
        .dark .session-window {
          background: rgba(21, 26, 36, 0.76);
          border: 1px solid rgba(255,255,255,0.10);
          color: #eff6ff;
        }

        .session-window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px 8px;
          cursor: move;
          border-bottom: 1px solid rgba(109,140,255,0.18);
          touch-action: none;
        }

        .session-window-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .session-window-body {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 6px 0 4px;
        }

        .session-window-footer {
          padding: 4px 10px 8px;
          font-size: 10px;
          font-weight: 700;
          opacity: 0.65;
          color: inherit;
        }

        .session-window-resizer {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 22px;
          height: 22px;
          cursor: nwse-resize;
          touch-action: none;
        }

        .session-window-resizer::before {
          content: '';
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 9px;
          height: 9px;
          border-right: 2px solid rgba(109,140,255,0.65);
          border-bottom: 2px solid rgba(109,140,255,0.65);
        }

        /* ── Header left (Ins/Vib in header) ── */
        .panel-header { align-items: center; }
        .header-left { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }

        /* ── Write/Sentence green-only-when-active ── */
        .write-on { background: rgba(34,197,94,0.18) !important; color: #16a34a !important; border-color: rgba(34,197,94,0.35) !important; }
        .dark .write-on { background: rgba(34,197,94,0.20) !important; color: #4ade80 !important; border-color: rgba(74,222,132,0.30) !important; }
        .listen-on { background: rgba(239,68,68,0.16) !important; color: #dc2626 !important; border-color: rgba(239,68,68,0.32) !important; animation: listen-pulse 2s ease-in-out infinite; }
        .dark .listen-on { background: rgba(239,68,68,0.20) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.28) !important; }
        .listen-field { background: rgba(251,146,60,0.16) !important; color: #c2410c !important; border-color: rgba(251,146,60,0.32) !important; }
        .dark .listen-field { color: #fb923c !important; }
        @keyframes listen-pulse { 0%,100% { opacity:1; } 50% { opacity:0.65; } }
        .next-track-btn { border-color: rgba(109,140,255,0.28) !important; font-weight: 800; }

        /* ── Save & Exit button ── */
        .save-exit-btn { background: rgba(220,38,38,0.14) !important; color: #dc2626 !important; border-color: rgba(220,38,38,0.30) !important; }
        .dark .save-exit-btn { background: rgba(239,68,68,0.18) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.28) !important; }

        /* ── Session pill list ── */
        .session-window-header { padding: 7px 10px 6px; }
        .session-ctrl-btn { background: none; border: 1px solid rgba(109,140,255,0.22); border-radius: 6px; padding: 1px 7px; font-size: calc(9px * var(--ui-scale)); font-weight: 700; color: inherit; cursor: pointer; opacity: 0.82; }
        .session-ctrl-btn:hover { opacity: 1; }
        .session-close-btn { padding: 1px 6px; }
        .session-pill-main { display: inline-flex; align-items: center; gap: 4px; padding: 2px 5px 2px 4px; border-radius: 7px; border: 1px solid transparent; font: inherit; cursor: pointer; min-width: 0; max-width: 100%; }
        .light .session-pill-main { background: rgba(255,255,255,0.90); color: #163046; border-color: rgba(48,65,85,0.11); }
        .dark .session-pill-main { background: rgba(255,255,255,0.08); color: #eff6ff; border-color: rgba(255,255,255,0.09); }
        .session-pill-main:hover { box-shadow: 0 0 0 2px rgba(109,140,255,0.20); }
        .session-pill-short { font-size: calc(9px * var(--ui-scale)); font-weight: 700; padding: 1px 4px; border-radius: 999px; background: rgba(109,140,255,0.16); white-space: nowrap; flex-shrink: 0; }
        .session-pill-text { font-size: 11px; font-weight: 600; min-width: 0; white-space: normal; word-break: break-word; line-height: 1.3; }
        .session-pill-remove { flex-shrink: 0; background: none; border: none; padding: 1px 4px; font-size: 11px; font-weight: 700; opacity: 0.5; cursor: pointer; color: inherit; border-radius: 5px; }
        .session-pill-remove:hover { opacity: 1; background: rgba(220,38,38,0.12); }

        /* ── Tray compact pills ── */
        .tool-tray-head { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 6px; padding: 4px 6px; }
        .tool-tray-label { font-size: 10px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.75; flex-shrink: 0; cursor: move; }
        .tool-tray-head-actions { display: flex; flex-direction: row; align-items: center; gap: 4px; flex-wrap: nowrap; }
        .tray-ctrl-btn { background: none; border: 1px solid rgba(109,140,255,0.20); border-radius: 6px; padding: 1px 7px; font-size: 10px; font-weight: 700; color: inherit; cursor: pointer; opacity: 0.80; white-space: nowrap; }
        .tray-ctrl-btn:hover { opacity: 1; background: rgba(109,140,255,0.10); }
        .tray-pill-list { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 10px 6px; min-height: 32px; max-height: min(60vh, 420px); overflow-y: auto; }
        .tray-compact-pill { display: inline-flex; align-items: center; gap: 3px; border-radius: 7px; padding: 3px 4px 3px 8px; font-size: 10px; font-weight: 700; border: 1px solid transparent; cursor: pointer; user-select: none; transition: background 0.12s; }
        .tray-compact-pill.pill-active { background: rgba(34,197,94,0.18); color: #15803d; border-color: rgba(34,197,94,0.30); }
        .dark .tray-compact-pill.pill-active { background: rgba(34,197,94,0.22); color: #4ade80; border-color: rgba(74,222,132,0.28); }
        .tray-compact-pill.pill-inactive { background: rgba(109,140,255,0.09); border-color: rgba(109,140,255,0.16); }
        .light .tray-compact-pill.pill-inactive { color: #526174; }
        .dark .tray-compact-pill.pill-inactive { color: #94a3b8; }
        .tray-pill-text { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tray-pill-x { background: none; border: none; padding: 0 2px; font-size: 11px; font-weight: 900; cursor: pointer; color: inherit; opacity: 0.45; line-height: 1; border-radius: 4px; }
        .tray-pill-x:hover { opacity: 1; background: rgba(220,38,38,0.14); }
        .tray-empty-msg { font-size: 10px; opacity: 0.55; padding: 4px 2px; }

        /* ── Composer bar (clean row layout) ── */
        .composer-bar { padding: 6px 10px 8px; border-bottom: 1px solid rgba(109,140,255,0.14); }
        .composer-bar.composer-focused { border-bottom-color: rgba(109,140,255,0.32); }
        .composer-row { display: flex; gap: 6px; align-items: flex-start; }
        .composer-input { flex: 1 1 auto; min-width: 0; resize: none; border-radius: 8px; border: 1px solid rgba(109,140,255,0.22); padding: 5px 8px; font: inherit; font-size: 12px; line-height: 1.5; background: rgba(109,140,255,0.06); color: inherit; }
        .composer-input:focus { outline: none; border-color: rgba(109,140,255,0.50); background: rgba(109,140,255,0.10); }
        .composer-actions-col { display: flex; flex-direction: column; gap: 3px; flex-shrink: 0; }
        .composer-btn { border-radius: 7px; border: 1px solid rgba(109,140,255,0.22); padding: 2px 8px; font-size: 10px; font-weight: 700; cursor: pointer; background: none; color: inherit; white-space: nowrap; }
        .composer-btn:hover { background: rgba(109,140,255,0.10); }
        .composer-print { background: rgba(109,140,255,0.18) !important; border-color: rgba(109,140,255,0.35) !important; }
        .composer-btn:disabled { opacity: 0.35; cursor: default; }
        .composer-conn-on { background: rgba(109,140,255,0.18) !important; border-color: rgba(109,140,255,0.35) !important; }
        .conn-panel { margin-top: 6px; }
        .conn-pill-row { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 5px; }
        .conn-pill { border-radius: 6px; border: 1px solid rgba(109,140,255,0.20); background: rgba(109,140,255,0.08); padding: 2px 7px; font-size: 10px; font-weight: 600; cursor: pointer; color: inherit; }
        .conn-pill:hover { background: rgba(109,140,255,0.22); }

        /* ── Terms pills (larger variant of shared pill family) ── */
        .terms-pill-list { display: flex; flex-wrap: wrap; gap: 4px; }
        .terms-pill { display: inline-flex; align-items: center; gap: 4px; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.09); color: inherit; padding: 3px 9px 3px 7px; font: inherit; font-size: calc(10px * var(--ui-scale)); font-weight: 700; cursor: pointer; white-space: nowrap; user-select: none; }
        .terms-pill:hover { background: rgba(109,140,255,0.18); border-color: rgba(109,140,255,0.40); }
        .dark .terms-pill { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.14); }
        .dark .terms-pill:hover { background: rgba(255,255,255,0.15); }
        .terms-pill-num { font-size: calc(8px * var(--ui-scale)); font-weight: 400; opacity: 0.45; flex-shrink: 0; }
        .terms-pill-text { overflow: hidden; text-overflow: ellipsis; }

        /* ── Phrase pills — same family as conn-pill; qs-pill base handles sizing ── */
        /* .phrase-pill used as class="qs-pill phrase-pill"; no size override needed */

        /* ── QuickTag section header controls ── */
        .qs-header-spacer { flex: 1 1 auto; min-width: 0; }
        .qs-hk-hint { font-size: 10px; font-weight: 700; opacity: 0.38; flex-shrink: 0; letter-spacing: 0.01em; }
        .qs-order-btn { border-radius: 4px; border: 1px solid rgba(109,140,255,0.20); background: rgba(109,140,255,0.06); color: inherit; padding: 1px 6px; font: inherit; font-size: calc(9px * var(--ui-scale)); font-weight: 700; cursor: pointer; flex-shrink: 0; }
        .qs-order-btn:hover { background: rgba(109,140,255,0.14); }
        .qs-hide-btn { border-radius: 4px; border: 1px solid rgba(109,140,255,0.15); background: none; color: inherit; padding: 1px 5px; font: inherit; font-size: calc(9px * var(--ui-scale)); font-weight: 600; cursor: pointer; opacity: 0.55; flex-shrink: 0; }
        .qs-hide-btn:hover { opacity: 1; background: rgba(109,140,255,0.08); }

        .conn-edit-row { display: flex; gap: 5px; align-items: flex-start; }
        .conn-edit-area { flex: 1 1 auto; border-radius: 7px; border: 1px solid rgba(109,140,255,0.22); padding: 4px 7px; font: inherit; font-size: 10px; background: rgba(109,140,255,0.06); color: inherit; resize: vertical; min-height: 44px; }

        /* ── Inline definition bar in search toolbar ── */
        .inline-def-bar { display: flex; align-items: baseline; gap: 5px; padding: 4px 2px 0; font-size: 11px; line-height: 1.4; flex-wrap: wrap; }
        .inline-def-mark { font-size: 9px; font-weight: 900; opacity: 0.60; flex-shrink: 0; }
        .inline-def-title { font-weight: 700; opacity: 0.85; white-space: nowrap; }
        .inline-def-sep { opacity: 0.35; flex-shrink: 0; }
        .inline-def-body { opacity: 0.80; min-width: 0; }

        /* ── Confirm exit modal ── */
        .confirm-exit-overlay { position: absolute; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; background: rgba(10,14,26,0.52); border-radius: inherit; backdrop-filter: blur(2px); }
        .confirm-exit-modal { background: var(--color-background-primary, #fff); border-radius: 12px; padding: 20px 22px; min-width: 240px; max-width: 320px; box-shadow: 0 12px 36px rgba(8,12,20,0.30); border: 1px solid rgba(109,140,255,0.20); }
        .dark .confirm-exit-modal { background: #1a2030; }
        .confirm-exit-title { font-size: 14px; font-weight: 800; margin-bottom: 8px; color: inherit; }
        .confirm-exit-body { font-size: 12px; opacity: 0.75; margin-bottom: 16px; line-height: 1.5; color: inherit; }
        .confirm-exit-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .confirm-btn { border-radius: 8px; padding: 5px 14px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid transparent; }
        .confirm-cancel { background: rgba(109,140,255,0.10); border-color: rgba(109,140,255,0.20); color: inherit; }
        .confirm-cancel:hover { background: rgba(109,140,255,0.18); }
        .confirm-ok { background: rgba(220,38,38,0.15); border-color: rgba(220,38,38,0.30); color: #dc2626; }
        .dark .confirm-ok { color: #f87171; background: rgba(239,68,68,0.18); }
        .confirm-ok:hover { background: rgba(220,38,38,0.26); }

        /* ── Fix 1: Dark text in trays — explicit light/dark on tray itself ── */
        .tool-tray { color: #163046; }
        .tool-tray.dark { color: #eff6ff; }
        .tool-tray.dark .tray-ctrl-btn { color: #eff6ff; border-color: rgba(255,255,255,0.18); }
        .tool-tray.dark .tray-ctrl-btn:hover { background: rgba(255,255,255,0.10); }
        .tool-tray.dark .tray-compact-pill.pill-active { background: rgba(34,197,94,0.22); color: #4ade80; border-color: rgba(74,222,132,0.28); }
        .tool-tray.dark .tray-compact-pill.pill-inactive { background: rgba(255,255,255,0.09); color: #cbd5e1; border-color: rgba(255,255,255,0.12); }
        .tool-tray.dark .tray-pill-x { color: #eff6ff; }
        .tool-tray.dark .tray-empty-msg { color: #94a3b8; }
        .tool-tray.dark .tool-tray-label { color: #eff6ff; }
        .tool-tray.dark .drawer-input { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); color: #eff6ff; }
        .tool-tray.dark .drawer-add-btn { color: #eff6ff; background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.14); }
        .tool-tray.light .tray-ctrl-btn { color: #163046; }
        .tool-tray.light .tray-compact-pill.pill-active { background: rgba(34,197,94,0.16); color: #15803d; border-color: rgba(34,197,94,0.28); }
        .tool-tray.light .tray-compact-pill.pill-inactive { background: rgba(109,140,255,0.09); color: #526174; border-color: rgba(109,140,255,0.16); }
        .tool-tray.light .drawer-input { background: rgba(109,140,255,0.06); border-color: rgba(109,140,255,0.18); color: #163046; }
        .tool-tray.light .drawer-add-btn { color: #163046; background: rgba(109,140,255,0.10); border-color: rgba(109,140,255,0.20); }
        .tool-tray .tray-ctrl-btn { color: inherit; background: none; border: 1px solid rgba(109,140,255,0.20); border-radius: 6px; padding: 1px 7px; font-size: 10px; font-weight: 700; cursor: pointer; opacity: 0.85; white-space: nowrap; }
        .tool-tray .tray-ctrl-btn:hover { opacity: 1; background: rgba(109,140,255,0.12); }
        .tool-tray .tray-compact-pill { display: inline-flex; align-items: center; gap: 3px; border-radius: 7px; padding: 3px 4px 3px 8px; font-size: 10px; font-weight: 700; border: 1px solid transparent; cursor: pointer; user-select: none; }
        .tool-tray .tray-pill-x { background: none; border: none; padding: 0 2px; font-size: 11px; font-weight: 900; cursor: pointer; opacity: 0.45; line-height: 1; border-radius: 4px; }
        .tool-tray .tray-pill-x:hover { opacity: 1; background: rgba(220,38,38,0.14); }
        .tool-tray .tray-empty-msg { font-size: 10px; opacity: 0.55; padding: 4px 2px; }
        .tool-tray .tool-tray-label { font-size: 10px; font-weight: 900; letter-spacing: 0.10em; text-transform: uppercase; opacity: 0.75; }
        .tool-tray .drawer-input { border-radius: 7px; padding: 4px 8px; font: inherit; font-size: 11px; }
        .tool-tray .drawer-add-btn { border-radius: 7px; padding: 4px 9px; cursor: pointer; font-weight: 700; font: inherit; }

        /* ── Fix 2: Print always visible, green when active items exist ── */
        .tray-print-ready { background: rgba(34,197,94,0.20) !important; color: #15803d !important; border-color: rgba(34,197,94,0.35) !important; }
        .dark .tray-print-ready { background: rgba(34,197,94,0.24) !important; color: #4ade80 !important; border-color: rgba(74,222,132,0.30) !important; }

        /* ── Fix 6: Session pills wrap densely, text wraps, no enforced min-width ── */
        .session-pill-list { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px 4px; align-content: flex-start; }
        .session-pill { display: inline-flex; align-items: center; gap: 3px; max-width: 100%; }
        .session-pill-num { font-size: calc(8px * var(--ui-scale)); font-weight: 400; opacity: 0.45; min-width: 10px; text-align: right; flex-shrink: 0; }
        .session-pager { display: flex; align-items: center; gap: 6px; padding: 4px 8px 0; font-size: 10px; }
        .session-page-label { opacity: 0.65; font-weight: 700; }

        /* ── Fix 6/7: Float tray ── */
        .tool-tray.tray-floating { position: fixed; z-index: 2147483646; border-radius: 12px; }
        .tool-tray.tray-floating.light { background: var(--panel-bg); box-shadow: 0 14px 40px rgba(8,12,20,0.14); }
        .tool-tray.tray-floating.dark { background: var(--panel-bg); box-shadow: 0 14px 40px rgba(0,0,0,0.52); }
        .tray-float-handle { cursor: move; }

        /* ── Fix 7: Minimize bar ── */
        .session-window.minimized { height: auto !important; min-height: 0; }

        /* ── Session window title ── */
        .session-window-title { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: lowercase; opacity: 0.90; display: inline-flex; align-items: center; gap: 3px; }
        .myui-build-tag { font-size: 9px; font-weight: 400; opacity: 0.35; letter-spacing: 0.02em; margin-left: 5px; font-family: monospace; }
        .session-ctrl-btn-dev { opacity: 0.45; font-size: 11px; }

        /* ── Compose active dot ── */
        .session-compose-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.18); margin-right: 2px; vertical-align: middle; flex-shrink: 0; transition: background 0.3s; }
        .session-compose-dot--on { background: #6d8cff; box-shadow: 0 0 5px rgba(109,140,255,0.70); }

        /* ── HK armed button ── */
        .session-hk-btn { font-size: 10px; font-weight: 700; opacity: 0.50; transition: opacity 0.15s, background 0.15s; }
        .session-hk-btn--armed { opacity: 1 !important; background: rgba(34,197,94,0.22) !important; border-color: rgba(34,197,94,0.45) !important; color: #22c55e !important; box-shadow: 0 0 6px rgba(34,197,94,0.35); }
        .dark .session-hk-btn--armed { background: rgba(34,197,94,0.28) !important; color: #4ade80 !important; }

        /* ── Cycle buttons (< >) in top strip ── */
        .qs-cycle-btn { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; border: 1px solid rgba(109,140,255,0.25); background: rgba(109,140,255,0.07); color: inherit; font-size: calc(12px * var(--ui-scale)); font-weight: 700; cursor: pointer; padding: 0; flex-shrink: 0; line-height: 1; opacity: 0.80; }
        .qs-cycle-btn:hover { opacity: 1; background: rgba(109,140,255,0.16); border-color: rgba(109,140,255,0.45); }
        .qs-cycle-disabled { opacity: 0.25 !important; cursor: default; pointer-events: none; }
        .dark .qs-cycle-btn { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); }

        /* ── Move mode ── */
        .qs-terms-toolbar { display: flex; align-items: center; gap: 4px; padding: 2px 8px 4px; }
        .qs-move-btn { border-radius: 4px; border: 1px solid rgba(109,140,255,0.20); background: none; color: inherit; padding: 1px 7px; font: inherit; font-size: 10px; font-weight: 700; cursor: pointer; opacity: 0.55; flex-shrink: 0; }
        .qs-move-btn:hover { opacity: 1; background: rgba(109,140,255,0.10); }
        .qs-move-btn--active { opacity: 1; background: rgba(109,140,255,0.14) !important; border-color: rgba(109,140,255,0.45) !important; }
        .qs-move-active .qs-pill { cursor: pointer; }
        .qs-pill--move-idle { opacity: 0.65; }
        .qs-pill--move-selected { border-color: rgba(109,140,255,0.70) !important; background: rgba(109,140,255,0.18) !important; opacity: 1 !important; box-shadow: 0 0 0 2px rgba(109,140,255,0.25); }
        .qs-move-arrow { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 3px; border: 1px solid rgba(109,140,255,0.30); background: rgba(109,140,255,0.12); color: inherit; font-size: 12px; font-weight: 800; cursor: pointer; padding: 0; margin-left: 2px; flex-shrink: 0; line-height: 1; }
        .qs-move-arrow:hover { background: rgba(109,140,255,0.28); border-color: rgba(109,140,255,0.55); }

        /* ── Connect / Phrase pill text spans ── */
        .conn-pill-text { display: inline; }
        .phrase-pill-text { display: inline; }

        /* ── Connective pills: listen-detected variant ── */
        .conn-pill-listen { background: rgba(239,68,68,0.10) !important; border-color: rgba(239,68,68,0.24) !important; color: inherit; }
        .dark .conn-pill-listen { background: rgba(239,68,68,0.16) !important; border-color: rgba(248,113,113,0.24) !important; }
        .conn-pencil-btn { border-radius: 6px; border: 1px solid rgba(109,140,255,0.20); background: none; padding: 2px 7px; font-size: 12px; cursor: pointer; color: inherit; opacity: 0.70; }
        .conn-pencil-btn:hover { opacity: 1; background: rgba(109,140,255,0.10); }
        .conn-edit-btns { display: flex; gap: 4px; margin-top: 4px; }

        /* ── Session template bar ── */
        .session-template-bar { padding: 4px 8px 6px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(109,140,255,0.12); }
        .session-store-row { display: flex; gap: 4px; }
        .session-template-name { flex: 1 1 auto; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.06); color: inherit; padding: 2px 7px; font: inherit; font-size: 10px; }
        .session-template-name:focus { outline: none; border-color: rgba(109,140,255,0.44); }
        .session-template-select { border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.06); color: inherit; padding: 2px 7px; font: inherit; font-size: 10px; width: 100%; cursor: pointer; }
        .dark .session-template-select, .dark .session-template-name { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }

        /* ── Editor section blocks (templates + undefined) ── */
        .editor-section-block { margin-top: 20px; border-top: 1px solid rgba(109,140,255,0.14); padding-top: 12px; }
        .editor-section-heading { font-size: 12px; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .editor-section-count { font-size: 10px; font-weight: 600; opacity: 0.65; }
        .editor-section-body { font-size: 12px; }

        /* ── Template list ── */
        .template-list { display: flex; flex-direction: column; gap: 5px; }
        .template-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid rgba(109,140,255,0.08); }
        .template-name { flex: 1 1 auto; font-weight: 700; font-size: 11px; }
        .template-count { font-size: 10px; opacity: 0.55; flex-shrink: 0; }

        /* ── Undefined terms ── */
        .undefined-list { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
        .undefined-pill { display: inline-flex; align-items: center; gap: 3px; background: rgba(109,140,255,0.10); border: 1px solid rgba(109,140,255,0.20); border-radius: 6px; padding: 2px 6px 2px 8px; font-size: 10px; font-weight: 600; }
        .undefined-remove { background: none; border: none; padding: 0 2px; font-size: 11px; opacity: 0.45; cursor: pointer; color: inherit; }
        .undefined-remove:hover { opacity: 1; color: #dc2626; }

        /* ── AI prompt block ── */
        .ai-prompt-block { margin-top: 6px; border-radius: 8px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.06); padding: 8px 10px; font-size: 10px; line-height: 1.6; color: inherit; opacity: 0.85; white-space: pre-wrap; }

        /* ── Help pane header ── */
        .help-header { margin-bottom: 10px; }

        /* ── Undefined terms in Quick ── */
        .session-undef-btn { background: rgba(239,68,68,0.12) !important; color: #dc2626 !important; border-color: rgba(239,68,68,0.28) !important; font-weight: 800; }
        .session-undef-btn.active { background: rgba(239,68,68,0.22) !important; }
        .dark .session-undef-btn { color: #f87171 !important; background: rgba(239,68,68,0.18) !important; }
        .session-undef-panel { padding: 6px 8px; border-bottom: 1px solid rgba(109,140,255,0.14); background: rgba(239,68,68,0.05); }
        .session-undef-header { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px; }
        .session-undef-title { font-size: 10px; font-weight: 800; opacity: 0.75; }
        .session-undef-actions { display: flex; gap: 4px; }
        .session-undef-list { display: flex; flex-wrap: wrap; gap: 3px; max-height: 120px; overflow-y: auto; }
        .session-undef-pill { display: inline-flex; align-items: center; gap: 2px; background: rgba(239,68,68,0.10); border: 1px solid rgba(239,68,68,0.22); border-radius: 6px; padding: 2px 4px 2px 7px; font-size: 10px; color: inherit; }
        .session-undef-remove { background: none; border: none; padding: 0 3px; font-size: 11px; opacity: 0.45; cursor: pointer; color: inherit; }
        .session-undef-remove:hover { opacity: 1; color: #dc2626; }
        .session-undef-more { font-size: 9px; opacity: 0.55; padding: 3px; }

        /* ── Template list in Quick window ── */
        .session-template-list { display: flex; flex-direction: column; gap: 3px; margin-bottom: 4px; }
        .session-template-row { display: flex; align-items: center; gap: 4px; }
        .session-template-load { flex: 1 1 auto; text-align: left; display: flex; align-items: center; justify-content: space-between; }
        .session-template-del { flex-shrink: 0; background: rgba(220,38,38,0.10) !important; border-color: rgba(220,38,38,0.22) !important; color: #dc2626 !important; padding: 1px 6px !important; }
        .template-item-count { font-size: 9px; opacity: 0.60; font-weight: 400; }

        /* ── with-help grid restore ── */
        .content-shell.with-help { grid-template-columns: minmax(0,1fr) minmax(calc(220px * var(--ui-scale)), calc(280px * var(--ui-scale))); }

        /* ── Connector editor bar ── */
        .conn-editor-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 6px; padding-top: 5px; border-top: 1px solid rgba(109,140,255,0.12); }
        .conn-add-row { display: flex; align-items: center; gap: 4px; }
        .conn-add-input { border-radius: 6px; border: 1px solid rgba(109,140,255,0.28); background: rgba(109,140,255,0.08); color: inherit; padding: 2px 7px; font: inherit; font-size: 10px; width: 80px; }
        .conn-add-input:focus { outline: none; border-color: rgba(109,140,255,0.55); }
        .conn-action-btn { border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.08); color: inherit; padding: 2px 8px; font: inherit; font-size: 10px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .conn-action-btn:hover { background: rgba(109,140,255,0.18); }
        .conn-action-cancel { border-color: rgba(120,120,120,0.20); background: rgba(120,120,120,0.07); }
        .conn-action-reset { border-color: rgba(120,120,120,0.20); background: none; opacity: 0.55; }
        .conn-action-reset:hover { opacity: 1; }
        /* Delete button: armed = green, target selected = red */
        .conn-delete-armed { background: rgba(34,197,94,0.18) !important; border-color: rgba(34,197,94,0.40) !important; color: #16a34a !important; }
        .dark .conn-delete-armed { color: #4ade80 !important; }
        .conn-delete-ready { background: rgba(220,38,38,0.16) !important; border-color: rgba(220,38,38,0.40) !important; color: #dc2626 !important; }
        .dark .conn-delete-ready { color: #f87171 !important; }
        /* Pills in delete mode */
        .conn-pill-delete-mode { opacity: 0.55; cursor: pointer !important; }
        .conn-pill-delete-mode:hover { opacity: 1; border-color: rgba(220,38,38,0.40) !important; }
        .conn-pill-delete-target { background: rgba(220,38,38,0.16) !important; border-color: rgba(220,38,38,0.45) !important; color: #dc2626 !important; opacity: 1; }
        .dark .conn-pill-delete-target { color: #f87171 !important; }

        /* ── Confirm next track button ── */
        .confirm-next-ok { background: rgba(109,140,255,0.20) !important; color: #4a6ef5 !important; border-color: rgba(109,140,255,0.40) !important; }
        .dark .confirm-next-ok { color: #8ba4ff !important; }

        /* ── Quick window toolbar ── */
        .session-toolbar { display: flex; gap: 4px; padding: 4px 8px 0; flex-wrap: wrap; }
        .session-tool-btn { border-radius: 7px; border: 1px solid rgba(109,140,255,0.20); background: rgba(109,140,255,0.07); color: inherit; padding: 2px 9px; font: inherit; font-size: 10px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .session-tool-btn:hover { background: rgba(109,140,255,0.16); }
        .session-tool-btn.active { background: rgba(109,140,255,0.22) !important; border-color: rgba(109,140,255,0.45) !important; }
        .dark .session-tool-btn { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); }

        /* ── Quick connector mirror ── */
        .session-conn-panel { padding: 5px 8px 4px; border-bottom: 1px solid rgba(109,140,255,0.12); pointer-events: auto !important; }
        #bp-session-conn-panel { background: var(--bp-bg, #fff); border: 1px solid rgba(109,140,255,0.22); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        #bp-session-conn-panel.dark { background: #1a1b2e; }
        .session-conn-pills { display: flex; flex-wrap: wrap; gap: 4px; }
        .session-conn-pill { font-size: 10px; padding: 2px 8px; }
        .session-conn-hint { font-size: 9px; opacity: 0.45; margin-top: 3px; }

        /* ── Session active dot ── */
        .session-active-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.18); margin-right: 5px; vertical-align: middle; flex-shrink: 0; transition: background 0.3s; }
        .session-active-dot--on { background: #22c55e; box-shadow: 0 0 5px rgba(34,197,94,0.60); }

        /* ── Session Listen button in header ── */
        .session-listen-btn { font-weight: 800; }
        .session-listen-btn.listen-on { background: rgba(239,68,68,0.16) !important; color: #dc2626 !important; border-color: rgba(239,68,68,0.30) !important; }
        .dark .session-listen-btn.listen-on { color: #f87171 !important; }

        /* ── Session template selector ── */
        .session-template-selector { padding: 3px 8px 0; display: flex; gap: 4px; }
        .session-template-select { flex: 1 1 auto; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.06); color: inherit; padding: 2px 6px; font: inherit; font-size: 10px; cursor: pointer; }
        .dark .session-template-select { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }

        /* ── Section 2: Floating tray opacity ── */
        .light .tool-tray.tray-floating {
          background: rgba(245, 248, 253, 0.97) !important;
          border: 1.5px solid rgba(48,65,85,0.22) !important;
          box-shadow: 0 12px 36px rgba(8,12,20,0.28) !important;
        }
        .dark .tool-tray.tray-floating {
          background: rgba(18, 22, 34, 0.97) !important;
          border: 1.5px solid rgba(255,255,255,0.15) !important;
          box-shadow: 0 12px 36px rgba(0,0,0,0.50) !important;
        }

        /* ── Section 5d: Tray docked-active button ── */
        .tray-ctrl-btn.tray-docked-active {
          background: rgba(109,140,255,0.20) !important;
          border-color: rgba(109,140,255,0.45) !important;
        }

        /* ── Section 6c: Accordion / inline body overflow ── */
        .accordion-panel,
        .tool-inline-body { overflow: visible; }

        /* ── Section 7a: Dark mode session pill contrast ── */
        .dark .session-pill-main {
          background: rgba(255,255,255,0.09) !important;
          border-color: rgba(255,255,255,0.14) !important;
          color: #f0f2f8 !important;
        }
        .dark .session-pill-short {
          background: rgba(109,140,255,0.28) !important;
          color: #c8d4ff !important;
        }

        /* ── Section 7b: Session conn-panel box-sizing ── */
        .session-conn-panel { box-sizing: border-box; }

        /* ── Section 7c: Session window header contrast ── */
        .dark .session-window-header {
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .light .session-window-header {
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        /* ── Section 8a: Section chip (editor section selector) ── */
        .section-chip {
          border-radius: 8px;
          padding: calc(5px * var(--ui-scale)) calc(10px * var(--ui-scale));
          font-size: calc(10px * var(--ui-scale));
          font-weight: 800;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.14s, border-color 0.14s;
        }
        .light .section-chip { background: rgba(31,44,64,0.06); border-color: rgba(31,44,64,0.10); color: #1b2633; }
        .dark .section-chip { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.10); color: #f0f2f8; }
        .section-chip.active { background: rgba(109,140,255,0.20) !important; border-color: rgba(109,140,255,0.45) !important; }

        /* ── Section 8b: Subcat row (category selector in editor) ── */
        .subcat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 7px;
          padding: calc(4px * var(--ui-scale)) calc(8px * var(--ui-scale));
          font-size: calc(10px * var(--ui-scale));
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .light .subcat-row { background: rgba(31,44,64,0.05); color: #1b2633; }
        .dark .subcat-row { background: rgba(255,255,255,0.06); color: #f0f2f8; }
        .subcat-row.active { background: rgba(109,140,255,0.18) !important; border-color: rgba(109,140,255,0.40) !important; }

        /* ── Section 8d: Ghost-btn sizing override ── */
        .ghost-btn {
          border-radius: 6px;
          padding: calc(5px * var(--ui-scale)) calc(9px * var(--ui-scale));
          font-size: calc(9px * var(--ui-scale));
          font-weight: 800;
          white-space: nowrap;
          border: 1px solid var(--panel-border);
          cursor: pointer;
        }

        /* ── Section 10: Cursor move group ── */
        .rail-drag,
        .rail-toggle,
        .tool-tray-label,
        #bp-session-drag,
        #bp-session-conn-panel { cursor: move; }

        /* ── Change 1: Header mode/util buttons ── */
        .header-mode-btn { font-weight: 800; font-size: calc(9px * var(--ui-scale)); }
        .header-util-btn { font-size: calc(11px * var(--ui-scale)); padding: calc(4px * var(--ui-scale)) calc(6px * var(--ui-scale)); }
        .header-live-on { background: rgba(34,197,94,0.18) !important; color: #16a34a !important; border-color: rgba(34,197,94,0.35) !important; }
        .dark .header-live-on { color: #4ade80 !important; }
        .header-divider { width: 1px; height: 16px; background: rgba(109,140,255,0.20); margin: 0 2px; align-self: center; flex-shrink: 0; }
        .header-count { font-size: calc(8px * var(--ui-scale)); font-weight: 400; opacity: 0.75; margin-left: 2px; }

        /* ── Change 2: Search bar row ── */
        .search-bar-row { display: flex; align-items: center; gap: 5px; padding: calc(4px * var(--ui-scale)) calc(6px * var(--ui-scale)); }
        .search-bar-row .search-wrap { flex: 1 1 auto; min-width: 0; }
        .search-mode-btn { border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.07); color: inherit; padding: calc(3px * var(--ui-scale)) calc(7px * var(--ui-scale)); font: inherit; font-size: calc(9px * var(--ui-scale)); font-weight: 800; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .search-mode-btn.active { background: rgba(109,140,255,0.22) !important; border-color: rgba(109,140,255,0.45) !important; }

        /* ── Change 3: Controls row ── */
        .controls-row { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; padding: calc(3px * var(--ui-scale)) calc(6px * var(--ui-scale)); }

        /* ── Change 4: Hide hotkey letter on section chips ── */
        .top-cat-hotkey { display: none; }

        /* ── Quick-Tag sections (qs-*) ── */
        .qs-section { border-bottom: 1px solid rgba(109,140,255,0.10); }
        .qs-section:last-of-type { border-bottom: none; }
        .qs-header { display: flex; align-items: center; gap: 4px; padding: 4px 6px; cursor: pointer; user-select: none; min-height: 26px; }
        .qs-header:hover { background: rgba(109,140,255,0.06); }
        .dark .qs-header:hover { background: rgba(255,255,255,0.05); }
        .qs-pin { display: inline-flex; align-items: center; justify-content: center; align-self: center; box-sizing: border-box; background: none; border: none; padding: 0 4px; font: inherit; font-size: calc(10px * var(--ui-scale)); font-weight: 700; opacity: 0.30; cursor: pointer; color: inherit; line-height: 1; flex-shrink: 0; min-width: 18px; height: 18px; min-height: 18px; }
        .qs-pin:hover, .qs-pin-active { opacity: 1; }
        .qs-chevron { font-size: 9px; opacity: 0.50; flex-shrink: 0; width: 10px; }
        .qs-label { font-size: 10px; font-weight: 800; flex: 1 1 auto; letter-spacing: 0.04em; color: inherit; }
        .dark .qs-label { opacity: 0.92; }
        .qs-body { padding: 4px 8px 8px; }

        /* ── qs inline controls (in header) ── */
        .qs-input { border-radius: 5px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.07); color: inherit; padding: 2px 6px; font: inherit; font-size: 10px; width: 80px; min-width: 0; flex-shrink: 1; }
        .qs-input:focus { outline: none; border-color: rgba(109,140,255,0.50); }
        .dark .qs-input { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }
        .qs-add-btn, .qs-del-btn { display: inline-flex; align-items: center; justify-content: center; align-self: center; box-sizing: border-box; border-radius: 5px; border: 1px solid rgba(109,140,255,0.18); background: none; color: inherit; padding: 0; font: inherit; cursor: pointer; opacity: 0.55; flex-shrink: 0; width: 18px; height: 18px; min-height: 18px; }
        .qs-add-btn:hover, .qs-add-active { opacity: 1; background: rgba(109,140,255,0.12); }
        .qs-del-btn:hover { opacity: 1; background: rgba(220,38,38,0.10); border-color: rgba(220,38,38,0.28); color: #dc2626; }

        /* ── Compose section body ── */
        .qs-compose-shell { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; padding: 6px 7px 7px; border-radius: 8px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.05); }
        .dark .qs-compose-shell { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.10); }
        .qs-compose-shell-title { font-size: calc(10px * var(--ui-scale)); font-weight: 800; letter-spacing: 0.02em; opacity: 0.82; }
        .qs-compose-body { display: flex; flex-direction: column; gap: 5px; --qs-compose-font-size: calc(10px * var(--ui-scale)); }
        .qs-compose-helper { font-size: calc(9px * var(--ui-scale)); line-height: 1.35; opacity: 0.58; color: inherit; }
        .dark .qs-compose-helper { opacity: 0.68; }
        .qs-compose-preview { min-height: 30px; border-radius: 6px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.04); color: inherit; padding: 6px 8px; font: inherit; font-size: var(--qs-compose-font-size); line-height: 1.4; white-space: pre-wrap; word-break: break-word; }
        .qs-compose-preview-empty { opacity: 0.72; }
        .qs-compose-preview-placeholder { opacity: 0.55; }
        .qs-compose-area { width: 100%; box-sizing: border-box; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.05); color: inherit; padding: 5px 7px; font: inherit; font-size: var(--qs-compose-font-size); resize: vertical; }
        .qs-compose-area:focus { outline: none; border-color: rgba(109,140,255,0.50); }
        .dark .qs-compose-area { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
        .dark .qs-compose-preview { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.10); }
        .qs-compose-actions { display: flex; gap: 4px; flex-wrap: wrap; }
        .qs-print-btn { display: inline-flex; align-items: center; justify-content: center; align-self: center; box-sizing: border-box; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.08); color: inherit; padding: 2px 10px; font: inherit; font-size: var(--qs-compose-font-size); font-weight: 700; line-height: 1; cursor: pointer; height: 20px; min-height: 20px; }
        .qs-print-btn:disabled { opacity: 0.40; cursor: not-allowed; }
        .qs-print-ready { background: rgba(34,197,94,0.12) !important; border-color: rgba(34,197,94,0.30) !important; color: #16a34a !important; }
        .dark .qs-print-ready { color: #4ade80 !important; }
        .qs-print-no-field { background: rgba(220,38,38,0.10) !important; border-color: rgba(220,38,38,0.25) !important; color: #dc2626 !important; }
        .dark .qs-print-no-field { color: #f87171 !important; }
        .qs-save-chip-btn { display: inline-flex; align-items: center; justify-content: center; align-self: center; box-sizing: border-box; border-radius: 6px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.08); color: inherit; padding: 2px 9px; font: inherit; font-size: var(--qs-compose-font-size); font-weight: 700; line-height: 1; cursor: pointer; height: 20px; min-height: 20px; }
        .qs-save-chip-btn:disabled { opacity: 0.40; cursor: not-allowed; }
        .qs-clear-btn { display: inline-flex; align-items: center; justify-content: center; align-self: center; box-sizing: border-box; border-radius: 6px; border: 1px solid rgba(120,120,120,0.18); background: none; color: inherit; padding: 2px 9px; font: inherit; font-size: var(--qs-compose-font-size); font-weight: 700; line-height: 1; cursor: pointer; opacity: 0.60; height: 20px; min-height: 20px; }
        .qs-clear-btn:hover { opacity: 1; }

        /* ── Composer chips ── */
        .qs-chip-list { display: flex; flex-direction: column; gap: 3px; margin-top: 3px; }
        .qs-chip { display: flex; align-items: center; gap: 5px; border-radius: 6px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.06); color: inherit; padding: 3px 8px 3px 6px; font: inherit; font-size: var(--qs-compose-font-size); text-align: left; cursor: pointer; width: 100%; }
        .qs-chip:hover { background: rgba(109,140,255,0.14); }
        .qs-chip-active { background: rgba(109,140,255,0.20) !important; border-color: rgba(109,140,255,0.40) !important; }
        .qs-chip-num { font-size: 9px; font-weight: 800; opacity: 0.50; flex-shrink: 0; width: 14px; }
        .qs-chip-text { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ── Connect / Phrases / generic pill list ── */
        .qs-pill-list { display: flex; flex-wrap: wrap; gap: 4px; }
        .qs-pill { border-radius: 6px; border: 1px solid rgba(109,140,255,0.20); background: rgba(109,140,255,0.07); color: inherit; padding: 2px 8px; font: inherit; font-size: 10px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .qs-pill:hover { background: rgba(109,140,255,0.16); }
        .dark .qs-pill { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
        .dark .qs-pill:hover { background: rgba(255,255,255,0.14); }

        /* ── Generic item list (phrases, templates) ── */
        .qs-item-list { display: flex; flex-direction: column; gap: 3px; }
        .qs-item { display: flex; align-items: center; gap: 5px; }
        .qs-item-text { flex: 1 1 auto; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qs-item-load { flex: 1 1 auto; text-align: left; border-radius: 6px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.06); color: inherit; padding: 2px 8px; font: inherit; font-size: 10px; cursor: pointer; }
        .qs-item-load:hover { background: rgba(109,140,255,0.14); }
        .dark .qs-item-load { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.11); }
        .dark .qs-item-load:hover { background: rgba(255,255,255,0.13); }
        .qs-item-remove { flex-shrink: 0; background: none; border: none; padding: 0 4px; font-size: 11px; opacity: 0.40; cursor: pointer; color: inherit; }
        .qs-item-remove:hover { opacity: 1; color: #dc2626; }

        /* ── Terms section body ── */
        .qs-terms-body { display: flex; flex-direction: column; gap: 5px; }
        .qs-terms-footer { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; padding-top: 4px; border-top: 1px solid rgba(109,140,255,0.10); }
        .qs-pagination { display: flex; align-items: center; gap: 5px; justify-content: center; padding: 3px 0; }
        .qs-page-btn { border-radius: 5px; border: 1px solid rgba(109,140,255,0.20); background: rgba(109,140,255,0.07); color: inherit; padding: 1px 8px; font: inherit; font-size: 11px; cursor: pointer; }
        .qs-page-btn:disabled { opacity: 0.30; cursor: not-allowed; }
        .qs-page-label { font-size: 10px; opacity: 0.60; }

        /* ── Empty state ── */
        .qs-empty { font-size: 10px; opacity: 0.50; padding: 4px 2px; }

        /* ── Temp terms bar ── */
        .temp-terms-toggle-btn { position: relative; }
        .temp-terms-count { display: inline-block; background: rgba(109,140,255,0.30); border-radius: 999px; padding: 0 4px; font-size: calc(8px * var(--ui-scale)); font-weight: 800; margin-left: 3px; vertical-align: middle; }
        .temp-terms-bar { padding: 0 calc(6px * var(--ui-scale)); overflow: hidden; }
        .temp-terms-open { padding-bottom: calc(6px * var(--ui-scale)); }
        .temp-terms-add-row { display: flex; align-items: center; gap: 4px; padding: 4px 0 3px; }
        .temp-terms-input { flex: 1 1 auto; border-radius: 5px; border: 1px solid rgba(109,140,255,0.22); background: rgba(109,140,255,0.06); color: inherit; padding: calc(3px * var(--ui-scale)) calc(6px * var(--ui-scale)); font: inherit; font-size: calc(9px * var(--ui-scale)); min-width: 0; }
        .temp-terms-input:focus { outline: none; border-color: rgba(109,140,255,0.50); }
        .dark .temp-terms-input { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }
        .temp-terms-pending { font-size: calc(9px * var(--ui-scale)); font-weight: 700; opacity: 0.75; flex-shrink: 0; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .temp-terms-edit-btn { background: none; border: 1px solid rgba(109,140,255,0.18); border-radius: 4px; padding: 1px 5px; font-size: 11px; cursor: pointer; color: inherit; opacity: 0.45; flex-shrink: 0; }
        .temp-terms-edit-btn:hover { opacity: 0.80; }
        .temp-terms-edit-btn.active { opacity: 1; color: #6d8cff; border-color: rgba(109,140,255,0.45); }
        .temp-terms-pill-list { display: flex; flex-wrap: wrap; gap: 4px; padding: 3px 0 4px; }
        .temp-terms-pill { display: inline-flex; align-items: center; gap: 3px; border-radius: 6px; border: 1px solid rgba(109,140,255,0.18); background: rgba(109,140,255,0.07); color: inherit; padding: 2px 5px 2px 7px; font-size: calc(9px * var(--ui-scale)); transition: background 0.15s, border-color 0.15s; }
        .dark .temp-terms-pill { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }
        .temp-terms-shortcut { font-size: calc(8px * var(--ui-scale)); font-weight: 700; background: rgba(109,140,255,0.16); border-radius: 999px; padding: 0 4px; flex-shrink: 0; }
        .temp-terms-text { font-size: calc(9px * var(--ui-scale)); }
        .temp-terms-remove, .temp-terms-edit-pill-btn { background: none; border: none; padding: 0 2px; font-size: 10px; opacity: 0.40; cursor: pointer; color: inherit; border-radius: 3px; }
        .temp-terms-remove:hover, .temp-terms-edit-pill-btn:hover { opacity: 1; }
        .temp-terms-pill-editing { background: rgba(109,140,255,0.12) !important; border-color: rgba(109,140,255,0.40) !important; flex-wrap: wrap; gap: 4px; }
        .temp-terms-edit-input { border-radius: 4px; border: 1px solid rgba(109,140,255,0.30); background: transparent; color: inherit; padding: 1px 5px; font: inherit; font-size: calc(9px * var(--ui-scale)); width: 100px; }
        .temp-terms-edit-shortcut { border-radius: 4px; border: 1px solid rgba(109,140,255,0.30); background: transparent; color: inherit; padding: 1px 5px; font: inherit; font-size: calc(9px * var(--ui-scale)); width: 50px; }
        .temp-terms-edit-input:focus, .temp-terms-edit-shortcut:focus { outline: none; border-color: rgba(109,140,255,0.55); }
        .temp-terms-export-row { display: flex; align-items: center; justify-content: space-between; padding: 3px 0 0; gap: 8px; }
        .temp-terms-export-hint { font-size: calc(9px * var(--ui-scale)); opacity: 0.50; flex: 1 1 auto; }
        .temp-terms-export-btn { border-radius: 6px; border: 1px solid rgba(109,140,255,0.25); background: rgba(109,140,255,0.10); color: inherit; padding: 2px 9px; font: inherit; font-size: calc(9px * var(--ui-scale)); font-weight: 800; cursor: pointer; flex-shrink: 0; white-space: nowrap; }
        .temp-terms-export-btn:hover { background: rgba(109,140,255,0.20); }

        /* ── Delete mode states ── */
        .qs-del-armed { background: rgba(34,197,94,0.12) !important; border-color: rgba(34,197,94,0.35) !important; color: #16a34a !important; opacity: 1; }
        .dark .qs-del-armed { color: #4ade80 !important; }
        .qs-del-green { background: rgba(34,197,94,0.22) !important; border-color: rgba(34,197,94,0.55) !important; color: #16a34a !important; opacity: 1; }
        .dark .qs-del-green { color: #4ade80 !important; }
        .qs-delete-active .qs-pill,
        .qs-delete-active .qs-item-load { opacity: 0.55; cursor: pointer !important; }
        .qs-delete-active .qs-pill:hover,
        .qs-delete-active .qs-item-load:hover { opacity: 0.80; }
        .qs-pill-deletable { opacity: 0.55 !important; }
        .qs-pill-deletable:hover { opacity: 0.80 !important; border-color: rgba(220,38,38,0.30) !important; }
        .qs-pill-targeted .qs-item-load,
        .qs-pill-targeted { background: rgba(220,38,38,0.14) !important; border-color: rgba(220,38,38,0.40) !important; color: #dc2626 !important; opacity: 1 !important; }
        .dark .qs-pill-targeted .qs-item-load,
        .dark .qs-pill-targeted { color: #f87171 !important; }

        /* ── Editor global bar ── */
        .editor-global-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; padding: 6px 0 10px; border-bottom: 1px solid rgba(109,140,255,0.14); margin-bottom: 10px; }
        .editor-global-stats { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .editor-global-actions { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

        /* ── Editor collapsible sections ── */
        .editor-collapsible-section { border: 1px solid rgba(109,140,255,0.14); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
        .editor-section-header { display: flex; align-items: center; gap: 7px; padding: 7px 10px; cursor: pointer; user-select: none; background: rgba(109,140,255,0.04); }
        .editor-section-header:hover { background: rgba(109,140,255,0.09); }
        .dark .editor-section-header { background: rgba(255,255,255,0.04); }
        .dark .editor-section-header:hover { background: rgba(255,255,255,0.08); }
        .editor-section-label { font-size: 11px; font-weight: 800; flex: 1 1 auto; }
        .editor-section-alert { font-size: 10px; font-weight: 700; color: #dc2626; }
        .dark .editor-section-alert { color: #f87171; }
        .editor-section-badge { font-size: 9px; font-weight: 700; background: rgba(109,140,255,0.15); border: 1px solid rgba(109,140,255,0.25); border-radius: 10px; padding: 1px 6px; }
        .editor-section-chevron { font-size: 9px; opacity: 0.55; flex-shrink: 0; }
        .editor-section-body { padding: 8px 10px; }

        /* ── Editor subsections ── */
        .editor-subsection { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(109,140,255,0.08); }
        .editor-subsection:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .editor-subsection-title { font-size: 10px; font-weight: 800; opacity: 0.60; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .editor-subsection-actions { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 7px; }

        /* ── Import terms textarea ── */
        .input-terms-area { display: flex; flex-direction: column; gap: 5px; margin-top: 6px; }
        .input-terms-textarea { width: 100%; box-sizing: border-box; border-radius: 7px; border: 1px solid rgba(109,140,255,0.25); background: rgba(109,140,255,0.05); color: inherit; padding: 6px 8px; font: inherit; font-size: 10px; font-family: monospace; resize: vertical; }
        .input-terms-textarea:focus { outline: none; border-color: rgba(109,140,255,0.50); }
        .dark .input-terms-textarea { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }
        .input-terms-status { font-size: 10px; font-weight: 600; padding: 3px 0; }
        .input-terms-status.valid { color: #16a34a; }
        .dark .input-terms-status.valid { color: #4ade80; }
        .input-terms-status.invalid { color: #dc2626; }
        .dark .input-terms-status.invalid { color: #f87171; }
        .input-terms-actions { display: flex; gap: 5px; align-items: center; }
        .input-save-valid { background: rgba(34,197,94,0.12) !important; border-color: rgba(34,197,94,0.30) !important; color: #16a34a !important; }
        .dark .input-save-valid { color: #4ade80 !important; }
        .input-save-invalid { opacity: 0.40; cursor: not-allowed !important; }

        /* ── Import warnings ── */
        .import-warnings { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 3px 0; }
        .import-warn-label { font-size: 9px; font-weight: 700; opacity: 0.65; }
        .import-status-ok { color: #16a34a; font-size: 10px; font-weight: 600; }
        .dark .import-status-ok { color: #4ade80; }
        .import-status-error { color: #dc2626; font-size: 10px; font-weight: 600; }
        .dark .import-status-error { color: #f87171; }

        /* ── Terms view-cycle button ── */
        .qs-view-btn { border-radius: 5px; border: 1px solid rgba(109,140,255,0.20);
          background: rgba(109,140,255,0.07); color: inherit; padding: 1px 6px;
          font: inherit; font-size: calc(8px * var(--ui-scale)); font-weight: 800;
          cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .qs-view-btn:hover { background: rgba(109,140,255,0.14); }

        /* ── Cat view ── */
        .qs-cat-group { border-bottom: 1px solid rgba(109,140,255,0.08); }
        .qs-cat-group:last-child { border-bottom: none; }
        .qs-cat-header { display: flex; align-items: center; gap: 4px; padding: 4px 6px; cursor: pointer; user-select: none; }
        .qs-cat-header:hover { background: rgba(109,140,255,0.05); }
        .dark .qs-cat-header:hover { background: rgba(255,255,255,0.04); }
        .qs-cat-pin { background: none; border: none; font-size: 10px; opacity: 0.25; cursor: pointer; padding: 0; flex-shrink: 0; }
        .qs-cat-pin.qs-pin-active { opacity: 1; }
        .qs-cat-chevron { font-size: 8px; opacity: 0.45; flex-shrink: 0; }
        .qs-cat-label { flex: 1 1 auto; font-size: calc(10px * var(--ui-scale)); font-weight: 800; }
        .qs-cat-count { font-size: calc(8px * var(--ui-scale)); opacity: 0.45; flex-shrink: 0; }
        .qs-cat-hotkey { font-size: calc(8px * var(--ui-scale)); font-weight: 400; opacity: 0.35; margin-left: 2px; flex-shrink: 0; }
        .qs-cat-body { padding: 2px 6px 6px; display: flex; flex-direction: column; gap: 2px; }
        .qs-cat-overflow { font-size: calc(8px * var(--ui-scale)); opacity: 0.40; padding: 2px 4px; }

        /* ── Feature 4: top-strip ── */
        .qs-top-strip { display: flex; align-items: center; gap: 2px; flex-wrap: nowrap; overflow: hidden; flex: 1 1 0; min-width: 0; }
        .qs-strip-pill { display: inline-flex; align-items: center; gap: 2px; padding: 1px 5px;
          border-radius: 4px; border: 1px solid var(--panel-border); background: var(--panel-bg);
          font: inherit; font-size: calc(8.5px * var(--ui-scale)); cursor: pointer;
          white-space: nowrap; overflow: hidden; max-width: 80px; flex-shrink: 0; }
        .qs-strip-pill:hover { border-color: rgba(109,140,255,0.45); background: rgba(109,140,255,0.10); }
        .qs-strip-armed { border-color: rgba(249,115,22,0.60) !important; background: rgba(249,115,22,0.12) !important; }
        .qs-strip-hk { font-weight: 800; opacity: 0.55; flex-shrink: 0; font-size: calc(8px * var(--ui-scale)); }
        .qs-strip-text { overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
        .qs-strip-more { padding: 1px 5px; border-radius: 4px; border: 1px solid var(--panel-border);
          background: none; font: inherit; font-size: calc(8px * var(--ui-scale)); opacity: 0.50;
          cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .qs-strip-more:hover { opacity: 1; background: rgba(109,140,255,0.10); }
        .dark .qs-strip-pill { border-color: rgba(255,255,255,0.12); }
        .dark .qs-strip-pill:hover { border-color: rgba(109,140,255,0.50); }

        /* ── Feature 5: preview tray ── */
        .qs-preview-tray { display: flex; flex-wrap: wrap; gap: 4px; padding: 5px 6px 4px;
          border-bottom: 1px solid var(--panel-border); min-height: 28px; align-items: center; }
        .qs-preview-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px;
          border-radius: 5px; border: 1px solid var(--panel-border); background: var(--chip-soft-bg);
          font: inherit; font-size: var(--qs-compose-font-size); cursor: pointer;
          user-select: none; white-space: nowrap; }
        .qs-preview-pill:hover { border-color: rgba(109,140,255,0.45); }
        .qs-preview-selected { border-color: rgba(109,140,255,0.70) !important; background: rgba(109,140,255,0.14) !important; }
        .qs-preview-dragging { opacity: 0.40; }
        .qs-preview-text-pill { font-style: italic; opacity: 0.70; background: none; border-style: dashed; }
        .qs-preview-conn-pill { color: #6d8cff; background: rgba(109,140,255,0.09); border-color: rgba(109,140,255,0.28); }
        .dark .qs-preview-conn-pill { color: #93a8ff; }
        .qs-preview-pill-text { pointer-events: none; }
        .qs-pill-move-btn { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(109,140,255,0.10); border: 1px solid rgba(109,140,255,0.18); border-radius: 4px; padding: 0; cursor: pointer;
          font-size: calc(8px * var(--ui-scale)); font-weight: 800; opacity: 0.9; line-height: 1; color: #4f67d8; }
        .qs-pill-move-btn:hover { opacity: 1; background: rgba(109,140,255,0.18); border-color: rgba(109,140,255,0.34); }
        .dark .qs-pill-move-btn { color: #c9d3ff; background: rgba(109,140,255,0.18); border-color: rgba(109,140,255,0.28); }
        .qs-preview-delete { background: none; border: none; font-size: calc(12px * var(--ui-scale));
          opacity: 0.35; cursor: pointer; padding: 0 3px; line-height: 1; flex-shrink: 0; margin-left: auto; }
        .qs-preview-delete:hover { opacity: 0.85; }
        .dark .qs-preview-pill { border-color: rgba(255,255,255,0.14); }
        .dark .qs-preview-selected { border-color: rgba(109,140,255,0.65) !important; }

        .qs-chip-row { display: flex; align-items: center; gap: 2px; }
        .qs-chip-del { background: none; border: none; padding: 0 4px; font-size: 12px; opacity: 0.30; cursor: pointer; color: inherit; border-radius: 3px; line-height: 1; }
        .qs-chip-del:hover { opacity: 1; color: #dc2626; }

        /* ── Undefined pill — free text awaiting classification ── */
        .qs-preview-undefined-pill { font-style: italic; border-style: dashed; background: rgba(250,204,21,0.08); border-color: rgba(250,204,21,0.32); }
        .dark .qs-preview-undefined-pill { background: rgba(250,204,21,0.11); border-color: rgba(250,204,21,0.35); }

      </style>
    `;
  }

  init();
})();
} // end __myui_content_loaded guard
