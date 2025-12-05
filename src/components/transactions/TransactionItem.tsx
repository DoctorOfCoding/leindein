import { useState } from 'react';
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight, RotateCcw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction, ItemAdjustment } from '@/types/ledger';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { EditTransactionDialog } from './EditTransactionDialog';
import { EditItemAdjustmentDialog } from './EditItemAdjustmentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface TransactionItemProps {
  item: Transaction | ItemAdjustment;
  type: 'transaction' | 'adjustment';
}

export function TransactionItem({ item, type }: TransactionItemProps) {
  const { state, deleteTransaction, deleteItemAdjustment } = useLedger();
  const t = useTranslation(state.language);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isTransaction = type === 'transaction';
  const transaction = item as Transaction;
  const adjustment = item as ItemAdjustment;

  const getIcon = () => {
    if (isTransaction) {
      if (transaction.type === 'borrowed') return <ArrowDownLeft className="w-4 h-4" />;
      if (transaction.type === 'given') return <ArrowUpRight className="w-4 h-4" />;
      return <RotateCcw className="w-4 h-4" />;
    }
    return <Package className="w-4 h-4" />;
  };

  const getLabel = () => {
    if (isTransaction) {
      if (transaction.type === 'borrowed') return t('moneyBorrowed');
      if (transaction.type === 'given') return t('moneyGiven');
      return t('moneyReturned');
    }
    return adjustment.type === 'given_by_me' ? t('itemGivenByMe') : t('itemGivenToMe');
  };

  const getColorClass = () => {
    if (isTransaction) {
      if (transaction.type === 'borrowed') return 'bg-red-500/10 text-red-600';
      if (transaction.type === 'given') return 'bg-emerald-500/10 text-emerald-600';
      return 'bg-blue-500/10 text-blue-600';
    }
    return adjustment.type === 'given_by_me'
      ? 'bg-emerald-500/10 text-emerald-600'
      : 'bg-red-500/10 text-red-600';
  };

  const handleDelete = () => {
    if (isTransaction) {
      deleteTransaction(item.id);
    } else {
      deleteItemAdjustment(item.id);
    }
    setDeleteOpen(false);
    toast.success(state.language === 'en' ? 'Deleted successfully' : 'Kamyabi se mit gaya');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <div className="bg-card rounded-lg p-4 border border-border animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn('p-2 rounded-lg shrink-0', getColorClass())}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{getLabel()}</span>
                {!isTransaction && (
                  <span className="text-xs text-muted-foreground truncate">
                    ({adjustment.itemName})
                  </span>
                )}
              </div>
              <p className="text-lg font-bold font-mono text-foreground">
                Rs {item.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(item.date)} • {item.time}
              </p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {isTransaction ? (
        <EditTransactionDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          transaction={transaction}
        />
      ) : (
        <EditItemAdjustmentDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          adjustment={adjustment}
        />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
    </>
  );
}
