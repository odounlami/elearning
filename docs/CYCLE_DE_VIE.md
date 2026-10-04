# Cycle de vie du projet

## 1. Analyse du besoin

L'objectif était de développer en 72 heures une mini plateforme e-learning permettant à un utilisateur de créer un compte, se connecter, consulter des formations, suivre leurs modules et visualiser sa progression.

Fonctionnalités retenues : inscription et connexion, catalogue, recherche par titre ou formateur, filtres par langue et niveau, détail d'une formation, lecteur vidéo et audio, progression, bibliothèque personnelle, favoris et navigation automatique vers le module suivant.

Le jeu de données de démonstration a été volontairement enrichi afin de rendre visibles la recherche, les filtres, la pagination, les favoris et la progression dans le délai imparti.

## 2. Conception

Le parcours principal est : découvrir une formation, consulter son détail, s'inscrire ou se connecter, ajouter la formation à sa bibliothèque, suivre les modules, valider sa progression puis reprendre la formation depuis sa bibliothèque.

Les principaux écrans sont l'accueil, le catalogue, le détail d'une formation, la connexion, l'inscription, le lecteur et la bibliothèque personnelle.

La direction visuelle a été conçue autour d'un univers éditorial et de bibliothèque : fond papier/crème, typographies de lecture, structure brune et accents orange. L'interface a ensuite été ajustée pendant les tests.

Le modèle fonctionnel repose sur une formation contenant plusieurs modules ordonnés. Les modules terminés sont enregistrés par utilisateur pour calculer la progression. Plusieurs pistes audio peuvent être associées à un même module afin de simuler le doublage multilingue demandé.

## 3. Architecture et choix techniques

### Vue d'ensemble

```
Angular + Tailwind CSS
          │
          ▼
Express + TypeScript
          │
          ▼
      Prisma
          │
          ▼
      PostgreSQL
```

En production, le frontend est hébergé séparément de l'API et la base PostgreSQL est hébergée sur un service dédié.

### Frontend

Angular a été choisi pour son architecture par composants, son routing, ses services et ses guards. Tailwind CSS permet de mettre en œuvre rapidement le design system défini pour le projet.

### Backend

Express et TypeScript permettent de construire une API REST légère, structurée et typée, adaptée au périmètre du projet.

### Base de données

PostgreSQL a été retenu pour gérer les relations entre utilisateurs, formations, modules et progression. Prisma fournit un accès typé à la base.

Les principales entités sont : `User`, `Course`, `Module`, `AudioTrack`, `Enrollment`, `ModuleCompletion` et `Favorite`.

### Authentification

L'API utilise des tokens JWT. Les routes protégées sont contrôlées par un middleware d'authentification et les pages privées par un guard Angular.

### Docker

Docker Compose permet de lancer le frontend, l'API et PostgreSQL dans un environnement reproductible. Le démarrage initialise le schéma et les données de démonstration.

## 4. Développement

Le développement a été réalisé progressivement, en partant de la conception de l'interface puis en reliant les écrans aux fonctionnalités backend.

Le code est séparé entre pages et composants Angular, services frontend, authentification, routes et services API, modèles Prisma et seed de démonstration.

Une attention particulière a été portée aux états de chargement et aux erreurs. La progression est calculée à partir des modules terminés et le lecteur empêche l'accès direct à un module verrouillé.

## 5. Tests et validation

La validation a principalement été réalisée par des tests fonctionnels manuels au fur et à mesure du développement.

Les principaux parcours vérifiés sont :

- inscription, connexion et déconnexion ;
- accès aux pages protégées ;
- recherche et filtrage du catalogue ;
- consultation et inscription à une formation ;
- lecture vidéo, pistes audio et sous-titres ;
- validation d'un module et passage automatique au suivant ;
- calcul de la progression ;
- bibliothèque et favoris.

Le projet a également été construit et exécuté avec Docker Compose. La version déployée a été vérifiée avec le frontend, l'API et la base de production.

Les tests automatisés restent limités dans le délai de 72 heures.

## 6. Sécurité

Plusieurs mesures ont été mises en place :

- mots de passe hashés avec bcrypt ;
- tokens JWT signés avec une clé secrète provenant des variables d'environnement ;
- expiration des tokens ;
- middleware pour les routes privées ;
- validation des entrées avec Zod ;
- secrets de production non versionnés ;
- CORS configuré par variable d'environnement ;
- vérification de l'inscription avant l'enregistrement de la progression.

## 7. Déploiement

En local, l'ensemble de la plateforme peut être lancé avec :

```bash
docker compose up --build
```

La production utilise Vercel pour le frontend, Render pour l'API Express et Supabase pour PostgreSQL.

Cette séparation permet de déployer indépendamment l'interface, l'API et la base de données tout en conservant une architecture simple.

## 8. Retour d'expérience

Le principal enjeu a été de trouver un équilibre entre le périmètre demandé, la qualité de l'interface et le délai de 72 heures.

Les principales difficultés rencontrées ont concerné la base PostgreSQL en production, l'initialisation Prisma sur Render, la configuration CORS entre le frontend et l'API, les états de chargement, la progression du lecteur et la gestion des médias.

Ces problèmes ont été traités progressivement par des tests locaux puis des vérifications en production.

## 9. Limites et améliorations futures

Les principales améliorations prévues sont :

- optimiser les requêtes API et réduire les données récupérées inutilement ;
- regrouper certaines requêtes afin de diminuer la latence ;
- renforcer les tests automatisés ;
- utiliser des médias distincts pour chaque module ;
- ajouter les bonus restants, notamment les quiz et une administration plus complète.

L'optimisation des performances reste une priorité : certaines pages effectuent encore plusieurs requêtes pour récupérer des informations complémentaires. Une évolution future consisterait à regrouper ces données côté API et à mieux exploiter le cache côté frontend.

## Méthode de travail

Ce projet a été réalisé avec l'assistance d'un outil d'IA (GPT). J'ai conçu l'application, pris les décisions techniques, puis relu, testé et corrigé le code.
