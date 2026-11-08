import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="container-shell py-28">
          <h1 className="section-title">Something went wrong.</h1>
          <p className="mt-4 text-ink-500">Please return home and try again.</p>
        </main>
      );
    return this.props.children;
  }
}
