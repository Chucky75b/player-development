# Player Development — Step 1: Auth

Prima parte dell'app: login, ruoli (`player` / `coach` / `admin`), routing protetto.
Next.js 15 (App Router) + TypeScript + Tailwind v4 + Supabase (Auth + RLS).

## 1. Setup locale

```bash
npm install
cp .env.local.example .env.local
```

Apri `.env.local` e incolla i valori da
**Supabase → Project Settings → API** (`Project URL` e `anon` / `publishable` key).
Non incollare mai la `service_role` key qui.

## 2. Database

Vai su **Supabase → SQL Editor** e incolla il contenuto di
`supabase/migrations/0001_init.sql`, poi esegui.

Questo crea:
- `public.profiles` (1:1 con `auth.users`, con `role`: `player` / `coach` / `admin`)
- un trigger che crea automaticamente il profilo quando un nuovo utente viene creato in `auth.users`
- `is_coach_or_admin()` / `is_admin()`, funzioni helper che riuseremo nelle prossime RLS (players, development plans, ecc.)
- le RLS policy su `profiles`: ognuno vede/modifica solo il proprio profilo, staff vede tutti i profili, solo l'admin cambia i ruoli

**Il tuo utente esiste già** in `auth.users` (l'admin che hai creato). Dopo aver
eseguito la migration, aggiornagli il ruolo manualmente una volta, sempre da SQL Editor:

```sql
update public.profiles set role = 'admin' where id = 'IL_TUO_USER_ID';
```

(`IL_TUO_USER_ID` lo trovi in **Authentication → Users**.)

## 3. Avvio locale

```bash
npm run dev
```

Vai su `http://localhost:3000` → reindirizza a `/login` se non sei autenticato,
a `/dashboard` se lo sei.

## 4. Come funziona la sicurezza

- `proxy.ts` (in Next.js 16 sostituisce `middleware.ts`, deprecato — gira
  sempre su runtime Node.js) rinfresca la sessione a ogni richiesta e
  reindirizza:
  non autenticato → `/login`; autenticato che apre `/login` → `/dashboard`.
- Le pagine **non** decidono cosa un utente può vedere: quello lo decide
  sempre Postgres tramite RLS. Il frontend chiede semplicemente i dati con
  la sessione dell'utente, e il database restituisce solo le righe permesse.
- Non c'è ancora un flusso di registrazione pubblica: per ora gli account
  li crei tu da **Supabase → Authentication → Users → Add user** (o via
  invito email). Il trigger crea automaticamente il profilo collegato.

## 5. Deploy su Vercel

Due strade, nessuna richiede `git push` da locale:

**A — Upload manuale su GitHub, poi Vercel**
1. Crea un repo vuoto su GitHub.
2. Sulla pagina del repo, usa **Add file → Upload files** e trascina il
   contenuto della cartella. Non caricare `node_modules/`, `.next/` e
   `.env.local` — sono già esclusi da `.gitignore`, ma l'upload manuale da
   browser non lo rispetta in automatico: verifica di non trascinarli.
3. Su Vercel: **New Project** → importa quel repo.
4. In **Environment Variables** aggiungi `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (gli stessi di `.env.local`).
5. Deploy.

**B — Vercel CLI, senza GitHub**
```bash
npm i -g vercel
vercel          # collega/crea il progetto, chiede le env var la prima volta
vercel --prod   # deploy in produzione
```
Utile se per ora non vuoi passare da un repo Git.

## Cosa manca volutamente (prossimi step)

- `players`, `development_plans`, `goals`, `evaluations` (schema + RLS) — la
  player dashboard con "Strength" e "Building Blocks" si appoggerà a queste.
- Coach dashboard (lista giocatori).
- Upload foto/video — rimandato, come deciso.
- Creazione account/giocatori da UI (per ora manuale da Supabase Dashboard).

## Struttura

```
app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx        pagina di login
│   │   └── actions.ts       server action signInWithPassword
│   └── forgot-password/
│       ├── page.tsx
│       └── actions.ts       server action resetPasswordForEmail
├── dashboard/
│   ├── page.tsx              placeholder post-login (conferma ruolo/sessione)
│   └── actions.ts            server action signOut
├── layout.tsx
├── page.tsx                  redirect → /dashboard (poi il middleware gestisce l'auth)
└── globals.css                design tokens (Tailwind v4 @theme)

components/login/
├── LoginForm.tsx
└── ForgotPasswordForm.tsx

lib/supabase/
├── client.ts                  client Supabase per Client Components
├── server.ts                  client Supabase per Server Components/Actions
└── proxy.ts                    refresh sessione + protezione rotte

proxy.ts                         sostituisce middleware.ts (deprecato in Next.js 16)

supabase/migrations/
└── 0001_init.sql               profiles, ruoli, RLS, trigger
```
