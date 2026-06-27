"use client";

import { useState } from "react";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { useToast } from "@/hooks/useToast";
import { useAccount, useUpdateEmail, useUpdatePassword, useUpdateProfile } from "@/src/hooks/useAuth";
import type { Account } from "@/src/services/AuthService";

const inputClass =
  "min-h-11 w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]";

function ProfileForms({ account }: { account: Account }) {
  const { toasts, showToast, removeToast } = useToast();
  const updateProfile = useUpdateProfile();
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();

  const [name, setName] = useState(account.profile?.name ?? "");
  const [phone, setPhone] = useState(account.profile?.phone ?? "");
  const [email, setEmail] = useState(account.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onError = (error: unknown) =>
    showToast({
      title: "Something went wrong",
      description: error instanceof Error ? error.message : "Please try again.",
    });

  return (
    <div className="max-w-2xl space-y-4">
      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Profile Details</p>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            updateProfile.mutate(
              { name, phone },
              {
                onSuccess: () => showToast({ title: "Profile updated", description: "Your details are saved." }),
                onError,
              },
            );
          }}
        >
          <label className="space-y-1 text-sm">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Phone Number</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)] disabled:opacity-60"
            >
              {updateProfile.isPending ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Email</p>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            updateEmail.mutate(
              { email },
              {
                onSuccess: () =>
                  showToast({
                    title: "Email update requested",
                    description: "If confirmation is required, check your inbox to finish.",
                  }),
                onError,
              },
            );
          }}
        >
          <label className="space-y-1 text-sm">
            <span>Email Address</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </label>
          <p className="text-xs text-[var(--brand-muted)]">
            Depending on your Supabase settings, changing your email may require confirmation before it takes effect.
          </p>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateEmail.isPending}
              className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)] disabled:opacity-60"
            >
              {updateEmail.isPending ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </section>

      <section className="card-luxury rounded-2xl p-5">
        <p className="font-heading text-3xl">Password</p>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            updatePassword.mutate(
              { password, confirmPassword },
              {
                onSuccess: () => {
                  setPassword("");
                  setConfirmPassword("");
                  showToast({ title: "Password updated", description: "Use your new password next time you sign in." });
                },
                onError,
              },
            );
          }}
        >
          <label className="space-y-1 text-sm">
            <span>New Password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Confirm Password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updatePassword.isPending}
              className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)] disabled:opacity-60"
            >
              {updatePassword.isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>

      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function ProfilePage() {
  const accountQuery = useAccount();

  if (accountQuery.isLoading || !accountQuery.data) {
    return (
      <PageLoader label="Loading profile">
        <div className="max-w-2xl space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Shimmer key={index} className="card-luxury h-44 rounded-2xl" />
          ))}
        </div>
      </PageLoader>
    );
  }

  const data = accountQuery.data;
  const formKey = `${data.email ?? ""}-${data.profile?.name ?? ""}-${data.profile?.phone ?? ""}`;

  return <ProfileForms key={formKey} account={data} />;
}
