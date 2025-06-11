"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function UuidInitializer() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("user_uuid")) {
        localStorage.setItem("user_uuid", uuidv4());
      }
    }
  }, []);
  return null;
} 