# 🌀 Neon Park – Spieler-Seite (Test)

Begleit-Seite für Testabende des Fantasy-Rollenspiels **Neon Park**: Charakter erstellen, würfeln, Aktionen als Chat-Text kopieren, Spielstand der Spielleitung einlesen.

- **Fan- und Testprojekt**, nicht kommerziell, eine einzige HTML-Datei ohne externe Abhängigkeiten.
- **Deine Daten bleiben lokal in deinem Browser** (localStorage). Es gibt keinen Server, kein Konto, kein Tracking, keine Cookies. Spielstände kannst du selbst als Datei exportieren.
- Bitte nur Fantasy-Namen verwenden und keine echten Daten eintragen. Spieltische ab 18.
- Alle Figuren, Orte und Bilder sind frei erfunden.

▶️ Seite öffnen: siehe Link in der Repo-Beschreibung (GitHub Pages).

## 🔮 App-Runde mit Neon Omina (Spielleiter im Gerät)

Neon Omina kann jetzt auch **direkt im Browser** erzählen – regelbasiert, **ohne KI-Dienst, ohne API, ohne Kosten**.

- **Schnelles / Langes Spiel:** Beim Start der App-Runde wählst du **⚡ Schnelles Spiel** (3 zufällige Kurz-Quests aus dem Pool in `kampagne.json` → eine wählen → Gruppe/Bots → Start) oder **📜 Langes Spiel** (volle Kampagne „Funkenflug…“, bisheriger Ablauf).
- **Erzähl-Engine:** Szenen, Ziele, Optionen, Zufallsbegegnungen und Stimmungstexte stehen in `kampagne.json` (Kampagne „Funkenflug über der Neon Plaza“, 7 Szenen + Epilog, 6 Begegnungen). Proben: W20 + Wert-Modifikator (+1, wenn die Probe zum Hauptwert der Klasse passt) gegen SW → ✅ Erfolg / ◐ Teilerfolg (bis 4 darunter) / ✖ Fehlschlag. Konsequenzen: TP, Funde, Rückenwind, Fortschritt. Bei 0 TP setzt eine Figur eine Runde aus – niemand wird ernsthaft verletzt. Neue Kampagnen = neue JSON-Datei im gleichen Format.
- **KI-Mitspieler (Testphase):** „🤖 Gruppe mit KI-Spielern auffüllen“ füllt bis zur 5er-Gruppe auf: Paulov 🐸, Hira'kka 🪕, Vigilis 🦂, Y'all 🐊, Fixxy 🔧, Captain Chad Erics 🧭 – je mit Volk, Klasse, Farbe und Persönlichkeit. Sie wählen Aktionen nach Werten + Vorlieben und sagen kurze Sätze. Mit ✖ entfernbar. Reine Regeln, kein Internet.
- **Activities:** Tab 📍 *Aktueller Stand* (Szene, Ort, Runde, wer dran ist, Meine Figur, HP/Status, Inventar, Ziele) und Tab 📜 *Historie* (komplettes Protokoll nach Szene/Runde, Erzähler/Figuren mit eigener Farbe **plus** Symbol und Name, Würfe als Würfelkästchen mit Ergebnis-Label, Filter nach Figur, nur Würfe, Export als Text oder JSON).
- **Mehrspieler:** „🌐 Online-Tisch öffnen“ macht das Host-Gerät zur Quelle der Wahrheit (würfelt, erzählt, steuert die KI). Andere treten mit dem 5-stelligen Tisch-Code oder dem Link `…#mp=CODE` bei und sehen alles live. Verbindung per WebRTC direkt zwischen den Geräten (PeerJS, Bibliothek liegt in `vendor/`). Zum Finden der Geräte wird der **kostenlose öffentliche PeerJS-Vermittlungsserver** (0.peerjs.com) genutzt, ggf. dessen STUN/TURN – er sieht Tisch-Code und IP-Adresse, keine Spielinhalte. Übertragen werden nur Figurname, Volk, Klasse, Werte, Standard-Avatar und Startinventar – keine eigenen Bilder, kein Konto.
- **Fallback ohne Server:** „📤 Ohne Internet teilen“ – Spielstand-Code (`NPR1:…`) oder `.json`-Datei. Andere können ihn **ansehen** oder **übernehmen & weiterspielen** (Hot-Seat). Hot-Seat geht auch direkt: „🪑 Mitspieler an diesem Gerät“.
- Alles wird lokal gespeichert (localStorage `neonpark-runde-v1`). Die bisherige Chat-Spielweise mit NP1-Codes bleibt unverändert.

**Grenzen:** Der Host muss die Seite offen lassen; lädt er neu, öffnet er den Tisch erneut (gleicher Code) und Gäste tippen „🔄 Neu verbinden“. In sehr strengen Firmen-/Mobilnetzen kann WebRTC scheitern → dann Code/Datei oder Hot-Seat. Der kostenlose PeerJS-Server hat keine Verfügbarkeitsgarantie. Die Erzählung ist vorgeschrieben + zufällig kombiniert, keine freie Improvisation wie im Chat.

## Design (Neon Park)
Synthwave-/Cyber-Fantasy-UI: Magenta `#FF2BD6`, Cyan `#00E5FF`, Indigo `#7B2CFF` / Hintergrund `#2A0A4A`. Spielname „Neon Park“.

**Hintergrund (Neon Park):** Das Hochformat-Poster (`assets/neon-park-poster.webp`, 1200×2133, ~505 KB; Original `assets/neon-park-poster.jpg`) liegt als feste Bildebene hinter allen Seiten (cover, oben zentriert) mit dunklem Overlay für Lesbarkeit – auf Handys gleichmäßig dunkler, am Desktop hinter der Inhaltsspalte dunkler und an den Rändern heller. Titelbildschirm: Poster als Kulisse (ohne zusätzliches Logo). Dezenter Parallax nur am Desktop; aus bei „Bewegung reduzieren“. Bei „Mehr Kontrast“ wird das Overlay fast deckend. Altes Graffiti (`assets/neon-park-graffiti.webp`) bleibt im Repo, wird aber nicht mehr geladen.
