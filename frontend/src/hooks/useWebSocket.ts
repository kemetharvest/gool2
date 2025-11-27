import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  matchId?: number;
  [key: string]: any;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002';

export function useWebSocket(url?: string, onMessage?: (message: WebSocketMessage) => void) {
  const wsUrl = url || WS_URL;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          if (onMessage) {
            onMessage(message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, reconnecting...');
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [wsUrl, onMessage]);

  useEffect(() => {
    if (wsUrl) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, wsUrl]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribeToMatch = useCallback((matchId: number) => {
    sendMessage({ type: 'subscribe_match', matchId });
  }, [sendMessage]);

  const unsubscribeFromMatch = useCallback((matchId: number) => {
    sendMessage({ type: 'unsubscribe_match', matchId });
  }, [sendMessage]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribeToMatch,
    unsubscribeFromMatch,
  };
}

