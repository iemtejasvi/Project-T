// Seamless update orchestrator for the sexiest user experience
import { forceRefreshAllCaches } from './enhancedCache';

class SeamlessUpdateOrchestrator {
  private pendingUpdates: Set<string> = new Set();
  private updateBatchTimeout: NodeJS.Timeout | null = null;
  private lastUserInteraction: number = Date.now();
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.trackUserActivity();
    }
  }
  
  private trackUserActivity(): void {
    // Track user interactions to avoid updates during active use
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, () => {
        this.lastUserInteraction = Date.now();
      }, { passive: true });
    });
  }
  
  scheduleUpdate(updateType: string): void {
    this.pendingUpdates.add(updateType);
    
    // Clear existing timeout
    if (this.updateBatchTimeout) {
      clearTimeout(this.updateBatchTimeout);
    }
    
    // Wait for user inactivity before applying updates
    this.updateBatchTimeout = setTimeout(() => {
      this.applyUpdatesSeamlessly();
    }, 1000); // Wait 1 second of inactivity
  }
  
  private applyUpdatesSeamlessly(): void {
    const timeSinceInteraction = Date.now() - this.lastUserInteraction;
    
    // If user just interacted, wait a bit more
    if (timeSinceInteraction < 500) {
      setTimeout(() => this.applyUpdatesSeamlessly(), 500);
      return;
    }
    
    // Apply all pending updates silently
    this.pendingUpdates.forEach(updateType => {
      this.silentUpdate(updateType);
    });
    
    this.pendingUpdates.clear();
  }
  
  private silentUpdate(updateType: string): void {
    // Use requestIdleCallback for non-critical updates
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.performUpdate(updateType);
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.performUpdate(updateType);
      }, 100);
    }
  }
  
  private performUpdate(updateType: string): void {
    // Perform the actual update based on type
    switch (updateType) {
      case 'cache-refresh':
        forceRefreshAllCaches();
        break;
      case 'memory-update':
        window.dispatchEvent(new CustomEvent('seamless-memory-update'));
        break;
      case 'ui-refresh':
        window.dispatchEvent(new CustomEvent('seamless-ui-refresh'));
        break;
      default:
        window.dispatchEvent(new CustomEvent('seamless-update', { detail: updateType }));
    }
  }
  
  // Preload images and assets for instant rendering
  preloadAssets(urls: string[]): void {
    urls.forEach(url => {
      if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        const img = new Image();
        img.src = url;
      } else {
        // Preload other resources using link prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }
  
  // Smooth scroll with momentum
  smoothScrollTo(target: number, duration: number = 500): void {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();
    
    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    
    function animate(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, start + distance * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  // Debounced resize handler for smooth responsive updates
  setupResponsiveUpdates(callback: () => void): void {
    let resizeTimeout: NodeJS.Timeout;
    
    window.addEventListener('resize', () => {
      // Add transitioning class to prevent layout jumps
      document.body.classList.add('resizing');
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        callback();
        document.body.classList.remove('resizing');
      }, 150);
    });
  }
}

// Export singleton instance
export const seamlessUpdater = new SeamlessUpdateOrchestrator();

// Add global CSS for smooth transitions
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    body.resizing * {
      transition: none !important;
    }
    
    /* Smooth transitions for all interactive elements */
    button, a, input, textarea, select {
      transition: all 150ms ease-out;
    }
    
    /* Prevent layout shifts during updates */
    [data-updating="true"] {
      min-height: inherit;
      contain: layout;
    }
    
    /* Smooth image loading */
    img {
      opacity: 0;
      transition: opacity 300ms ease-in;
    }
    
    img.loaded {
      opacity: 1;
    }
    
    /* Skeleton loading for better perceived performance */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    /* Prevent focus outline flash */
    *:focus {
      outline-offset: 2px;
      transition: outline-offset 150ms ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Auto-add loaded class to images
  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });
  });
}
