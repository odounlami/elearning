# 3. Architecture et choix techniques

Le frontend Angular est séparé de l'API Express. PostgreSQL conserve les utilisateurs, formations, inscriptions, pistes audio et validations de modules.

Angular a été retenu pour construire une interface structurée avec composants standalone, routing et services HTTP. Express permet de garder une API légère et explicite. Prisma fournit le modèle de données et l'accès PostgreSQL.

Le frontend consomme l'API via un service centralisé et un interceptor ajoute le JWT aux requêtes authentifiées. Les routes sensibles sont protégées côté frontend et backend.
