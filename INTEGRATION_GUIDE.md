# 🚀 ChatBot Frontend + Backend Integration Guide

## Overview

This guide explains how to connect the **React frontend** with the **Django backend** to create a fully functional ChatBot application.

---

## 📁 Project Structure

```
ChatBot/
├── BACK-END/
│   └── django-projet/
│       └── backend/
│           ├── config/          # Django settings & URLs
│           ├── api/             # ✅ Centralized API layer (NEW)
│           │   ├── views/       # All API endpoints
│           │   ├── serializers/  # DRF serializers
│           │   └── urls.py      # API routing
│           └── apps/            # Django apps with models & services
│               ├── chatbot/      # Conversation, Message models
│               ├── user/        # Custom User model
│               ├── dataset/     # FAQ, Document models
│               └── analytics/    # QueryLog model
│
└── front/
    ├── src/
    │   ├── config/          # ✅ API configuration (NEW)
    │   │   └── api.js       # Centralized API client
    │   ├── components/      # React components
    │   │   ├── ChatBubble.jsx   # ✅ Updated with real API calls
    │   │   └── ...
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 🔧 Setup Instructions

### Prerequisites

- **Python 3.10+** (for Django backend)
- **Node.js 18+** (for React frontend)
- **pip** (Python package manager)
- **npm** (Node.js package manager)

---

## 🏃 Step 1: Backend Setup

### 1.1 Navigate to Backend Directory

```cmd
cd C:\Users\dell\Desktop\ChatBot\BACK-END\django-projet\backend
```

### 1.2 Install Python Dependencies

```cmd
pip install -r requirements.txt
```

If you don't have `requirements.txt`, install these packages:

```cmd
pip install django djangorestframework django-cors-headers python-dotenv openai rest_framework_simplejwt
```

### 1.3 Run Database Migrations

```cmd
python manage.py migrate
```

### 1.4 Create Superuser (Optional)

```cmd
python manage.py createsuperuser
```
*Follow the prompts to create an admin account.*

### 1.5 Start Django Development Server

```cmd
python manage.py runserver
```

**✅ Backend will be running at:** `http://127.0.0.1:8000/`

---

## 🖥️ Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory

```cmd
cd C:\Users\dell\Desktop\ChatBot\front
```

### 2.2 Install Node.js Dependencies

```cmd
npm install
```

### 2.3 Configure API Base URL (Optional)

Create a `.env` file in the `front/` directory:

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

*If you skip this, it will default to `http://localhost:8000/api`*

### 2.4 Start Vite Development Server

```cmd
npm run dev
```

**✅ Frontend will be running at:** `http://localhost:5173`

---

## 🌐 Step 3: Verify Connection

### 3.1 Test Backend API Directly

Open a new terminal and test the API:

```cmd
curl -X POST http://localhost:8000/api/chatbot/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "user_id": 1}'
```

**Expected Response:**
```json
{
    "conversation_id": 1,
    "message": "I'm doing well, thank you for asking! How can I help you today?",
    "response_time": 1.23
}
```

### 3.2 Open Frontend in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

### 3.3 Test the Chat

1. Click the floating chat bubble (💬) in the bottom-right corner
2. Type a message and press Enter
3. **Expected:** Your message appears, then the bot responds with a real AI response from the backend

---

## 📡 API Endpoints Reference

All backend endpoints are under `/api/` prefix:

| Domain | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| **Auth** | `/api/users/api/token/` | POST | Get JWT access token |
| **Auth** | `/api/users/api/token/refresh/` | POST | Refresh JWT token |
| **Auth** | `/api/users/current/` | GET | Get current user info |
| **Chat** | `/api/chatbot/chat/` | POST | Send message, get AI response |
| **Chat** | `/api/chatbot/upload/` | POST | Upload dataset file |
| **Chat** | `/api/chatbot/analytics/` | GET | Get chat analytics |
| **Chat** | `/api/chatbot/conversations/{id}/history/` | GET | Get conversation history |
| **Dataset** | `/api/dataset/faq/` | GET | List all FAQs |
| **Dataset** | `/api/dataset/documents/` | GET | List all documents |
| **Dataset** | `/api/dataset/search/` | POST | Search FAQs & documents |
| **Dataset** | `/api/dataset/documents/upload/` | POST | Upload document |
| **Analytics** | `/api/analytics/summary/` | GET | Get analytics summary |
| **Analytics** | `/api/analytics/query-logs/` | GET | List query logs |
| **Analytics** | `/api/analytics/user/` | GET | Get user-specific analytics |
| **TTS** | `/api/tts/` | POST | Text-to-speech (placeholder) |

---

## 🔗 Frontend API Integration

