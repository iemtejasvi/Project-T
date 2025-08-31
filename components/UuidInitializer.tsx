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

      // Add cache refresh on version change
      const currentVersion = '2.2'; // Increment this when deploying
      const storedVersion = localStorage.getItem('app_version');
      
      if (storedVersion !== currentVersion) {
        // Clear all caches when version changes (async/non-blocking)
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          }).catch(() => {}); // Silent fail
        }
        
        // Update version immediately to prevent future checks
        localStorage.setItem('app_version', currentVersion);
        
        // Only force reload if this is genuinely an old version (not first visit)
        if (storedVersion && storedVersion !== currentVersion) {
          // Use replace instead of href to prevent history entry
          window.location.replace(window.location.href);
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