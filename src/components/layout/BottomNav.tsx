import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { useLedger } from '@/context/LedgerContext';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { state } = useLedger();
  const t = useTranslation(state.language);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/people', icon: Users, label: t('people') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
