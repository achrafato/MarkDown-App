'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import toast  from 'react-hot-toast';
import { useUserStore } from "@/lib/store"
import Loading from "@/components/loading"

export default function SignUpPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
	const { user, isAuthenticated ,checkAuth, isLoading:loading } = useUserStore();

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.push("/")
		}
	}, [isAuthenticated, loading, router]);


  const signup = useUserStore((state) => state.signup)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== cpassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to sign up');
        return;
      }

      const data = await res.json();

      signup(data.user);

      toast.success('Account created successfully');
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
        <div className="text-2xl font-bold">Create an account</div>
        <CardDescription>Enter your information to get started with MDown</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
           </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-foreground hover:text-primary transition-colors font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  </div>

  )
}
