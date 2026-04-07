

## Move "Kinturi's Take" to Top of Right Sidebar

### Change
Move the "Kinturi's Take" block from the left main column (between Overview and Dates) to the **top of the right sidebar** (above Facilities).

### File: `src/pages/RetreatDetail.tsx`

1. **Remove** the Kinturi's Take block from the main column (lines 255-270).
2. **Insert** it as the first item inside the sidebar `<div className="space-y-8">` (before Facilities, line 419), keeping the same styling (`bg-secondary rounded-lg p-6`, heart icon, bullet list).

No other files or database changes needed.

