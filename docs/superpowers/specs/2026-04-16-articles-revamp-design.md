# Articles Page Revamp — Design Spec

## Context

The current articles pages (`/posts`, `/posts/[slug]`, `/search`) use the stock Payload CMS template: a plain "Posts" heading, uniform 3-column card grid with `rounded-none` borders, basic numbered pagination, and empty client components. There is no featured section, no category filtering, no animations, and no visual differentiation between articles. The goal is to transform these into a bold, editorial experience worthy of a civic platform for AI governance in Africa.

## Scope

Three pages are in scope:
1. **Articles listing page** — `/posts` and `/posts/page/[pageNumber]`
2. **Individual article page** — `/posts/[slug]`
3. **Search page** — `/search`

## Design Direction

Bold & editorial (The Verge-inspired). Asymmetric bento grid, dramatic hero sections, high contrast, strong typography. Moderate animations — hover effects, scroll reveals, reading progress bar — tasteful but not overwhelming.

---

## 1. Articles Listing Page (`/posts`)

### 1.1 Page Header

- Bold "Articles" title using fluid typography: `clamp(2.5rem, 5vw, 4rem)`
- Subtitle: "Insights on AI governance, policy, and digital transformation in Africa."
- Decorative geometric line divider beneath the subtitle

### 1.2 Sticky Category Filter Bar

- Horizontal scrollable row of category pill buttons
- Pills include "All" (default) plus all categories from the `categories` collection
- Active pill: filled background with accent color
- Inactive pills: outlined/ghost style
- Sticks below the site header on scroll with `position: sticky` and `backdrop-blur-sm` frosted glass effect
- URL-driven: `/posts?category=slug` for SEO and shareability
- Active indicator animated with Framer Motion `layoutId` for smooth pill-to-pill transitions
- Data fetching: server-side fetch of categories; client-side filtering updates URL params and refetches posts

### 1.3 Featured Article Hero

- Uses the existing `featured` checkbox field on Posts to determine which article is featured. Falls back to the most recent article if none are flagged as featured
- The featured article displayed as a full-width hero card
- Background image spanning full container width, `min-h-[50vh]` on desktop
- Dark gradient overlay: `bg-gradient-to-t from-black/70 via-black/40 to-transparent`
- Overlaid content (white text): category pill, large title (`clamp(1.75rem, 4vw, 3rem)`), author name, date, reading time
- The listing page data fetch must be updated to include `populatedAuthors`, `publishedAt`, `heroImage`, `content` (for reading time), and `featured` fields in the `select`
- Hover effect: card lifts slightly (`translateY(-4px)`) with shadow deepening
- Entire card is clickable, linking to the article
- On mobile: stacks vertically with reduced min-height

### 1.4 Asymmetric Bento Grid

Below the featured hero, remaining articles use an alternating grid pattern:

- **Row pattern A:** One large card (8 cols / `col-span-8`) + two stacked smaller cards (4 cols / `col-span-4`, each taking half the row height)
- **Row pattern B:** Two equal medium cards (6 cols each / `col-span-6`)
- **Row pattern C:** Three equal cards (4 cols each / `col-span-4`)
- Pattern repeats: A → B → C → A → B → C ...
- Uses CSS Grid with 12-column system (already in use via Tailwind)
- On tablet (md): 2-column layout, all cards equal
- On mobile (sm): single column, all cards equal

### 1.5 Article Card (Redesigned)

Replaces the current `Card` component for article contexts:

- `rounded-xl` corners, subtle `border border-border`, `overflow-hidden`
- **Image section:** aspect-ratio container, image fills with `object-cover`, hover zoom effect (`scale-105` over 500ms with `ease-out`)
- **Category pill:** positioned over the image (bottom-left with padding), colored per category
- **Content section (p-5):**
  - Title: bold, `line-clamp-2`
  - Description: `text-muted-foreground`, `line-clamp-2`
  - Bottom metadata row: author name (from `populatedAuthors` — no avatar available currently, just show name), formatted date, reading time estimate (calculated from word count)
- **Hover effect:** card lifts `translateY(-2px)`, shadow transitions from `shadow-sm` to `shadow-lg`, 300ms ease
- **Large card variant:** image and content side-by-side (horizontal layout) instead of stacked
- Card is fully clickable (using existing `useClickableCard` utility)

### 1.6 "Load More" Pagination

- Replaces numbered pagination entirely
- "Showing X of Y articles" counter text above the button
- Styled button: "Load More Articles"
- Client component that fetches the next page via Payload REST API (`/api/posts?page=N`)
- New articles fade in with a staggered animation (Framer Motion `staggerChildren`)
- Button disappears when all articles are loaded
- URL updates to `/posts?page=N` for back-button support (shallow routing)

