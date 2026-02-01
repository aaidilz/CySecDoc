"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    // Pake <div> paling luar, jangan <html> atau <body>
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs uppercase font-bold tracking-widest">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Lock size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Owner Login</h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-2 text-center">System Experiment 404 Access</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Username</label>
            <input type="text" placeholder="Owner ID" className="w-full bg-black border border-white/5 rounded-2xl px-5 py-3 text-sm focus:border-red-600 outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/5 rounded-2xl px-5 py-3 text-sm focus:border-red-600 outline-none transition-all" />
          </div>

          <button className="w-full bg-red-600 hover:bg-white hover:text-red-600 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest mt-4 shadow-lg shadow-red-600/20 active:scale-95">
            Login to Dashboard
          </button>
        </form>
      </div>

      <p className="mt-8 text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em]">Authorized Personnel Only</p>
    </div>
  );
}
