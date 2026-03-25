import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export function SuggestTopic() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      setTopic('');
      setStatus('idle');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setStatus('loading');
    const { error } = await supabase.from('topic_suggestions').insert({ topic: topic.trim() });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setTopic('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Suggest a conversation topic"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '24px',
          zIndex: 90,
          background: 'linear-gradient(135deg, #C4856A, #A88EC4)',
          color: '#fff',
          border: 'none',
          borderRadius: '100px',
          padding: '10px 20px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.06em',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        suggest a topic
      </button>

      {/* Modal */}
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Suggest a topic"
          onClick={handleBackdropClick}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,6,2,0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            animation: 'toastIn 0.25s ease forwards',
            left: '50%',
width: '100%',
transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'min(360px, 90vw)',
              background: 'rgba(14,11,20,0.15)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
              padding: '28px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '22px',
                  color: 'rgba(240,232,220,0.95)',
                  marginBottom: '6px',
                }}
              >
                suggest a topic
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'rgba(200,170,130,0.55)',
                  letterSpacing: '0.04em',
                }}
              >
                What would you ask a grandparent?
              </p>
            </div>

            {status === 'success' ? (
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '14px',
                  color: 'rgba(196,133,106,0.9)',
                  letterSpacing: '0.04em',
                  padding: '12px 0',
                }}
              >
                thank you — your topic has been shared ✦
              </p>
            ) : (
              <>
                <textarea
                  ref={textareaRef}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. What song always takes you back?"
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '14px',
                    fontWeight: 300,
                    color: 'rgba(240,232,220,0.9)',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.55,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,133,106,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />

                {status === 'error' && (
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '12px',
                      color: 'rgba(196,133,106,0.8)',
                      marginTop: '-8px',
                    }}
                  >
                    something went wrong — please try again
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      color: 'rgba(200,170,130,0.45)',
                      cursor: 'pointer',
                      padding: '4px 0',
                      letterSpacing: '0.04em',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(200,170,130,0.75)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,170,130,0.45)')}
                  >
                    cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!topic.trim() || status === 'loading'}
                    style={{
                      background: topic.trim()
                        ? 'linear-gradient(135deg, #C4856A, #A88EC4)'
                        : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '100px',
                      padding: '9px 22px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 400,
                      color: topic.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                      cursor: topic.trim() ? 'pointer' : 'default',
                      letterSpacing: '0.06em',
                      transition: 'background 0.2s ease, color 0.2s ease',
                    }}
                  >
                    {status === 'loading' ? 'sending…' : 'submit →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
