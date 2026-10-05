# UX-Analyse Neon Park Spieler-Seite — 2026-10-05

Repo: `/workspace/neon-park-spieler` · Live: https://moyolenkins-lgtm.github.io/neon-park-spieler/

Menüfluss (Ist): **Splash (Poster)** → **Hauptmenü** → Figur (Join/Wizard) → **Spiel** (Charakterbogen/Chat-Aktionen) · parallel **App-Runde** / **Activities** / **Online-Tisch** (in App-Runde) · alternativ **Chat-Host** (nur Textvorlagen).

Branding: Neon-Park-Poster als BG (kein Xeon-Logo-Container) — beibehalten.

---

## Top-Probleme (vor dem Fix)

| # | Problem | Schwere | Typ |
|---|---------|---------|-----|
| 1 | **Zwei Spielebenen unklar:** „Spiel erstellen“ (Chat-Texte) vs „App-Runde“ (Spielleiter im Gerät) – gleiche Gold-Farben, ähnliche Labels | hoch | Hierarchie / Label |
| 2 | **Activities als Top-Level** neben App-Runde – totte Enden ohne laufende Runde; doppelter Einstieg (Menü + in-Runde + Charakterbogen-Button) | mittel | Doppelweg / totte Enden |
| 3 | **HP/TP-Doppelwelt:** Charakterbogen-TP ≠ App-Runden-HP der Gruppenkarten – nirgends erklärt | hoch | Denkfehler |
| 4 | **Host muss offen bleiben** erst nach Tisch-Öffnung klar – Reload = verwaiste Gäste | hoch | Prozess |
| 5 | **Menü ohne Primärpfad:** 8+ gleichgewichtige Kacheln; „Weiterspielen“ vs Neu vs App-Runde vs Chat | mittel | UX-Hierarchie |
| 6 | **„Beitreten“ doppelt:** Platz-Code (Alpha-Gate) vs Online-Tisch-Code (WebRTC) – gleiche Tür-Metapher | mittel | Label |
| 7 | **Kein Schnell-/Lang-Modus** – Einstieg immer volle Kampagne (~45–90 Min.) | hoch | Feature-Lücke |
| 8 | **toRunde-Label** „App-Runde · Activities“ vermischt zwei Ziele | niedrig | Label |

Weitere Beobachtungen:
- Chat-Host-Seite ist ehrlich (kein Server), aber Menü-Titel „Spiel erstellen“ suggeriert Live-Tisch.
- App-Runde Setup mischt Gruppe, Online, Share, Start ohne visuelle Phasen.
- Gäste ohne Figur: App-Runde stoppt korrekt, aber Rückweg nur „Figur erstellen“.
- Gate „Tisch voll“ vs offener Alpha-Status: Edge Cases für neue Geräte ohne Save.

---

## Quick Wins (umgesetzt 2026-10-05)

1. **Menü in Sektionen:** „Spielen im Gerät“ (Primär, Pink) → „Chat-Tisch vorbereiten“ (Cyan/Violett) → „Mehr“.
2. **Labels:** App-Runde als Haupt-CTA; Chat-Host = „Chat-Einladung“; Join = „Figur & Beitritt“.
3. **Honest-Hinweis** zu Host-offen + TP/HP-Trennung im Menü und Setup.
4. **Moduswahl + Quest-Picker** in der App-Runde (siehe Feature).
5. **Activities** unter App-Runde-Sektion (nicht dieselbe visuelle Stufe wie Chat-Host).
6. Host-Tipp nach Tisch-Öffnung verschärft (Reload → Neu verbinden).

---

## Feature: Schnelles / Langes Spiel

**Fluss Schnell:** App-Runde → ⚡ Schnelles Spiel → 3 Zufalls-Karten aus `kampagne.json` → `kurzquests` → Quest wählen → Gruppe (Freunde/Online/Bots) → Start (Mini-Kampagne 2 Szenen + Epilog).

**Fluss Lang:** App-Runde → 📜 Langes Spiel → Funkenflug (wie bisher) → Gruppe → Start.

Pool: 6 Kurz-Quests (Waschbär-Coup, Lichtbrücke, Sirrah-Hut, Café Chrom, Synth-Chor, Portal-Klemme). UI: Titel, Kurztext, Dauer, Schwierigkeit (leicht/mittel/knifflig), Tags. „Andere 3 ziehen“ / „Modus wechseln“.

Technisch: `R.mode`, `R.questId`, `R.questOffer`; `activeCamp()` blendet Mini-Szenen über die Engine.

---

## Risiken / Grenzen

- Kurz-Quests teilen Begegnungs-/Stimmungspool der Hauptkampagne (gewollt, Flair).
- Bestehende Saves ohne `mode`: Setup zeigt Moduswahl erneut (ok).
- Online: Host muss Quest/Modus wählen, bevor Gäste sinnvollen Titel sehen.
- Charakterbogen und App-Runde bleiben getrennte Datenmodelle (keine Auto-Sync der TP).
- Screenshots lokal; Live nach GitHub-Pages-Deploy.

---

## Nächste Schritte (nicht in diesem Commit)

- Optional: Charakterbogen-TP ↔ Runden-HP Sync-Toggle.
- Activities nur als Tab in App-Runde (Top-Level ganz entfernen).
- Onboarding-Tooltip „Host offen lassen“ beim ersten Host-Klick.
- Mehr Kurz-Quests / Generator aus Templates.
- A11y: Quest-Karten mit `aria-describedby`.
