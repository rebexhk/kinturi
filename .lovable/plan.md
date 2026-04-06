

## Add "Kinturi's Take" Section to Retreat Pages

### What We're Building
A styled highlight box on each retreat product page titled "Kinturi's Take" with bullet points explaining why this retreat is special and who it's ideal for. These bullet points will be editable in the admin CMS.

### Changes

**1. Database Migration**
- Add a new column `kinturi_take` (text array, default `'{}'`) to the `retreats` table.

**2. `src/pages/RetreatDetail.tsx`**
- Add `kinturi_take` to the `RetreatData` interface as `string[]`.
- Parse it from the fetched data.
- Render a styled box (matching the site's secondary/sage palette) between the **Overview** and **Dates** sections, with a heading "Kinturi's Take" and the bullet points listed below. The section only renders if there are bullet points.

**3. `src/pages/AdminRetreatEditor.tsx`**
- Add `kinturi_take: string[]` to the `RetreatForm` interface.
- Add a textarea input in the Content tab (using the same bulk-paste pattern as inclusions) where each line becomes a bullet point, labeled "Kinturi's Take".

**4. `supabase/functions/admin-retreats/index.ts`**
- No changes needed — the function already passes the full body through to insert/update, so the new column will be handled automatically.

