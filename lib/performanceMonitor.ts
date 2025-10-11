// Performance monitoring utility for tracking load times
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private activeTimers: Map<string, number> = new Map();
  
  // Start timing an operation
  startTimer(operation: string): void {
    this.activeTimers.set(operation, performance.now());
  }
  
  // End timing and record the metric
  endTimer(operation: string): number {
    const startTime = this.activeTimers.get(operation);
    if (!startTime) {
      console.warn(`No active timer for operation: ${operation}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.activeTimers.delete(operation);
    
    // Store the metric
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);
    
    // Keep only last 100 measurements per operation
    const measurements = this.metrics.get(operation)!;
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    // Log if operation took more than 100ms (not instant)
    if (duration > 100) {
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    } else if (duration < 50) {
      console.debug(`✅ Fast operation: ${operation} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  // Get average time for an operation
  getAverageTime(operation: string): number {
    const measurements = this.metrics.get(operation);
    if (!measurements || measurements.length === 0) {
      return 0;
    }
    
    const sum = measurements.reduce((a, b) => a + b, 0);
    return sum / measurements.length;
  }
  
  // Get performance report
  getReport(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const report: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.metrics.forEach((measurements, operation) => {
      if (measurements.length === 0) return;
      
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);
      
      report[operation] = {
        avg: parseFloat(avg.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        count: measurements.length
      };
    });
    
    return report;
  }
  
  // Check if performance is optimal (all operations under 100ms)
  isPerformanceOptimal(): boolean {
    for (const [operation, measurements] of this.metrics.entries()) {
      if (measurements.length === 0) continue;
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      if (avg > 100) {
        console.warn(`Performance issue: ${operation} averages ${avg.toFixed(2)}ms`);
        return false;
      }
    }
    return true;
  }
  
  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    this.activeTimers.clear();
  }
}

// Create singleton instance
let monitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (typeof window === 'undefined') {
    // Return a dummy monitor for SSR
    return {
      startTimer: () => {},
      endTimer: () => 0,
      getAverageTime: () => 0,
      getReport: () => ({}),
      isPerformanceOptimal: () => true,
      clear: () => {}
    } as unknown as PerformanceMonitor;
  }
  
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}
