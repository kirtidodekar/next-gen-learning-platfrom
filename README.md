# 🚀 Next-Gen Learning Dashboard

A modern learning management dashboard built with **Next.js 15**, **Supabase**, **Tailwind CSS**, and **Framer Motion**.

## 🚀 What This Project Does

* Tracks learning progress across multiple courses
* Displays personalized dashboard insights
* Visualizes learning activity and streaks
* Provides analytics for course completion and focus time
* Creates an engaging learning experience with modern UI and animations

## 🧩 Key Features

* Modern Bento Grid dashboard layout
* Responsive design for desktop, tablet, and mobile
* Course progress tracking
* Learning streak monitoring
* Activity visualization dashboard
* Smooth animations and micro-interactions
* Supabase-powered data management
* Clean dark-themed UI

## 🏗 Architecture

### Frontend Layer

* Next.js 15 App Router
* React Server Components
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend Layer

* Supabase Database
* Server-side data fetching
* Secure environment-based configuration

### Data Flow

```text
User Interface
      ↓
Next.js App Router
      ↓
Server Components
      ↓
Supabase Database
      ↓
Dashboard Analytics & Course Data
```

## 🛠 Tech Stack

| Category        | Technology    |
| --------------- | ------------- |
| Frontend        | Next.js 15    |
| Language        | TypeScript    |
| Styling         | Tailwind CSS  |
| Animations      | Framer Motion |
| Database        | Supabase      |
| Icons           | Lucide React  |
| Deployment      | Vercel        |
| Version Control | Git & GitHub  |

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/next-gen-learning-dashboard.git
cd next-gen-learning-dashboard
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 📦 Production Build

```bash
npm run build
npm start
```

## 🔮 Future Improvements

* AI Learning Assistant
* Personalized Recommendations
* Real-time Progress Updates
* User Authentication
* Course Certificates

## 📄 License

MIT License
