# MYUI Branch Naming Rules

Use branch names that make the purpose obvious at a glance.

## Core rule
Format:

`type/short-purpose`

Keep names short, specific, and readable.

## Recommended types
- `fix/` - bug fix or correctness issue
- `refactor/` - structural cleanup without intended product change
- `cleanup/` - low-risk simplification or dead-code removal
- `test/` - tests or test harness work
- `docs/` - documentation only
- `chore/` - low-level maintenance tasks

## Naming principles
- describe one main purpose
- avoid vague names like `stuff`, `changes`, or `update`
- avoid combining multiple goals in one branch name
- prefer behavior-focused wording over file-focused wording

Good:
- `fix/quick-hotkeys-viewport`
- `fix/persistence-symmetry`
- `refactor/session-term-collection`
- `cleanup/dead-state-flags`
- `docs/data-pipeline-guide`

Less good:
- `fix/content-js`
- `update/myui`
- `refactor/many-things`
- `misc/cleanup`

## Branch strategy
- branch from `main`
- keep each branch focused on one change set
- open a PR early if review would help
- avoid long-lived mega branches unless they are intentionally audit-only

## Special cases
### One-time audit branch
Use audit-only branches only when needed to generate review context, such as the baseline CodeRabbit audit flow.

Examples already created:
- `audit/empty`
- `audit-current-code`

Do not merge audit-only branches.

### Docs branch
Use `docs/...` for workflow notes, playbooks, and setup guides that do not change runtime behavior.

## Merge hygiene
Before opening a PR, check:
- branch name matches the actual work
- branch scope is still singular
- commits do not include unrelated cleanup
- the PR can be reviewed in one sitting
