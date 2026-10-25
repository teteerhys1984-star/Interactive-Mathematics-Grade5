# Limited Unit 2 quality fixes — 2026-10-25

## Read-only audit before edits

- Clean working tree; fetched `main`, which matched HEAD at `671564636a740b0f86ef3ba8aa2eb8f65065b335`. No open PRs. Latest merge: #27. Rechecked remote main before delivery: unchanged.
- Latest existing Actions run: https://github.com/teteerhys1984-star/Interactive-Mathematics-Grade5/actions/runs/39872251469 — build and deploy passed for that base commit, not for this change.
- `src/tests/definitions/units/unit-2.test.ts:44–62`: directional wording was ambiguous, answer B uniquely has first < second, and the explanation incorrectly claimed three matching leading places instead of two. The file identifies these as newly authored test questions, not literal textbook questions. Numbers, option order and answer key are preserved; ordinal labels remove RTL ambiguity.
- `src/lessons/unit2ExercisesData.ts:357–360,979–996`: q7 group A had a p85 ID despite explicit page 86 and a p86 parent/siblings. Corrected its ID and the two derived ledger references in `docs/unit2-review-coverage.json`. Other references are generated from data.
- `scripts/lesson-unit2-exercises-check.ts`: added parent-question consistency for branches and own-page consistency for ordering groups. Deliberately does not require all branches to share the parent's page: q6 spans pages 85–86.
- `.github/workflows/deploy.yml:28–31` runs npm ci and build. Previously build omitted coordinate/content/design/line-graph checks, lesson 3–8 checks, fractions-two interaction, unit-1 and browser smoke (13 commands).

## CI change

`build` now calls `quality-check` then Vite. The aggregate includes the existing checks, the 13 verified missing checks and typecheck; all 34 commands occur exactly once. Workflow events, permissions, artifact handling and deployment are unchanged. `browser-smoke-test.tsx` header now describes its actual CI inclusion.

The workflow only runs on main pushes or manual dispatch; it does not run on PRs. No remote run for this patch is claimed. UI checks use installed jsdom/Testing Library (some via Vite SSR), not an installed browser. No additional browser setup is required for these checks.

## Actual local results

Environment: Node 22.22.3; dependencies installed with npm ci from the existing lockfile.

- npm ci: **PASS**, but reported 3 high-severity dependency vulnerabilities. No dependency upgrades attempted in this scoped patch.
- New regression assertions before data fixes: **FAILED as expected**, on the comparison wording and q7 page mismatch.
- Targeted test-area and Unit 2 review checks after fixes: **PASS**.
- Mutation checks: **PASS** — separately changing the key, introducing a second correct option, restoring the incorrect explanation, and reversing the final inequality each made the comparison check fail. Original corrected data restored after every experiment.
- npm run build: **PASS**, including the following complete quality suite and production Vite build (about 136 seconds locally).

| Command | Result |
| --- | --- |
| `coordinate-check` | PASS |
| `content-check` | PASS |
| `design-check` | PASS |
| `line-graphs-check` | PASS |
| `lesson-3-check` | PASS |
| `lesson-4-check` | PASS |
| `lesson-5-check` | PASS |
| `lesson-6-check` | PASS |
| `lesson-7-check` | PASS |
| `lesson-8-check` | PASS |
| `lesson-fractions-two-interaction-check` | PASS |
| `unit-1-check` | PASS |
| `browser-smoke-test` | PASS |
| `test-area-check` | PASS |
| `unit-exercises-check` | PASS |
| `unit-exercises-ui-check` | PASS |
| `lesson-unit2-exercises-check` | PASS |
| `unit-2-exercises-ui-check` | PASS |
| `lesson-9-coverage-check` | PASS |
| `lesson-10-coverage-check` | PASS |
| `lesson-11-coverage-check` | PASS |
| `lesson-12-coverage-check` | PASS |
| `lesson-fractions-two-check` | PASS |
| `lesson-tenths-one-check` | PASS |
| `lesson-tenths-one-interaction-check` | PASS |
| `lesson-decimal-parts-two-check` | PASS |
| `lesson-decimal-parts-two-interaction-check` | PASS |
| `lesson-decimal-parts-three-check` | PASS |
| `lesson-decimal-parts-three-interaction-check` | PASS |
| `lesson-rectangle-check` | PASS |
| `lesson-rectangle-interaction-check` | PASS |
| `lesson-square-check` | PASS |
| `lesson-square-interaction-check` | PASS |
| `typecheck` | PASS |

`test-area-check` also executes `scripts/test-area-ui-check.tsx`; both passed.

- Aggregate coverage/no duplicate command audit: **PASS** (34 commands).
- git diff --check: **PASS**. Final diff contains only the requested data fixes, regression assertions, quality aggregation and supporting documentation. No UI/teacher protection/deployment configuration changes.
- Real Chromium/Firefox/WebKit rendering: **NOT RUN**; the existing smoke test is jsdom, not a substitute for visual browser verification.
- GitHub Actions for this patch: **NOT RUN**; unchanged workflow does not trigger for this working branch or PR.
- `lesson-rectangle-coverage`, `unit-exercises-coverage`, `lesson-square-coverage`: **NOT RUN**; these are report-writing variants of checks already passed, not separate validations. Existing checked-in ledgers were validated without regeneration.

## Remaining risks

- npm ci reported dependency security findings (3 high); remediation requires a separate dependency review.
- Vite emitted a non-fatal warning about a minified chunk exceeding 500 kB; bundling changes are out of scope.
- Existing externally saved links to the mistyped q7 branch anchor may need the corrected p86 anchor. Repository references and generated teacher IDs are consistent; no unrelated routing changes were made.
- CI will take longer because 13 previously skipped checks now run. No duplicate quality commands were added.
