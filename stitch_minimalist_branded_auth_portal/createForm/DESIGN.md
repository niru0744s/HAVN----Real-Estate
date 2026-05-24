---
name: Sanctuary Glass
colors:
  surface: '#fdf9f3'
  surface-dim: '#ddd9d4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ee'
  surface-container: '#f1ede8'
  surface-container-high: '#ece8e2'
  surface-container-highest: '#e6e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#45474d'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0eb'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#525f78'
  primary: '#00030c'
  on-primary: '#ffffff'
  primary-container: '#101d33'
  on-primary-container: '#7985a0'
  inverse-primary: '#bac7e4'
  secondary: '#76593b'
  on-secondary: '#ffffff'
  secondary-container: '#fed6b0'
  on-secondary-container: '#795b3d'
  tertiary: '#020302'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1d1a'
  on-tertiary-container: '#858581'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#bac7e4'
  on-primary-fixed: '#0e1b31'
  on-primary-fixed-variant: '#3b475f'
  secondary-fixed: '#ffdcbc'
  secondary-fixed-dim: '#e6c09b'
  on-secondary-fixed: '#2b1702'
  on-secondary-fixed-variant: '#5c4125'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fdf9f3'
  on-background: '#1c1c19'
  surface-variant: '#e6e2dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  title-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  data-mono:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
---

## Brand & Style

This design system embodies a "Futuristic Organic" aesthetic. It balances the timeless, intellectual elegance of classical editorial design with the cutting-edge precision of modern glassmorphism. The brand personality is serene, premium, and highly technical—aiming to evoke the feeling of a high-end architectural retreat where nature and technology coexist.

The visual style leverages **Glassmorphism** to create a sense of lightness and depth. Interfaces should feel like layered panes of frosted quartz floating over a warm, breathable environment. High-precision UI elements provide a "pro-tool" feel, while the generous whitespace ensures the user never feels overwhelmed. The goal is an emotional response of focused calm and sophisticated reliability.

## Colors

The "Sanctuary" palette is anchored in natural warmth contrasted against deep, structural shadows.

- **Primary (Deep Navy - #101D33):** Used for high-impact text, primary navigation backgrounds, and structural definitions. It provides the "futuristic" anchor.
- **Secondary (Warm Wood - #C5A17E):** An accent color used for interactive highlights, active states, and small decorative elements that provide organic warmth.
- **Surface (Cream/Linen - #F9F7F2):** The base canvas. This is a non-pure white that reduces eye strain and feels more premium and "material-driven."
- **Glass Effects:** Utilize varying opacities of the Surface color (e.g., 60-80%) with a heavy backdrop-blur (20px-40px). 
- **Gradients:** Use subtle linear gradients moving from the Secondary wood tone to a lighter sand hue for "active" glass cards to simulate sunlight hitting a surface.

## Typography

This design system uses a dual-font strategy to balance heritage and precision.

- **EB Garamond** is reserved for large expressive headlines and editorial moments. It should be used with "optical sizing" turned on where possible to maintain its delicate serifs.
- **Manrope** handles all functional UI, data points, and body copy. Its geometric but slightly softened terminals match the "smooth" roundedness of the layout.
- **Hierarchy Tip:** Use `label-caps` for metadata or category tags above headlines to create a structured, "documented" look. Body text should maintain generous line-height (1.5x) to support the breathable layout philosophy.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid** model. Content is contained within a centered 1280px max-width container for desktop, but background glass panels may bleed to the edges of the screen to maintain the "airy" feel.

- **Rhythm:** An 8px base unit is used. However, "generous whitespace" means frequently jumping to 32px (4x), 64px (8x), and 128px (16x) increments for section padding.
- **Grid:** Use a 12-column grid for desktop with wide 32px gutters to prevent content density from feeling "crowded."
- **Mobile:** Transition to a 4-column grid. Vertical spacing between sections should remain high (min 48px) to preserve the premium brand feel even on small screens.

## Elevation & Depth

Hierarchy is achieved through **translucency and refraction** rather than traditional opaque shadows.

- **Level 1 (Base):** The Cream/Linen surface.
- **Level 2 (Panels/Cards):** Frosted glass surfaces with 70% opacity and 30px backdrop blur. These feature a 1px solid border at 10% opacity of the primary color to define the edge.
- **Level 3 (Floating Elements/Modals):** Increased elevation via extra-diffused ambient shadows. Use a "Soft Glow" shadow: `0px 24px 48px rgba(16, 29, 51, 0.08)`.
- **Level 4 (Interactions):** Active states on glass panels should use a subtle inner-glow (1px white stroke at 20% opacity) to simulate the "catching" of light on a glass edge.

## Shapes

The shape language is "Hyper-Smooth." While the token is set to level 2 (0.5rem base), major containers and cards should scale up significantly to create a sense of luxury.

- **Standard UI (Inputs, Buttons):** 8px (0.5rem).
- **Cards/Modules:** 24px (1.5rem) to 32px (2rem).
- **Overlays/Modals:** 40px (2.5rem).

Avoid "Pill-shaped" buttons for primary actions; instead, use slightly oversized rectangles with large radii to maintain a sophisticated, architectural silhouette.

## Components

- **Primary Buttons:** Solid Deep Navy (#101D33) with Manrope Bold text in Cream. Use 24px horizontal padding and 16px vertical padding for a "sturdy" feel.
- **Glass Cards:** The signature component. Semi-transparent background, subtle 1px border, and high backdrop blur. No heavy shadows unless the card is hovering.
- **Input Fields:** Soft cream background with a 1px Navy border at 10% opacity. Upon focus, the border opacity increases to 40% and a subtle wood-colored underline appears.
- **Chips/Tags:** Use `label-caps` typography. Background should be a very light tint of the Secondary color (10% opacity) with a fully rounded (pill) shape.
- **Lists:** Separated by thin, 1px horizontal lines at 5% opacity. Increase vertical padding between list items to 20px to maintain the "breathable" requirement.
- **Data Visualizations:** Use the Secondary (Wood) and Primary (Navy) colors for charts. Lines should be thin (1.5pt) and use Manrope for all axis labels.