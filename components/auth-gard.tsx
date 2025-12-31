"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { logout, user, isLoading, checkAuth } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    checkAuth() // Ensure we check status when this component mounts
  }, [checkAuth])

  useEffect(() => {
    // If finished loading and NO user is found -> Redirect
    if (!isLoading && !user) {
      logout()
      router.push("/signin")
    }
  }, [user, isLoading, router])

  // While checking, show a loading spinner (or return null)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not loading and no user, don't render anything (redirect is happening)
  if (!user) {
    return null
  }

  // If user exists, render the protected content
  return <>{children}</>
}