The frontend now uses a **centralized API client** located at:
```
front/src/config/api.js
```

### Usage Examples

#### Send a Chat Message

```javascript
import { api } from '../config/api';

// Send message to chatbot
const response = await api.chat.sendMessage("Hello!", 1);
console.log(response.message); // AI's reply
```

#### Get Current User

```javascript
const user = await api.auth.getCurrentUser();
console.log(user.username);
```

#### Login

```javascript
const credentials = { username: 'admin', password: 'password' };
const tokens = await api.auth.login(credentials);
console.log(tokens.access); // JWT access token
```

#### Search Datasets

```javascript
const results = await api.dataset.search("AI chatbot", 5);
console.log(results.results); // Array of matching items
```

---

## ⚙️ Configuration Details

### Backend Configuration

**File:** `config/settings.py`

```python
# CORS settings (for development)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
```

### Frontend Configuration

**File:** `src/config/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// All API endpoints are organized by domain
export const api = {
  auth: { login, refreshToken, getCurrentUser },
  chat: { sendMessage, getConversationHistory, uploadDataset, getAnalytics },
  dataset: { getFAQs, getFAQ, getDocuments, uploadDocument, deleteDocument, search },
  analytics: { getSummary, getQueryLogs, getUserAnalytics },
  tts: { generate },
};
```

---

## 🛠️ Customization

### Change Backend Port

If you want to run Django on a different port:

```cmd
python manage.py runserver 8080
```

Then update the frontend configuration:

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

Or update the default in `api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Change Frontend Port

```cmd
npm run dev -- --port 3000
```

---

## 🐛 Troubleshooting

### Problem: CORS Errors

**Solution:** Make sure `django-cors-headers` is installed and configured:

```cmd
pip install django-cors-headers
```

And verify these are in `settings.py`:

```python
INSTALLED_APPS = [
    ...,
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOW_ALL_ORIGINS = True
```

### Problem: Connection Refused

**Solution:** Make sure both servers are running:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

Test with:
```cmd
curl http://localhost:8000/api/chatbot/chat/
```

### Problem: 404 Not Found on API Endpoints

**Solution:** Verify the URL structure:
- All endpoints are under `/api/` prefix
- Example: `http://localhost:8000/api/chatbot/chat/`

### Problem: JWT Authentication Failed

**Solution:** 
1. Make sure you're sending the token in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```
2. Get a token first:
```javascript
const tokens = await api.auth.login({ username, password });
```

---

## 🎯 Next Steps

### 1. Implement User Authentication

Update your Login/Signup components to use:

```javascript
// Login
const handleLogin = async (email, password) => {
  try {
    const tokens = await api.auth.login({ username: email, password });
    api.setAuthToken(tokens.access);
    // Store user info
    const user = await api.auth.getCurrentUser();
    setUser(user);
    navigate('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. Implement TTS (Text-to-Speech)

Install a TTS library in the backend:

```cmd
pip install gtts
```

Then update `api/views/tts_views.py`:

```python
from gtts import gTTS
import io

def text_to_speech_view(request):
    text = request.data.get('text')
    if not text:
        return Response({"error": "Text is required"}, status=400)
    
    tts = gTTS(text=text, lang='en')
    audio_stream = io.BytesIO()
    tts.write_to_fp(audio_stream)
    
    return Response(
        audio_stream.getvalue(),
        content_type='audio/wav'
    )
```

### 3. Add More Features

- **Conversation History**: Use `/api/chatbot/conversations/{id}/history/`
- **FAQ Management**: Use `/api/dataset/faq/` endpoints
- **Analytics Dashboard**: Use `/api/analytics/summary/`
- **Document Upload**: Use `/api/dataset/documents/upload/`

---

## 📚 Additional Resources

- **Django REST Framework**: https://www.django-rest-framework.org/
- **Django CORS Headers**: https://github.com/adamchainz/django-cors-headers
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **Framer Motion**: https://www.framer.com/motion/

---

## ✅ Summary

You now have:

✅ **Backend**: Clean, scalable Django API with centralized architecture  
✅ **Frontend**: React UI with real API integration  
✅ **Connection**: Frontend can communicate with backend  
✅ **Chat**: Real AI responses from Django backend  
✅ **CORS**: Cross-origin requests enabled for development  

**Your ChatBot application is now fully connected!** 🎉

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Start Backend
cd BACK-END/django-projet/backend
python manage.py migrate
python manage.py runserver

# Start Frontend
cd front
npm install
npm run dev

# Test API
curl -X POST http://localhost:8000/api/chatbot/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "user_id": 1}'

# Open in Browser
# http://localhost:5173
```
