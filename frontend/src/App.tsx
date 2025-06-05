import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTranslation } from './hooks/useTranslation';
import { AuthPage } from './components/auth/AuthPage';
import { HomePage } from './components/HomePage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { ThemeProvider } from './components/theme-provider';
import { Loader2 } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="App">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">{t('app.loading')}</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
              } 
            />
            
            <Route 
              path="/profile-setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/rooms" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">{t('pages.rooms.title')}</h2>
                      <p className="text-muted-foreground">{t('pages.rooms.description')}</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">{t('pages.settings.title')}</h2>
                      <p className="text-muted-foreground">{t('pages.settings.description')}</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />} 
            />
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;