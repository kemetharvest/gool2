# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on:
- HTTP API: http://localhost:3001
- WebSocket: ws://localhost:3002

**Note:** Make sure to create a `.env` file in the `backend` directory with:
```
PORT=3001
WS_PORT=3002
EXTERNAL_API_URL=https://api.football-data.org/v4
EXTERNAL_API_KEY=your_api_key_here
POLL_INTERVAL=30000
NODE_ENV=development
```

### Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on: http://localhost:3000

### Step 3: Open in Browser

Navigate to http://localhost:3000 and enjoy! 🎉

## 📝 What You'll See

- **Home Page**: Live matches with real-time updates
- **Match Details**: Full match information, lineups, and events
- **Leagues**: Browse all leagues and view league tables
- **Teams**: Explore teams and their matches
- **News**: Football news articles
- **Admin Dashboard**: Server statistics and monitoring

## 🔧 Troubleshooting

### Backend won't start
- Make sure port 3001 and 3002 are not in use
- Check that all dependencies are installed: `npm install`
- Verify your `.env` file exists

### Frontend won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed: `npm install`
- Ensure the backend is running first

### WebSocket not connecting
- Verify backend WebSocket server is running on port 3002
- Check browser console for connection errors
- Make sure CORS is properly configured

## 🎨 Features to Try

1. **Theme Toggle**: Click the sun/moon icon in the navbar
2. **Live Updates**: Watch matches update in real-time
3. **Match Details**: Click any match card to see full details
4. **Lineups**: View team formations on a football pitch
5. **Events Timeline**: See goals, cards, and substitutions as they happen

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the API service to use real football data APIs
- Deploy to production following the build instructions

