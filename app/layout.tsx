import type { Metadata } from 'next';
import { EditSessionProvider } from '@/components/edit/EditSessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Design Handoff · Suite',
  description: 'Documentación de diseño para el equipo entrante',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Satoshi desde Fontshare (gratis) */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>
      <body style={{ fontFamily: 'Satoshi, -apple-system, sans-serif', margin: 0, background: '#F5F5F7' }}>
        <EditSessionProvider>{children}</EditSessionProvider>
      </body>
    </html>
  );
}
