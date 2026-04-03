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

  function isMyuiShadowNode(node) {
    return !!node && node.getRootNode?.() === shadow;
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

    state.composerPendingPillMeta = { sec: term.sec || null, cat: term.cat || null };
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
      const pillMeta = state.composerPendingPillMeta || {};
      state.composerPendingPillMeta = null;
      const newPill = { id: state.composerPillCounter, type, text: insertText, sec: pillMeta.sec || null, cat: pillMeta.cat || null };
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
    const myuiEditableTarget = isEditableNode(target) && isMyuiShadowNode(target) &&
      target?.id !== "bp-search" && target?.id !== "bp-composer-text";
    const myuiEditableActive = isEditableNode(activeShadowEl) && isMyuiShadowNode(activeShadowEl) &&
      activeShadowEl?.id !== "bp-search" && activeShadowEl?.id !== "bp-composer-text";
    if (composerKeyActive && (
      rawKey.length === 1 ||
      rawKey === "Backspace" || rawKey === "ArrowLeft" || rawKey === "ArrowRight" ||
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

    Promise.all([loadPrefs(), loadMasterRows(), loadStyles()]).finally(() => {
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
        state.panelHeight = clamp(state.panelHeight, PANEL_MIN_HEIGHT, Math.min(window.innerHeight - 20, PANEL_MAX_HEIGHT));
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
    state.composerPendingPillMeta = null;
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

  // ── Persistence module (loaded from persist.js via globalThis) ──
  const { buildPrefsSnapshot, readPageStorage, applyPrefs, loadPrefs, savePrefs } = globalThis.__MYUI_createPersistModule({
    state, clamp, clampFloatPosition, clampSessionPosition,
    STORAGE_KEY, LEGACY_STORAGE_KEYS, PAGE_STORAGE_KEY, MYUI_BUILD,
    PANEL_MIN_WIDTH, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MAX_HEIGHT,
  });

  async function loadStyles() {
    try {
      const url = chrome.runtime.getURL("styles.css");
      const response = await fetch(url);
      const css = await response.text();
      if (styleNode) styleNode.textContent = css;
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
    const norm = normalize(text);
    const isDupe = state.undefinedTerms.some((u, i) => i !== idx && normalize(undefinedTermText(u)) === norm);
    if (!isDupe) {
      state.undefinedTerms = state.undefinedTerms.map((u, i) => i === idx ? entry : u);
    }
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
  const createRenderModule = globalThis.__MYUI_createRenderModule;

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
    setToolTrayOpen, setToolTrayExpanded, toggleToolTray, ensureToolTrayOpen,
    undoToolHistory,
    // — persist —
    savePrefs, saveMasterRows, restoreDefaultMasterRows,
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
    handleTermActivation, flashTermByKey, insertIntoField, routeInsert,
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