### 1.7 Newsletter CTA Section

- Placed after the initial batch of articles (between first and second load)
- Visually distinct section: different background color (`bg-muted`), full container width
- Heading: "Stay informed on AI in Africa"
- Subtext + compact newsletter form (reuses existing `NewsletterForm` component with `compact` prop)
- Can be skipped/ignored by readers without disrupting the flow

---

## 2. Individual Article Page (`/posts/[slug]`)

### 2.1 Reading Progress Bar

- Fixed to the top of the viewport (`position: fixed, top: 0, z-50`)
- Thin bar (3px height) using accent color
- Width maps to scroll progress (0% at top, 100% at article end)
- Implemented with Framer Motion `useScroll` + `useSpring` for smooth interpolation
- Only visible once the user starts scrolling past the hero

### 2.2 Article Hero (Enhanced PostHero)

- Full-bleed background image, `min-h-[80vh]`, `overflow-hidden`
- Subtle parallax effect: `background-attachment: fixed` on desktop (disabled on mobile for performance)
- Dark gradient overlay: `bg-gradient-to-t from-black/80 via-black/50 to-transparent`
- Content overlaid at the bottom of the hero:
  - Category pill badge (colored)
  - Title: fluid sizing `clamp(2rem, 5vw, 3.5rem)`, white, bold
  - Author info: name only (from `populatedAuthors` — no avatar field exists on Users currently)
  - Date published + estimated reading time
- Keeps the existing data structure (`post.categories`, `post.heroImage`, `post.populatedAuthors`, `post.publishedAt`, `post.title`)
- Note: `populatedAuthors` contains `{ id, name }` only — no avatar, no bio

### 2.3 Article Body

- Centered prose column: `max-w-[48rem] mx-auto` (unchanged)
- Body text: `text-lg` (18px), `leading-relaxed` (1.75 line-height)
- **Drop cap:** `first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1` on the first paragraph
- Blockquotes: styled with left border accent, slightly wider than prose column (`-mx-4 px-8` breakout)
- Images/media blocks: can break out of prose width for visual impact
- All existing Lexical blocks (Banner, Code, MediaBlock) remain functional with enhanced styling
- Uses existing `RichText` component — styling via Tailwind prose overrides

### 2.4 Author Bio Section

- Appears after article body, separated by a horizontal divider
- Card layout: name initials circle (as avatar placeholder, since no avatar field exists) + name (bold)
- Uses data from `post.populatedAuthors` (currently only `{ id, name }`)
- Bordered card with padding, `rounded-xl`
- Designed to gracefully accommodate future avatar/bio fields if they are added to the Users collection

### 2.5 Share Bar

- **Desktop:** fixed to the left side of the viewport, vertically centered, semi-transparent background
- **Mobile:** fixed to the bottom of the viewport, horizontal row
- Icons: Twitter/X, LinkedIn, Copy Link
- Copy link shows a brief "Copied!" tooltip on click
- Share URLs constructed from the current page URL + title

### 2.6 Related Posts Section

- Heading: "Continue Reading"
- Uses the redesigned `ArticleCard` component
- 2-3 related articles in a responsive grid (1 col mobile, 2-3 cols desktop)
- Reuses existing `post.relatedPosts` data
- Scroll-triggered fade-in animation

---

## 3. Search Page (`/search`)

### 3.1 Search Header

- Bold "Search" title, same editorial fluid typography as listing page
- Centered layout

### 3.2 Enhanced Search Input

- Large prominent search field with search icon (left side)
- `rounded-xl`, subtle shadow, generous padding
- Real-time debounced search (keeps existing `useDebounce` utility)
- Loading spinner inside the input while fetching
- Clear button (X icon) when text is present
- Placeholder: "Search articles..."

### 3.3 Search Results

- Results counter: "X results for 'query'" displayed above the grid
- Uses the same redesigned `ArticleCard` component
- **Uniform 3-column grid** (not bento — search results should be scannable)
- Results fade in with staggered animation on load/query change
- On mobile: single column

### 3.4 Empty State

- When no results: centered icon/illustration, "No articles found" heading
- Suggestion text: "Try a different search term or browse all articles"
- Link button back to `/posts`

---

## 4. Shared Design Elements

### 4.1 New Dependency

- `framer-motion` — for animations (hover, scroll reveals, reading progress, staggered entrances, layout animations)

### 4.2 Color & Typography

