# Sanity Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Manage EWOTE projects and images in Sanity project `zb6cjjh8` while retaining the current demo content as a safe fallback.

**Architecture:** A server-side adapter queries published project documents from the public `production` dataset and normalizes them to the existing project shape. All routes consume this adapter. A separate Studio workspace in `studio/` provides the editing UI.

**Tech Stack:** React 19, vinext, TypeScript, `@sanity/client`, Sanity Studio v4, GROQ, Cloudflare Pages.

**Spec:** This plan implements the user's approved Sanity connection using project `zb6cjjh8` and dataset `production`.

## Global Constraints

- Keep static export working.
- Do not expose an API token.
- Keep current content visible when Sanity is empty or unavailable.
- Keep videos outside Sanity.

---

### Task 1: Data adapter

**Files:** Create `lib/sanity.ts`; modify `lib/content.ts`; test `tests/sanity-integration.test.mjs`.

**Interfaces:** Produces `getProjects(): Promise<Project[]>` and `getProject(slug): Promise<Project | undefined>`.

- [ ] Write and run failing configuration, query, and fallback tests.
- [ ] Install `@sanity/client` and implement the adapter.
- [ ] Run tests and type checking.

### Task 2: Route integration

**Files:** Modify `app/page.tsx`, `app/work/page.tsx`, `app/work/work-list.tsx`, and `app/work/[slug]/page.tsx`.

**Interfaces:** Consumes the Task 1 adapter and passes `Project[]` to the client filter.

- [ ] Fetch Sanity projects for every portfolio route.
- [ ] Preserve static params and metadata generation.
- [ ] Run tests, lint, type checking, and build.

### Task 3: Studio

**Files:** Create `studio/package.json`, `studio/sanity.config.ts`, `studio/sanity.cli.ts`, and `studio/schemaTypes/*`.

**Interfaces:** Produces a Studio connected to `zb6cjjh8` and `production`.

- [ ] Define all project fields used by the website.
- [ ] Install Studio dependencies and build Studio.
- [ ] Commit the complete integration.
