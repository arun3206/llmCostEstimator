---
name: Precision Estimate
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#464555'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max-width: 1200px
  container-padding: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

This design system is built for a professional SaaS environment focused on clarity, data accuracy, and financial transparency. The aesthetic leans into **High-End Minimalism**, prioritizing functional whitespace and a restrained color palette to reduce cognitive load when processing complex cost calculations.

The target audience consists of developers, CTOs, and financial planners who value efficiency over decoration. The UI evokes a sense of reliability and architectural precision through consistent alignment, subtle depth, and systematic type hierarchies. The style avoids unnecessary ornamentation, ensuring that the user's focus remains entirely on the data and actionable insights.

## Colors

The palette is anchored by a high-contrast foundation of pure white and soft grey to distinguish between the canvas and interactive containers.

- **Primary (Indigo):** Used exclusively for primary actions, active states, and brand-critical indicators.
- **Success (Green):** Reserved for positive cost deltas, savings calculations, and completion states.
- **Neutral:** A scaled grey palette used for secondary text, icons, and structural borders.
- **Surface Strategy:** Use `#FFFFFF` for the main content cards and `#F9FAFB` for the global page background to create a clear visual "lift" for data-heavy sections.

## Typography

The design system utilizes **Geist** for its technical precision and exceptional legibility at small sizes, which is critical for tabular data and monospaced numeric values.

- **Headlines:** Use semi-bold weights with slight negative letter-spacing to maintain a compact, professional appearance.
- **Body:** Standardized at 16px for optimal readability. Use 14px for secondary metadata or sidebars.
- **Numbers:** When displaying currency or token counts, ensure the font's tabular lining figures are utilized to maintain vertical alignment in tables.
- **Labels:** Uppercase labels are reserved for small category headers and table column titles to provide clear structural hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to ensure data visualizations remain readable and don't stretch excessively on ultrawide monitors.

- **Grid:** A 12-column grid with a 24px (1.5rem) gutter.
- **Maximum Width:** Content is centered with a max-width of 1200px.
- **Responsive Behavior:** 
  - **Desktop (1024px+):** 1200px container, 32px margins.
  - **Tablet (768px - 1023px):** Fluid width, 24px margins, columns collapse from 12 to 8.
  - **Mobile (<768px):** Fluid width, 16px margins, vertical stacking for all card-based layouts.
- **Rhythm:** Use a strict 8px base unit for all margins and paddings to ensure mathematical harmony across the interface.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to define hierarchy.

- **Level 0 (Background):** `#F9FAFB`. Used for the lowest application surface.
- **Level 1 (Cards/Surface):** `#FFFFFF` with a 1px solid border of `#E5E7EB`. This is the primary container for content.
- **Level 2 (Interactive/Floating):** Use a subtle shadow: `0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)`. Apply this to dropdowns, tooltips, and cards upon hover to indicate interactivity.
- **Softness:** Shadows should be extremely diffused with no harsh edges, mimicking natural ambient light.

## Shapes

The shape language is **Rounded**, striking a balance between modern friendliness and professional structure.

- **Standard Components:** Buttons, input fields, and small cards use a `0.5rem` (8px) radius.
- **Large Containers:** Main content areas and modal overlays use `1rem` (16px) to create a softer, more distinct enclosure.
- **Interactive States:** Focus rings should follow the radius of the element they surround, with a 2px offset for clarity.

## Components

### Buttons
- **Primary:** Solid Indigo (#4F46E5) with white text. 8px border radius.
- **Secondary:** White background with #E5E7EB border and #374151 text.
- **Ghost:** No background or border; used for low-priority actions in sticky headers.

### Cards
- Always white background.
- 1px #E5E7EB border.
- 16px padding for mobile, 24px for desktop.
- Section headers within cards should have a subtle bottom border.

### Input Fields
- **Default:** White background, 1px #E5E7EB border, 8px radius.
- **Focus:** 2px solid Indigo (#4F46E5) or a subtle blue glow.
- **Labels:** 14px Medium weight Geist, positioned above the field.

### Responsive Tables
- **Header:** Light grey background (#F9FAFB), 12px uppercase bold text.
- **Rows:** 1px bottom border only. On hover, the entire row should transition to a very light blue or grey tint.
- **Numeric Cells:** Right-aligned for easier comparison of costs.

### Sticky Header
- Transparent background with a `backdrop-filter: blur(8px)`.
- 1px bottom border for separation from scrolling content.
- 64px fixed height.

### Chips/Tags
- **Success:** Soft green background (10% opacity) with dark green text.
- **Neutral:** Soft grey background (10% opacity) with dark grey text.
- Used for model names (e.g., "GPT-4", "Claude 3").