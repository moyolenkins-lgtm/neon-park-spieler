# 🔑 Hex-Gate & Würfel-Specials (X3, 2026-10-05)

**Umbenennung:** Der frühere „Key-Pasch 11:11“ heißt jetzt **🔑 Hex-Gate**. Die Mechanik bleibt gleich: Ein **Chain-Roll** (2 W20 gleichzeitig) mit **11:11** öffnet ein Portal in eine andere Welt. Die würfelnde Figur erhält den **🔑 Hex-Gate-Schlüssel** (den Dimensionsschlüssel), und die Gruppe entscheidet gemeinsam, ob sie hindurchgeht.

## Specials an- und ausschalten

Wo? (alle Stellen nutzen dieselbe Einstellung, gespeichert in `localStorage` → `neonpark-wuerfel-v1`)
- **👑 Chat-Tisch vorbereiten** (Host, vor Spielbeginn): Abschnitt „🎲 Würfel-Specials“. Die Auswahl landet automatisch im **Startbefehl für Neon Omina**.
- **🚪 Figur & Beitritt** (Spieler, vor Spielbeginn): aufklappbar „🎲 Specials an/aus“.
- Im Spiel: **⚙️ Mehr → 🎲 Würfel-Specials an/aus**, **📖 Hilfe** und **🧙 Spielleitung**.
- **Synchronisieren:** Im Spielleitungs-Modus enthält der NP1-Spielstand-Code die Zeile
  `🎲 Würfel-Specials: Double Roll an · Lucky & Chaos an · Pasch-Events an · Hex-Gate an · Neon-Echo an · Glimmbruch an · Lumen-Brücke an`.
  Wer den Code unter 📥 einfügt, übernimmt die Einstellung. Neon Omina darf die Zeile ebenfalls in den Code schreiben.

**Standard: alle an** (klassisches Neon-Park-Gefühl). „✅ Alle an“ / „⏸️ Alle aus“ setzen alles auf einmal.

| Schalter | Auslöser | Wirkung | Wenn aus |
|---|---|---|---|
| 🎲 **Double Roll** | Nat 20 oder Nat 1 | Zweiter W20: nach Nat 20 ab 10 = 🎁 Event-Bonus · nach Nat 1 bis 10 = 🌧️ Pech-Event | Kein zweiter Wurf (Nat 20/1 bleibt ein schöner bzw. lustiger Moment). Neon-Echo, Glimmbruch sowie Lucky & Chaos sind dann ebenfalls aus. |
| 🍀 **Lucky & Chaos** *(braucht Double Roll)* | zweiter Wurf 20 bzw. 1 | 🍀 Lucky Event bzw. 🌀 Chaos Event | zählt als Event-Bonus bzw. Pech-Event |
| 🎭 **Pasch-Events** | Chain-Roll, gleiche Zahl | Event aus der Pasch-Tabelle (W20) | Nur Zahlen, Neon entscheidet |
| 🔑 **Hex-Gate** | Chain-Roll **11:11** | Portal + 🔑 Hex-Gate-Schlüssel (Inventar) | 11:11 wird ein normaler Pasch → ✨ *Elfenlicht-Pasch* (Rückenwind für alle) bzw. nichts, wenn auch die Pasch-Events aus sind |
| 🌟 **Neon-Echo** · NEU *(braucht Double Roll)* | Nat 20 → zweiter Wurf **genau 11** | Das Hex-Gate flackert kurz: Portal-Vorschau (W4-Tabelle) + **Rückenwind für die ganze Gruppe** (Knopf „🌬️ Rückenwind bei mir eintragen“). Schwächer als das Hex-Gate. | normaler 🎁 Event-Bonus |
| 🫧 **Glimmbruch** · NEU *(braucht Double Roll)* | Nat 1 → zweiter Wurf **genau 11** | Die Welt glitcht kurz – seltsam, harmlos, oft mit kleinem Vorteil (W6-Tabelle) statt eines Patzers | normaler Patzer |
| 🌉 **Lumen-Brücke** · NEU | Chain-Roll mit **Summe 22**, ohne Pasch (z. B. 2+20, 9+13) | Eine Lichtbrücke spannt sich: Rückenwind auf die nächste Gruppenprobe oder eine Abkürzung (Neon entscheidet) | „Kein Pasch“ (höhere Zahl / Summe) |

### Wahrscheinlichkeiten (grob)
- Hex-Gate: 1/400 = 0,25 % je Chain-Roll
- Lumen-Brücke: 18/400 = 4,5 % je Chain-Roll
- Neon-Echo / Glimmbruch: je 1/20 der Nat-20- bzw. Nat-1-Folgewürfe ≈ 0,25 % je Probe

### Neue Tabellen
**🌟 Neon-Echo (W4):** 1 🌀 Blick durchs Schlüsselloch · 2 🎶 Musik von drüben · 3 ✉️ Post von nebenan · 4 👋 Jemand winkt zurück
**🫧 Glimmbruch (W6):** 1 🎨 Farbdreher · 2 🔊 Hall-Stimme · 3 🦋 Pixel-Falter · 4 ⏪ Mini-Rückspulen · 5 🪶 Leichtgewicht · 6 🧩 Doppelgänger-Flackern

Volltexte: `index.html` (`EVT.echo`, `EVT.glimm`, `EVT.bruecke`, `EVT.pasch11`) und `event-tabellen.md` im RPG-Ordner.

### Ideen für später (nicht umgesetzt)
- 🌗 *Twinlight* (7:7 als sanfte Vision) – kollidiert mit dem Pasch „Siebenfarben“
- 🪞 *Spiegelwurf* (Pasch bei Rückenwind/Gegenwind-Proben)

### Grenzen
- Gilt für die **Chat-Tisch-Spielerseite** (Double Roll, Chain-Roll). Die 🔮 **App-Runde** nutzt eigene, vereinfachte Würfe (Nat 20 = Rückenwind) und kennt diese Schalter noch nicht.
- Die Einstellung gilt pro Gerät. Der Abgleich läuft über Ansage, Startbefehl oder NP1-Code; es gibt keinen Live-Server.
- Alte Spielstände mit „Dimensionsschlüssel 11:11“ im Inventar bleiben unverändert gültig.
