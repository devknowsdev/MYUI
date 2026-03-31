# MYUI AI Workflow Guide

This document defines the working relationship between Codex, GitHub, CodeRabbit, ChatGPT, the project folder, and Canvas for the `MYUI` repository.

Use this as the single operating guide for code audits, implementation, pull request review, and follow-up cleanup work.

---

## 1. Mission

Build a low-friction, high-signal review and development workflow for `MYUI`.

Goals:
- keep work small and reviewable
- use AI tools for distinct roles instead of overlapping them
- improve architecture, maintainability, consistency, and correctness
- avoid direct work on `main`
- convert review feedback into focused, actionable improvements

---

## 2. Team Roles

### Codex
Use locally against the real repository.

Best for:
- reading the codebase
- mapping structure and dependencies
- finding risky patterns
- implementing focused changes
- preparing tests and cleanup edits

Not the final authority for merge decisions.

### GitHub
Use as the source of truth for:
- branches
- pull requests
- comments
- history
- merge decisions

### CodeRabbit
Use only on pull requests.

Best for:
- automated review of diffs
- changed-file comments
- spotting risky patterns
- surfacing test gaps

Treat CodeRabbit as an advisory reviewer, not the final authority.

### ChatGPT
Use for:
- architecture reasoning
- audit prioritization
- triaging CodeRabbit feedback
- identifying what the bots missed
- turning findings into an action plan

### Project Folder
Use for durable project memory:
- repo context
- conventions
- reusable prompts
- current workflow rules
- links to important PRs and docs

### Canvas
Use as a temporary structured work board:
- audit notes
- PR breakdowns
- issue grouping
- fix roadmap
- test checklist

Canvas is for thinking and organizing, not as the source of truth for code.

---

## 3. Golden Rules

1. Never work directly on `main`.
2. Keep pull requests small and focused.
3. Use Codex locally for understanding and editing.
4. Use CodeRabbit only on PRs.
5. Ask ChatGPT to triage bot feedback before making large follow-up changes.
6. Prefer several small cleanup PRs over one giant rewrite.
7. Separate high-value fixes from noisy suggestions.
8. Keep architecture decisions explicit.
9. Use draft PRs when the intent is still evolving.
10. Do not merge the baseline audit PR.

---

## 4. Recommended Workspace Architecture

### Local machine
Use the real local clone of `MYUI` for:
- Codex work
- git branches
- testing
- manual verification

### GitHub
Use GitHub for:
- pushing branches
- opening PRs
- reviewing CodeRabbit output
- preserving history

### Project folder contents
Store these items:
- this guide
- repo summary
- architecture notes
- reusable prompts
- merge checklist
- known issues / roadmap

### Canvas boards
Recommended canvases:
- `MYUI baseline audit`
- `MYUI current PR`
- `MYUI architecture notes`

---

## 5. Reasoning Levels for Codex

Use these defaults:

- **High**: full repo audit, architecture review, choosing the next cleanup PR
- **Medium**: implementing a focused PR, tests, contained refactors
- **Low**: obvious repetitive edits, naming cleanup, simple mechanical fixes

Rule of thumb:
- use **High** for thinking
- use **Medium** for doing
- use **Low** only for clear low-risk edits

---

## 6. Primary Codex Audit Prompt

Paste this into Codex when starting a baseline audit:

```text
You are auditing the MYUI repository.

Goals:
1. Understand the project structure and main entry points.
2. Identify the highest-risk issues in architecture, maintainability, consistency, and correctness.
3. Find duplicated logic, dead code, weak naming, fragile state flow, missing loading/error handling, and unclear component boundaries.
4. Do not make changes yet.
5. First produce a concise audit report.

Please return:
- Project structure summary
- Main technologies/frameworks detected
- Top 10 issues, grouped by severity:
  - Critical
  - Important
  - Cleanup / low priority
- A proposed fix roadmap split into 3 to 5 small PRs
- For each proposed PR:
  - goal
  - likely files/folders involved
  - main risks
  - what should be tested manually

Rules:
- Be concrete and repo-specific.
- Prefer small focused recommendations over broad rewrites.
- Flag uncertainty clearly.
- Do not commit, push, or rewrite large sections unless I explicitly ask.
```

Recommended reasoning level: **High**.

---

## 7. Codex Implementation Prompt

After the audit, use this prompt for the first focused PR:

```text
Take the audit findings and propose the best first cleanup PR.

Requirements:
- Keep the PR small and reviewable.
- Focus on the highest-value, lowest-risk improvement.
- List the exact files to change.
- Explain the intended code changes before making them.
- After that, make only the necessary edits.
- Do not commit or push unless I explicitly ask.
- After editing, provide:
  - summary of changes
  - possible regressions
  - manual test checklist
  - suggested PR title and PR description
```

Recommended reasoning level: **Medium** unless the refactor is structurally tricky.

---

## 8. GitHub Workflow

