# Sanity Content Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Sanity the editing source for EWOTE site copy, media, SEO, project order, and optional YouTube films while preserving the existing visual and motion system.

**Architecture:** A singleton `siteSettings` document supplies site-wide content through a central normalized adapter. Repeatable `project` documents remain the source for work entries and gain ordering and YouTube fields. Static pages consume complete fallback-safe view models and contain no GROQ or asset-resolution logic.

**Tech Stack:** Sanity Studio 4, `@sanity/client`, GROQ, React 19, Vinext/Vite, TypeScript, Node test runner, Cloudflare Pages static export

**Spec:** `docs/superpowers/specs/2026-09-09-sanity-content-architecture-design.md`

## Global Constraints

- Keep layout, responsive behavior, filters, physics, and motion in source code.
- Keep the current static-export deployment model.
- Preserve existing project documents and legacy `date` compatibility.
- Resolve Sanity assets in the adapter and return local defaults for missing fields.
- Use Sanity draft/published state; do not add a separate published boolean.
- Do not render reserved space for missing or invalid YouTube URLs.

---

### Task 1: Site Settings schema and singleton Studio navigation

**Files:**
- Create: `studio/schemaTypes/siteSettings.ts`
- Create: `studio/structure.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/schemaTypes/project.ts`
- Modify: `studio/sanity.config.ts`
- Test: `tests/sanity-site-settings.test.mjs`

**Interfaces:**
- Produces: Sanity type `siteSettings` at document ID `siteSettings`
- Produces: project fields `order: number` and `youtubeUrl: url`

- [ ] **Step 1: Write the failing schema test**

Create `tests/sanity-site-settings.test.mjs` that reads the schema sources and asserts all fixed field names, `order`, `youtubeUrl`, `S.document().documentId('siteSettings')`, and filtering of `siteSettings` from new-document actions.

```js
for (const field of ['homeVideo','homePoster','homeIntroLines','homeServiceLine','featuredProject','workVideo','workPoster','workEyebrow','workTitle','contactEyebrow','contactHeadingLines','contactMessage','contactEmail','socialLinks','seoTitle','seoDescription','seoImage']) {
  assert.match(settings, new RegExp(`name:\\s*'${field}'`));
}
assert.match(project, /name:\s*'order'/);
assert.match(project, /name:\s*'youtubeUrl'/);
assert.match(structure, /documentId\('siteSettings'\)/);
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/sanity-site-settings.test.mjs`

Expected: FAIL because the settings schema and structure file do not exist.

- [ ] **Step 3: Implement schemas and singleton structure**

Define `siteSettingsType` with the exact fields from the spec. Use `file` with `accept: 'video/*'` for videos, image hotspot options for images, a project reference for featured work, two-item validation for heading arrays, `email` for contact email, and `url` for links. Export it beside `projectType`.

Add to the project schema:

```ts
defineField({ name: 'order', title: 'Display order', type: 'number' }),
defineField({ name: 'youtubeUrl', title: 'YouTube URL', type: 'url' }),
```

Export `structure` and `singletonTypes` from `studio/structure.ts`. Configure `structureTool({ structure })` and filter singleton types from `newDocumentOptions` in `sanity.config.ts`.

- [ ] **Step 4: Verify schema tests and Studio build**

Run:

```powershell
node --test tests/sanity-site-settings.test.mjs tests/sanity-integration.test.mjs
cd studio
npm.cmd run build
```

Expected: all tests PASS and Studio build completes.

- [ ] **Step 5: Commit**

```powershell
git add studio/schemaTypes/siteSettings.ts studio/structure.ts studio/schemaTypes/index.ts studio/schemaTypes/project.ts studio/sanity.config.ts tests/sanity-site-settings.test.mjs
git commit -m "feat: add singleton Sanity site settings"
```

### Task 2: Settings view model and fallback-safe Sanity adapter

**Files:**
- Create: `lib/site-settings.ts`
- Modify: `lib/content.ts`
- Modify: `lib/sanity.ts`
- Test: `tests/site-settings.test.mjs`
- Test: `tests/sanity-integration.test.mjs`

**Interfaces:**
- Produces: `SiteSettings` type
- Produces: `defaultSiteSettings: SiteSettings`
- Produces: `getSiteSettings(): Promise<SiteSettings>`
- Extends: `Project` with `order?: number` and `youtubeUrl?: string`

- [ ] **Step 1: Write failing adapter tests**

Test field-by-field fallback with a pure exported normalizer:

```js
const result = normalizeSiteSettings({workTitle: 'ARCHIVE'});
assert.equal(result.workTitle, 'ARCHIVE');
assert.equal(result.seoTitle, defaultSiteSettings.seoTitle);
assert.equal(result.homeVideo, defaultSiteSettings.homeVideo);
```

Also assert the GROQ query resolves video file URLs using `asset->url`, image URLs, the featured project reference, `order`, and `youtubeUrl`.

- [ ] **Step 2: Verify the tests fail**

Run: `node --test tests/site-settings.test.mjs tests/sanity-integration.test.mjs`

Expected: FAIL because the settings adapter does not exist.

- [ ] **Step 3: Implement defaults and normalization**

Move editable default copy and media references into `defaultSiteSettings`. Keep `media` as a compatibility export if current tests or components still import it during this task. Normalize every scalar, array, and asset independently; never replace the whole settings object because one field is missing.

Add a singleton GROQ query with aliases such as:

