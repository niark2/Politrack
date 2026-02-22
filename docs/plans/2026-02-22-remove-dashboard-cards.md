# Remove Dashboard Cards Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove "Flux Actif" and "Press Review" cards from the dashboard to simplify the UI.

**Architecture:** Modify the `GlobalStats` component to remove the unwanted cards, clean up unused props, and adjust the layout for the remaining card. Fix `any` types as per project rules.

**Tech Stack:** React, Tailwind CSS, Lucide React.

---

### Task 1: Clean up GlobalStats Component

**Files:**
- Modify: `src/components/dashboard/GlobalStats.tsx`

**Step 1: Update interface and component parameters**
- Remove `loadingPolls`, `lastRefresh`, `loadingNews`, and `newsCount` from `GlobalStatsProps`.
- Change `selectedElection: any` to `selectedElection: Election | null`.
- Import `Election` from `@/types`.

**Step 2: Remove the "Flux Actif" and "Press Review" cards**
- Remove the JSX for the second and third `Card` components.
- Keep only the "Compte à rebours" card.

**Step 3: Adjust the layout container**
- Change `grid-cols-1 md:grid-cols-3` to a more suitable container for a single card.
- Suggestion: `flex justify-start` or keep `grid grid-cols-1` but maybe with a max-width if appropriate. Given the dashboard layout, a single card on the left or full width is fine.

### Task 2: Update App Page Usage

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Update GlobalStats props**
- Remove the props that are no longer passed to `GlobalStats`: `loadingPolls`, `lastRefresh`, `loadingNews`, and `newsCount`.
