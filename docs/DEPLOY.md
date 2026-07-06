# Ahtomic Studio — Launch Runbook

The build is done (B.L.A.S.T.: Blueprint ✓, Link ✓, Architect ✓, Stylize ✓). This runbook is the **T — Trigger**: wiring the live services and shipping. Everything here is clicking through dashboards; no code changes needed.

The app runs in two modes automatically:
- **No Firebase env vars** → localStorage fallback (what you have now). Site shows default content; admin works per-browser with `admin@ahtomic.studio` / `admin`.
- **Firebase env vars present** → real mode. Content lives in Firestore, admin login is real Firebase Auth, contact form writes to the `inquiries` collection.

## 1. Firebase project (~10 min)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it `ahtomic-studio`. Google Analytics optional (skip it; you can add later).
2. **Add a Web App**: Project overview → `</>` (Web) icon → nickname `ahtomic-site` → register. **Copy the `firebaseConfig` values** it shows — these are your six `VITE_FIREBASE_*` env values.
3. **Enable Auth**: Build → Authentication → Get started → Sign-in method → **Email/Password** → Enable.
4. **Create your admin user**: Authentication → Users → **Add user**. Use your real email + a strong password. *This is the only account that should ever exist* — the security rules treat any signed-in user as the admin. Do not enable self-service sign-up flows.
5. **Enable Firestore**: Build → Firestore Database → Create database → **Production mode** (rules below will open exactly what's needed) → region `us-west1` or `us-central1`.
6. **Deploy the security rules** (from the project folder):
   ```
   npm install -g firebase-tools
   firebase login
   firebase use --add        # pick the ahtomic-studio project, alias "default"
   firebase deploy --only firestore:rules
   ```
   (Alternative: paste the contents of `firestore.rules` into Console → Firestore → Rules → Publish.)

## 2. Local smoke test (~5 min)

1. Copy `.env.example` to `.env` and fill in the six values from step 1.2.
2. `npm run dev` → open http://localhost:3000
3. Visit `/admin`, log in with your real admin account, edit something, **Save draft**, then **Publish**.
4. Reload the public site — your edit should show. Submit the contact form and confirm a doc appears in Firestore → `inquiries`.

## 3. Vercel (~10 min)

1. Push the repo to GitHub (private is fine): create an empty repo on GitHub, then
   ```
   git remote add origin https://github.com/<you>/ahtomic-studio.git
   git push -u origin master
   ```
2. [vercel.com](https://vercel.com) → Add New → Project → import the repo. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist` (defaults).
3. **Environment variables**: add all six `VITE_FIREBASE_*` values (Production + Preview).
4. Deploy. Test the `*.vercel.app` URL: pages, `/admin` login, publish flow, contact form.
5. **Domain**: Project → Settings → Domains → add your purchased domain (already on Vercel, so it attaches instantly; pick the apex + `www` redirect).
6. **Authorize the domain in Firebase Auth**: Firebase Console → Authentication → Settings → Authorized domains → add your domain (and the `*.vercel.app` URL). Login on the live site fails without this.

## 4. After launch

- **New inquiries**: check Firestore → `inquiries` (email notifications require a small Cloud Function or a Zapier/Make watch — later).
- **Content edits**: everything through `/admin`; Publish copies draft → public.
- **Redeploys**: `git push` — Vercel auto-builds. Content changes do NOT need redeploys; they're live the moment you Publish.

## Security notes

- The `VITE_FIREBASE_*` values are **not secrets** — they ship in the client bundle by design. Access control is entirely in `firestore.rules`.
- Rules recap: anyone can read published content and create a (validated) inquiry; only a signed-in user can read inquiries or write content; everything else is locked.
- The mock login (`admin@ahtomic.studio` / `admin`) only exists when Firebase env vars are absent — it is dead code in production.
