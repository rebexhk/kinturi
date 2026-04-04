

## Problem

Both the "How It Works" and "Featured Retreats" sections use `bg-secondary`, making them visually merge into one large block. Combined with generous `section-padding` (py-16 to py-32), the result feels spacious but undifferentiated.

## Proposed Changes

**File: `src/pages/Index.tsx`**

1. **Change the "How It Works" background to `bg-background`** (cream/white) so it visually continues from the Intro section above, creating a natural flow. The Featured Retreats section keeps `bg-secondary` (the contrasting tone), giving a clear visual break between the two.

2. **Add a subtle divider or visual separator** between the two sections. Options:
   - A thin horizontal rule in the sage/primary color
   - Or simply rely on the background color contrast (cleaner approach)

3. **Reduce spacing between the two sections** by applying tighter bottom padding on "How It Works" and tighter top padding on "Featured Retreats" — e.g., override to `pb-12 md:pb-16` and `pt-12 md:pt-16` respectively, while keeping outer edges at the standard `section-padding`.

This creates a rhythm of: **Intro (cream) → How It Works (cream, tighter bottom) → Featured Retreats (secondary, tighter top) → Newsletter**.

The alternating background colors provide clear section delineation without needing extra whitespace.

