# Völker-Untertypen (Unterrassen)

Stand: 2026-10-05 (UTC+2 / Europe/Berlin)

## Idee

Jedes klassische Volk kann eine **Unterrasse** haben: Look & Herkunft, rein kosmetisch (keine Werteänderung). Nach Volk-Wahl erscheint ein Untertyp-Picker mit m/w-Portraits (Geschlecht aus Schritt 2).

Beastioide bleiben wie bisher: **Ganztie / Humanoid-Tierwesen / Primebeasts** + Biest-Preset (keine zweite Unterrassen-Ebene).

## Datenmodell

- `VOELKER[].ut[]` – Array der Untertypen
- Felder pro Untertyp: `id`, `e`, `n` (Plural/Anzeigename), `s` (Kurzform), `desc`, `gender` (bool), `icon` / `iconM` / `iconW`
- Figur: `fig.ut` (String-ID)
- Wizard: `W.ut`
- Hilfen: `utOf(e)`, `utOfW()`, `volkIconFor(v,gen,ut)`, `ensureUt(f)` (Legacy-Saves → erster Untertyp)

## Untertypen

| Volk | Untertypen |
|------|------------|
| Mensch | **Auralithen**, **Solvaren**, **Kessari**, **Umbrakin**, **Verdani** (Fantasy-Völker, keine Realwelt-Ethnien) |
| Elf | **Yngesthera** (hell/edel), **Kren'zogh** (Wüstenkrieger), **Zeng'thok** (dunkel/mythisch-okkult; Anzra = Dunkelelfe) |
| Untot | **Zombies**, **Skelette**, **Geister** (Geister: 1× neutrales Portrait) |
| Ork | **Stahlherz**, **Blutklang**, **Moornarbe** |
| Goblin | **Hira'kka**, **Neonfunken**, **Tunnelwusel** |
| Zwerg | **Lichtschmiede**, **Tiefenader**, **Brückenwächter** |
| Gnom | **Funkenwerk**, **Rätselchor**, **Glitzerflor** |
| Halbling | **Wanderfeuer**, **Herdglück**, **Schattenklee** |
| Drachenkin | **Lichtdrachen**, **Aschenschuppen**, **Nebelschwingen** |
| Dryade | **Hainblüte**, **Neonranke**, **Wurzelmond** |

## Dateien

Portraits unter `assets/voelker/untertypen/`:

- Muster m/w: `<volk>-<ut-id>-m.webp` / `-w.webp`
- Geister: `untot-geist.webp` (neutral)

Aktuell: **stilisierte Neon-Park-SVG/Pillow-Portraits** (Synthwave-Kreis, Pink/Cyan/Violett). Kein GenerateImage – Parent kann später durch fotorealistische Cast-Nähe ersetzen.

### GenerateImage-Prompts (Parent)

Gemeinsamer Kern:

> Circular UI portrait icon, head-and-shoulders, Neon Park goodvibe cyberpunk-fantasy, warm friendly expression, clear face, dark teal/navy soft bokeh background, polished digital paint, no text, no logo. Neon pink/cyan/purple accents.

Dann je Untertyp die `desc` + Haut-/Look-Hinweise aus der Tabelle (z. B. Zeng'thok: shadow-violet skin, occult runes; Kren'zogh: sun-tanned desert elf warrior; Auralithen: pale cool northern fantasy folk).

## UI

- Schritt 3 · Volk → nach Auswahl: **Unterrasse (Pflicht)** Grid (wie Biest-Presets)
- Geschlecht m → `iconM`, w → `iconW`, divers/x → `icon`/`iconW`
- Charakterbogen / Kopfzeile: `Volk · Unterrasse`

## Neon-Park-Namensregel

Keine 1:1-D&D-Fähigkeitsnamen. Klassische Rassenkonzepte OK mit Neon-Park-Flair. Keine Realwelt-Ethnienlabels für Menschen.


## GenerateImage-Nachzug 2026-10-05

Ersetzt (Selbstbild-Stil): **Elf** (Yngesthera/Kren'zogh/Zeng'thok m+w), **Untot** (Zombie m+w, Skelett m+w, Geist), **Mensch** (Auralithen/Solvaren/Kessari/Umbrakin/Verdani m+w). Restliche Völker noch stilisiert.
