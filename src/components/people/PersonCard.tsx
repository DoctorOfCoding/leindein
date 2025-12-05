import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Person } from '@/types/ledger';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const { state, getPersonBalance } = useLedger();
  const t = useTranslation(state.language);
  const balance = getPersonBalance(person.id);

  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`;
  };

  const isPositive = balance.finalBalance > 0;
  const isNegative = balance.finalBalance < 0;

  return (
    <Link
      to={`/person/${person.id}`}
      className="block bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200 animate-fade-in"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {person.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{person.name}</h3>
            <p className="text-sm text-muted-foreground">
              {isPositive && t('youOwe')}
              {isNegative && t('theyOwe')}
              {!isPositive && !isNegative && t('balanced')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div
              className={cn(
                'flex items-center gap-1 font-mono font-bold',
                isPositive && 'text-balance-negative',
                isNegative && 'text-balance-positive',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}
            >
              {isPositive && <TrendingUp className="w-4 h-4" />}
              {isNegative && <TrendingDown className="w-4 h-4" />}
              {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
              {formatCurrency(balance.finalBalance)}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
