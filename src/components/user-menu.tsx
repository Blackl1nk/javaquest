"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid size-8 place-items-center rounded-full bg-surface-2 text-sm font-bold text-accent transition hover:bg-border-soft"
        aria-label="Меню пользователя"
      >
        {name.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-xl">
            <div className="px-3 py-2 text-xs text-muted">{name}</div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-3 py-2 text-left text-sm text-danger transition hover:bg-surface-2"
            >
              Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
}