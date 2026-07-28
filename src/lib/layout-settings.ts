/**
 * Layout / navigation variants for the prototype.
 *
 * "assistant"     — Meldingen-icoon staat rechts naast de zoekbalk in de header.
 *                   In de bottom-nav is de Meldingen-tab vervangen door de
 *                   assistent-trigger (roze M + sparkles).
 * "notifications" — Klassieke variant: Meldingen als tab in de bottom-nav,
 *                   assistent als zwevende FAB rechtsonder.
 *
 * Wissel de waarde hieronder om terug te gaan naar de klassieke variant.
 */
export type NavMode = "assistant" | "notifications";
export const NAV_MODE: NavMode = "assistant";
