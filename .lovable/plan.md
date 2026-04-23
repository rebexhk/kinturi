

## Move "The Kinturi Edit" link to the Company column

Relocate the newsletter reference out of the brand/tagline area and into the footer's "Company" column as a simple link.

### Files to update

#### 1) `src/components/layout/Footer.tsx`
- Remove the "Sign up for The Kinturi Edit — our newsletter for active escapes." paragraph from under the brand tagline.
- Add a new list item to the **Company** column: **"The Kinturi Edit Newsletter"**, linking to `/#newsletter`.
- Reuse the existing smooth-scroll `onClick` behaviour so clicking from the homepage scrolls to the signup section; from other pages it navigates to `/#newsletter`.
- Style: matches the existing Company column links exactly (no special underline/emphasis).

### Out of scope
- No changes to `NewsletterSignup.tsx` (the `id="newsletter"` anchor stays).
- No copy or layout changes to other footer columns.

### Expected result
The footer's Company column gains a clean "The Kinturi Edit Newsletter" link, and the brand area returns to just the logo and tagline.

