# Level Up  Mini plateforme e-learning

Mini plateforme e-learning réalisée dans le cadre du Home Project.

## Fonctionnalités

- inscription, connexion, déconnexion et session JWT ;
- catalogue avec recherche par titre ou formateur et filtres langue/niveau ;
- détail d'une formation et liste des modules ;
- lecteur vidéo avec sélection de piste audio et sous-titres ;
- progression, validation d'un module et passage automatique au suivant ;
- bibliothèque personnelle avec tri, filtres et pagination ;
- favoris ;
- protection des routes et du contenu lié à l'apprentissage.

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

Au premier démarrage, le backend pousse le schéma Prisma et charge les formations de démonstration.

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

La validation fonctionnelle et les principaux cas testés sont documentés dans [docs/CYCLE_DE_VIE.md](docs/CYCLE_DE_VIE.md).

## Documentation

Le cycle de développement est documenté dans [docs/CYCLE_DE_VIE.md](docs/CYCLE_DE_VIE.md) : analyse, conception, architecture, développement, tests, sécurité, déploiement et retour d'expérience.

## Démonstration

- Frontend : https://elearning-kappa-one.vercel.app
- API : https://elearning-05hx.onrender.com

## Périmètre

Le doublage multilingue est simulé avec plusieurs pistes audio pour le même contenu, conformément au sujet. Des bonus comme les sous-titres et les favoris ont également été intégrés lorsque le temps le permettait.
