import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { generateAvatarUrl, AVATAR_BACKGROUND_COLORS } from '../lib/userHelpers';
import { apiClient } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';

export function ProfileSetupPage() {
  const { user, refreshUserData } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [selectedColor, setSelectedColor] = useState(AVATAR_BACKGROUND_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarUrl = generateAvatarUrl(firstName || user?.firstName, lastName || user?.lastName, selectedColor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      setError(t('validation.required'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      await apiClient.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatarUrl: avatarUrl,
      });

      
      const refreshedUser = await refreshUserData();
      
      if (refreshedUser) {
        navigate('/', { replace: true });
      } else {
        console.error('ProfileSetup: failed to refresh user data');
        setError('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Profile setup failed:', error);
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

//   const handleSkip = () => {
//     navigate('/', { replace: true });
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('pages.profileSetup.title')}</CardTitle>
          <CardDescription>
            {t('pages.profileSetup.description')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                <img 
                  src={avatarUrl} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('pages.profileSetup.avatarBackground')}</Label>
                <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                  {AVATAR_BACKGROUND_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-primary border-4 scale-110' 
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: `#${color}` }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('pages.profileSetup.firstName')}</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('pages.profileSetup.placeholders.firstName')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('pages.profileSetup.lastName')}</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('pages.profileSetup.placeholders.lastName')}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !firstName.trim() || !lastName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('pages.profileSetup.completeSetup')
              )}
            </Button>
            
            {/* <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for now
            </Button> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 