import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'sonner';
import './global.css';

class ErrorBoundary extends React.Component<any, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
          <h2>React Crash</h2>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div vaul-drawer-wrapper="">
      <ErrorBoundary>
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#001540', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <App />
      </ErrorBoundary>
    </div>
  </React.StrictMode>
);
