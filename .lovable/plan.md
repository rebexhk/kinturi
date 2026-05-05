# Newsletter & Email Management Plan

## Goal
Give you (a) a way to manage subscribers, (b) an automatic branded "welcome" email when someone signs up, and (c) a path to send actual newsletters via a dedicated marketing tool.

---

## Part 1 — Auto-confirmation email on signup (Lovable Cloud)

1. **Set up a verified sender domain** (e.g. `notify.kinturi.com`) via Lovable's email setup dialog. One-time DNS step at your registrar; Lovable handles SPF/DKIM/MX automatically.
2. **Scaffold transactional email infrastructure** (queue, suppression handling, unsubscribe page).
3. **Create a branded "Welcome to The Kinturi Edit" template** matching your brand (Cormorant Garamond headings, Sage/Charcoal/Cream/Terracotta palette, Inter body, British English copy).
4. **Wire `NewsletterSignup.tsx`** to invoke `send-transactional-email` immediately after a successful subscriber insert.
5. **Bonus**: Send an admin notification to you when a new subscriber joins (optional).

## Part 2 — Subscriber admin (Lovable Cloud)

1. Add a **"Subscribers" tab** in the existing Admin Dashboard showing:
   - Total count
   - Searchable/sortable table (email, signup date)
   - **CSV export** button (so you can upload to whichever newsletter tool you pick)
   - Manual delete (already covered by `admin-newsletter-unsubscribe` edge function)

## Part 3 — Sending the actual newsletter (3rd-party)

Lovable cannot send bulk marketing emails. You'll need one of:

| Option | Best for | Notes |
|---|---|---|
| **Beehiiv** | Modern, content-led newsletters | Free up to 2,500 subs, beautiful templates, growth tools |
| **Mailchimp** | Most familiar, lots of templates | Free up to 500 contacts |
| **Kit (ConvertKit)** | Creator-focused, automations | Free up to 10,000 subs |
| **Substack** | If you want a public archive too | Free, but less branded |

**Recommendation: Beehiiv or Kit** — both have clean editors, great deliverability, and free tiers that cover your likely scale.

Once you choose, I can:
- Connect their API so new signups on kinturi.com auto-sync to your provider list (no manual export needed)
- Optionally embed/link to a public archive of past Edits

---

## Decisions needed before I build

1. **Sender domain** — confirm subdomain (default `notify.kinturi.com`) and you'll need access to your DNS to add NS records.
2. **Newsletter provider** — Beehiiv, Kit, Mailchimp, or Substack? Or pick later (I'll still build Parts 1 & 2 now).
3. **Admin notification on new signup** — want one? If yes, what email address?

## Technical scope (for reference)
- New edge function templates: `newsletter-welcome` (transactional)
- Modified: `src/components/NewsletterSignup.tsx` (invoke send), `src/pages/AdminDashboard.tsx` (new tab), new `src/components/admin/SubscribersAdmin.tsx`
- New: `/unsubscribe` page (auto-created by transactional scaffold) — already exists at `src/pages/Unsubscribe.tsx`, will be reused
- No schema changes needed for Part 1 & 2
