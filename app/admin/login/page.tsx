"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-green pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-bg-card border border-border-subtle rounded-4xl p-8 shadow-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="font-mono text-green-accent text-2xl font-bold">//</span>
              <span className="font-mono text-text-primary text-xl font-semibold">Admin</span>
            </div>
            <h1 className="text-2xl font-display text-text-primary">Sign In</h1>
            <p className="text-text-secondary text-sm font-mono mt-1">Portfolio CMS — Admin Only</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-text-secondary">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-4 py-3 bg-bg-primary border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors placeholder:text-text-tertiary"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-text-secondary">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-bg-primary border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors placeholder:text-text-tertiary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-green-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-mono">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary font-mono mt-4">
          Secure admin access — not for public use
        </p>
      </div>
    </div>
  );
}
