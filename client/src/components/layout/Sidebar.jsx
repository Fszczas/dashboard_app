import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../store/store';
import styles from './Sidebar.module.css';

function IconHome() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconBarChart() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function IconActivity() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function IconSettings() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function IconChevronLeft() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconChevronRight() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: IconHome, hint: 'G O' },
  { path: '/analytics', label: 'Analytics', icon: IconBarChart, hint: 'G A' },
  { path: '/events', label: 'Events', icon: IconActivity, hint: 'G E' },
  { path: '/settings', label: 'Settings', icon: IconSettings, hint: 'G S' },
];

export function Sidebar({ collapsed, onToggle }) {
  const { connected } = useStore();
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          {!collapsed && <span className={styles.logoText}>Pulse</span>}
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ path, label, icon: Icon, hint }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navActive : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <span className={styles.navIcon}><Icon /></span>
            {!collapsed && (
              <>
                <span className={styles.navLabel}>{label}</span>
                <kbd className={styles.navHint}>{hint}</kbd>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.connectionStatus} title={connected ? 'Connected' : 'Disconnected'}>
          <span className={`live-dot ${connected ? '' : 'offline'}`} />
          {!collapsed && (
            <span className={styles.connLabel}>
              {connected ? 'Live' : 'Offline'}
            </span>
          )}
        </div>
        <button
          className={styles.collapseBtn}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>
      </div>
    </aside>
  );
}
