# Cycle de vie du projet

## 1. Analyse du besoin

L'objectif était de développer en 72 heures une mini plateforme e-learning permettant à un utilisateur de créer un compte, se connecter, consulter des formations, suivre leurs modules et visualiser sa progression.

Le périmètre fonctionnel retenu couvre :
- inscription, connexion, déconnexion et session ;
- catalogue avec recherche par titre ou formateur ;
- filtres par langue et niveau ;
- détail d'une formation et accès à ses modules ;
- lecteur vidéo avec pistes audio multilingues ;
- sous-titres ;
- validation d'un module et progression ;
- bibliothèque personnelle ;
- favoris.

Le sujet autorisant une simulation du doublage, le choix a été de représenter plusieurs pistes audio pour un même module plutôt que de mettre en place un véritable système de génération ou de synchronisation de doublage.

Le jeu de données de démonstration a été volontairement enrichi au-delà du minimum fonctionnel afin de rendre visibles la recherche, les filtres, la pagination, les favoris et la progression dans le temps imparti de 72 heures. Ce volume ne correspond pas à une exigence métier, mais à un choix de démonstration.

## 2. Conception

### Une approche design avant développement

La conception de l'interface a été réalisée avant le développement fonctionnel afin de fixer une direction visuelle cohérente plutôt que de construire une interface générique puis de la décorer.

L'univers retenu est volontairement éditorial et inspiré d'une bibliothèque : fonds papier/crème, structure brune, typographies de lecture et accents orange/ambre. L'objectif était de donner une identité plus chaleureuse et ludique à l'apprentissage, sans perdre le sérieux nécessaire à une plateforme de formation.

Le design system s'appuie notamment sur :
- `paper` et `paper-deep` pour les surfaces ;
- `ink`, `muted` et `line` pour la hiérarchie visuelle ;
- orange et ambre comme couleurs d'accent ;
- **Lora** pour les titres ;
- **Inter** pour le contenu courant ;
- **DM Mono** pour certains éléments techniques.

Les variantes visuelles des cartes restent limitées aux couleurs du système afin de conserver une cohérence entre l'accueil, le catalogue et le détail d'une formation. Le tableau de bord a également été conçu comme une bibliothèque personnelle plutôt que comme un tableau de bord SaaS rempli de statistiques artificielles.

### Parcours utilisateur

Le parcours principal est : découvrir une formation, consulter son détail, s'inscrire ou se connecter, ajouter la formation à sa bibliothèque, suivre les modules, valider sa progression puis reprendre la formation depuis sa bibliothèque.

Les principaux écrans sont l'accueil, le catalogue, le détail d'une formation, la connexion, l'inscription, le lecteur et la bibliothèque personnelle.

### Modèle fonctionnel

Une formation contient plusieurs modules ordonnés. Chaque module possède une vidéo et peut avoir plusieurs pistes audio. L'inscription d'un utilisateur à une formation est distincte de la validation des modules : les modules terminés sont enregistrés individuellement afin de calculer une progression fiable.

Les favoris sont également modélisés comme une relation utilisateur/formation.

## 3. Architecture et choix techniques

### Comparaison Angular / Next.js

Avant de commencer le développement, Angular et Next.js ont été comparés.

Next.js était une option familière et aurait permis de développer rapidement. Angular a été retenu pour sa structure native (composants, routing, services, guards), adaptée à une application organisée en parcours protégés, et pour garder une séparation claire avec l'API backend.

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

En production, le frontend est déployé séparément de l'API et la base PostgreSQL est hébergée sur un service dédié.

### Frontend

Le frontend utilise Angular 22 et Tailwind CSS v4. Angular fournit les composants, le routing, les services et les guards nécessaires à l'application. Tailwind permet de mettre en œuvre rapidement le système visuel défini pendant la conception.

### Backend

Express avec TypeScript a été retenu pour construire une API REST légère et structurée, adaptée au périmètre du projet.

### Base de données

PostgreSQL a été choisi pour gérer les relations entre utilisateurs, formations, modules et progression. Prisma 7 fournit un accès typé à la base.

Les principales entités sont : `User`, `Course`, `Module`, `AudioTrack`, `Enrollment`, `ModuleCompletion` et `Favorite`.

### Authentification et protection

L'API utilise des tokens JWT. Les mots de passe sont hashés avec bcrypt et les tokens sont signés avec une clé provenant des variables d'environnement. Les routes privées sont protégées côté API par middleware et côté Angular par des guards.

Les données de progression ne peuvent être enregistrées que pour un utilisateur inscrit à la formation concernée.

La gestion des emails réels n'a pas encore été intégrée : l'inscription ne déclenche pas d'email de vérification et le parcours « mot de passe oublié » n'est pas encore disponible. Ces fonctionnalités sont prévues comme évolutions à venir et nécessiteraient notamment un fournisseur d'envoi d'emails, la gestion de modèles et de liens sécurisés à durée limitée.

### Docker

Docker Compose permet de lancer le frontend, l'API et PostgreSQL dans un environnement reproductible. Le démarrage de l'API initialise le schéma Prisma et les données de démonstration.

## 4. Développement

Le développement a été réalisé progressivement : conception de l'interface, construction des écrans, mise en place de l'API et du modèle de données, puis raccordement des parcours fonctionnels.

Une attention particulière a été portée aux comportements réels du lecteur :
- le bouton de validation apparaît après la fin de la vidéo ;
- la validation entraîne automatiquement le passage au module suivant ;
- le module suivant démarre depuis le début ;
- les modules verrouillés ne sont pas accessibles directement ;
- l'état du sélecteur de modules suit le module réellement consulté.

