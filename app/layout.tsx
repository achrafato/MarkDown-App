import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BlogHeader } from "@/components/blog-header"
import { Toaster } from 'react-hot-toast';
import "./globals.css"
import AuthProvider from "@/components/auth-provider"
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <BlogHeader />
            {children}
        </AuthProvider>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            // DEFAULT STYLE (For normal toasts)
            style: {
              background: '#333',
              color: '#fff',
            },

            // SUCCESS STYLE (Green)
            success: {
              style: {
                background: '#dcfce7', // Light green (Tailwind green-100)
                color: '#166534',      // Dark green (Tailwind green-800)
                border: '1px solid #bbb',
              },
              iconTheme: {
                primary: '#166534',
                secondary: '#dcfce7',
              },
            },

            // ERROR STYLE (Red)
            error: {
              style: {
                background: '#fee2e2', // Light red (Tailwind red-100)
                color: '#991b1b',      // Dark red (Tailwind red-800)
                border: '1px solid #bbb',
              },
              iconTheme: {
                primary: '#991b1b',
                secondary: '#fee2e2',
              },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}

