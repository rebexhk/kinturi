

## Problem

The country filter tags don't appear on the Retreats page because the `country` column in the database is empty for all retreats, even though the `location` field contains country information (e.g. "Byron Bay, Australia").

The frontend code already supports both Type and Location filter rows — so this is a data + backend issue, not a frontend one.

## Plan

### 1. Backfill existing retreat country data
Run a database migration to extract the country from the `location` field for all existing retreats where `country` is empty. The country is the last comma-separated segment of the location string (e.g. "Tuscany, Italy" → "Italy").

```sql
UPDATE retreats
SET country = TRIM(SPLIT_PART(location, ',', ARRAY_LENGTH(STRING_TO_ARRAY(location, ','), 1)))
WHERE country = '' OR country IS NULL;
```

### 2. Ensure the admin editor saves the country on create/update
Check the `admin-retreats` edge function and `AdminRetreatEditor` to confirm that when a retreat is saved, the country is automatically extracted from the location field and stored. If not, add that logic (as described in the memory note about retreat listing logic).

---

After these two changes, the Location filter row will appear on the Retreats page showing "Australia" and "Italy" as filter options — no frontend changes needed.

