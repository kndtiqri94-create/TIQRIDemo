# Development Standards — Index (concern → source)

This file is the **agent-friendly table of contents** for the monolithic standards docs.
Instead of every agent loading the full `BACKEND_STANDARDS.md` and `FRONTEND_STANDARDS.md` on every activation, agents load **this file only**, then read the specific sections that matter for the current task.

**Backend split:** `BACKEND_STANDARDS.md` **sections 1–13** target **`src/management-api`** (layered API + EF Core patterns). **Section 0** and **section 14** cover **`agent-api`**, **`event-functions`**, and **`tool-functions`**. See PRD section 10.2 for layout.

## How agents use this file

1. On activation, load `docs/development-standards/INDEX.md`.
2. Identify the concern tags relevant to the task (e.g. a new API endpoint touches `api`, `data-access`, `validation`, `authorization`, `logging`, `testing`; Bicep touches `infra.security` / `infra.bicep`).
3. For each relevant tag, load the referenced section(s) from the source file via `Read` with the stated heading anchor or line hint.
4. Only fall back to reading the full standards file if a concern is not mapped here.
5. When you discover a recurring rule that is not yet mapped, add a row in the table below and, if the rule is new, raise it with the Team Lead so it can be promoted into the standards doc.

> **Rule of thumb:** if you are loading more than 3 sections for one task, prefer to load the whole file once — the index exists to narrow, not fragment.

---

## Backend concerns → `BACKEND_STANDARDS.md`

| Tag | Concern | Source sections |
|---|---|---|
| `backend.scope` | Monorepo backends; what applies to management-api vs others | Section 0 (scope), opening table |
| `backend.architecture` | Clean Architecture layout, dependency rules, naming (management-api) | Section 1 Solution Architecture (1.1–1.4) |
| `backend.reference` | Reference implementation (legacy sample / modules pattern) | Section 2 Reference Implementation |
| `backend.api` | HTTP surface: controllers → management-api Functions; routing, semantics | Section 3 API Layer (3.1–3.4) |
| `backend.api.devmode` | Dev-mode JWT skip / mock user | Section 3.5 |
| `backend.application` | CQRS dispatcher, feature folders, DTOs, mapping | Section 4 Application Layer (4.1–4.4) |
| `backend.service-layer` | Services vs handlers | Section 4.5, 4.6 |
| `backend.validation` | FluentValidation rules | Section 4.7 |
| `backend.domain` | Entities, no infra leakage | Section 5 Domain Layer (5.1–5.2) |
| `backend.data-access` | DbContext, entity configs, repositories, catalogs, UoW, design-time factory | Section 6 Infrastructure Layer (6.1–6.5) |
| `backend.prisma` | `backend-app` Prisma schema, migrations, integer identity keys, tenant scope, seed scripts; **commit migration SQL only — do not apply migrations to any database unless explicitly requested** | `backend-app/prisma/CONVENTIONS.md`, `backend-app/prisma/MIGRATION_POLICY.md`; BACKEND_STANDARDS.md → Database Standards → Prisma Schema |
| `backend-app.structure` | `backend-app` entity folders, flattened domain models/DTOs, per-entity files | BACKEND_STANDARDS.md → Project Structure; Coding Standards → backend-app Entity File Layout |
| `backend-app.functions` | `backend-app` Azure Function handler factory, entity route URLs, request/response helpers | BACKEND_STANDARDS.md → API Design Standards |
| `backend-app.models` | Domain model required fields, DTO contracts, audit base usage | BACKEND_STANDARDS.md → Coding Standards → Domain Models and DTOs; Database Standards → Audit Trail |
| `backend-app.repositories` | `DatabaseService` repository pattern, domain returns, mappers, tenant filters | BACKEND_STANDARDS.md → Dependency Injection → Repository Pattern |
| `backend-app.partial-updates` | PATCH optional fields via `UpdateHelper.pickDefinedValue` in services/repositories | BACKEND_STANDARDS.md → Coding Standards → Partial Update Payloads |
| `backend-app.formatting` | No spurious blank lines; compact handler/service layout | BACKEND_STANDARDS.md → Coding Standards → Source formatting (no spurious line breaks) |
| `backend-app.async-noop` | Intentional interface no-ops: use `return Promise.resolve()`, never empty `async` bodies (Sonar) | BACKEND_STANDARDS.md → Coding Standards → Intentional no-op methods (Sonar) |
| `backend-app.cognitive-complexity` | Sonar: max cognitive complexity **15** per function; extract helpers / maps instead of nested ternaries and deep branching | BACKEND_STANDARDS.md → Coding Standards → Cognitive complexity (Sonar) |
| `backend-app.regex` | Sonar: avoid super-linear / backtracking regexes; prefer `split`/`filter`/`join` or bounded string walks (e.g. slugify) | BACKEND_STANDARDS.md → Coding Standards → Regular expressions (Sonar) |
| `backend-app.replaceAll` | Sonar: use string needles in `replaceAll` for literal chars (CSV/HTML escape); RegExp only for real patterns | BACKEND_STANDARDS.md → Coding Standards → `String#replaceAll` literal needles (Sonar) |
| `backend-app.nested-templates` | Sonar: no nested template literals / nested `String.raw`; extract locals then build `RegExp` or template | BACKEND_STANDARDS.md → Coding Standards → Nested template literals (Sonar) |
| `backend-app.string-raw` | Sonar: use `String.raw` for templates with backslashes (regex sources); combine with nested-template rule | BACKEND_STANDARDS.md → Coding Standards → `String.raw` for backslashes (Sonar) |
| `backend-app.readonly` | Sonar: mark constructor-assigned instance fields (`prisma`, collaborators) as `readonly` | BACKEND_STANDARDS.md → Coding Standards → Readonly class members (Sonar) |
| `backend.di` | DI registrations across Application/Infra/API | Section 7 Dependency Injection |
| `backend.naming` | Naming conventions | Section 8 Naming and Conventions |
| `backend.api-docs` | Where and how to document APIs | Section 9 API Documentation |
| `backend.security` | Authorization and audit fields; map PRD SQL roles for management-api | Section 10 Authorization and Tenant Context |
| `backend.quality` | Code quality gates | Section 11 Code Quality |
| `backend.testing` | Test layout and expectations; **do not auto-run suite** — user runs tests manually | Section 12 Testing (12.1–12.4), **Running tests** |
| `backend.checklist` | Author checklist for new features (management-api) | Section 13 Checklist for New Features |
| `backend.agent-api` | Semantic Kernel runtime, chat, plugins, RAG/tools | Section 14.1 |
| `backend.event-functions` | Azure Storage Queues, timers, poison-message / retry | Section 14.2 |
| `backend.tool-functions` | Tool HTTP endpoints, managed identity callers | Section 14.3 |
| `backend.cross-cutting` | Secrets, observability, product authZ (PRD) | Section 14.4 |

