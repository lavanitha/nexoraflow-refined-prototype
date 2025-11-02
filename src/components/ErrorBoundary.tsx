import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<object>, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // intentionally ignore parameters; errors are surfaced via state
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32 }}>
          <h2>Something went wrong rendering this page.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#c53030' }}>
            {this.state.error?.message}
          </pre>
          <p>Please paste the error text into the chat and I'll fix it.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
