import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div id="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'ok' ? '✓' : t.type === 'err' ? '✕' : 'ℹ'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
