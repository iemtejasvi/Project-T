"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UnlimitedUser {
  id: string;
  ip?: string | null;
  uuid?: string | null;
  created_at: string;
}

export default function UnlimitedUsersPage() {
  const [ip, setIp] = useState("");
  const [uuid, setUuid] = useState("");
  const [users, setUsers] = useState<UnlimitedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalUntil, setGlobalUntil] = useState<string>("");
  const [savingGlobal, setSavingGlobal] = useState(false);

  // Fetch existing data
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("unlimited_users")
        .select("id, ip, uuid, created_at")
        .order("created_at", { ascending: false });
      if (!error) setUsers(data || []);

      // fetch settings
      const { data: settings } = await supabase
        .from("site_settings")
        .select("word_limit_disabled_until")
        .single();
      if (settings?.word_limit_disabled_until) {
        // ISO string without seconds
        setGlobalUntil(settings.word_limit_disabled_until.substring(0, 16));
      }
    })();
  }, []);

  const handleAdd = async () => {
    if (!ip && !uuid) return;
    setLoading(true);
    const { error } = await supabase.from("unlimited_users").insert({ ip: ip || null, uuid: uuid || null });
    if (!error) {
      setUsers(prev => [{ id: crypto.randomUUID(), ip, uuid, created_at: new Date().toISOString() }, ...prev]);
      setIp("");
      setUuid("");
    } else {
      console.error('Insert error', error?.message || error);
    }
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("unlimited_users").delete().eq("id", id);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSaveGlobal = async () => {
    setSavingGlobal(true);
    const until = globalUntil ? new Date(globalUntil).toISOString() : null;
    await supabase.from("site_settings").upsert({ id: 1, word_limit_disabled_until: until });
    setSavingGlobal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Unlimited Users & Special Limit</h1>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Add new user */}
        <section className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Add Unlimited User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              className="p-3 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              placeholder="IP (optional)"
              value={ip}
              onChange={e => setIp(e.target.value)}
            />
            <input
              className="p-3 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              placeholder="UUID (optional)"
              value={uuid}
              onChange={e => setUuid(e.target.value)}
            />
            <button
              onClick={handleAdd}
              disabled={loading || (!ip && !uuid)}
              className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          <p className="text-sm opacity-75">Provide either IP or UUID (or both). A match on either grants unlimited submissions.</p>
        </section>

        {/* Existing list */}
        <section className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Current Unlimited Users</h2>
          {users.length === 0 ? (
            <p className="opacity-70">No unlimited users yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-sm">
                  <th className="py-2">IP</th>
                  <th className="py-2">UUID</th>
                  <th className="py-2">Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} className={`border-b border-[var(--border)] text-sm ${idx % 2 === 0 ? 'bg-[var(--bg)]' : ''}`}>
                    <td className="py-2 pr-2">{u.ip || "-"}</td>
                    <td className="py-2 pr-2 break-all">{u.uuid || "-"}</td>
                    <td className="py-2 pr-2">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-2 text-right">
                      <button className="text-red-500 hover:text-red-700 transition" onClick={() => handleRemove(u.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Global override */}
        <section className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Word-Limit Override (Site-wide)</h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <input
              type="datetime-local"
              value={globalUntil}
              onChange={e => setGlobalUntil(e.target.value)}
              className="p-3 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleSaveGlobal}
              className="px-4 py-3 bg-[var(--accent)] text-[var(--text)] rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {savingGlobal ? "Saving..." : "Save"}
            </button>
          </div>
          <p className="text-sm opacity-75 mt-2">Set a future date/time until which the 50-word limit is disabled for everyone. Clear the field to re-enable immediately.</p>
        </section>
      </main>
    </div>
  );
}
