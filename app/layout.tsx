//import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Painel',
  description: 'Painel',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
          >
            <ToastProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
