import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SK Relax ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center text-forest-900">
          <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-card border border-forest-900/10 space-y-6">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-rose-600 font-semibold mb-1">
                SK Relax Beauty Academy & Salon
              </p>
              <h1 className="font-serif text-3xl font-normal text-forest-900">
                Something Went Wrong
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
                We encountered an unexpected error while displaying this page. Please try reloading or return to our homepage.
              </p>
            </div>

            {this.state.error && import.meta.env.DEV && (
              <div className="p-3 bg-cream-100 rounded-sm text-left text-xs text-rose-800 font-mono overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                size="sm"
                icon={<RefreshCw size={14} />}
              >
                Reload Page
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                size="sm"
                icon={<Home size={14} />}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
