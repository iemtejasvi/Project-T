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
      const currentVersion = '2.1'; // Increment this when deploying
      const storedVersion = localStorage.getItem('app_version');
      
      if (storedVersion !== currentVersion) {
        // Clear all caches when version changes
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
        
        // Mobile-specific cache clearing
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          // Clear additional mobile storage
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch (e) {
            console.log('Storage clear failed:', e);
          }
        }
        
        // Force hard reload for mobile browsers
        if (storedVersion) {
          // Add timestamp to force fresh load
          const timestamp = Date.now();
          const url = new URL(window.location.href);
          url.searchParams.set('v', timestamp.toString());
          window.location.href = url.toString();
        } else {
          localStorage.setItem('app_version', currentVersion);
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