```groq
"homeVideo": homeVideo.asset->url,
"homePoster": homePoster.asset->url,
"workVideo": workVideo.asset->url,
"workPoster": workPoster.asset->url,
"seoImage": seoImage.asset->url
```

Fetch `_id == "siteSettings"`, return defaults on fetch failure, and order projects with `order(coalesce(order, 9999) asc, coalesce(startDate, date) desc)`.

- [ ] **Step 4: Verify adapter tests pass**

Run: `node --test tests/site-settings.test.mjs tests/sanity-integration.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add lib/site-settings.ts lib/content.ts lib/sanity.ts tests/site-settings.test.mjs tests/sanity-integration.test.mjs
git commit -m "feat: normalize Sanity site settings"
```

### Task 3: Connect HOME, WORK, CONTACT, and SEO to settings

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/work/page.tsx`
- Modify: `app/ui.tsx`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `getSiteSettings(): Promise<SiteSettings>`
- Consumes: normalized strings, arrays, media URLs, social links, and featured project slug

- [ ] **Step 1: Write failing page-consumption tests**

Read the four component files and assert they call `getSiteSettings`, render setting fields rather than the former literals, pass Sanity video/poster URLs to `Film`, and export async `generateMetadata` using SEO fields.

```js
assert.match(home, /await getSiteSettings\(\)/);
assert.match(work, /settings\.workVideo/);
assert.match(ui, /contactHeadingLines/);
assert.match(layout, /generateMetadata/);
```

- [ ] **Step 2: Verify the tests fail**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because components still use local constants and literals.

- [ ] **Step 3: Implement settings consumption**

Fetch settings once per server page. Pass contact settings into `Footer` as props. HOME uses settings for its video, poster, introduction, service line, and featured project, falling back to the first project when the reference is missing. WORK uses its video, poster, eyebrow, and title. Convert root metadata to:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: settings.seoImage ? { images: [settings.seoImage] } : undefined,
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  };
}
```

- [ ] **Step 4: Verify page tests and full suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add app/layout.tsx app/page.tsx app/work/page.tsx app/ui.tsx tests/site-content.test.mjs
git commit -m "feat: drive site content from Sanity settings"
```

### Task 4: YouTube normalization and project detail layout

**Files:**
- Create: `lib/youtube.mjs`
- Create: `lib/youtube.d.mts`
- Modify: `app/work/[slug]/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/youtube.test.mjs`
- Test: `tests/project-detail-layout.test.mjs`

**Interfaces:**
- Produces: `getYouTubeEmbedUrl(value?: string): string | undefined`
- Consumes: `Project.youtubeUrl?: string`

- [ ] **Step 1: Write failing YouTube tests**

```js
assert.equal(getYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(getYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(getYouTubeEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(getYouTubeEmbedUrl('https://example.com/video'), undefined);
```

Add a source/CSS test asserting separate `.detail-description` and `.detail-facts` grid placement, a conditional `.youtube-embed`, and removal of `DEMO PROJECT`.

- [ ] **Step 2: Verify the tests fail**

Run: `node --test tests/youtube.test.mjs tests/project-detail-layout.test.mjs`

Expected: FAIL because the parser and new layout do not exist.

- [ ] **Step 3: Implement parser and detail presentation**

Parse URLs with `URL`, allow only `youtube.com`, `www.youtube.com`, `m.youtube.com`, and `youtu.be`, and accept 11-character IDs from `v`, `/shorts/`, or the short-link pathname. Return a `youtube-nocookie.com` embed URL.

Render the description and facts as separate grid children. Render the iframe only when the parser returns a URL:

```tsx
{embedUrl && (
  <div className="youtube-embed">
    <iframe src={embedUrl} title={`${p.title} video`} allowFullScreen />
  </div>
)}
```

Desktop CSS places description at column 1 row 1 and facts at column 2 row 2. The mobile media query collapses both to one column in document order. Use `aspect-ratio: 16 / 9` for the embed.

- [ ] **Step 4: Verify focused and full tests**

Run:

```powershell
node --test tests/youtube.test.mjs tests/project-detail-layout.test.mjs
node --test tests/*.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add lib/youtube.mjs lib/youtube.d.mts app/work/[slug]/page.tsx app/globals.css tests/youtube.test.mjs tests/project-detail-layout.test.mjs
git commit -m "feat: add project YouTube films and detail layout"
```

### Task 5: Production verification and editor handoff

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: completed Studio schema and website adapter
- Produces: exact editor and deployment instructions

- [ ] **Step 1: Add operational instructions**

Document: deploy Studio, open `https://ewote-portfolio.sanity.studio`, populate Site Settings, publish projects/settings, build the website, and deploy `dist/client` to `ewote-55g`.

- [ ] **Step 2: Run all verification**

```powershell
node --test tests/*.test.mjs
npm.cmd run build
cd studio
npm.cmd run build
```

Expected: all tests PASS and both builds complete.

- [ ] **Step 3: Commit the handoff**

```powershell
git add README.md
git commit -m "docs: explain Sanity editing and deployment"
```

- [ ] **Step 4: Deploy in editor-first order**

```powershell
cd studio
npm.cmd run deploy
cd ..
npm.cmd run build
npx.cmd wrangler pages deploy dist/client --project-name=ewote-55g --branch=main
```

Expected: Studio schema is live before editors populate the new settings, and the website deployment contains the latest published content.
