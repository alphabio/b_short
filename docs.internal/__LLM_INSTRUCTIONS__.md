# Instructions for LLMs

- Use the knowledge base to help
- Use llm_map.txt to get a quick overview of the file system <-- this is essential reading

The following files contain method signature and comments

LLM_LITE

The following files contain the full source code

LLM_FULL

- Before making edits you must look at the full source code OR ask me to provide it for you
- strictly follow the TypeScript Style Guide
- Each file contains a header in the format `// b_path:: src/...`
  - Use this to help you navigate
- Before making any changes make sure you have a good context
- Reuse what already exists
- Don't make changes that are not required
- Don't add any new lines of code
- Don't remove any existing lines of code
- Always be on the prowl for refactoring opportunities
- Have fun!

## 🚨 CRITICAL REQUIREMENTS (Zod-First Edition)

### Schema as Source of Truth

- All domain models must start as **Zod schemas**.
- **Never** hand-write TypeScript interfaces/types if they can be derived via `z.infer<typeof Schema>`.
- If the schema encodes a closed set of values (e.g., `z.enum` or `z.union`), **derive enums** and use them across the codebase.

### Type Safety (Non-Negotiable)

- **100% type coverage**. No implicit `any` (`"noImplicitAny": true`).
- **All public APIs** and exports must reference **derived types** from schemas.
- **No** `// @ts-ignore` / `// @ts-expect-error` unless unavoidable **and** justified with a one-line reason.

### Modern TypeScript Style

- Use modern TS syntax: `string[]`, not `Array<string>` (unless generics require).
- Always prefer `readonly` for arrays/objects.
- Prefer `const` variables for immutability.
- Use `unknown` and **narrow** aggressively; `any` is forbidden.
- Schemas, derived types, and enums must be **self-documenting** — add JSDoc to public exports.

### Runtime + Static Guarantees

- **Validation**: All runtime validation must use the Zod schemas.
- **Inference**: All compile-time types must be derived from those schemas.
- **No drift** allowed between runtime contracts and static types.

---
