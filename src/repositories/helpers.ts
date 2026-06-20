import type { PostgrestError } from "@supabase/supabase-js";
import { AppError } from "@/src/utils/AppError";

export function assertNoError(error: PostgrestError | null, message: string, code: string, status = 500): void {
  if (!error) {
    return;
  }

  throw new AppError(message, {
    code,
    status,
    cause: error,
  });
}

export function normalizeCount(count: number | null): number {
  return typeof count === "number" ? count : 0;
}
