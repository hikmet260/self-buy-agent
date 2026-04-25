"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      router.push("/login");
      return;
    }
    
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}