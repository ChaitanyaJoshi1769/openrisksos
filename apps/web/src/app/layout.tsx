import type { Metadata } from 'next';
import './globals.css';
import { ApiClientProvider } from '@/context/ApiClientProvider';
import { UserProvider } from '@/context/UserContext';
import { QueryProvider } from '@/context/QueryClientProvider';
import { ErrorBoundary } from '@/components';

export const metadata: Metadata = {
  title: 'OpenRiskOS - Enterprise Risk Management',
  description: 'Modern, AI-native GRC platform for enterprise risk and compliance',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <UserProvider>
            <ApiClientProvider>
              <QueryProvider>
                <div className="min-h-screen bg-white">
                  {/* TODO: Add navigation/sidebar */}
                  {children}
                </div>
              </QueryProvider>
            </ApiClientProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
