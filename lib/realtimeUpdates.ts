// Real-time update system for immediate content refresh
import { forceRefreshAllCaches } from './enhancedCache';

class RealtimeUpdateManager {
  private updateCheckInterval: NodeJS.Timeout | null = null;
  private lastCheckTime: number = Date.now();
  private isTabActive: boolean = true;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners();
      this.startUpdateCheck();
    }
  }
  
  private setupListeners(): void {
    // Track tab visibility
    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
      
      if (this.isTabActive) {
        // Tab became active, check for updates immediately
        this.checkForUpdates();
      }
    });
    
    // Listen for focus events
    window.addEventListener('focus', () => {
      this.checkForUpdates();
    });
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      // Silent online check
      this.checkForUpdates();
    });
  }
  
  private startUpdateCheck(): void {
    // Check for updates every 15 seconds when tab is active
    this.updateCheckInterval = setInterval(() => {
      if (this.isTabActive) {
        this.checkForUpdates();
      }
    }, 15000);
  }
  
  private async checkForUpdates(): Promise<void> {
    try {
      const now = Date.now();
      
      // Don't check too frequently
      if (now - this.lastCheckTime < 5000) {
        return;
      }
      
      this.lastCheckTime = now;
      
      // Check if there are new updates by looking at localStorage timestamp
      const lastUpdateKey = 'last_content_update';
      const storedLastUpdate = localStorage.getItem(lastUpdateKey);
      const currentLastUpdate = now.toString();
      
      if (storedLastUpdate && parseInt(storedLastUpdate) > this.lastCheckTime - 20000) {
        // New content detected (within last 20 seconds)
        // Silent refresh
        this.triggerContentRefresh();
      }
    } catch (err) {
      // Silent error
    }
  }
  
  private triggerContentRefresh(): void {
    // Force refresh all caches
    forceRefreshAllCaches();
    
    // Dispatch custom events
    window.dispatchEvent(new CustomEvent('content-updated'));
    
    // If on home page, trigger memory refresh
    if (window.location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('refresh-home-memories'));
    }
    
    // If on archives page, trigger archives refresh
    if (window.location.pathname === '/memories') {
      window.dispatchEvent(new CustomEvent('refresh-archives'));
    }
  }
  
  // Call this when new content is added
  notifyContentAdded(type: 'memory' | 'feature' | 'announcement'): void {
    // Silent notification
    
    // Update timestamp
    localStorage.setItem('last_content_update', Date.now().toString());
    localStorage.setItem(`last_${type}_update`, Date.now().toString());
    
    // Trigger immediate refresh
    this.triggerContentRefresh();
    
    // Dispatch specific event
    window.dispatchEvent(new CustomEvent(`${type}-added`));
  }
  
  // Call this when content is updated
  notifyContentUpdated(type: 'memory' | 'feature' | 'announcement'): void {
    // Silent update
    
    // Update timestamp
    localStorage.setItem('last_content_update', Date.now().toString());
    localStorage.setItem(`last_${type}_update`, Date.now().toString());
    
    // Trigger immediate refresh
    this.triggerContentRefresh();
    
    // Dispatch specific event
    window.dispatchEvent(new CustomEvent(`${type}-updated`));
  }
  
  // Clean up
  destroy(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
  }
}

// Create singleton instance
let managerInstance: RealtimeUpdateManager | null = null;

export function getRealtimeUpdateManager(): RealtimeUpdateManager {
  if (!managerInstance) {
    managerInstance = new RealtimeUpdateManager();
  }
  return managerInstance;
}

// Export convenience functions
export function notifyNewMemory(): void {
  const manager = getRealtimeUpdateManager();
  manager.notifyContentAdded('memory');
}

export function notifyMemoryUpdate(): void {
  const manager = getRealtimeUpdateManager();
  manager.notifyContentUpdated('memory');
}

export function notifyFeatureChange(): void {
  const manager = getRealtimeUpdateManager();
  manager.notifyContentAdded('feature');
}

export function notifyAnnouncementChange(): void {
  const manager = getRealtimeUpdateManager();
  manager.notifyContentAdded('announcement');
}

// Auto-initialize
if (typeof window !== 'undefined') {
  getRealtimeUpdateManager();
}
