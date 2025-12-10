import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate('/admin');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
          toast({
            title: 'Sign Up Failed',
            description: signUpError.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account Created',
            description: 'Your account has been created. You can now sign in.',
          });
          setIsSignUp(false);
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        
        if (signInError) {
          setError('Access Denied — you don\'t have admin privileges');
          toast({
            title: 'Access Denied',
            description: 'Invalid credentials or insufficient privileges',
            variant: 'destructive',
          });
        } else {
          // Wait briefly for isAdmin check to complete, then navigate
          toast({
            title: 'Signed In',
            description: 'Redirecting to dashboard...',
          });
        }
      }
    } catch (err) {
      setError('Access Denied — you don\'t have admin privileges');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background particle-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel p-8 animate-fade-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-neon flex items-center justify-center mx-auto mb-4 shadow-neon">
              {isSignUp ? <User className="h-8 w-8 text-primary-foreground" /> : <Lock className="h-8 w-8 text-primary-foreground" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{isSignUp ? 'Create Account' : 'Admin Login'}</h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Sign up for a new account' : 'Sign in to access the dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 animate-fade-up">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              variant="neon"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
            
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
