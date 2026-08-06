"use client";

import { useHeaderObserver } from "@/hooks/useHeaderObserver";
import { useAnimationObserver } from "@/hooks/useAnimationObserver";

export function ScriptsController() {
  useHeaderObserver();
  useAnimationObserver();

  return null;
}
