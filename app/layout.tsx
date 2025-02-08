import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyTok',
  description: 'StudyTok Created by Lawrence Arryl Lopez, Jhaden Goy, Aranno Abrar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
