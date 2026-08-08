"use client";

import type { ReactNode } from "react";

export function JoinChallengeButton({
  className,
  children = "join the challenge",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const onClick = () => {
    const el = document.getElementById("join-guide");
    if (!(el instanceof HTMLDetailsElement)) return;
    el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
