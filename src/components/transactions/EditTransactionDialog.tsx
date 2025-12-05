import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { Transaction, TransactionType } from '@/types/ledger';
import { toast } from 'sonner';

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export function EditTransactionDialog({ open, onOpenChange, transaction }: EditTransactionDialogProps) {
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [time, setTime] = useState(transaction.time);
  const [description, setDescription] = useState(transaction.description);

  const { state, updateTransaction } = useLedger();
  const t = useTranslation(state.language);

  useEffect(() => {
    setType(transaction.type);
    setAmount(transaction.amount.toString());
    setDate(transaction.date);
    setTime(transaction.time);
    setDescription(transaction.description);
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      updateTransaction({
        ...transaction,
        type,
        amount: parseFloat(amount),
        date,
        time,
        description,
      });
      onOpenChange(false);
      toast.success(state.language === 'en' ? 'Transaction updated!' : 'Transaction update ho gaya!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{t('editTransaction')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('selectType')}</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrowed">{t('moneyBorrowed')}</SelectItem>
                <SelectItem value="given">{t('moneyGiven')}</SelectItem>
                <SelectItem value="returned">{t('moneyReturned')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">{t('amount')}</Label>
            <Input
              id="edit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-date">{t('date')}</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">{t('time')}</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">{t('description')}</Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={state.language === 'en' ? 'Optional note...' : 'Note (ikhtiyari)...'}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={!amount || parseFloat(amount) <= 0}>
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
