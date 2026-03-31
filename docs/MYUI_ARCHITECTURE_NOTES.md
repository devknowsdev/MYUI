# MYUI Architecture Notes

## Current shape
MYUI is a Manifest V3 Chrome/Chromium extension with a small root surface and one very large application file.

Core files:
- `manifest.json` - extension wiring, permissions, and exposed resources
- `background.js` - toolbar click handling, whitelist lookup, tab injection, and toggle dispatch
- `content.js` - main application logic and UI
- `build_terms_data.py` - term-data generation helper
- `terms_data.js` - generated term catalog bundle
- `defs_data.js` - definition bundle

## Main architectural reality
The codebase is currently organized around a monolithic `content.js` file. That file appears to hold:
- state store
- render system
- Shadow DOM UI
- hotkeys
- editor logic
- composer logic
- tool trays
- persistence
- help and definitions

This means most behavioral changes have a wide blast radius.

## Main risks
### 1. Monolith risk
`content.js` is the dominant maintainability risk. It combines state management, rendering, event wiring, persistence, and feature logic in one place. Full rerenders and large click handlers increase regression risk.

### 2. State ownership risk
Preferences and runtime state appear to be split across extension storage, generated data, and runtime overrides. This makes it hard to predict what should persist and what should be canonical.

### 3. Host-page coupling risk
The extension currently has signs of being too coupled to host-page state. That is a correctness and safety problem because page code should not be able to easily influence extension behavior.

### 4. Data pipeline ambiguity
The term-data pipeline is not yet clearly defined as one source of truth. Generated JS, builder logic, and runtime edits all appear to participate.

## Architectural principles for future changes
- Prefer small focused PRs over structural rewrites
- Fix correctness and state-flow issues before attempting major file splits
- Keep storage responsibilities explicit
- Minimize host-page coupling
- Move toward one canonical data pipeline
- Add lightweight docs and smoke checks before deeper refactors

## Recommended sequence
### First
Correctness fixes with low blast radius:
- broken quick-hotkey path
- viewport sizing bug

### Second
Shared state-flow cleanup:
- unify term collection
- remove double-add paths
- make Quick/trays/connectives mutation logic more consistent

### Third
Persistence cleanup:
- define exactly what persists
- restore exactly what is saved
- avoid unintended dependence on page `localStorage`

### Fourth
Data ownership cleanup:
- choose one source of truth
- make regeneration repeatable
- document the release path

### Fifth
Low-risk cleanup:
- remove dead state
- remove no-op helpers
- improve repo-level docs

## Boundary model to move toward
Target direction, without a full rewrite yet:

- **extension shell**
  - manifest
  - background toggle/injection behavior
- **runtime state layer**
  - current user/session state
  - persistence adapter
- **data layer**
  - canonical term/definition source
  - generated artifacts
- **UI layer**
  - render helpers
  - event binding
  - focused feature sections such as Quick, editor, composer

This can be done gradually by extracting responsibilities only when a focused PR naturally touches them.

## Notes for reviewers
When reviewing PRs, prefer these questions:
- Did this change widen or reduce coupling?
- Did it clarify state ownership?
- Did it create duplicate logic?
- Did it preserve existing behavior where intended?
- Is the blast radius proportional to the goal?
