import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from './store/store';
import { useSocket } from './hooks/useSocket';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { Analytics } from './pages/Analytics';
import { Events } from './pages/Events';
import { Settings } from './pages/Settings';

export function App() {
  const { theme } = useStore();
  useSocket();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
