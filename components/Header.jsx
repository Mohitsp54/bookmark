"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Header({ user }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-600/50 bg-[#081726]/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between sm:h-18">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-400 shadow-md shadow-emerald-400/20">
            <svg
              className="h-4 w-4 text-slate-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white sm:text-lg">LinkNest</h1>
            <p className="hidden text-[11px] uppercase tracking-[0.12em] text-slate-400 sm:block">
              smart bookmark vault
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-slate-500 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-500 bg-slate-700 text-sm">
                {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-lg border border-slate-500 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:border-[#ff785a]/70 hover:bg-[#ff785a]/10 hover:text-[#ffd8ce]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
