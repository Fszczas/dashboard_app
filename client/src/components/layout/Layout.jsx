import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '../ui/CommandPalette';
import { useCommandPalette } from '../../hooks/useCommandPalette';

const PAGE_TITLES = {
  '/':          'Overview',
  '/analytics': 'Analytics',
  '/events':    'Events',
  '/settings':  'Settings',
};

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { open, close, toggle }   = useCommandPalette();
  const location                  = useLocation();

  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className={`app-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header title={title} onOpenPalette={toggle} />
        <main className="page-wrapper dot-grid">
          {children}
        </main>
      </div>

      <CommandPalette open={open} onClose={close} />
    </div>
  );
}
