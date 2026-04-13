

## Redesign Homepage: AI Search as Primary Hero Element

### Overview
Restructure the homepage hero to position the AI search bar as the centrepiece, add an animated placeholder, insert a new "See It In Action" section, and update Step 1 of How It Works.

### Changes — `src/pages/Index.tsx` only

**1. Hero Section Restructure**
- Change headline to "Describe your dream retreat. Our AI finds it."
- Change subtitle to "Tell us what you're looking for — we'll find the retreat that fits you perfectly."
- Reorder elements: headline → subtitle → "✦ AI-powered search" label → search bar → CTA buttons
- Make search bar wider (`max-w-3xl`), taller (`h-16`), more visually prominent with stronger backdrop blur and border
- Add a `Sparkles` icon (from lucide-react) to the left inside the search bar, next to the existing `Search` icon on the right
- Demote CTA buttons: use smaller `size="lg"` or `size="default"`, secondary styling, placed below the search bar

**2. Animated Placeholder Text**
- Add a `useEffect` + `useState` that cycles through 4 placeholder strings every 3 seconds
- Placeholders: the four examples specified
- Use a controlled placeholder prop on the Input that updates on the interval

**3. "✦ AI-powered search" Label**
- Small text label directly above the search bar, styled with `text-sm text-primary-foreground/60 tracking-wide`

**4. New "See It In Action" Section**
- Insert between hero and "Wellness Through Movement" (Intro) section
- Heading: "Search that actually understands you"
- Subheading: "Not just keywords — describe your ideal trip and our AI does the rest."
- Static mockup: a styled input showing "Solo yoga retreat in Europe, warm weather, beginner-friendly" (non-interactive)
- Below it: 2–3 sample result cards matching existing retreat card styling, each with retreat name, location, and a "Matched because: ..." line in muted text

**5. How It Works — Step 1 Update**
- Title: "Describe What You Want"
- Description: "Just tell our AI what you're looking for in plain English — activity type, mood, budget, destination, travel dates. It understands natural language and finds retreats that actually fit you."

### Technical Details
- All changes in `src/pages/Index.tsx`
- New lucide-react imports: `Sparkles` (or `Wand2`)
- Animated placeholder uses `setInterval` in a `useEffect` with cleanup
- No database or backend changes needed

