// Reusable component: fetches /staff-of-month.json and injects a floating card.
// Place this file at the repo root and include with <script src="/staff-of-month.js" defer></script>

(async function () {
  const JSON_PATH = '/staff-of-month.json'; // change to '/data/staff-of-month.json' if you store it in data/

  function createStyles() {
    const css = `
/* staff-of-month shared styles (kept in JS so pages don't need extra CSS changes) */
.staff-of-month-card {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  background: linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,255,255,0.02));
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4), 0 0 18px rgba(255,215,0,0.15);
  border: 1px solid rgba(255,215,0,0.25);
  color: var(--text, #fff);
  z-index: 9999;
  backdrop-filter: blur(6px);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: calc(100% - 48px);
  box-sizing: border-box;
}

.staff-of-month-card:hover {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 28px rgba(255,215,0,0.25);
}

.staff-of-month-card .title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  margin: 0 0 6px 0;
  text-shadow: 0 0 10px rgba(255,215,0,0.18);
}

.staff-of-month-card .avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border: 2px solid rgba(255,215,0,0.16);
  box-shadow: 0 4px 14px rgba(255,215,0,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,215,0,0.02));
  font-weight: 700;
  color: rgba(255,215,0,0.95);
}

.staff-of-month-card .name {
  font-size: 1rem;
  font-weight: 600;
  margin: 6px 0 2px 0;
  color: var(--accent, #ffd700);
}

.staff-of-month-card .reason {
  font-size: 0.85rem;
  color: var(--muted, rgba(255,255,255,0.7));
  margin: 6px 0 0 0;
}

.staff-of-month-card .glow-ring {
  position: absolute;
  inset: -6px -6px auto -6px;
  border-radius: 14px;
  pointer-events: none;
  z-index: -1;
  filter: blur(8px);
  opacity: 0.9;
  background: radial-gradient(circle at 20% 10%, rgba(255,215,0,0.18), transparent 20%), radial-gradient(circle at 80% 90%, rgba(255,120,80,0.06), transparent 25%);
  animation: glowPulse 3s ease-in-out infinite;
}

/* Soft pulsing glow */
@keyframes glowPulse {
  0% { box-shadow: 0 0 8px rgba(255,215,0,0.08); }
  50% { box-shadow: 0 0 18px rgba(255,215,0,0.16); }
  100% { box-shadow: 0 0 8px rgba(255,215,0,0.08); }
}

/* Mobile layout */
@media (max-width: 780px) {
  .staff-of-month-card {
    right: 12px;
    top: auto;
    bottom: 18px;
    transform: none;
    width: calc(100% - 36px);
    max-width: 420px;
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    padding: 12px;
  }
  .staff-of-month-card .avatar { width: 56px; height: 56px; }
  .staff-of-month-card .title { font-size: 0.95rem; }
}
    `;
    const s = document.createElement('style');
    s.setAttribute('data-generated-by', 'staff-of-month.js');
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  function buildAvatar(avatarSpec) {
    if (!avatarSpec) return '';
    if (avatarSpec.type === 'image' && avatarSpec.value) {
      return `<img src="${avatarSpec.value}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;">`;
    }
    // fallback to initials/text
    const text = avatarSpec.value || avatarSpec.initials || '?';
    return `<div aria-hidden="true" class="avatar">${escapeHtml(text)}</div>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCard(target, data) {
    // data: { name, role, reason, avatar, ariaLabel }
    const ariaLabel = data.ariaLabel || 'Staff of the Month';
    const avatarHtml = (data.avatar && data.avatar.type === 'image')
      ? `<div class="avatar" aria-hidden="true"><img src="${data.avatar.value}" alt="${escapeHtml(data.name)} avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`
      : `<div class="avatar" aria-hidden="true">${escapeHtml((data.avatar && data.avatar.value) || (data.name && data.name[0]) || 'S')}</div>`;

    const html = `
      <div class="staff-of-month-card" role="complementary" aria-label="${escapeHtml(ariaLabel)}">
        <div class="glow-ring" aria-hidden="true"></div>
        ${avatarHtml}
        <div class="title">Staff of the Month</div>
        <div class="name">${escapeHtml(data.name)} ${data.role ? data.role : ''}</div>
        <div class="reason">${escapeHtml(data.reason || '')}</div>
      </div>
    `;
    target.innerHTML = html;
  }

  function showFallback(target) {
    // Minimal fallback if fetch fails
    const fallback = {
      name: 'Staff Spotlight',
      role: '',
      reason: 'Check back soon for the staff of the month!'
    };
    renderCard(target, fallback);
  }

  createStyles();

  // Find insertion point: prefer #staff-of-month-root, otherwise append to body
  const root = document.getElementById('staff-of-month-root') || (function () {
    const r = document.createElement('div');
    document.body.appendChild(r);
    return r;
  })();

  try {
    const resp = await fetch(JSON_PATH + '?_=' + encodeURIComponent(new Date().toISOString()));
    if (!resp.ok) {
      console.warn('staff-of-month: failed to fetch JSON, status', resp.status);
      showFallback(root);
      return;
    }
    const data = await resp.json();
    renderCard(root, data);
  } catch (err) {
    console.warn('staff-of-month: error fetching/parsing JSON', err);
    showFallback(root);
  }
})();
