"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  animation?: string;
  ip?: string;
  city?: string;
  country?: string;
  state?: string;
  device?: string;
}

function AdminPanelContent() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");
  const ADMIN_SECRET = "myadminsecret";
  const isAuthorized = secret === ADMIN_SECRET;

  const [pendingMemories, setPendingMemories] = useState<Memory[]>([]);
  const [approvedMemories, setApprovedMemories] = useState<Memory[]>([]);
  const [bannedMemories, setBannedMemories] = useState<Memory[]>([]);

  async function fetchPendingMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPendingMemories(data || []);
  }

  async function fetchApprovedMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setApprovedMemories(data || []);
  }

  async function fetchBannedMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("status", "banned")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setBannedMemories(data || []);
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchPendingMemories();
      fetchApprovedMemories();
      fetchBannedMemories();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <p className="p-6 text-center text-red-600">Access Denied</p>;
  }

  async function handleUpdateMemoryStatus(id: string, newStatus: string) {
    if (newStatus === "rejected") {
      // Delete memory entirely
      const { error } = await supabase
        .from("memories")
        .delete()
        .eq("id", id);
      if (error) console.error(error);
    } else if (newStatus === "banned") {
      // Fetch memory details to get user info
      const { data, error: fetchError } = await supabase
        .from("memories")
        .select("ip, city, country, state, device")
        .eq("id", id)
        .single();
      if (fetchError) console.error(fetchError);
      else {
        // Insert banned user details into banned_users table
        await supabase.from("banned_users").insert([
          {
            ip: data.ip,
            city: data.city,
            country: data.country,
            state: data.state,
            device: data.device,
          },
        ]);
      }
      // Update memory status to banned
      const { error } = await supabase
        .from("memories")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) console.error(error);
    } else if (newStatus === "unbanned") {
      // Remove from banned_users table based on memory's ip and update memory status to approved
      const { data, error: fetchError } = await supabase
        .from("memories")
        .select("ip")
        .eq("id", id)
        .single();
      if (fetchError) console.error(fetchError);
      else {
        await supabase.from("banned_users").delete().eq("ip", data.ip);
      }
      const { error } = await supabase
        .from("memories")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from("memories")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) console.error(error);
    }
    // Refresh all sections
    fetchPendingMemories();
    fetchApprovedMemories();
    fetchBannedMemories();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* Pending Memories Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">
            Pending Memories for Review
          </h2>
          {pendingMemories.length > 0 ? (
            pendingMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white/90 shadow rounded-lg p-6 mb-6 border-l-4 border-yellow-400"
              >
                <h3 className="text-2xl font-semibold text-gray-800">
                  To: {memory.recipient}
                </h3>
                <p className="mt-3 text-gray-700">{memory.message}</p>
                {memory.sender && (
                  <p className="mt-3 italic text-lg text-gray-600">— {memory.sender}</p>
                )}
                <small className="block mt-3 text-gray-500">
                  {new Date(memory.created_at).toLocaleString()}
                </small>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "banned")}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Ban
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No pending memories for review.</p>
          )}
        </section>

        {/* Approved Memories Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">
            Approved Memories (with Submission Info)
          </h2>
          {approvedMemories.length > 0 ? (
            approvedMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white/90 shadow rounded-lg p-6 mb-6 border-l-4 border-green-400"
              >
                <h3 className="text-2xl font-semibold text-gray-800">
                  To: {memory.recipient}
                </h3>
                <p className="mt-3 text-gray-700">{memory.message}</p>
                {memory.sender && (
                  <p className="mt-3 italic text-lg text-gray-600">— {memory.sender}</p>
                )}
                <small className="block mt-3 text-gray-500">
                  {new Date(memory.created_at).toLocaleString()}
                </small>
                {/* Extra submission info */}
                <div className="mt-2 text-sm text-gray-600">
                  <p>IP: {memory.ip}</p>
                  <p>City: {memory.city}</p>
                  <p>State: {memory.state}</p>
                  <p>Country: {memory.country}</p>
                  <p>Device: {memory.device}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No approved memories available.</p>
          )}
        </section>

        {/* Banned Memories Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">
            Banned Memories
          </h2>
          {bannedMemories.length > 0 ? (
            bannedMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white/90 shadow rounded-lg p-6 mb-6 border-l-4 border-red-400"
              >
                <h3 className="text-2xl font-semibold text-gray-800">
                  To: {memory.recipient}
                </h3>
                <p className="mt-3 text-gray-700">{memory.message}</p>
                {memory.sender && (
                  <p className="mt-3 italic text-lg text-gray-600">— {memory.sender}</p>
                )}
                <small className="block mt-3 text-gray-500">
                  {new Date(memory.created_at).toLocaleString()}
                </small>
                {/* Extra submission info */}
                <div className="mt-2 text-sm text-gray-600">
                  <p>IP: {memory.ip}</p>
                  <p>City: {memory.city}</p>
                  <p>State: {memory.state}</p>
                  <p>Country: {memory.country}</p>
                  <p>Device: {memory.device}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "unbanned")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Unban
                  </button>
                  <button
                    onClick={() => handleUpdateMemoryStatus(memory.id, "rejected")}
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No banned memories.</p>
          )}
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Loading admin panel...</p>}>
      <AdminPanelContent />
    </Suspense>
  );
}
