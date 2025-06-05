import type { ReactNode } from 'react';
import { Button } from './ui/button';
import { LanguageToggle } from './ui/language-toggle';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { LogOut, MessageSquare } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{t('app.name')}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">{t('navigation.profile')}:</span>{' '}
              <span className="font-medium">{user?.username || user?.email}</span>
            </div>
            <LanguageToggle />
            <ModeToggle />
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('auth.signOut')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 