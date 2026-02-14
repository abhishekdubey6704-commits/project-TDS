import { Inter, Cinzel, Philosopher } from 'next/font/google';
import '@/styles/globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { NotificationProvider } from '@/components/providers/NotificationProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const philosopher = Philosopher({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-philosopher',
  display: 'swap',
});

export const metadata = {
  title: 'The Dharma Saga - Forgotten Heroes, Eternal Dharma',
  description: 'An epic historical saga exploring the untold stories of ancient Indian warriors and their eternal quest to protect Dharma.',
  keywords: 'dharma, saga, historical fiction, Indian history, Raja Dahir, Bappa Rawal, Lalitaditya',
  authors: [{ name: 'The Dharma Saga Team' }],
  openGraph: {
    title: 'The Dharma Saga',
    description: 'Forgotten Heroes. Eternal Dharma.',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Dharma Saga',
    description: 'Forgotten Heroes. Eternal Dharma.',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${philosopher.variable}`}>
      <body className="font-sans antialiased bg-dharma text-stone-100 min-h-screen">
        <QueryProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
