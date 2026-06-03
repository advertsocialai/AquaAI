import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, FlaskConical, Wind, Boxes, Phone, Check, Loader2, type LucideIcon } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { submitServiceRequest, flushServiceRequestQueue } from '@/services/api';

const CALL_NUMBER = '+919705713399';

type Field = { key: string; options: string[] };
type Provider = {
  id: string;
  icon: LucideIcon;
  tile: string;     // pastel icon-tile color
  accent: string;   // accent button color
  fields: Field[];
};

// Single typed, data-driven config. Labels/options come from i18n by key.
const PROVIDERS: Provider[] = [
  {
    id: 'transporters',
    icon: Truck,
    tile: 'bg-orange-100 text-orange-600',
    accent: 'bg-orange-500 hover:bg-orange-600 text-white',
    fields: [
      { key: 'serviceType', options: ['plTransport', 'broodstock', 'harvest', 'reefer'] },
      { key: 'loadSize', options: ['under1MT', 'mt1to5', 'mt5to15', 'over15MT'] },
      { key: 'whenNeeded', options: ['today', 'within2days', 'thisWeek', 'scheduleLater'] },
    ],
  },
  {
    id: 'lab',
    icon: FlaskConical,
    tile: 'bg-sky-100 text-sky-600',
    accent: 'bg-sky-500 hover:bg-sky-600 text-white',
    fields: [
      { key: 'service', options: ['pcrEhp', 'waterTest', 'rental', 'buy'] },
      { key: 'sample', options: ['postLarvae', 'water', 'tissue', 'feed', 'na'] },
      { key: 'turnaround', options: ['sameDay', 'h24', 'd2to3'] },
    ],
  },
  {
    id: 'oxygen',
    icon: Wind,
    tile: 'bg-violet-100 text-violet-600',
    accent: 'bg-violet-500 hover:bg-violet-600 text-white',
    fields: [
      { key: 'product', options: ['liquidOxygen', 'cylinders', 'aerator', 'emergency'] },
      { key: 'pondSize', options: ['under1ac', 'ac1to3', 'ac3to10', 'over10ac'] },
      { key: 'urgency', options: ['emergencyNow', 'today', 'scheduled'] },
    ],
  },
  {
    id: 'resources',
    icon: Boxes,
    tile: 'bg-amber-100 text-amber-600',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    fields: [
      { key: 'resource', options: ['feed', 'probiotics', 'limeMinerals', 'liners', 'other'] },
      { key: 'species', options: ['vannamei', 'tiger', 'scampi', 'fish'] },
      { key: 'quantity', options: ['small', 'medium', 'bulk'] },
    ],
  },
];

function ProviderCard({ provider }: { provider: Provider }) {
  const { t } = useTranslation();
  const baseId = useId();
  const Icon = provider.icon;
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'queued'>('idle');
  const [showPhone, setShowPhone] = useState(false);

  const allFilled = provider.fields.every((f) => values[f.key]);
  const p = (suffix: string) => `serviceProviders.providers.${provider.id}.${suffix}`;

  async function onSubmit() {
    if (!allFilled || status === 'sending') return;
    setStatus('sending');
    const res = await submitServiceRequest({
      providerId: provider.id,
      values,
      timestamp: new Date().toISOString(),
    });
    setStatus(res.ok ? 'sent' : 'queued');
  }

  return (
    <div id={`provider-${provider.id}`} className="flex flex-col h-full p-6 rounded-2xl border border-border bg-card shadow-sm scroll-mt-28">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${provider.tile}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{t(p('title'))}</h3>
      <p className="text-sm text-foreground/60 mt-1 mb-5 leading-relaxed">{t(p('desc'))}</p>

      <div className="space-y-3 flex-1">
        {provider.fields.map((f) => {
          const selectId = `${baseId}-${f.key}`;
          return (
            <div key={f.key}>
              <label htmlFor={selectId} className="block text-xs font-medium text-foreground/70 mb-1.5">
                {t(p(`fields.${f.key}.label`))}
              </label>
              <Select
                value={values[f.key] ?? ''}
                onValueChange={(v) => { setValues((s) => ({ ...s, [f.key]: v })); if (status !== 'idle') setStatus('idle'); }}
              >
                <SelectTrigger id={selectId} aria-label={t(p(`fields.${f.key}.label`))} className="w-full">
                  <SelectValue placeholder={t('serviceProviders.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {t(p(`fields.${f.key}.options.${opt}`))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!allFilled || status === 'sending' || status === 'sent'}
          className={`w-full ${status === 'sent' ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : provider.accent}`}
        >
          {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'sent' && <Check className="w-4 h-4" />}
          {status === 'sent'
            ? t('serviceProviders.sent')
            : status === 'queued'
              ? t('serviceProviders.offlineQueued')
              : t('serviceProviders.submit')}
        </Button>

        {showPhone ? (
          <a
            href={`tel:${CALL_NUMBER}`}
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50"
          >
            <Phone className="w-4 h-4" /> {CALL_NUMBER}
          </a>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPhone(true)}
            className="w-full gap-2"
          >
            <Phone className="w-4 h-4" /> {t('serviceProviders.call')}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ServiceProviders() {
  const { t } = useTranslation();

  // Offline-safe: try to flush any queued requests on mount + when back online.
  useEffect(() => {
    flushServiceRequestQueue();
    const onOnline = () => flushServiceRequestQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
    <section className="py-24 border-t border-border bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="text-sm text-teal-300 uppercase tracking-widest mb-4">
            {t('serviceProviders.eyebrow')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            {t('serviceProviders.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
}
