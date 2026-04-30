import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance | If Only I Sent This',
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
