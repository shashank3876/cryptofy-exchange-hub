
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin, Loader2 } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { success, error } = await auth.signIn(email, password);

      if (success) {
        navigate("/app/dashboard");
      } else {
        setError(error || "Failed to sign in");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
        <div className="animate-fade-in max-w-md w-full mx-auto">
          <div className="bg-card border rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex justify-center mb-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Bitcoin className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Cryptofy</span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
            <p className="text-center text-muted-foreground mb-6">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default SignIn;
