---
name: HAVN Sanctuary System
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#43474c'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#74777c'
  outline-variant: '#c4c6cc'
  surface-tint: '#506071'
  primary: '#051625'
  on-primary: '#ffffff'
  primary-container: '#1b2b3a'
  on-primary-container: '#8292a5'
  inverse-primary: '#b8c8dc'
  secondary: '#6a5c47'
  on-secondary: '#ffffff'
  secondary-container: '#f4e0c4'
  on-secondary-container: '#71624c'
  tertiary: '#17150e'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c2922'
  on-tertiary-container: '#959086'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4f8'
  primary-fixed-dim: '#b8c8dc'
  on-primary-fixed: '#0c1d2b'
  on-primary-fixed-variant: '#384858'
  secondary-fixed: '#f4e0c4'
  secondary-fixed-dim: '#d7c4a9'
  on-secondary-fixed: '#241a09'
  on-secondary-fixed-variant: '#524531'
  tertiary-fixed: '#e9e2d7'
  tertiary-fixed-dim: '#ccc6bb'
  on-tertiary-fixed: '#1e1b15'
  on-tertiary-fixed-variant: '#4a463e'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 120px
---

## Brand & Style

This design system is built upon the concept of "The Digital Sanctuary." It evokes feelings of security, premium comfort, and architectural precision. The brand personality is poised, quiet, and dependable, avoiding loud trends in favor of timeless high-end minimalism.

The visual style leverages **Modern Minimalism** with a focus on structural integrity. By utilizing expansive whitespace (the "breath" of the sanctuary) and a palette rooted in natural, earthy tones, the UI creates an environment that feels curated rather than cluttered. The aesthetic is professional yet warm, bridging the gap between clinical efficiency and residential comfort.

## Colors

The color palette is derived directly from the architectural elements of the brand's identity. 

- **Primary (Deep Navy - #1B2B3A):** Represents the foundation and structural strength. Used for primary actions, headings, and high-emphasis text.
- **Secondary (Warm Tan - #C5B399):** Represents the "roof" and warmth. Used for accents, selective calls to action, and decorative elements that require a softer touch.
- **Tertiary (Sand - #EAE3D8):** A muted version of the secondary tone, used for large surface areas, subtle hover states, and background layering.
- **Neutral (Parchment - #F9F8F6):** A warm off-white that prevents the "starkness" of pure white, contributing to the sanctuary feel.

## Typography

The typography system uses a pairing of two highly legible, modern sans-serifs to maintain a professional edge while feeling approachable. 

**Manrope** is used for all headlines. Its geometric yet slightly softened corners provide an architectural feel that mirrors the roof icon in the logo. **Hanken Grotesk** is used for body text and labels for its exceptional clarity and balanced proportions. 

All labels and sub-headers utilize generous letter-spacing and uppercase styling to evoke the feeling of high-end editorial layouts.

## Layout & Spacing

This design system utilizes a **Fixed Grid** on desktop and a **Fluid Grid** on mobile devices. 

The layout philosophy is defined by "The Luxury of Space." Vertical rhythm is intentionally slow, with large gaps between sections to allow content to be digested without friction. 

- **Desktop:** 12-column grid, 1280px max-width, with wide 64px outer margins.
- **Tablet:** 8-column grid, 32px gutters.
- **Mobile:** 4-column grid, 24px margins.

Spacing follows an 8px linear scale. For component-level spacing, use tight increments (8px, 16px). For layout-level spacing, use large increments (64px, 80px, 120px) to maintain the sanctuary aesthetic.

## Elevation & Depth

To maintain a clean and high-end aesthetic, elevation is conveyed through **Tonal Layers** and **Ambient Shadows**. 

Avoid heavy, dark shadows. Instead, use "Sanctuary Shadows": extremely diffused, low-opacity (#1B2B3A at 4-8% opacity) with a large blur radius. These should feel like soft natural light hitting a surface, rather than a digital drop shadow.

Depth is primarily established by placing Navy or Tan containers on the Parchment background. Interactive elements should use subtle scale shifts (1.02x) rather than drastic shadow increases to indicate state changes.

## Shapes

The shape language is **Soft (0.25rem)**. This choice reflects the clean, straight lines of architectural blueprints while removing the "harshness" of sharp corners. 

Buttons and input fields should maintain this slight radius to feel modern and premium. Circular shapes are reserved exclusively for avatars or specific status indicators to provide a clear visual contrast against the otherwise rectilinear grid.

## Components

### Buttons
Primary buttons use the Deep Navy (#1B2B3A) background with Parchment text. Secondary buttons use a Tan (#C5B399) outline with Navy text. Buttons should have generous horizontal padding (32px) to feel substantial and high-end.

### Cards
Cards should be styled with a "Ghost Border"—a subtle 1px stroke using the Tertiary Sand color (#EAE3D8)—and no fill, or a very soft white fill with an ambient shadow. Avoid heavy background colors for cards to keep the UI light.

### Input Fields
Inputs use a bottom-border-only style or a very subtle light-grey background with no border. Focus states are indicated by the Deep Navy color transitioning into the border or a subtle highlight.

### Chips & Tags
Chips are rectangular with the standard Soft (1) radius. They use the Tertiary Sand background with Navy text to remain legible but low-emphasis.

### Navigation
The navigation bar should be minimalist, utilizing a Backdrop Blur (Glassmorphism) when scrolling to maintain depth without adding visual weight. Links should use the `label-md` typographic style for a refined, professional look.