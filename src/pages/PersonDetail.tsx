import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';
import { AddItemAdjustmentDialog } from '@/components/transactions/AddItemAdjustmentDialog';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getPersonBalance, deletePerson } = useLedger();
  const t = useTranslation(state.language);

  const person = state.persons.find((p) => p.id === id);
  
  if (!person) {
    return (
      <AppLayout>
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/people')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {state.language === 'en' ? 'Back' : 'Wapis'}
          </Button>
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {state.language === 'en' ? 'Person not found' : 'Shakhs nahi mila'}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const balance = getPersonBalance(person.id);
  const isPositive = balance.finalBalance > 0;
  const isNegative = balance.finalBalance < 0;

  const transactions = state.transactions.filter((t) => t.personId === id);
  const adjustments = state.itemAdjustments.filter((i) => i.personId === id);

  const allItems = [
    ...transactions.map((t) => ({ ...t, itemType: 'transaction' as const })),
    ...adjustments.map((a) => ({ ...a, itemType: 'adjustment' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`;
  };

  const handleDelete = () => {
    deletePerson(person.id);
    navigate('/people');
    toast.success(state.language === 'en' ? 'Person deleted' : 'Shakhs mit gaya');
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <header className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/people')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {state.language === 'en' ? 'Back' : 'Wapis'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle>{t('delete')}</AlertDialogTitle>
                <AlertDialogDescription>{t('confirmDelete')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('no')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t('yes')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-3xl font-semibold text-primary">
              {person.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{person.name}</h1>
          <div className="flex items-center justify-center gap-2">
            {isPositive && <TrendingUp className="w-5 h-5 text-balance-negative" />}
            {isNegative && <TrendingDown className="w-5 h-5 text-balance-positive" />}
            {!isPositive && !isNegative && <Minus className="w-5 h-5 text-muted-foreground" />}
            <span
              className={cn(
                'text-3xl font-bold font-mono',
                isPositive && 'text-balance-negative',
                isNegative && 'text-balance-positive',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}
            >
              {formatCurrency(balance.finalBalance)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isPositive && t('youOwe')}
            {isNegative && t('theyOwe')}
            {!isPositive && !isNegative && t('balanced')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">{t('borrowed')}</p>
            <p className="font-bold font-mono text-foreground">{formatCurrency(balance.totalBorrowed)}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">{t('given')}</p>
            <p className="font-bold font-mono text-foreground">{formatCurrency(balance.totalGiven)}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">{t('returned')}</p>
            <p className="font-bold font-mono text-foreground">{formatCurrency(balance.totalReturned)}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">{t('itemsGivenByMe')}</p>
            <p className="font-bold font-mono text-foreground">{formatCurrency(balance.totalItemsGivenByMe)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <AddTransactionDialog personId={person.id} />
          <AddItemAdjustmentDialog personId={person.id} />
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">{t('transactions')}</h2>
          {allItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">{t('noTransactions')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allItems.map((item) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  type={item.itemType}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
