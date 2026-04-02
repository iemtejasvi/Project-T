import { redirect } from "next/navigation";
import NameArchiveClient from "./NameArchiveClient";

interface NamePageProps {
  params: Promise<{ name: string }>;
}

export default async function NamePage({ params }: NamePageProps) {
  const { name: rawSlug } = await params;
  const decoded = decodeURIComponent(rawSlug);
  const lower = decoded.toLowerCase().trim();

  // 308 permanent redirect non-lowercase slugs to canonical lowercase URL
  if (decoded !== lower) {
    redirect(`/name/${encodeURIComponent(lower)}`);
  }

  return <NameArchiveClient />;
}
