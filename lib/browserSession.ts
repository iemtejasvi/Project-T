// Browser session management - persists until browser restart only
class BrowserSessionManager {
  private readonly sessionKey = 'browser_session_id';
  private readonly sessionStartKey = 'browser_session_start';
  private sessionId: string | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
    }
  }
  
  private initializeSession(): void {
    // Try to get existing session from sessionStorage (persists until browser closes)
    const existingSession = sessionStorage.getItem(this.sessionKey);
    const sessionStart = sessionStorage.getItem(this.sessionStartKey);
    
    if (existingSession && sessionStart) {
      // Session exists, browser hasn't been restarted
      this.sessionId = existingSession;
      console.debug('🔄 Continuing browser session:', this.sessionId);
    } else {
      // New browser session (browser was restarted)
      this.sessionId = this.generateSessionId();
      const now = Date.now().toString();
      
      // Store in sessionStorage (survives tab closes, dies on browser restart)
      sessionStorage.setItem(this.sessionKey, this.sessionId);
      sessionStorage.setItem(this.sessionStartKey, now);
      
      // Clear any cookies/storage that should reset on browser restart
      this.clearBrowserRestartData();
      
      console.debug('🆕 New browser session started:', this.sessionId);
    }
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private clearBrowserRestartData(): void {
    console.debug('🧹 Clearing browser restart data...');
    
    // Clear cookies that should reset on browser restart
    const cookiesToClear = [
      'temp_session',
      'browser_only',
      // Add any cookies that should clear on browser restart
    ];
    
    cookiesToClear.forEach(cookieName => {
      this.deleteCookie(cookieName);
    });
    
    // Clear specific localStorage items that should reset
    const localStorageKeysToClear = [
      'temp_data',
      'session_only',
      'iois_welcome_closed', // Clear welcome dismissal on browser restart
      // Add any localStorage keys that should clear on browser restart
    ];
    
    localStorageKeysToClear.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear from cookies as fallback
    this.deleteCookie('iois_welcome_closed');
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('browser-session-started'));
  }
  
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  /**
   * Check if this is a new browser session
   */
  isNewBrowserSession(): boolean {
    const sessionStart = sessionStorage.getItem(this.sessionStartKey);
    if (!sessionStart) return true;
    
    // Check if session is very recent (within 5 seconds)
    const startTime = parseInt(sessionStart);
    return (Date.now() - startTime) < 5000;
  }
  
  /**
   * Get current browser session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }
  
  /**
   * Store data that persists until browser restart
   */
  setSessionData(key: string, value: unknown): void {
    const fullKey = `session_${key}`;
    sessionStorage.setItem(fullKey, JSON.stringify({
      value,
      sessionId: this.sessionId,
      timestamp: Date.now()
    }));
  }
  
  /**
   * Get data that persists until browser restart
   */
  getSessionData(key: string): unknown {
    const fullKey = `session_${key}`;
    const stored = sessionStorage.getItem(fullKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Verify it's from the current session
        if (data.sessionId === this.sessionId) {
          return data.value;
        }
      } catch (e) {
        console.debug('Session data parse error:', e);
      }
    }
    
    return null;
  }
  
  /**
   * Check if data exists in current session
   */
  hasSessionData(key: string): boolean {
    return this.getSessionData(key) !== null;
  }
  
  /**
   * Set welcome dismissed for this browser session only
   */
  setWelcomeDismissed(): void {
    this.setSessionData('welcome_dismissed', true);
  }
  
  /**
   * Check if welcome was dismissed in this browser session
   */
  isWelcomeDismissed(): boolean {
    return this.hasSessionData('welcome_dismissed');
  }
}

// Export singleton instance
export const browserSession = new BrowserSessionManager();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  // Ensure session is initialized immediately
  void browserSession;
}
