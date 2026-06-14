# Web Home

Extension Chrome qui remplace le nouvel onglet par une page d'accueil personnalisable.

---

## Fonctionnalités

### Widgets

| Widget | Description |
|---|---|
| **Horloge** | Heure en temps réel |
| **Météo** | Météo locale |
| **Recherche** | Barre de recherche |
| **Liens rapides** | Raccourcis personnalisables |
| **Notes** | Bloc-notes persistant |
| **Timer Pomodoro** | Minuteur Pomodoro |
| **Todo** | Liste de tâches |
| **Raccourcis** | Grille de favoris |
| **Flux RSS** | News |

### Disposition

- **Mode disposition** : réorganiser et redimensionner les widgets librement sur une grille de 128 colonnes
- **Masquer/afficher** des widgets individuellement
- **Sauvegarder** une disposition personnalisée
- **Mode focus** : masque tous les widgets secondaires

### Apparence

5 thèmes de couleur :

| Thème | Accent |
|---|---|
| Cyan (défaut) | `#00cfff` |
| Magenta | `#ff00aa` |
| Vert | `#00ff88` |
| Ambre | `#ffaa00` |
| Rouge | `#ff0044` |

6 fonds animés :

- **Grille** — grille de points
- **Particules** — nuage de particules
- **Circuit** — tracés électroniques avec impulsions lumineuses
- **Topographie** — lignes avec effet horizon
- **Scanlines** — effet CRT avec glitch
- **Réseau neuronal** — nœuds connectés en mouvement

### Import / Export

- **Exporter** : sauvegarde toute la configuration en JSON (disposition, thème, widgets, flux RSS…)
- **Importer** : restaure une configuration depuis un fichier JSON

---

## Installation manuelle

> Aucun compte requis, fonctionne hors-ligne (sauf météo et RSS).

1. Télécharger le zip de la [dernière release](../../releases)
2. Extraire dans un dossier
3. Ouvrir `brave://extensions` (ou `chrome://extensions`)
4. Activer le **Mode développeur**
5. Cliquer **Charger l'extension décompressée** → sélectionner le dossier extrait
6. Dans Paramètres → Apparence → **Page Nouvel onglet** → choisir **Web Home**

---

## Développement

### Prérequis

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Lancer en local

```bash
npm run dev
```

Ouvre `http://localhost:5173` dans le navigateur.

### Build

```bash
npm run build
```

Génère le dossier `extension/` prêt à charger dans Brave.

### Packager (zip)

```bash
npm run package
```

Génère `dist/web-home-v{version}.zip`.

### Enregistrer sa config comme défaut

```bash
# 1. Exporter sa config via le bouton EXPORT dans l'extension
# 2. Injecter comme défaut
npm run set-defaults -- chemin/vers/export.json
# 3. Rebuilder
npm run package
```

Les nouveaux utilisateurs démarreront avec cette configuration.

---

## Stack technique

- **Vite** - bundler
- **Gridstack.js** — grille de widgets drag & drop
- **Canvas API** — effets de fond animés
- **Manifest V3** — format d'extension Brave/Chrome
- Vanilla JS/CSS — aucun framework frontend

---

## Permissions

| Permission | Utilisation |
|---|---|
| `geolocation` | Météo locale |
| `host_permissions: <all_urls>` | Chargement des flux RSS depuis n'importe quel domaine |
