import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

function renderFatalOverlay(title: string, message: string, stack?: string) {
  const rootEl = document.getElementById('root') || document.body;
  if (!rootEl) return;

  const wrapper = document.createElement('div');
  wrapper.style.cssText =
    'min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;padding:16px;background:#f5f5f5;color:#000;font-family:monospace;box-sizing:border-box;';

  const card = document.createElement('div');
  card.style.cssText =
    'max-width:414px;width:100%;background:#fff;border:2px solid #000;padding:16px;box-shadow:6px 6px 0 0 #000;';

  const heading = document.createElement('h1');
  heading.textContent = title;
  heading.style.cssText = 'font-size:15px;font-weight:700;margin:0 0 8px 0;';

  const msg = document.createElement('p');
  msg.textContent = message;
  msg.style.cssText =
    'font-size:12px;margin:0 0 10px 0;padding:8px;border:1px solid #000;background:#fafafa;word-break:break-word;';

  card.appendChild(heading);
  card.appendChild(msg);

  if (stack) {
    const pre = document.createElement('pre');
    pre.textContent = stack;
    pre.style.cssText =
      'font-size:10px;white-space:pre-wrap;word-break:break-word;max-height:180px;overflow:auto;padding:8px;border:1px solid #000;background:#f5f5f5;margin:0 0 10px 0;';
    card.appendChild(pre);
  }

  const reloadBtn = document.createElement('button');
  reloadBtn.type = 'button';
  reloadBtn.textContent = 'Ricarica pagina';
  reloadBtn.style.cssText =
    'width:100%;min-height:40px;border:2px solid #000;background:#000;color:#fff;font-size:12px;font-weight:700;cursor:pointer;';
  reloadBtn.onclick = () => window.location.reload();
  card.appendChild(reloadBtn);

  wrapper.appendChild(card);
  rootEl.innerHTML = '';
  rootEl.appendChild(wrapper);
}

window.addEventListener('error', (event) => {
  if (
    event.message &&
    event.message.toLowerCase().includes('resizeobserver loop')
  ) {
    return;
  }
  const err = event.error as Error | undefined;
  renderFatalOverlay(
    'Errore JavaScript globale',
    err?.message || event.message || 'Errore imprevisto durante l’esecuzione.',
    err?.stack
  );
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as Error | string | undefined;
  const message =
    typeof reason === 'string'
      ? reason
      : reason?.message || 'Promise rifiutata senza gestore.';
  const stack = typeof reason === 'object' ? reason?.stack : undefined;
  renderFatalOverlay('Errore asincrono non gestito', message, stack);
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Elemento #root non trovato nel DOM.');
  }
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  const err = error as Error;
  renderFatalOverlay(
    'Errore durante l’avvio dell’app',
    err?.message || 'Impossibile inizializzare React.',
    err?.stack
  );
}
