import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "@/API/auth";
import { updateToken } from "@/API/AllApi";

function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Login(email, password);
      if (res && res.access_token) {
        localStorage.setItem("token", res.access_token);
        updateToken(res.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkmode-800 flex items-center justify-center p-6">
      {/* Floating Theme Switcher */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-darkmode-600 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-darkmode-400">

        {/* LEFT SIDE: Visual/Branding (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <img alt="Logo" className="w-10" src={logoUrl} />
              <span className="text-2xl font-bold text-white tracking-tight">MTX Core</span>
            </div>
            <div className="mt-20">
              <h1 className="text-5xl font-extrabold text-white leading-tight">
                Trade the <br />
                <span className="text-emerald-400">Future</span> Today.
              </h1>
              <p className="mt-6 text-blue-100 text-lg leading-relaxed max-w-sm">
                Access real-time markets, advanced analytics, and institutional-grade security in one sleek dashboard.
              </p>
            </div>
          </div>

          {/* Abstract Decorative Elements */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-white/60 text-sm italic">
            "The most intuitive trading experience I've used." — Alpha Client
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="flex flex-col justify-center p-8 sm:p-16 lg:p-20">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 lg:hidden flex justify-center">
              <img alt="Logo" className="w-12" src={logoUrl} />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Please enter your details to sign in
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <FormInput
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 dark:bg-darkmode-700 border-slate-200 dark:border-darkmode-400 focus:ring-primary focus:border-primary py-3 rounded-xl transition-all"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-sm font-semibold text-primary hover:text-blue-700">
                    Forgot?
                  </a>
                </div>
                <FormInput
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-darkmode-700 border-slate-200 dark:border-darkmode-400 focus:ring-primary focus:border-primary py-3 rounded-xl transition-all"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-darkmode-400"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  Stay signed in for 30 days
                </label>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? "Authorizing..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-darkmode-400 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check all the details of MTX Core. <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;