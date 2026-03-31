# MYUI Project Setup Pack

Use this file as the quick-start operating pack for new chats, project instructions, and handoffs.

This pack assumes the following supporting docs exist in `docs/`:
- `AI_WORKFLOW_GUIDE.md`
- `MYUI_MANUAL_SMOKE_CHECKLIST.md`
- `MYUI_ARCHITECTURE_NOTES.md`
- `MYUI_CURRENT_PR_NOTES.md`
- `MYUI_BRANCH_NAMING_RULES.md`
- `MYUI_REVIEW_PROMPTS.md`

---

## 1. Compact project instructions block

```text
Project: MYUI

Repo:
https://github.com/devknowsdev/MYUI

Local working folder:
/Users/duif/DK APP DEV/BeatPulseLabs-Annotation-Assist/TO TEST/MYUI WORKING FOLDER

Project type:
Chrome/Chromium Manifest V3 extension in vanilla JavaScript.

Core files:
- manifest.json
- background.js
- content.js
- build_terms_data.py
- terms_data.js
- defs_data.js

Primary reference docs inside docs/:
- AI_WORKFLOW_GUIDE.md
- MYUI_PROJECT_SETUP_PACK.md
- MYUI_MANUAL_SMOKE_CHECKLIST.md
- MYUI_ARCHITECTURE_NOTES.md
- MYUI_CURRENT_PR_NOTES.md
- MYUI_BRANCH_NAMING_RULES.md
- MYUI_REVIEW_PROMPTS.md

Working model:
- Codex works locally on the real repo.
- GitHub is the source of truth for branches, PRs, and merge history.
- CodeRabbit reviews pull requests only.
- ChatGPT plans work, audits architecture, triages review feedback, and turns findings into focused next steps.

Current priority:
PR 1 - fix broken quick hotkeys and viewport sizing.

Current branch:
fix/quick-hotkeys-viewport

Workflow rules:
- Never work directly on main.
- Keep PRs small and focused.
- Prefer one clear purpose per PR.
- Do not do broad rewrites unless explicitly requested.
- Treat CodeRabbit as advisory, not final authority.
- Before merge, classify review feedback into:
  1. must fix
  2. valid but can be deferred
  3. likely noise / false positive

What ChatGPT should help with:
- architecture notes
- PR planning
- branch strategy
- review triage
- manual test checklists
- identifying risks and regressions
- drafting reusable prompts for Codex and review workflows

Current known themes:
- content.js is the main complexity/risk area
- prioritize correctness and state-flow fixes before major refactors
- prefer several small cleanup PRs over one large rewrite
```

---

## 2. How new chats should use the docs

When starting any new chat about MYUI, first identify the task type, then consult the matching docs before giving recommendations.

### Task routing map
- **Project orientation / handoff**
  - Read: `AI_WORKFLOW_GUIDE.md`, `MYUI_PROJECT_SETUP_PACK.md`
- **Architecture or refactor planning**
  - Read: `MYUI_ARCHITECTURE_NOTES.md`, `AI_WORKFLOW_GUIDE.md`
- **Current PR work**
  - Read: `MYUI_CURRENT_PR_NOTES.md`, `MYUI_MANUAL_SMOKE_CHECKLIST.md`
- **Branch or workflow decisions**
  - Read: `MYUI_BRANCH_NAMING_RULES.md`, `AI_WORKFLOW_GUIDE.md`
- **Prompting Codex or ChatGPT**
  - Read: `MYUI_REVIEW_PROMPTS.md`, `MYUI_PROJECT_SETUP_PACK.md`
- **Pre-merge or regression review**
  - Read: `MYUI_MANUAL_SMOKE_CHECKLIST.md`, `MYUI_CURRENT_PR_NOTES.md`, `MYUI_ARCHITECTURE_NOTES.md`

Rule:
Before proposing changes, summarize the relevant docs consulted and keep recommendations within the current PR scope unless asked to broaden it.

---

## 3. Copy-paste task prompts for new chats

### A. Project orientation prompt
```text
You are helping with the MYUI project.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_PROJECT_SETUP_PACK.md
2. docs/AI_WORKFLOW_GUIDE.md
3. docs/MYUI_ARCHITECTURE_NOTES.md

Then provide:
- a concise summary of the current project shape
- current workflow rules
- current priority branch/PR
- the safest next step

Important:
- Keep answers aligned with the documented workflow.
- Do not recommend broad rewrites unless explicitly requested.
- Call out any uncertainty clearly.
```

