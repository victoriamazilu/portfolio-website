# Navigation Migration Plan — Rafael-Style 3D Navigation

**Branch:** `feature/raf-style-navigation`  
**Reference:** [raf-fonseca/personal-website3D](https://github.com/raf-fonseca/personal-website3D) · [rafaelsf.com](https://www.rafaelsf.com/)  
**Goal:** Replace island-rotation navigation with physics-based character flight, waypoint trails, zone triggers, and single-page HTML overlays — matching Rafael's navigation model while keeping Victoria's visual identity and existing content.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current vs Target Architecture](#2-current-vs-target-architecture)
3. [Design Decisions (Resolve Before Phase 2)](#3-design-decisions-resolve-before-phase-2)
4. [Target File Structure](#4-target-file-structure)
5. [Dependencies](#5-dependencies)
6. [Phases](#6-phases)
7. [Detailed Phase Breakdown](#7-detailed-phase-breakdown)
8. [3D World & Waypoint Spec](#8-3d-world--waypoint-spec)
9. [State Management Contract](#9-state-management-contract)
10. [Mobile & Accessibility Strategy](#10-mobile--accessibility-strategy)
11. [Performance Budget](#11-performance-budget)
12. [Risk Register](#12-risk-register)
13. [Testing Checklist](#13-testing-checklist)
14. [Rollout & Rollback](#14-rollout--rollback)
15. [Timeline Summary](#15-timeline-summary)

---

## 1. Executive Summary

### What changes

| Today | After migration |
|-------|-----------------|
| React Router pages (`/`, `/experience`, `/projects`) | Single canvas page; content as overlays |
| Drag to rotate island → stage 1–4 text boxes | Fly plane through archipelago sky-space → open overlays at landmarks |
| Decorative plane orbiting island | Rapier-controlled flyable character (plane model) |
| No spatial map / no progress | Coin/waypoint trail + collection progress in navbar |
| Navbar links navigate away from 3D scene | Navbar triggers auto-flight or instant overlay (if visited) |
| Contact via stage-4 modal only | Contact zone + overlay (reuse ContactModal content) |

### What stays

- Vite + React (no Next.js migration required)
- Tailwind + neo-brutalism styling
- `constants/index.js` (experiences, projects, skills, social links)
- Existing GLB assets where reusable (`island2.glb` as static hub, `plane.glb`, `sky.glb`, `birds.glb`)
- Experience timeline, projects list, contact info content

### Estimated total effort

| Pace | Duration |
|------|----------|
| Focused full-time | 2.5–4 weeks |
| Part-time (~15 hrs/week) | 5–8 weeks |

---

## 2. Current vs Target Architecture

### Current flow

```
App (Router)
├── Navbar → NavLink to /experience, /projects
├── Home (Canvas)
│   ├── Island (drag rotate → currentStage 1–4)
│   ├── Plane (decorative orbit)
│   └── HomeInfo overlay (stage-based text)
├── Experience (full page)
└── Projects (full page)
```

### Target flow (Rafael model)

```
App (single view, no route-based page swaps)
├── Navbar (absolute, z-50)
│   ├── Logo
│   ├── Experience | Projects | Contact buttons
│   └── Waypoint progress (collected / total)
├── Skip to Destination button (during auto-flight)
├── HTML Overlays (Framer Motion)
│   ├── WorkExperiencePanel
│   ├── ProjectsPanel
│   └── ContactPanel
├── MovementInstructions toggle (manual WASD mode)
└── Canvas (full screen, always mounted)
    └── Experience (orchestrator)
        ├── Physics (Rapier)
        ├── World (sky, island2 hub, 3 landmarks)
        ├── CharacterController (plane + camera rig)
        ├── Waypoints (collectible markers along path)
        ├── ZoneTriggers (experience, projects, contact)
        └── WelcomeSign / 3D signage (optional)
```

### Reference mapping (Rafael → Victoria)

| Rafael component | Victoria equivalent |
|------------------|---------------------|
| `app/page.js` | `src/App.jsx` + `src/pages/Home.jsx` merged |
| `Experience.jsx` | `src/scene/Experience.jsx` (new) |
| `CharacterController.jsx` | `src/scene/CharacterController.jsx` (new, plane model) |
| `Coins.jsx` + `CoinContext` | `src/scene/Waypoints.jsx` + `src/contexts/WaypointContext.jsx` |
| `WorkExperienceTrigger` | `src/scene/triggers/ExperienceTrigger.jsx` |
| `MovementInstructions` | `src/components/MovementInstructions.jsx` |
| `Navbar` click handlers | `src/components/Navbar.jsx` (refactored) |
| `work_experience/page` overlay | `src/components/overlays/ExperienceOverlay.jsx` |
| `projects/page` overlay | `src/components/overlays/ProjectsOverlay.jsx` |
| `contact/page` overlay | `src/components/overlays/ContactOverlay.jsx` |

---

## 3. Design Decisions (Resolve Before Phase 2)

These must be decided in **Phase 0** before writing flight/waypoint code.

### 3.1 World layout option (pick one)

**Option A — Island archipelago ✅ CHOSEN**  
Keep the floating island as the visual centerpiece. Build an explorable sky-space with 3 floating "landmarks" (experience dock, projects platform, contact tower) connected by a visible waypoint trail. Island becomes static scenery at spawn, not the navigation mechanism.

- Pros: Reuses existing assets, unique to your site, smaller 3D authoring scope
- Cons: Need to design landmark positions manually
- **Hub asset:** `island2.glb` (already in scene via `Island2.jsx`) — larger scale, enhanced lighting/shadows; replaces original `island.glb` as the archipelago hub

**Option B — Full terrain map (Rafael parity)**  
Commission or build a large terrain GLB with collision mesh, spiral path upward.

- Pros: Closest to Rafael's feel
- Cons: Highest effort; likely 1–2 weeks of 3D authoring alone

**Decision:** _[x] Option A  [ ] Option B_ — locked **2026-05-20**

### 3.2 Waypoint visual

**Option A:** Reuse coin-style collectibles (like Rafael)  
**Option B:** Glowing orbs / stars matching sky aesthetic  
**Option C:** Small floating islands / clouds

**Decision:** _[ ] A  [ ] B  [ ] C_

### 3.3 Waypoint count

| Count | Auto-flight feel | Placement effort |
|-------|------------------|------------------|
| 8–10 | Short, snappy | Low |
| 15–20 | Scenic (Rafael-like) | High |

**Recommendation:** Start with **10 waypoints** (Phase 4), expand to 15–20 in Phase 7 polish if desired.

**Decision:** _[ ] 10  [ ] 15–20_

### 3.4 Character model

Use existing **`plane.glb`** as the flyable character (Rafael uses a plane-like character). No new model required for MVP.

### 3.5 Island rotation

**Remove entirely.** `island2.glb` hub is static world geometry (no drag/WASD rotation). All navigation via character position + zone triggers. Temporary island toggle in `Home.jsx` is dev-only and deleted in Phase 8.

---

## 4. Target File Structure

```
src/
├── App.jsx                          # Single-page shell, overlay state
├── main.jsx
├── contexts/
│   └── WaypointContext.jsx          # collected waypoints, progress %
├── constants/
│   ├── index.js                     # existing content (unchanged)
│   └── navigation.js                # NEW: waypoint coords, zone positions, paths
├── scene/
│   ├── Experience.jsx               # 3D orchestrator, imperative ref API
│   ├── CharacterController.jsx      # Rapier flight + camera + path following
│   ├── Character.jsx                # Plane GLB + animations wrapper
│   ├── World.jsx                    # Sky, island, landmarks, lighting
│   ├── Waypoints.jsx                # Collectible markers + collision
│   ├── triggers/
│   │   ├── ExperienceTrigger.jsx
│   │   ├── ProjectsTrigger.jsx
│   │   └── ContactTrigger.jsx
│   └── signs/
│       └── WelcomeSign.jsx          # Optional 3D intro sign at spawn
├── components/
│   ├── Navbar.jsx                   # Buttons + progress bar (no NavLink pages)
│   ├── MovementInstructions.jsx     # Manual controls toggle
│   ├── SkipNavigationButton.jsx     # Shown during auto-flight
│   ├── Loader.jsx
│   └── overlays/
│       ├── OverlayShell.jsx         # Shared Framer Motion wrapper
│       ├── ExperienceOverlay.jsx    # Extracted from pages/Experience.jsx
│       ├── ProjectsOverlay.jsx      # Extracted from pages/Projects.jsx
│       └── ContactOverlay.jsx       # From ContactModal content
├── hooks/
│   └── useNavigation.js             # Optional: centralize overlay + visit state
├── pages/
│   └── Home.jsx                     # Canvas + KeyboardControls + layout
└── models/                          # DEPRECATED after migration
    ├── Island.jsx                   # REMOVE (superseded by Island2)
    ├── Island2.jsx                  # → scene/World.jsx (static island2 hub)
    ├── Plane.jsx                    # → scene/Character.jsx
    ├── Sky.jsx                      # → scene/World.jsx
    ├── Bird.jsx                     # Keep as ambient decoration
    └── GestureHint.jsx              # REMOVE
```

**Files to delete after migration:**  
`HomeInfo.jsx`, `BackButton.jsx`, `pages/Experience.jsx`, `pages/Projects.jsx` (content moved to overlays), island rotation logic in `Island.jsx` / `Island2.jsx`, island toggle UI in `Home.jsx`.

---

## 5. Dependencies

Add to `package.json`:

```json
{
  "@react-three/rapier": "^1.3.0",
  "framer-motion": "^11.0.0"
}
```

Already installed (keep):  
`@react-three/fiber`, `@react-three/drei`, `canvas-confetti`

Optional later:  
`@react-spring/three` — may remove if unused after migration

**KeyboardControls** comes from `@react-three/drei` — no extra package.

---

## 6. Phases

| Phase | Name | Duration | Depends on |
|-------|------|----------|------------|
| **0** | Discovery & design lock | 1–2 days | — |
| **1** | Foundation & architecture | 2–3 days | Phase 0 |
| **2** | Physics character flight | 4–6 days | Phase 1 |
| **3** | World, zones & waypoints | 3–5 days | Phase 2 |
| **4** | Auto-navigation & navbar | 3–4 days | Phase 3 |
| **5** | Overlays & Framer Motion | 2–3 days | Phase 1 |
| **6** | Manual mode & instructions UI | 1–2 days | Phase 2, 4 |
| **7** | Polish, mobile, performance | 3–5 days | Phase 4, 5, 6 |
| **8** | Cleanup, QA & deploy | 1–2 days | Phase 7 |

**Total:** ~20–32 working days

Phases 5 and 2–3 can partially overlap once Phase 1 is done.

---

## 7. Detailed Phase Breakdown

---

### Phase 0 — Discovery & Design Lock
**Duration:** 1–2 days  
**Owner:** Victoria + implementer

#### Tasks

- [ ] Play through [rafaelsf.com](https://www.rafaelsf.com/) and note: navbar flow, auto-flight, skip, manual toggle, zone entry, overlay close behavior
- [x] Decide world layout (Section 3.1): **Option A — island archipelago**
- [ ] Sketch waypoint path on paper — spawn at hub island → experience dock → projects platform → contact tower
- [ ] Open `island2.glb`, `plane.glb` in Blender or https://gltf-viewer.donmccurdy.com/ — note scale and origin (hub island currently ~3× original scale in scene)
- [ ] Define spawn point and 3 zone center coordinates (rough `[x, y, z]`)
- [ ] Confirm Contact is a third navbar item (Rafael has Experience / Projects / Contact)
- [ ] Stash or commit current WIP changes on branch before Phase 1 refactor

#### Deliverables

- `docs/world-layout-sketch.png` (or Figma) with waypoint path
- `src/constants/navigation.js` stub with placeholder coordinates
- Design decisions checked off in Section 3

#### Acceptance criteria

- Coordinates documented for spawn + 3 zones + at least 10 waypoint slots
- Team agrees island rotation is removed, plane is the player

---

### Phase 1 — Foundation & Architecture
**Duration:** 2–3 days  
**Depends on:** Phase 0

#### Tasks

- [ ] Install `@react-three/rapier`, `framer-motion`
- [ ] Create `src/contexts/WaypointContext.jsx` (mirror Rafael's `CoinContext`)
- [ ] Create `src/constants/navigation.js` — single source of truth for:
  - `SPAWN_POSITION`
  - `WAYPOINT_POSITIONS[]`
  - `ZONE_POSITIONS.experience | projects | contact`
  - `PATHS.experience | projects | contact` (slices of waypoint array)
- [ ] Refactor `App.jsx`:
  - Remove nested React Router page routes for Experience/Projects
  - Keep optional hash routes (`/#experience`) for shareable links — stretch goal
  - Lift overlay booleans: `showExperience`, `showProjects`, `showContact`
  - Lift mode booleans: `isManualMode`, `isAutomaticMode`, `isCharacterPathing`
  - Add `experienceRef` for imperative 3D navigation
- [ ] Restructure `Home.jsx`:
  - Full-screen canvas
  - Wrap canvas in `<KeyboardControls map={keyboardMap} enabled={isManualMode}>`
  - Mount overlay components conditionally above canvas
- [ ] Create empty `scene/Experience.jsx` shell with `<Physics>` wrapper
- [ ] Refactor `Navbar.jsx`:
  - Replace `NavLink` with `onClick` handlers
  - Add Contact button
  - Prepare slot for progress bar (wire in Phase 4)

#### Deliverables

- App compiles; canvas renders empty physics world
- Navbar buttons log to console (stub handlers)
- No broken routes — old `/experience` URLs redirect to `/` or show overlay via query param

#### Acceptance criteria

- `npm run dev` runs without errors
- Single page; no full-page navigation on navbar click
- `constants/navigation.js` imported nowhere yet but populated

---

### Phase 2 — Physics Character Flight
**Duration:** 4–6 days  
**Depends on:** Phase 1

#### Tasks

- [ ] Create `scene/Character.jsx` — load `plane.glb`, play propeller animation when moving
- [ ] Create `scene/CharacterController.jsx` — port/adapt from Rafael's controller:
  - Rapier `RigidBody` + `CapsuleCollider`, `name="character"`
  - `useKeyboardControls()` for WASD + Space (up) + Shift (down) when `isManualMode`
  - Flight speeds: tune `FLIGHT_SPEED`, `VERTICAL_SPEED`, `ROTATION_SPEED`
  - Camera rig: follow character with lerp (third-person behind/beside)
  - Expose via `useImperativeHandle`:
    - `getCurrentPosition()`
    - `getLastCollectedWaypointPosition()`
    - `moveToPosition(target, callback, waypoints)`
    - `skipToEndOfPath()`
- [ ] Implement path-following mode:
  - `isFollowingPath` state
  - Move toward waypoint[i], advance when within threshold (~2 units)
  - On path complete → invoke callback
  - Interrupt path if manual input detected (when manual mode on)
- [ ] Side-view camera during auto-flight (match Rafael behavior)
- [ ] Spawn character at `SPAWN_POSITION` on load
- [ ] Remove old `models/Plane.jsx` orbit logic and island drag handlers

#### Deliverables

- Flyable plane in empty sky with manual controls (toggle forced on for dev testing)
- Camera follows smoothly; no physics jitter

#### Acceptance criteria

- WASD + Space + Shift move the plane in 3D space
- Plane faces movement direction; propeller animates while moving
- Character does not fall through floor (if floor collider exists) or drifts infinitely
- 60fps on desktop (M1/M2 Mac or equivalent)

#### Reference files

- Rafael: `components/CharacterController.jsx` (~650 lines) — primary port source
- Victoria: `models/Plane.jsx` — animation hook `"Take 001"`

---

### Phase 3 — World, Zones & Waypoints
**Duration:** 3–5 days  
**Depends on:** Phase 2

#### Tasks

- [ ] Create `scene/World.jsx`:
  - Sky/environment (reuse `Sky.jsx` logic or drei `Environment`)
  - Static **`island2.glb` hub** at spawn (port material/lighting from `Island2.jsx`; no rotation interaction)
  - 3 landmark meshes at zone positions: experience dock, projects platform, contact tower (boxes/GLBs — author in Phase 0 sketch)
  - Lighting: directional + ambient + hemisphere (match current aesthetic)
- [ ] Add Rapier static colliders:
  - Invisible boundary box so player cannot fly infinitely away
  - Optional: simple ground plane far below
- [ ] Create `scene/Waypoints.jsx`:
  - Render marker at each `WAYPOINT_POSITIONS[i]`
  - Sensor collider on each; on character intersection → `collectWaypoint(id)`
  - Collection animation (spin faster, float up, fade — port from Rafael `Coins.jsx`)
  - Hide/disable after collected
- [ ] Create trigger components in `scene/triggers/`:
  - Rapier sensor cuboid at each zone position
  - `onEnter` / `onExit` when `rigidBodyObject.name === 'character'`
  - Call parent callbacks: `onExperienceChange(true/false)` etc.
- [ ] Create `scene/signs/WelcomeSign.jsx` — 3D text or sprite near spawn ("Fly to explore" / controls hint)
- [ ] Keep `Bird.jsx` as ambient decoration (no collision)

#### Deliverables

- Explorable sky-space with visible waypoints and 3 zone landmarks
- Flying into a zone toggles overlay state (wired to console first, overlays in Phase 5)

#### Acceptance criteria

- All waypoints collectible once; state persists in `WaypointContext` for session
- Entering experience zone sets `showExperience` true; exiting sets false
- Waypoint positions match `constants/navigation.js` exactly (same file used by controller paths)

---

### Phase 4 — Auto-Navigation & Navbar
**Duration:** 3–4 days  
**Depends on:** Phase 3

#### Tasks

- [ ] Implement `scene/Experience.jsx` orchestrator (Rafael's `Experience.jsx` pattern):
  - `visitedAreas: { experience, projects, contact }`
  - `useImperativeHandle` methods:
    - `moveToWorkExperience()`
    - `moveToProjects()`
    - `moveToContact()`
    - `skipAutomaticNavigation()`
  - If zone already visited → open overlay immediately, no flight
  - Else → build path from `PATHS.*`, resume from last collected waypoint if applicable
  - Set `isAutomaticMode` true during flight; false when manual toggle on
- [ ] Wire `Navbar` buttons to `experienceRef.current.moveTo*()`
- [ ] Add progress UI to navbar:
  - `collectedWaypoints.length / totalWaypoints`
  - Progress bar
  - Confetti at 100% (reuse `canvas-confetti` from ContactModal)
- [ ] Create `SkipNavigationButton.jsx`:
  - Visible when `isAutomaticMode && isCharacterPathing`
  - Framer Motion enter/exit
  - Calls `skipAutomaticNavigation()` — teleport to path end, collect skipped waypoints, snap camera
- [ ] Implement skip logic in `CharacterController.skipToEndOfPath()` (port from Rafael)

#### Deliverables

- Full Rafael-style navbar navigation without manual flying
- Skip button works mid-flight

#### Acceptance criteria

- Click Experience → plane auto-flies waypoint path → experience overlay opens
- Second click Experience → overlay opens instantly (visited)
- Skip teleports to destination; waypoints along path marked collected
- Progress bar updates as waypoints collected

---

### Phase 5 — Overlays & Framer Motion
**Duration:** 2–3 days  
**Depends on:** Phase 1 (can parallel Phase 2–4)

#### Tasks

- [ ] Create `components/overlays/OverlayShell.jsx`:
  - Fixed full-screen or centered panel over canvas
  - Framer Motion: fade + slide in/out
  - Close button; click-outside optional
  - Scrollable content area
  - `z-index` above canvas, below navbar
- [ ] Extract `ExperienceOverlay.jsx` from `pages/Experience.jsx`:
  - Remove `BackButton` → close overlay instead
  - Remove page-level `max-container` top padding for navbar (overlay handles inset)
  - Keep timeline, skills, social links
- [ ] Extract `ProjectsOverlay.jsx` from `pages/Projects.jsx`:
  - Same treatment
  - Fix external links (`<a href>` not React Router `Link` for GitHub/live URLs)
- [ ] Extract `ContactOverlay.jsx` from `ContactModal.jsx`:
  - Unify contact UX (navbar Contact + zone trigger use same panel)
  - Keep confetti on first open optional
- [ ] Wire overlay open/close to zone triggers and navbar
- [ ] Closing overlay does NOT reset character position

#### Deliverables

- All portfolio content accessible as overlays
- Smooth open/close animations

#### Acceptance criteria

- Overlays readable and scrollable on 1280px and 375px widths
- Close returns to 3D scene with character at current position
- No `BackButton` / router dependency in overlays

---

### Phase 6 — Manual Mode & Instructions UI
**Duration:** 1–2 days  
**Depends on:** Phase 2, 4

#### Tasks

- [ ] Create `MovementInstructions.jsx` (port from Rafael):
  - Toggle: "Manual Controls" on/off
  - When off: keyboard disabled, navbar auto-flight only
  - When on: show WASD / Space / Shift legend
  - Prevent Space scroll when manual mode active
- [ ] Default manual mode **off** for first-time visitors (Rafael default)
- [ ] Auto-flight interrupted if user enables manual mid-flight — define behavior:
  - **Recommended:** finishing current path segment then stop, or immediate handoff on first keypress (Rafael: immediate on keypress)
- [ ] Remove old gesture hint footer from Home

#### Deliverables

- Discoverable manual flight for curious visitors
- Clear instructions UI bottom corner

#### Acceptance criteria

- Manual toggle enables/disables KeyboardControls
- Manual flight reaches zones and opens overlays same as auto-flight
- Space does not scroll page when manual mode on

---

### Phase 7 — Polish, Mobile & Performance
**Duration:** 3–5 days  
**Depends on:** Phase 4, 5, 6

#### Tasks

- [ ] **Mobile:** No keyboard — navbar-only navigation + skip; optional on-screen hint "Tap Experience to fly there"
- [ ] **Mobile:** Reduce shadow quality, lower `dpr`, test on iOS Safari
- [ ] **Performance:** Lazy-load heavy GLBs; compress textures if needed
- [ ] **Performance:** Profile Rapier collider count; use sensors only where needed
- [ ] Tune flight speeds and camera lerp for comfort
- [ ] Add loading screen until critical assets ready (`Loader.jsx`)
- [ ] Expand waypoints 10 → 15–20 if desired (scenic route)
- [ ] Add 3D MessageSigns at zone landmarks (like Rafael's signs)
- [ ] `prefers-reduced-motion`: skip auto-flight animations, open overlays directly
- [ ] SEO: keep `index.html` meta; overlays don't need separate URLs for MVP
- [ ] Optional: `?section=experience` query param opens overlay + triggers flight on load

#### Deliverables

- Acceptable mobile experience
- Lighthouse performance documented (baseline vs after)

#### Acceptance criteria

- Usable on iPhone Safari (navbar navigation at minimum)
- No sustained < 30fps on mid-range laptop
- Reduced-motion path works

---

### Phase 8 — Cleanup, QA & Deploy
**Duration:** 1–2 days  
**Depends on:** Phase 7

#### Tasks

- [ ] Delete deprecated files: `HomeInfo.jsx`, `GestureHint.jsx`, old `pages/Experience.jsx`, `pages/Projects.jsx`, island rotation code
- [ ] Remove unused deps (`@react-spring/three` if unused, `@emailjs/browser` if unused)
- [ ] Update README with new controls and stack
- [ ] Full regression pass (Testing Checklist below)
- [ ] Merge `feature/raf-style-navigation` → `main`
- [ ] Deploy to vmazilu.ca

#### Deliverables

- Clean codebase, updated docs, production deploy

---

## 8. 3D World & Waypoint Spec

### Approved archipelago layout (Option A)

Coordinate system: Y-up. Character spawns near the **island2 hub**; three satellite landmarks radiate outward through sky-space. The hub is static scenery — navigation is character flight + waypoint collection, not island rotation.

```
                    [Contact Tower]
                    waypoint 8-9
                         |
              [Projects Platform]
              waypoint 5-7
                    /
         [Island2 Hub — spawn]
         waypoint 0-2
              \
         [Experience Dock]
         waypoint 3-4
```

**Landmarks (to author in Phase 3):**

| Landmark | Zone | Visual direction from hub |
|----------|------|---------------------------|
| Island2 hub | Spawn | Center — existing `island2.glb` |
| Experience dock | Experience overlay | Lower-left / southwest |
| Projects platform | Projects overlay | Upper-right / northeast |
| Contact tower | Contact overlay | Upper-center / north |

### Starter coordinates (placeholder — tune in Phase 0)

```js
// src/constants/navigation.js

export const SPAWN_POSITION = [0, 10, 0];

export const WAYPOINT_POSITIONS = [
  [0, 12, 0],      // 0 — spawn ring
  [-5, 14, 10],    // 1
  [-12, 18, 22],   // 2 — toward experience
  [-18, 22, 35],   // 3
  [-15, 26, 48],   // 4 — experience zone approach
  [0, 30, 55],     // 5 — toward projects
  [15, 34, 50],    // 6
  [25, 38, 40],    // 7
  [20, 42, 25],    // 8 — toward contact
  [5, 48, 30],     // 9 — contact zone approach
];

export const ZONE_POSITIONS = {
  experience: [-15, 26, 55],
  projects: [25, 40, 45],
  contact: [0, 50, 35],
};

export const PATHS = {
  experience: WAYPOINT_POSITIONS.slice(0, 5),
  projects: WAYPOINT_POSITIONS.slice(0, 8),
  contact: WAYPOINT_POSITIONS.slice(0, 10),
};
```

**Important:** Rafael duplicates these arrays in 3 files (`Coins.jsx`, `CharacterController.jsx`, `Experience.jsx`). Victoria's plan uses **one file** (`navigation.js`) imported everywhere to avoid drift.

---

## 9. State Management Contract

### App-level state (`App.jsx` or `Home.jsx`)

| State | Type | Purpose |
|-------|------|---------|
| `showExperience` | boolean | Experience overlay visible |
| `showProjects` | boolean | Projects overlay visible |
| `showContact` | boolean | Contact overlay visible |
| `isManualMode` | boolean | KeyboardControls enabled |
| `isAutomaticMode` | boolean | Auto-flight active (inverse of manual when flying) |
| `isCharacterPathing` | boolean | Show skip button |

### WaypointContext

| Field | Type | Purpose |
|-------|------|---------|
| `collectedWaypoints` | number[] | IDs collected this session |
| `collectWaypoint(id)` | function | Add to collection |
| `totalWaypoints` | number | From `navigation.js` |
| `progressPercentage` | number | For navbar bar |

### Experience ref (imperative)

```js
experienceRef.current.moveToWorkExperience()
experienceRef.current.moveToProjects()
experienceRef.current.moveToContact()
experienceRef.current.skipAutomaticNavigation()
```

### Zone trigger callbacks

```js
onExperienceChange(true)   // enter zone → open overlay
onExperienceChange(false)  // exit zone → close overlay
// Same pattern for projects, contact
```

---

## 10. Mobile & Accessibility Strategy

| Concern | Approach |
|---------|----------|
| No keyboard on mobile | Navbar auto-flight only; manual mode hidden or disabled |
| Touch on canvas | Do not rely on drag; optional touch joystick = Phase 7+ stretch |
| Screen readers | Overlays are real DOM — ensure headings, focus trap in overlay |
| Reduced motion | Skip flight; navbar opens overlay directly |
| Focus management | On overlay open, focus close button; restore on close |
| Skip link | "Skip to content" opens Experience overlay without flight |

---

## 11. Performance Budget

| Metric | Target |
|--------|--------|
| Desktop FPS | ≥ 55 fps during flight |
| Mobile FPS | ≥ 30 fps (reduced quality) |
| Initial load | < 5s on fast 3G (with loader) |
| Total GLB size | < 12MB (current ~7MB + landmarks) |
| Rapier bodies | < 30 active colliders |

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Waypoint placement tedious | High | Medium | Start with 10; use dev gizmo to visualize |
| Rapier learning curve | Medium | High | Port Rafael's controller; don't rewrite from scratch |
| Mobile perf poor | Medium | High | Quality presets; navbar-only on mobile |
| Island GLB wrong scale for world | Medium | Medium | Normalize in Blender early (Phase 0) |
| Scope creep (full Rafael parity) | High | High | Phase 7 waypoint expansion optional |
| Old `/experience` bookmarks break | Low | Low | Redirect `/experience` → `/` + open overlay |

---

## 13. Testing Checklist

### Navigation

- [ ] Navbar Experience → auto-flight → overlay opens
- [ ] Navbar Projects → auto-flight → overlay opens
- [ ] Navbar Contact → auto-flight → overlay opens
- [ ] Revisit zone → instant overlay (no flight)
- [ ] Skip mid-flight → teleport + collect waypoints + overlay
- [ ] Enter zone manually → overlay opens
- [ ] Exit zone → overlay closes
- [ ] Manual mode toggle works
- [ ] Manual flight can reach all 3 zones

### Waypoints

- [ ] Each waypoint collectible once
- [ ] Progress bar accurate
- [ ] 100% progress triggers confetti
- [ ] Auto-flight resumes from last waypoint after partial manual exploration

### Overlays

- [ ] Experience timeline scrolls; links work
- [ ] Projects GitHub/live links open in new tab
- [ ] Contact email/social links work
- [ ] Close overlay returns to 3D scene

### Cross-browser

- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Safari desktop
- [ ] iOS Safari (navbar only)
- [ ] Android Chrome

### Edge cases

- [ ] Rapid navbar clicks don't break path state
- [ ] Open overlay during flight → flight completes or pauses gracefully
- [ ] Page refresh resets waypoints (expected) but not broken state
- [ ] `prefers-reduced-motion` bypasses flight

---

## 14. Rollout & Rollback

### Rollout

1. Merge to `main` after Phase 8 QA
2. Deploy to staging/preview if available
3. Smoke test live URL
4. Update LinkedIn / resume link if needed

### Rollback

- Keep `main` at last commit before merge until deploy verified
- Tag pre-migration release: `git tag v1-island-nav`
- Revert merge commit if critical issues post-deploy

---

## 15. Timeline Summary

```
Week 1
├── Phase 0 (design lock)
├── Phase 1 (architecture)
└── Phase 2 start (character flight)

Week 2
├── Phase 2 finish
├── Phase 3 (world + zones)
└── Phase 5 start (overlays)

Week 3
├── Phase 4 (auto-nav + navbar)
├── Phase 5 finish
└── Phase 6 (manual mode)

Week 4
├── Phase 7 (polish + mobile)
└── Phase 8 (cleanup + deploy)
```

---

## Appendix A — Keyboard Map

```js
const keyboardMap = [
  { name: "forward",   keys: ["ArrowUp", "KeyW"] },
  { name: "backward",  keys: ["ArrowDown", "KeyS"] },
  { name: "leftward",  keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "up",        keys: ["Space"] },
  { name: "down",      keys: ["ShiftLeft"] },
];
```

---

## Appendix B — Phase 0 Action Items for Victoria

1. Play rafaelsf.com end-to-end (10 min)
2. ~~Choose archipelago vs full map~~ **Done — Option A (island archipelago)**
3. Sketch waypoint path: island2 hub → experience dock → projects platform → contact tower
4. Confirm Contact as third navbar destination
5. Approve removing island drag-to-rotate permanently (hub stays as static `island2.glb`)

---

## Appendix C — Files Removed vs Created (estimate)

| Removed | Created |
|---------|---------|
| `HomeInfo.jsx` | `scene/Experience.jsx` |
| `GestureHint.jsx` | `scene/CharacterController.jsx` |
| `pages/Experience.jsx` | `scene/Character.jsx` |
| `pages/Projects.jsx` | `scene/World.jsx` |
| `Island.jsx`, `Island2.jsx` rotation logic | `scene/Waypoints.jsx` |
| Decorative `Plane.jsx` orbit | `scene/triggers/*` |
| Island toggle UI in `Home.jsx` | (removed in Phase 8) |
| `BackButton.jsx` | `components/overlays/*` |
| | `contexts/WaypointContext.jsx` |
| | `constants/navigation.js` |
| | `MovementInstructions.jsx` |
| | `SkipNavigationButton.jsx` |

---

*Document version: 1.1 · Branch: `feature/raf-style-navigation` · Option A (archipelago) locked 2026-05-20 · Hub asset: `island2.glb`.*
