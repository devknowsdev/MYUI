# MYUI Current PR Notes

Use this file as the working note for the active PR.

## Current PR
- Branch: `fix/quick-hotkeys-viewport`
- Goal: restore broken quick-hotkey behavior and fix viewport sizing
- Status: in progress

## Why this PR exists
This PR addresses the smallest high-value correctness issues first:
- the quick-hotkey path currently references missing helper functions
- the panel height clamp appears to use the wrong viewport dimension

## Intended scope
Keep this PR intentionally small.

In scope:
- inspect missing quick-hotkey helper call sites
- choose the smallest correct fix:
  - implement the missing behavior using existing in-repo patterns, or
  - remove/replace dead references if they are not valid anymore
- fix the panel height clamp to use the correct height dimension
- keep behavior changes limited to the affected feature paths

Out of scope:
- persistence cleanup
- data-pipeline cleanup
- broad render refactors
- splitting `content.js`
- general dead-code cleanup unless directly required for the fix

## Expected files
Likely changed:
- `content.js`

Unlikely to change:
- `background.js`
- `manifest.json`
- data files

## Risks
- changing keyboard behavior users may rely on
- breaking focus-sensitive shortcuts in search/editor/composer
- fixing the wrong call path if the workspace is a slice of a larger codebase
- introducing a layout regression while correcting viewport sizing

## Manual test checklist for this PR
- open MYUI on a valid page
- confirm no console errors on open
- test `Shift+1` through `Shift+0`
- test `Alt+1` through `Alt+0`
- test `=` `-` and `0`
- verify search/editor/composer focus behavior still makes sense
- resize the browser tall/short and wide/narrow
- confirm panel height remains usable
- confirm no new overlap or clipping issues appear

## CodeRabbit triage section
When CodeRabbit comments on this PR, classify feedback into:

### Must fix before merge
- 

### Valid but can be deferred
- 

### Likely noise / false positive
- 

## What reviewers should look for
- any remaining `ReferenceError` path in quick-hotkey code
- whether the chosen fix matches current product behavior
- whether viewport sizing now uses the correct dimension consistently
- whether the PR stayed narrow and avoided unrelated edits

## Merge recommendation template
- Approve
- Request changes
- Split further

## Notes
Fill this section after Codex returns the exact edits, summary, regressions, and PR description.