- High contrast: dark text on light backgrounds, white text on dark hero overlays
- Category pill colors: a utility map assigning distinct colors to each category (e.g., `{ 'ai-policy': 'bg-blue-500', 'ethics': 'bg-emerald-500', 'digital-rights': 'bg-amber-500' }` with a fallback)
- Fluid typography via `clamp()` for all major headings
- Geist font throughout (already configured)
- Reading time estimate: calculated as `Math.ceil(wordCount / 200)` minutes

### 4.3 Animation Budget

| Element | Technique | Duration |
|---------|-----------|----------|
| Card hover (image zoom) | CSS `transform: scale(1.05)` | 500ms ease-out |
| Card hover (lift + shadow) | CSS `transform: translateY(-2px)` + shadow | 300ms ease |
| Scroll reveal (cards) | Framer Motion `whileInView` fade-in-up | 400ms, stagger 100ms |
| Category filter active | Framer Motion `layoutId` | 300ms spring |
| Reading progress bar | Framer Motion `useScroll` + `useSpring` | continuous |
| Load More new cards | Framer Motion `staggerChildren` fade-in | 300ms, stagger 50ms |
| Search results | Framer Motion `AnimatePresence` + fade | 300ms |

### 4.4 Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `ArticleCard` | `src/components/ArticleCard/index.tsx` | Redesigned article card with hover effects, category pills, metadata |
| `FeaturedArticleHero` | `src/components/FeaturedArticleHero/index.tsx` | Full-width hero for the latest article on listing page |
| `CategoryFilter` | `src/components/CategoryFilter/index.tsx` | Sticky horizontal filter bar with animated pills |
| `LoadMoreButton` | `src/components/LoadMoreButton/index.tsx` | Client component for Load More pagination with counter |
| `ReadingProgressBar` | `src/components/ReadingProgressBar/index.tsx` | Fixed progress bar for article pages |
| `ShareBar` | `src/components/ShareBar/index.tsx` | Floating social share buttons |
| `AuthorBio` | `src/components/AuthorBio/index.tsx` | Author card for article pages |

### 4.5 Components to Modify

| Component | File | Changes |
|-----------|------|---------|
| `PostHero` | `src/heros/PostHero/index.tsx` | Enhanced with parallax, reading time, drop cap support, new layout |
| `CollectionArchive` | `src/components/CollectionArchive/index.tsx` | Bento grid layout, uses `ArticleCard` |
| `Search` | `src/search/Component.tsx` | Enhanced input with icon, loading state, clear button |
| `RelatedPosts` | `src/blocks/RelatedPosts/Component.tsx` | Uses `ArticleCard`, fade-in animation |
| Posts listing page | `src/app/(frontend)/posts/page.tsx` | New layout with header, filter, hero, bento grid, Load More |
| Posts listing client | `src/app/(frontend)/posts/page.client.tsx` | Category filter state, Load More logic |
| Paginated posts page | `src/app/(frontend)/posts/page/[pageNumber]/` | Redirect to main listing or remove (replaced by Load More) |
| Individual post page | `src/app/(frontend)/posts/[slug]/page.tsx` | Add ReadingProgressBar, ShareBar, AuthorBio |
| Search page | `src/app/(frontend)/search/page.tsx` | New layout with enhanced search, results counter, empty state |
| Search page client | `src/app/(frontend)/search/page.client.tsx` | Loading states, animation coordination |

### 4.6 Utilities to Create

| Utility | File | Purpose |
|---------|------|---------|
| `getCategoryColor` | `src/utilities/getCategoryColor.ts` | Maps category slugs to Tailwind color classes |
| `getReadingTime` | `src/utilities/getReadingTime.ts` | Estimates reading time from post content word count |

---

## 5. Verification Plan

1. **Visual verification:** Run `bun dev`, navigate to `/posts`, `/posts/[slug]`, `/search` and verify:
   - Featured hero renders with gradient overlay and correct content
   - Bento grid alternates correctly across row patterns
   - Category filter bar sticks on scroll with blur effect
   - Card hover effects work (image zoom, lift, shadow)
   - Load More fetches and appends articles with animation
   - Reading progress bar tracks scroll accurately
   - Share bar appears fixed on desktop (left) and mobile (bottom)
   - Author bio section renders after article content
   - Search input shows loading state and clear button
   - Empty search state renders correctly
   - All pages responsive at mobile/tablet/desktop breakpoints

2. **Data verification:**
   - Category filter correctly filters posts via URL params
   - Load More pagination fetches correct pages
   - Reading time calculation is reasonable
   - Related posts still render correctly

3. **Type check:** `npx tsc --noEmit` passes

4. **Lint:** `bun lint` passes

5. **Build:** `bun run build` succeeds without errors
