r# Task Manager - Frontend (React + Vite + TypeScript)

Interface web du Task Manager, consommant l'API Spring Boot (`task-manager-backend`).

## Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** (configuration CSS-first, via `@tailwindcss/vite`)
- **react-router-dom** pour le routage et la protection des routes
- **axios** pour les appels API, avec intercepteurs (JWT + gestion centralisée des erreurs)

## Fonctionnalités

- Inscription / connexion (formulaires validés, erreurs de champ affichées)
- Stockage du token JWT en `localStorage`, injecté automatiquement dans chaque requête
- Déconnexion automatique + toast si le token expire (réponse 401)
- Tableau de tâches en 3 colonnes (À faire / En cours / Terminé) ou vue filtrée par statut
- Recherche texte (titre + description), avec debounce
- Création / édition (modal) / suppression (confirmation) des tâches
- Notifications toast pour chaque action (succès / erreur)
- Design "registre" dédié : typographie Fraunces + Inter, palette sauge/moutarde, lignes de séparation façon papier réglé plutôt que cartes à ombres génériques

## Structure

```
src/
├── api/            # client axios + appels register/login/tasks
├── components/
│   ├── layout/     # Navbar, ProtectedRoute, GuestRoute, AuthLayout
│   ├── tasks/      # StatusFilter, SearchBar, TaskBoard, TaskCard, TaskFormModal
│   └── ui/         # Button, Input, Textarea, Spinner, ConfirmDialog
├── context/        # AuthContext, ToastContext
├── pages/          # LoginPage, RegisterPage, TasksPage
├── types/          # types partagés (Task, User, ...)
└── utils/          # storage.ts (accès localStorage)
```

## Installation

```bash
npm install
cp .env.example .env   # ajuster VITE_API_URL si besoin
npm run dev
```

L'application démarre sur `http://localhost:5173` et attend le backend sur
`http://localhost:8080/api` (configurable via `VITE_API_URL`).

## Variables d'environnement

| Variable        | Description                          | Défaut                        |
|-----------------|----------------------------------------|--------------------------------|
| `VITE_API_URL`  | URL de base de l'API Spring Boot       | `http://localhost:8080/api`    |

## Scripts

| Commande         | Description                          |
|-------------------|----------------------------------------|
| `npm run dev`      | Lance le serveur de développement     |
| `npm run build`    | Vérifie les types (tsc) puis build de prod |
| `npm run preview`  | Sert le build de prod localement      |

## Notes techniques

- Le token JWT est ajouté à chaque requête via un intercepteur axios ; une réponse `401`
  déclenche une déconnexion automatique et un toast d'information.
- Le filtrage par statut est disponible sous deux formes : vue "Tout" (tableau en 3
  colonnes) ou vue filtrée sur un statut précis (liste unique). La recherche s'applique
  dans les deux cas et interroge directement l'API (`GET /api/tasks?status=...&search=...`).
- Les erreurs de validation renvoyées par le backend (400, `fieldErrors`) sont affichées
  sous le champ concerné sur le formulaire d'inscription.
