import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';

interface SSOCallbackProps {
  onError?: () => void;
}

export function SSOCallback({ onError }: SSOCallbackProps) {
  const { handleSSOCallback } = useAuth();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          const message = errorDescription || `OAuth error: ${error}`;
          setErrorMessage(message);
          setStatus('error');
          onError?.();
          return;
        }

        if (!code || !state) {
          setErrorMessage('Missing required parameters from SSO provider');
          setStatus('error');
          onError?.();
          return;
        }

        const result = await handleSSOCallback(code, state);
        
        if (result.success) {
          setStatus('success');
        } else {
          setErrorMessage(result.error || 'Authentication failed');
          setStatus('error');
          onError?.();
        }
      } catch (error) {
        console.error('SSO callback error:', error);
        setErrorMessage('An unexpected error occurred during authentication');
        setStatus('error');
        onError?.();
      }
    };

    processCallback();
  }, [handleSSOCallback, searchParams, onError]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="text-lg font-medium">Authenticating...</h3>
              <p className="text-muted-foreground">Please wait while we complete your sign-in</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="h-8 w-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-600">Authentication Successful!</h3>
              <p className="text-muted-foreground">Redirecting you to the application...</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <h3 className="text-lg font-medium">Authentication Failed</h3>
              <p className="text-muted-foreground">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">SSO Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
} 