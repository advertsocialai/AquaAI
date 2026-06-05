import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Share2, Lightbulb, GraduationCap } from 'lucide-react';
import { MobileTopBar, MobileTabBar } from '@/components/mobile/MobileChrome';

/* ── Large explore card (Aqua Feed / Aqua School) ─────────────────── */
function ExploreCard({
  to, title, desc, gradient, Icon,
}: { to: string; title: string; desc: string; gradient: string; Icon: React.ElementType }) {
  return (
    <Link
      to={to}
      className={`block rounded-3xl p-6 bg-gradient-to-br ${gradient} active:scale-[0.99] transition relative overflow-hidden`}
    >
      <div className="max-w-[72%]">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        <p className="mt-3 text-neutral-800 leading-snug">{desc}</p>
        <ArrowRight className="w-7 h-7 mt-7 text-neutral-900" />
      </div>
      {/* Faint decorative icon, bottom-right */}
      <Icon className="absolute right-5 top-1/2 -translate-y-1/2 w-28 h-28 text-white/55" strokeWidth={1.1} />
    </Link>
  );
}

export default function ExplorePage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t('explorePage.docTitle'); }, [t]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileTopBar title={t('explorePage.topBarTitle')} />

      <main className="max-w-md mx-auto px-5 pt-5 pb-28 space-y-6">
        <ExploreCard
          to="/knowledge"
          title={t('explorePage.feedTitle')}
          desc={t('explorePage.feedDesc')}
          gradient="from-[#a7e0cf] to-[#d6f0e4]"
          Icon={Share2}
        />
        <ExploreCard
          to="/knowledge"
          title={t('explorePage.schoolTitle')}
          desc={t('explorePage.schoolDesc')}
          gradient="from-[#74c0f0] to-[#a9d8f6]"
          Icon={Lightbulb}
        />

        {/* Academic collaboration credit */}
        <div className="pt-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-teal-600/30 flex items-center justify-center bg-white shadow-sm">
            <GraduationCap className="w-11 h-11 text-teal-700" strokeWidth={1.4} />
          </div>
          <p className="mt-4 text-neutral-700">{t('explorePage.collabLabel')}</p>
          <p className="text-rose-600 font-bold text-lg">{t('explorePage.universityName')}</p>
        </div>
      </main>

      <MobileTabBar active="farm" />
    </div>
  );
}
