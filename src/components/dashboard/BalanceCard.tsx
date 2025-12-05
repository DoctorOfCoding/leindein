import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function BalanceCard() {
  const { state, getOverallStats } = useLedger();
  const t = useTranslation(state.language);
  const { overallBalance } = getOverallStats();

  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`;
  };

  const isPositive = overallBalance > 0;
  const isNegative = overallBalance < 0;
  const isBalanced = overallBalance === 0;

  return (
    <div
      className={cn(
        'rounded-2xl p-6 text-center shadow-lg animate-slide-up',
        isPositive && 'bg-gradient-to-br from-red-500 to-red-600',
        isNegative && 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        isBalanced && 'bg-gradient-to-br from-primary to-primary/80'
      )}
    >
      <p className="text-white/80 text-sm font-medium mb-1">{t('overallBalance')}</p>
      <div className="flex items-center justify-center gap-2 mb-2">
        {isPositive && <TrendingUp className="w-6 h-6 text-white" />}
        {isNegative && <TrendingDown className="w-6 h-6 text-white" />}
        {isBalanced && <Minus className="w-6 h-6 text-white" />}
        <span className="text-4xl font-bold text-white font-mono">
          {formatCurrency(overallBalance)}
        </span>
      </div>
      <p className="text-white/90 text-sm font-medium">
        {isPositive && t('youOwe')}
        {isNegative && t('theyOwe')}
        {isBalanced && t('balanced')}
      </p>
    </div>
  );
}
