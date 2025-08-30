"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MaintenancePage() {
  const [maintenanceMessage, setMaintenanceMessage] = useState("Site is under maintenance. Please check back later.");
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(true);

  useEffect(() => {
    // Check maintenance status
    const checkMaintenanceStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("maintenance")
          .select("is_active, message")
          .eq("id", 1)
          .single();

        if (error) {
          console.error("Error checking maintenance status:", error);
          return;
        }

        if (data) {
          setIsMaintenanceActive(data.is_active);
          if (data.message) {
            setMaintenanceMessage(data.message);
          }
        }
      } catch (err) {
        console.error("Unexpected error checking maintenance status:", err);
      }
    };

    checkMaintenanceStatus();

    // Check every 30 seconds for maintenance status changes
    const interval = setInterval(checkMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // If maintenance is disabled, redirect to home
  useEffect(() => {
    if (!isMaintenanceActive) {
      window.location.href = "/";
    }
  }, [isMaintenanceActive]);

  if (!isMaintenanceActive) {
    return null;
  }

    return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Maintenance Icon */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-[var(--card-bg)] rounded-full mb-4 md:mb-6 shadow-lg border border-[var(--border)]">
              <span className="text-4xl md:text-6xl">🔧</span>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text)] mb-6 md:mb-8 font-['Playfair Display']">
            Under Maintenance
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-[var(--text)] mb-8 md:mb-12 leading-relaxed max-w-xl mx-auto">
            {maintenanceMessage}
          </p>

          {/* Additional Info Card */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6 md:p-8 shadow-md border border-[var(--border)] mb-8">
            <p className="text-[var(--text)] mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
              We're working hard to improve your experience. Please check back soon.
            </p>
            
            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-center gap-2 md:gap-3 text-sm text-[var(--text)] opacity-80">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-[var(--accent)] rounded-full animate-pulse"></div>
              <span>Checking for updates every 30 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 md:py-6 bg-[var(--card-bg)] border-t border-[var(--border)]">
        <p className="text-[var(--text)] text-sm md:text-base">
          © {new Date().getFullYear()} — If Only I Sent This
        </p>
      </div>
    </div>
  );
} 