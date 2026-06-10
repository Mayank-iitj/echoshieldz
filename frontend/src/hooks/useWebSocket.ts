'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage, AnalysisResponse } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: (callId: string) => void;
  disconnect: () => void;
  sendAudioChunk: (audioData: ArrayBuffer) => void;
  sendCallEnd: () => void;
  lastMessage: WebSocketMessage | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const callIdRef = useRef<string>('');

  const { onMessage, onConnected, onDisconnected, onError } = options;

  const connect = useCallback((callId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    callIdRef.current = callId;
    const ws = new WebSocket(`${WS_URL}/api/v1/ws/call/${callId}`);

    ws.onopen = () => {
      setIsConnected(true);
      onConnected?.();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setLastMessage(message);
        onMessage?.(message);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      onDisconnected?.();
    };

    ws.onerror = (error) => {
      onError?.(error);
    };

    wsRef.current = ws;
  }, [onMessage, onConnected, onDisconnected, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendAudioChunk = useCallback((audioData: ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const base64 = btoa(
        new Uint8Array(audioData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      wsRef.current.send(
        JSON.stringify({
          type: 'audio_chunk',
          data: base64,
          sample_rate: 16000,
        })
      );
    }
  }, []);

  const sendCallEnd = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'call_end' }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    sendAudioChunk,
    sendCallEnd,
    lastMessage,
  };
}

export default useWebSocket;