## Infrastructure & pipelines → `INFRA_STANDARDS.md`

Short, mandatory baseline for **Bicep** and Azure resource defaults (network posture, Cognitive Services, Key Vault consistency). Load the **whole file** when any row below applies — it is small.

| Tag | Concern | Source |
|---|---|---|
| `infra.security` | PaaS network defaults (e.g. Azure OpenAI trusted-services bypass **off**, Key Vault bypass posture) | `INFRA_STANDARDS.md` §§1–2 |
| `infra.bicep` | IaC scope, conventions, cross-check with PRD §7 / §10 | `INFRA_STANDARDS.md` (intro + §§1–2); PRD |

## Frontend concerns → `FRONTEND_STANDARDS.md`

| Tag | Concern | Source sections |
|---|---|---|
| `frontend.tech` | Stack, core vs dev dependencies | Technology Stack (Core / Development) |
| `frontend.dependencies` | npm/pnpm dependency changes; license inventory | Technology Stack → **Direct dependency and license log (`src/admin-portal`)** |
| `frontend.structure` | Project structure and folder layout | Project Structure |
| `frontend.typescript` | TS config, naming, path mapping | Coding Standards → TypeScript Configuration, Naming, Path Mapping |
| `frontend.naming` | Full names for inject aliases (no `fb`, `http`, `auth`, etc.) | Coding Standards → Component Standards → Identifier Naming (no abbreviations) |
| `frontend.components` | Component standards | Coding Standards → Component Standards |
| `frontend.lifecycle` | Sonar: `ngOnInit` must return `void`; fire-and-forget via `.catch()`, not `async ngOnInit` / `void` | FRONTEND_STANDARDS.md → Component Standards → Lifecycle hooks (OnInit); Code Quality → void operator |
| `frontend.component-files` | Template + SCSS in separate files (no inline `template` / `styles` in `.ts`) | Coding Standards → Component Standards → **Separate files for template, styles, and TypeScript** |
| `frontend.services` | Service standards | Coding Standards → Service Standards |
| `frontend.models` | Model standards | Coding Standards → Model Standards |
| `frontend.core-models` | `frontend-app` / `mobile-pwa` core domain vs shared model layout | FRONTEND_STANDARDS.md → Model Standards → Model Folder Layout |
| `frontend.enums` | API-aligned enums under `core/models/enums`, role.util, const-object pattern | FRONTEND_STANDARDS.md → Model Standards → Enum Standards |
| `frontend.shared-utils` | Reused label maps, formatters, pure helpers (`core/utils`, `shared/utils`) | FRONTEND_STANDARDS.md → Model Standards → Shared helpers and reused behavior |
| `frontend.entity-services` | One service per entity under `app/core/services`; tenant-scoped read base | FRONTEND_STANDARDS.md → Service Standards |
| `frontend.api` | API integration, `buildApiV1Url`, `environment.api.baseUrl` | Coding Standards → API Integration Standards → API URL Management |
| `frontend.auth` | Authentication handling | Coding Standards → Authentication Standards |
| `frontend.uiux` | UI/UX standards | Coding Standards → UI/UX Standards |
| `frontend.styles` | Global SCSS partials, shared utilities, component-scoped CSS; mixin nesting root; `@use` not late `@import` | Coding Standards → Styling Standards; Global styles and shared utilities; SCSS mixins and nesting selectors; Stylesheet entry |
| `frontend.forms-a11y` | Label/`for`/`id` association; static `for` over `[attr.for]`; hidden file inputs; Places search containers | FRONTEND_STANDARDS.md → Form patterns → Label ↔ control association |
| `frontend.modals` | Modal shell, header close (Cross + Cancel), footer primary submit, delete dialogs | Coding Standards → UI/UX Standards → Modal patterns (`_modals.scss`) |
| `frontend.state` | State management | Coding Standards → State Management |
| `frontend.user-feedback` | User feedback + API error handling | Coding Standards → User Feedback and API Error Handling |
| `frontend.errors` | General error handling | Coding Standards → Error Handling |
| `frontend.testing` | Unit tests, spec layout; **do not auto-run suite** — user runs `npm test` manually | Coding Standards → Testing Standards (incl. **Running tests**) |
| `frontend.performance` | Performance | Coding Standards → Performance Standards |
| `frontend.security` | Security | Coding Standards → Security Standards |
| `frontend.quality` | Code quality | Coding Standards → Code Quality Standards |
| `frontend.async-await` | Sonar async: no `Promise.resolve` wrapping in `async` methods; `await` only Thenables (e.g. `WebPubSubClient.stop()` is sync); max 4 function nesting levels — prefer sequential `async`/`await` over nested `.then()` | FRONTEND_STANDARDS.md → Code Quality Standards → Async returns (Sonar), Await only Thenables (Sonar), Function nesting depth (Sonar) |
| `frontend.cognitive-complexity` | Sonar: max cognitive complexity **15** per function; extract helpers instead of deep nesting / nested ternaries | FRONTEND_STANDARDS.md → Code Quality Standards → Cognitive complexity (Sonar) |
| `frontend.void-operator` | Sonar: never use the `void` operator; use direct calls, `.catch()`, signal reads, or `_` unused params (incl. `ngOnInit` fire-and-forget) | FRONTEND_STANDARDS.md → Code Quality Standards → void operator (Sonar) |
| `frontend.regex` | Sonar: avoid super-linear / backtracking regexes; prefer string loops, bounded patterns, `DOMParser` | FRONTEND_STANDARDS.md → Code Quality Standards → Regular expressions (Sonar) |
| `frontend.a11y-aria` | Sonar: no `aria-hidden` on focusable elements; no interactive roles on non-interactive hosts; `role="presentation"` not `none`; native `<button>` for clickable cards | FRONTEND_STANDARDS.md → Code Quality Standards → Accessibility: ARIA, roles, and focus; Ghost skeleton loading |
| `frontend.a11y-keyboard` | Sonar: `(click)` on non-interactive hosts needs keyboard path; prefer `<button>` backdrops/cards; else `keydown.enter`/`space` + `tabindex="0"` | FRONTEND_STANDARDS.md → Code Quality Standards → Accessibility: click requires keyboard |
| `frontend.a11y-alt` | Sonar: no redundant “photo/image/picture/icon” in `img` `alt`, i18n **keys**, or translated alt strings | FRONTEND_STANDARDS.md → Code Quality Standards → Image `alt` text |
| `frontend.markup-lists` | Sonar: every `<li>` must sit inside `<ul>`/`<ol>` | FRONTEND_STANDARDS.md → Code Quality Standards → List markup |
| `frontend.strings` | Sonar: prefer `codePointAt` over `charCodeAt`; prefer `replaceAll` for global replacements | FRONTEND_STANDARDS.md → Code Quality Standards → `String#codePointAt`, `String#replaceAll` |
| `frontend.a11y-output` | Sonar: use `<output>` instead of `role="status"` on generic elements; keep `aria-busy` when loading; set display on the class if needed | FRONTEND_STANDARDS.md → Code Quality Standards → Semantic status regions (Sonar); UI/UX → Ghost skeleton loading |
| `frontend.angular-deprecated` | Sonar: `provideAppInitializer` (not `APP_INITIALIZER`); single `@angular/core` import; `router.currentNavigation()` (not `getCurrentNavigation`) | FRONTEND_STANDARDS.md → Code Quality Standards → Deprecated Angular APIs |
| `frontend.ts-unions` | Sonar: no `'A'\|'B'\| string`; use type aliases or plain `string` for open-ended values | FRONTEND_STANDARDS.md → Code Quality Standards → TypeScript unions and aliases |
| `frontend.nested-ternary` | Sonar: no nested ternaries; use if/else or helpers | FRONTEND_STANDARDS.md → Code Quality Standards → Nested ternaries |
| `frontend.array-at` | Sonar: prefer `array.at(-n)` over `[length - n]` | FRONTEND_STANDARDS.md → Code Quality Standards → Array `.at()` |
| `frontend.regexp-exec` | Sonar: prefer `RegExp.exec()` over `String.match()` for captures | FRONTEND_STANDARDS.md → Code Quality Standards → `RegExp.exec()` |
| `frontend.reexport` | Sonar: use `export … from` for re-exports | FRONTEND_STANDARDS.md → Code Quality Standards → Re-exports |
| `frontend.optional-chain` | Sonar: prefer `?.` / `??` / default params / `Math.max` / `indexOf` / separate `sort` statement (not chained; no `toSorted` until ES2023 lib) / no empty spreads | FRONTEND_STANDARDS.md → Code Quality Standards → Optional chaining…; Array `sort` in expressions |
| `frontend.css-duplicate` | Sonar: no duplicate selectors in one SCSS/CSS file — merge blocks | FRONTEND_STANDARDS.md → Code Quality Standards → Duplicate CSS selectors |
| `frontend.viewport-zoom` | Sonar/a11y: never `user-scalable=no` / `maximum-scale=1` in viewport meta | FRONTEND_STANDARDS.md → Code Quality Standards → Viewport zoom |
| `frontend.a11y-name` | Sonar/WCAG: interactive/regions need `aria-label` or `aria-labelledby` | FRONTEND_STANDARDS.md → Code Quality Standards → Accessible names |
| `frontend.a11y-contrast` | Sonar: text/background contrast ≥ 4.5:1 (WCAG AA) | FRONTEND_STANDARDS.md → Code Quality Standards → Color contrast |
| `frontend.a11y-native` | Sonar: prefer `<progress>`/`<dialog>`/`<select>` over ARIA role polyfills | FRONTEND_STANDARDS.md → Code Quality Standards → Native HTML over ARIA roles |
| `frontend.imports-once` | Sonar: one import statement per module path | FRONTEND_STANDARDS.md → Code Quality Standards → Module imports once |
| `frontend.css-word-break` | Sonar: no `word-break: break-word`; use `overflow-wrap` | FRONTEND_STANDARDS.md → Code Quality Standards → CSS `word-break: break-word` |
| `frontend.maps-legacy` | Sonar: avoid deprecated Maps `Marker`/`MarkerOptions`/`DirectionsService` at call sites; use `google-maps-legacy.util` (web + PWA) | FRONTEND_STANDARDS.md → Code Quality Standards → Google Maps legacy types |
| `frontend.test-matchers` | Sonar: prefer `toHaveLength` / `toBeNull` over generic equality | FRONTEND_STANDARDS.md → Code Quality Standards → Test assertions |
| `frontend.formatting` | Blank lines after blocks only; no double-spaced or fully compressed TypeScript | Coding Standards → Code Quality Standards → Source formatting (no spurious line breaks) |
| `frontend.build` | Build and deployment | Coding Standards → Build and Deployment |
| `frontend.best-practices` | General guidelines, workflow, shared styles, list pages, common patterns | Best Practices (all subsections) |
| `frontend.maintenance` | Angular version updates, code maintenance | Migration and Maintenance |

