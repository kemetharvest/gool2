import express from 'express';
import cors from 'cors';
import { config } from './config';
import { MatchSocketServer } from './sockets/matchSocket';
import matchesRouter from './routes/matches';
import leaguesRouter from './routes/leagues';
import teamsRouter from './routes/teams';
import newsRouter from './routes/news';
import adminRouter, { setSocketServer } from './routes/admin';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matches', matchesRouter);
app.use('/api/leagues', leaguesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/news', newsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start WebSocket server
const wsServer = new MatchSocketServer(config.wsPort);
setSocketServer(wsServer);

// Start HTTP server
app.listen(config.port, () => {
  console.log(`🚀 YallaGoal Backend Server running on http://localhost:${config.port}`);
  console.log(`📡 WebSocket Server running on ws://localhost:${config.wsPort}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  wsServer.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  wsServer.stop();
  process.exit(0);
});

