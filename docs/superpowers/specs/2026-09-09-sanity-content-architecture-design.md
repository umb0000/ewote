# EWOTE Sanity Content Architecture

## Goal

Move all routinely edited portfolio content into Sanity while keeping layout, responsive behavior, filtering, physics, and motion in the website code. Editors can change copy, media, contact details, SEO, project order, and featured work without editing source files.

## Content model

### Site settings

Create one `siteSettings` document with the fixed document ID `siteSettings`. Sanity Studio exposes it as a singleton.

- `homeVideo`: uploaded video file
- `homePoster`: image
- `homeIntroLines`: up to two short strings
- `homeServiceLine`: short string
- `featuredProject`: project reference
- `workVideo`: uploaded video file
- `workPoster`: image
- `workEyebrow`: short string
- `workTitle`: short string
- `contactEyebrow`: short string
- `contactHeadingLines`: up to two short strings
- `contactMessage`: text
- `contactEmail`: email
- `socialLinks`: `label` and `url` objects
- `seoTitle`: short string
- `seoDescription`: text
- `seoImage`: image

### Project

Keep the current `project` type and add `order` for manual ordering. Existing `title`, `slug`, `subtitle`, `startDate`, `endDate`, legacy `date`, `tags`, `images`, and `description` fields remain. Sanity's draft/published state controls visibility, so no duplicate published flag is added.

The first image remains the cover. Remaining images form the detail gallery. Legacy `date` remains readable until existing content is migrated.

## Studio structure

The Studio navigation contains `Site Settings`, opening the fixed singleton directly, and `Projects`, listing repeatable project documents. Creation actions do not offer extra `siteSettings` documents.

## Data adapter

Extend the central Sanity adapter instead of querying from components.

- `getSiteSettings()` returns normalized settings.
- `getProjects()` orders projects by `order` ascending, then by the best available date descending.
- Image fields resolve to CDN URLs.
- File fields resolve to URLs for the existing video component.
- The featured project resolves to the existing `Project` shape.

Components receive complete view data and contain no Sanity-specific query logic.

## Fallback and migration

Existing hardcoded media and copy remain as emergency defaults. Each missing Site Settings field falls back independently, so partial settings do not blank a page. Existing projects continue through the legacy `date` fallback.

## Page behavior

- HOME reads video, poster, introduction, service line, and featured project from Site Settings.
- WORK reads video, poster, eyebrow, and title from Site Settings.
- CONTACT and footer read headings, message, email, and social links from Site Settings.
- Root metadata reads SEO title, description, and optional Open Graph image during the static build.
- Existing animation, filtering, navigation, and responsive behavior remain unchanged.

## Publishing flow

The site remains a static export. Until Git-based automatic deployment is configured, the operator publishes in Sanity and runs the existing site build and Wrangler deployment. The future automated path is Sanity publish → webhook → Cloudflare Deploy Hook → Git-based build → production deployment.

## Error handling

- Missing or unreachable settings return local defaults.
- Each missing asset uses its corresponding fallback.
- An empty or failed project query returns fallback projects.
- Invalid project records are excluded during normalization.
- Video playback failures keep the existing status treatment.

## Verification

Tests cover the singleton schema, image/file/reference queries, field-level fallbacks, project ordering, legacy dates, page consumption, and existing filters and motion. Both the website and Studio production builds must pass.