### B. Current PR planning prompt
```text
You are helping with the active MYUI PR.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_CURRENT_PR_NOTES.md
2. docs/MYUI_MANUAL_SMOKE_CHECKLIST.md
3. docs/MYUI_ARCHITECTURE_NOTES.md
4. docs/MYUI_BRANCH_NAMING_RULES.md

Then:
- restate the current PR goal and scope
- identify the smallest correct implementation path
- list likely risks and regressions
- give a manual test plan based on the checklist

Important:
- Stay within the current PR scope.
- Do not expand into persistence, data-pipeline, or broad refactors unless the docs say this PR includes them.
```

### C. Codex implementation handoff prompt
```text
You are working locally in the MYUI repository.

Before making recommendations or edits, first read these docs from the repo:
1. docs/MYUI_PROJECT_SETUP_PACK.md
2. docs/MYUI_CURRENT_PR_NOTES.md
3. docs/MYUI_ARCHITECTURE_NOTES.md
4. docs/MYUI_MANUAL_SMOKE_CHECKLIST.md
5. docs/MYUI_REVIEW_PROMPTS.md

Task:
Implement only the currently scoped PR.

Process:
- First summarize the PR goal, in-scope work, and out-of-scope work from the docs.
- Then inspect the relevant code.
- Explain the intended changes before editing.
- Make only the minimum necessary edits.
- Do not commit or push unless explicitly asked.

After editing, return:
- files changed
- summary of changes
- possible regressions
- manual test checklist
- suggested PR title and PR description
```

### D. Architecture/refactor planning prompt
```text
You are planning a MYUI refactor or cleanup sequence.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_ARCHITECTURE_NOTES.md
2. docs/AI_WORKFLOW_GUIDE.md
3. docs/MYUI_BRANCH_NAMING_RULES.md
4. docs/MYUI_PROJECT_SETUP_PACK.md

Then provide:
- current architectural weak spots
- the best sequence of small PRs
- what should be fixed before any larger refactor
- what should explicitly be deferred

Important:
- Prefer several small PRs over one large rewrite.
- Keep recommendations proportional to the current repo shape.
```

### E. CodeRabbit triage prompt
```text
You are reviewing CodeRabbit feedback for MYUI.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_CURRENT_PR_NOTES.md
2. docs/MYUI_ARCHITECTURE_NOTES.md
3. docs/MYUI_MANUAL_SMOKE_CHECKLIST.md
4. docs/MYUI_REVIEW_PROMPTS.md

Then classify every review comment into:
1. must fix before merge
2. valid but can be deferred
3. likely noise / false positive

Also identify:
- what the bot missed
- any regression risks
- any manual tests still needed

End with a recommended action plan.
```

### F. Merge-readiness prompt
```text
You are assessing whether a MYUI PR is ready to merge.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_CURRENT_PR_NOTES.md
2. docs/MYUI_MANUAL_SMOKE_CHECKLIST.md
3. docs/MYUI_ARCHITECTURE_NOTES.md

Then provide:
- merge recommendation: approve / request changes / split further
- remaining risks
- missing manual tests
- any comments that should be deferred to a later PR
- a concise reviewer summary
```

### G. Branch creation prompt
```text
You are helping choose a branch name and scope for MYUI work.

Before answering, first read these reference docs from the project sources:
1. docs/MYUI_BRANCH_NAMING_RULES.md
2. docs/MYUI_PROJECT_SETUP_PACK.md
3. docs/MYUI_CURRENT_PR_NOTES.md if this work continues an active PR

Then provide:
- the best branch name
- the intended PR scope
- what should be explicitly out of scope
- the likely manual tests needed
```

---

## 4. Project upload checklist

Place these in the project as sources:
- `docs/AI_WORKFLOW_GUIDE.md`
- `docs/MYUI_PROJECT_SETUP_PACK.md`
- `docs/MYUI_MANUAL_SMOKE_CHECKLIST.md`
- `docs/MYUI_ARCHITECTURE_NOTES.md`
- `docs/MYUI_CURRENT_PR_NOTES.md`
- `docs/MYUI_BRANCH_NAMING_RULES.md`
- `docs/MYUI_REVIEW_PROMPTS.md`
- Codex audit output
- PR roadmap / execution plan

Optional code uploads for static context:
- `manifest.json`
- `background.js`
- `content.js`
- `build_terms_data.py`

---

## 5. Current recommended next step

Proceed with the current correctness-first plan:
- work on `fix/quick-hotkeys-viewport`
- keep the PR limited to quick-hotkey correctness and viewport sizing
- use Codex locally for edits
- open a GitHub PR into `main`
- let CodeRabbit review it
- use ChatGPT to triage the review and assess merge readiness
