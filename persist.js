if (!globalThis.__myui_persist_loaded) {
globalThis.__myui_persist_loaded = true;
globalThis.__MYUI_createPersistModule = function createPersistModule(deps) {
  const {
    state, clamp, clampFloatPosition, clampSessionPosition,
    STORAGE_KEY, LEGACY_STORAGE_KEYS, PAGE_STORAGE_KEY, MYUI_BUILD,
    PANEL_MIN_WIDTH, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MAX_HEIGHT,
  } = deps;

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
      composerSlotMode: state.composerSlotMode,
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
    if (typeof prefs.fullSentenceMode === "boolean") state.fullSentenceMode = prefs.fullSentenceMode;
    if (typeof prefs.composerSlotMode === "boolean") state.composerSlotMode = prefs.composerSlotMode;
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

  return { buildPrefsSnapshot, readPageStorage, applyPrefs, loadPrefs, savePrefs };
};
}
