# Neon Park – Backup

## Was schon gesichert ist
- **GitHub** (`moyolenkins-lgtm/neon-park-spieler`): jede gepushte Version. Das ist die Haupt-Historie für Code und Web-Assets.
- **Live:** https://moyolenkins-lgtm.github.io/neon-park-spieler/

## Ordner hier
| Ordner | Inhalt |
|--------|--------|
| `backups/releases/` | Datierte Snapshots (tar.gz) von App-Stand vor großen Änderungen |
| `backups/assets-orig/` | Originale (Logo/Poster), die zu groß für Pages sind |
| `backups/local-saves/` | Platz für exportierte Spielstände (kommen vom Gerät) |

## Spielstände
Bleiben im Browser (`localStorage`). Ohne Export gehen sie bei Cache-Löschung verloren. In der App: Activities → Export, Datei hier ablegen oder privat sichern.

## Snapshot manuell
```bash
./scripts/backup-snapshot.sh
```