---

## Typical load recipes per task type

| Task type | Tags to load |
|---|---|
| New backend-app entity + Prisma migration | `backend.scope`, `backend.prisma`, `backend-app.structure`, `backend-app.models`, `backend-app.repositories`, `backend.security`, `backend.testing` |
| New backend-app Azure Function endpoint | `backend-app.structure`, `backend-app.functions`, `backend-app.formatting`, `backend-app.cognitive-complexity`, `backend-app.repositories`, `backend.api-docs`, `backend.testing` |
| New management-api entity + CRUD endpoint | `backend.scope`, `backend.architecture`, `backend.api`, `backend.application`, `backend.validation`, `backend.data-access`, `backend.security`, `backend.naming`, `backend.api-docs`, `backend.testing` |
| management-api bug fix | `backend.reference` plus sections matching the change area |
| agent-api (runtime / SK) change | `backend.scope`, `backend.agent-api`, `backend.quality`, `backend.api-docs` (if HTTP contract), `backend.testing` |
| event-functions (Service Bus / timer) change | `backend.scope`, `backend.event-functions`, `backend.quality`, `backend.testing` |
| tool-functions change | `backend.scope`, `backend.tool-functions`, `backend.quality`, `backend.api-docs`, `backend.testing` |
| Backend-only bug fix (any root) | `backend.scope` + tags for the root you touch |
| New Angular list + create page | `frontend.structure`, `frontend.components`, `frontend.lifecycle`, `frontend.styles`, `frontend.forms-a11y`, `frontend.services`, `frontend.api`, `frontend.uiux`, `frontend.a11y-output`, `frontend.a11y-aria`, `frontend.a11y-keyboard`, `frontend.a11y-alt`, `frontend.markup-lists`, `frontend.user-feedback`, `frontend.testing`, `frontend.best-practices` |
| New or update feature modal / dialog | `frontend.modals`, `frontend.forms-a11y`, `frontend.styles`, `frontend.components`, `frontend.uiux`, `frontend.a11y-aria` |
| New Web/PWA core entity service | `frontend.core-models`, `frontend.entity-services`, `frontend.api`, `frontend.testing` |
| New shared API enum or role guard | `frontend.enums`, `frontend.core-models`, `frontend.auth` |
| Duplicate label map or formatter in a second component | `frontend.shared-utils`, `frontend.enums` (if enum-related) |
| Angular-only bug fix | `frontend.components` + `frontend.errors` (+ anything the bug touches) |
| Add/upgrade/remove npm package in `src/admin-portal` | `frontend.dependencies` (+ `frontend.tech` if stack doc must stay aligned) |
| Code review (full workstream) | **Reviewer loads the whole file for each side**, because a review spans all concerns. Everyone else narrows. |
| Infra / Bicep / Azure DevOps YAML (DevOps workstream) | `infra.security`, `infra.bicep` → read **`INFRA_STANDARDS.md` in full** (then PRD §7, §10 as needed) |

---

## Future work (physical sharding)

When the team is ready, this virtual index is the blueprint for physically splitting the two monolith files into small per-concern files (one file per table row). Until then, the monoliths remain the source of truth and this index gives us the context-budget win without the refactor risk.
