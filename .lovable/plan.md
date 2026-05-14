# Save Content & Grammar Skill

Create a project-scoped skill at `.workspace/skills/content-voice/SKILL.md` that the agent loads automatically whenever a prompt touches copy, content, or grammar.

## What the skill will contain

**Frontmatter**
- `name`: content-voice
- `description`: Apply when writing, editing, or reviewing any user-facing copy, microcopy, headings, blog posts, meta descriptions, or grammar across the Kinturi site.

**Voice & tone (Lonely Planet / Monocle / Condé Nast Traveller)**
- Premium travel-editorial register: confident, sensory, specific. Favours concrete detail (place names, textures, times of day) over generic adjectives ("amazing", "luxurious", "unique").
- Sentences vary in length; lead with a hook, follow with substance. No marketing fluff, no exclamation marks, no emoji.
- Active voice. Strong verbs. Show, don't tell.
- Worldly but warm - never cold or corporate. Light wit is welcome; sarcasm is not.
- Insider framing: write as a well-travelled editor recommending to a discerning friend.

**Grammar & mechanics**
- British English always (organiser, centre, colour, programme, traveller). Reinforces existing core memory.
- **Never use em dashes (—). Always use a spaced short dash ( - ) instead.** Applies to all generated copy, code comments shown to users, and edits.
- En dashes only for true ranges (2-4 nights, Mon-Fri).
- Oxford comma: off (house style; matches editorial travel press).
- Numbers: spell out one-nine, numerals for 10+; always numerals for measurements, prices, times.
- Single quotes for inline quotes; double quotes only when nested.
- Title case for H1/H2 headings; sentence case for buttons, labels, and meta descriptions.
- No trailing full stops in headings, buttons, nav items, or list items that aren't full sentences.
- Avoid: "discover", "unlock", "elevate", "curated" (overused), "journey" as a verb, "nestled", "hidden gem", "world-class".
- Prefer: precise verbs (slip into, swim out to, push through), proper nouns, time-of-day cues, sensory detail.

**Format-specific rules**
- Meta descriptions: 50-160 chars, sentence case, end with full stop, include primary keyword naturally.
- Page titles: under 60 chars, ` - Kinturi` suffix where it fits.
- Blog intros: open with a scene or a sharp observation, not a definition.
- CTAs: 2-4 words, verb-led, no full stop ("Request to book", "Plan your escape").

**Self-check before delivering copy**
1. Any em dashes? Replace with spaced short dash.
2. Any American spellings? Convert to British.
3. Any banned words? Rewrite.
4. Reads like a Condé Nast Traveller paragraph or a brochure?

## Files

- `.workspace/skills/content-voice/SKILL.md` (new)

No code or component changes. The skill loads automatically on future prompts touching content or grammar.
