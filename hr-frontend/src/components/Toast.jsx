import { useEffect, useState } from 'react';

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 350);
    }, 3500);
    return () => clearTimeout(hide);
  }, [message]);

  if (!message) return null;

  const isError =
    message.toLowerCase().includes('failed') ||
    message.toLowerCase().includes('error') ||
    message.toLowerCase().includes('invalid');

  const accent = isError ? '#f43f5e' : '#10b981';
  const icon   = isError ? '✕' : '✓';

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1.25rem',
        zIndex: 99999,
        width: '18rem',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 2rem))',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.55)',
          borderRadius: '0.875rem',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* thin accent top bar */}
        <div style={{ height: '3px', background: accent }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.75rem 1rem',
          }}
        >
          {/* icon bubble */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '50%',
              background: isError ? '#fff1f2' : '#ecfdf5',
              color: accent,
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {icon}
          </span>

          {/* text */}
          <p
            style={{
              flex: 1,
              margin: 0,
              fontSize: '0.835rem',
              color: '#1e293b',
              lineHeight: 1.45,
              fontWeight: 500,
            }}
          >
            {message}
          </p>

          {/* dismiss button */}
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 350); }}
            aria-label="Dismiss"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '0.8rem',
              lineHeight: 1,
              padding: '0.2rem',
              flexShrink: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#475569')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

