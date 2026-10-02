"use client";

import { THEMES, applyTheme, type ThemeId } from "@legado/shared";
import { cn } from "@/lib/utils";

type Props = {
  value: ThemeId;
  onChange: (themeId: ThemeId) => void;
  /** Si true, aplica el tema al documento al pasar el ratón / enfocar (preview). */
  livePreview?: boolean;
};

export function ThemePicker({ value, onChange, livePreview = true }: Props) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {THEMES.map((theme) => {
          const selected = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              className={cn(
                "rounded-xl border p-3 text-left transition",
                "hover:border-ring focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                selected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card/60",
              )}
              aria-pressed={selected}
              onMouseEnter={() => {
                if (livePreview) applyTheme(theme.id);
              }}
              onFocus={() => {
                if (livePreview) applyTheme(theme.id);
              }}
              onMouseLeave={() => {
                if (livePreview) applyTheme(value);
              }}
              onBlur={() => {
                if (livePreview) applyTheme(value);
              }}
              onClick={() => onChange(theme.id)}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-flex size-8 overflow-hidden rounded-md border border-black/10 shadow-sm"
                  aria-hidden
                >
                  <span
                    className="h-full w-1/3"
                    style={{ background: theme.preview.bg }}
                  />
                  <span
                    className="h-full w-1/3"
                    style={{ background: theme.preview.panel }}
                  />
                  <span
                    className="flex h-full w-1/3 items-end justify-center pb-1"
                    style={{ background: theme.preview.fg }}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: theme.preview.accent }}
                    />
                  </span>
                </span>
                <span className="font-medium">{theme.label}</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
      <div
        className="legado-empty rounded-xl px-4 py-3"
        data-theme-preview={value}
      >
        <p className="font-heading text-sm text-[var(--legado-ink)]">
          Vista previa · {THEMES.find((t) => t.id === value)?.label}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          Pasa el cursor sobre una tarjeta para probar el skin. La elección se
          guarda en este navegador y la comparten Entrenamiento y Consulta.
        </p>
      </div>
    </div>
  );
}
