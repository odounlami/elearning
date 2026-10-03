# Level Up — Mini plateforme e-learning

Mini plateforme e-learning réalisée dans le cadre du Home Project.

## Fonctionnalités

- inscription, connexion, déconnexion et session JWT ;
- catalogue avec recherche par titre ou formateur et filtres langue/niveau ;
- détail d'une formation et liste des modules ;
- lecteur vidéo avec sélection de piste audio ;
- progression, validation d'un module et passage au suivant ;
- tableau de bord des formations suivies ;
- protection des médias pour les utilisateurs inscrits à la formation.

## Stack

- **Frontend** : Angular 22 + Tailwind CSS v4
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL + Prisma 7
- **Authentification** : JWT
- **Conteneurisation** : Docker Compose

## Architecture

```
frontend/  -> application Angular
api/       -> API Express + Prisma
db         -> PostgreSQL
```

## Lancer avec Docker

Prérequis : Docker avec Compose.

```bash
docker compose up --build
```

Puis ouvrir **http://localhost:8080**.

L'API est disponible sur **http://localhost:3000/health**.

Au premier démarrage, le backend pousse le schéma Prisma et charge les formations de démonstration. Le seed est idempotent et ne réinitialise pas une base déjà alimentée.

Pour repartir de zéro :

```bash
docker compose down -v
docker compose up --build
```

## Lancer sans Docker

### API

Copier `api/.env.example` vers `api/.env`, puis :

```bash
cd api
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Tests

```bash
cd frontend
npm test -- --watch=false
```

Le plan de tests fonctionnels et les cas principaux sont décrits dans `docs/05-tests.md`.

## Documentation

Le cycle de développement est documenté dans `docs/` : analyse, conception, architecture, développement, tests, sécurité, déploiement et retour d'expérience.

## Périmètre

Le doublage multilingue est simulé avec deux pistes audio pour le même contenu, conformément au sujet. Les sous-titres, quiz, favoris et administration sont volontairement hors périmètre principal car ils figurent dans les bonus.
