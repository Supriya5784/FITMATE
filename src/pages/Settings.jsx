import React, { useEffect, useMemo, useState } from "react";

const defaultSettings = {
  profile: {
    fullName: "Your Name",
    username: "username",
  },
  account: {
    email: "you@example.com",
    loginAlerts: true,
  },
  security: {
    twoFA: false,
  },
  notifications: {
    email: true,
    push: true,
    frequency: "realtime", // realtime | daily | weekly
  },
  appearance: {
    theme: "system", // light | dark | system
  },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function Settings() {
  const [settings, setSettings] = useState(() => deepClone(defaultSettings));
  const [saved, setSaved] = useState(() => deepClone(defaultSettings));
  const [toast, setToast] = useState("");
  const [pwd, setPwd] = useState({ open: false, current: "", next: "", confirm: "", show: false });

  const hasUnsaved = useMemo(() => JSON.stringify(settings) !== JSON.stringify(saved), [settings, saved]);

  useEffect(() => {
    const beforeUnload = (e) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [hasUnsaved]);

  const update = (path, value) => {
    setSettings((prev) => {
      const next = deepClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const handleSave = async () => {
    // TODO: Replace with your API call
    await new Promise((r) => setTimeout(r, 400));
    setSaved(deepClone(settings));
    showToast("Settings saved ✅");
  };

  const handleReset = () => {
    setSettings(deepClone(saved));
    showToast("Reverted changes");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Delete your account permanently? This cannot be undone.")) {
      // TODO: Call delete API
      showToast("Deletion requested");
    }
  };

  const handleLogout = () => {
    // TODO: Hook into your auth/logout flow
    showToast("Logging out…");
    setTimeout(() => {
      // window.location.href = "/logout";
    }, 800);
  };

  return (
    <div className="sp" data-theme={settings.appearance.theme}>
      <header className="sp-header">
        <div className="title">
          <h1>Settings</h1>
          {hasUnsaved && <span className="badge">Unsaved</span>}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={handleReset} disabled={!hasUnsaved}>Reset</button>
          <button className="btn primary" onClick={handleSave} disabled={!hasUnsaved}>Save</button>
        </div>
      </header>

      <main className="sp-main">
        {/* Profile */}
        <section className="card">
          <div className="card-head">
            <h2>Profile</h2>
            <p className="muted">Basic public information</p>
          </div>
          <div className="grid">
            <div className="row">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                value={settings.profile.fullName}
                onChange={(e) => update("profile.fullName", e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="row">
              <label htmlFor="username">Username</label>
              <div className="with-prefix">
                <span>@</span>
                <input
                  id="username"
                  value={settings.profile.username}
                  onChange={(e) =>
                    update("profile.username", e.target.value.replace(/\s+/g, ""))
                  }
                  placeholder="username"
                />
              </div>
              <small className="muted">Only letters, numbers and underscores</small>
            </div>
          </div>
        </section>

        {/* Account & Security */}
        <section className="card">
          <div className="card-head">
            <h2>Account & Security</h2>
            <p className="muted">Manage contact and security</p>
          </div>
          <div className="grid">
            <div className="row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={settings.account.email}
                onChange={(e) => update("account.email", e.target.value)}
              />
            </div>

            <div className="row">
              <label>Login alerts</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.account.loginAlerts}
                  onChange={(e) => update("account.loginAlerts", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="row">
              <label>Two‑factor authentication (2FA)</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.security.twoFA}
                  onChange={(e) => update("security.twoFA", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="row full">
              <label>Change password</label>
              {!pwd.open ? (
                <button className="btn" type="button" onClick={() => setPwd((p) => ({ ...p, open: true }))}>
                  Update password
                </button>
              ) : (
                <div className="pwd">
                  <div className="row">
                    <label htmlFor="curPwd">Current password</label>
                    <input
                      id="curPwd"
                      type={pwd.show ? "text" : "password"}
                      value={pwd.current}
                      onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                    />
                  </div>
                  <div className="row">
                    <label htmlFor="newPwd">New password</label>
                    <input
                      id="newPwd"
                      type={pwd.show ? "text" : "password"}
                      value={pwd.next}
                      onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                    />
                  </div>
                  <div className="row">
                    <label htmlFor="confPwd">Confirm new password</label>
                    <input
                      id="confPwd"
                      type={pwd.show ? "text" : "password"}
                      value={pwd.confirm}
                      onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                    />
                  </div>
                  <div className="row">
                    <label className="switch small">
                      <input
                        type="checkbox"
                        checked={pwd.show}
                        onChange={(e) => setPwd((p) => ({ ...p, show: e.target.checked }))}
                      />
                      <span className="slider" />
                    </label>
                    <span className="muted">Show passwords</span>
                  </div>
                  <div className="end">
                    <button className="btn ghost" onClick={() => setPwd({ open: false, current: "", next: "", confirm: "", show: false })}>
                      Cancel
                    </button>
                    <button
                      className="btn primary"
                      onClick={() => {
                        if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
                          showToast("Please check password fields");
                          return;
                        }
                        // TODO: Call change-password API
                        setPwd({ open: false, current: "", next: "", confirm: "", show: false });
                        showToast("Password updated ✅");
                      }}
                    >
                      Save password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card">
          <div className="card-head">
            <h2>Notifications</h2>
            <p className="muted">How you get updates</p>
          </div>
          <div className="grid">
            <div className="row">
              <label>Email notifications</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => update("notifications.email", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="row">
              <label>Push notifications</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => update("notifications.push", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="row">
              <label htmlFor="freq">Frequency</label>
              <select
                id="freq"
                value={settings.notifications.frequency}
                onChange={(e) => update("notifications.frequency", e.target.value)}
              >
                <option value="realtime">Real‑time</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly summary</option>
              </select>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="card">
          <div className="card-head">
            <h2>Appearance</h2>
            <p className="muted">Theme preference</p>
          </div>
          <div className="grid">
            <div className="row">
              <label>Theme</label>
              <div className="seg">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    className={`seg-btn ${settings.appearance.theme === t ? "active" : ""}`}
                    onClick={() => update("appearance.theme", t)}
                    type="button"
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone (last two: Delete + Log out) */}
        <section className="card danger">
          <div className="card-head">
            <h2>Danger zone</h2>
            <p className="muted">Be careful—these actions are permanent</p>
          </div>
          <div className="stack">
            <div className="danger-item">
              <div>
                <div className="label-strong">Delete account</div>
                <div className="muted small">Permanently delete your account and data</div>
              </div>
              <button className="btn danger" onClick={handleDeleteAccount}>Delete account</button>
            </div>
            <div className="danger-item">
              <div>
                <div className="label-strong">Log out</div>
                <div className="muted small">End session on this device</div>
              </div>
              <button className="btn ghost" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </section>
      </main>

      {toast && <div className="toast">{toast}</div>}

      <style>{`
        :root { color-scheme: light dark; }
        .sp {
          --bg: #0b0c0f;
          --card: #11131a;
          --border: #202433;
          --text: #e6e6e6;
          --muted: #9aa0aa;
          --accent: #3b82f6;
          --danger: #ef4444;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          padding: 16px;
        }
        [data-theme="light"] { --bg: #f6f7fb; --card: #ffffff; --border: #e6e8ef; --text: #0b0c0f; --muted: #667085; }
        .sp-header {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 900px; margin: 0 auto 16px; padding: 12px 16px;
          border: 1px solid var(--border); border-radius: 12px; background: var(--card);
        }
        .title { display: flex; align-items: center; gap: 10px; }
        .title h1 { font-size: 18px; margin: 0; }
        .badge { font-size: 12px; padding: 4px 8px; border-radius: 999px; border: 1px solid var(--border); background: rgba(255,255,255,0.06); }
        .actions { display: flex; gap: 8px; }
        .sp-main { max-width: 900px; margin: 0 auto; display: grid; gap: 14px; }
        .card { border: 1px solid var(--border); border-radius: 12px; background: var(--card); padding: 14px; }
        .card-head h2 { margin: 0 0 4px 0; font-size: 16px; }
        .card-head p { margin: 0 0 10px 0; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 16px; }
        .row { display: flex; flex-direction: column; gap: 8px; }
        .row.full { grid-column: 1 / -1; }
        label { font-size: 13px; color: var(--muted); }
        .label-strong { font-weight: 600; }
        input, select {
          width: 100%; border: 1px solid var(--border); border-radius: 10px; background: transparent;
          color: var(--text); padding: 10px 12px; outline: none;
        }
        input:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.25); }
        small, .muted { color: var(--muted); font-size: 12px; }
        .muted.small { font-size: 11px; }
        .with-prefix { display: flex; align-items: center; gap: 8px; }
        .with-prefix > span {
          border: 1px solid var(--border); border-radius: 10px; padding: 0 10px; height: 36px; display: grid; place-items: center;
          background: rgba(255,255,255,0.04);
        }
        .btn { border: 1px solid var(--border); background: rgba(255,255,255,0.06); color: var(--text); border-radius: 10px; padding: 8px 12px; cursor: pointer; }
        .btn:hover { filter: brightness(1.06); }
        .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
        .btn.ghost { background: transparent; }
        .btn.danger { background: rgba(239,68,68,0.15); border-color: var(--danger); color: #ff9b9b; }
        .switch { position: relative; width: 46px; height: 26px; display: inline-block; }
        .switch.small { transform: scale(0.9); transform-origin: left; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; inset: 0; background: #2a2f3a; border: 1px solid var(--border); border-radius: 999px; transition: all .2s; }
        .slider:before { content: ""; position: absolute; width: 20px; height: 20px; left: 3px; top: 50%; transform: translateY(-50%); background: #fff; border-radius: 50%; transition: all .2s; }
        .switch input:checked + .slider { background: var(--accent); border-color: var(--accent); }
        .switch input:checked + .slider:before { transform: translate(18px, -50%); }
        .pwd { display: grid; gap: 10px; border: 1px dashed var(--border); border-radius: 10px; padding: 12px; }
        .end { display: flex; justify-content: flex-end; gap: 8px; }
        .seg { display: inline-flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .seg-btn { padding: 8px 12px; background: transparent; border: none; color: var(--text); cursor: pointer; }
        .seg-btn + .seg-btn { border-left: 1px solid var(--border); }
        .seg-btn.active { background: rgba(59,130,246,0.15); }
        .card.danger { border-color: rgba(239,68,68,0.35); }
        .stack { display: grid; gap: 10px; }
        .danger-item { display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid var(--border); border-radius: 10px; background: rgba(255,255,255,0.03); }
        .toast { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); background: rgba(24,24,24,0.9); color: #fff; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); }
        @media (max-width: 860px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}