Les états de chargement et les erreurs ont également été travaillés, notamment parce que les différences de latence entre le développement local et la production étaient visibles.

La bibliothèque et les favoris ont été mis en cache côté frontend afin de réduire certaines requêtes répétées. Les données utilisateur sont également préchargées après l'authentification.

### Itérations et Git

Le développement a suivi des itérations courtes avec des commits ciblés, notamment avec les préfixes `feat:`, `fix:`, `perf:` et `docs:`. Les corrections de progression, d'authentification, de chargement, de production et de performance ont ainsi été isolées dans des commits lisibles et traçables.

## 5. Tests et validation

La validation a principalement été réalisée par des tests fonctionnels manuels au fur et à mesure du développement.

Les principaux cas vérifiés sont :
- inscription, connexion, session et déconnexion ;
- accès aux pages protégées avec et sans session ;
- recherche par titre ou formateur ;
- filtres langue et niveau ;
- pagination et tri de la bibliothèque ;
- inscription à une formation ;
- distinction entre démarrage, reprise et consultation d'une formation ;
- accès au lecteur uniquement lorsque les conditions d'accès sont respectées ;
- blocage d'un module verrouillé ;
- lecture vidéo, pistes audio et sous-titres ;
- affichage de la validation uniquement après la fin de la vidéo ;
- validation d'un module et passage automatique au suivant ;
- calcul et affichage de la progression ;
- ajout et retrait des favoris.

Le projet a aussi été construit et exécuté avec Docker Compose afin de vérifier l'initialisation de PostgreSQL, de Prisma, du seed et le démarrage des services.

Enfin, la version déployée a été testée avec le frontend, l'API et la base de production afin de détecter les problèmes qui n'apparaissaient pas en local.

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
- vérification de l'inscription à une formation avant l'enregistrement de la progression.

Le frontend ne considère pas la simple présence d'une donnée d'interface comme une autorisation : les opérations sensibles sont également contrôlées par l'API.

## 7. Déploiement

### Développement local

L'ensemble de la plateforme peut être lancé avec :

```bash
docker compose up --build
```

Le frontend est servi sur le port 8080 et l'API sur le port 3000.

### Production

La production utilise :
- **Vercel** pour le frontend ;
- **Render** pour l'API Express ;
- **Supabase** pour PostgreSQL.

Frontend : `https://elearning-kappa-one.vercel.app`

API : `https://elearning-05hx.onrender.com`

Cette séparation permet de déployer indépendamment l'interface, l'API et la base de données tout en conservant une architecture simple.

## 8. Retour d'expérience

Le principal enjeu a été de trouver un équilibre entre le périmètre demandé, la qualité de l'interface et le délai de 72 heures. Plusieurs problèmes rencontrés en production ont également obligé à distinguer les problèmes purement fonctionnels des problèmes d'environnement.

### Initialisation de la base en production

L'API pouvait démarrer alors que les tables PostgreSQL n'étaient pas encore présentes, ce qui provoquait des erreurs lors de l'appel au catalogue.

Une première tentative d'exécuter plusieurs commandes Prisma et le démarrage du serveur directement dans la configuration Render n'a pas fonctionné correctement. L'initialisation a finalement été déplacée dans le démarrage du conteneur afin que le schéma soit synchronisé et que le seed soit exécuté avant le lancement de l'API.

### Configuration CORS

Le frontend de production appelait l'API depuis un domaine Vercel stable, tandis qu'une configuration CORS pointait vers une autre URL de déploiement. Le navigateur bloquait alors les requêtes.

La configuration a été corrigée pour utiliser le domaine frontend de production comme origine autorisée. Cette vérification a permis de valider séparément le fonctionnement de l'API et la communication frontend/API.

### Différences de performance entre local et production

L'écart de vitesse entre l'environnement local et la version déployée est très net : l'application est sensiblement plus réactive en local, tandis que certaines interactions prennent davantage de temps en production.

Une première optimisation ciblée a consisté à précharger et mettre en cache certaines données utilisateur afin de limiter les requêtes répétées. Cette optimisation améliore certains parcours sans modifier l'architecture générale.

Une optimisation plus globale des performances reste volontairement identifiée comme travail futur. Elle pourra notamment porter sur les requêtes API, la quantité de données chargées, le regroupement de certaines requêtes, la stratégie de cache et les temps de réponse de l'infrastructure distante. Ces améliorations n'ont pas été introduites à la fin du délai afin d'éviter de déstabiliser une application déjà fonctionnelle.

### Validation Docker

Le projet a également été testé depuis un environnement Docker Compose propre, avec reconstruction des images et réinitialisation du volume PostgreSQL. Le parcours principal — démarrage des services, connexion, consultation du catalogue, apprentissage et progression — a été vérifié avec succès.

## 9. Limites et améliorations futures

Les principales améliorations prévues sont :
- optimiser les performances de production et réduire la latence des requêtes API ;
- rendre les requêtes API moins gourmandes et regrouper certaines données pour réduire la quantité de données transférées ;
- renforcer les tests automatisés ;
- mettre en place une véritable gestion des emails, notamment la vérification d'adresse et la récupération de mot de passe ;
- utiliser des médias distincts pour chaque module ;
- ajouter les bonus restants, notamment les quiz et une administration plus complète ;
- poursuivre l'optimisation du cache et des chargements côté frontend.

Ces évolutions n'ont pas été intégrées au détriment des fonctionnalités principales, afin de respecter le délai et de conserver une base fonctionnelle et démontrable.

## Méthode de travail

Ce projet a été réalisé avec l'assistance d'un outil d'IA (GPT). J'ai conçu l'application, pris les décisions techniques, puis relu, testé et corrigé le code.
