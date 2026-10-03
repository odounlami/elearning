# 7. Déploiement

Le projet est conteneurisé avec trois services : PostgreSQL, API et frontend.

`docker compose up --build` construit les deux images applicatives et démarre PostgreSQL. Le backend attend que la base soit saine avant de lancer Prisma et l'application.

Le frontend est servi par Nginx avec un fallback vers `index.html` pour permettre le fonctionnement du routing Angular.
