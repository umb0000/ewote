# EWOTE Portfolio

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

The website runs at `http://127.0.0.1:3000`.

## Editing content

Open `https://ewote-portfolio.sanity.studio`.

- Use **Site Settings** for HOME and WORK videos, posters, copy, featured work, contact details, social links, and SEO.
- Use **Projects** for titles, dates, tags, images, descriptions, ordering, and optional YouTube URLs.
- Click **Publish** after editing. Draft changes are not included in the public website.

## Deploy Sanity Studio

```powershell
cd C:\Users\sp436\Desktop\EWOTE\ewote_web\studio
npm.cmd run deploy
```

## Build and deploy the website

Publish Sanity changes before building because the website is statically generated.

```powershell
cd C:\Users\sp436\Desktop\EWOTE\ewote_web
npm.cmd run build
npx.cmd wrangler pages deploy dist/client --project-name=ewote-55g --branch=main
```

Production: `https://ewote-55g.pages.dev`
