import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { TransactionType } from '@/types/ledger';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  personId: string;
}

export function AddTransactionDialog({ personId }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('borrowed');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [description, setDescription] = useState('');

  const { state, addTransaction } = useLedger();
  const t = useTranslation(state.language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      addTransaction({
        personId,
        type,
        amount: parseFloat(amount),
        date,
        time,
        description,
      });
      resetForm();
      setOpen(false);
      toast.success(state.language === 'en' ? 'Transaction added!' : 'Transaction shamil ho gaya!');
    }
  };

  const resetForm = () => {
    setType('borrowed');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().slice(0, 5));
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('addTransaction')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{t('addTransaction')}</DialogTitle>
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
            <Label htmlFor="amount">{t('amount')}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">{t('time')}</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={state.language === 'en' ? 'Optional note...' : 'Note (ikhtiyari)...'}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
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
