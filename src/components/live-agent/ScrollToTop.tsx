"use client";

import { useEffect } from "react";

/** Ensure /live-agent always opens at the top (tab strip must not steal scroll). */
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
