"use client"

import { useEffect } from "react"
import { useUserStore } from "@/lib/store"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useUserStore((state) => state.checkAuth)

  useEffect(() => {
    // This runs only once when the app loads
    checkAuth()
  }, [checkAuth])

  return (
  		<>
  			{children}
		</>
	)
}