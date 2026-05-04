import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import styles from './CommandPalette.module.css';

const COMMANDS = [
  // Navigation
  { id: 'nav-overview', group: 'Navigate', label: 'Go to Overview', shortcut: ['G', 'O'], action: 'nav', path: '/' },
  { id: 'nav-analytics', group: 'Navigate', label: 'Go to Analytics', shortcut: ['G', 'A'], action: 'nav', path: '/analytics' },
  { id: 'nav-events', group: 'Navigate', label: 'Go to Events', shortcut: ['G', 'E'], action: 'nav', path: '/events' },
  { id: 'nav-settings', group: 'Navigate', label: 'Go to Settings', shortcut: ['G', 'S'], action: 'nav', path: '/settings' },
  // Actions
  { id: 'toggle-theme', group: 'Actions', label: 'Toggle theme', shortcut: ['T'], action: 'theme' },
  { id: 'reload', group: 'Actions', label: 'Reload page', shortcut: [], action: 'reload' },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.mark}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { toggleTheme } = useStore();

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback((cmd) => {
    onClose();
    setQuery('');
    setActive(0);

    if (cmd.action === 'nav') navigate(cmd.path);
    if (cmd.action === 'theme') toggleTheme();
    if (cmd.action === 'reload') window.location.reload();
  }, [navigate, toggleTheme, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((v) => Math.min(v + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((v) => Math.max(v - 1, 0));
      }
      if (e.key === 'Enter' && filtered[active]) {
        e.preventDefault();
        execute(filtered[active]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, active, filtered, execute]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const groups = [...new Set(filtered.map((c) => c.group))];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`${styles.panel} cmd-in`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>

        <div className={styles.list} ref={listRef}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No results for &ldquo;{query}&rdquo;</div>
          )}

          {groups.map((group) => (
            <div key={group} className={styles.group}>
              <div className={styles.groupLabel}>{group}</div>
              {filtered
                .filter((c) => c.group === group)
                .map((cmd) => {
                  const globalIdx = filtered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      data-idx={globalIdx}
                      className={`${styles.item} ${globalIdx === active ? styles.itemActive : ''}`}
                      onMouseEnter={() => setActive(globalIdx)}
                      onClick={() => execute(cmd)}
                    >
                      <span className={styles.itemLabel}>
                        {highlight(cmd.label, query)}
                      </span>
                      {cmd.shortcut.length > 0 && (
                        <span className={styles.shortcuts}>
                          {cmd.shortcut.map((k, i) => (
                            <kbd key={i}>{k}</kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
