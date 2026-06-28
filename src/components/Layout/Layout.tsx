import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      <main className="flex-grow-1 p-3" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
