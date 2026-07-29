import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: '🚀 Prompt Generator - Excel Automation',
  description: 'Generate clean Excel files ready for Grok upload',
  keywords: 'Excel, Generator, Grok, AI, Prompts',
  authors: [{ name: 'Your Name' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}