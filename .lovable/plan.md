

## Multiple instructors per retreat

Support multiple instructor bios on a retreat, both in the admin editor and on the public detail page. Backwards-compatible with the existing single-instructor JSONB field — no schema migration required.

### Data model

The `retreats.instructor` column is already `jsonb`. We'll start storing an array of instructor objects in a sibling key on the same column, and read either shape:

```jsonc
// New shape (preferred)
{ "list": [
    { "name": "...", "bio": "...", "certifications": [...], "photo_url": "..." },
    { "name": "...", "bio": "...", "certifications": [...], "photo_url": "..." }
] }

// Legacy shape (still read)
{ "name": "...", "bio": "...", "certifications": [...], "photo_url": "..." }
```

On load (admin + public) we normalise into an array. On save we always write the new `{ list: [...] }` shape. No DB migration, no edge function changes (the existing `admin-retreats` PUT/POST already passes `instructor` through unchanged).

### Admin editor — `src/pages/AdminRetreatEditor.tsx`

- Change `RetreatForm.instructor` type to `{ list: Array<{ name; bio; certifications; photo_url }> }`.
- Update `emptyForm` and `loadRetreat` normaliser: if loaded `instructor` has `list`, use it; else if it has a `name`, wrap the single object into `{ list: [single] }`; else `{ list: [] }`.
- Replace the single "Instructor" card with a repeatable section labelled **"Instructors"**:
  - Header row with **Add Instructor** button.
  - Each instructor rendered as its own bordered card with: Name, Bio, Photo (upload + remove, same logic as today, scoped to that index), Certifications (`ListEditor`), and a **Remove** button (trash icon) per card.
  - Helper functions `updateInstructor(index, patch)`, `addInstructor()`, `removeInstructor(index)` operating on `form.instructor.list`.
- Photo upload handler reused per-card; `path` prefix stays `instructors/`.

### Public detail page — `src/pages/RetreatDetail.tsx`

- Change `RetreatData.instructor` to `{ list: Array<{ name; bio; certifications: string[]; photo_url?: string }> }`.
- In the fetch normaliser, accept both shapes and produce `{ list: [...] }`.
- Render section heading dynamically: **"Your Instructor"** if one, **"Your Instructors"** if multiple.
- Replace the single instructor card with a `space-y-4` stack — one card per instructor using the existing card layout (photo left, name/bio/certifications right). Section is hidden when `list` is empty or all entries lack a name.

### Backwards compatibility

- Existing retreats with the legacy single-object `instructor` continue to display correctly (read as a 1-item list).
- First save after editing will rewrite that retreat into the new `{ list: [...] }` shape — transparent to the user.
- AI search edge function (`ai-retreat-search`) and any other consumers don't reference instructor fields, so no other changes needed.

### Out of scope

- No DB migration.
- No CSV import changes (instructor isn't part of the CSV schema today).
- Layout for >3 instructors uses the same vertical stack (sufficient for realistic counts; can revisit if needed).

