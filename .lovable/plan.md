## Fix header visual glitches on scroll

The header currently shows two unwanted artefacts:
1. A thin white/translucent line appears as soon as the user scrolls (because `bg-background/95` fades in via opacity, briefly looking like a hairline before fully opaque).
2. A blue/coloured line is visible at the bottom edge of the header on light backgrounds (the `border-b border-border` divider).

### Root cause
In `src/components/layout/Header.tsx`:
- The transparent → solid switch is binary (toggled at `scrollY > 50`) but uses a 300ms `transition-all`, so the semi-transparent `bg-background/95` cross-fades, producing a flicker/line during the transition.
- A persistent `border-b border-border` is applied in the solid state, which reads as a visible line (and on certain surfaces appears bluish due to the muted border token).

### Fix

Update `src/components/layout/Header.tsx`:

1. **Remove the bottom border entirely.** Replace `border-b border-border` with a soft shadow that only appears once the header is solid (e.g. `shadow-[0_1px_8px_rgba(0,0,0,0.04)]`). This gives separation without a hard line.
2. **Use a fully opaque background** (`bg-background` instead of `bg-background/95`) so no underlying pixels show through during the fade, eliminating the flickering "white line" effect. Keep `backdrop-blur-sm` removed since opacity is now 100%.
3. **Tighten the transition** to only animate `background-color` and `box-shadow` (not `transition-all`), so the logo invert filter and other properties don't get caught in the same fade and cause perceptible artefacts.
4. **Also remove the `border-b border-border`** from the mobile menu dropdown for visual consistency, replacing with a subtle shadow.

### Out of scope
- No changes to navigation links, logo, or layout.
- No changes to the transparent-on-hero behaviour itself (still triggers at `scrollY > 50`).

### Expected result
- On hero/photo pages: header stays fully transparent (unchanged).
- On scroll: background fades cleanly to solid cream with a soft shadow — no white line, no coloured hairline.
- On light-surface pages: no visible blue/grey line under the header.
