import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServerEnv } from "@/src/lib/env";
import type { Database } from "@/src/types/database";

export async function getSupabaseServerClient() {
  const env = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(env.public.supabaseUrl, env.public.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieList) {
        for (const cookie of cookieList) {
          try {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          } catch {
            // Ignore when called from a read-only server context.
          }
        }
      },
    },
  });
}
