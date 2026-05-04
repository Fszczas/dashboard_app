import { useStore } from '../store/store';
import styles from './Settings.module.css';

function Section({ title, description, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        {description && <span className={styles.settingDesc}>{description}</span>}
      </div>
      <div className={styles.settingControl}>{children}</div>
    </div>
  );
}

function SourceCard({ name, description, status, icon }) {
  return (
    <div className={styles.sourceCard}>
      <div className={styles.sourceIcon}>{icon}</div>
      <div className={styles.sourceInfo}>
        <span className={styles.sourceName}>{name}</span>
        <span className={styles.sourceDesc}>{description}</span>
      </div>
      <button className={`btn ${status === 'connected' ? styles.btnConnected : 'btn-ghost'}`}>
        {status === 'connected' ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
}

export function Settings() {
  const { theme, toggleTheme } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-description">Configure your dashboard preferences and data sources</p>
      </div>

      {/* Appearance */}
      <Section title="Appearance" description="Customize how the dashboard looks.">
        <SettingRow label="Theme" description="Choose between light and dark mode.">
          <div className={styles.themeToggleRow}>
            <button
              className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              Light
            </button>
            <button
              className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              Dark
            </button>
          </div>
        </SettingRow>
      </Section>

      {/* Data */}
      <Section title="Data" description="Control how metrics are fetched and stored.">
        <SettingRow label="Update interval" description="How often real-time metrics refresh.">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>2 000 ms</span>
        </SettingRow>
        <SettingRow label="History retention" description="Number of data points kept in memory.">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>120 samples</span>
        </SettingRow>
      </Section>

      {/* Integrations */}
      <Section title="Integrations" description="Connect your own data sources.">
        <div className={styles.sources}>
          <SourceCard name="Prometheus" description="Pull metrics via /metrics endpoint" status="idle" icon="◈" />
          <SourceCard name="Datadog" description="Forward events and metrics via API" status="idle" icon="◈" />
          <SourceCard name="Webhook" description="Push data via HTTP POST to /api/ingest" status="connected" icon="◈" />
          <SourceCard name="OpenTelemetry" description="OTLP receiver for traces and metrics" status="idle" icon="◈" />
        </div>
      </Section>

      {/* About */}
      <Section title="About">
        <SettingRow label="Version">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>1.0.0</span>
        </SettingRow>
        <SettingRow label="License">
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>MIT</span>
        </SettingRow>
        <SettingRow label="Keyboard shortcuts">
          <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
            <kbd>Ctrl</kbd><kbd>K</kbd>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginLeft: 'var(--sp-1)' }}>command palette</span>
          </div>
        </SettingRow>
      </Section>
    </div>
  );
}
