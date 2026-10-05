# Völker-Portraits (m/w)

Stand: 2026-10-05

## Dateien

Unter `assets/voelker/`:

| Volk | m | w | Default (`icon`, Divers) |
|------|---|---|--------------------------|
| Mensch | mensch-m.webp | mensch-w.webp | iconW |
| Elf | elf-m.webp | elf-w.webp | iconW |
| Ork | ork-m.webp | ork-w.webp | iconW |
| Goblin | goblin-m.webp | goblin-w.webp (Hira’kka) | iconW |
| Untot | untot-m.webp | untot-w.webp | iconW |
| Dryade | dryade-m.webp | dryade-w.webp | iconW |
| Zwerg | zwerg-m.webp | zwerg-w.webp | iconW |
| Gnom | gnom-m.webp | gnom-w.webp | iconW |
| Halbling | halbling-m.webp | halbling-w.webp | iconW |
| Drachenkin | drachenkin-m.webp | drachenkin-w.webp | iconW |
| Beastioid | — | — | beastioid.webp (1× neutral für ganztier/tierwesen/primebeast) |

Legacy: `goblin-hirakka.webp` / `.png` bleiben als Referenz.

## Code

- `VOELKER[].icon` / `iconM` / `iconW`
- `volkIconFor(v,gen)`: `m→iconM`, `w→iconW`, Divers/`x`/leer → `icon` oder `iconW`
- Geschlecht aus `W.gen` (Wizard) bzw. `fig().gen`

## Grenzen (KI-Nähe)

**GenerateImage (cursor) war für den Executor-Subagenten nicht erreichbar** (`MCP server "cursor" is not available here`).

Die aktuellen WebPs sind **Interim-Crops** aus bestehenden Neon-Park-Assets (Bot-Avatare, Studio-NPC-Refs, Hira’kka-Goblin-Icon). Stil ist daher **nicht** einheitlich wie ein frischer GenerateImage-Lauf im Hira’kka-UI-Muster; Named-Cast-Nähe möglich (Chad, Anzra, Fixxy, Moss …).

### Parent: GenerateImage nachziehen

Für jedes Ziel `assets/voelker/<id>-m.webp` / `<id>-w.webp` (1:1, circular bust portrait, 256px):

Gemeinsamer Prompt-Kern:

> Circular UI portrait icon, head-and-shoulders, Neon Park goodvibe cyberpunk-fantasy, warm friendly expression, clear face, dark teal/navy soft bokeh background, polished digital paint like bot self-portraits, no text, no logo, no watermark. Match style of reference goblin-hirakka portrait (round crop, neon accent gems optional).

Refs: `assets/voelker/goblin-hirakka.webp`, `assets/refs/avatar-style-ref.png`, bot selbstbildnisse.

Danach Dateien ersetzen, Commit „Völker-Portraits: GenerateImage-Stil“.

## Screenshots

`/workspace/neon-park-spieler-shots/v-folk-faces-*.png`
