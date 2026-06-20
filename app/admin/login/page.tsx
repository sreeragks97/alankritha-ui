"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/src/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/src/validators/AuthSchema";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await loginMutation.mutateAsync(values);
      const redirectPath = searchParams.get("redirect") || "/admin";
      router.replace(redirectPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setSubmitError(message);
    }
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(140%_120%_at_10%_0%,#fffdf8_0%,#f9f2e4_52%,#f4ead6_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="card-luxury rounded-2xl p-6 sm:p-8">
          <p className="kicker">Admin Access</p>
          <h1 className="mt-2 font-heading text-3xl">Sign In</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Use your admin credentials to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                className="min-h-11 w-full rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                {...register("email")}
              />
              {errors.email ? <span className="text-xs text-[#9d3f2d]">{errors.email.message}</span> : null}
            </label>

            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                className="min-h-11 w-full rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
                {...register("password")}
              />
              {errors.password ? <span className="text-xs text-[#9d3f2d]">{errors.password.message}</span> : null}
            </label>

            {submitError ? <p className="text-sm text-[#9d3f2d]">{submitError}</p> : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
