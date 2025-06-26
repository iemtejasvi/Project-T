import React from "react";
import SubmitForm from "../app/submit/page";

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isDesktopWidth() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

export const DesktopSiteSubmitPage: React.FC = () => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(isMobileDevice() && isDesktopWidth());
    const onResize = () => setShow(isMobileDevice() && isDesktopWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (!show) return null;
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-lg">
        <SubmitForm />
      </div>
    </div>
  );
}; 