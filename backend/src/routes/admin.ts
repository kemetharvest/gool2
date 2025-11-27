import { Router, Request, Response } from 'express';
import { MatchSocketServer } from '../sockets/matchSocket';

const router = Router();

let socketServer: MatchSocketServer | null = null;

export function setSocketServer(server: MatchSocketServer) {
  socketServer = server;
}

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = {
      activeMatches: 12, // Mock - in production, get from cache
      connectedClients: socketServer?.getConnectedClientsCount() || 0,
      serverHealth: 'healthy',
      uptime: process.uptime(),
      apiRequests: {
        total: 1250,
        today: 450,
        errors: 5,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
    
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

