---
trigger: always_on
---

# [SYSTEM: GLOBAL GOVERNANCE & CORE DIRECTIVES]

## 1. CONTEXT & ENVIRONMENT (AGNOSTIC)

- **Environment:** Multi-agent Antigravity IDE environment (Architect, Frontend, Backend, QA, Debugger).
- **Core Stack:** FRAMEWORK-AGNOSTIC. The specific technologies, frameworks, and syntax rules are dictated EXCLUSIVELY by the active `SKILL.md` (Cartridge). You must confidently apply the stack defined in your active Skill without hesitation.
- **Workspace Structure:** Agents MUST respect domain boundaries defined by the architecture (e.g., Client, Server, Shared Contracts).

## 2. MULTI-AGENT BOUNDARIES & SHARED PROTOCOL (CRITICAL)

- **Domain Isolation:** Frontend-focused agents MUST NOT modify backend code. Backend-focused agents MUST NOT modify frontend code.
- **The Shared Directory:** All shared models, DTOs, and interfaces MUST live in the cross-domain shared folder. If an agent needs a new data structure spanning both ends, it must be created here FIRST (Design Phase).
- **Agent Handoff:** If a task requires changes outside an agent's domain, the agent MUST stop, output the necessary cross-domain requirements, and explicitly instruct the Orchestrator/User to invoke the correct agent.

## 3. SPEC-DRIVEN DEVELOPMENT (SDD) & ARCHITECTURE

- **Execution Authority:** You are empowered to execute the Specify, Design, Direct, Review (EDDR) lifecycle autonomously within your specific domain. Do not wait for external approval unless crossing domain boundaries.
- **Principles:** Strict adherence to Clean Architecture, Clean Code, SOLID, DRY, and KISS. Modules/Services must follow the Single Responsibility Principle (SRP).
- **TypeScript/Strictness:** The use of `any` is STRICTLY FORBIDDEN across the entire monorepo. Use strict null checks. Prefer `unknown` or generics if dynamic types are unavoidable.
- **Commits:** Strictly adhere to Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`).

## 4. ERROR HANDLING, QA & SECURITY

- **Backend/API Errors:** Follow a strict, unified JSON format (e.g., RFC 7807 Problem Details). NEVER expose raw database stack traces to the client.
- **Frontend Errors:** Centralize via client-side network interceptors and global Error Handlers. No raw `console.log` for critical errors.
- **Security:** Code must be SAST-ready (SonarQube/ESLint strict compliance). Zero tolerance for SQLi, XSS, or known vulnerabilities. Always validate unexpected inputs.

## 5. DOCUMENTATION & REUSABILITY (THE SDD HEADER)

- **Frontend:** Mandatory JSDocs for components, services, and complex logic.
- **Backend:** Mandatory Swagger/OpenAPI documentation for all REST endpoints.
- **Mandatory SDD Signature (NEW FILES ONLY):** EVERY **NEW** file you create MUST start with a block comment containing the `@sdd` tag. This is CRITICAL for the RAG system.
- **Existing Files:** When modifying existing files, DO NOT output or alter the existing header. Focus strictly on the required logic changes.
- **Domain Adaptation (For New Files):**

  **CASE A: Logic Files (Services, Controllers, DTOs, Entities)**
  /\*\*
  - @sdd
  - [Objetivo]: Business logic it solves.
  - [I/O]: Injected dependencies, payloads, and return types/endpoints.
  - [Edge Cases]: Security, null checks, error handling.
    \*/

  **CASE B: UI, Stylesheets & Shared Components (CSS, SCSS, HTML, UI Components)**
  /\*\*
  - @sdd
  - [Objetivo]: Visual, interactive, or structural purpose.
  - [I/O - Reusabilidad]: Explicitly list exported utility CSS classes, global CSS variables, or component Inputs/Outputs/Signals.
  - [Edge Cases - UI]: Responsive breakpoints, accessibility (a11y), or empty/loading states.
    \*/

## 6. TOKEN EFFICIENCY & ANTI-HALLUCINATION (MAXIMUM PRIORITY)

- **Zero Hallucination:** If you lack context, do not understand the requirement, or do not know the exact answer, DO NOT guess or invent code/libraries. STOP and explicitly ask the user for clarification.
- **Output Protocol:** NO conversational filler ("Here is the code", "Sure"). NO pleasantries. Output ONLY the requested artifacts.
- **Surgical Code Modifications:** When modifying existing files, DO NOT output the entire file. You are STRICTLY FORBIDDEN from outputting unchanged code lines. Use `// ... existing code` and output ONLY the modified blocks wrapped in clearly commented target locations.
- **Terminal Execution Protocol:** You have full authorization to execute CLI commands autonomously using your internal `run_command` tool when scaffolding, installing dependencies, or performing system actions. Si encuentras errores de permisos (`PSSecurityException`), notifica al usuario o intenta solucionarlo mediante scripts absolutos.
- **Output Chunking Constraint:** If a code implementation exceeds 150 lines or risks hitting the token limit, you MUST split the output into progressive modular sub-tasks. No bloated monoliths.

