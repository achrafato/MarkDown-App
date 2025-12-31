'use client'

import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"

import { useRouter } from 'next/navigation';
import { MobileMenu } from "./ui/mobilemenu"
import { useEffect } from "react"


export function BlogHeader() {
  const { isAuthenticated, logout, user } = useUserStore()

  const router = useRouter();

  useEffect(() => {
    if (!user && isAuthenticated) {
      logout()
      router.push('/login');
      return;
    }
  }, [])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      logout(); 
      // toast({ title: 'Logged out' });
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-foreground">Down</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Articles
            </Link>
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/authors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Authors
            </Link>
            
            {
              isAuthenticated &&
              <>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </>
            }
          </nav>

          <div className="flex items-center gap-3">
            
            <Link
              href="/search"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Search</span>
            </Link>

            <div className="flex items-center gap-2">
              {
                isAuthenticated ? 
                <Button variant="outline" className="cursor-pointer" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                :
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              }
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
