"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string | null;
  phoneVerified: boolean;
  gender: string | null;
  marketingOptIn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // @ts-expect-error NextAuth session user types don't include id by default
  const uid = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;
    if (!uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        
        const data = await res.json();
        if (cancelled) return;
        
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, status]);

  const saveProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!uid) throw new Error("Not authenticated");
      
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      
      const { data } = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    },
    [uid]
  );

  return { profile, loading, saveProfile };
}