## 7. SYSTEM DIAGNOSTICS & AUDIT PROTOCOL (OVERRIDE COMMAND)

- **The Audit Trigger:** If the user sends the exact string `/audit-agent` at any point, you MUST immediately halt all normal operations, skip code generation entirely, and output ONLY a strict JSON payload verifying your active context.
- **JSON Structure:**

  ```json
  {
    "status": "AUDIT_ACTIVE",
    "active_role": "[Identify your current role]",
    "domain_restriction": "[Identify your isolated directory]",
    "global_rules_loaded": true,
    "current_objective": "[Brief 1-sentence summary]"
  }
  ```

## 8. AUTONOMOUS RAG LIFECYCLE (CRITICAL IDE EXECUTION)

**ABSOLUTE DIRECTIVE:**
Whenever you receive a task to create, modify, analyze code, or resolve an issue, you are MANDATED to execute this 3-step lifecycle flawlessly and autonomously. Do not wait for explicit permission to query the Brain.

**STEP 1: CONTEXT RETRIEVAL (PRE-HOOK)**

- Output the terminal command to query the Semantic Brain strictly inside a bash block:
  ```bash
  npm run brain:ask "[task keywords]"
  ```
- **MANDATORY STOP (STOP & WAIT):** Immediately after closing the backticks of the bash block, YOU MUST HALT YOUR TEXT GENERATION. Do not assume the response. Wait for the IDE to intercept the block, execute it, and inject the results.

**STEP 2: EXECUTION (CODING)**

- Once context is retrieved via IDE injection, apply your specific `SKILL.md` (Cartridge), follow all SDD constraints, and generate the code.

**STEP 3: SYNCHRONIZATION (POST-HOOK)**

- Output the synchronization command strictly inside a bash block to persist the new architecture:
  ```bash
  npm run brain:sync
  ```
- **RESTRICTION:** Do not explain this process. Output the block and stop.

## 9. CI/CD & QUALITY GATES (POST-DEVELOPMENT MANDATE)

**ABSOLUTE DIRECTIVE:**
Immediately after finishing a development task, fixing a bug, or accepting a requirement, you MUST autonomously execute the following Quality Gate sequence using your `run_command` tool. Do not wait for the user to ask you to test your code.

**STEP 1: LINTING & VALIDATION**
- Execute the global linter to ensure strict code quality.
  `npm run audit:all`

**STEP 2: UNIT TESTING**
- Execute or update the unit tests for the affected domain.
  `npm run test` (in the respective backend/frontend directory)

**STEP 3: AUTOMATIC VERSIONING & CHANGELOG**
- Once linting and tests pass, automatically execute the semantic versioning script to bump the version and generate the CHANGELOG.md.
  `npm run release`
