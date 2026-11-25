# Pam’s Mind Flights

Author website for Pam Christy: books, experiences (movement, audio, video,
downloads), news, an About page, a contact form and a mailing list. Pam
edits everything from **/admin**. No code is needed for day-to-day changes.

- **Front end:** React + Vite (single-page app), Tailwind CSS.
- **Back end:** Vercel Functions in `api/` (they all use `server/api.js`).
- **Database:** Neon Postgres. One table (`records`) is created automatically on first use, so there are no migrations.
- **Files:** Vercel Blob (public).

## Put it on Vercel (one time)

1. Upload this repository to GitHub, then in Vercel choose **Add New → Project** and import it.
   The framework preset is detected as **Vite**. Leave the build settings as they are.
2. Before you press **Deploy**, add one environment variable:
   - `ADMIN_SETUP_KEY`: paste the private setup key (from the key file you were given).
3. Deploy. The first deploy may show errors until the next two steps are done. That's expected.
4. Open the project's **Storage** tab:
   - **Neon** (Postgres): create or connect a database. Set the environment variable **prefix to `DATABASE`** and leave **Auth off**.
   - **Blob**: create a store with **Access: Public**, and check **“Add a read-write token env var”**.
5. Go to **Deployments**, open the latest one's **⋯** menu and choose **Redeploy**, so the site picks up the database and Blob settings.
6. Visit `https://your-site/api/health`. You should see `"database":true,"uploads":true,"setupKey":true`.

## First sign-in (claim the site)

Open `https://your-site/admin`. The first time, it says **Claim this website**:
choose an access code (8+ characters), type it twice, enter the setup key, and press **Set code & enter**.
From then on, only that access code is needed.

- **Change the code:** /admin → Site Settings → Access code (at the bottom).
- **Lost the code:** on the sign-in screen press **Lost your access code?**, enter the setup key and a new code.
  This signs out every open session.
- Five wrong codes (or setup keys) in 10 minutes lock that device out for 15 minutes.
  Sessions last 8 hours.

## What Pam can edit in /admin

| Section | What it controls |
|---|---|
| Books | Each book page: title, address, descriptions, cover and extra images, purchase links, formats, colours and mood, characters, homepage feature, SEO, publish/draft, order |
| Offerings | Experiences (programs, downloads, events…), linked to a book or standalone; media upload or link |
| Videos | YouTube/Vimeo links or uploaded video files, thumbnails, linked book |
| Audio | Uploaded audio with the built-in player, artwork, price/listen link |
| News | Articles with hero image, Markdown body, category, date, SEO |
| Media | Every uploaded file; upload, replace, copy link, delete |
| Messages | Contact-form messages: read, mark status, reply by email, delete |
| Newsletter | Subscribers: toggle, delete, export CSV |
| Site Settings | Name, logo, tagline, footer, About Pam (bio, story, Q&A, quote, photo), contact & social links, every homepage and page heading, Privacy Policy and Terms text, wellness disclaimer, SEO and share image, access code |

Drafts are never shown on the public site. The site starts with placeholder
items in [square brackets]. The dashboard flags them as “Needs Pam’s real content”.

Uploads: images up to 10 MB; audio, video and PDFs up to 200 MB. Files over 4 MB
go straight from the browser to Blob.

## Working on the code (optional)

```bash
npm install
cp .env.example .env    # fill in DATABASE_URL (any Postgres works) and ADMIN_SETUP_KEY
npm run dev             # http://localhost:5173, /api runs locally too
npm run build && npm run preview
```

- `src/`: the website and dashboard (React). `src/lib/site-defaults.js` holds the default text and the starter content.
- `server/`: database access, access-code security, uploads, and every API action (`server/api.js`).
- `api/`: the Vercel Functions (thin wrappers around `server/api.js`).
- `vercel.json`: sends every non-API address to the single-page app.
