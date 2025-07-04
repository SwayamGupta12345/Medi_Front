import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Medicinal Project',
  description: 'Developed for easily medical research and paper understanding.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
