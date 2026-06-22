import { useState, useEffect, useRef } from 'react';
import { useApp, ROLES, NAV } from '../../context/AppContext';
import type { AppRole, PageId } from '../../data/types';
import { ChevronDown } from 'lucide-react';

export function Sidebar() {
  const { db, setDB, currentPage, navigate, toast, sidebarOpen, setSidebarOpen } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const role = db.currentRole;
  const r = ROLES[role];
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function switchRole(newRole: AppRole) {
    setDB(prev => ({ ...prev, currentRole: newRole }));
    navigate('dashboard');
    toast(`Switched to ${ROLES[newRole].title} view`, 'info');
    setDropdownOpen(false);
  }

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-mark">B</div>
        <div className="brand-text">
          <div className="brand-name">Bellizia</div>
          <div className="brand-sub">Caters &amp; Events ERP</div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="role-switcher" ref={dropRef}>
        <button className="role-switcher-btn" onClick={(e) => { e.stopPropagation(); setDropdownOpen(o => !o); }}>
          <div className="rs-label">
            <div className="rs-eyebrow">Viewing as</div>
            <div className="rs-current">{r.icon} {r.title}</div>
          </div>
          <ChevronDown size={14} />
        </button>
        <div className={`role-dropdown ${dropdownOpen ? 'open' : ''}`}>
          {(Object.keys(ROLES) as AppRole[]).map(k => (
            <div key={k} className={`role-option ${k === role ? 'active' : ''}`} onClick={() => switchRole(k)}>
              <div className="role-opt-icon">{ROLES[k].icon}</div>
              <div>
                <div className="role-opt-name">{ROLES[k].title}</div>
                <div className="role-opt-desc">{ROLES[k].name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="nav-scroll">
        {NAV[role].map(group => (
          <div key={group.group} className="nav-group">
            <div className="nav-group-title">{group.group}</div>
            {group.items.map(item => (
              <div
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => { navigate(item.id as PageId); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar">{r.initials}</div>
        <div className="user-meta">
          <div className="user-name">{r.name}</div>
          <div className="user-role">{r.desc}</div>
        </div>
      </div>
      </aside>
    </>
  );
}
