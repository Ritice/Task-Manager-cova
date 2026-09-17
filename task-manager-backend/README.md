# Task Manager - Backend (Spring Boot)

API REST pour l'application de gestion de tâches (Task Manager), développée avec
**Spring Boot 3**, **Spring Data JPA**, **Spring Security (JWT)** et **MySQL**.

## Architecture

```
src/main/java/com/taskmanager
├── config/            # Sécurité (SecurityConfig, filtre JWT)
├── security/          # JwtService, CustomUserDetailsService
├── entity/            # User, Task, TaskStatus
├── repository/        # UserRepository, TaskRepository
├── specification/     # Filtrage dynamique des tâches (statut + recherche)
├── dto/                # Objets d'échange (requêtes / réponses)
├── service/            # Logique métier (AuthService, TaskService)
├── controller/         # Endpoints REST
└── exception/          # Gestion centralisée des erreurs
```

**Choix techniques :**
- **JWT stateless** : aucune session côté serveur, le token est vérifié à chaque requête via un filtre (`JwtAuthenticationFilter`).
- **Spring Data JPA Specifications** pour combiner dynamiquement filtre par statut et recherche texte (titre/description) sans multiplier les méthodes de repository.
- **BCrypt** pour le hachage des mots de passe.
- **Gestion d'erreurs centralisée** (`@RestControllerAdvice`) renvoyant un format JSON homogène.
- Les tâches sont toujours scopées à l'utilisateur authentifié (vérification de propriété avant update/delete → 403 sinon).

## Endpoints

| Méthode | Endpoint              | Description                          | Auth requise |
|---------|-----------------------|---------------------------------------|--------------|
| POST    | `/api/auth/register`  | Inscription                           | Non          |
| POST    | `/api/auth/login`     | Connexion (retourne un JWT)           | Non          |
| GET     | `/api/tasks`          | Liste des tâches (filtres possibles)  | Oui          |
| POST    | `/api/tasks`          | Créer une tâche                       | Oui          |
| PUT     | `/api/tasks/{id}`     | Modifier une tâche                    | Oui          |
| DELETE  | `/api/tasks/{id}`     | Supprimer une tâche                   | Oui          |

Filtres disponibles sur `GET /api/tasks` :
- `?status=TODO|IN_PROGRESS|DONE`
- `?search=motclé` (cherche dans le titre et la description)
- Combinables : `/api/tasks?status=TODO&search=rapport`

Pour les routes protégées, ajouter l'en-tête :
```
Authorization: Bearer <token>
```

## Exemples de requêtes

**Inscription**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jean Dupont","email":"jean@test.com","password":"secret123"}'
```

**Connexion**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean@test.com","password":"secret123"}'
```

**Créer une tâche**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Préparer le rapport","description":"Rapport mensuel","status":"TODO"}'
```

**Lister les tâches avec filtre**
```bash
curl "http://localhost:8080/api/tasks?status=TODO&search=rapport" \
  -H "Authorization: Bearer <TOKEN>"
```

## Installation et exécution

### Option 1 : Avec Docker Compose (recommandé)

```bash
docker-compose up --build
```
L'API sera disponible sur `http://localhost:8080`, MySQL sur le port `3306`.

### Option 2 : En local (MySQL déjà installé)

1. Créer la base de données :
```sql
CREATE DATABASE taskmanager;
```

2. Configurer les variables d'environnement (ou modifier `application.yml`) :
```bash
export DB_USERNAME=root
export DB_PASSWORD=root
export JWT_SECRET=<votre_secret_base64>
```

3. Lancer l'application :
```bash
./mvnw spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

## Variables d'environnement

| Variable         | Description                          | Valeur par défaut |
|------------------|---------------------------------------|--------------------|
| `DB_HOST`        | Hôte MySQL                            | localhost           |
| `DB_PORT`        | Port MySQL                            | 3306                 |
| `DB_NAME`        | Nom de la base                        | taskmanager          |
| `DB_USERNAME`    | Utilisateur MySQL                     | root                  |
| `DB_PASSWORD`    | Mot de passe MySQL                    | root                  |
| `JWT_SECRET`     | Clé secrète JWT (Base64, HS256)       | valeur par défaut fournie (à changer en prod) |
| `JWT_EXPIRATION` | Durée de validité du token (ms)       | 86400000 (24h)        |

⚠️ **En production**, changez impérativement `JWT_SECRET` par une valeur générée aléatoirement, par exemple :
```bash
openssl rand -base64 64
```

## Prochaines étapes (frontend / mobile / CI-CD)

Ce backend expose une API prête à être consommée par :
- le frontend **React + Vite + TypeScript**,
- l'application **Flutter** (bonus),
- un pipeline **CI/CD** (GitHub Actions) buildant l'image Docker et déployant sur **GCP Cloud Run**.
