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
## 📊 Dashboard

### Overview
The **Dashboard** serves as the primary user interface after authentication, providing an interactive space for users to engage with the ChatBot.

### Purpose
- Central hub for initiating and managing AI conversations
- Displays active chats, history, and quick access to features
- Personal workspace for each authenticated user

### Key Features

| Feature | Description |
|---------|-------------|
| **Chat Interface** | Real-time messaging with AI, supporting text input/output with rich formatting |
| **Conversation History** | Chronological list of past sessions with search and filter capabilities |
| **Quick Actions** | One-click options for new chat, clear history, and favorite conversations |
| **User Profile** | Access to account settings, preferences, and personalization options |
| **Real-time Feedback** | Typing indicators, message status (sent/delivered), and read receipts |
| **Multimedia Support** | Ability to send/receive images, documents, and other file types (future) |

### Technical Implementation
- **State Management**: Tracks active conversations, messages, and user preferences
- **Real-time Communication**: Uses WebSocket or Server-Sent Events (SSE) for instant messaging
- **Responsive Layout**: Adapts to mobile, tablet, and desktop screens
- **Persistence**: Local storage for chat history and user settings

### Components
```jsx
// Example structure
<Dashboard>
  <Sidebar />        // Navigation and chat history
  <ChatContainer>    // Main chat area
    <MessageList />  // Conversation messages
    <InputArea />    // Text input and send button
  </ChatContainer>
  <UserPanel />      // Profile and settings
</Dashboard>
```

---

## 🔐 Admin Interface

### Overview
The **Admin Interface** is a protected section designed for system administrators to manage the ChatBot platform, users, and content.

### Purpose
- Centralized control panel for system configuration and monitoring
- User and content management capabilities
- Analytics and performance insights
- System maintenance and updates

### Key Features

#### 👥 User Management
- **CRUD Operations**: Create, Read, Update, Delete user accounts
- **Role Assignment**: Assign roles (Admin, Moderator, User) with granular permissions
- **Search & Filter**: Find users by email, name, status, or registration date
- **Bulk Actions**: Select multiple users for batch operations
- **Activity Logs**: Track user actions and login history

#### 📈 Analytics Dashboard
- **Usage Statistics**: Total messages, active users, session duration
- **Performance Metrics**: Response times, AI accuracy scores, user satisfaction
- **Visual Reports**: Charts and graphs for trends analysis (daily/weekly/monthly)
- **Export Data**: Download reports in CSV, PDF, or Excel formats

#### 🛡️ Content Moderation
- **Message Review**: Queue of flagged or reported messages
- **Content Filtering**: Automatic detection of inappropriate content
- **Blacklist Management**: Custom word/phrase blacklists
- **Manual Override**: Approve, reject, or edit AI responses

#### ⚙️ System Configuration
- **AI Settings**: Configure model parameters, temperature, and response style
- **API Management**: Add, remove, or update third-party API keys
- **Customization**: Modify chatbot name, avatar, and personality
- **Language Settings**: Add/remove supported languages and translations

#### 🤖 Bot Training
- **Training Data**: Upload, edit, or remove training datasets
- **Test Mode**: Simulate conversations to test AI responses
- **Version Control**: Track changes to training data
- **Model Fine-tuning**: Adjust AI behavior for specific use cases

### Access Control
- **Authentication**: Requires valid credentials
- **Authorization**: Admin role required (role-based access control)
- **Security**: Protected routes, CSRF protection, and rate limiting
- **Audit Trail**: Complete log of all administrative actions

### Technical Implementation
- **Protected Routes**: Only accessible to authenticated admin users
- **API Endpoints**: Dedicated backend routes for admin operations
- **Real-time Updates**: Live data synchronization across admin sessions
- **Data Validation**: Server-side validation for all admin actions

### Components
```jsx
// Example structure
<AdminLayout>
  <AdminNavbar />     // Admin-specific navigation
  <AdminSidebar />    // Quick access to admin sections
  <MainContent>
    <Route path="/admin/users" element={<UserManagement />} />
    <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
    <Route path="/admin/moderation" element={<ModerationQueue />} />
    <Route path="/admin/settings" element={<SystemSettings />} />
    <Route path="/admin/training" element={<BotTraining />} />
  </MainContent>
</AdminLayout>
```

---


 