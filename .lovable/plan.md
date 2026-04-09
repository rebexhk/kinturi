

## AI-Powered Retreat Search Feature

### What We're Building
A search bar on the homepage (below the two hero buttons) where customers type what they're looking for in natural language. An AI analyzes their query against all published retreats and presents results on a dedicated page with top matches and alternatives.

### Architecture

```text
User types query → Edge Function → Lovable AI (Gemini Flash)
                                      ↓
                          Fetches all published retreats
                          from DB, scores them against query
                                      ↓
                          Returns ranked results as JSON
                                      ↓
                   /search-results page displays matches
```

### Changes

**1. New Edge Function: `supabase/functions/ai-retreat-search/index.ts`**
- Accepts `{ query: string }` via POST
- Fetches all published retreats from DB (title, location, country, type, description, facilities, inclusions, menu, accommodation, duration, price, slug)
- Sends retreat data + user query to Lovable AI (google/gemini-3-flash-preview) with a system prompt instructing it to rank retreats by relevance
- Uses tool calling to return structured JSON: `{ topMatches: [...], alternatives: [...] }` with retreat slugs, match reasons, and relevance scores
- Returns results to client

**2. New Page: `src/pages/SearchResults.tsx`**
- Receives the search query via URL search params
- Calls the edge function on mount, shows a loading state with a friendly message
- Displays top match(es) as prominent cards with AI-generated "why this matches" explanation
- Shows alternative suggestions below in a smaller card grid
- Each card links to the retreat detail page
- Includes a "Search again" option

**3. Update `src/pages/Index.tsx`**
- Add a search bar component below the two hero buttons (still inside the hero overlay)
- Styled as a wide input with a search icon and placeholder text: *"I'm looking for a crossfit retreat somewhere warm with great food..."*
- On submit, navigates to `/search-results?q=<encoded query>`

**4. New Route in `src/App.tsx`**
- Add `/search-results` route pointing to `SearchResults`

### No database changes needed
All retreat data is already queryable via the existing `retreats` table and RLS policies.

