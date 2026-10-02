"use client";

import { useEffect } from "react";
import {
  applyTheme,
  loadThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
  isThemeId,
} from "@legado/shared";

type Props = {
  themeId?: ThemeId;
  children?: React.ReactNode;
};

export function ThemeProvider({ themeId, children }: Props) {
  useEffect(() => {
    const initial = themeId ?? loadThemeId();
    applyTheme(initial);

    function onStorage(e: StorageEvent) {
      if (e.key === THEME_STORAGE_KEY && isThemeId(e.newValue)) {
        applyTheme(e.newValue);
      }
    }
    function onCustom(e: Event) {
      const detail = (e as CustomEvent<{ themeId?: ThemeId }>).detail;
      if (detail?.themeId && isThemeId(detail.themeId)) {
        applyTheme(detail.themeId);
      }
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("legado:theme", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("legado:theme", onCustom);
    };
  }, [themeId]);

  useEffect(() => {
    if (themeId) applyTheme(themeId);
  }, [themeId]);

  return children ?? null;
}
