"use client";

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Global unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Global unhandled promise rejection:', event.reason);
      
      // Log to console but don't crash the app
      try {
        // Optional: Send to monitoring service
        // Example: Sentry.captureException(event.reason);
      } catch {
        // Even error reporting shouldn't crash
      }
      
      // Prevent the default browser behavior (which would log to console)
      event.preventDefault();
    };

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Global unhandled error:', event.error);
      
      try {
        // Optional: Send to monitoring service
        // Example: Sentry.captureException(event.error);
      } catch {
        // Even error reporting shouldn't crash
      }
      
      // Prevent the default browser behavior
      event.preventDefault();
    };

    // Service worker error handler
    const handleServiceWorkerError = () => {
      console.log('Service worker error handled gracefully');
    };

    if (typeof window !== 'undefined') {
      // Add global error handlers
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);
      
      // Handle service worker errors gracefully
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('error', handleServiceWorkerError);
      }

      // Cleanup on unmount
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
        
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('error', handleServiceWorkerError);
        }
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
}
