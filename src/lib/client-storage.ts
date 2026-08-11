import type { Selection, StudioConfiguration } from "@/types/catalog";

const SELECTION_KEY = "kremer-showroom-selection:v1";
export const STUDIO_KEY = "kremer-showroom-studio:v1";

type StoredSelections = { version: 1; items: Selection[] };
type StoredStudio = { version: 1; config: StudioConfiguration };

export function loadSelections(): Selection[] {
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSelections;
    return parsed.version === 1 && Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function saveSelections(items: Selection[]) {
  const payload: StoredSelections = { version: 1, items };
  window.localStorage.setItem(SELECTION_KEY, JSON.stringify(payload));
}

export function loadStudioConfiguration(): StudioConfiguration | null {
  try {
    const raw = window.localStorage.getItem(STUDIO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredStudio;
    return parsed.version === 1 ? parsed.config : null;
  } catch {
    return null;
  }
}

export function saveStudioConfiguration(config: StudioConfiguration) {
  const payload: StoredStudio = { version: 1, config };
  window.localStorage.setItem(STUDIO_KEY, JSON.stringify(payload));
}

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}
