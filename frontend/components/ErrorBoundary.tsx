'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para monitoramento (ex: Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-[#ff3366] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-2xl font-extrabold text-black mb-2">
              Algo deu errado
            </h1>

            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a página inicial.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 border-2 border-black p-4 mb-6 text-left">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Detalhes do erro (dev only)
                </p>
                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-3 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold border-2 border-black transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
                Tentar Novamente
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-black font-bold border-2 border-black transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" strokeWidth={2.5} />
                Página Inicial
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
