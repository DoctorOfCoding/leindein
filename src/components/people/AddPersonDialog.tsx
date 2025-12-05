import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { toast } from 'sonner';

export function AddPersonDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { state, addPerson } = useLedger();
  const t = useTranslation(state.language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPerson(name.trim());
      setName('');
      setOpen(false);
      toast.success(state.language === 'en' ? 'Person added!' : 'Shakhs shamil ho gaya!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" className="gap-2">
          <Plus className="w-4 h-4" />
          {t('addPerson')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{t('addPerson')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('personName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={state.language === 'en' ? 'Enter name...' : 'Naam likho...'}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim()}>
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
