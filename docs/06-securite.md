# 6. Sécurité

Les mots de passe sont stockés sous forme de hash et les sessions utilisent un JWT.

Les routes nécessitant une session vérifient le token côté API. Une formation peut être consultée publiquement, mais les URLs vidéo et audio sont retirées de la réponse lorsqu'un utilisateur n'est pas inscrit à la formation.

Les variables sensibles sont externalisées via l'environnement et un fichier `.env.example` est fourni.
