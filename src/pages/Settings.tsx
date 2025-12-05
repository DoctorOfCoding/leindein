import { useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { Language } from '@/types/ledger';
import { Download, Upload, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { state, setLanguage, exportData, importData } = useLedger();
  const t = useTranslation(state.language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(state.language === 'en' ? 'Data exported!' : 'Data export ho gaya!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importData(content);
        if (success) {
          toast.success(state.language === 'en' ? 'Data imported!' : 'Data import ho gaya!');
        } else {
          toast.error(state.language === 'en' ? 'Invalid file format' : 'Ghalat file format');
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        <header className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
        </header>

        <div className="bg-card rounded-xl p-4 border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <Label className="text-foreground font-medium">{t('language')}</Label>
              <p className="text-xs text-muted-foreground">
                {state.language === 'en' ? 'Choose your language' : 'Apni zuban chuniye'}
              </p>
            </div>
          </div>
          <Select value={state.language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="ur">{t('romanUrdu')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border space-y-4">
          <h2 className="font-semibold text-foreground">
            {state.language === 'en' ? 'Backup & Restore' : 'Backup aur Restore'}
          </h2>
          
          <Button onClick={handleExport} variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            {t('exportData')}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full gap-2"
          >
            <Upload className="w-4 h-4" />
            {t('importData')}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>
            {state.language === 'en'
              ? 'Data is stored locally on your device'
              : 'Data aapke device mein mehfooz hai'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
