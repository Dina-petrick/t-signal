import React from 'react';

class ErrorBoundary extends React.Component {
  // Use a class field for state to avoid the constructor boilerplate
  state = { hasError: false };

  static getDerivedStateFromError() {
    // This method is called after an error has been thrown
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging purposes
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI when an error occurs
      return <h1>Something went wrong.</h1>;
    }

    // Render the children components as normal
    return this.props.children;
  }
}

export default ErrorBoundary;