

## Add "The Kinturi Edit" reference to the footer (Option A)

Add a small branded line in the footer mentioning the newsletter, linking to the homepage signup section.

### Files to update

#### 1) `src/components/NewsletterSignup.tsx`
- Add `id="newsletter"` to the `<section>` wrapper so the footer link can deep-link to it.

#### 2) `src/components/layout/Footer.tsx`
- Add a single small line under the existing brand/tagline area in the footer's left column:
  *"Sign up for **The Kinturi Edit** — our newsletter for active escapes."*
- "The Kinturi Edit" is a `Link` to `/#newsletter`, styled with a subtle underline matching other footer links.
- Style: small muted text consistent with existing footer typography.

### Out of scope
- No new database, edge function, or backend changes.
- No changes to the homepage signup copy.
- No restructuring of the footer's existing column layout.

### Expected result
"The Kinturi Edit" gains a third visible touchpoint (homepage section + About page + footer mention), with the footer link smooth-scrolling to the signup section on the homepage.

