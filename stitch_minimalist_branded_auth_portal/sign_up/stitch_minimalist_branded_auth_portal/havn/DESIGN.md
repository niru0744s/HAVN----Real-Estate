---
name: HAVN
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#434848'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#737878'
  outline-variant: '#c3c7c7'
  surface-tint: '#596060'
  primary: '#171e1e'
  on-primary: '#ffffff'
  primary-container: '#2c3333'
  on-primary-container: '#949b9b'
  inverse-primary: '#c1c8c7'
  secondary: '#685c52'
  on-secondary: '#ffffff'
  secondary-container: '#f0e0d2'
  on-secondary-container: '#6e6258'
  tertiary: '#1e1d14'
  on-tertiary: '#ffffff'
  tertiary-container: '#333228'
  on-tertiary-container: '#9d9a8c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde4e3'
  primary-fixed-dim: '#c1c8c7'
  on-primary-fixed: '#161d1d'
  on-primary-fixed-variant: '#414848'
  secondary-fixed: '#f0e0d2'
  secondary-fixed-dim: '#d3c4b7'
  on-secondary-fixed: '#221a12'
  on-secondary-fixed-variant: '#4f453b'
  tertiary-fixed: '#e7e3d3'
  tertiary-fixed-dim: '#cac7b8'
  on-tertiary-fixed: '#1d1c13'
  on-tertiary-fixed-variant: '#49473c'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system embodies the "Sophisticated Sanctuary"—a digital translation of high-end architectural intent. It focuses on the emotional response of serenity, exclusivity, and permanence. The style is a hybrid of **Minimalism** and **Modern Editorial**, characterized by expansive white space, a disciplined color palette, and a focus on high-fidelity architectural photography as the primary visual driver. 

The audience consists of discerning high-net-worth individuals who value understated elegance over flashiness. The UI must feel like a quiet gallery where the properties are the art, utilizing generous structural breathing room to evoke a sense of calm and "immersive luxury."

## Colors
The palette is rooted in natural, architectural materials. 
- **Deep Slate (Primary):** Used for primary typography, structural lines, and high-impact UI elements. It provides the "anchor" for the brand.
- **Warm Taupe (Secondary):** Used for accents, secondary buttons, and subtle separators. It softens the starkness of the slate.
- **Soft Off-White (Neutral):** The canvas for the entire system. This is not a pure white; it has a slight warmth to prevent a clinical feel and to complement natural stone and wood tones in property photography.
- **Tonal Accents:** Use varying opacities of the primary slate (e.g., 5-10%) for subtle background containers to maintain depth without introducing new hues.

## Typography
The typography strategy pairings classic literary elegance with modern functionalism.
- **Headlines (EB Garamond):** Used for property titles and section headers. The serif adds a layer of established prestige and "intellectual luxury." Use tight tracking for larger sizes to mimic high-end print magazines.
- **Body & Functional Text (Manrope):** A clean, balanced sans-serif that ensures maximum legibility for property details and technical data.
- **Labels:** Always set in Manrope, uppercase, with generous letter spacing to denote secondary information or categorization without cluttering the visual hierarchy.

## Layout & Spacing
The layout follows a **Fixed Grid** model with an emphasis on oversized margins to create an "airy" architectural feel. 
- **The 12-Column Grid:** On desktop, the content is centered with 80px side margins and 32px gutters. This creates a focused vertical reading path while allowing imagery to occasionally break the grid and bleed to the edges of the viewport for "immersive" moments.
- **Vertical Rhythm:** A massive `section-gap` (120px+) is used between major content blocks to ensure the user never feels overwhelmed. 
- **Responsive Behavior:** On mobile, margins shrink to 20px, and the 12-column grid collapses to a single column, but internal padding within cards remains generous to preserve the luxury feel even on small screens.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows** rather than traditional skeuomorphism.
- **Surfaces:** Use the Soft Off-White as the base. Content containers (like property cards) should use a subtle 1px border in a lightened Taupe or a very faint shadow.
- **Shadows:** Shadows should be "extra-diffused"—large blur radii (30px-60px) with very low opacity (3-5%) and a slight tint of the Primary Slate color to ensure they feel like natural environmental lighting.
- **Translucency:** For navigation bars or overlays on imagery, use a high-blur backdrop filter (glassmorphism) with an off-white tint to maintain the "sanctuary" feel without obscuring the photography.

## Shapes
This design system utilizes a **Soft** shape language. 
- **Base Corner Radius:** 0.25rem (4px) for most interactive elements like buttons and inputs. This provides just enough softness to feel sophisticated and modern without losing the "structural" integrity associated with architecture.
- **Large Elements:** Property cards and image containers can use `rounded-lg` (0.5rem) to slightly differentiate from smaller UI controls.
- **Icons:** Use thin-stroke (1.5px) geometric icons with sharp corners to contrast against the soft UI elements.

## Components
- **Buttons:** Primary buttons are solid Deep Slate with white Manrope text, utilizing an elongated horizontal padding for a premium look. Secondary buttons are outlined in 1px Taupe.
- **Input Fields:** Minimalist design with only a bottom border in Slate (0.5 opacity) that transforms to a full border on focus. Labels sit in the small, uppercase Manrope style.
- **Property Cards:** Feature high-aspect-ratio photography (3:2 or 16:9). Text is kept to a minimum: a serif title, a small sans-serif price, and a single uppercase label for location.
- **Chips/Tags:** Used for property features (e.g., "Waterfront," "Historic"). Small, off-white background with a subtle taupe border; no heavy colors.
- **Navigation:** A centered, minimalist bar. High-priority links are in the serif font at a small scale to feel more like a boutique brand than a generic tech platform.
- **Gallery Component:** Immersive, full-bleed image carousels with "ghost" navigation (arrows that appear only on hover or are extremely subtle) to keep the focus on the property.