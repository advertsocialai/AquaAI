import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getOutbreaks, type Outbreak } from '@/services/api';

const COORDS: Record<string, [number, number]> = {
  'West Godavari': [16.7167, 81.1000],
  Krishna:         [16.5417, 81.5219],
  Nellore:         [14.4426, 79.9865],
  Surat:           [21.1702, 72.8311],
  Bhubaneswar:     [20.2961, 85.8245],
  Kakdwip:         [21.8688, 88.1788],
};

const SEVERITY_COLOR: Record<Outbreak['severity'], string> = {
  high: '#f87171',
  medium: '#fb923c',
  low: '#34d399',
};

export function OutbreakHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [data, setData] = useState<Outbreak[]>([]);
  const [loading, setLoading] = useState(true);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [19.5, 80],
      zoom: 5,
      minZoom: 4,
      maxZoom: 9,
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Fetch outbreaks.
  useEffect(() => {
    let alive = true;
    getOutbreaks().then((rows) => {
      if (!alive) return;
      setData(rows);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  // Render markers when data changes.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const o of data) {
      const coord = COORDS[o.district];
      if (!coord) continue;
      const color = SEVERITY_COLOR[o.severity];
      const radius = 6 + Math.min(o.farms, 20);
      const marker = L.circleMarker(coord, {
        color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 1.5,
        radius,
      });
      marker.bindTooltip(
        `<div style="font-size:11px;line-height:1.4">
           <div style="font-weight:600">${o.district}, ${o.state}</div>
           <div>${o.disease} · ${o.species}</div>
           <div>${o.farms} farm${o.farms === 1 ? '' : 's'} · ${o.severity}</div>
         </div>`,
        { direction: 'top', offset: [0, -8], opacity: 0.95 },
      );
      marker.addTo(layer);
    }
  }, [data]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-foreground">Outbreak Heatmap</span>
          <span className="text-[10px] text-foreground/30">— last 14 days · NSPAAD sync</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {(['high', 'medium', 'low'] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 text-foreground/60">
              <span className="w-2 h-2 rounded-full" style={{ background: SEVERITY_COLOR[s] }} />
              {s}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0.4 : 1 }}
        className="relative"
        style={{ height: 360 }}
      >
        <div ref={containerRef} style={{ height: '100%', width: '100%', background: '#0a0a0a' }} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground/40 pointer-events-none">
            Loading outbreak data…
          </div>
        )}
      </motion.div>

      <div className="px-5 py-2.5 border-t border-border flex items-center gap-2 text-[11px] text-foreground/40">
        <MapPin className="w-3 h-3 text-red-400" />
        {data.length} active cluster{data.length === 1 ? '' : 's'} · OpenStreetMap dark tiles
      </div>
    </div>
  );
}
