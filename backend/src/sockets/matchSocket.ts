import { WebSocketServer, WebSocket } from 'ws';
import { apiService, Match } from '../services/apiService';

export class MatchSocketServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private matchClients: Map<number, Set<WebSocket>> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);
      console.log(`New WebSocket connection. Total clients: ${this.clients.size}`);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'subscribe_match') {
            const matchId = data.matchId;
            if (!this.matchClients.has(matchId)) {
              this.matchClients.set(matchId, new Set());
            }
            this.matchClients.get(matchId)!.add(ws);
            console.log(`Client subscribed to match ${matchId}`);
          } else if (data.type === 'unsubscribe_match') {
            const matchId = data.matchId;
            this.matchClients.get(matchId)?.delete(ws);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        this.matchClients.forEach((clients) => clients.delete(ws));
        console.log(`WebSocket disconnected. Total clients: ${this.clients.size}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    this.startPolling();
  }

  private startPolling() {
    const pollInterval = parseInt(process.env.POLL_INTERVAL || '30000', 10);
    
    this.pollInterval = setInterval(async () => {
      try {
        const changedMatches = await apiService.pollMatches();
        
        changedMatches.forEach(match => {
          this.broadcastMatchUpdate(match);
        });
      } catch (error) {
        console.error('Error in polling:', error);
      }
    }, pollInterval);

    console.log(`Started polling every ${pollInterval}ms`);
  }

  broadcastMatchUpdate(match: Match) {
    const message = JSON.stringify({
      type: 'match_update',
      matchId: match.id,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
      status: match.status,
      minute: this.getMatchMinute(match),
      match,
    });

    // Broadcast to all clients
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // Broadcast to match-specific subscribers
    const matchSubscribers = this.matchClients.get(match.id);
    if (matchSubscribers) {
      matchSubscribers.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  broadcastMatchEvent(matchId: number, event: any) {
    const message = JSON.stringify({
      type: 'match_event',
      matchId,
      event,
    });

    const matchSubscribers = this.matchClients.get(matchId);
    if (matchSubscribers) {
      matchSubscribers.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  private getMatchMinute(match: Match): number {
    if (match.status === 'LIVE') {
      // Mock minute calculation
      const startTime = new Date(match.utcDate).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 60000);
      return Math.min(elapsed, 90);
    }
    return 0;
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.wss.close();
  }
}

