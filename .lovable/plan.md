

## Add CTA below "How It Works"

Add a centred call-to-action block at the bottom of the "How It Works" section on the homepage, giving users a clear next step after reading the three-step process.

### Suggested CTA — recommended option

**Heading:** *Ready to find your retreat?*
**Subtext:** *Browse our curated collection or let our AI match you with the perfect active escape.*
**Buttons (side by side):**
- Primary (sage): **Browse Retreats** → `/retreats`
- Secondary (sage-outline): **Try AI Search** → scrolls back to the AI search section on the homepage (anchor) — gives users two clear paths matching steps 01 and 02.

### Alternative angles (pick one if you prefer)
1. **Partner-focused:** *"Run retreats? List with Kinturi"* → `/list-retreat` — useful if driving organiser sign-ups matters more than guest conversion at this point in the page.
2. **Single-button simplicity:** Just *"Explore All Retreats"* → `/retreats` — cleaner, less decision fatigue.

My recommendation is the **dual-button guest CTA** — it reinforces the two discovery paths just described in steps 01–02 and keeps the homepage focused on the primary audience (travellers, not hosts). The partner CTA is already covered in the footer and header.

### Implementation
- **File:** `src/pages/Index.tsx`
- Insert a new block inside the `How It Works` section, after the 3-column grid (around line 260), before the closing `</div></section>`.
- Layout: `mt-16 text-center` wrapper, heading using `heading-section` (smaller scale, e.g. `font-serif text-3xl`), supporting paragraph in `text-body`, then a flex row of two `Button` components (`variant="sage"` and `variant="sage-outline"`, `size="lg"`), stacked on mobile (`flex-col sm:flex-row gap-4 justify-center`).
- Use `Link` from `react-router-dom` (already imported) for the primary button via `asChild`. Secondary button uses an anchor link `#ai-search` (will require adding `id="ai-search"` to the existing AI search section wrapper).

### Out of scope
- No copy changes to the three steps themselves.
- No new sections or backend work.

