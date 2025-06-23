import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marvin | Bipolar Mood Moose - Infinite Synergy AI',
  description: 'Meet Marvin, your emotionally intelligent AI companion for exploring bipolar experiences through authentic conversations and real-time voice interaction.',
  keywords: 'marvin, bipolar, mood, AI companion, emotional intelligence, mental health, infinite synergy, conversational AI, voice chat',
  authors: [{ name: 'Infinite Synergy AI', url: 'https://infinitesynergy.ai' }],
  viewport: 'width=device-width, initial-scale=1',
  metadataBase: new URL('https://marvin.infinitesynergy.ai'),
  openGraph: {
    title: 'Marvin | The Bipolar Mood Moose',
    description: 'An emotionally intelligent AI companion for authentic bipolar experiences',
    url: 'https://marvin.infinitesynergy.ai',
    siteName: 'Marvin by Infinite Synergy AI',
    images: [
      {
        url: '/og-marvin.png',
        width: 1200,
        height: 630,
        alt: 'Marvin the Bipolar Mood Moose - AI Companion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marvin | The Bipolar Mood Moose',
    description: 'Chat with Marvin - an emotionally intelligent AI companion',
    images: ['/og-marvin.png'],
    creator: '@infinitesynergy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://marvin.infinitesynergy.ai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://marvin.infinitesynergy.ai" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#20B2AA" />
        <meta name="application-name" content="Marvin" />
        <meta name="apple-mobile-web-app-title" content="Marvin" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
