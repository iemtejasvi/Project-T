"use client";
import { useEffect, useState } from 'react';
import { getPerformanceMonitor } from '@/lib/performanceMonitor';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<any>({});
  const [isOptimal, setIsOptimal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateMetrics = () => {
      const monitor = getPerformanceMonitor();
      const report = monitor.getReport();
      const optimal = monitor.isPerformanceOptimal();
      
      setMetrics(report);
      setIsOptimal(optimal);
    };

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000);
    
    // Show monitor after initial load
    setTimeout(() => setIsVisible(true), 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm text-xs font-mono">
      <div className="mb-2 font-bold flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isOptimal ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
        Performance Monitor
      </div>
      {Object.entries(metrics).length === 0 ? (
        <div className="text-gray-400">Monitoring...</div>
      ) : (
        <div className="space-y-1">
          {Object.entries(metrics).map(([op, stats]: [string, any]) => (
            <div key={op} className="flex justify-between">
              <span className="text-gray-300 truncate mr-2" style={{ maxWidth: '200px' }}>
                {op}:
              </span>
              <span className={stats.avg < 50 ? 'text-green-400' : stats.avg < 100 ? 'text-yellow-400' : 'text-red-400'}>
                {stats.avg}ms
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="text-gray-400">
          {isOptimal ? '✅ All operations < 100ms' : '⚠️ Some operations need optimization'}
        </div>
      </div>
    </div>
  );
}
