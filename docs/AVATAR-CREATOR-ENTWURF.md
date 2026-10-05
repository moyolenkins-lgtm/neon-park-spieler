# Avatar-Creator Entwurf · Neon Park

Stand: 2026-10-05 · lokale Entwürfe, 0 € · kein Posten

## Ziel

Spieler basteln einen kleinen 2D-Avatar (Paper-doll) statt nur Standard-Portrait.  
Stil-Ref: Clean 2D Top-down/¾ (Hades/Diablo-Mobile-ähnlich) — dunkelhäutige Elfe möglich, Neon Pink/Cyan/Lila, Streetwear + Fantasy, rundes Portrait **und** Sprite von hinten/oben.

## Stil-Referenz

- Quelle (kopiert): `assets/refs/avatar-style-ref.png`
- Palette (bestehend): Magenta `#FF2BD6`, Cyan `#00E5FF`, Indigo `#7B2CFF`, BG `#2A0A4A`, Gold UI `#FFD34D`

## Entwürfe (PNGs)

Pfad-Prefix: `/workspace/neon-park-spieler-shots/`

| Datei | Inhalt |
|-------|--------|
| `v-avatar-draft-01-moodboard.png` | Stil-Ref-Crop + Neon-Park-Palette + Stil-Regeln |
| `v-avatar-draft-02-paperdoll-layers.png` | Layer-Stack Schema (Körper→Haar→Augen→Outfit→Klasse→Prop) |
| `v-avatar-draft-03-creator-ui-mock.png` | Handy-Mock 390×844: Preview + Optionen Haar/Outfit/Klasse |
| `v-avatar-draft-04-beispiel-avatare.png` | 3 Beispiele: Krieger (Ork), Barde (Elf), Ingenieur (Gnom) |
| `v-avatar-draft-05-portrait-sprite.png` | Gleiche Figur: Portrait-Kreis + Body-Sprite |
| `v-avatar-draft-06-voelker-silhouetten.png` | Völker-Andeutungen (Mensch…Gnom), ohne Franchise-Look |

> **Hinweis:** GenerateImage (cursor) und Superdesign waren in dieser Session nicht verfügbar. Die PNGs sind **schematische Wireframe-/Konzept-Entwürfe** (PIL), keine finales Pixel-Art. Artstyle-Nähe zur Stil-Ref ist bewusst grob — Layout, Layer-Logik und UI-Flow stehen im Vordergrund.

## Layer-Modell (Paper-doll)

```
avatar = {
  volk,        // Silhouette / Ohren / Proportionen
  skin,        // Hautton-ID
  hairStyle,   // Wellen | Kurz | Zopf | Afro | …
  hairColor,   // Palette-ID (Pink/Cyan/Lila/…)
  eyes,        // Iris-Farbe
  outfit,      // Jumpsuit | Jacke | Robe | Panzer
  classAccent, // Krieger-Gold | Barde-Cyan | Ingenieur-Pink | …
  prop         // Schild | Laute | Schraubenschlüssel | …
}
```

Composite lokal:

1. **Canvas 2D:** `drawImage` je Layer in fester Reihenfolge (Portrait-Canvas + Sprite-Canvas).
2. **SVG `<g>`:** gleiche IDs, CSS/`currentColor` für Akzente — passt zu den bestehenden data-URI-SVG-Avataren in `index.html`.

Export-Alpha: Portrait **128×128 PNG** (wie heutige Avatar-Pipeline) + optional Sprite 64×96; Layer-IDs in `localStorage` (`neonpark-avatar-layers-v1`).

## Machbarkeit Alpha (ohne Server)

| Feature | Live ohne Server? | Wie |
|---------|-------------------|-----|
| Layer wählen & live Preview | ✅ | Canvas/SVG im Browser |
| Speichern lokal | ✅ | `localStorage` + optional PNG-Export (bestehend: `np-avatar-…`) |
| Mitspieler sehen gebauten Avatar | ◐ | Nur wenn PNG/Layer-Code geteilt wird; Online-Tisch überträgt heute **Standard-Avatar-ID**, keine Eigenbilder |
| Viele hochwertige Pixel-Layer | ❌ Alpha | Braucht Art-Assets; Start mit **SVG-Presets** oder wenigen PNG-Atlanten |
| KI-generierte Uniques | ❌ (0 € / offline) | Nicht im Alpha; Stil-Drift + Kosten |

Was **heute schon** da ist und anschlussfähig bleibt:

- SVG-Kreis-Avatare (`AV` in `index.html`)
- Eigenes Bild lokal (`IMG`, Share-PNG mit Text-Chunk)
- Völker + Klassen (Ober/Unter) inkl. Barde & Ingenieur unter Kreativist

## Empfehlung

**Alpha: hybrides Modell**

1. **Fertige Presets (5–8)** als sichere Defaults (wie jetzt) — schnelles „Fertig“.
2. **Canvas/SVG Paper-doll** darüber: Haarfarbe, Outfit-Akzent, Klassen-Prop, Hautton — begrenzte Kombis (z. B. 4×6×4×5 ≈ handhabbar).
3. **Nicht** Alpha: freies Upload als einziges Gesicht für alle Mitspieler (Privacy + Größe + Sync); Upload bleibt lokal wie bisher.

**Warum nicht nur Presets?** Ziel ist „basteln“.  
**Warum nicht reines Paper-doll mit Dutzenden Pixel-Layern?** Zu viel Art-Arbeit vor dem UI-Beweis; SVG-Schichten beweisen den Flow in Tagen.

Nächster technischer Schritt (Vorschlag):

1. Mini-Wizard-Schritt „Avatar basteln“ nach Volk/Klasse.
2. 1 Basis-Körper + 3 Haar-SVG + 3 Outfit-Akzente + 3 Props als Layer.
3. Composite → `IMG`/data-URI 128²; `avatarLayers` im Figuren-Objekt mitspeichern.
4. Online-Tisch: später optional Layer-JSON statt nur `av`-ID (klein, textuell).

## Grenzen

- **Artstyle-Nähe:** KI-Bilder und grobe PIL-Mockups treffen den Ref-Stil (saubere Outlines, Volumen-Haar, Stoff-Falten) nicht zuverlässig. Für Produktion: 1 Artist-Pass oder handgezeichnete Atlanten.
- **Copyright:** Völker nur andeuten (Ohren, Proportion, Haut) — keine Franchise-Kostüme/Ikonen.
- **Perspektive:** Portrait frontal ≠ Sprite ¾-Rücken — zwei Layer-Sets oder getrennte Atlanten nötig.
- **Sync:** PeerJS-Tisch ohne Bild-Upload → gebaute Avatare nur lokal, bis Layer-IDs mitgeschickt werden.

## Kurz-Fazit

Layout und Layer-Logik sind alpha-tauglich **lokal mit Canvas/SVG**. Visuelle Endqualität braucht Asset-Arbeit; die Entwürfe hier sind UI-/System-Mockups, kein finaler Art-Drop.
