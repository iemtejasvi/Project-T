// Persistent storage manager for bulletproof cookie and data persistence
class PersistentStorage {
  private readonly prefix = 'iois_'; // If Only I Sent This prefix
  
  /**
   * Set a value with automatic persistence across sessions
   * Uses localStorage with fallback to sessionStorage and cookies
   */
  set(key: string, value: unknown, options?: { expires?: number }): void {
    const fullKey = `${this.prefix}${key}`;
    const data = {
      value,
      timestamp: Date.now(),
      expires: options?.expires ? Date.now() + options.expires : null
    };
    
    try {
      // Primary: localStorage (persists across sessions)
      localStorage.setItem(fullKey, JSON.stringify(data));
    } catch {
      try {
        // Fallback: sessionStorage
        sessionStorage.setItem(fullKey, JSON.stringify(data));
      } catch {
        // Last resort: cookies
        this.setCookie(fullKey, JSON.stringify(data), options?.expires);
      }
    }
  }
  
  /**
   * Get a value from storage, checking all storage types
   */
  get(key: string): unknown {
    const fullKey = `${this.prefix}${key}`;
    
    // Try localStorage first
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check if expired
        if (data.expires && Date.now() > data.expires) {
          localStorage.removeItem(fullKey);
          return null;
        }
        
        return data.value;
      }
    } catch {
      // Ignore errors
    }
    
    // Try sessionStorage
    try {
      const stored = sessionStorage.getItem(fullKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check if expired
        if (data.expires && Date.now() > data.expires) {
          sessionStorage.removeItem(fullKey);
          return null;
        }
        
        return data.value;
      }
    } catch {
      // Ignore errors
    }
    
    // Try cookies
    const cookieValue = this.getCookie(fullKey);
    if (cookieValue) {
      try {
        const data = JSON.parse(cookieValue);
        
        // Check if expired
        if (data.expires && Date.now() > data.expires) {
          this.deleteCookie(fullKey);
          return null;
        }
        
        return data.value;
      } catch {
        return cookieValue; // Return raw value if not JSON
      }
    }
    
    return null;
  }
  
  /**
   * Remove a value from all storage types
   */
  remove(key: string): void {
    const fullKey = `${this.prefix}${key}`;
    
    try {
      localStorage.removeItem(fullKey);
    } catch {
      // Ignore errors
    }
    
    try {
      sessionStorage.removeItem(fullKey);
    } catch {
      // Ignore errors
    }
    
    this.deleteCookie(fullKey);
  }
  
  /**
   * Check if a key exists in any storage
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  /**
   * Clear all storage with our prefix
   */
  clearAll(): void {
    // Clear localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore errors
    }
    
    // Clear sessionStorage
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore errors
    }
    
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const [key] = cookie.split('=');
      const trimmedKey = key.trim();
      if (trimmedKey.startsWith(this.prefix)) {
        this.deleteCookie(trimmedKey);
      }
    });
  }
  
  /**
   * Set announcement dismissal with persistence
   */
  setAnnouncementDismissed(announcementId: string): void {
    this.set(`announcement_dismissed_${announcementId}`, true, {
      expires: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
  
  /**
   * Check if announcement was dismissed
   */
  isAnnouncementDismissed(announcementId: string): boolean {
    return this.has(`announcement_dismissed_${announcementId}`);
  }
  
  /**
   * Set welcome closed status with persistence
   */
  setWelcomeClosed(): void {
    this.set('welcome_closed', true, {
      expires: 365 * 24 * 60 * 60 * 1000 // 1 year
    });
  }
  
  /**
   * Check if welcome was closed
   */
  isWelcomeClosed(): boolean {
    return this.has('welcome_closed');
  }
  
  // Cookie helpers
  private setCookie(name: string, value: string, expiresMs?: number): void {
    let expires = '';
    
    if (expiresMs) {
      const date = new Date();
      date.setTime(date.getTime() + expiresMs);
      expires = `; expires=${date.toUTCString()}`;
    }
    
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
  }
  
  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    
    return null;
  }
  
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  /**
   * Migrate old storage to new persistent storage
   */
  migrate(): void {
    // Migrate localStorage items
    try {
      const oldKeys = [
        'welcome_closed',
        'dismissed_announcement',
      ];
      
      oldKeys.forEach(key => {
        // Check both localStorage and sessionStorage
        const localValue = localStorage.getItem(key);
        const sessionValue = sessionStorage.getItem(key);
        
        if (localValue && !this.has(key)) {
          this.set(key, localValue);
          localStorage.removeItem(key);
        }
        
        if (sessionValue && !this.has(key)) {
          this.set(key, sessionValue);
          sessionStorage.removeItem(key);
        }
      });
      
      // Migrate announcement dismissals
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('dismissed_announcement_')) {
          const announcementId = key.replace('dismissed_announcement_', '');
          this.setAnnouncementDismissed(announcementId);
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore migration errors
    }
  }
}

// Export singleton instance
export const storage = new PersistentStorage();

// Auto-migrate on load
if (typeof window !== 'undefined') {
  storage.migrate();
}