### Normal workflow
1. Pull latest `main`
2. Create a focused branch
3. Make a single coherent change
4. Push branch
5. Open a PR into `main`
6. Let CodeRabbit review it
7. Ask ChatGPT to triage comments and risks
8. Apply only the worthwhile follow-up fixes
9. Merge

### Branch naming examples
- `cleanup/ui-consistency`
- `fix/error-handling`
- `refactor/state-flow`
- `test/component-coverage`
- `docs/ai-workflow-guide`

### PR rules
- one main purpose per PR
- descriptive title
- clear test notes
- avoid unrelated cleanup in the same PR
- prefer draft PRs for early review

---

## 9. Baseline Audit PR

Because CodeRabbit reviews diffs, a one-time baseline PR may be used to expose the full codebase for review.

Current audit branches already created for this repo:
- `audit/empty`
- `audit-current-code`

Use these to open a draft PR with:
- **base**: `audit/empty`
- **compare**: `audit-current-code`

Suggested PR title:

```text
Baseline audit: full codebase review
```

Suggested PR body:

```text
One-time audit PR so CodeRabbit can review the current codebase.

Do not merge.

Purpose:
- get full-repo automated review
- identify architecture and code-quality risks
- convert findings into smaller follow-up PRs
```

Important:
- do not merge this PR
- use it only to gather review feedback
- close it after extracting findings

---

## 10. CodeRabbit Operating Rules

Use CodeRabbit for:
- inline review on pull requests
- changed-file analysis
- suspicious code patterns
- possible missing tests
- obvious maintainability or safety concerns

Do not treat CodeRabbit as the decision maker for:
- architecture direction
- whether a refactor is worth the churn
- product-level judgment
- final merge approval

Best use:
- let it review focused PRs
- then ask ChatGPT to classify the feedback into:
  1. must fix
  2. valid but can be deferred
  3. likely noise / false positive

---

## 11. ChatGPT Review-Triage Prompt

Use this prompt after CodeRabbit comments on a PR:

```text
Review this MYUI PR and classify every review comment into:
1. must fix before merge
2. valid but can be deferred
3. likely noise / false positive

Then identify what the reviewers missed:
- architecture risks
- maintainability problems
- missing tests
- regression risks

End with a recommended action plan.
```

---

## 12. Canvas Structure

### Canvas: `MYUI baseline audit`
Sections:
- repo map
- top 10 issues
- likely architectural weak spots
- first 3 cleanup PRs
- manual test checklist

### Canvas: `MYUI current PR`
Sections:
- PR purpose
- files touched
- expected behavior
- CodeRabbit findings
- ChatGPT triage
- final fix checklist
- merge recommendation

### Canvas: `MYUI architecture notes`
Sections:
- component boundaries
- state/data flow notes
- naming conventions
- shared utility patterns
- future refactor ideas

---

## 13. Project Folder Structure

Suggested contents:

### Repo context
- what MYUI is
- stack summary
- important folders and entry points
- known risk areas

### Workflow rules
- no direct work on `main`
- small PRs only
- CodeRabbit is advisory
- ask ChatGPT to triage bot feedback

### Reusable prompts
- Codex audit prompt
- Codex implementation prompt
- ChatGPT PR triage prompt

### Active work
- current branch
- current PR
- next three cleanup tasks

---

## 14. Power Team Workflow

### Phase 1: Audit
- Codex runs a full audit locally at **High** reasoning
- findings are summarized in Canvas
- ChatGPT helps rank priorities

### Phase 2: First focused PR
- Codex proposes the smallest high-value fix
- changes are made locally
- a branch is pushed to GitHub
- a PR is opened

### Phase 3: Review
- CodeRabbit reviews the PR
- ChatGPT triages the comments
- only meaningful fixes are applied

### Phase 4: Merge and repeat
- merge once the PR is coherent and safe
- move to the next focused cleanup PR
- keep the loop small and repeatable

---

## 15. Merge Checklist

Before merging, confirm:
- the PR has one clear purpose
- no unrelated edits are mixed in
- naming is consistent
- loading and error states are handled where relevant
- there is no obvious dead code or debug residue
- manual tests were run
- CodeRabbit feedback has been triaged
- remaining risks are understood

---

## 16. Recommended Next Steps for MYUI

1. Place this guide in the project folder.
2. Put the Codex audit prompt into Codex and run it at **High** reasoning.
3. Record the results in the `MYUI baseline audit` Canvas.
4. Open the one-time baseline audit PR, or skip straight to the first small cleanup PR.
5. Let CodeRabbit review the PR.
6. Bring the PR feedback to ChatGPT for triage.
7. Apply only the most valuable fixes.
8. Continue in small, reviewable cycles.

---

## 17. Operating Principle

The system works best when each tool has a clear role:

- **Codex** reads and edits code
- **GitHub** holds the workflow and history
- **CodeRabbit** reviews the diff
- **ChatGPT** decides what matters
- **Canvas** organizes the current effort
- **Project folder** preserves long-term context

This is the `MYUI` power team.
