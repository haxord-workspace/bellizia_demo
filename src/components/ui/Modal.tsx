import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export function Modal() {
  const { modal, closeModal } = useApp();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && modal.open) closeModal();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal.open, closeModal]);

  return (
    <div
      className={`modal-overlay ${modal.open ? 'open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className={`modal ${modal.wide ? 'wide' : ''}`}>
        {modal.content}
      </div>
    </div>
  );
}
