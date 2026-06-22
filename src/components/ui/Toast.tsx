import { useApp } from '../../context/AppContext';
import { Check, X, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div id="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'ok' ? <Check size={16} /> : t.type === 'err' ? <X size={16} /> : <Info size={16} />}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
