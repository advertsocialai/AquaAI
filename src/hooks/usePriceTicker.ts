import { useEffect, useRef, useState } from 'react';

type Tick = { type: 'tick'; prices: Record<string, number> };

const WS_URL = (() => {
  const base = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';
  return base.replace(/^http/, 'ws') + '/pricing-ws/ticker';
})();

// Local random-walk fallback so the UI works without a backend connection.
const ANCHORS: Record<string, number> = {
  'vannamei-30': 515, 'vannamei-40': 415, 'vannamei-50': 350,
  'vannamei-60': 305, 'vannamei-70': 265, 'vannamei-80': 235,
  'vannamei-100': 200, 'monodon-20': 825, 'monodon-30': 660,
  'scampi-8': 625, 'rohu': 160, 'seabass': 400,
};

export function usePriceTicker(intervalMs = 5000) {
  const [prices, setPrices] = useState<Record<string, number>>(ANCHORS);
  const [connected, setConnected] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number>(Date.now());
  const wsRef = useRef<WebSocket | null>(null);
  const fallbackRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    function startFallback() {
      if (fallbackRef.current) return;
      fallbackRef.current = window.setInterval(() => {
        setPrices((prev) => {
          const next: Record<string, number> = {};
          for (const [sku, anchor] of Object.entries(ANCHORS)) {
            const drift = Math.floor((Math.random() - 0.5) * 12);
            const cur = prev[sku] ?? anchor;
            next[sku] = Math.max(Math.round(anchor * 0.8), Math.min(Math.round(anchor * 1.15), cur + drift));
          }
          return next;
        });
        setUpdatedAt(Date.now());
      }, intervalMs);
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => { if (!cancelled) setConnected(true); };
      ws.onmessage = (e) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse(e.data) as Tick;
          if (payload.type === 'tick' && payload.prices) {
            setPrices(payload.prices);
            setUpdatedAt(Date.now());
          }
        } catch { /* noop */ }
      };
      ws.onclose = () => { if (!cancelled) { setConnected(false); startFallback(); } };
      ws.onerror = () => { if (!cancelled) { setConnected(false); startFallback(); } };
    } catch {
      startFallback();
    }

    return () => {
      cancelled = true;
      wsRef.current?.close();
      if (fallbackRef.current) window.clearInterval(fallbackRef.current);
      fallbackRef.current = null;
    };
  }, [intervalMs]);

  return { prices, connected, updatedAt };
}
