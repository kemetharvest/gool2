import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  wsPort: parseInt(process.env.WS_PORT || '3002', 10),
  externalApiUrl: process.env.EXTERNAL_API_URL || 'https://api.football-data.org/v4',
  externalApiKey: process.env.EXTERNAL_API_KEY || '',
  pollInterval: parseInt(process.env.POLL_INTERVAL || '30000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};

