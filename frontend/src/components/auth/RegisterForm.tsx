import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { createRegisterSchema, type RegisterFormData } from '../../lib/validations';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { 
    register: registerUser, 
    loginWithSSO, 
    isLocalAuthAvailable, 
    isSSORAvailable, 
    isLocalRegistrationAvailable,
    isLoading, 
    error, 
    clearError 
  } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = createRegisterSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    
    const { confirmPassword, ...registerData } = data;
    
    const result = await registerUser(registerData);
    
    if (!result.success) {
      console.error('Registration failed:', result.error);
    } else {
      reset();
    }
  };

  const handleSSORLogin = async () => {
    clearError();
    await loginWithSSO();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{t('auth.signUp')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.signUpDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSSORAvailable && (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSSORLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('auth.continueWithSSO')}
            </Button>
            
            {isLocalAuthAvailable && isLocalRegistrationAvailable && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.orContinueWith')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {isLocalAuthAvailable && isLocalRegistrationAvailable ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                {t('auth.username')}
              </label>
              <Input
                id="username"
                type="text"
                placeholder={t('auth.usernamePlaceholder')}
                error={errors.username?.message}
                {...register('username')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('auth.email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {t('auth.passwordRequirements')}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.signingUp')}
                </>
              ) : (
                t('auth.signUp')
              )}
            </Button>
          </form>
        ) : (
          (!isSSORAvailable || (!isLocalAuthAvailable || !isLocalRegistrationAvailable)) && (
            <Alert variant="destructive">
              <AlertDescription>
                {t('auth.noAuthMethods')}
              </AlertDescription>
            </Alert>
          )
        )}

        {onSwitchToLogin && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSwitchToLogin}
            >
              {t('auth.signIn')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 