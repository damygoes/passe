# Passé. — Product Identity

> _The past, beautifully kept._

A personal travel portfolio app for individual travellers. Users create **trips**, attach **memories** (photos, notes, GPS locations), and optionally share trips and memories publicly via a personal portfolio URL.

---

## Core Principles

### Privacy-first

Everything is **private by default**. Trips and memories are only visible to the owner until explicitly made public. Sharing is an intentional act, not the default.

### Not a social network

Passé is a personal journal, not a feed. There are no followers, likes, or discovery algorithms. A public portfolio exists to share with people you choose — not to grow an audience.

### Editorial quality

Every public-facing page should feel like a beautifully designed travel book, not a generic photo gallery.

---

## Brand

**Name:** Passé. (always with the accent and closing period — never "Passe" or "PASSÉ")
**Pronunciation:** pah-SAY
**Tagline:** The past, beautifully kept.

### Voice & tone

- "Where did life take you this year?"
- "Your Morocco trip is looking beautiful."
- "47 cities. 12 countries. All yours."
- "Every memory deserves a home."

---

## Colour Palette

| Token         | Hex       | Role                                       |
| ------------- | --------- | ------------------------------------------ |
| Terracotta    | `#C4622D` | Primary — CTAs, highlights, logo           |
| Sandy Beige   | `#E8D5B0` | Secondary — backgrounds, cards, surfaces   |
| Deep Olive    | `#5C6B3A` | Accent — tags, badges, map overlays        |
| Aged Cream    | `#FAF6EE` | Background — the canvas everything sits on |
| Warm White    | `#FFFDF8` | Surface — cards, modals, elevated surfaces |
| Dark Espresso | `#2C1A0E` | Text primary — headlines, body, icons      |
| Muted Taupe   | `#8C7B6B` | Text secondary — captions, metadata        |

---

## Typography

| Role                      | Typeface         |
| ------------------------- | ---------------- |
| Display / hero text       | Playfair Display |
| Headings / section titles | Lora             |
| Body / UI text            | Helvetica        |
| Labels / dates / metadata | DM Mono          |

---

## Core Features

1. **Trip Creation** — title, date range, countries visited, cover photo
2. **Memory Logging** — photo, GPS pin, date, personal note (per memory)
3. **Interactive World Map** — countries and cities visited, highlighted and pinned
4. **Public Portfolio Page** — shareable URL at `passé.app/u/[username]` (Explorer+ only)
5. **Public Trip Pages** — individual trip pages at `/u/[username]/trips/[tripId]` with curated public memories (Explorer+ only)
6. **Personal Stats** — countries, cities, trips, years — typographic callouts, not charts
7. **PDF Memory Book Export** — export any trip as a designed PDF keepsake (Collector only)
8. **Zine Export** — export a trip as a foldable single-sheet zine keepsake (Collector only)

---

## Monetisation Tiers

### FREE — €0/month

- Up to **3 trips**
- **10 memories** per trip
- Private travel journal (no public sharing)
- Basic world map view

### EXPLORER — €4/month

- Up to **20 trips**
- **50 memories** per trip
- **Public portfolio** page at `passé.app/u/[username]`
- **Public trip pages** with curated memory sharing
- Custom URL slug
- HD photo storage

> Planned (post-MVP): annual billing at €40/year (~2 months free)

### COLLECTOR — €9/month

- **Unlimited trips**
- **Unlimited memories**
- Everything in Explorer
- **PDF memory book export**
- **Zine export**
- Priority support

> Planned (post-MVP): annual billing at €90/year (~2 months free)

---

## Public Memory Limits (per trip)

| Plan      | Public memories per trip            |
| --------- | ----------------------------------- |
| Free      | 3 (pre-select for when you upgrade) |
| Explorer  | Unlimited                           |
| Collector | Unlimited                           |

---

## Platforms

Web (Next.js 16) · iOS & Android (Expo / React Native) · API · NeonDB (PostgreSQL)

---

## What Passé. Is NOT

- A social media or review platform
- A trip planner or itinerary tool
- A booking or travel commerce app
- A group travel coordinator
- Another generic photo gallery
