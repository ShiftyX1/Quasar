import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { MessageSquare, Users, Settings, PlusCircle, Activity, Clock, Shield } from 'lucide-react';

export function HomePage() {
  const { user, config } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-3 lg:space-y-4">
        <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('pages.home.title')}
        </h1>
        <p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          {t('pages.home.description')}
        </p>
      </div>

      {/* Quick Actions Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg lg:text-xl">{t('pages.rooms.title')}</CardTitle>
            <CardDescription className="text-sm">
              Join existing chat rooms or create new ones
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full" disabled>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">View Rooms</span>
              <span className="sm:hidden">Rooms</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <PlusCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg lg:text-xl">{t('pages.rooms.createRoom')}</CardTitle>
            <CardDescription className="text-sm">
              Start a new conversation with your team
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full" disabled>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('pages.rooms.createRoom')}</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <Settings className="h-10 w-10 lg:h-12 lg:w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg lg:text-xl">{t('pages.settings.title')}</CardTitle>
            <CardDescription className="text-sm">
              Customize your chat experience
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full" disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('pages.settings.title')}</span>
              <span className="sm:hidden">Settings</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Card - Responsive */}
      <Card className="lg:max-w-2xl lg:mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t('auth.username')}</p>
              <p className="text-base lg:text-lg font-medium">{user?.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t('auth.email')}</p>
              <p className="text-base lg:text-lg font-medium truncate">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Auth Provider</p>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <p className="text-base lg:text-lg font-medium capitalize">{user?.authProvider}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-base lg:text-lg font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status Card - Collapsible on Mobile */}
      {config && (
        <Card className="lg:max-w-2xl lg:mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Current authentication setup and system information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Auth Mode</span>
                <span className="text-sm text-muted-foreground capitalize font-mono">
                  {config.authMode}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Local Auth</span>
                <span className={`text-sm font-medium ${
                  config.showLocalAuth ? 'text-green-600' : 'text-red-600'
                }`}>
                  {config.showLocalAuth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">SSO Auth</span>
                <span className={`text-sm font-medium ${
                  config.showSSOAuth ? 'text-green-600' : 'text-red-600'
                }`}>
                  {config.showSSOAuth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Registration</span>
                <span className={`text-sm font-medium ${
                  config.isLocalRegistrationAllowed ? 'text-green-600' : 'text-red-600'
                }`}>
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