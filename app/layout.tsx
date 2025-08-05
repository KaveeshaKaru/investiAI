import { Geist_Mono as GeistMono, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const geistMono = GeistMono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
