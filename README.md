# Vinted Relister

Adds a “Relist” button on Vinted member pages to quickly clone an item across many Vinted country domains.

## What It Does
- Injects a “Relist” button next to the “Booster” button on member wardrobe pages.
- Downloads photos from the existing item, re-uploads them, and creates a new item with the same core fields (brand, size, category, price, etc.).
- Works across multiple Vinted TLDs (.fr, .de, .it, .es, .com, …). The code derives API calls from the current page’s `location.origin`.

## Important Warning
- This extension deletes the original item before creating the clone (to truly “relist”). If creation fails for any reason (network issues, anti‑bot challenges, validation errors, etc.), your original item may be deleted without being recreated.
- The script attempts to copy the deleted item’s data to your clipboard for recovery, but this is not guaranteed.
- Use at your own risk. Test with a low‑importance item first. Consider manually saving key details before relisting.

## Supported Domains
The manifest includes many Vinted country domains (FR, DE, IT, ES, PT, NL, BE, PL, CZ, SK, HU, RO, BG, LT, LV, EE, GR, SI, HR, IE, AT, CH, DK, SE, NO, FI, UK, COM). See `manifest.json` for the full list. Images are fetched from `images*.vinted.net` and `images*.vinted.com`.

## Install (Chrome / Edge)
1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable “Developer mode”.
3. Click “Load unpacked” and select this folder.
4. After changes, click “Reload” on the extension.

## Usage
- Navigate to your Vinted member wardrobe page, e.g. `https://www.vinted.de/member/<id>`.
- Find an item card that has a “Booster” button. A “Relist” button should appear below it.
- Click “Relist”. The extension will:
  1) Gather item details and photos
  2) Delete the original item
  3) Create a new item with the uploaded photos and copied fields
- On success, the page refreshes.

## Troubleshooting
- 403 or anti‑bot challenge (Cloudflare/DataDome): refresh the page, disable ad/tracker blockers for Vinted, and try again. Heavy rate limiting can also cause failures.
- “Relist” button doesn’t appear: ensure you’re on a supported country domain and on a member wardrobe page. Reload the page and the extension.
- Photos fail to upload: network hiccups or CDN responses can fail intermittently—try again after a short pause.

## How It Works (Technical)
- `content.js` injects UI, reads the current page for CSRF when possible, and falls back to loading the new‑item page to extract the token. All API endpoints are built from `location.origin` to support any Vinted TLD.
- `background.js` listens to outgoing API requests on supported Vinted domains to capture tokens like `x-csrf-token` and `x-anon-id` for reuse.
- `manifest.json` enumerates supported domains for host permissions and content script matches.

## Permissions
- `activeTab`, `scripting`: to inject the content script.
- `webRequest`: to observe request headers (CSRF/anon id capture).
- `storage`: to persist captured tokens between navigations.

## Notes & Limitations
- Site layout and APIs can change without notice, which may break the extension.
- Anti‑bot systems may block some requests unpredictably.
- The item deletion happens before creation to ensure a “fresh” relist; this is the core risk—please read the warning above.

## Development
- Edit files and click “Reload” on the extension in `chrome://extensions`.
- To add another Vinted TLD, update both `host_permissions` and `content_scripts.matches` in `manifest.json`, and extend the URL filters in `background.js` if needed.