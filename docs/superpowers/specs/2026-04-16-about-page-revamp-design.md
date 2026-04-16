# About Page Revamp — Design Spec

## Context

The current about page (`src/app/(frontend)/about/page.tsx`) is text-heavy, flat, and visually disconnected from the bold editorial design language established on the homepage. It uses basic grid layouts with bordered cards but has no images, no animations, and no complex visual elements.

**Goal**: Revamp the about page to match the homepage's editorial quality with a sleek, tech-forward aesthetic. Incorporate 2-3 standout visual moments (animated hero gradient, count-up stats strip) while keeping the page clean and scannable.

**Design direction**: Editorial Showcase — bold uppercase typography, asymmetric layouts, alternating dark/light bands, and a few key "wow" moments.

---

## Sections

### 1. Cinematic Hero

- `min-h-[70vh]`, flex centered, `bg-background`
- CSS radial gradient glow (primary color at ~5-8% opacity) centered behind headline
- Section label: `[About]` in `text-sm tracking-widest uppercase text-primary`
- Headline: 3 lines, `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight`
  - Lines 1-2: white. Line 3 ("AFRICA'S AI FUTURE"): `text-primary`
- Subtitle: `text-lg text-muted-foreground max-w-2xl`
- Two CTA buttons: primary filled + outline
- Bottom gradient line divider

### 2. What & Why (Asymmetric Two-Column)

- `grid lg:grid-cols-12`: image 5 cols, text 7 cols
- Left: community/event photo (`next/image`, `aspect-[4/5]`, `border-t-2 border-primary`)
- Right: "What is Beyond AI?" + divider line + "Why it Exists" stacked
- Mobile: image on top, text below

### 3. Vision & Mission (Full-bleed dark band)

- `bg-card`, two equal columns
- Each card: Lucide icon (Eye/Target) + uppercase heading + accent underline + body text + `border-l-2 border-primary pl-6`

### 4. Impact Stats Strip (Animated)

- `bg-background` with `border-y border-primary/10`
- 4-column grid of large numbers with labels
- Numbers: `text-4xl md:text-5xl lg:text-6xl font-bold text-primary`
- Placeholder values: 12+ Events, 5+ Countries, 500+ Attendees, 20+ Articles
- Client component with Intersection Observer + requestAnimationFrame count-up
- No external dependencies

### 5. Strategic Objectives (Numbered editorial rows)

- Vertical stack of 3 rows separated by `border-b border-border`
- Each row: large primary-colored number ("01", "02", "03") + title + description
- More editorial than the current bordered cards

### 6. Programs (Reuse existing pattern)

- `bg-secondary`, reuse `ProgramCard` component
- Same layout and content as homepage programs section

### 7. Organizations Behind the Initiative

- Two cards with `border-t-2 border-primary` top accent
- Logo placeholder area + name + description

### 8. CTA Footer Band

- `bg-card`, centered text
- "JOIN THE MOVEMENT" heading
- Three buttons: Volunteer, Become a Sponsor, Subscribe

---

## New Components

### `src/components/AnimatedStats/index.tsx`

- Client component (`'use client'`)
- Props: `stats: Array<{ value: number; suffix?: string; label: string }>`
- Intersection Observer + requestAnimationFrame with ease-out
- Animate once only (ref flag)
- No external dependencies

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/(frontend)/about/page.tsx` | Complete rewrite with 8-section layout |
| `src/components/AnimatedStats/index.tsx` | **New** — animated count-up stats |

## Files to Reuse (no changes)

- `src/components/ProgramCard/index.tsx`
- `next/image`, `lucide-react`

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. Open `localhost:3000/about` in browser
3. Visual checks: hero glow, photo loads, stats animate on scroll, programs match homepage, responsive on mobile
4. `bun lint` — no lint errors
