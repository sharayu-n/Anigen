# 🌌 Anigen — Collaborative AI Storytelling Platform

![Anigen Banner](./public/banner.png)

## 🚀 Overview
Anigen is a premium, real-time collaborative storytelling platform where users create avatars, co-write stories with friends, and transform them into high-quality animated videos or manga.

It blends social creativity with cutting-edge AI to turn imagination into visual experiences.

---

## ✨ Features

### 👤 User & Avatar System
- Secure authentication (Email + Social login)
- AI-powered avatar creation:
  - Text prompt → character generation
  - Image upload → refined character
- Persistent character traits for story consistency

### 🏠 Story Rooms (Real-Time)
- Create or join collaborative rooms
- Multi-user live story editing
- Presence indicators
- Real-time syncing using Supabase Realtime

### ✍️ Story Engine
- Structured storytelling (characters, scenes, timeline)
- AI-assisted plot suggestions
- Scene breakdown and continuity management

### 🎬 AI Media Generation
- **Video Generation (Veo)**
- **Manga/Comics (Nanobanana)**
- **Music & Mood (Lyria)**

### 📊 Dashboard
- View all created stories
- Track generation progress
- Export video or manga
- Share via public links

---

## 🧠 AI Stack
- **Nanobanana** → Avatar + Image/Manga generation
- **Veo** → Video generation
- **Lyria** → Music + mood enhancement
- **Gemini Live** → Real-time multimodal interaction

---

## 🏗️ Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Supabase (Auth, Database, Realtime, Storage)
- **Database:** PostgreSQL
- **Animations:** GSAP / CSS

---
## 📸 Screenshots / Demo

Add images inside `/public`:

```md
![Room UI](./public/room.png)
![Avatar Creator](./public/avatar.png)
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/anigen.git
cd anigen
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_AI_API_KEY=
```

### 4. Run the App
```bash
npm run dev
```

---

## 🧪 Testing

### Manual Flow
1. Create a room  
2. Join from another tab  
3. Create avatar  
4. Write story collaboratively  
5. Finalize story  
6. Generate video/manga/music  
7. Export and share  

---

## 🎨 Design System
- Celestial Dark theme  
- Glassmorphism UI  
- Neon accents  
- Smooth animations  

---

## 🔮 Future Enhancements
- Voice-based storytelling  
- AI-generated dialogue scenes  
- Multiplayer roleplay mode  
- Mobile app  

---

## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss your ideas.

---

## 💡 Vision
Create stories together → turn them into cinematic experiences instantly.
