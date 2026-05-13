import type { Metadata } from 'next';
import './globals.css';

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
        {/* TODO: Add providers for auth, React Query, etc. */}
        <div className="min-h-screen bg-white">
          {/* TODO: Add navigation/sidebar */}
          {children}
        </div>
      </body>
    </html>
  );
}
