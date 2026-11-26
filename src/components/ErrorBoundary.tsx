import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('Errore catturato da ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return (
        <div className="min-h-screen w-full bg-neutral-100 text-black flex items-center justify-center p-4">
          <div className="w-full max-w-[414px] border-2 border-black bg-white p-4 shadow-[6px_6px_0_0_#000000] space-y-3">
            <div className="border-b-2 border-black pb-2">
              <p className="text-[11px] font-mono-wf uppercase font-bold text-neutral-600">
                Errore di rendering
              </p>
              <h1 className="text-base font-bold text-black mt-0.5">
                Impossibile mostrare la schermata
              </h1>
            </div>

            <div className="border border-black bg-neutral-50 p-2.5 space-y-1">
              <p className="text-xs font-bold text-black">Motivo:</p>
              <p className="text-xs font-mono-wf text-black break-words">
                {error?.message || 'Errore JavaScript sconosciuto'}
              </p>
            </div>

            {(error?.stack || errorInfo?.componentStack) && (
              <details open className="border border-black bg-neutral-50 p-2.5">
                <summary className="text-[11px] font-bold uppercase cursor-pointer">
                  Dettagli tecnici (stack)
                </summary>
                <pre className="mt-2 text-[10px] font-mono-wf text-neutral-800 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                  {error?.stack}
                  {errorInfo?.componentStack
                    ? `\n\nComponent Stack:${errorInfo.componentStack}`
                    : ''}
                </pre>
              </details>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 min-h-[40px] px-3 border-2 border-black bg-black text-white text-xs font-bold cursor-pointer hover:bg-neutral-800"
              >
                Riprova
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 min-h-[40px] px-3 border-2 border-black bg-white text-black text-xs font-bold cursor-pointer hover:bg-neutral-100"
              >
                Ricarica pagina
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
