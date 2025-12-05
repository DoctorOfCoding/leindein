import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { ItemAdjustment, ItemAdjustmentType } from '@/types/ledger';
import { toast } from 'sonner';

interface EditItemAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adjustment: ItemAdjustment;
}

export function EditItemAdjustmentDialog({ open, onOpenChange, adjustment }: EditItemAdjustmentDialogProps) {
  const [type, setType] = useState<ItemAdjustmentType>(adjustment.type);
  const [itemName, setItemName] = useState(adjustment.itemName);
  const [amount, setAmount] = useState(adjustment.amount.toString());
  const [date, setDate] = useState(adjustment.date);
  const [time, setTime] = useState(adjustment.time);
  const [description, setDescription] = useState(adjustment.description);

  const { state, updateItemAdjustment } = useLedger();
  const t = useTranslation(state.language);

  useEffect(() => {
    setType(adjustment.type);
    setItemName(adjustment.itemName);
    setAmount(adjustment.amount.toString());
    setDate(adjustment.date);
    setTime(adjustment.time);
    setDescription(adjustment.description);
  }, [adjustment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName && amount && parseFloat(amount) > 0) {
      updateItemAdjustment({
        ...adjustment,
        type,
        itemName,
        amount: parseFloat(amount),
        date,
        time,
        description,
      });
      onOpenChange(false);
      toast.success(state.language === 'en' ? 'Item adjustment updated!' : 'Item adjustment update ho gaya!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{t('editItemAdjustment')}</DialogTitle>
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
            <Label htmlFor="edit-itemName">{t('itemName')}</Label>
            <Input
              id="edit-itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={state.language === 'en' ? 'e.g., Mobile, Groceries...' : 'Misal: Mobile, Samaan...'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-item-amount">{t('amount')}</Label>
            <Input
              id="edit-item-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-item-date">{t('date')}</Label>
              <Input
                id="edit-item-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-time">{t('time')}</Label>
              <Input
                id="edit-item-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-item-description">{t('description')}</Label>
            <Input
              id="edit-item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={state.language === 'en' ? 'Optional note...' : 'Note (ikhtiyari)...'}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
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
