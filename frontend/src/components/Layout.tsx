import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { LanguageToggle } from './ui/language-toggle';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { LogOut, MessageSquare, Menu, X, Home, Users, Settings, User } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/rooms', icon: Users, label: t('pages.rooms.title') },
    { path: '/settings', icon: Settings, label: t('pages.settings.title') },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Menu button (mobile) + Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-lg lg:text-xl font-bold hidden sm:block">
                {t('app.name')}
              </h1>
            </div>
          </div>
          
          {/* Right: User info + controls */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* User info - hidden on mobile */}
            <div className="hidden lg:block text-sm">
              <span className="text-muted-foreground">{t('navigation.profile')}:</span>{' '}
              <span className="font-medium">{user?.username || user?.email}</span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              <LanguageToggle />
              <ModeToggle />
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="p-2 lg:px-3 lg:py-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">{t('auth.signOut')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-card">
          <div className="p-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.username || user?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.authProvider}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Button
                      variant={isActivePath(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={closeMobileMenu}
            />
            <aside className="fixed left-0 top-0 h-full w-80 bg-card border-r z-50 lg:hidden transform transition-transform">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-bold">{t('app.name')}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user?.username || user?.email}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.authProvider}
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="px-4 pb-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Button
                          variant={isActivePath(item.path) ? "secondary" : "ghost"}
                          className="w-full justify-start text-base py-3"
                          onClick={() => {
                            navigate(item.path);
                            closeMobileMenu();
                          }}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden border-t bg-card sticky bottom-0 z-40">
        <div className="flex">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`flex-1 flex-col h-16 rounded-none ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 