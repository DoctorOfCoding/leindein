import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  variant?: 'default' | 'positive' | 'negative' | 'neutral';
}

export function StatCard({ label, value, icon, variant = 'default' }: StatCardProps) {
  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <p
        className={cn(
          'text-2xl font-bold font-mono',
          variant === 'positive' && 'text-balance-positive',
          variant === 'negative' && 'text-balance-negative',
          variant === 'neutral' && 'text-foreground',
          variant === 'default' && 'text-foreground'
        )}
      >
        {variant === 'negative' && value !== 0 && '-'}
        {formatCurrency(value)}
      </p>
    </div>
  );
}
