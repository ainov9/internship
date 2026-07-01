# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
   

   # App.jsx Documentation

## Overview
The main React component for the **ChatBot** frontend application. It manages page routing, user authentication state, and renders the complete UI including navigation, hero, features, about, CTA, and contact sections.

---

## State Management

| State | Type | Description |
|-------|------|-------------|
| `currentPage` | `string` | Tracks the active page (`'home'`, `'login'`, `'signup'`). Default: `'home'` |
| `user` | `object \| null` | Stores authenticated user data (e.g., `{ email }`). Default: `null` |

---

## Functions

### `scrollToChat()`
Smoothly scrolls the viewport to the `#start-chat` section using `scrollIntoView` with behavior set to `'smooth'`.

### `handleLoginSuccess(email)`
- **Parameters**: `email` (string)
- **Action**: Sets the `user` state with the provided email and redirects to the home page.

### `handleSignupSuccess(email)`
- **Parameters**: `email` (string)
- **Action**: Sets the `user` state with the provided email and redirects to the home page.

### `handleLogout()`
Clears the `user` state (sets to `null`) and redirects to the home page.

---

## Page Routing

The component uses conditional rendering to display different pages:

| Route | Component | Description |
|-------|-----------|-------------|
| `'login'` | `<Login />` | Renders the login form with options to switch to signup. |
| `'signup'` | `<Signup />` | Renders the signup form with options to switch to login. |
| `'home'` (default) | Full UI | Renders the complete landing page with all sections. |

---

## UI Sections

### 1. **Navbar**
- **Props**:
  - `onLoginClick`: Navigates to the login page.
  - `onSignupClick`: Navigates to the signup page.
- **Visibility**: Always visible except when replaced by login/signup flows.

### 2. **Hero Section** (`#home`)
- Displays the main title, subtitle, and a CTA button.
- **Props**:
  - `title`: "Welcome to our ChatBot"
  - `subtitle`: "Your intelligent conversational AI partner. Chat smarter, not harder."
  - `ctaText`: "Start Chatting"
  - `onCtaClick`: Calls `scrollToChat()`
  - `onLoginClick`: Navigates to the login page.

### 3. **Features Section** (`#features`)
- **Purpose**: Highlights the key features of the chatbot.
- **Content**:
  - **Smart Conversations**: Natural and intelligent AI-powered conversations.
  - **Instant Responses**: Quick and accurate answers anytime.
  - **24/7 Support**: Round-the-clock assistance.
- **Layout**: Responsive grid (1 column on mobile, 3 columns on desktop).
- **Animations**: Uses `framer-motion` for staggered fade-in and hover effects.

### 4. **About Section** (`#about`)
- **Layout**: Split-screen design (text on left, image on right).
- **Content**:
  - Describes the chatbot's AI technology and commitment to improvement.
  - Includes a "Get Started" button that calls `scrollToChat()`.

### 5. **CTA Section** (`#start-chat`)
- **Design**: Gradient background (`from-primary to-purple-600`).
- **Content**:
  - Title: "Ready to Chat?"
  - Subtitle: "Start a conversation with our AI chatbot today..."
  - Buttons:
    - **"Start Chat Now"**: Shows an alert (placeholder for chat interface).
    - **"Contact Us"**: Scrolls to the contact section.

### 6. **Contact Section** (`#contact`)
- **Form Fields**:
  - Name (text input)
  - Email (email input)
  - Message (textarea)
- **Submit Button**: Shows a success alert (placeholder for form submission).

### 7. **Floating Elements**
- **ChatBubble**: A persistent floating chat bubble for quick access.
- **Footer**: Standard footer component.

---
## Dependencies

| Package | Usage |
|---------|-------|
| `react` | Core library for hooks (`useState`) and component rendering. |
| `framer-motion` | Animations for sections, cards, and buttons (e.g., `motion.div`, `motion.h2`). |
| `./components` | Custom components: `Navbar`, `Hero`, `Card`, `Button`, `Footer`, `ChatBubble`, `Login`, `Signup`. |
| `./App.css` | Global styles for the application. |

---
## Notes
- The app uses **client-side routing** via state management (`currentPage`).
- **Authentication**: Basic state-based auth (no backend integration).
- **Responsive Design**: Uses Tailwind CSS classes for mobile/desktop layouts.
- **Animations**: `framer-motion` is used extensively for smooth transitions and hover effects.