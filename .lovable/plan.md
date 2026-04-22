
## Move homepage intro copy to About page

### Goal
Take the full homepage intro section beginning with **“Recharge Through Movement”** and the two paragraphs beneath it, remove it from the homepage, and insert it on the **About** page directly under the page title/subtitle and before the existing “The Why” section.

### Files to update

#### 1) `src/pages/Index.tsx`
- Remove the current **Intro Section** block:
  - heading: `Recharge Through Movement`
  - the two paragraphs below it
- Keep the surrounding section flow intact so **How It Works** follows directly after the AI search section.
- Review top/bottom spacing after removal so the transition into **How It Works** still feels balanced.

#### 2) `src/pages/About.tsx`
- Add a new intro section immediately below the existing header section (`About Kinturi` + subtitle).
- Reuse the exact homepage copy:
  - `Recharge Through Movement`
  - both existing paragraphs unchanged
- Style it to match the About page rhythm:
  - centred layout
  - constrained width similar to the homepage intro
  - spacing that bridges naturally into the existing “The Why” content below
- Place it above the current first content section (`The Why`).

### Content handling
- Move the copy rather than rewriting it, so wording stays consistent across the site.
- Since this is static page content, no database or backend changes are required.

### Expected result
- Homepage becomes tighter: hero → AI search → How It Works.
- About page gets stronger brand framing near the top, before the founder/story content.
- No functional changes, only page content placement and spacing adjustments.
