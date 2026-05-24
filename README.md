# HAVN — Premium Real Estate Sanctuary Platform

HAVN is an ultra-premium, high-fidelity universal mobile real estate application designed for exploring, collecting, and listing luxury architectural sanctuaries. Anchored in a custom "Sanctuary Glass" editorial design system, the interface balances a warm organic cream-and-wood color palette with cutting-edge, tactile glassmorphism.

---

## 🛠️ Technology Stack

HAVN is engineered with a modern, high-performance universal stack:

### Frontend Core
- **Framework**: [Expo SDK 54](https://expo.dev) & [React Native 0.81](https://reactnative.dev)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org) (Fully typed, 100% compilation safety)
- **Routing**: [Expo Router v6](https://docs.expo.dev/router/introduction) (File-system based declarative routing, tab-slots, dynamic nested layouts)
- **Styling**: [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS for React Native with native styling efficiency) & Global CSS Variables
- **Tactile Weight**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) (Light, medium, and notification impact feedback)
- **Performance**: [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/) (High-performance caching, blurhash transitions, instant render)

### Backend & Authentication
- **Authentication & Sessions**: [Clerk Expo](https://clerk.com/docs/references/expo/overview) (Secure passwordless auth, dynamic user profile management, secure keychain token cache)
- **Database & Storage**: [Supabase JS SDK v2](https://supabase.com) (PostgreSQL tables, custom stored procedures, secure JWT session keys, and asset storage buckets)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Ultra-lightweight reactive client stores for multi-parameter search filtering and session profiles)

### Device Integration
- **Camera & Photo Library Picker**: [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) (Multi-asset selection, aspect editing, quality scaling)
- **GPS Coordinates**: [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) (Automatic foreground geolocation detection)
- **Sharing & Communications**: [React Native Share](https://reactnative.dev/docs/share) & [Linking APIs](https://reactnative.dev/docs/linking) (Sleek SMS inquiry routing and phone integration)

---

## 📂 Project Architecture

```filepath
├── app/                         # Expo Router application screens
│   ├── (auth)/                  # Secure User Registration & Login views
│   │   ├── _layout.tsx          # Auth layout routing
│   │   ├── sign-in.tsx          # Branded credentials entry screen
│   │   └── sign-up.tsx          # Branded member creation screen
│   ├── (root)/                  # Main Application shell
│   │   ├── (tabs)/              # Persistent bottom navigation tabs
│   │   │   ├── _layout.tsx      # Customized glassmorphic tab navigator
│   │   │   ├── index.tsx        # Homepage discovery feed & featured hero slider
│   │   │   ├── search.tsx       # Live multi-filtered search panel
│   │   │   ├── saved.tsx        # Supabase synced collection bookmarks
│   │   │   ├── create.tsx       # 3-Step property listing wizard
│   │   │   └── profile.tsx      # Smart scroll-free account panels
│   │   ├── property/            # Showcase details directory
│   │   │   └── [id].tsx         # High-fidelity architectural details page
│   │   └── _layout.tsx          # Clerk session synchronization layout
│   ├── components/              # Modular UI elements
│   │   ├── FilterModel.tsx      # Premium slide-up filter sheet
│   │   ├── SelectedFilterChips.tsx # Active filter indicators
│   │   ├── featuredCard.tsx     # Hero showcase layout
│   │   └── propertyCard.tsx     # Synchronized catalog feed card
│   └── _layout.tsx              # Application entry, ClerkProvider & StatusBar hidden config
├── hooks/                       # Reusable React hooks
│   ├── useSupabase.ts           # Token-authenticated Supabase client instance
│   ├── useSavedProperty.ts      # Live real-time Supabase saving toggle hook
│   └── useUserSync.ts           # Clerk-to-Supabase account synchronization watcher
├── lib/                         # Configuration and standalone clients
│   ├── supabase.ts              # Global standalone Supabase configuration
│   └── utils.ts                 # Formatter utilities (price formatting, dates)
├── store/                       # Zustand state managers
│   ├── filterStrore.ts          # Reactive search query state
│   └── userStore.ts             # App-wide global user status store
├── types/                       # TypeScript type interfaces
└── tailwind.config.js           # NativeWind configurations
```

---

## ✨ Features & UX Design Highlights

### 1. "Sanctuary Glass" Aesthetic
- Designed around warm, breathing cream bases (`#fdf9f3`), dark navy structures (`#00030c`), and wood accents (`#76593b`).
- Glassmorphic panels built using precise translucent opacities, backdrop blurs, and thin borders matching organic glass panes.

### 2. Live Supabase-Synced Saved Collections
- Uses custom database tables (`saved_properties`) synchronized in real-time.
- Bookmarking a property on the feed or showcase instantly refreshes user collection boards.
- Premium Expo Haptics feedback added on toggles for high-quality tactile weight.

### 3. Edge-to-Edge Immersive Views
- Global configuration of `<StatusBar hidden={true} />` from `expo-status-bar` hides the system status bar, wifi signals, time, and battery indicators for a premium, catalog-style visual flow.

### 4. Smart Scroll-Free Layouts
- The **Profile screen** features a horizontal Hero, a 3-column Bento stats row, and a **Segmented Control Tab Bar** which renders settings dynamically in a single pane. This prevents long, forced-scrolling lists, letting the entire screen fit cleanly in a single viewport on iOS & Android.

### 5. High-Precision "Create Sanctuary" Wizard
- A dynamic, **3-Step Listing Wizard** featuring:
  - **Step 1**: Multi-image library picker, base64 data conversion, and upload loaders.
  - **Step 2**: Visual property type selectors, numeric bedrooms/bathrooms steppers, and pricing controls.
  - **Step 3**: Abstract vector blueprint map styling, GPS geolocation detector button, and fullscreen "Securing Sanctuary" upload loaders.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and the Expo CLI installed.

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd real-estate-reactNative
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and configure your Clerk and Supabase credentials:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Run the Application
Launch the Expo development server on your preferred platform:
```bash
# Start expo development interface
npx expo start

# Run on Android emulator / connected device
npm run android

# Run on iOS simulator / connected device
npm run ios
```
