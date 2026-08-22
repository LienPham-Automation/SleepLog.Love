# Sleep Log: hosted app (installable PWA + email capture)

Upload **all the files in this folder** to a web host, point your domain at it, and share the link.
Visitors enter their email once, then use the app; it installs to their home screen and works offline.

## Files (upload the whole folder)
- `index.html`: the app (with the email gate)
- `privacy.html`: privacy policy & disclaimer (linked from the sign-up screen and footer)
- `manifest.webmanifest`: makes it installable
- `sw.js`: offline service worker
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`: app icons

---

## STEP 1: Email capture (already set up)
Your Web3Forms key is already wired in, so signups start working the moment you deploy. Every signup is delivered to the email address registered to that key. The relevant lines near the bottom of `index.html` are:

```
var LEAD_ENDPOINT   = "https://api.web3forms.com/submit";
var LEAD_ACCESS_KEY = "0ad312d0-9087-4d60-bda7-e6f07dd9760b";
var REQUIRE_EMAIL   = true;
```

Tips:
- For a tidy, exportable list (not just inbox emails), add the **Google Sheets** integration or a **webhook** to your form in the Web3Forms dashboard.
- To switch to **MailerLite / Kit** later, change `LEAD_ENDPOINT` to your new form/endpoint URL and redeploy. Your existing signups export from Web3Forms/Sheets as a CSV you can import.
- To remove the email gate entirely, set `REQUIRE_EMAIL = false;`.
- Emails are also saved on the visitor's device and re-sent automatically if they were offline at signup.

## STEP 1b: Fill in your privacy details (before going live)
Open `privacy.html` and replace the highlighted `[placeholders]` with your name/business and a contact email. It's linked from the sign-up consent box, so it must load. The consent box already records that each person agreed to emails + the policy.

---

## STEP 2: Host it on your domain (free)
Any static host works. Easiest with a custom domain:

**Cloudflare Pages** (recommended) or **Netlify:**
1. Create a free account.
2. Drag this whole folder into their "deploy" / "drop your site" area.
3. In the site settings, add your **custom domain** (e.g. `sleeplog.yourbrand.com`) and follow their DNS steps.

That's it. Your app is live at your own address, over HTTPS (required for install + offline).

---

## STEP 3: Tell people how to install it
Share your link. Then:
- **iPhone:** open the link in **Safari** → tap **Share** → **Add to Home Screen**.
- **Android:** open in **Chrome** → menu **⋮** → **Install app** / **Add to Home Screen**.
- **Computer:** works in the browser; Chrome/Edge show an **install** icon in the address bar.

Once installed it opens full-screen like a normal app and works offline. Each person's sleep data stays private on their own device.

---

## Notes
- Test locally by opening the site through a small web server (double-clicking `index.html` from disk won't register the service worker, which needs `http/https`). On the live host everything works.
- Update the app later: replace the changed files and bump the number in `CACHE` in `sw.js` (currently `sleeplog-v2`, so use `sleeplog-v3`) so returning users get the new version.
