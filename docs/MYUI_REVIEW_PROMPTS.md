# MYUI Review Prompts

Use these prompts to keep Codex, CodeRabbit, and ChatGPT aligned.

## 1. Codex baseline audit prompt
Use when first inspecting the repo.

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

## 2. Codex focused implementation prompt
Use when starting a specific PR.

```text
Implement the currently scoped MYUI PR.

Requirements:
- Keep the PR small and reviewable.
- Focus on the highest-value, lowest-risk improvement in scope.
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

Recommended reasoning level: **Medium**.

## 3. Current PR 1 implementation prompt
Use for the active `fix/quick-hotkeys-viewport` branch.

```text
Implement PR 1 for MYUI.

Scope:
- Fix the broken quick-hotkey path in content.js
- Fix the viewport sizing bug where panelHeight is clamped against window.innerWidth instead of window.innerHeight
- Keep this PR small and reviewable
- Do not touch persistence, data pipeline, or broad refactors

Important:
- First inspect the missing hotkey helper call sites and determine whether they should:
  1. be implemented using existing in-repo state/functions, or
  2. be removed/replaced because they are dead references
- Do not invent a large new subsystem
- Prefer the smallest correct fix
- Explain the intended change before editing

After editing, return:
- exact files changed
- concise summary of changes
- possible regressions
- manual test checklist
- suggested PR title and PR description
```

## 4. ChatGPT PR triage prompt
Use after CodeRabbit comments on a PR.

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

## 5. ChatGPT merge-readiness prompt
Use after fixes are applied.

```text
Assess whether this MYUI PR is ready to merge.

Please provide:
- merge recommendation: approve / request changes / split further
- remaining risks
- missing manual tests
- any comments that should be deferred to a later PR
- a concise reviewer summary
```

## 6. ChatGPT regression-check prompt
Use when a fix may have changed behavior outside the target scope.

```text
Review this MYUI change for unintended regressions.

Focus on:
- keyboard behavior
- session and tray mutation logic
- persistence side effects
- layout and viewport behavior
- any user-visible behavior that may have shifted outside the intended scope

Return:
- likely regressions
- why they might happen
- what to test manually
- whether the risk is acceptable for this PR size
```

## 7. CodeRabbit operating prompt for humans
This is not pasted into CodeRabbit. Use it as the reviewer mindset.

- Treat CodeRabbit comments as advisory
- Accept comments that improve correctness, safety, or reviewability
- Defer comments that broaden the scope without strong payoff
- Reject comments that assume a different architecture than the current repo supports
- Ask ChatGPT to triage before making large follow-up changes
