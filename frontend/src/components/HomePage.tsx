import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { MessageSquare, Users, Settings, PlusCircle } from 'lucide-react';

export function HomePage() {
  const { user, config } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('pages.home.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('pages.home.description')}
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{t('navigation.profile')}</span>
          </CardTitle>
          <CardDescription>
            Your current account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('auth.username')}</p>
              <p className="text-lg">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('auth.email')}</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Auth Provider</p>
              <p className="text-lg capitalize">{user?.authProvider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-lg">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
                                    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <MessageSquare className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>{t('pages.rooms.title')}</CardTitle>
            <CardDescription>
              Join existing chat rooms or create new ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <MessageSquare className="mr-2 h-4 w-4" />
              View Rooms ({t('pages.rooms.description')})
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <PlusCircle className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>{t('pages.rooms.createRoom')}</CardTitle>
            <CardDescription>
              Start a new conversation with your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('pages.rooms.createRoom')} ({t('pages.rooms.description')})
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Settings className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>{t('pages.settings.title')}</CardTitle>
            <CardDescription>
              Customize your chat experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Settings className="mr-2 h-4 w-4" />
              {t('pages.settings.title')} ({t('pages.settings.description')})
            </Button>
          </CardContent>
        </Card>
      </div>

      {config && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Current authentication setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Auth Mode:</span>
                <span className="text-sm text-muted-foreground capitalize">{config.authMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Local Auth:</span>
                <span className="text-sm text-muted-foreground">
                  {config.showLocalAuth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">SSO Auth:</span>
                <span className="text-sm text-muted-foreground">
                  {config.showSSOAuth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Registration:</span>
                <span className="text-sm text-muted-foreground">
                  {config.isLocalRegistrationAllowed ? 'Allowed' : 'Disabled'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 