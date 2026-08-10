# Changelog

## Unreleased

### Changed

- Updated component color defaults to use the shared semantic content and surface tokens.

## [2.4.0] - 2026-07-20

### Changed

- Added styling story and documentation with reusable style recipes.
- Added generated time text CSS parts for unit and row-specific styling.
- Added custom states for focused units and second visibility.
- Added public CSS variables for picker size, clock padding, typography, indicator sizes, wrapper shadow, SVG filter, optional text opacity, and wrapper radius.
- Standardized theme recipes on `jb-time-picker.<theme>-style` and composed `jb-time-input.<theme>-style::part(time-picker)` selectors.
- Improved picker performance by caching the SVG coordinate scale per drag, coalescing move handling to one update per animation frame, and applying external value assignments immediately instead of animating every intermediate step.
