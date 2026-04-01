# Firebase + Vercel Landing Page

This folder is a standalone static marketing site for Tangred.

The source is intentionally host-agnostic:
- static HTML in `public/index.html`
- static CSS in `public/styles.css`
- static JS config in `public/site-config.js`
- static assets in `public/assets/`

That means you can deploy on Vercel now and move to Firebase Hosting later without rewriting the page itself.

## Main files

- `firebase.json`: Firebase Hosting configuration
- `vercel.json`: Vercel static-hosting configuration
- `.firebaserc.example`: copy to `.firebaserc` and set your Firebase project id
- `public/index.html`: landing page entrypoint
- `public/styles.css`: static styling
- `public/site-config.js`: set the main app URL for CTA links

## Configure

1. Update `public/site-config.js`
2. Set `appUrl` to your live main app domain

Example:

```js
window.TANLERIDA_CONFIG = {
  appUrl: 'https://your-main-app-domain.example.com'
};
```

## Deploy On Vercel Now

Recommended Vercel project settings:
- Root Directory: `landing-page`
- Framework Preset: `Other`
- Build Command: none
- Output Directory: `public`

Because the site is plain static HTML/CSS/JS, Vercel only needs to publish the `public/` folder.

## Deploy On Firebase Later

1. Copy `.firebaserc.example` to `.firebaserc`
2. Replace `your-firebase-project-id` with your Firebase project id
3. Run:

```bash
cd landing-page
firebase deploy --only hosting
```

## Recommended production setup

- Deploy this static landing page on Vercel now
- Deploy the full app in `../website` on Railway or Vercel
- Point CTA buttons from this landing page to the live app domain
- If you later move the landing page to Firebase Hosting, only hosting config changes; the page source stays the same
