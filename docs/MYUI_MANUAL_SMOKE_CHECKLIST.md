# MYUI Manual Smoke Checklist

Use this checklist after any meaningful code change and before merging a PR.

## Core activation
- Load or reload the extension
- Open a whitelisted page
- Click the toolbar action to toggle MYUI
- Confirm the panel appears without console errors
- Close and reopen the panel once

## Layout and viewport
- Resize the browser wide and narrow
- Resize the browser tall and short
- Confirm panel height and width stay usable
- Confirm docked or floating layout still behaves correctly
- Confirm no clipped controls or unusable overflow

## Search and term selection
- Use search to find a known term
- Hover or open a definition/help state if available
- Click terms from at least:
  - feel
  - sound
  - instruments
- Confirm the expected term appears in the correct session or tray
- Confirm routed terms do not duplicate unexpectedly

## Quick controls and hotkeys
- Open the Quick area or equivalent quick-entry mode
- Test these keys where relevant:
  - Shift+1 through Shift+0
  - Alt+1 through Alt+0
  - =
  - -
  - 0
- Confirm no hotkey path throws errors
- Confirm focus-sensitive behavior still works in search/editor/composer fields

## Composer and trays
- Add a few terms through normal clicking
- Add a few terms through composer or quick flow if supported
- Confirm session counts are correct
- Confirm tray contents are correct
- Confirm connectives or related collection logic still works

## Undo, redo, and editing
- Add several items, then undo
- Redo the same actions
- Edit a row or term if editor features are present
- Save the change and verify it persists for the current session

## Persistence and reload
- Change a few visible preferences
- Reload the page
- Reopen MYUI
- Confirm only intended settings restore
- Confirm page state does not override extension state unexpectedly

## Export and data checks
- Run any available export flow such as CSV or plist
- Confirm the export completes without obvious corruption
- Confirm definitions and search still work after reload

## Final merge gate
Before merge, confirm:
- no console errors during core flows
- no obvious duplicate insertion bugs
- no broken hotkeys
- layout survives resize
- the PR changed only what it intended to change
