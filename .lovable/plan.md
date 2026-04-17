
## Plan: About page header + CTA separation

### 1. Header restructure (`src/pages/About.tsx`, lines 11–17)
- Change `<h1>` text to **"About Kinturi"**.
- Add a subheading `<p>` directly below containing the moved text: *"We find the world's best active retreats. You just have to show up."*
- Style the subheading with a serif/lead treatment that matches the existing aesthetic (e.g. `font-serif text-xl md:text-2xl text-muted-foreground italic max-w-3xl mx-auto`) so it visually reads as a tagline rather than a second headline.

### 2. Separate the CTA from the Newsletter section
The "Ready to move?" CTA (`bg-primary`) and `NewsletterSignup` (also `bg-primary`) currently bleed together into one giant blue block. Options to fix:

**Chosen approach:** Swap the CTA section's background to the cream/secondary tone so it visually breaks from the blue newsletter block while preserving the existing two-section structure.
- Section 4 CTA → change `bg-primary` to `bg-secondary` (cream).
- Update text colours: `text-primary-foreground` → `text-foreground`, and the muted paragraph → `text-muted-foreground`.
- Update buttons from `variant="hero-outline"` (designed for dark backgrounds) to a light-background variant — `variant="default"` for "Browse Retreats" (primary sage CTA) and `variant="outline"` for "Sign Up to The Kinturi Edit".
- Newsletter section below remains untouched (still blue), giving a clear cream → blue visual break.

### Result
```
[bg-secondary]  About Kinturi  +  tagline subheading
[bg-background] The Why
[image]
[bg-secondary] Who We Serve
[bg-background] Built on Quality
[bg-secondary] Ready to move?  (CTA — now cream)
[bg-primary]   Newsletter signup (blue)
```

Two adjacent blue sections become one cream + one blue, cleanly separated.
