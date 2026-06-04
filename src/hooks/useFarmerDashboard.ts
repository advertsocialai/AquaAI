import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export type DashAction = {
  kind: 'urgent' | 'warning' | 'info';
  title: string;
  meta: string;
  to: string;
};
export type DashActivity = {
  when: string;
  what: string;
  detail: string;
  status: 'ok' | 'alert';
};

export type FarmerDashboardData = {
  farmName: string | null;
  district: string | null;
  ponds: number;
  totalAreaHectares: number;
  activeBatches: number;
  dayOfCycle: number | null;
  actions: DashAction[];
  activity: DashActivity[];
};

const EMPTY: FarmerDashboardData = {
  farmName: null, district: null, ponds: 0, totalAreaHectares: 0,
  activeBatches: 0, dayOfCycle: null, actions: [], activity: [],
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} d ago`;
}

/**
 * Loads the signed-in farmer's live dashboard from Supabase (RLS-scoped to
 * their own farms). Degrades to empty state when unauthenticated, unconfigured,
 * or the farmer has no farm yet.
 */
export function useFarmerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<FarmerDashboardData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !user) { setLoading(false); return; }
    const sb = supabase;
    let cancelled = false;

    (async () => {
      setLoading(true); setError(null);
      try {
        // Farm tables key to the legacy `users` table (bigint id), not the
        // Supabase auth uuid. Resolve the numeric owner id via the email.
        const { data: legacyUser } = await sb
          .from('users').select('id').eq('email', user.email ?? '').maybeSingle();
        const ownerId = legacyUser?.id;
        if (ownerId == null) {
          if (!cancelled) { setData(EMPTY); setLoading(false); }
          return;
        }

        const { data: farms, error: fErr } = await sb
          .from('farms')
          .select('id,name,district,mandal,total_area_hectares,created_at')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: true });
        if (fErr) throw fErr;

        if (!farms || farms.length === 0) {
          if (!cancelled) { setData(EMPTY); setLoading(false); }
          return;
        }
        const farm = farms[0];
        const farmIds = farms.map((f) => f.id);

        const [pondsRes, batchesRes, wqRes, outbreakRes] = await Promise.all([
          sb.from('ponds').select('id,area_sqm,is_active').in('farm_id', farmIds),
          sb.from('batches').select('id,stocked_at,is_stocked,batch_code').in('farm_id', farmIds),
          sb.from('water_quality_readings')
            .select('id,pond_id,dissolved_oxygen_mgl,ph,any_alert,alert_details,recorded_at')
            .in('farm_id', farmIds).order('recorded_at', { ascending: false }).limit(10),
          farm.district
            ? sb.from('outbreak_alerts')
                .select('id,disease,district,mandal,severity,radius_km,created_at')
                .eq('district', farm.district).order('created_at', { ascending: false }).limit(5)
            : Promise.resolve({ data: [], error: null }),
        ]);

        const ponds = pondsRes.data ?? [];
        const batches = batchesRes.data ?? [];
        const readings = wqRes.data ?? [];
        const outbreaks = outbreakRes.data ?? [];

        // On-device history for this farmer's batches (counting, diagnosis,
        // grading, QC) — RLS-scoped; empty when none / not permitted.
        const batchIds = batches.map((b) => b.id);
        const [countRes, diagRes, gradeRes, qcRes] = await Promise.all([
          sb.from('counting_sessions').select('id,total_count,extrapolated_count,synced_at')
            .in('batch_id', batchIds).order('synced_at', { ascending: false }).limit(5),
          sb.from('diagnosis_sessions').select('id,hard_fail_disease,synced_at')
            .in('batch_id', batchIds).order('synced_at', { ascending: false }).limit(5),
          sb.from('grading_sessions').select('id,composite_grade,count_mismatch,synced_at')
            .in('batch_id', batchIds).order('synced_at', { ascending: false }).limit(5),
          sb.from('qc_certificates').select('certificate_id,grade,is_valid,created_at')
            .in('batch_id', batchIds).order('created_at', { ascending: false }).limit(5),
        ]);
        const counts = countRes.data ?? [];
        const diags = diagRes.data ?? [];
        const grades = gradeRes.data ?? [];
        const qcs = qcRes.data ?? [];

        const stocked = batches.filter((b) => b.is_stocked && b.stocked_at);
        const latestStocked = stocked
          .map((b) => new Date(b.stocked_at as string).getTime())
          .sort((a, b) => b - a)[0];
        const dayOfCycle = latestStocked
          ? Math.max(1, Math.round((Date.now() - latestStocked) / 86_400_000))
          : null;

        const totalAreaHectares = Number(farm.total_area_hectares ?? 0) ||
          ponds.reduce((s, p) => s + Number(p.area_sqm ?? 0), 0) / 10_000;

        // ── Today's actions ──────────────────────────────────────────────
        const actions: DashAction[] = [];
        const lowDo = readings.find((r) => Number(r.dissolved_oxygen_mgl ?? 99) < 4);
        if (lowDo) {
          actions.push({
            kind: 'urgent',
            title: `Low dissolved O₂ (${Number(lowDo.dissolved_oxygen_mgl).toFixed(1)} ppm)`,
            meta: `Reading ${relativeTime(lowDo.recorded_at as string)}`,
            to: '/aquaai#dashboard',
          });
        }
        const flagged = readings.find((r) => r.any_alert && r.id !== lowDo?.id);
        if (flagged) {
          actions.push({
            kind: 'warning',
            title: 'Water quality alert flagged',
            meta: relativeTime(flagged.recorded_at as string),
            to: '/aquaai#dashboard',
          });
        }
        outbreaks.slice(0, 1).forEach((o) => {
          actions.push({
            kind: 'warning',
            title: `${o.disease ?? 'Disease'} reported in ${o.mandal ?? o.district}`,
            meta: `${o.severity ?? 'alert'} · ${relativeTime(o.created_at as string)}`,
            to: '/aquaai#dashboard',
          });
        });

        // ── Recent activity — merged real history, newest first ──────────
        type Item = DashActivity & { ts: number };
        const items: Item[] = [];
        const add = (iso: string | null, what: string, detail: string, status: 'ok' | 'alert') => {
          if (!iso) return;
          const ts = Date.parse(iso);
          if (!Number.isFinite(ts)) return;
          items.push({ ts, when: relativeTime(iso), what, detail, status });
        };
        readings.forEach((r) => add(
          r.recorded_at as string, 'Water quality reading',
          `DO ${Number(r.dissolved_oxygen_mgl ?? 0).toFixed(1)} ppm · pH ${Number(r.ph ?? 0).toFixed(1)}`,
          r.any_alert ? 'alert' : 'ok',
        ));
        counts.forEach((c) => add(
          c.synced_at as string, 'Seed count',
          `${Number(c.total_count ?? c.extrapolated_count ?? 0).toLocaleString('en-IN')} PLs`, 'ok',
        ));
        diags.forEach((d) => add(
          d.synced_at as string, 'Disease screen',
          d.hard_fail_disease ? `${d.hard_fail_disease} flagged` : 'No condition flagged',
          d.hard_fail_disease ? 'alert' : 'ok',
        ));
        grades.forEach((g) => add(
          g.synced_at as string, 'Grading',
          g.composite_grade ? `Grade ${g.composite_grade}` : 'Completed',
          g.count_mismatch ? 'alert' : 'ok',
        ));
        qcs.forEach((q) => add(
          q.created_at as string, 'QC certificate issued',
          `${q.certificate_id ?? ''}${q.grade ? ` · Grade ${q.grade}` : ''}`.trim(),
          q.is_valid === false ? 'alert' : 'ok',
        ));
        const activity: DashActivity[] = items
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 6)
          .map(({ when, what, detail, status }) => ({ when, what, detail, status }));

        if (!cancelled) {
          setData({
            farmName: farm.name ?? null,
            district: [farm.mandal, farm.district].filter(Boolean).join(', ') || null,
            ponds: ponds.length,
            totalAreaHectares: Math.round(totalAreaHectares * 10) / 10,
            activeBatches: stocked.length,
            dayOfCycle,
            actions,
            activity,
          });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load dashboard.');
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { data, loading, error };
}
