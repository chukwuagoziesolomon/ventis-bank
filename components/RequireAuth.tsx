"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVantis } from "@/lib/store";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { initialized, loading, isAuthenticated } = useVantis();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (loading || !initialized || !isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-900">
        <div className="flex items-center gap-3 text-bone/40">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-sm tracking-wide">Loading MidwesternBank…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
