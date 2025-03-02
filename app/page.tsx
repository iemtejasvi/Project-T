"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [memories, setMemories] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchMemories() {
      console.log("Fetching memories from Supabase...");
      const { data, error } = await supabase.from("memories").select("*");
      if (error) {
        console.error("Error fetching memories:", error);
        setErrorMsg(JSON.stringify(error, null, 2));
      } else {
        setMemories(data);
      }
    }
    fetchMemories();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Memories</h1>
      {errorMsg && (
        <pre style={{ color: "red" }}>Error: {errorMsg}</pre>
      )}
      {memories.length ? (
        memories.map((memory) => (
          <div key={memory.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
            <h2>{memory.recipient}</h2>
            <p>{memory.message}</p>
            {memory.sender && <p><em>From: {memory.sender}</em></p>}
            {/* You can display other fields like status, color, etc. */}
          </div>
        ))
      ) : (
        <p>No memories found.</p>
      )}
    </div>
  );
}
