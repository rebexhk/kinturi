## Retrofit "The Core Escape: Top 3 Reformer Pilates Retreats in Europe for 2026"

I checked your 4 existing posts and your 12 published retreats. Only the Reformer Pilates post directly references retreats from your catalogue. Here's what overlaps:

| Post mentions | Matching retreat in your DB |
|---|---|
| #1 Ibiza "Explore Pilates & Wellness" | None |
| #2 Euphoria, Mystras Greece | None |
| #3 OM Academy, Porto | None |
| **#4 Azulfit Surya, Fuerteventura** | **Azulfit Yoga & Pilates Retreat** ✅ |

The other three posts (Solo Retreats 2026, Find the Right Active Retreat, What to Expect on Your First Active Retreat) are evergreen/general — they don't name specific retreats, so retro-fitting CTAs there would feel forced. Better to leave those and add CTAs when you write retreat-specific posts.

### Changes to the Reformer post

1. **Inline CTA button** under the Azulfit (#4) section — terracotta pill labelled **"View the Azulfit Retreat"** linking to `/retreats/azulfit-yoga-pilates-fuerteventura-spain`.

2. **Final CTA button** at the bottom (after "Ready to Find Your Flow?") — labelled **"Browse All Pilates Retreats"** linking to `/retreats?type=Pilates` (or whichever filter param matches your listing — I'll verify before inserting).

3. **Related Retreats** at the foot of the post — set `related_retreat_ids` to:
   - Azulfit Yoga & Pilates Retreat (Fuerteventura)
   - Shanti-Som Pilates Retreat (Marbella)
   - Alaya Yoga & Wine Retreat (Barcelona) — closest "European Pilates-adjacent" third option

This gives the post one in-context button, one closing button, and a 3-card "Continue exploring" strip — without inventing CTAs for retreats you don't actually list.

### How

- Update the `content` JSONB of the Reformer post to insert two `<a class="blog-cta-button">…</a>` anchors at the right positions.
- Update `related_retreat_ids` on that row with the three retreat UUIDs.

Both done via a single SQL migration. No code changes needed — the rendering and styles are already in place from the previous build.

### Want me to swap any of this?

- Different label wording on either button?
- Different third related retreat (or only show 2)?
- Also add a closing CTA to the three evergreen posts pointing to `/retreats` generally?

Approve and I'll run the migration.