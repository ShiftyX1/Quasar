import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { SSOCallback } from './SSOCallback';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageToggle } from '../ui/language-toggle';
import { ModeToggle } from '../mode-toggle';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'sso-callback';

export function AuthPage() {
  const { isLoading } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      setMode('sso-callback');
    } else {
      setMode('login');
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleSSOError = () => {
    setMode('login');
  };

  const renderAuthContent = () => {
    switch (mode) {
      case 'sso-callback':
        return (
          <SSOCallback 
            onError={handleSSOError}
          />
        );
      
      case 'register':
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <RegisterForm 
              onSwitchToLogin={() => setMode('login')}
            />
          </div>
        );
      
      case 'login':
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <LoginForm 
              onSwitchToRegister={() => setMode('register')}
            />
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />
      
      {mode !== 'sso-callback' && (
        <header className="absolute top-0 left-0 right-0 p-6 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold">{t('app.name')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </header>
      )}

      <main>
        {renderAuthContent()}
      </main>

      {mode !== 'sso-callback' && (
        <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-muted-foreground">
          <p>{t('app.copyright')}</p>
        </footer>
      )}
    </div>
  );
} 