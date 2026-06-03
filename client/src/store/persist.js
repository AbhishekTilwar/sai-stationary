const KEY = 'sai_stationary_state_v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Ignore write errors (e.g. private mode / quota exceeded).
  }
}
