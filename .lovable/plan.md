

## Add 3-Level Cascading Filters to Admin Retreat List

### What We're Building
Adding Country → City → Retreat Type dropdown filters to the admin dashboard's retreat list, matching the same cascading pattern already on the public Retreats page.

### Changes — `src/pages/AdminDashboard.tsx` only

1. **Expand `RetreatListItem`** to include `country` and `location` fields (already returned by the API).

2. **Add filter state** — three `useState` values: `filterCountry`, `filterCity`, `filterType`.

3. **Derive filter options with `useMemo`**:
   - Countries: unique `country` values from all retreats.
   - Cities: unique city values (first part of `location` before the comma) filtered by selected country.
   - Types: unique type values from retreats matching selected country + city.

4. **Compute `filteredRetreats`** — filter the retreats array by the active selections.

5. **Render three `Select` dropdowns** in a row between the heading and the retreat list, with a "Clear all" button. Selecting a parent level resets child levels (same cascading logic as the public page).

No backend or database changes needed — the API already returns all fields.

