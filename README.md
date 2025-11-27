# YallaGoal - يلا جول

A complete production-ready football web application with real-time updates, built with React + TypeScript + Tailwind CSS (frontend) and Node.js + Express + WebSocket (backend).

## 🚀 Features

- **Live Matches**: Real-time match updates with WebSocket
- **Match Details**: Comprehensive match information, lineups, and events
- **Leagues Browser**: Browse leagues and view league tables
- **Teams Browser**: Explore teams and their matches
- **News Section**: Football news and articles
- **Admin Dashboard**: Server statistics and monitoring
- **RTL Support**: Full Arabic RTL layout
- **Dark/Light Theme**: Theme switching with persistence
- **Beautiful Animations**: Framer Motion animations throughout

## 📁 Project Structure

```
yallagoal1/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── routes/          # API routes
│   │   ├── services/        # API service layer
│   │   ├── sockets/         # WebSocket server
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Setup & Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (or use the provided `.env.example`):
```env
PORT=3001
WS_PORT=3002
EXTERNAL_API_URL=https://api.football-data.org/v4
EXTERNAL_API_KEY=your_api_key_here
POLL_INTERVAL=30000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on:
- HTTP API: http://localhost:3001
- WebSocket: ws://localhost:3002

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## 📡 API Endpoints

### Matches
- `GET /api/matches?day=yesterday|today|tomorrow` - Get matches by day
- `GET /api/matches/:id` - Get match details
- `GET /api/matches/:id/events` - Get match events
- `GET /api/matches/:id/lineups` - Get match lineups

### Leagues
- `GET /api/leagues` - Get all leagues
- `GET /api/leagues/:id` - Get league details
- `GET /api/leagues/:id/table` - Get league table
- `GET /api/leagues/:id/matches` - Get league matches

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `GET /api/teams/:id/matches` - Get team matches

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news article

### Admin
- `GET /api/admin/stats` - Get server statistics

## 🔌 WebSocket Events

### Client → Server
- `subscribe_match`: Subscribe to match updates
  ```json
  { "type": "subscribe_match", "matchId": 123 }
  ```
- `unsubscribe_match`: Unsubscribe from match updates
  ```json
  { "type": "unsubscribe_match", "matchId": 123 }
  ```

### Server → Client
- `match_update`: Match score/status update
  ```json
  {
    "type": "match_update",
    "matchId": 123,
    "homeScore": 2,
    "awayScore": 1,
    "status": "LIVE",
    "minute": 55
  }
  ```
- `match_event`: Match event (goal, card, etc.)
  ```json
  {
    "type": "match_event",
    "matchId": 123,
    "event": { ... }
  }
  ```

## 🎨 Tech Stack

### Backend
- Node.js
- Express
- WebSocket (ws)
- TypeScript
- Axios

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query
- shadcn/ui (inspired components)

## 🌍 RTL & Arabic Support

The application is fully RTL-enabled with:
- Arabic fonts (Cairo, Tajawal)
- RTL layout throughout
- Arabic date/time formatting
- RTL-aware animations

## 🎭 Theme System

- Dark/Light theme toggle
- Theme persistence in localStorage
- Smooth theme transitions
- Tailwind dark mode support

## 📝 Notes

- The backend currently uses mock data. To use a real API, update the `apiService.ts` file with actual API calls.
- WebSocket polling interval is configurable via `POLL_INTERVAL` in `.env`
- All components are responsive and mobile-friendly

## 🚀 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📄 License

ISC

