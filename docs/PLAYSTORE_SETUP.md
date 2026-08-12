# Google Play Store Setup — Sacred Direction

Step-by-step guide to take this app from its current state to a live Play Store listing. Steps already completed in the repo are marked done; everything else needs your direct login (Expo/EAS account, Google Play Console, GitHub) so it's written as instructions for you to run.

---

## 0. Already done (in the repo)

- [x] `android.package` / `ios.bundleIdentifier` set to `com.adhyatmparivar.sacreddirection` (`app.json`) — **permanent once uploaded, do not change after step 5**
- [x] Debug "Test Notification Sound" button removed from Settings
- [x] Hi-res Play Store icon generated: `assets/store/playstore-icon-512.png` (512×512)
- [x] Feature graphic generated: `assets/store/feature-graphic-1024x500.png` (1024×500)
- [x] Privacy policy page written: `docs/privacy-policy.html`
- [x] Store listing copy drafted: `docs/play-store-listing.md` (short/full description, category, data safety answers)
- [x] `eas.json` exists with a `production` build profile and `extra.eas.projectId` already linked in `app.json`

---

## 1. Publish the privacy policy (one-time)

Play Console requires a live URL, not just a file in the repo.

1. Go to `github.com/Aphardik/jain-divine-compass` → **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: `main`, folder: `/docs` → **Save**
4. Wait 1–2 minutes, then confirm it's live at:
   `https://aphardik.github.io/jain-divine-compass/privacy-policy.html`

Keep this URL — you'll paste it into Play Console in step 4.

---

## 2. Capture screenshots

Play Console requires at least 2 phone screenshots (portrait, min 320px, max 3840px on the long edge — a normal phone screen capture is fine).

```bash
cd jain-divine-compass
npx expo start
```

Open the app in an emulator, a physical device via Expo Go, or a dev build, and capture:
1. Main compass screen (with needle/bearing visible)
2. Settings modal (prayer-time reminders list)
3. PrayerOverlay reveal (Navkar Mantra screen) — align the compass or trigger it in-app

Save the screenshots somewhere you can find them for step 4 (e.g. a new local `screenshots/` folder — no need to commit these to the repo).

---

## 3. Build the Android release with EAS

```bash
npm install -g eas-cli   # if not already installed
eas login                # sign in to the hardikkumar1702s-team Expo account
eas build --platform android --profile production
```

- This produces a signed `.aab`. Since no keystore exists locally, EAS will generate and manage one for you (Play App Signing) — accept the default when prompted.
- `eas.json` has `appVersionSource: "remote"` and `autoIncrement: true`, so `versionCode` is bumped automatically each build — no manual edits needed.
- When the build finishes, EAS prints a download link and a QR code. Note the build ID/URL — you'll need it for step 5.
- Check the build log confirms a current `targetSdkVersion` (34+, required by Play Store as of Aug 2024 policy). SDK 51 build images satisfy this by default.

---

## 4. Set up the Play Console listing

Go to [play.google.com/console](https://play.google.com/console) → **Create app**.

**Create app**
- App name: `Sacred Direction`
- Default language: English (or your preference)
- App or game: **App**
- Free or paid: **Free**
- Confirm the declarations checkboxes → **Create app**

**Store listing** (left nav → Grow → Store presence → Main store listing)
- Short description / Full description → copy from `docs/play-store-listing.md`
- App icon → upload `assets/store/playstore-icon-512.png`
- Feature graphic → upload `assets/store/feature-graphic-1024x500.png`
- Phone screenshots → upload the screenshots from step 2
- Category → **Lifestyle** (see `docs/play-store-listing.md` for the alternative)

**App content** (left nav → Policy → App content) — complete every section:
- **Privacy policy** → paste the GitHub Pages URL from step 1
- **Ads** → "No, my app does not contain ads"
- **App access** → "All functionality is available without special access" (no login required)
- **Content ratings** → fill the IARC questionnaire; answers should all be "no"/"none" (no violence, no user-generated content, no mature themes) → expect an **Everyone** rating
- **Target audience** → select an appropriate age range (not primarily aimed at children); answer the follow-up questions accordingly
- **News app** → No
- **Data safety** → use the answers in `docs/play-store-listing.md` under "Data safety summary": location collected on-device only / not shared / not stored / optional; no other data types; nothing shared with third parties

**Store settings** (left nav → Grow → Store presence → Store settings)
- App category: Lifestyle
- Contact details: your email (`hardik.panchal@email.adhyatmparivar.com`)

---

## 5. Upload the build

You have two options — pick one:

### Option A — Manual upload (simplest for a first release)
1. Left nav → **Release → Testing → Internal testing** → **Create new release**
2. Upload the `.aab` from the EAS build (download it from the link EAS printed in step 3, or from [expo.dev](https://expo.dev) under your project's Builds tab)
3. Fill in release notes → **Save** → **Review release** → **Start rollout to Internal testing**

### Option B — `eas submit` (automated, needs one-time setup)
1. In Google Cloud Console, create a service account under the same project linked to Play Console, grant it **Release manager** access under Play Console → **Users and permissions → Invite new user**, and download its JSON key
2. Save the key somewhere outside the repo (e.g. `~/keys/play-service-account.json`) — **never commit this file**
3. Edit `eas.json`:
   ```json
   "submit": {
     "production": {
       "android": {
         "serviceAccountKeyPath": "/absolute/path/to/play-service-account.json",
         "track": "internal"
       }
     }
   }
   ```
4. Run:
   ```bash
   eas submit --platform android --profile production
   ```

---

## 6. Test, then promote to production

1. On **Internal testing**, add yourself as a tester (your Google account email), install via the opt-in link, and confirm: app installs under the new package ID, location permission prompt appears, a prayer reminder fires with the custom sound.
2. Check whether your developer account is subject to Google's closed-testing requirement (newer personal accounts must run a **closed test** with 12+ opted-in testers for 14 continuous days before their first production release — Play Console will show this requirement on the Testing page if it applies to you). If required, set up a **Closed testing** track next and wait out the period; otherwise you can go straight to production.
3. **Release → Production → Create new release**, attach the same build (or promote the tested internal build directly via **Promote release**), fill in release notes.
4. Use a **staged rollout** (e.g. 20% → 50% → 100%) rather than 100% immediately, so you can halt if anything looks wrong.
5. Submit for review. First-time app reviews typically take a few hours to a few days.

---

## Reference

- Package ID: `com.adhyatmparivar.sacreddirection` (Android) / same (iOS bundle ID)
- EAS project: `hardikkumar1702s-team`, projectId `9ca8ea2f-30a7-4362-a2ce-b69474eb7cb9`
- Store copy source: `docs/play-store-listing.md`
- Privacy policy source: `docs/privacy-policy.html`
