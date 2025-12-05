import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { ArrowDownLeft, ArrowUpRight, Package } from 'lucide-react';

export default function Dashboard() {
  const { state, getOverallStats } = useLedger();
  const t = useTranslation(state.language);
  const stats = getOverallStats();

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        <header className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-muted-foreground text-sm">
            {state.language === 'en' ? 'Track your borrowings & lendings' : 'Apne hisab kitab rakho'}
          </p>
        </header>

        <BalanceCard />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={t('totalBorrowed')}
            value={stats.totalBorrowed}
            icon={<ArrowDownLeft className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            label={t('totalGiven')}
            value={stats.totalGiven}
            icon={<ArrowUpRight className="w-5 h-5" />}
            variant="default"
          />
        </div>

        <StatCard
          label={t('totalAdjustments')}
          value={stats.totalAdjustments}
          icon={<Package className="w-5 h-5" />}
          variant="neutral"
        />
      </div>
    </AppLayout>
  );
}
