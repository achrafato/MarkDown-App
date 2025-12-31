'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import toast  from 'react-hot-toast';
import { useUserStore } from "@/lib/store"
import Loading from "@/components/loading";

export default function SignInPage() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const { user, isAuthenticated ,checkAuth, isLoading:loading } = useUserStore();
	const login = useUserStore((state) => state.login)

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.push("/")
		}
	}, [isAuthenticated, loading, router]);

	async function handleSubmit(e: React.FormEvent) {
	  e.preventDefault();
	  setIsLoading(true);
  
	  try {
		const res = await fetch('/api/auth/login', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ email, password }),
		});
  
		if (!res.ok) {
		  const error = await res.json();
		  toast.error('Failed to login');
		  return;
		}

		const data = await res.json();

		login(data.user); 

		toast.success('Logged in successfully');
		router.push('/');
		router.refresh();
	  } catch (error) {
		toast.error('An error occurred');
	  } finally {
		setIsLoading(false);
	  }
	}

	if (loading || isAuthenticated) {
		return <Loading />;
	}

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-2xl font-bold">Sign in to MDown</div>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
			  <Input
					id="email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
        		/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password ?
                </Link> */}
              </div>
              <Input 
					id="password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
				/>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-foreground hover:text-primary transition-colors font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
