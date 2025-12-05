import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package } from 'lucide-react';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { ItemAdjustmentType } from '@/types/ledger';
import { toast } from 'sonner';

interface AddItemAdjustmentDialogProps {
  personId: string;
}

export function AddItemAdjustmentDialog({ personId }: AddItemAdjustmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ItemAdjustmentType>('given_by_me');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [description, setDescription] = useState('');

  const { state, addItemAdjustment } = useLedger();
  const t = useTranslation(state.language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName && amount && parseFloat(amount) > 0) {
      addItemAdjustment({
        personId,
        type,
        itemName,
        amount: parseFloat(amount),
        date,
        time,
        description,
      });
      resetForm();
      setOpen(false);
      toast.success(state.language === 'en' ? 'Item adjustment added!' : 'Item adjustment shamil ho gaya!');
    }
  };

  const resetForm = () => {
    setType('given_by_me');
    setItemName('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().slice(0, 5));
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Package className="w-4 h-4" />
          {t('addItemAdjustment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{t('addItemAdjustment')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('selectType')}</Label>
            <Select value={type} onValueChange={(v) => setType(v as ItemAdjustmentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="given_by_me">{t('itemGivenByMe')}</SelectItem>
                <SelectItem value="given_to_me">{t('itemGivenToMe')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemName">{t('itemName')}</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={state.language === 'en' ? 'e.g., Mobile, Groceries...' : 'Misal: Mobile, Samaan...'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-amount">{t('amount')}</Label>
            <Input
              id="item-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-date">{t('date')}</Label>
              <Input
                id="item-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-time">{t('time')}</Label>
              <Input
                id="item-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">{t('description')}</Label>
            <Input
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={state.language === 'en' ? 'Optional note...' : 'Note (ikhtiyari)...'}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={!itemName || !amount || parseFloat(amount) <= 0}>
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
