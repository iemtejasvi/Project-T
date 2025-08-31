"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function UuidInitializer() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if UUID exists in either localStorage or cookies
      const storedUuid = localStorage.getItem("user_uuid") || getCookie("user_uuid");
      
      if (!storedUuid) {
        // Generate new UUID
        const newUuid = uuidv4();
        
        // Store in localStorage
        localStorage.setItem("user_uuid", newUuid);
        
        // Store in cookie with 1 year expiration
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        document.cookie = `user_uuid=${newUuid}; expires=${expirationDate.toUTCString()}; path=/`;
      } else if (!localStorage.getItem("user_uuid")) {
        // If UUID exists in cookie but not in localStorage, sync it
        localStorage.setItem("user_uuid", storedUuid);
      } else if (!getCookie("user_uuid")) {
        // If UUID exists in localStorage but not in cookie, sync it
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        document.cookie = `user_uuid=${storedUuid}; expires=${expirationDate.toUTCString()}; path=/`;
      }

      // Cache management for development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Clear service worker cache on development
        if ('serviceWorker' in navigator && 'caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
      }

      // Bulletproof cache refresh system
      const currentVersion = '3.0'; // Increment this when deploying
      
      try {
        const storedVersion = localStorage.getItem('app_version');
        
        // Only proceed if we need to update
        if (storedVersion !== currentVersion) {
          
          // Always update version first to prevent loops
          localStorage.setItem('app_version', currentVersion);
          
          // Clear caches safely (never causes errors)
          if ('caches' in window && typeof caches.keys === 'function') {
            caches.keys()
              .then(names => {
                if (Array.isArray(names)) {
                  return Promise.all(
                    names.map(name => 
                      caches.delete(name).catch(() => false)
                    )
                  );
                }
                return Promise.resolve();
              })
              .catch(() => {
                // Cache clearing failed - not critical
              });
          }
          
          // Force refresh only if truly needed and safe
          if (storedVersion && 
              storedVersion !== currentVersion && 
              typeof window !== 'undefined' && 
              window.location && 
              typeof window.location.reload === 'function') {
            
            // Use the safest reload method
            setTimeout(() => {
              if (document.readyState === 'complete') {
                window.location.reload();
              } else {
                // Page still loading, use replace instead
                if (typeof window.location.replace === 'function') {
                  window.location.replace(window.location.href);
                }
              }
            }, 50); // Minimal delay for stability
          }
        }
      } catch {
        // Ultimate fallback - silently continue
        try {
          localStorage.setItem('app_version', '3.0');
        } catch {
          // Even localStorage failed - just continue
        }
      }
    }
  }, []);
  return null;
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
} 