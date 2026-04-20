

## Fix Newsletter Subscribe button contrast

**Problem:** In `src/components/NewsletterSignup.tsx`, the section background is `bg-primary` (sage green) and the Subscribe button uses `variant="hero"` — which is also sage-toned, making the button nearly invisible against the background.

**Fix:** Change the Subscribe button to use a high-contrast cream/light fill against the sage background, so it pops as the clear call-to-action.

### Change

In `src/components/NewsletterSignup.tsx` (the `<Button>` inside the form):

- Remove `variant="hero"`.
- Use the default button with explicit overrides: cream background, charcoal text, subtle hover darken.
- Keep the loader and arrow icon behaviour identical.

```tsx
<Button
  type="submit"
  disabled={loading}
  className="shrink-0 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
>
  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Subscribe <ArrowRight className="ml-2 h-4 w-4" /></>)}
</Button>
```

This gives a cream button with charcoal/sage text on the sage section — strong contrast, on-brand, no other files touched.

