import { useApp, PAGE_TITLES } from '../../context/AppContext';

export function Topbar() {
  const { currentPage } = useApp();
  const meta = PAGE_TITLES[currentPage] || { t: currentPage, b: currentPage };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="page-title">{meta.t}</div>
        <div className="page-breadcrumb">Bellizia / {meta.b}</div>
      </div>
      <div className="topbar-right">
        <div className="search-box">🔍 <span>Search anything…</span></div>
        <div className="icon-btn">🔔<span className="dot" /></div>
        <div className="icon-btn">⚙️</div>
      </div>
    </header>
  );
}
