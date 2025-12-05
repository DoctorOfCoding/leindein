import { AppLayout } from '@/components/layout/AppLayout';
import { PersonCard } from '@/components/people/PersonCard';
import { AddPersonDialog } from '@/components/people/AddPersonDialog';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { Users } from 'lucide-react';

export default function People() {
  const { state } = useLedger();
  const t = useTranslation(state.language);

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <header className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('people')}</h1>
            <p className="text-muted-foreground text-sm">
              {state.persons.length} {state.language === 'en' ? 'people' : 'log'}
            </p>
          </div>
          <AddPersonDialog />
        </header>

        {state.persons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{t('noPeople')}</h3>
            <p className="text-sm text-muted-foreground">{t('addFirstPerson')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.persons.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
