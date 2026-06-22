import { useApp, PAGE_TITLES } from '../../context/AppContext';
import { Search, Bell, Settings, Menu } from 'lucide-react';

export function Topbar() {
  const { currentPage, setSidebarOpen } = useApp();
  const meta = PAGE_TITLES[currentPage] || { t: currentPage, b: currentPage };

  return (
    <header className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={18} />
        </button>
        <div>
          <div className="page-title">{meta.t}</div>
          <div className="page-breadcrumb">Bellizia / {meta.b}</div>
        </div>
      </div>
      <div className="topbar-right">
        <div className="search-box"><Search size={16} /> <span>Search anything…</span></div>
        <div className="icon-btn"><Bell size={18} /><span className="dot" /></div>
        <div className="icon-btn"><Settings size={18} /></div>
      </div>
    </header>
  );
}
