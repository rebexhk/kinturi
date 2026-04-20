

## Hero CTA redesign — better visual hierarchy

You're right — three buttons with one filled and two outlined reads as arbitrary. Here are three options; I'd recommend **Option A**.

### Option A (recommended): Two equal CTAs + AI as a text link below

Treat "Explore Retreats" and "Request to Book" as the two real actions, and demote "Ask Our AI" to a tertiary inline link with a sparkle icon — visually separated, clearly different in role.

```text
[ Explore Retreats → ]   [ Request to Book ]

         ✨ Or ask our AI to find it for you
```

- Both buttons same size, "Explore Retreats" filled (primary), "Request to Book" outlined (secondary).
- Below, centred: a small underlined text link (`text-primary-foreground/90`, hover underline) with the Sparkles icon — feels like a helpful nudge, not a third competing CTA.

### Option B: AI as the hero, browse options as text links

If AI search is the differentiator, lead with it:

```text
        [ ✨ Ask Our AI ]

  Browse all retreats  ·  Request to book
```

- One filled primary button for AI.
- Two underlined text links underneath separated by a dot.

### Option C: Pill-grouped trio

Keep three buttons but visually unify them inside a single rounded translucent "pill" container so they read as one segmented control rather than three loose buttons. Less recommended — busier and less premium.

### Implementation (Option A)

In `src/pages/Index.tsx` (lines 90–117), replace the CTA block with:

- Flex row of two `Button`s ("Explore Retreats" `variant="hero"`, "Request to Book" `variant="hero-outline"`).
- Below, a centred `<button>` (not `Button` component) styled as `inline-flex items-center gap-2 mt-6 text-sm text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-4 decoration-primary-foreground/40 hover:decoration-primary-foreground transition` with the Sparkles icon and text *"Or ask our AI to find it for you"*. Click handler smooth-scrolls to `#ai-search` (same as current).

No other files change.

