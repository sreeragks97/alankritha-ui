"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="card-luxury rounded-2xl p-6 text-center sm:p-8">
            <p className="font-heading text-2xl">Something went wrong</p>
            <p className="mt-2 text-sm text-[var(--brand-muted)]">Please refresh the page and try again.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
